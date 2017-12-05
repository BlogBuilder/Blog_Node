/**
 * Final Error Catch
 */
let ApiError = require('../app/error/ApiError');
const ApiErrorNames = require('../app/error/ApiErrorNames');

const catchHandle = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
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


