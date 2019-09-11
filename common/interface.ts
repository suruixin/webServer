/**
 * token格式
 */
export interface DataType {
  data: object,
  cookie: object
}

/**
 * token 格式
 */
export interface TokenType {
  token: string, // token
  refresh: string, // 刷新token
  validTime: number // token有效期
}
