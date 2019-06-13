const config = {
  proxy: [
    {
      prefix: '/api',
      // target: 'http://localhost:30009'
      target: 'http://192.168.3.208:8181'
    }
  ]
};

module.exports = config
