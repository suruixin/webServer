"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const intercept_1 = require("../config/intercept");
class Router {
    constructor() {
        this.tokens = '';
    }
    loginMethods(req, res) {
        return intercept_1.Login(req, res).then((data) => {
            console.log(data);
            return Promise.resolve(true);
        });
    }
    get Token() {
        return this.tokens;
    }
}
exports.default = Router;
