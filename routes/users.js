"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.get('/', function (_req, res) {
    res.send('respond with a resource');
});
module.exports = router;
