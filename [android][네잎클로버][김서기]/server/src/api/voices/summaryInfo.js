const sumInfoCtrl = require('./summaryInfo.ctrl');
const { PythonShell } = require('python-shell');

module.exports = (voiceNo, contents) => {
    var options = {
        args: contents
    };
    PythonShell.run(__dirname + '/textrank.py', options, function (err, results) {
        if (err) throw err;
        const contents = results;
        console.log(contents);

        //script bold 처리
        var boldScript = results.pop();
        sumInfoCtrl.renewScript(voiceNo, boldScript)

        // db에 저장 - keywords
        var keyInfo = results.pop().split('\'');
        var keywords = []
        for (var i = 1; i < keyInfo.length; i += 2) {
            keywords.push(keyInfo[i])
        }
        sumInfoCtrl.addTagToVoice(voiceNo, keywords)

        // contents에서 날짜, 일정, 정보 추출
        var schInfo = []
        for (var i = 0; i < contents.length; i++) {
            if (contents[i].charAt(0) == '_') schInfo.push(contents[i])
            else break;
        }
        if (schInfo.length > 0) sumInfoCtrl.addSchedule(voiceNo, schInfo)

        // db에 저장 - summary
        var summary = ""
        for (var i = schInfo.length; i < contents.length; i++) {
            summary += (contents[i] + ";")
        }
        sumInfoCtrl.addSummary(voiceNo, summary)

    });

}

/*

// TODO: 테그 받아 오는 걸로 추 후 수정 - tag test
router.post('/:id/tags', (req, res) => {
    const tagList = ['계약서', '카페', '점심', '사무실']
    console.log(tagList);
    const voiceNo = req.params.id

    tagCtrl.addTagToVoice(voiceNo, tagList)
    res.send('ok')
})

*/