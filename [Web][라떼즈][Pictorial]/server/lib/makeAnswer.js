/*
    기능 
        objDetect가 추가한 req.body.objDetect를 인식한 객체별로 객체를 재배치하고 조건에 맞는 정답을 생성한다.
    결과 
        req.body.detectedObjs = detectedObjs;   // 탐지한 모든 객체 배열
        req.body.possibles = possibles;         // 가능한 정답들의 배열
        req.body.answers = answers;            // 이미지의 정답 
            
    주의 사항
        1) objDetect 콜백 함수가 호출된 이후 호출할 것. 
        2) 어떤 정답들이 answers로 들어갈지 조건을 추가할 것. 
*/

function getRandomInt(min, max) { //min ~ max 사이의 임의의 정수 반환
    let rand = Math.floor(Math.random() * (max - min)) + min;
    if(rand===max) rand--;
    return rand;
}

module.exports = (req, res, next) =>{
    console.log('refacDetect is called!'); 
    var objDetect_each = req.body.objDetect_each;

    /* 적합한 이미지 찾기 */
    let numOfClasses = new Array(81);
    for(let i=0; i<numOfClasses.length; i++){
        numOfClasses[i] = 0;
    }
    for(let i=0; i<objDetect_each.length; i++){  
        numOfClasses[objDetect_each[i].detection_classes]++; // 중복된 객체 클래스 카운팅
    }

    /* 가능한 정답들 생성 */
    let possibles = new Array();
    for(let i=0; i<objDetect_each.length; i++){  
        if(numOfClasses[objDetect_each[i].detection_classes]===1){    // 조건 1. 동종 객체가 없는 객체만 가능한 정답으로 추가 
            possibles.push(objDetect_each[i]);
        }
    }
    
    /* 정답 생성 */
    let answer;
    if(possibles.length>0)  {
        answer = possibles[getRandomInt(0, possibles.length)];
    }

    /*에러 처리 */
    if(possibles.length<1){ // 동종 객체가 1개 이하일 경우       
        console.log('error is called!')
        res.status(400).json({message:"정답 1개 미만"});
    }
    /* request 처리  */
    else { 
    req.body.possibles = possibles;         // 가능한 정답들의 배열
    req.body.answer = answer;             // 이미지의 정답 
    next();
    }
};