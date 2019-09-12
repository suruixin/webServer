import express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(_req, res: express.Response): void {
  res.render('index');
});

module.exports = router;
