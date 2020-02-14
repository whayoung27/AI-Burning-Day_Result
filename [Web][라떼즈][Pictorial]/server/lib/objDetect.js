/*
    기능 : 
        upload 콜백 함수가 만든 req.file을 base64 인코딩 후 req.body.encodedImg에 저장
    결과 :
        req.body.objDetect 추가 
*/
/* module */
var fs = require('fs');
var path = require('path');         // make path
var request = require('request');

/* variables */
var client_id = 'gm1eyl4dop';
var client_secret = process.env.API_KEY;
var api_url = 'https://naveropenapi.apigw.ntruss.com/vision-obj/v1/detect'; // 객체 인식 NCP api
var parentPath = path.normalize(__dirname+"/..");
var imagePath = path.normalize(parentPath + "/public/images")

module.exports = (req, res, next) =>{
    console.log('objDetect is called!');
    
    var body='';        // json 파일 적용
    var _formData = {   // FILE을 stream 형태로 지정
        image: fs.createReadStream(path.join(imagePath, req.file.filename))
    };
    var _req = request.post({   // 이미지 요청 request 객체 생성 및 post 정의 
        url:api_url, 
        formData:_formData,
        headers: {
            'X-NCP-APIGW-API-KEY-ID':client_id, 
            'X-NCP-APIGW-API-KEY': client_secret
        }
    })

    _req.on('data', (data)=>{   // json 결과 값 불러오기
        body += data;
    });

    _req.on('end', ()=>{    // 결과를 모드 받은 경우 
        /* 탐지된 객체 request 전달 */ 

        // 1. 원본 json 전달 
        let objDetect_json = JSON.parse(body);
        req.body.objDetect_json = objDetect_json;  // 원본 json  
        req.body.objDetect_str = body;   // 원본 str
        
        // 2. 객체별 배열 저장 
        let numOfObj = req.body.objDetect_json.predictions[0].num_detections;        // 탐지한 객체 수
        let predictions = req.body.objDetect_json.predictions[0];                    // 예측 결과 객체
        let objDetect_each = new Array();                                         // 탐지한 객체 별로 분류된 객체 배열 
        
        /* 탐지된 객체별로 배열에 저장 */
        for(let i=0; i<numOfObj; i++){
            objDetect_each.push({
                detection_classes:predictions.detection_classes[i],
                detection_names:predictions.detection_names[i],
                detection_boxes:predictions.detection_boxes[i],
                detection_scores:predictions.detection_scores[i]
            });
        }
        req.body.objDetect_each = objDetect_each; 
        next();    
    }); 
};