import express = require('express');
export default class Router {
    private tokens;
    loginMethods(req: express.Request, res: express.Response): Promise<boolean>;
    setToken(req: express.Request): void;
    refreshToken(req: express.Request): Promise<boolean>;
    readonly Token: string;
}
