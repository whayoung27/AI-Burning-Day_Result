const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const WebSocket = require('./lib/socket');
const sequelize = require('./models').sequelize;
require('dotenv').config();

const port = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
sequelize.sync();

const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
});

const indexRouter = require('./routes/index');
const imageRouter = require('./routes/images');
app.use('/', indexRouter);
app.use('/images', imageRouter);  
app.use(cors);

server.listen(port, () => console.log(`Server has started on port ${port}`));

WebSocket(server, app, sessionMiddleware);