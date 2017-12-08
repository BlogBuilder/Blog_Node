/**
 * Comment API
 */
const {Article, Comment, User} = require('../../db/db');
let ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
const moment = require('moment');

/**
 * 评论列表：/api/v1.0/comment/list/:articleId  GET
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const list = async(ctx, next) => {
    try {
        let articleId = ctx.params.articleId;
        let comments = await Comment.findAll({
            attributes: ["id", "nick", "content", "avatar", "create_time"],
            where: {
                articleId: articleId,
                commentId: null
            }
        });
        ctx.body = {
            results: await _toListJson(comments)
        };
    } catch (err) {
        throw err;
    }
};

/**
 * 创建评论：/api/v1.0/comment/create  POST
 *
 * id:上级评论Id Integer
 * content：评论内容 String
 * nick：用户昵称 String
 * avatar：用户头像 String
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const create = async(ctx, next) => {
    try {
        let data = ctx.request.body;
        let loginInfo = ctx.session.loginInfo;
        let user = loginInfo && (await User.findById(loginInfo.user_id));
        let comment = await Comment.create({
            content: data.content,
            nick: (user && user.nick) || get_client_ip(ctx.request) || "佚名",
            avatar: (user && user.avatar) || "http://cdn.qulongjun.cn/avator/" + Math.floor(Math.random() * 824) + ".png"
        });
        if (data.id) {
            let parent = await Comment.findById(data.id);
            if (parent) {
                await comment.setComment(parent);
            } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
        }
        if (data.articleId) {
            let article = await Article.findById(data.articleId);
            if (article) {
                await comment.setArticle(article);
            } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
        }
        if (user !== null) {
            await comment.setUser(user);
        }
    } catch (err) {
        throw err;
    }
};


/**
 * 更新评论：/api/v1.0/comment/update/:commentId PUT
 *
 * commentId:评论id Integer
 * id:上级评论Id Integer
 * content：评论内容 String
 * nick：用户昵称 String
 * avatar：用户头像 String
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const update = async(ctx, next) => {
    try {
        let id = ctx.params.id;
        let data = ctx.request.body;
        let comment = await Comment.findById(id);
        console.log(id)
        if (comment !== null) {
            await comment.update({
                content: data.content,
                nick: data.nick || get_client_ip(ctx.request) || "佚名",
                avatar: data.avatar || "http://cdn.qulongjun.cn/touxiang.jpg"
            });
            if (data.id) {
                let parent = await Comment.findById(data.id);
                if (parent) {
                    await comment.setComment(parent);
                } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
            }
            if (data.articleId) {
                let article = await Article.findById(data.articleId);
                if (article) {
                    await comment.setArticle(article);
                } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
            }
        } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
    } catch (err) {
        throw err;
    }
};

/**
 * 删除评论：/api/v1.0/comment/destroy/:id DELETE
 *
 * id:评论id Integer
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const destroy = async(ctx, next) => {
    try {
        let commentId = ctx.params.id;
        let comment = await Comment.findById(commentId);
        if (comment !== null) {
            await comment.destroy();
        } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
    } catch (err) {
        throw err;
    }
};

/**
 * 根据ID查找评论：/api/v1.0/comment/findById/:id GET
 *
 * id:评论id Integer
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const findById = async(ctx, next) => {
    try {
        let commentId = ctx.params.id;
        let comment = await Comment.findById(commentId);
        if (comment !== null) {
            ctx.body = {
                results: [comment]
            };
        } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
    } catch (err) {
        throw err;
    }
};


/**
 * 根据用户昵称查找评论：/api/v1.0/comment/findByNick/:nick GET
 *
 * nick:用户昵称 String
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const findByNick = async(ctx, next) => {
    try {
        let nickName = ctx.params.nick;
        let comments = await Comment.findAll({
            where: {
                nick: nickName
            }
        });
        ctx.body = {
            results: comments
        };
    } catch (err) {
        throw err;
    }
};


/**
 * 将数据库对象数组转换为数据（JSON）对象数组
 *
 * @param comments 数据库对象数组
 * @returns {Array}
 * @private
 */
const _toListJson = async(comments) => {
    let results = [];
    for (let i = 0; i < comments.length; i++) {
        let item = comments[i];
        let data = item.dataValues;
        await _tolistChild(item);
        results.push(data);
    }
    return results;
};

/**
 * 递归实现
 *
 * @param comment
 * @returns {Promise.<*>}
 * @private
 */
const _tolistChild = async(comment) => {
    let childComments = await comment.getComments({
        attributes: ["id", "nick", "content", "avatar", "create_time"],
    });
    if (childComments.length === 0) {
        let data = comment.dataValues;
        data.create_time = moment(data.create_time).format('YYYY-MM-DD HH:mm:ss');
        data.children = [];
        return data;
    } else {
        let results = [];
        for (let i = 0; i < childComments.length; i++) {
            let child = childComments[i];
            if (child !== null) {
                results.push(await _tolistChild(child))
                //results.push(await _tolistChild(await childComments[i].getComments()));
            }
        }
        let data = comment.dataValues;
        data.children = results;
        return data;
    }
};
/**
 * 获取客户端IP地址
 * @param req
 * @returns {string|string[]|undefined|*|number|string}
 */
const get_client_ip = function (req) {
    let ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }
    return ip;
};

module.exports = {
    list, create, update, destroy, findById, findByNick
};
