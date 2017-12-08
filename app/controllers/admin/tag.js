/**
 * Tag Admin API
 */
const {Tag} = require('../../../db/db');
let ApiError = require('../../error/ApiError');
const ApiErrorNames = require('../../error/ApiErrorNames');
const {adminCountPerPage} = require('../../../config/default');
const moment = require('moment');

/**
 * 标签列表：/api/v1.0/admin/tag/list  GET
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const list = async (ctx, next) => {
    try {
        let currentPage = ctx.params.currentPage;
        let data = ctx.request.query;
        let query = {};
        //关键字查询
        if (data["key"]) {
            query['name'] = {
                '$like': '%' + data["key"] + '%'
            }
        }
        let tags = await Tag.findAndCount({
            limit: adminCountPerPage,
            offset: adminCountPerPage * (currentPage - 1),
            where: query,
            order: [
                ["id", "DESC"]
            ]
        });
        ctx.body = {
            results: await _toListJson(tags.rows),
            currentPage,
            rowCount: adminCountPerPage,
            totalPage: Math.ceil(tags.count / adminCountPerPage)
        };
    } catch (err) {
        throw err;
    }
};

/**
 * 创建标签：/api/v1.0/tag/create  POST
 *
 * name:标签名称 String
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const create = async (ctx, next) => {
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
 *
 * id:标签id Integer
 *
 * name:唯一性约束、非空约束
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const update = async (ctx, next) => {
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
 *
 * id:标签id Integer
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const destroy = async (ctx, next) => {
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
 * 删除标签：/api/v1.0/tag/batchDestroy/:ids DELETE
 *
 * ids:分类id数组 Array[Integer]
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const batchDestroy = async (ctx, next) => {
    try {
        let ids = ctx.params.ids.split(",");
        await Tag.destroy({
            'where': {'id': ids}
        });
    } catch (err) {
        throw err;
    }
};


/**
 * 根据ID查找标签：/api/v1.0/tag/findById/:id GET
 *
 * id:标签id Integer
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const findById = async (ctx, next) => {
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
 *
 * name:标签名称 String
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const findByName = async (ctx, next) => {
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


/**
 * 将数据库对象数组转换为数据（JSON）对象数组
 *
 * @param tags 数据库对象数组
 * @returns {Array}
 * @private
 */
const _toListJson = async (tags) => {
    let results = [];
    for (let i = 0; i < tags.length; i++) {
        let item = tags[i];
        let temp = item.dataValues;
        temp.create_time = moment(temp.create_time).format('YYYY-MM-DD HH:mm:ss');
        temp.update_time = moment(temp.create_time).format('YYYY-MM-DD HH:mm:ss');
        let articles = await item.getArticles({
            where: {
                state: 1
            }
        });
        temp.count = articles.length;
        results.push(temp);
    }
    return results;
};


module.exports = {
    list, create, update, destroy, findById, findByName, batchDestroy
};