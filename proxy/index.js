const config = require('../config');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();
const { before, after } = require('../config/intercept');

proxy.on('error', function (err, req, res) { // 错误处理
  console.log('err: ', err)
  res.status(500)
  res.json({
    message: '连接服务器失败',
    code: '-1'
  }).end()
});

proxy.on('proxyRes', function (proxyRes, req, res) {
  after(req, res)
});

module.exports = async function (req, res, next) {
  let params = {};
  if (before && typeof before === 'function') {
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
  config.proxy.map(m => {
    let reg = new RegExp(`^${m.prefix}\/`)
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
