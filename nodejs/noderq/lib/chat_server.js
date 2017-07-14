const socketio = require('socket.io');
let io,
    guestNumber = 1,
    nickNames = {},
    namesUsed = [],
    currentRoom = {};

exports.listen = function (server) {
    io = socketio.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function (socket) {
        let i = 1;
        console.log(i++);
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        console.log(i++);
        joinRoom(socket, 'chen');
        console.log(i++);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        console.log(i++);
        handleMessageBroastcasting(socket);
        console.log(i++);
        changeRoom(socket);
        console.log(i++);
        handleClentDisconnection(socket, nickNames, namesUsed);
        console.log(i++);
    });
}

// 分配姓名
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    let name = 'guest' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {name: name, success: true});
    namesUsed.push(name);
    return guestNumber + 1;
}

// 进入房间
function joinRoom(socket, room) {
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {room: room});
    socket.broadcast.to(room).emit('message', {text: `${nickNames[socket.id]} has join ${room}`});
    // console.log(io.sockets.clients(room));
    // let usersInRoom = io.sockets.clients(room);
    // console.log(usersInRoom);
    let usersInRoomMsg = '';
    // if (usersInRoom.length > 1) {
    //     for (let index in usersInRoom) {
    //         let userSocketId = usersInRoom[index].id;
    //         if (index > 0) {
    //             usersInRoomMsg += ',';
    //         }
    //         usersInRoomMsg += nickNames[userSocketId];
    //     }
    // }
    // usersInRoomMsg += '.';
    // socket.emit('message', {text: usersInRoomMsg});
    
}

// 处理改变名字
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on('nameAttempt', function(name) {
        if (name.indexOf('guest') == 0) {
            socket.emit('nameResult', {success: false, message: '姓名不能以guest开头'});
        } else {
            if (namesUsed.indexOf(name) == -1) {
                let preName = nickNames[socket.id];
                let preIndexInUsed = namesUsed.indexOf(preName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                delete namesUsed[preIndexInUsed];
                socket.emit('nameResult', {success: true, name: name});
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {text: `${preName}改为${name}`});
            } else {
                socket.emit('nameResult', {success: false, message: '姓名已经存在'});
            }
        }
    });
}

// 处理发送请求
function handleMessageBroastcasting(socket) {
    socket.on('message', function (message) {
        socket.broadcast.to(message.room).emit('message', {text: `${nickNames[socket.id]}: ${message.text}`});
    });
}

// 改变房间
function changeRoom(socket) {
    socket.on('join', function (room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room.newRoom);
    })
}

// 处理断开连接
function handleClentDisconnection(socket, nickNames, namesUsed) {
    socket.on('disconnect', function () {
        let nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    })
}
