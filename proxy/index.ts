const Global: any = global;
import { conf } from '../config/index';
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();
const { before } = require(`${Global.__config}/intercept`);
import express = require('express');
import LoginRouter from '../routes/login'
const loginRouter = new LoginRouter();

proxy.on('error', function (err: any, _req: void, res: { status: any, json: any, end: any }) { // 错误处理
  Global.log.error(err);
  res.status(500).json({
    message: '连接服务器失败',
    code: '-1'
  }).end()
});

// proxy.on('proxyRes', function (_proxyRes: void, req: any, res: any) { // 响应数据
//   after(req, res)
// });
module.exports = async function (req: express.Request, res: express.Response, next: express.NextFunction) {
  if (conf.login) {
    let loginReg = new RegExp(`${conf.login.url}`);
    // 设置当访问到login的时候自动走
    if (loginReg.test(req.url)) {
      let flag: boolean = await loginRouter.loginMethods(req, res);
      if (flag) {
        res.json({
          code: 0
        }).end()
      } else {
        res.json({
          code: 1,
          message: 'error'
        }).end()
      }
      //   loginMethods.login(req, res).then((resolve: ) => {
      //     /**
      //      * 输出需要返回前台的数据，此处为测试，返回token数据
      //      * */
      //     res.json(resolve).end()
      //   }).catch(err => {
      //     console.log(err)
      //     res.json({
      //       code: 1,
      //       message: 'error'
      //     }).end()
      //   });
      return false
    }
    // // 设置token
    // await loginMethods.getToken(req, res).then(data => {
    //   req.headers['authorization'] = data.access_token;
    // });
  }
  /**
   * 数据拦截
   */
  let params = {};
  if (before && typeof before === 'function') { // 处理数据拦截
    try {
      await before(req, res, next).then((data: any) => {
        if (data) params = data
      })
    } catch (e) {
      console.error(e)
    }
  }
  if(typeof params !== 'object') return false;
  /**
   * 若没有设置代理  直接跳过
   */
  if (conf.proxy.length < 1) {
    next();
    return false
  }
  /**
   * 代理事件处理
   */
  let index: number = conf.proxy.findIndex((m: { prefix: string }) => new RegExp(`^${m.prefix}\/`).test(req.url))
  console.log(`\x1b[32m ${index} \x1b[0m`)
  if( index >= 0 ){
    let reg = new RegExp(`^${conf.proxy[index].prefix}\/`);
    req.url = req.url.replace(reg, '/');
    if (!conf.login.disable) loginRouter.setToken(req);
    if (!conf.refreshToken.disable) {
      loginRouter.refreshToken(req).then(() => {
        proxy.web(req, res, Object.assign({
          target: conf.proxy[index].target
        }, params))
      })
      return false
    }
    proxy.web(req, res, Object.assign({
      target: conf.proxy[index].target
    }, params))
  } else {
    next()
  }
};

