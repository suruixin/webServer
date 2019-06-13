## webServer 后台

### 目录介绍
.
├  bin
├  config // 配置文件所在位置
│   ├ index.js // 用来配置代理地址
│   └ intercept.js // 用来拦截数据请求
├  proxy // 代理文件所在位置
│   └ index.js 代理文件
├  public // 静态文件存储位置
├  routes // 路由文件位置
├  views // 页面存储路径
│   └ index.html 将html 存放在该目录下，js css ... 存放于public下
└ app.js

### 计划内容以及完成内容
- [x] [数据请求代理](#数据请求代理)
- [x] 配置文件
- [x] [数据拦截](#数据拦截)
- [ ] socket拦截
- [ ] 路由便捷配置
- [ ] token session等附加内容请求及处理
- [ ] 通用登录 退出路由编写

### 使用说明

> ####[数据请求代理](#数据请求代理)

请求代理，请在 `config/index.js` 中进行配置
#### proxy
type: `Array`
说明: 用来配置代理

##### proxy[x].prefix
type: `String`
说明: 代理前缀，在转发时会被清除

##### proxy[x].target
type: `String`
说明: 服务地址

> 例子

```
// config/index.js
const config = {
  proxy: [
    {
      prefix: '/api',
      target: 'http://localhost:30009'
    }
  ]
};
```

> ####[数据拦截](#数据拦截)

#### before
数据请求前拦截 必须为promise对象。当然，当你传递非promise时，不执行

> 请求拦截

当你需要在请求之前设置请求头信息，或者需要更改请求地址等，那么你需要在`promise`中返回一个对象，在对象中进行设置，可设置参数查看[http-proxy options](https://github.com/nodejitsu/node-http-proxy#options)
例子：
```
// config/intercept.js
exports.before = function (req, res, next) {
	return new Promise(resolve => {
		resolve({ headers: { userToken: '1516' } })
	})
}
```
在上述的例子中 请求头会在原有的基础上添加上`userToken`然后传递给后台

> 自定义拦截

有的时候可能会需要自定义拦截规则，当然这种情况是极少数，在下面的例子中，当你处理完成拦截规则后可以自行引入`http-proxy`或者直接使用`req.proxy`进行代理，关于`proxy`的使用请[点击查看](https://github.com/nodejitsu/node-http-proxy)
```
// config/intercept.js
exports.before = function (req, res, next) {
	...
	req.proxy.web(req, res, {});
};
```

#### after
用来拦截请求结束后数据 同webpack的devServer.after
例子
```
// config/intercept.js
exports.after = function (req, res) {
	if (/^\/login$/.test(req.url)) {
		res.json({
			message: 'success',
			code: 0
		})
	}
};
```
