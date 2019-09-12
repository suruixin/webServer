import express = require('express');
const router = express.Router();

router.get('/', function (_req, res: express.Response): void {
  res.render('jq')
});
router.post('/', function(req: express.Request, res: express.Response): void {
  console.log('当前token为: %s', req.headers['authorization'])
  res.json({
    token: req.headers['authorization']
  }).end();
});

module.exports = router;
