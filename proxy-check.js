const ProxyVerifier = require('proxy-verifier');

// Daftar proxy yang akan diperiksa
const proxies = [
  {
    ip: '209.38.227.224',
    port: '8080',
    protocols: ['http', 'https']
  },
  // Tambahkan daftar proxy lain di sini
];

// Fungsi untuk memeriksa setiap proxy
function verifyProxy(proxy) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(proxy.protocols)) {
      reject(new Error('Invalid "protocols" attribute: Array expected.'));
      return;
    }

    ProxyVerifier.testAll(proxy, { testUrl: 'http://www.google.com', protocols: proxy.protocols }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Fungsi utama untuk melakukan pengecekan proxy
async function checkProxies() {
  try {
    for (const proxy of proxies) {
      const result = await verifyProxy(proxy);
      console.log(`Proxy ${proxy.ip}:${proxy.port} status:`);
      console.log(`  - HTTP: ${result.http && result.http.ok ? 'Working' : 'Not Working'}`);
      console.log(`  - HTTPS: ${result.https && result.https.ok ? 'Working' : 'Not Working'}`);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Panggil fungsi untuk memulai pengecekan proxy
checkProxies();
