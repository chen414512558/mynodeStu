const mongodb = require('mongodb');
const server = new mongodb.Server('127.0.0.1', 27017, {});
let client = new mongodb.Db('mydatabase', server, {w: 1});

client.open((err)=>{
    client.collection('test', (err, collection)=>{
        console.log('adadasdadas');
        // collection.insert(
        //     {"title": 'i lick', 'body': 'it is quite good'},
        //     { safe: true },
        //     (err, document)=>{
        //         if (err) {
        //             console.log(err);
        //             return;
        //         }
        //         console.log(document);
        //     }
        // );
        // let _id = new client.bson_serializer.ObjectID('5964a6ea6fba6297e3d2bea2');
        // collection.update(
        //     {_id},
        //     {$set: {"title": '我不是大爷'}},
        //     {safe: true},
        //     (err, doc)=>{
        //         console.log(doc);
        //     }
        // );
        collection.find({}).toArray((err, ret)=>{
            console.log(ret);
        });

    });
});