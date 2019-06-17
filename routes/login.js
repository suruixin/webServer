const request = require('request');
const md5 = require('md5');

const config = require(__config).login;

class  Router {
  constructor () {
    /**
     * params
     * */
    this.tokens = {}; // token合集，用来记录用户访问生成的token
    this.res = '';
  }
  /**
   * common
   * */
  setKey (body, params) { // 设置sessionCookie 对象的 key的公共方法
    let date = md5(new Date().getTime() + Math.random() + body.access_token + Math.random());
    this.tokens[date] = params ? params: body;
    return date;
  }
  deleteKey (tokenKey) { // 删除sessionCookie 对象的 key的公共方法
    delete this.tokens[tokenKey]
  }
  setToken (resolve, reject, params) { // 请求token
    request(params, (error, response, body) => {
      if(error) {
        log.error(error);
        reject(error);
        return false
      }
      try{
        body = JSON.parse(body)
      } catch (e) {
        console.log(e)
      }
      let key = this.setKey(body, {
        access_token: `${body.token_type} ${body.access_token}`, // token
        refresh_token: body.refresh_token, // 刷新用的token
        expires_in: new Date().getTime() + (body.expires_in) * 1000, // 过期时间
        refreshTime: new Date().getTime() + (body.expires_in + config.expiration) * 1000
      });
      this.setCookie(key);
      console.log('\x1b[32m 请求的token \x1b[0m');
      resolve(body);
    })
  }
  setCookie (key) { // 设置sessionCookie
    this.res.cookie('authorization', key);
  }
  init(req, res) {
    this.res = res;
    let formData = ''; // post请求的参数
    let tokenKey = req.cookies.authorization; // 获取cookie
    req.on('data', function (data) { // 获取post请求的参数
      formData += data
    });
    return new Promise((resolve, reject) => {
      req.on('end', () => { // 获取post请求的参数完毕
        resolve({
          cookie: tokenKey,
          data: formData
        })
        // if (tokenKey && this.tokens[tokenKey]) { // 浏览器保存了token
        //   if ((this.tokens[tokenKey].expires_in < new Date().getTime()) && (this.tokens[tokenKey].refreshTime > new Date().getTime())) { // 刷新token
        //     resolve(this.refreshToken(tokenKey))
        //   } else if (this.tokens[tokenKey].refreshTime < new Date().getTime()) { // token过期
        //     reject(this.overdueToken(tokenKey))
        //   } else if (this.tokens[tokenKey].expires_in > new Date().getTime()) { // 不需要刷新token
        //     resolve(this.availableToken(tokenKey));
        //   }
        // } else { //  浏览器未保存token
        //   this.setToken(resolve, reject, {
        //     method: config.method || 'POST',
        //     url: config.target + config.url + '?' + formData,
        //   })
        // }
      })
    })
  }
  /**
   * private
   * */
  refreshToken (tokenKey) { // 刷新token事件
    console.log('\x1b[32m 缺少刷新的方法 \x1b[0m')
    return '缺少刷新的方法'
  }
  overdueToken (tokenKey) { // token过期的处理
    this.deleteKey(tokenKey);
    console.log('\x1b[32m token过期 \x1b[0m');
    return new Error('token lose efficacy')
  }
  availableToken (tokenKey) { // 可用的token 处理
    let newTokenKey = this.setKey(this.tokens[tokenKey]);
    this.deleteKey(tokenKey);
    console.log(`\x1b[32m token不刷新 : ${JSON.stringify(this.tokens[newTokenKey])}\x1b[0m`);
    this.setCookie(newTokenKey)
    return this.tokens[newTokenKey]
  }
  getToken (req, res) { // 非登录获取Token处理
    return this.init(req, res).then(data => {
      if (data.cookie && this.tokens[data.cookie]) { // 浏览器保存了token
        if ((this.tokens[data.cookie].expires_in < new Date().getTime()) && (this.tokens[data.cookie].refreshTime > new Date().getTime())) { // 刷新token
          return this.refreshToken(res.cookie)
        } else if (this.tokens[data.cookie].refreshTime < new Date().getTime()) { // token过期
          return Promise.reject(this.overdueToken(data.cookie))
        } else if (this.tokens[data.cookie].expires_in > new Date().getTime()) { // 不需要刷新token
          return this.availableToken(data.cookie);
        }
      } else {
        return Promise.reject(new Error('this illegal login!'))
      }
    })
  }
  login (req, res) { // 登录处理
    return new Promise((resolve, reject) => {
      this.init(req, res).then(data => {
        this.setToken(resolve, reject, {
          method: config.method || 'POST',
          url: config.target + config.url + '?' + data.data,
        })
      })
    })
  }
};

module.exports = Router;
