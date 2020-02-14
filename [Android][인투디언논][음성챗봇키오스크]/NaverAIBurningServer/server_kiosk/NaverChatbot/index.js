'use strict';

const HmacSHA256 = require('crypto-js/hmac-sha256');
const EncBase64 = require('crypto-js/enc-base64');
const axios = require('axios');

const OpenChat = class {
  constructor(conifg) {
    if (!conifg.CHATBOT_USER_ID) throw new Error('CHATBOT_USER_ID is necessary ');
    if (!conifg.CHATBOT_TOKEN) throw new Error('CHATBOT_TOKEN is necessary ');
    if (!conifg.CHATBOT_URL) throw new Error('CHATBOT_URL is necessary ');
    if (!(this instanceof OpenChat)) {
      return new OpenChat(conifg);
    }
    conifg || (conifg = {});
    this._chatbotUserId = conifg.CHATBOT_USER_ID;
    this._chatbotToken = conifg.CHATBOT_TOKEN;
    this._chatbotUrl = conifg.CHATBOT_URL;
    this._naverSecret = conifg.NAVER_SECRET;
  }

  async _getText(text) {
    try {
      let body = {
        version: 'v2',
        userId: this._chatbotUserId,
        timestamp: new Date().getTime(),
        bubbles: [
          {
            type: 'text',
            data: {
              description: text
            }
          }
        ],
        event: 'send'
      }
      let data = JSON.stringify(body);
      let apiToken = this._chatbotToken;
      let token = HmacSHA256(data, apiToken).toString(EncBase64);
      const url = this._chatbotUrl;
      const option = {
        url: url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'cache-control': 'no-cache',
          'X-NCP-CHATBOT_SIGNATURE': token
        },
        data: data
      };
      let res = await axios(option);      
      if (res.data) res.data.text = text;
      return res.data;
    } catch (err) {
      throw err;
    }
  }

  async answerText(text) {
    return await this._getText(text);
  }

};
module.exports = OpenChat;