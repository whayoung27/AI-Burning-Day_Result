const { Room, User, ImageInfo, GameData } = require('../models');

const findRoom = async (code) => {
    const existingRoom = await Room.findAll({where: {code: code}});
    console.log('result: ', existingRoom);

    if(existingRoom.length > 0) {
        return true;
    } else {
        return false;
    }
}

const addRoom = async (code) => {
    const result = await Room.create({code: code});
    return result;
}

const addUser = async (name, roomCode) => {
    const result = await User.create({name: name, roomCode: roomCode});
    return result;
}

const findUser = async (name, roomCode) => {
    const existingUser = await User.findAll({ where: {name: name, roomCode: roomCode} });

    if(existingUser.length > 0) {
        return true;
    } else {
        return false;
    }
}

// const getUserNumInRoom = async (roomCode) => {
//     const result = await User.findAndCountAll({ where: {roomCode: roomCode} });
//     console.log(result.count);
//     return result.count;
// }

const getUsersInRoom = async (roomCode) => {
    const result = await User.findAll({ where: {roomCode: roomCode} });
    console.log(result);
    return result;
}

const getReadyUsersInRoom = async (roomCode) => {
    const result = await User.findAll({ where: {roomCode: roomCode, isReady: true} });
    console.log(result);
    return result;
}

const setRoom = async (roomCode, round, time) => {
    const result = await Room.update( {round: round, time: time}, { where: {code: roomCode} });
    return result;
}

const getRoomSetting = async (roomCode) => {
    const result = await Room.findOne({ where: {code: roomCode} });
    return result;
}

const setUserScore = async (name, roomCode, score) => {
    const result = await User.update( {score: score}, { where: {name: name, roomCode: roomCode} });
    return result;
}

const getUserScore = async (name, roomCode) => {
    const result = await User.findOne( { where: {name: name, roomCode: roomCode} });
    return result;
}

const getAnswerList = async (roomCode) => {
    const result = await ImageInfo.findAll({ where: {roomCode: roomCode} });
    let imageList = [];
    for(var i=0; i<result.length; i++) {
        const object = {
            name: result[i].dataValues.name,
            imageName: result[i].dataValues.imageName
        };
        imageList.push(object);
    }
    console.log(imageList);
    let answerList = [];
    for(var i=0; i<result.length; i++) {
        const result2 = await GameData.findAll({ where: {imageName: imageList[i].imageName} });
        const object = {
            name: imageList[i].name,
            answerAuto: result2[0].dataValues.answerAuto,
            base64Img: result2[0].dataValues.base64Img
        };
        answerList.push(object);
    }
    console.log(answerList.length);
    return answerList;
}

const deleteRoom = async (roomCode) => {
    const result = await Room.destroy({ where: {code: roomCode} });
    return result;
}

const deleteUser = async (name, roomCode) => {
    const result = await User.destroy({ where: {name: name, roomCode: roomCode}});
    return result;
}

const insertImg = async (name, roomCode, imageName, base64Img, answerAuto) => {
    const result1 = await ImageInfo.create({name: name, roomCode: roomCode, imageName: imageName});
    const result2 = await GameData.create({imageName: imageName, answerAuto: answerAuto, base64Img: base64Img});
}

const isGameStart = async (roomCode) => {
    const result = await Room.findOne({ where: {code: roomCode} });
    console.log(result.dataValues);
    if(result.dataValues.gameStart) {
        console.log('true: ', result.dataValues.gameStart)
        return true;
    } else {
        console.log('false: ', result.dataValues.gameStart);
        return false;
    }
}

const dbUpdateLabel = async (isAuto, answerManu, imageName) => {
    const result = await GameData.update( {isAuto: isAuto, answerManu: answerManu}, { where: {imageName: imageName} } );
    return result;
}

const setUserReady = async (name, roomCode, ready) => {
    const result = await User.update( {isReady: ready}, { where: {name: name, roomCode: roomCode} });
    return result;
}

const setGameStart = async (roomCode, start) => {
    const result = await Room.update( {gameStart: start}, { where: {code: roomCode} });
    return result;
}

module.exports = { findRoom, addRoom, addUser, findUser, getUsersInRoom, getReadyUsersInRoom, setRoom, getRoomSetting, setUserScore, getUserScore, deleteRoom, deleteUser, insertImg, isGameStart, dbUpdateLabel, setUserReady, setGameStart, getAnswerList };