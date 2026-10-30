const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Secure Web Proxy</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 400px; text-align: center; }
        input[type="text"] { width: 90%; padding: 10px; margin: 15px 0; border: 1px solid #ccc; border-radius: 4px; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>Secure Web Proxy</h2>
        <p>Browse the web privately through your cloud node.</p>
        <form action="/browse" method="GET">
          <input type="text" name="url" placeholder="https://example.com" required />
          <br>
          <button type="submit">Connect & Browse</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

app.get('/browse', (req, res, next) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('URL parameter is missing');

  let formattedUrl = targetUrl;
  if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
    formattedUrl = 'https://' + formattedUrl;
  }

  try {
    const proxy = createProxyMiddleware({
      target: formattedUrl,
      changeOrigin: true,
      secure: false,
    });
    return proxy(req, res, next);
  } catch (err) {
    res.status(500).send('Error routing through proxy: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
