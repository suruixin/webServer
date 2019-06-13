var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({
    name: 'super_admin',
    user_id: '1',
    access: ['super_admin', 'admin'],
    token: 'super_admin',
    avatar: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
  });
});

module.exports = router;
