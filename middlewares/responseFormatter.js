/**
 * 在app.use(router)之前调用
 */
let ApiError = require('../app/error/ApiError');
const ApiErrorNames = require('../app/error/ApiErrorNames');
const Sequelize = require('sequelize');

let response_formatter = (ctx) => {
    //如果有返回数据，将返回数据添加到data中
    if (ctx.body) {
        ctx.body = {
            code: 200,
            message: 'success',
            data: ctx.body
        }
    } else {
        ctx.body = {
            code: 200,
            message: 'success'
        }
    }
};

let url_filter = (pattern) => {
    return async(ctx, next) => {
        let reg = new RegExp(pattern);
        try {
            await next();
        } catch (error) {
            if (error instanceof Sequelize.UniqueConstraintError) {
                throw new ApiError(ApiErrorNames.UNIQUE_ERROR);
            }
            if (error instanceof Sequelize.ValidationError) {
                throw new ApiError(ApiErrorNames.DATA_RULE_ERROR);
            }


            if (error instanceof SyntaxError) {
                throw new ApiError(ApiErrorNames.SERVICE_ERROR);
            }
            throw error;
        }

        //通过正则的url进行格式化处理
        if (reg.test(ctx.originalUrl)) {
            response_formatter(ctx);
        }
    }
};
module.exports = url_filter;