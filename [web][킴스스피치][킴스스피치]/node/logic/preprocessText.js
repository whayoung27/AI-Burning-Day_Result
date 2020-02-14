// 문장(또는 단어)별로 <span> 태그를 씌움

var addSpanTag = function(scoredItemList) {
  // scoredSentences: [{elem: '이 문장은 20점입니다.', score: 20}, {elem: '이 문장은 정확히 발음해서 96점입니다.', score: 96}, ...]
  // scoredWords: [{elem: '단어1', score: 33}, {elem: '단어2', score: 77}, ...]

  for (var i = 0; i < scoredItemList.length; i++) {
    var item = scoredItemList[i];
    var sc = item.score;
    var className = "";
    if(sc<=10) className = "emph1";
    else if(sc<=20) className = "emph2";
    else if(sc<=30) className = "emph3";
    else if(sc<=40) className = "emph4";
    else if(sc<=50) className = "emph5";
    else if(sc<=60) className = "emph6";
    else if(sc<=70) className = "emph7";
    else if(sc<=80) className = "emph8";
    else if(sc<=90) className = "emph9";
    else className = "emph10";
    
    item.elem = '<span class="' + className + '">' + item.elem + "</span>";
  }
  // console.info(scoredItemList);
  return scoredItemList;
};

exports.addSpanTag = addSpanTag;


// 테스트용
  var fs = require('fs');
  var path = require('path')
  var textExtraction = require('./textExtraction.js');

  var test1 = textExtraction.extractText(path.join(__dirname, "../testFiles/lorem_mspdf.pdf"), false, 'array', function(text){
    
    // console.info(text)

    // 랜덤으로 점수 주기 (테스트용)
    var scoredList = [];
    for(var i = 0;i<text.length;i++){
      scoredList.push({
        elem: text[i],
        score: Math.floor(Math.random()*30) + 70,
      })
    }
  
    var list = addSpanTag(scoredList)
    console.info(list.map(elem => elem.elem).join(''))
  })

  // var test1 = extractText(path.join(__dirname, "../testFiles/lorem_mspdf.pdf"), false, 'array', function(text){
  
  //   console.info(text)
  // })