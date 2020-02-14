const express = require('express')
const router = express.Router();
const path = require('path');

const schCtrl = require('./schedules.ctrl')

router.get('/', schCtrl.showList)

module.exports = router;