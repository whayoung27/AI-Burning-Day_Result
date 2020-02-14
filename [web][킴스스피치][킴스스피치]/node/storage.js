import { s3 } from "./index";
import { conn } from "./index";
import fs from "fs";
import request from "request"
import temp from "temp";


var client_id = "uuaikfob89";
var client_secret = "IPPz7x71P0h7MSpBJ5oZTSticfSFrkPbVXAeyPpQ";
var api_url = "https://naveropenapi.apigw.ntruss.com/voice/v1/tts";

const BUCKET_NAME = 'kims-speech';

export const uploadScriptMp3ToStorage = (sentence_values, script_id, LANGUAGE) => {
  console.log('upload to storage called');
  var setenceList = sentence_values.map(function(ele){return ele[1]});
  temp.track();
  
  var speaker;
  switch (LANGUAGE){
    case 'English':
      speaker = 'matt';
      break;
    case 'Japanese':
      speaker = 'shinji';
      break;
    case 'Chinese':
      speaker = 'liangliang';
      break;
    case 'Korean':
      speaker = 'jinho';
      break;
  }

  setenceList.forEach(function(sentence, idx){

    var options = {
      url: api_url,
      form: {
        speaker: speaker,
        speed: "0",
        text: sentence
      },
      headers: {
        "X-NCP-APIGW-API-KEY-ID": client_id,
        "X-NCP-APIGW-API-KEY": client_secret
      }
    };
    var writeStream = fs.createWriteStream(`./audioTemp/audio_${script_id}_${sentence_values[idx][3]}.mp3`);
    // var stream = temp.createWriteStream();

    var __promise = function(param){
      return new Promise(function (resolve, reject) {

        var _req = request.post(options).on("response", function(response) {
          console.log(response.statusCode); // 200
          console.log(response.headers["content-type"]);
        });
        _req.pipe(writeStream); // file로 출력
        // _req.pipe(stream); // file로 출력

        setTimeout(function () {

          // 파라메터가 참이면, 
          if (param) {

            resolve("업로드 완료");
          }

          else {
            reject("실패!!");
          }
        }, 2000);

    });
  };

    __promise(true)
    .then(function (text) {
      // 성공시
      console.log(text);


      var fileNameToSaveAs = `audio_${script_id}_${sentence_values[idx][3]}.mp3`;
      const fileContent = fs.readFileSync(`./audioTemp/audio_${script_id}_${sentence_values[idx][3]}.mp3`);
      // const fileContent = stream;

      const params = {
        Bucket: BUCKET_NAME,
        Key: fileNameToSaveAs,
        Body: fileContent
      };


      s3.upload(params, function(err, data) {
        if (err) {
          throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    
        console.log("File uploaded successfully.");
        console.log(`${data.Location}`);
        var dataLocationUrl = data.Location;

        var SQL = "UPDATE TB_MAP_SCRIPT_SENTENCE SET AUDIO_FILENAME = ? WHERE SCRIPT_ID = ? AND IDX_IN_SCRIPT = ?";
        conn.query(SQL, [data.Location, script_id, idx], (err, results, fields) => {
          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
          } else {
            console.log("audiofile url inserted");                       
          }
        });


        // return callback(dataLocationUrl);
  
        // fileContent.end();
        // stream.end();
      });
    }, function (text) {
      // 실패시
      console.log(text);
    });
     
    });
  
    console.log('upload to storage finished');
  };
  
  

  


