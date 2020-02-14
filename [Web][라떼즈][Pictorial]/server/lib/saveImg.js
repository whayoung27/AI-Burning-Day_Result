/*
    기능 
        업로드한 이미지 정보를 DB에 저장
    결과 

    주의 사항
        sequelize 사용법 주의 
*/

var db = require('./db'); // imgInsert, 

module.exports = (req, res, next) =>{
    console.log('saveImg is called!');
  
    db.insertImg(
        req.body.name,          // 사용자 이름
        req.body.roomCode,      // 방 코드
        req.file.filename,      // 파일 이름(original 이름 아님)
        req.body.encodedImg,    // base64 형태의 image 데이터
        JSON.stringify(req.body.answer)         // 정답 json
    );

    next();
};