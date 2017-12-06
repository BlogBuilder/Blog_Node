/**
 * User API
 */

const jwt = require('jsonwebtoken');
let {User} = require('../../db/db');

let ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');

const config = require('../../config/default');
const md5 = require('md5');
const {UUID} = require('../../utils/randomUtils');
/**
 * 注册用户：/api/v1.0/user/register POST
 *
 * userInfo:加密后的注册信息
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const register = async (ctx, next) => {
    try {
        let userInfo = ctx.request.body.userInfo;
        let data = null;
        await jwt.verify(userInfo, config.publicKey, (err, decoded) => {
            if (err) {
                throw new ApiError(ApiErrorNames.INFO_EXPIRE_ERROR);
            } else {
                data = decoded;
            }
        });
        await User.create({
            email: data.email,
            password: md5(data.password),
            avatar: data.avatar || "http://cdn.qulongjun.cn/touxiang.jpg",
            activation: UUID(),
            nick: data.nick
        });
    } catch (err) {
        throw err;
    }
};

/**
 * 更新用户：/api/v1.0/user/update PUT
 *
 * userInfo:加密后的注册信息
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const update = async (ctx, next) => {
    try {
        let userInfo = ctx.request.body.userInfo;
        let loginInfo = ctx.session.loginInfo;
        let user = User.findById(loginInfo.user_id);
        let data = null;
        await jwt.verify(userInfo, config.publicKey, (err, decoded) => {
            if (err) {
                throw new ApiError(ApiErrorNames.INFO_EXPIRE_ERROR);
            } else {
                data = decoded;
            }
        });
        if (user) {
            await user.update({
                password: md5(data.password),
                avatar: data.avatar,
                nick: data.nick
            });
        } else new ApiError(ApiErrorNames.ID_NOT_EXIST)
    } catch (err) {
        throw err;
    }
};

module.exports = {
    register,
    update
};