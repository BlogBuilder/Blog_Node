const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');

const tt = require('../../db/index');

//获取用户
exports.getuser = async(ctx, next) => {
    //如果id != 1抛出API 异常
    if (ctx.query.id != 1) {
        throw new ApiError(ApiErrorNames.USER_NOT_EXIST);
    }
    // tt.write();
    // tt.read();
    // tt.update();
    tt.deleteData();
    ctx.body = {
        username: '瞿龙俊1',
        age: 26
    }
}

//用户注册
exports.registeruser = async(ctx, next) => {
    tt.read()
    console.log('registerUser', ctx.request.body);
}