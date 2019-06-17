var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const ejs = require('ejs');

global.__config = path.join(__dirname, '/config');
global.log = require('./common/log');

const demo = require('./routes/demo');
const proxy = require('./proxy');

var app = express();

// view engine setup
app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
/**
 * 使用`express.json() body-parser.json()` 会导致post数据无法中转
 * 若有需要，请在router中引入进行操作
 * */
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(proxy);
app.use('/demo', demo);

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
