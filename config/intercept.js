"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const config_1 = require("../config");
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
async function Login(req, _res) {
    return new Promise((resolve, reject) => {
        request({
            method: config_1.conf.login.method,
            url: config_1.conf.login.target + req.url
        }, (error, _response, body) => {
            if (error) {
                log.error(error);
                reject(error);
                return false;
            }
            console.log(typeof body);
            try {
                body = JSON.parse(body);
            }
            catch (e) {
                console.log(e);
                reject(e);
            }
            resolve(body);
        });
    });
}
exports.Login = Login;
