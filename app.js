"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createError = require('http-errors');
const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ejs = require('ejs');
const session = require('express-session');
const globalAny = global;
globalAny.__config = path.join(__dirname, '/config');
globalAny.log = require('./common/log');
const demo = require('./routes/demo');
const indexRouter = require('./routes/index');
const proxy = require('./proxy');
const app = express();
app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(session({
    secret: 'nodesession',
    resave: true,
    saveUninitialized: false
}));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/demo', demo);
app.use(proxy);
app.use(function (_req, _res, next) {
    next(createError(404));
});
app.use(function (err, req, res) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
