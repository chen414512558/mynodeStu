'use strict';
const http = require('http');
const fs = require('mz/fs');
const path = require('path');  
const mime = require('mime');
const chatServer = require('./lib/chat_server');
const cache = {}; 

function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error: 404');
    response.end();
}

function sendFile(res, filePath, fileContent) {
    res.writeHead(
        200, 
        {'content-type': mime.lookup(path.basename(filePath))}
    );
    res.end(fileContent);
}

async function serverStatic(res, cache, absPath) {
    if (cache[absPath]) {
        sendFile(res, absPath, cache[absPath]);
    } else {
        if (await fs.exists(absPath)) {
            try {
                let retFile = await fs.readFile(absPath);
                sendFile(res, absPath, retFile);
            } catch (error) {
                send404(res);
            }
            
        } else {
            send404(res);
        }
    }
}

const server = http.createServer((req, res)=>{
    let filePath = false;
    console.log(req.url);
    if (req.url == '/') {
        filePath = '/views/index.html';
    } else {
        filePath = `/${req.url}`;
    }
    let absPath = __dirname + filePath;
    serverStatic(res, cache, absPath);
});
server.listen(3000);
chatServer.listen(server);