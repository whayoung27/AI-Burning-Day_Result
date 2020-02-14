// 네이버 음성합성 Open API 예제
var express = require("express");
var app = express();
var client_id = "uuaikfob89";
var client_secret = "IPPz7x71P0h7MSpBJ5oZTSticfSFrkPbVXAeyPpQ";
var fs = require("fs");
app.get("/tts", function(req, res) {
  var api_url = "https://naveropenapi.apigw.ntruss.com/voice/v1/tts";
  var request = require("request");
  var options = {
    url: api_url,
    form: {
      speaker: "clara",
      speed: "0",
      text:
        "relase, or not release. that's the problem."
    },
    headers: {
      "X-NCP-APIGW-API-KEY-ID": client_id,
      "X-NCP-APIGW-API-KEY": client_secret
    }
  };
  var writeStream = fs.createWriteStream("./obama.mp3");
  var _req = request.post(options).on("response", function(response) {
    console.log(response.statusCode); // 200
    console.log(response.headers["content-type"]);
  });
  _req.pipe(writeStream); // file로 출력
  _req.pipe(res); // 브라우저로 출력
});
app.listen(3000, function() {
  console.log("http://127.0.0.1:3000/tts app listening on port 3000!");
});
