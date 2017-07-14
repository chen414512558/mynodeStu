const mysql = require('mysql');
const http = require('http');
const qs = require('querystring');

class Work {
    constructor() {

    }

    renderHtml(res, html) {
        res.setHeader('content-type', 'text/html');
        res.setHeader('content-length', Buffer.byteLength(html));
        res.end(html);
    }

    parseReceiveData(req, cb) {
        let body = '';
        req.setEncoding('utf8');
        req.on('data', (chunk)=>{
            body += chunk;
        });
        req.on('end', ()=>{
            let data = qs.parse(body);
            cb && cb(data);
        });
    }

    actionForm (id, path, label) { 
        var html = '<form method="POST" action="' + path + '">' +
            '<input type="hidden" name="id" value="' + id + '">' +
            '<input type="submit" value="' + label + '" />' +
            '</form>';
        return html;
    };

    add() {

    }

    delete() {

    }

    archive() {
        
    }
}


let db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'test',
    password: 'chenzihui123',
    database: 'test',
});

let server = http.createServer((req, res)=>{
    switch (req.method) {
        case 'POST':
            switch (req.url) {
                case '/':
                    
                break;
                case '/archive':
                break;
                case '/delete':
                break;
            }
        break;
        case 'GET':
            switch (req.url) {
                case '/':
                    
                break;
                case '/archive':
                break;
            }
        break;
    }
});

db.query(
  "CREATE TABLE IF NOT EXISTS work (" 
  + "id INT(10) NOT NULL AUTO_INCREMENT, " 
  + "hours DECIMAL(5,2) DEFAULT 0, " 
  + "date DATE, " 
  + "archived INT(1) DEFAULT 0, " 
  + "description LONGTEXT,"
  + "PRIMARY KEY(id))",
  function(err) { 
    if (err) throw err;
    console.log('Server started...');
    server.listen(3000, '127.0.0.1'); 
  }
);
