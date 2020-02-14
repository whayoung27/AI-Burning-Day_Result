const express = require('express')
const router = express.Router();
const path = require('path');

const customKeyCtrl = require('./keyword.ctrl')

router.get('/', customKeyCtrl.showList)
router.post('/', customKeyCtrl.create)

module.exports = router;