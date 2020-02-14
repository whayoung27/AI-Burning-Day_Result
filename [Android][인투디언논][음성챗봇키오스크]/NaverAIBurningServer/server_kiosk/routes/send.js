const express = require('express');
const router = express.Router();

const NaverChatbot = require('../NaverChatbot/index');
const { Menu, Order, Count } = require('../models');

router.post('/', async (req, res, next) => {
    let config = {
        CHATBOT_USER_ID: 'asdasdsadsd',
        CHATBOT_TOKEN: 'Y0dJV3JabnBCblh4bm5wcnpQRkdndXFadHpvbWRBcUU=',
        CHATBOT_URL: 'https://19vwdrsfxg.apigw.ntruss.com/send/beta/',
    }
    const chatbot = new NaverChatbot(config);

    let data = await chatbot.answerText(req.body.text);
    
    const Yes = await find(data, req);

    if(Yes == 100){
        return res.json({"status": "Ok"});
    } else if(Yes == 200){
        return res.json({"status": "Return"});
    } else {
        const sendData = await Order.findAll({
            where: {
                user_id: req.body.id,
            },
        });
    
        let returnJson = {};
        
        if(sendData.length == 0){
            return res.json({ "menu0" : "메뉴가 비었습니다.", });
        }
        else {
            let tmp;
            returnJson["total"] = 0;
            for(let i = 0; i<sendData.length; i++){
                tmp = await Menu.findOne({ where: { id: sendData[i].dataValues.menu_id }});
                returnJson["menu" + i] = tmp.dataValues.name;
                returnJson["count" + i] = sendData[i].dataValues.menu_count;
                returnJson["price" + i] = tmp.dataValues.price * sendData[i].dataValues.menu_count;
                returnJson["total"] = returnJson["total"] + returnJson["price" + i];
            }
        
            console.log(returnJson);
            return res.json(JSON.parse(JSON.stringify(returnJson)));
        }
    }
});

