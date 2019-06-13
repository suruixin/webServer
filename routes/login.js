var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.redirect(302, '/');
  next()
});
router.post('/', function(req, res, next) {
  res.json({
    token: 'super_admin'
  });
});

module.exports = router;
