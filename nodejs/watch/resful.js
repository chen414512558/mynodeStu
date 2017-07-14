const http = require('http');
const url = require('url');
let items = [];

let server = http.createServer((req, res)=>{
    switch (req.method) {
        case 'POST':
            let item = '';
            req.setEncoding('utf8');
            req.on('data', (chunk)=>{
                item += chunk;
            });
            req.on('end', ()=>{
                items.push(item);
                res.end('ok\n');
            })
        break;
        case 'GET':
            items.forEach((item, index)=>{
                res.write(`${index} ) ${item}\n`);
            });
            res.end();
        break;
    }
});

server.listen(3000);