// Imports
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const key = path.resolve(__dirname, './security/cert.key');
const cert = path.resolve(__dirname, './security/cert.pem');

// Files
var privateKey = fs.readFileSync(key);
var certificate = fs.readFileSync(cert);
var credentials = { key: privateKey, cert: certificate };

// Index/App
const app = require('../../index');

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// For http
httpServer.listen(8080);

// For https
httpsServer.listen(5000);