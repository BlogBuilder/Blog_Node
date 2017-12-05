/**
 * Article
 */

const {Article, Category, Tag} = require('../../db/db');
const defaults = require('../../config/default');
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');

/**
 * 文章列表：/api/v1.0/article/list/:currentPage  GET
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const list = async(ctx, next) => {
    try {
        let currentPage = ctx.params.currentPage;
        let articles = await Article.findAndCountAll({
            attributes: ["id", "type", "title", "summary", "categoryId", "create_time"],
            limit: defaults.countPerPage,
            offset: defaults.countPerPage * (currentPage - 1)
        });
        let results = await _toArticleJson(articles.rows);
        ctx.body = {
            results,
            currentPage,
            rowCount: defaults.countPerPage,
            totalPage: articles.count / defaults.countPerPage
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * 创建文章：/api/v1.0/article/create  POST
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const create = async(ctx, next) => {
    try {
        let data = ctx.request.body;
        let article = await Article.create({
            type: data.type,
            title: data.title,
            summary: data.summary,
            content: data.content
        });
        let category = await Category.findById(data.categoryId);
        article.setCategory(category);
        if (data.tags.length !== 0) {
            let tagList = await Tag.findAll({
                where: {
                    id: {
                        '$in': data.tags,
                    }
                }
            });
            article.setTags(tagList);
        }
        if (data.materials.length !== 0) {
            data.materials.forEach((item) => {
                article.createMaterial({path: item});
            })
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};


/**
 * 根据ID查找文章 /api/v1.0/article/findById/:id  GET
 *
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const findById = async(ctx, next) => {
    try {
        let articleId = ctx.params.id;
        let article = await Article.findById(articleId);
        if (article !== null) {
            let results = await _toDetailJson(article);
            ctx.body = {
                results: results
            };
        } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
    } catch (err) {
        console.log(err);
        throw err;
    }
};


const _toArticleJson = async(articles) => {
    let results = [];
    for (let i = 0; i < articles.length; i++) {
        let item = articles[i];
        let data = item.dataValues;
        data.category = await item.getCategory({
            'attributes': ['id', 'name']
        });
        data.tags = await item.getTags({
            'attributes': ['id', 'name']
        });
        data.materials = await item.getMaterials({
            'attributes': ['id', 'path']
        });
        delete data.categoryId;
        results.push(data);
    }
    return results;
};


const _toDetailJson = async(article) => {
    let data = article.dataValues;
    data.category = await article.getCategory({
        'attributes': ['id', 'name']
    });
    data.tags = await article.getTags({
        'attributes': ['id', 'name']
    });
    data.materials = await article.getMaterials({
        'attributes': ['id', 'path']
    });
    data.prev = await Article.findOne({
        attributes: ["id"],
        where: {
            id: {
                '$gt': article.get("id"),
            }
        }
    });
    data.next = await Article.findOne({
        attributes: ["id"],
        where: {
            id: {
                '$lt': article.get("id"),
            }
        },
        'order': [
            ['id', 'DESC']
        ]
    });
    delete data.categoryId;
    return data;
};


module.exports = {
    list, create, findById
};
