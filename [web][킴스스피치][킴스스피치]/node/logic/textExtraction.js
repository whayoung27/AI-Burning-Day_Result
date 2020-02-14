var fs = require("fs");
var pdfText = require("pdf-text");
var mammoth = require("mammoth");
var path = require("path");

// ******************************
// ******************************

var extractText = function(filePath, isAsync, returnType, callback) {
  var flagShowOnConsole = false;
  if (typeof filePath !== 'string') return;
  if(typeof isAsync !== 'boolean') return;
  returnType = returnType ? returnType : "array";
  callback = typeof callback === "function" ? callback : () => {};
  //   console.info(returnType);
var fileType;
    var fileExtension = path.extname(filePath);
  
  if(['.txt'].includes(fileExtension.toLowerCase())){
    if(isAsync){
      fs.readFile(filePath, function(err, buffer){
        
        var text = buffer.toString();
        if(returnType === 'array'){
          var returnVal = text.split('.').map(elem => elem.trim() + '.');
          flagShowOnConsole && console.info(returnVal)
          return callback(returnVal);
                    }else if(returnType === 'string'){
              var returnVal = text.split('.').map(elem => elem.trim() + '.').join(' ');
              flagShowOnConsole && console.info(returnVal)

              return callback(returnVal);
                        }
      })
    }else{
      var buffer = fs.readFile(filePath);
      var text = buffer.toString();
      text.split('.').map()
      if(returnType === 'array'){
    var returnVal = text.split('.').map(elem => elem.trim() + '.');
    flagShowOnConsole && console.info(returnVal)
    return callback(returnVal);
        }else if(returnType === 'string'){
        var returnVal = text.split('.').map(elem => elem.trim() + '.').join(' ');
        flagShowOnConsole && console.info(returnVal)
        return callback(returnVal);      }
    }
  }else  if (['.pdf'].includes(fileExtension)) {
    // pdf에서 텍스트 추출
    if (isAsync) {
      // async 방식

      var totalString = "";
      pdfText(filePath, function(err, chunks) {
        //chunks is an array of strings
        //loosely corresponding to text objects within the pdf
        //for a more concrete example, view the test file in this repo
        // console.log("#####################################");
        // console.log(chunks.join());
        

        if (returnType === "array") {
          var returnVal = chunks
            .join()
            .split(".")
            .map(elem => elem.trim() + ".");
            flagShowOnConsole && console.info(returnVal)
            return callback(returnVal);
        } else if (returnType === "string") {
          var returnVal = chunks.join();
          flagShowOnConsole && console.info(returnVal)
          return callback(returnVal);
          
        }
      });
    } else {
      // sync 방식
      var buffer = fs.readFileSync(filePath);
      pdfText(buffer, function(err, chunks) {
        // console.log(chunks.toString());
        
        var text = chunks.toString();
        
        if(returnType === 'array'){
          text = text.split('.').map(elem => elem.trim()+'.');
        }else if(returnType === 'string'){
          text = text.split('.').map(elem => elem.trim()+'.').join(' ');
        }
        var returnVal= text;

        return callback(returnVal);
      });
    }
  } else if (['.docx','.doc'].includes(fileExtension)) {
    // MS word 파일에서 텍스트 추출
    mammoth
      .extractRawText({ path: filePath })
      .then(function(result) {
        var text = result.value; // The raw text
        if (returnType === "array") {
          var returnVal = text.split(".").map(elem => elem.trim() + ".");
          flagShowOnConsole && console.info(returnVal)
          return callback(returnVal);
                } else if (returnType === "string") {
          var returnVal = text;
          flagShowOnConsole && console.info(returnVal)
          return callback(returnVal);
        }

        // console.log(text);
        // var messages = result.messages;
        // console.info("#### messages", messages);
      })
      .done();
  } else {
    console.info(fileExtension, fileType);
    console.info("지원하지 않는 파일 형식입니다.");
  }
};
// ******************************
// ******************************
exports.extractText = extractText;
// ******************************
// ******************************
// 테스트 용
var test1 = extractText(path.join(__dirname, "../testFiles/lorem_mspdf.pdf"), false, 'array', function(text){
  
  // console.info(text)
  // console.info()
  console.info('##########################')
  console.info('##########################')
  console.info('##########################')
  console.info('##########################')
try{
  console.info(text)
  console.info(text.length)
}catch(e){}
})

// console.info(test1.length)

// console.info(extractText(path.join(__dirname, "../testFiles/lorem_mspdf.pdf")));
// console.info(extractText(path.join(__dirname, "../testFiles/lorem.docx")));
