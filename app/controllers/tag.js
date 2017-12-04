/**
 * Tag
 */
const {Tag} = require('../../db/db');
const {_toListJson} = require('../format/tagFormat');
let ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');

/**
 * 标签列表：/api/v1.0/tag/list  GET
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const list = async(ctx, next) => {
    try {
        let tags = await Tag.findAll();
        ctx.body = {
            results: _toListJson(tags)
        };
    } catch (err) {
        throw err;
    }
};

/**
 * 创建标签：/api/v1.0/tag/create  POST
 * name:唯一性约束、非空约束
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const create = async(ctx, next) => {
    try {
        await Tag.create({
            'name': ctx.request.body.name
        });
    } catch (err) {
        throw err;
    }
};


/**
 * 更新标签：/api/v1.0/tag/update/:id PUT
 * id:标签id
 * name:唯一性约束、非空约束
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const update = async(ctx, next) => {
    try {
        let tagId = ctx.params.id;
        let tag = await Tag.findById(tagId);
        if (tag !== null) {
            await tag.update({
                'name': ctx.request.body.name
            });
        } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
    } catch (err) {
        throw err;
    }
};

/**
 * 删除标签：/api/v1.0/tag/destroy/:id DELETE
 * id:标签id
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const destroy = async(ctx, next) => {
    try {
        let tagId = ctx.params.id;
        let tag = await Tag.findById(tagId);
        if (tag !== null) {
            await tag.destroy();
        } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
    } catch (err) {
        throw err;
    }
};

/**
 * 根据ID查找标签：/api/v1.0/tag/findById/:id GET
 * id:标签id
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const findById = async(ctx, next) => {
    try {
        let tagId = ctx.params.id;
        let tag = await Tag.findById(tagId);
        if (tag !== null) {
            ctx.body = {
                results: [tag]
            };
        } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
    } catch (err) {
        throw err;
    }
};


/**
 * 根据Name查找标签：/api/v1.0/tag/findByName/:name GET
 * name:标签名称
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const findByName = async(ctx, next) => {
    try {
        let tagName = ctx.params.name;
        let tags = await Tag.findAll({
            where: {
                name: tagName
            }
        });
        ctx.body = {
            results: tags
        };
    } catch (err) {
        throw err;
    }
};

module.exports = {
    list,
    create,
    update,
    destroy,
    findById,
    findByName
};