const events = require('events');
const util = require('util');
const fs = require('mz/fs');

class Watcher extends events.EventEmitter {
    constructor(watchDir, processDir) {
        super();
        this.watchDir = watchDir;
        this.processDir = processDir;
        this.init();
    }

    async watch() {
        try {
           let files = await fs.readdir(this.watchDir);
           files.forEach((file)=>{
               this.emit('process', file);
           })
        } catch (error) {
            // console.log(error);
        }
    }

    start() {
        fs.watch(this.watchDir, ()=>{
            this.watch();
        })
    }

    init() {
        this.on('process', (file)=>{
            let watch = this.watchDir + '/' + file;
            let proc = this.processDir + '/' + file.toLowerCase();
            fs.rename(watch, proc, (err)=>{
                console.log(err);
            });
        })
    }


}

let w = new Watcher('./watch', './done');
w.start();