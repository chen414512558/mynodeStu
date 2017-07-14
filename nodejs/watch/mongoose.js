const mongoose = require('mongoose');
let url = 'mongodb://localhost/test';
let db = mongoose.connect(url);

let Schema = mongoose.Schema;
let Tasks = new Schema({
    project: String,
    description: String,
});

mongoose.model('Task', Tasks);
let Task = mongoose.model('Task');
// let task = new Task();
// task.project = 'chenzihui';
// task.description = '这是一个模拟的项目';
// task.save((err)=>{
//     if (err) {
//         throw err;
//     }
//     console.log('task ok');
// });

// Task.find({'project': 'chenzihui'}, (err, ret)=>{
//     console.log(ret);
// });

Task.update(
    {'project': 'chenzihui'}, 
    {'description': '我曹'},
    {multi: false},
    (err, row_updates)=>{
        console.log(row_updates);
    }
);

mongoose.disconnect();

