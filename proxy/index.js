"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Global = global;
const index_1 = require("../config/index");
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();
const { before } = require(`${Global.__config}/intercept`);
const login_1 = __importDefault(require("../routes/login"));
const loginRouter = new login_1.default();
proxy.on('error', function (err, _req, res) {
    Global.log.error(err);
    res.status(500).json({
        message: '连接服务器失败',
        code: '-1'
    }).end();
});
module.exports = async function (req, res, next) {
    if (index_1.conf.login) {
        let loginReg = new RegExp(`${index_1.conf.login.url}`);
        if (loginReg.test(req.url)) {
            let flag = await loginRouter.loginMethods(req, res);
            if (flag) {
                res.json({
                    code: 0
                }).end();
            }
            else {
                res.json({
                    code: 1,
                    message: 'error'
                }).end();
            }
            return false;
        }
    }
    let params = {};
    if (before && typeof before === 'function') {
        try {
            await before(req, res, next).then((data) => {
                if (data)
                    params = data;
            });
        }
        catch (e) {
            console.error(e);
        }
    }
    if (typeof params !== 'object')
        return false;
    if (index_1.conf.proxy.length < 1) {
        next();
        return false;
    }
    let index = index_1.conf.proxy.findIndex((m) => new RegExp(`^${m.prefix}\/`).test(req.url));
    console.log(`\x1b[32m ${index} \x1b[0m`);
    if (index >= 0) {
        let reg = new RegExp(`^${index_1.conf.proxy[index].prefix}\/`);
        req.url = req.url.replace(reg, '/');
        if (!index_1.conf.login.disable)
            loginRouter.setToken(req);
        if (!index_1.conf.refreshToken.disable) {
            loginRouter.refreshToken(req).then(() => {
                proxy.web(req, res, Object.assign({
                    target: index_1.conf.proxy[index].target
                }, params));
            });
            return false;
        }
        proxy.web(req, res, Object.assign({
            target: index_1.conf.proxy[index].target
        }, params));
    }
    else {
        next();
    }
};
