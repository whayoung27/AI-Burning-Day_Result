'use strict';
var fs = require('fs');

const TTS = class{
    async getSound(text){
        var options = {
            'method': 'POST',
            'url': 'https://naveropenapi.apigw.ntruss.com/voice-premium/v1/tts',
            'headers': {
              'X-NCP-APIGW-API-KEY-ID': '0q5uu7pl8k',
              'X-NCP-APIGW-API-KEY': 'H2T5XmmMOKliTVD6o7lhhr8kwjuL0S7PPSI2EG8V',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
              'speaker': 'nara',
              'text': '인투디언논이 최고얌',
              'volume': '0',
              'speed': '-1',
              'pitch': '0',
              'emotion': '2'
            }
        };

        var writeStream = fs.createWriteStream('./NaverTts/tts1.mp3');
        var request = require('request');
        options.form.text = req.body.text;
        var _req = await request(options);
        _req.pipe(writeStream);
        return {"link":"https://9162eaa9.ngrok.io/mp3/tts1.mp3"};
    }
}

module.exports = TTS;