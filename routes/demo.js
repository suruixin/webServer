var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('jq')
});
router.post('/', function(req, res, next) {
  console.log('当前token为: %s', req.headers['authorization'])
  res.json({
    token: req.headers['authorization']
  }).end();
});

module.exports = router;
