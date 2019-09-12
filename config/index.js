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
        disable: false,
        url: '/api/bgmt/login',
        prefix: '/api',
        target: 'http://192.168.3.37:7777',
        method: 'POST'
    },
    refreshToken: {
        method: 'POST',
        url: '/bgmt/refreshToken',
        expiration: 15 * 60
    }
};
