const fs = require("fs");
const request = require("request");

const clientId = "uuaikfob89";
const clientSecret = "IPPz7x71P0h7MSpBJ5oZTSticfSFrkPbVXAeyPpQ";

// language => 언어 코드 ( Kor, Jpn, Eng, Chn )
function stt(language, filePath) {
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

  request(requestConfig, (err, response, body) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(response.statusCode);
    console.log(body);
  });
}
//blob:https://www.youtube.com/d901b9e0-0f40-49fd-85e2-6c47e9a8c972
//blob:https://www.youtube.com/26d57f7a-db49-4888-aba9-ad4a40920775
stt("Eng", "./음성 332.m4a");
