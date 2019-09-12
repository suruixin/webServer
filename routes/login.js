"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intercept_1 = require("../config/intercept");
const index_1 = require("../config/index");
class Router {
    constructor() {
        this.tokens = '';
    }
    loginMethods(req, res) {
        return intercept_1.Login(req, res).then((data) => {
            console.log(data);
            if (typeof data === 'boolean') {
                return Promise.resolve(false);
            }
            else {
                this.tokens = data.token;
                let sessions = req.session;
                sessions.auth = data;
                return Promise.resolve(true);
            }
        }).catch((err) => {
            console.error(err);
            return Promise.reject(false);
        });
    }
    setToken(req) {
        let session = (req.session || {});
        let token = (session.auth || {}).token;
        req.headers.authorization = token;
    }
    async refreshToken(req) {
        let session = (req.session || {});
        let auth = session.auth;
        if (auth.validTime < (new Date().getTime() - index_1.conf.refreshToken.expiration)) {
            return Promise.resolve(true);
        }
        else {
            let Token = await intercept_1.RefreshToken(auth.refresh);
            req.headers.authorization = Token.token;
            return Promise.resolve(true);
        }
    }
    get Token() {
        return this.tokens;
    }
}
exports.default = Router;