const find = async (data, req) => {
    if(data.scenario.name == '주문 취소'){
        if(data.entities.length == 1){
            const menu = await Menu.findOne({ where: { name:  data.entities[0].word } });
            const order = await Order.findOne({ 
                where: { 
                    user_id: req.body.id,
                    menu_id: menu.id, 
                }
            });
            console.log(order.menu_count);
            if(order.menu_count == 1){
                console.log("파괴합니다.");
                await Order.destroy({
                    where: {
                        user_id: req.body.id,
                        menu_id: menu.id,
                    }
                });
            } else {
                console.log("하나 빼겠습니다.");
                console.log(order.menu_count - 1);
                await Order.update(
                    { menu_count: order.menu_count - 1, },
                    { where: { 
                        user_id: req.body.id,
                        menu_id: menu.id,
                    }}
                  );
            }
            
    
            return 2;
        }
        else if(data.entities.length == 2){
            const menu = await Menu.findOne({ where: { name:  data.entities[0].word } });
            const count = await Count.findOne({ where: { name: data.entities[1].word } });
            let order =  await Order.findOne({ where :{
                user_id: req.body.id,
                menu_id: menu.id, 
            }});
            if(order.menu_count == count.int){
                console.log("파괴합니다.");
                await Order.destroy({
                    where: {
                        user_id: req.body.id,
                        menu_id: menu.id,
                    }
                });
            } else {
                console.log("n개 빼겠습니다.");
                console.log(order.menu_count - count.int);
                await Order.update(
                    { menu_count: order.menu_count - count.int, },
                    { where: { 
                        user_id: req.body.id,
                        menu_id: menu.id,
                    }}
                  );
            }
        
            return 3;
        }
    } else if (data.scenario.name == '주문 완료 및 결제 완료'){
        return 100;
    } else if (data.scenario.name == '부정문'){
        return 200;
    }
    else {
        console.log(data.entities);
        if(data.entities.length == 0){
            let order =  await Order.findOne({ where :{
                user_id: req.body.id,
                menu_id: 1, 
            }});

            if(order){
                await Order.update(
                    { menu_count: order.menu_count + 1, },
                    { where: {
                        user_id: req.body.id,
                        menu_id: 1,
                    }}
                );
            } else {
                await Order.create({
                    user_id: req.body.id,
                    menu_id: 1,
                    menu_count: 1
                });
            }
            return 1;
        }
        else if(data.entities.length == 1){
            console.log(data.entities[0].word);
            const menu = await Menu.findOne({ where: { name:  data.entities[0].word } });
            

            let order =  await Order.findOne({ where :{
                user_id: req.body.id,
                menu_id: menu.id, 
            }});

            if(order){
                await Order.update(
                    { menu_count: order.menu_count + 1, },
                    { where: {
                        user_id: req.body.id,
                        menu_id: menu.id,
                    }}
                );
            } else {
                await Order.create({
                    user_id: req.body.id,
                    menu_id: menu.id,
                    menu_count: 1
                });    
            }
            
            return 2;
        }
        else if(data.entities.length == 2){
    
            if(data.entities[1].name == '음식'){
                const menu1 = await Menu.findOne({ where: { name:  data.entities[0].word } });
            
                let order =  await Order.findOne({ where :{
                    user_id: req.body.id,
                    menu_id: menu1.id, 
                }});
    
                if(order){
                    await Order.update(
                        { menu_count: order.menu_count + 1, },
                        { where: {
                            user_id: req.body.id,
                            menu_id: menu1.id,
                        }}
                    );
                } else {
                    await Order.create({
                        user_id: req.body.id,
                        menu_id: menu1.id,
                        menu_count: 1
                    });    
                }
    
                const menu2 = await Menu.findOne({ where: { name:  data.entities[1].word } });
            
                order =  await Order.findOne({ where :{
                    user_id: req.body.id,
                    menu_id: menu2.id, 
                }});
    
                if(order){
                    await Order.update(
                        { menu_count: order.menu_count + 1, },
                        { where: {
                            user_id: req.body.id,
                            menu_id: menu2.id,
                        }}
                    );
                } else {
                    await Order.create({
                        user_id: req.body.id,
                        menu_id: menu2.id,
                        menu_count: 1
                    });    
                }
            } else {
                console.log(data.entities[0].word);
                const menu = await Menu.findOne({ where: { name:  data.entities[0].word } });
                const count = await Count.findOne({ where: { name: data.entities[1].word } });
                let order =  await Order.findOne({ where :{
                    user_id: req.body.id,
                    menu_id: menu.id, 
                }});
    
                if(order){
                    await Order.update(
                        { menu_count: order.menu_count + count.int, },
                        { where: {
                            user_id: req.body.id,
                            menu_id: menu.id,
                        }}
                    );
                } else {
                    await Order.create({
                        user_id: req.body.id,
                        menu_id: menu.id,
                        menu_count: count.int
                    });    
                }
                return 3;
            }
        }
        else if(data.entities.length == 4){
            const menu1 = await Menu.findOne({ where: { name:  data.entities[0].word } });
            const count1 = await Count.findOne({ where: { name: data.entities[1].word } });
            
            let order =  await Order.findOne({ where :{
                user_id: req.body.id,
                menu_id: menu1.id, 
            }});

            if(order){
                await Order.update(
                    { menu_count: order.menu_count + count1.int, },
                    { where: {
                        user_id: req.body.id,
                        menu_id: menu1.id,
                    }}
                );
            } else {
                await Order.create({
                    user_id: req.body.id,
                    menu_id: menu1.id,
                    menu_count: count1.int
                });    
            }        
    
            const menu2 = await Menu.findOne({ where: { name:  data.entities[2].word } });
            const count2 = await Count.findOne({ where: { name: data.entities[3].word } });
            
            order =  await Order.findOne({ where :{
                user_id: req.body.id,
                menu_id: menu2.id, 
            }});

            if(order){
                await Order.update(
                    { menu_count: order.menu_count + count2.int, },
                    { where: {
                        user_id: req.body.id,
                        menu_id: menu2.id,
                    }}
                );
            } else {
                await Order.create({
                    user_id: req.body.id,
                    menu_id: menu2.id,
                    menu_count: count2.int
                });    
            }        
    
            return 4;
        }
    }
}

module.exports = router;
