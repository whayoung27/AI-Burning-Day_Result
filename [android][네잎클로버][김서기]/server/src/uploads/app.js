const express = require('express');
const logger = require('morgan');

const sequelize = require('./models').sequelize;
const app = express();

sequelize.sync({ force: true }).then(() => {
    console.log('Success - DB connection')
    app.emit('dbSettingComplete');
}).catch((err) => {
    console.log('Failed - DB connection')
    console.log(err)
});;

app.use(logger('dev'));

app.get('/', (req, res) => res.send('Hello world'))
app.use('/voices', require('./api/voices'))
app.use('/schedules', require('./api/schedules'))


module.exports = app;