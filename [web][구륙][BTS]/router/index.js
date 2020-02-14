var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var load = require('./load/load')
var service = require('./service/service')

router.get('/', function(req, res) {
  console.log('main page start');
  res.render('bootUrl.ejs');
})

router.use('/load', load)
router.use('/service', service)

module.exports = router;
