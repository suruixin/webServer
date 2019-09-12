const createError = require('http-errors');
import express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ejs = require('ejs');
const session = require('express-session');

const globalAny: any = global;
globalAny.__config = path.join(__dirname, '/config');
globalAny.log = require('./common/log');

const demo = require('./routes/demo');
const indexRouter = require('./routes/index');
const proxy = require('./proxy');

const app = express();

// view engine setup
app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// 设置session
app.use(session({
  secret: 'nodesession',
  resave: true,
  saveUninitialized: false
}));

app.use(logger('dev'));
/**
 * 使用`express.json() body-parser.json()` 会导致post数据无法中转
 * 若有需要，请在router中引入进行操作
 * */
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/demo', demo);
app.use(proxy);

// catch 404 and forward to error handler
app.use(function(_req, _res, next: express.NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: { message: string; status: number; }, req: express.Request, res: express.Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
