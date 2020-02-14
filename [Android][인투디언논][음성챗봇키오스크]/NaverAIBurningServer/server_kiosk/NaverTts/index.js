'use strict';

const HmacSHA256 = require('crypto-js/hmac-sha256');
const EncBase64 = require('crypto-js/enc-base64');
const axios = require('axios');

const Tts = class {
  constructor(conifg) {
    if (!conifg.NAVER_CLIENT_ID) throw new Error('NAVER_CLIENT_ID is necessary ');
    if (!conifg.NAVER_SECRET) throw new Error('NAVER_SECRET is necessary ');
    if (!(this instanceof Tts)) {
      return new Tts(conifg);
    }
    conifg || (conifg = {});
    this._naverCientId = conifg.NAVER_CLIENT_ID;
    this._naverSecret = conifg.NAVER_SECRET;
    this._lang = conifg.LANG || 'Kor';
  }

  async _getTts(file) {
    try {
      const clientId = this._naverCientId;
      const clientSecret = this._naverSecret;
      const url = `https://naveropenapi.apigw.ntruss.com/voice/v1/tts`;
      const option = {
        'url': url,
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-NCP-APIGW-API-KEY-ID': clientId,
          'X-NCP-APIGW-API-KEY': clientSecret,
        },
        form:{
            'speaker':"mijin",
            'speed':"0",
            'text': "김건훈 바보 멍청이"
        }
      };
      let res = await axios(option);
      console.log(res);
      return res.data;
    } catch (err) {
      throw err;
    }
  }

};
module.exports = Tts;