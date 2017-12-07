/**
 * Final Error Catch
 */
let ApiError = require('../app/error/ApiError');
const ApiErrorNames = require('../app/error/ApiErrorNames');
const jwt = require('jsonwebtoken');


const catchHandle = async(ctx, next) => {
    try {

        let exclude = [
            "/api/v1.0/login/fetchState",
            "/api/v1.0/login",
            "/api/v1.0/logOff",
            "/api/v1.0/tag/list",
            "/api/v1.0/category/list",
            "/api/v1.0/article/list",
            "/api/v1.0/article/findById",
            "/api/v1.0/comment/list",
            "/api/v1.0/comment/create"
        ];
        let result = true;
        for (let i = 0; i < exclude.length; i++) {
            let url = exclude[i];
            if (ctx.originalUrl.split('?')[0].indexOf(url) !== -1) {
                result = false;
            }
            if (!result)break;
        }
        if (result) {
            if (ctx.session.loginInfo) {
                await next();
            } else
                throw new ApiError(ApiErrorNames.NO_SIGNED_IN);
        } else  await next();
    } catch (error) {
        console.log(error);
        //如果异常类型是API异常，将错误信息添加到响应体中返回。
        if (error instanceof ApiError) {
            ctx.status = 200;
            ctx.body = {
                code: error.code,
                message: error.message
            }
        } else {
            //否则抛出未知异常
            let ERROR_INFO = ApiErrorNames.getErrorInfo(ApiErrorNames.UNKNOW_ERROR);
            ctx.status = 200;
            ctx.body = {
                code: ERROR_INFO.code,
                message: ERROR_INFO.message
            }
        }
    }
};

module.exports = catchHandle;


