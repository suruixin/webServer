const config = {
  proxy: [
    {
      prefix: '/api',
      // target: 'http://localhost:30009'
      target: 'http://192.168.3.208:8181'
    }
  ],
  login: {
    url: '/account/login',
    target: 'http://192.168.3.208:5003',
    method: 'POST',
    expiration: 15 * 60 // 过期时间 单位 秒
  }
};

module.exports = config
