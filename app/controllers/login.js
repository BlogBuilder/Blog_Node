const jwt = require('jsonwebtoken');

let ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');

let token = jwt.sign({foo: 'bar'}, 'shhhhh', {expiresIn: 10});

/**
 * 标签列表：/api/v1.0/tag/list  GET
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const login = async(ctx, next) => {
    try {

    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new ApiError(ApiErrorNames.NO_SIGNED_IN);
        }
    }
};

module.exports = {
    login
};


