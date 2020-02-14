const socketio = require('socket.io');
const db = require('./db');

module.exports = (server, app, sessionMiddleware) => {
    const io = socketio(server);

    app.set('io', io);
    const room = io.of('/room');
    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    room.on('connect', (socket) => {
        console.log('socket.io room connected!');
        const req = socket.request;

        socket.on('join', async (name, code) => {
            console.log('room join!');
            
            socket.emit('message', { text: `Welcome to the room ${code}!`});
            socket.broadcast.to(code).emit('message', { text: `${name}, has joined!`});

            socket.join(code);

            req.session.userName = name;
            req.session.roomCode = code;
            console.log(req.session.userName, req.session.roomCode);

            // socket - userList return
            const result = await db.getUsersInRoom(code);
            let userList = [];
            for(var i=0; i<result.length; i++) {
                userList.push(result[i].dataValues);
            }
            room.to(code).emit('userData', { userList: userList });
            
            const data = await db.getRoomSetting(code);
            room.to(roomCode).emit('roomData', { roomData: data.dataValues });
        });

        socket.on('setRoom', async (roomCode, round, time) => {
            const result = await db.setRoom(roomCode, round, time);
            const data = await db.getRoomSetting(roomCode);

            room.to(roomCode).emit('roomData', { roomData: data.dataValues });
        });

        socket.on('setGameStart', async (roomCode, start) => {
            const result = await db.setGameStart(roomCode, start);
            const data = await db.getRoomSetting(roomCode);

            room.to(roomCode).emit('roomData', { roomData: data.dataValues });
        });

        socket.on('ready', async (name, roomCode) => {
            // DB
            const ready = await db.setUserReady(name, roomCode, true);

            // ready userList
            const result = await db.getReadyUsersInRoom(roomCode);
            let userList = [];
            for(var i=0; i<result.length; i++) {
                userList.push(result[i].dataValues);
            }
            room.to(roomCode).emit('readyUserData', { userList: userList });
        });

        socket.on('score', async (name, roomCode, isCorrect, sec) => {
            // calculate score
            let score;
            if(isCorrect) {
                const room = await db.getRoomSetting(roomCode);
                const time = room.dataValues.time;
                score = (10-sec)*50;
                if(time === 3) {
                    score += 30;
                } else if(time === 5) {
                    score += 10;
                }
            } else {
                score = -50;
            }
            console.log('result score: ', score);

            // DB
            const user = await db.getUserScore(name, roomCode);
            const originalScore = user.dataValues.score;
            const updateScore = await db.setUserScore(name, roomCode, originalScore+score);

            // socket - updateScore return
            const result = await db.getUsersInRoom(roomCode);
            let userList = [];
            for(var i=0; i<result.length; i++) {
                userList.push(result[i].dataValues);
            }
            room.to(roomCode).emit('updateScore', { userList: userList });
        });

        socket.on('disconnect', async () => {
            console.log('room disconnected!');
            // DB 처리
            const name = req.session.userName;
            const roomCode = req.session.roomCode;

            socket.leave(roomCode);

            const deleteUser = await db.deleteUser(name, roomCode);
            const result = await db.getUsersInRoom(roomCode);
            if(result.length === 0) {
                const deleteRoom = await db.deleteRoom(roomCode);
            } else {
                let userList = [];
                for(var i=0; i<result.length; i++) {
                    userList.push(result[i].dataValues);
                }
                room.to(roomCode).emit('userData', { userList: userList });
            }
        }); 
    });
}