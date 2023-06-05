const express = require('express');
const ProxyVerifier = require('proxy-verifier');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/check', async (req, res) => {
  try {
    const proxies = req.body.proxies;

    const results = await Promise.all(
      proxies.map(async (proxy) => {
        const result = await verifyProxy(proxy);
        return {
          proxy: `${proxy.ip}:${proxy.port}`,
          http: result.http && result.http.ok ? 'Working' : 'Not Working',
          https: result.https && result.https.ok ? 'Working' : 'Not Working'
        };
      })
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

function verifyProxy(proxy) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(proxy.protocols)) {
      reject(new Error('Invalid "protocols" attribute: Array expected.'));
      return;
    }

    ProxyVerifier.testAll(proxy, { testUrl: 'https://www.google.com/humans.txt', protocols: proxy.protocols }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
