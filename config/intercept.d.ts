import express = require('express');
import { TokenType } from '../common/interface';
export declare function Before(req: express.Request): Promise<express.Request>;
export declare function After(_req: express.Request, res: express.Response): Promise<express.Response>;
export declare function Login(req: express.Request, _res: express.Response): Promise<TokenType>;
export declare function RefreshToken(token: string): Promise<TokenType>;
