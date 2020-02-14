const fs = require('fs');
const request = require('request');
const {ncpId,ncpSecret} = require('./config')


// language => 언어 코드 ( Kor, Jpn, Eng, Chn )
module.exports.csr = {
    stt : async (language, filePath, callback) => {
    const url = `https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=${language}`;
    const requestConfig = {
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'X-NCP-APIGW-API-KEY-ID': ncpId,
            'X-NCP-APIGW-API-KEY': ncpSecret
        },
        body: fs.createReadStream(filePath)
    };

    await request(requestConfig, (err, response, body) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log(response.statusCode);
        callback(body);
    });
}
}