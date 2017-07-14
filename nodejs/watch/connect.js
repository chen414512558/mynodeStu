const connect = require('connect');
// const cookieparser = require('cookieparser');
let app = connect();
app.use(logger);
// app.use(cookieparser('chenzihui'));
// app.use(restrict);
app.use(hello);
app.use(errHandler());
app.listen(3000);
console.log(connect.errHandler);
async function logger(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    await next();
}

async function hello(req, res, next) {
    res.setHeader('content-type', 'text/plain');
    res.end('helo');
    await next();
}

async function restrict(req, res, next) {
    let authorization = req.headers.authorization;
    if (!authorization) {
        return await next(new Error('notAuthorization'));
    }
    let parts = authorization.split(' ');
    let scheme = parts[0];
    let auth = new Buffer(parts[1], 'base64').toString().split(':');
    let user = auth[0];
    let pass= auth[1];
    console.log(user, pass);
    await next();
}

function errHandler() {
    let env = process.env.NODE_ENV || 'development';
    return async (err, req, res, next)=>{
        res.statusCode = 500;
        switch (env) {
            case 'development':
                console.log(JSON.stringify(err));
                res.end(err.toString());
                break;
            default:
                res.end('server error');
                break;
        }
    }
}