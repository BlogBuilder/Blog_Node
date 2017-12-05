/**
 * 登陆验证功能
 */
const jwt = require('jsonwebtoken');
let ApiError = require('../app/error/ApiError');
const ApiErrorNames = require('../app/error/ApiErrorNames');

const loginCheck = async(ctx, next) => {
    try {
        let token = ctx.request.headers.cookie;
        await jwt.verify(token, 'blog');
        await next();
    } catch (error) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new ApiError(ApiErrorNames.NO_SIGNED_IN);
        }
        throw error;
    }
};

module.exports = loginCheck;


