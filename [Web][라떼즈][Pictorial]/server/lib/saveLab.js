/*
    기능 
        사용자가 선택한 정보를 db에 저장
    결과 

    주의 사항
        sequelize 사용법 주의 
*/

var db = require('./db'); // dbUpdateLabel, 

module.exports = (req, res, next) =>{
    console.log('saveLab is called!');
    let body="";
    req.on('data', (data)=>{   // json 결과 값 불러오기
        body += data;
    });
    req.on('end', ()=>{   // json 결과 값 불러오기
        // body = JSON.parse(body);
        /*
        db.dbUpdateLabel(
            req.body.isAuto,
            req.body.answerManu,
            req.body.imageName
        );
        */
    });

    next();
};