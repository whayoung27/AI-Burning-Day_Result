import routes from "./routes";
import scriptRouter from "./routers/scriptRouter";
import fileRouter from "./routers/fileRouter";
import mysql from "mysql";
import express from "express";
import AWS from "aws-sdk";
var cors = require('cors')
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
app.use(cors())
const port = process.env.PORT || 5050;
const handleHome = (req, res) => res.send("hello from home");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// dataBase
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
// console.log("conf", conf);
export const conn = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database
});
conn.connect();
console.log("=== DB connected ===");


// storage
const storage_conf = JSON.parse(fs.readFileSync("./storage.json"));
export const s3 = new AWS.S3({
	accessKeyId: storage_conf.id,
	secretAccessKey: storage_conf.secret,
});
console.log("=== Storage connected ===");

// routers
// app.use(routes.scdript, scriptRouter);
app.use(routes.script, scriptRouter);
app.use(routes.file, fileRouter);

app.get("/api/script", (req, res) => {
  connection.query(
    "SELECT * FROM SCRIPT",

    (err, rows, fields) => {
      res.send(rows);
    }
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));

/*

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;




*/
