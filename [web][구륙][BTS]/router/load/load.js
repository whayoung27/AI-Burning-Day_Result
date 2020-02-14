var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
const { PythonShell } = require('python-shell');
var async = require("async");

router.get('/moreload', function (req, res) {
  var url = req.query.url;
  res.render('load_script.ejs', { 'isEnd': 'false', 'youtube_url': url });
})

router.post('/begin', function (req, res) {
  var url = req.body;
  console.log(url);

  // 영상 아이디 추출
  getIdfromUrl(url.youtube_url, function (video_id) {
    if (video_id == null) {   // id 가 없어. 비디오를 못 찾아.
      res.status(401).send("<script>alert(\"No Video\"); location.href = \"/\";</script>");
    }
    else {
      res.render('load_script.ejs', { 'isEnd': 'false', 'youtube_url': url.youtube_url });

      console.log("python code start");
      // 파이썬 코드 호출 > 아웃풋으로 (시간, 번역) 리스트 파일 생성
      var options = {
        mode: 'text',
        scriptPath: path.join(__dirname, '../../pythonModule'),
        args: [video_id]
      };
      PythonShell.run('SBD.py', options, function (err, results) {
        if (err) console.log(err);
        else console.log("python success");
      })
    }

  });
})

router.get('/end', function (req, res) {
  res.render('load_script.ejs', { 'isEnd': 'true' });
})

// Return id of video
function getIdfromUrl(urlstr, cb) {
  urlstr = urlstr + "";
  var usp = new URLSearchParams(urlstr.substring(urlstr.indexOf("?")));
  var id = usp.get("v");
  console.log("YouTube id : "  + id);
  
  cb(id);
}

module.exports = router;
