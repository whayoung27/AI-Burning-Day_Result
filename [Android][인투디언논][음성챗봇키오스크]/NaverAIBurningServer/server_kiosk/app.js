const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const sendRouter = require('./routes/send');
const firstRouter = require('./routes/first');
const ttsRouter = require('./routes/tts');
const finalRouter = require('./routes/final');
const checkRouter = require('./routes/check');


const app = express();

const { sequelize } = require('./models');

sequelize.sync();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/mp3', express.static('NaverTts'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/send', sendRouter);
app.use('/first', firstRouter);
app.use('/tts', ttsRouter);
app.use('/final', finalRouter);
app.use('/check', checkRouter);


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
