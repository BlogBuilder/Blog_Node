/**
 * Category API
 */

const {Category} = require('../../db/db');
let ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');

/**
 * 分类列表：/api/v1.0/category/list  GET
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const list = async (ctx, next) => {
    try {
        let categories = await Category.findAll({
            attributes: ["id", "name"],
            order: [
                "id"
            ]
        });
        ctx.body = {
            results: await _toListJson(categories)
        };
    } catch (err) {
        throw err;
    }
};

/**
 * 创建分类：/api/v1.0/category/create  POST
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

        let articles = await item.getArticles({
            where: {
                state: 1
            }
        });
        temp.count = articles.length;
        results.push(temp);
    }
    results.sort((data1, data2) => {
        return data2["count"] - data1["count"];
    });
    return results;
};

module.exports = {
    list, create, update, destroy, findById, findByName
};