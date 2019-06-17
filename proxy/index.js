const config = require(__config);
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();
const { before, after } = require(`${__config}/intercept`);
const Login = require('../routes/login');
const loginMethods = new Login()

proxy.on('error', function (err, req, res) { // 错误处理
  log.error(err);
  res.status(500);
  res.json({
    message: '连接服务器失败',
    code: '-1'
  }).end()
});

proxy.on('proxyRes', function (proxyRes, req, res) { // 响应数据
  after(req, res)
});

module.exports = async function (req, res, next) {
  let loginReg = new RegExp(`${config.login.url}`);
  if (config.login && loginReg.test(req.url)) {
    await loginMethods.login(req, res).then(resolve => {
      /**
       * 输出需要返回前台的数据，此处为测试，返回token数据
       * */
      res.json(resolve).end()
    }).catch(err => {
      res.json({
        code: 1,
        message: 'error'
      }).end()
    });
    return false
  }
  if (config.login) { // 设置token
    await loginMethods.getToken(req, res).then(data => {
      req.headers['authorization'] = data.access_token;
    });
  }
  let params = {};
  if (before && typeof before === 'function') { // 处理数据拦截
    req.proxy = proxy;
    try {
      await before(req, res, next).then(data => {
        if (data) params = data
      })
    } catch (e) {
      console.error(e)
    }
  }
  if(typeof params !== 'object') return false;
  if (config.proxy.length < 1) {
    next();
    return false
  }
  config.proxy.map(m => { // 数据代理
    let reg = new RegExp(`^${m.prefix}\/`);
    if (reg.test(req.url)) { // 需要处理的函数
      console.log(req.url, m.prefix, m.target)
      req.url = req.url.replace(reg, '/')
      proxy.web(req, res, Object.assign({
        target: m.target
      }, params))
    } else {
      next()
    }
  })
};
