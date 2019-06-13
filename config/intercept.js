/**
 ╔═════════════════ 组件说明 ═══════════════════╗
 ║  上次更新时间: 2019-6-13    更新人: 苏瑞鑫                                       ║
 ║  before 数据请求前拦截 必须为promise对象 当然，当你传递非promise时，不执行       ║
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
 ║  after 用来拦截请求结束后数据 同webpack的devServer.after                         ║
 ╚═════════════════════════════════════════╝
 * */
exports.before = function (req, res, next) {
};
exports.after = function (req, res) {
};
