const fs = require('mz/fs');
const request = require('request');
const htmlparser = require('htmlparser');
let configFileName = './rss.txt';

async function checkFile(file) {
    try {
        if (await fs.exists(file)) {
            next(null, file);
        }
    } catch (error) {
        next(error);
    }
}

async function readFile(file) {
    try {
        let feedList  = await fs.readFile(file);
        if (feedList) {
            feedList = feedList.toString().replace('/^\s+|\s+$/g').split('\n');
            let romdom = Math.floor(Math.random() * feedList.length);
            next(null, feedList[romdom]);
        } else {
            next(new Error(`readFile${file} is error`));
        }
    } catch (error) {
        next(error);
    }
}

function downFeed(url) {
    request({uri: url}, (err, res, body)=>{
        if (err) {
            next(err);
        }
        if (res.statusCode !== 200) {
            next(new Error('bushi 200'));
        }
        next(null, body);
    });
}

function parseBody(body) {
    let handler = new htmlparser.RssHandler();
    let parser = new htmlparser.Parser(handler);
    parser.parseComplete(body);
    if (!handler.dom.items.length)
    return next(new Error('No RSS items found'));

    let item = handler.dom.items.shift();
    console.log(item);
    console.log(item.title);
    console.log(item.link);
}





let task = [
    checkFile, 
    readFile,
    downFeed,
    parseBody
];

function next(err, result) {
    if (err) {
        throw err;
    }
    let currentTask = task.shift();
    if (currentTask) {
        currentTask(result);
    }
}

next(null, configFileName);