const config = {
  proxy: [
    {
      prefix: '/api',
      target: 'http://localhost:30009'
    }
  ]
};

module.exports = config
