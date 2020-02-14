var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var fs = require('fs');
var segLineArray = [
  [],
  []
];

router.get('/', function (req, res) {
  console.log("service");
})

router.get('/:id', function (req, res) {
  var video_id = req.params.id;
  var file = path.join(__dirname, '../../pythonModule/subtitle', video_id + ".txt");

  // 파일 존재하는지 확인.
  if (!fs.existsSync(file)) {
    var url = "https://youtube.com/watch?v=" + video_id;
    res.redirect('/load/moreload?url=' + url);
  } else {
    findUserAndCallBack(video_id, function (lineArray) {
      // 한문장식 : 기준으로 분할
      for (var i = 0; i < lineArray.length; i++) {
        segLineArray[i] = lineArray[i].toString().split(':');
      }
      console.log(segLineArray);
      res.render('service.ejs', {
        'youtube_id': video_id,
        word: segLineArray
      })
    });
  }
})

// 동기식으로 파일 처리
function findUserAndCallBack(id, cb) {
  setTimeout(function () {
    console.log("waited 0.1 sec.");
    const article = fs.readFileSync(path.join(__dirname, '../../pythonModule/subtitle', id + ".txt"));
    var lineArray = article.toString().split('\n');
    console.log("lineArray : " + lineArray);
    cb(lineArray);
  }, 100);
}

module.exports = router;