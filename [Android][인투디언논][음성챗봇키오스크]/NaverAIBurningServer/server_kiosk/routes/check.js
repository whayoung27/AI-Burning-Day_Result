const express = require('express');
const router = express.Router();

const NaverChatbot = require('../NaverChatbot/index');

let config = {
    CHATBOT_USER_ID: 'asdasdsadsd',
    CHATBOT_TOKEN: 'Y0dJV3JabnBCblh4bm5wcnpQRkdndXFadHpvbWRBcUU=',
    CHATBOT_URL: 'https://19vwdrsfxg.apigw.ntruss.com/send/beta/',
}

const chatbot = new NaverChatbot(config);

router.post('/', async(req, res, next) => {
    let data = await chatbot.answerText(req.body.text);

    return res.json(JSON.parse(JSON.stringify(data)));
})

module.exports = router;