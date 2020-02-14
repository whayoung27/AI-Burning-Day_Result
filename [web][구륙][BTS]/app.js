var express = require('express')
var app = express()
var path = require('path')
var bodyParser = require('body-parser')
var router = require('./router/index')
var favicon = require('serve-favicon');

app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(router);

app.listen(3000, function() {
  console.log("NAVER AI BURNING PAGE START!");
});