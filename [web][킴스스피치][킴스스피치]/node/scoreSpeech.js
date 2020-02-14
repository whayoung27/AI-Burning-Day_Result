import { resolve } from "dns";

const fs = require("fs");
const request = require("request");
const scoreString = require("./scoreString");

const clientId = "uuaikfob89";
const clientSecret = "IPPz7x71P0h7MSpBJ5oZTSticfSFrkPbVXAeyPpQ";

// language => 언어 코드 ( Kor, Jpn, Eng, Chn )
function scoreSpeech(language, filePath, originalString, script_id, sentence_id, is_pracice) {
  const url = `https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=${language}`;
  const requestConfig = {
    url: url,
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "X-NCP-APIGW-API-KEY-ID": clientId,
      "X-NCP-APIGW-API-KEY": clientSecret
    },
    body: fs.createReadStream(filePath)
  };

  return new Promise(resolve=>{
    request(requestConfig, (err, response, body) => {
      if (err) {
        console.log(err);
        return;
      }
  
      console.log(response.statusCode);
      // console.log(body);
      console.log(typeof JSON.parse(body).text);
      console.log(JSON.parse(body).text);
      var result = scoreString(
        JSON.parse(body).text, // spokenString
        originalString, // originalString
        0.5, // accuracyLimit
        3, // grouping
        5, // scope
        script_id,
        sentence_id,
        is_pracice
      );
      console.log(result);
      resolve(result);
    });
  }) 
}

export default scoreSpeech;

// var sttResult = scoreSpeech(
//   "Eng",
//   "./음성 332.m4a",
//   "Your time is limited, so don’t waste it living someone else’s life"
// );
