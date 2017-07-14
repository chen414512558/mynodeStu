const flow = require('nimble');

flow.series([
    (cb)=>{
        setTimeout(()=>{
            console.log('1');
            cb();
        }, 1000);
    },
    (cb)=>{
        setTimeout(()=>{
            console.log('2');
            cb();
        }, 500);
    },
    (cb)=>{
        setTimeout(()=>{
            console.log('3');
            cb();
        }, 100);
    },
]);