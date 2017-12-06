const jwt = require('jsonwebtoken');
let {User} = require('../../db/db');

let ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');

const config = require('../../config/default');
const md5 = require('md5');

/**
 * 登录验证：/api/v1.0/login  POST
 *
 * loginInfo：加密后的登陆信息
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const login = async (ctx, next) => {
    try {
        let loginInfo = ctx.request.body.loginInfo;
        let data = null;
        await jwt.verify(loginInfo, config.publicKey, (err, decoded) => {
            if (err) {
                throw err;
            } else {
                data = decoded;
            }
        });
        let user = await User.findOne({
            where: {
                email: data.email
            }
        });
        if (user !== null) {
            //验证用户密码
            if (user.password && user.password === md5(data.password)) {
                //验证成功
                let token = jwt.sign({user_id: user.id}, config.privateKey, {
                    expiresIn: 40
                });
                ctx.session.loginInfo = {
                    user_id: user.id,
                    token
                };
                ctx.body = {
                    id: user.id,
                    nick: user.nick
                };
            } else {
                throw new ApiError(ApiErrorNames.PASSWORD_ERROR);
            }
        } else {
            throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
        }
    } catch (err) {
        throw err;
    }
};

/**
 * 获取用户登录状态
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */

const fetchState = async (ctx, next) => {
    try {
        let loginInfo = ctx.session.loginInfo;
        if (loginInfo) {
            let user = await User.findById(loginInfo.user_id);
            ctx.body = {
                id: user.id,
                nick: user.nick
            };
        } else
            throw new ApiError(ApiErrorNames.NO_SIGNED_IN);
    } catch (err) {
        throw err;
    }
};


module.exports = {
    login,
    fetchState
};


