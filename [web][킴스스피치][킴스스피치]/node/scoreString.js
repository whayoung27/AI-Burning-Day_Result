var stringSimilarity = require("string-similarity");

var similarity = stringSimilarity.compareTwoStrings("healed", "sealed");

var matches = stringSimilarity.findBestMatch("healed", [
  "edward",
  "sealed",
  "theatre"
]);

function splitString(string) {
  return string.split(" ");
}

function findBestMatchOf(
  givenWord, //
  arrayStartIndex, // 시작 지점
  scope, // 시작 지점 부터 +- 단어 몇개 까지 검사 할 것인가
  grouping, // 몇개까지 묵어서 살펴볼 것인가
  targetString // target string
) {
  var stringArray = splitString(targetString);
  // console.log("0st: ", stringArray);
  // console.log("target string: ", targetString);

  var endIndex = arrayStartIndex + scope;
  if (endIndex > stringArray.length) {
    endIndex = stringArray.length;
  }

  var startIndex = arrayStartIndex - scope;
  if (startIndex < 0) {
    startIndex = 0;
  }
  // console.log(stringArray);
  stringArray = stringArray.slice(startIndex, endIndex);
  // console.log("1st: ", stringArray);

  // console.log(stringArray);
  stringArray = regroupStringArrary(stringArray, grouping);

  return stringSimilarity.findBestMatch(givenWord, stringArray);
}

function regroupStringArrary(stringArray, grouping) {
  // console.log("grouping: ", grouping);

  const MINIMUM_N = 2;

  var regroupedStringArray = JSON.parse(JSON.stringify(stringArray));

  if (grouping < MINIMUM_N) {
    return stringArray;
  }

  for (var i = MINIMUM_N; i < grouping + 1; i++) {
    for (var j = 0; j < stringArray.length - i + 1; j++) {
      var tmp_join = stringArray.slice(j, j + i);

      regroupedStringArray.push(tmp_join.join(""));
    }
  }

  return regroupedStringArray;
}

// console.log(findBestMatchWithin(0, 0, 4, 0, splitString(heeString)));

// console.log(stringSimilarity.findBestMatch("can", splitString(oString)));

function scoreString(
  spokenString,
  originalString,
  accuracyLimit,
  grouping,
  scope,
  scirpt_id,
  setence_id,
  is_practice
) {
  //stringArray[0]로 검사.
  //일정 accuracy이하 일 경우. stringArrary[0] stringArrary[1] join 된 걸로 검사
  //일정 accuracy이하 일 경우. stringArrary[0] stringArrary[1] stringArrary[2] join 된 걸로 검사.
  // n번 반복
  // rating 비교하여 제일 높은 거.
  console.log("original before: ", originalString);
  console.log("spoken before: ", spokenString);

  spokenString = spokenString.toLowerCase();
  spokenString = spokenString.replace(",", "");
  spokenString = spokenString.replace(/\'/g, "");
  spokenString = spokenString.replace(/\’/g, "");
  originalString = originalString.toLowerCase();
  originalString = originalString.replace(",", "");
  originalString = originalString.replace(/\'/g, "");
  originalString = originalString.replace(/\’/g, "");

  console.log("original after: ", originalString);
  console.log("spoken after: ", spokenString);
  var result = [];
  var tmpString = splitString(originalString);
  // console.log(tmpString);
  // console.log("tmpString", tmpString);
  for (var i = 0; i < tmpString.length; ) {
    var tmp_result;
    // console.log(tmpString[i]);
    var tmp_1 = findBestMatchOf(
      tmpString[i],
      i, // array start index
      scope, // scope
      grouping, // grouping
      spokenString // target string
    );

    result.push({
      original: tmpString[i],
      spoken: tmp_1.bestMatch.target,
      rating: tmp_1.bestMatch.rating
    });

    i++;
    // if(tmp_1.bestMatch.rating < 0.5){

    //   tmp_2 = findBestMatchOf(
    //     tmpString[i]+tmpString[i+1],
    //     i, // array start index
    //     grouping+1, // scope
    //     grouping, // grouping
    //     splitString(originalString) // target string array
    //   );

    // }
  }

  // if (is_practice == true){
  //   var values = [];
  //   result.forEach(function(obj, idx){
  //     if(obj.rating != 1){
  //       values.push([script_id, setence_id, idx])
  //     }
  //   })

  // var SQL = "UPDATE TB_MAP_SENTENCE_WORD SET WRONG_COUNT = WRONG_COUNT+1 WHERE SCRIPT_ID = ? AND SENTENCE_ID = ? AND IDX_IN_SENTENCE = ?";
  //       conn.query(SQL, values, (err, results, fields) => {
  //         if (err) {
  //           console.log(err);
  //           res.status(500).send("Internal Server Error");
  //         } else {
  //           console.log("audiofile url inserted");                       
  //         }
  // });
  // } else {

  // }
  


  return {result:result, spokenString:spokenString};
}

//return score, {spoken: string, original: string, rating: number} //string은 여러 단어의 조합일 수 있음.

// console.log(
//   findBestMatchOf(
//     "treat",
//     0,
//     splitString(oString).length,
//     3,
//     splitString(oString)
//   )
// );

// (spokenString, originalString, accuracyLimit, grouping, scope)
// console.log(score(heeString, oString, 0.5, 3, 5));

// console.log(
//   score(
//     "Was sort of like google in paperback form 35 years before google came along",
//     "It was sort of like Google in paperback form 35 years before Google came along",
//     0.5,
//     3,
//     7
//   )
// );

// console.log(
//   score(
//     "It was created by a fellow named the stewart brand not far from here in menlo park and he brought it to life with his witty touch",
//     "It was created by a fellow named Stewart Brand not far from here in Menlo Park and he brought it to life with his poetic touch",
//     0.5,
//     3,
//     7
//   )
// );

// (spokenString, originalString, accuracyLimit, grouping, scope)
// console.log(
//   scoreString(
//     "This was in the late nineteen sixties for personal computers and desktop publishing suite was also made to use typewriters seizures and i'm not going to cover us",
//     "This was in the late 1960′s, before personal computers and desktop publishing so it was all made with typewriters scissors and polaroid cameras",
//     0.5,
//     3,
//     5
//   )
// );

module.exports = scoreString;

//  To do
//  1. original String에 대한 처리.
//    1-1.반점, 따옴표 등등 제거  --> 반점 Done
//    1-2.
//
//
//
//
