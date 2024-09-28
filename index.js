const config = require('./config.json');
const { config: { port } = config;
const http = require('http');
const httpProxy = require('http-proxy');
const express = require('express');
const proxy = httpProxy.createProxyServer({});
const server = express();

server.use((req, res, next) => {
    const target = req.url.replace('https://discovery.olv.nintendo.net', 'https://discovery.olv.innoverse.club');
    req.url = target;

    console.log(`Proxying request to: ${req.url}`);

    next();
});

server.use((req, res) => {
    proxy.web(req, res, { target: req.url }, (err) => {
        if (err) {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy error');
        }
    });
});

async function main() {
    const https = http.createServer(app);
    https.listen(port, () => {
        console.log(`Proxy server is running on port ${port}`);
    });
}

main().catch(console.error);
