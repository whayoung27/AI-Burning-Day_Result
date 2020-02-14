const fs = require('fs');
const request = require('request');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../../../', 'config', 'config.json'))[env];
const getSummary = require('./summaryInfo')

var { Voices, UserKeywords } = require('../../models')

module.exports = function sttN(voiceNo, dir, fileName) {
    // language => 언어 코드 ( Kor, Jpn, Eng, Chn )
    const url = `https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor`;
    const filePath = dir + fileName;
    const requestConfig = {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'X-NCP-APIGW-API-KEY-ID': config.NAVER_CLIENT_ID,
            'X-NCP-APIGW-API-KEY': config.NAVER_CLIENT_SECRET
        },
        body: fs.createReadStream(filePath)
    };

    request(requestConfig, (err, response, body) => {
        if (err) {
            console.log(err);
            return;
        }

        const script = JSON.parse(body);
        if (!script.text) {
            console.log('음성파일에 목소리가 없습니다.')
        }
        else {
            //gogogo keywords

            UserKeywords.findAll({
                offset: 0,
                limit: 5,
                order: [['id', 'DESC']]
            })
                .then((result) => {
                    const contents = [];
                    contents.push(script.text);
                    result.forEach(keyword => {
                        contents.push(keyword.name);
                    });
                    getSummary(voiceNo, contents);
                })
                .catch(err => {
                    res.status(400).send(err.message)
                })
            // db에 저장
            Voices.update({ script: script.text }, {
                where: { id: voiceNo }
            })
                .then(() => console.log('SUCCESS - stt and save\n' + script.text))
                .catch(err => console.log(err))

        }
    });
}

