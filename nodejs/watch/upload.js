const http = require('http');
const formidable = require('formidable');

let server = http.createServer((req, res)=>{
    switch (req.method) {
        case 'GET':
            show(req, res);
        break;
        case 'POST':
            upload(req, res);
        break;
       
    }
});
server.listen(3000);

function show(req, res) {
    let html = `
        <form action="/" method='post' enctype="multipart/form-data">
            <p><input name="name" type="text"/></p>
            <p><input name="file" type="file"/></p>
            <p><input value="upload" type="submit"/></p>
        </form>
    `;
    res.setHeader('content-type', 'text/html');
    res.setHeader('content-length', Buffer.byteLength(html));
    res.end(html);
}

function isFormData(req) {
    let type = req.headers['content-type'] || '';
    return 0 === type.indexOf('multipart/form-data');
}

function upload(req, res) {
    if (!isFormData(req)) {
        res.statusCode = 400;
        res.end('bad requst');
        return;
    }
    let form = new formidable.IncomingForm();
    form.on('field', (field, value)=>{
        console.log(field, value);
    });
    form.on('file', (name, file)=>{
        console.log(name, file);
    });
    form.on('progress', (bytesReceived, bytesExpected)=>{
        let percent = Math.floor(bytesReceived * 100 / bytesExpected);
        console.log(`当前完成${percent}%`);
    });
    form.on('end', (name, file)=>{
        res.end('upload complete');
    });
    form.uploadDir = './up';
    form.parse(req);
}