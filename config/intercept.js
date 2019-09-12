"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const index_1 = require("./index");
const Global = global;
const log = Global.log;
function Before(req) {
    return Promise.resolve(req);
}
exports.Before = Before;
function After(_req, res) {
    return Promise.resolve(res);
}
exports.After = After;
function Login(req, _res) {
    return new Promise((resolve, reject) => {
        let reg = new RegExp(index_1.conf.login.prefix || '');
        request({
            method: index_1.conf.login.method,
            url: index_1.conf.login.target + (index_1.conf.login.prefix ? req.url.replace(reg, '') : req.url)
        }, (error, _response, body) => {
            if (error) {
                log.error(error);
                reject(error);
                return false;
            }
            let data = {
                token: '',
                refresh: '',
                validTime: 0
            };
            try {
                let _d = JSON.parse(body);
                console.log(_d);
                data = {
                    refresh: _d.refresh_token,
                    validTime: new Date().getTime() + _d.expires_in * 1000,
                    token: `${_d.token_type} ${_d.access_token}`
                };
            }
            catch (e) {
                console.log(e);
                reject(e);
            }
            resolve(data);
        });
    });
}
exports.Login = Login;
function RefreshToken(token) {
    return new Promise((resolve, reject) => {
        request({
            method: index_1.conf.refreshToken.method,
            url: (index_1.conf.refreshToken.target || index_1.conf.login.target) + (index_1.conf.refreshToken.url) + '?token=' + token
        }, (error, _response, body) => {
            if (error) {
                log.error(error);
                reject(error);
                return false;
            }
            let data = {
                token: '',
                refresh: '',
                validTime: 0
            };
            try {
                let _d = JSON.parse(body);
                console.log(_d);
                data = {
                    refresh: _d.refresh_token,
                    validTime: new Date().getTime() + _d.expires_in * 1000,
                    token: `${_d.token_type} ${_d.access_token}`
                };
            }
            catch (e) {
                console.log(e);
                reject(e);
            }
            resolve(data);
        });
    });
}
exports.RefreshToken = RefreshToken;
