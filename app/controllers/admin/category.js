/**
 * Category Admin API
 */

const {Category} = require('../../../db/db');
const {adminCountPerPage} = require('../../../config/default');
let ApiError = require('../../error/ApiError');
const ApiErrorNames = require('../../error/ApiErrorNames');
const moment = require('moment');

/**
 * 分类列表：/api/v1.0/admin/category/list/:currentPage  GET
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
        let categories = await Category.findAndCount({
            limit: adminCountPerPage,
            offset: adminCountPerPage * (currentPage - 1),
            where: query,
            order: [
                ["id", "DESC"]
            ]
        });
        ctx.body = {
            results: await _toListJson(categories.rows),
            currentPage,
            rowCount: adminCountPerPage,
            totalPage: Math.ceil(categories.count / adminCountPerPage)
        };
    } catch (err) {
        throw err;
    }
};

/**
 * 创建分类：/api/v1.0/admin/category/create  POST
 *
 * name:分类名称 String
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const create = async (ctx, next) => {
    try {
        await Category.create({
            'name': ctx.request.body.name
        });
    } catch (err) {
        throw err;
    }
};


/**
 * 更新分类：/api/v1.0/category/update/:id PUT
 *
 * id:分类id Integer
 * name:分类名称 String
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const update = async (ctx, next) => {
    try {
        let categoryId = ctx.params.id;
        let category = await Category.findById(categoryId);
        if (category !== null) {
            await category.update({
                'name': ctx.request.body.name
            });
        } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
    } catch (err) {
        throw err;
    }
};

/**
 * 删除分类：/api/v1.0/category/destroy/:id DELETE
 *
 * id:分类id Integer
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const destroy = async (ctx, next) => {
    try {
        let categoryId = ctx.params.id;
        let category = await Category.findById(categoryId);
        if (category !== null) {
            await category.destroy();
        } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
    } catch (err) {
        throw err;
    }
};

/**
 * 删除分类：/api/v1.0/category/batchDestroy/:ids DELETE
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
        await Category.destroy({
            'where': {'id': ids}
        });
    } catch (err) {
        throw err;
    }
};


/**
 * 根据ID查找分类：/api/v1.0/category/findById/:id GET
 *
 * id:分类id Integer
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const findById = async (ctx, next) => {
    try {
        let categoryId = ctx.params.id;
        let category = await Category.findById(categoryId);
        if (category !== null) {
            ctx.body = {
                results: [category]
            };
        } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
    } catch (err) {
        throw err;
    }
};


/**
 * 根据Name查找分类：/api/v1.0/category/findByName/:name GET
 *
 * name:分类名称 String
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const findByName = async (ctx, next) => {
    try {
        let categoryName = ctx.params.name;
        let categories = await Category.findAll({
            where: {
                name: categoryName
            }
        });
        ctx.body = {
            results: categories
        };
    } catch (err) {
        throw err;
    }
};

/**
 * 将数据库对象数组转换为数据（JSON）对象数组
 *
 * @param categories 数据库对象数组
 * @returns {Array}
 * @private
 */
const _toListJson = async (categories) => {
    let results = [];
    for (let i = 0; i < categories.length; i++) {
        let item = categories[i];
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