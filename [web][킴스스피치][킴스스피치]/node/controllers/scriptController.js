import { conn } from "../index";
import scoreSpeech from "../scoreSpeech";
import { uploadScriptMp3ToStorage } from "../storage";

export const scriptHome = (req, res) => {
  res.send("scriptHome");
};

export const getScriptList = (req, res) => {
  var SQL = "SELECT SCRIPT_ID, SCRIPT_NAME, LANGUAGE FROM TB_SCRIPT_MST";
  conn.query(SQL, function(err, results, fields) {
    if (err) {
      console.log(err);
      res.status(500), send("Internal Server Error");
    } else {
      console.log(results);
      res.send(results);
    }
  });
};
//async 왜쓰는지 찾아보기
export const scriptDetail = async (req, res) => {
  const {
    params: { id }
  } = req;

  try {
    var SQL = "SELECT A.SCRIPT_ID, A.SENTENCE, A.WRONG_COUNT, A.IDX_IN_SCRIPT, A.AUDIO_FILENAME, B.SCRIPT, B.SCRIPT_NAME, B.`LANGUAGE`, B.UPLOAD_TYPE FROM TB_MAP_SCRIPT_SENTENCE A JOIN TB_SCRIPT_MST B ON A.SCRIPT_ID = B.SCRIPT_ID WHERE A.SCRIPT_ID=?";
    conn.query(SQL, [id], function(err, results, fields) {
      if (err) {
        console.log(err);
        res.status(500), send("Internal Server Error");
      } else {
        console.log(results);
        res.send(results);
      }
    });
  } catch (err) {
    console.log(err);
  }
};



export const wrongSentence = (req, res) =>{

  var SQL = "SELECT SENTENCE FROM TB_MAP_SCRIPT_SENTENCE ORDER BY WRONG_COUNT DESC LIMIT 4";
  conn.query(SQL, function(err, results, fields) {
    if (err) {
      console.log(err);
      res.status(500), send("Internal Server Error");
    } else {
      console.log(results);
      res.send(results);

    }

});}



export const analysis = async(req, res) =>{

   const {
     params: { id }
   } = req;
   console.log(id);
  
  var SQL = "SELECT SCRIPT_ID, SCORE, DATE FROM TB_ANALYSIS WHERE SCRIPT_ID=? ";
  conn.query(SQL, [id],function(err, results, fields) {
    if (err) {
      console.log(err);
      res.status(500), send("Internal Server Error");
    } else {
      console.log(results);
      //res.send(results);

      var SQL = "SELECT SENTENCE FROM TB_MAP_SCRIPT_SENTENCE  WHERE SCRIPT_ID=? ORDER BY WRONG_COUNT DESC LIMIT 4 ";
      conn.query(SQL , [id], function(err, results2, fields){
        
        console.log(results2);
        const result_tot=[results, results2]
        res.send(result_tot);
      }
      
      );

    }
  });
  
}

export const uploadScript = (req, res, next) => {
  

console.log(req.body); 
  var SCRIPT_NAME = req.body[1][0];
  var SCRIPT = req.body[1][1];
  
  var LANGUAGE = req.body[0]
//  var LANGUAGE = "Eng";
  var UPLOAD_TYPE = "Direct";



  var sentenceList;
  var script_id;
var SQL =
    "INSERT INTO TB_SCRIPT_MST (SCRIPT_NAME, LANGUAGE, UPLOAD_TYPE, SCRIPT) VALUES (?, ?, ?, ?)";

  conn.query(
    SQL,
    [SCRIPT_NAME, LANGUAGE, UPLOAD_TYPE, SCRIPT],
    (err, results, fields) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send("uploadScript SUCCESS");
        console.log("script_id", results.insertId);
        script_id = results.insertId;
        console.log('scritp', SCRIPT);        
        // TB_MAP_SCRIPT_SENTENCE
        sentenceList = SCRIPT.split(".");
        console.log('sentenceList', sentenceList);
        var reformSentenceList = [];
        sentenceList.forEach(element => {
          if (element === "") {
            return;
          }
          if (element[0] === " ") {
            element = element.substring(1, element.length);
          }
          reformSentenceList.push(element);
        });
        console.log('reformSentenceList', reformSentenceList);
        var SQL =
          "INSERT INTO TB_MAP_SCRIPT_SENTENCE (SCRIPT_ID, SENTENCE, WRONG_COUNT, IDX_IN_SCRIPT, AUDIO_FILENAME) VALUES ?";
        var sentence_values = reformSentenceList.map(function(ele, idx) {
          return [script_id, ele, 0, idx, "audio_filename"];
        });
        console.log('sentence_values', sentence_values);
        var wordArray = reformSentenceList.map(function(ele, idx) {
          var reformArray = [];
          var _idx = idx;
          ele.split(" ").forEach(function(ele, idx) {
            reformArray.push([script_id, _idx, ele, 0, idx]);
          });
          return reformArray;
        });
        var word_values = [];
        wordArray.forEach(function(ele) {
          ele.forEach(function(ele) {
            word_values.push(ele);
          });
        });
        console.log("word_values", word_values);

        conn.query(SQL, [sentence_values], (err, results, fields) => {
          if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
          } else {
            console.log("tb_map_script_sentence success");
            console.log(sentence_values);
            uploadScriptMp3ToStorage(sentence_values, script_id, LANGUAGE);
          }
        });

        // TB_MAP_SENTENCE_WORD
        // var SQL =
        //   "INSERT INTO TB_MAP_SENTENCE_WORD (SCRIPT_ID, SENTENCE_ID, WORD, WRONG_COUNT, IDX_IN_SENTENCE) VALUES ?";
        // conn.query(SQL, [word_values], (err, results, fields) => {
        //   if (err) {
        //     console.log(err);
        //     res.status(500).send("Internal Server Error");
        //   } else {
        //     console.log("tb_map_sentence_word success")
        //   }
        // });
    }
  });
}

export const scorePractice = (req, res) => {
  console.log("call from react");
  var originalString = req.body.sentence;
  var scriptID = req.body.scriptID;
  var sentenceID = req.body.sentenceID;
  var isPractice = req.body.isPractice;
  var LAN = req.body.LAN;
  switch(LAN){
    case 'English':
      LAN = 'Eng';
      break;
    case 'Korean':
      LAN = 'Kor';
      break;
    case 'Japanese':
      LAN = 'Jpn';
      break;
    case 'Chinese':
      LAN = 'Chn';
      break;
  }

  console.log('script_id', 'setenceID', 'isPractice', scriptID, sentenceID, isPractice);
  scoreSpeech(
    LAN,
    "./blobUploads/" + req.file.filename,
    originalString,
    scriptID,
    sentenceID,
    isPractice
  ).then((result)=>{
    res.send(result);
  });
  
  
};

export const scorePresentation = (req, res) => {
  res.send("scorePresentation");
};
