var express = require('express');
var router = express.Router();
var { User } = require('../models');

/* GET home page. */
router.get('/', (req, res, next) => {
    User.create({name:'temp'}).then(result=>{
        console.log(result.dataValues.id);
        res.json({id :result.dataValues.id});
    })
});
module.exports = router;
