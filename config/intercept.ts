/**
 ╔═════════════════ 组件说明 ═══════════════════╗
 ║  上次更新时间: 2019-6-14    更新人: 苏瑞鑫                                       ║
 ║  Before 数据请求前拦截 必须为promise对象 否则返回一个错误                        ║
 ║  若需要设置proxy字段 则在resolve中输出一个对象 具体可设置字段 参考               ║
 ║     [http-proxy](https://github.com/nodejitsu/node-http-proxy#options)           ║
 ║     栗子:                                                                        ║
 ║     return new Promise(resolve => {                                              ║
 ║       resolve({ headers: { userToken: '1516' } })                                ║
 ║     })                                                                           ║
 ║    那么后台将接受到传递过去的 userToken，同时原有的请求头保持不变                ║
 ║  若需要自定义拦截规则，则通过req.proxy来设置，同时resolve返回非对象，具体用法 同 ║
 ║  [http-proxy](https://github.com/nodejitsu/node-http-proxy)                      ║
 ║     栗子:                                                                        ║
 ║     exports.before = function (req, res, next) {                                 ║
 ║         ...                                                                      ║
 ║         req.proxy.web(req, res, {})                                              ║
 ║       };                                                                         ║
 ║                                                                                  ║
 ║  After 用来拦截请求结束后数据 同webpack的devServer.after                         ║
 ║  Login 用来进行token请求返回一个promise对象，如果不存在登陆返回false             ║
 ║  Login 用来进行token请求返回一个promise对象，如果不存在登陆返回false             ║
 ╚═════════════════════════════════════════╝
 * */

import express = require('express');
import request = require('request');
import { conf } from './index';
import { TokenType } from '../common/interface'
const Global: any = global;
const log:any = Global.log;

export function Before (req: express.Request): Promise<express.Request>  {
  return Promise.resolve(req)
}

export function After (_req: express.Request, res: express.Response): Promise<express.Response> {
  return Promise.resolve(res)
}

export function Login(req: express.Request, _res: express.Response): Promise<TokenType> {
  return new Promise((resolve, reject) =>  {
    let reg: RegExp = new RegExp(conf.login.prefix || '');
    request({
      method: conf.login.method,
      url: conf.login.target + (conf.login.prefix ? req.url.replace(reg, '') : req.url)
    }, (error: string, _response: any, body: string) => {
      if(error) {
        log.error(error);
        reject(error);
        return false
      }
      let data: TokenType = {
        token: '',
        refresh: '',
        validTime: 0
      };
      try{
        let _d: {
          refresh_token: string,
          expires_in: number,
          token_type: string,
          access_token: string
        } = JSON.parse(body)
        console.log(_d)
        data = {
          refresh: _d.refresh_token,
          validTime: new Date().getTime() + _d.expires_in * 1000,
          token: `${_d.token_type} ${_d.access_token}`
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
      // 如果需要在此处返回数据，自行设计
      // console.log(_res);
      resolve(data);
    })
  })
}

export function RefreshToken(token: string): Promise<TokenType> {
  return new Promise((resolve, reject) => {
    request({
      method: conf.refreshToken.method,
      url: (conf.refreshToken.target || conf.login.target) + (conf.refreshToken.url) + '?token=' + token
    }, (error: string, _response: any, body: string) => {
      if (error) {
        log.error(error);
        reject(error);
        return false
      }
      let data: TokenType = {
        token: '',
        refresh: '',
        validTime: 0
      };
      try {
        let _d: {
          refresh_token: string,
          expires_in: number,
          token_type: string,
          access_token: string
        } = JSON.parse(body)
        console.log(_d)
        data = {
          refresh: _d.refresh_token,
          validTime: new Date().getTime() + _d.expires_in * 1000,
          token: `${_d.token_type} ${_d.access_token}`
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
      // 如果需要在此处返回数据，自行设计
      // console.log(_res);
      resolve(data);
    })
  })
}
