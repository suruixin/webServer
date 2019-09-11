"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.get('/', function (_req, res) {
    res.render('jq');
});
router.post('/', function (req, res) {
    console.log('当前token为: %s', req.headers['authorization']);
    res.json({
        token: req.headers['authorization']
    }).end();
});
module.exports = router;
