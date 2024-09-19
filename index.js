const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
    if (req.headers.host === 'account.nintendo.net') {
        req.url = req.url.replace('account.nintendo.net', 'account.innoverse.club');
        req.headers.host = 'account.innoverse.club'; 
    }

    proxy.web(req, res, { target: `http://${req.headers.host}` }, (error) => {
        console.error('Error of the redirection:', error);
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Error of the redirection of the proxy.');
    });
});

const getLocalIPAddress = () => {
    const interfaces = require('os').networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const iface of interfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
};

const PORT = 8888;

server.listen(PORT, () => {
    const localIP = getLocalIPAddress();
    console.log(`Proxy started on ${localIP}:${PORT}`);
});
