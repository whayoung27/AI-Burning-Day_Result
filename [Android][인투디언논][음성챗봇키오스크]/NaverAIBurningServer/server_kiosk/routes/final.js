const express = require('express');
const router = express.Router();

const NaverChatbot = require('../NaverChatbot/index');
const { Menu, Order, Count, Complete } = require('../models');


let config = {
    CHATBOT_USER_ID: 'asdasdsadsd',
    CHATBOT_TOKEN: 'Y0dJV3JabnBCblh4bm5wcnpQRkdndXFadHpvbWRBcUU=',
    CHATBOT_URL: 'https://19vwdrsfxg.apigw.ntruss.com/send/beta/',
}
const chatbot = new NaverChatbot(config);

router.post('/', async(req, res, next) => {

    // 주문체크
    const sendData = await Order.findAll({
        where: {
            user_id: req.body.id,
        },
    });

    let tmp, resStr = "", money = 0;
    for(let i = 0; i<sendData.length; i++){
        tmp = await Menu.findOne({ where: { id: sendData[i].dataValues.menu_id }});
        resStr = `${resStr} ${tmp.dataValues.name}`;
        resStr = `${resStr} ${sendData[i].dataValues.menu_count} 개`;

         if (i < sendData.length - 1) resStr = `${resStr}랑`

        money = money + (tmp.dataValues.price * sendData[i].dataValues.menu_count);
    }
    resStr = `${resStr} 해서 총 ${money}원이에요. 그대로 결제하시겠어요?`;
    return res.json({ "text" : resStr });
});

router.post('/check', async(req, res, next) => {
    
    let data = await chatbot.answerText(req.body.text);

    const sendData = await Order.findAll({
        where: {
            user_id: req.body.id,
        },
    });

    let tmp, resStr = "", money = 0;
    for(let i = 0; i<sendData.length; i++){
        tmp = await Menu.findOne({ where: { id: sendData[i].dataValues.menu_id }});
        resStr = `${resStr} ${tmp.dataValues.name}`;
        resStr = `${resStr} ${sendData[i].dataValues.menu_count} 개`;

         if (i < sendData.length - 1) resStr = `${resStr}랑`

        money = money + (tmp.dataValues.price * sendData[i].dataValues.menu_count);
    }

    if(data.scenario.name == '주문 완료 및 결제 완료'){
        await Complete.create({
            user_id: req.body.id,
            price: money,
            menu: resStr,
        });

        return res.json({"status": "Ok"});
    }
    else {
        return res.json({"status": "Return"});
    }
})
module.exports = router;
