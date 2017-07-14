const fs = require('mz/fs');
let wordCount = {};
let tasks = [];
let comletedTasks = 0;

function checkIfComplete() {
    comletedTasks++;
    if (comletedTasks === tasks.length) {
       for (var key in wordCount) {
           console.log(key, wordCount[key]);
       }
    }
}

function parseText(file) {
    let words = file.toString().toLowerCase().split(/\W+/).sort();
    words.forEach(word=>{
        wordCount[word] = wordCount[word]? (wordCount[word] + 1): 1;
    });
}


(async ()=>{
    try {
        let files = await fs.readdir('./');
        if (files) {
            files = files.filter(file=>{
                return file.endsWith('.txt');
            });
            files.forEach(file=>{
                let task = ((file)=>{
                    return async ()=>{
                        let text = await fs.readFile(file);
                        if (text) {
                            parseText(text);
                            checkIfComplete();
                        }
                    }
                })('./' + file);
                tasks.push(task);
            });
            tasks.forEach(task=>{
                task();
            })
        }
    } catch (error) {
        console.log(error);
    }
})()