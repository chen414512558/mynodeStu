const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');

client.on('error', (err)=>{
    console.log(err);
});

client.set('color', 'red', redis.print);
client.get('color', (err, value)=>{
    console.log('get', value);
});