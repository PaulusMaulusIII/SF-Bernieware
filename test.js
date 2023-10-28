const http = require('http');
const fs = require('fs');
const port = 8080;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    } else if (req.method === 'POST' && req.url === '/submit') {
        let body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            const postData = JSON.parse(body);
            const name = postData.name;

            fs.appendFile('names.txt', name + '\n', (err) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false }));
                } else {
                    console.log(`Name "${name}" saved to names.txt`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                }
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
