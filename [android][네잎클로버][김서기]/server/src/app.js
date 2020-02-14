const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser')
const sequelize = require('./models').sequelize;
const app = express();

sequelize.sync({ force: false }).then(() => {
    console.log('Success - DB connection')
    app.emit('dbSettingComplete');
}).catch((err) => {
    console.log('Failed - DB connection')
    console.log(err)
});;

app.use(logger('dev'));

// app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.get('/', (req, res) => res.send('Hello world'))
app.use('/voices', require('./api/voices'))
app.use('/schedules', require('./api/schedules'))
app.use('/keywords', require('./api/keywords'))


module.exports = app;