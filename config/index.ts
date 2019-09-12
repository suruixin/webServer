interface ConfigType {
  port: number, // 端口
  proxy: {
    prefix: string,
    target: string
  }[],
  login: {
    disable?: boolean,
    prefix?: string,
    url: string, // 登录地址
    target: string, // 代理地址
    method: string // 请求方式
  },
  refreshToken: {
    disable?: boolean,
    method: string,
    url: string,
    target?: string,
    expiration: number // token过期时间
  }
}

export const conf: ConfigType = {
  port: 3009,
  proxy: [
    {
      prefix: '/api',
      // target: 'http://localhost:30009'
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
    expiration: 15 * 60 // 过期时间 单位 秒
  }
};
