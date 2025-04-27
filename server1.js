const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

const server = http.createServer((req, res) => {
  const dataFile = path.join(__dirname, 'users.json');
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]));
  }

  // Handle GET request to /users
  if (req.method === 'GET' && req.url === '/users') {
    const users = fs.readFileSync(dataFile);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(users);
    return;
  }

  // Handle POST request to /register
  if (req.method === 'POST' && req.url === '/register') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const username = params.get('username');
      const email = params.get('email');

      let users = JSON.parse(fs.readFileSync(dataFile));
      users.push({ username, email });
      fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>Registration successful!</h1><a href="/">Back</a>');
    });
    return;
  }

  // Serve static files
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  const extname = path.extname(filePath);
  let contentType = 'text/plain';
  switch (extname) {
    case '.html':
      contentType = 'text/html';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});