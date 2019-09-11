"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conf = {
    port: 3009,
    proxy: [
        {
            prefix: '/api',
            target: 'http://192.168.3.37:7777'
        }
    ],
    login: {
        url: '/bgmt/login',
        target: 'http://192.168.3.37:7777',
        method: 'POST',
        expiration: 15 * 60
    }
};
