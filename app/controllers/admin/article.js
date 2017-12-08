/**
 * Article Admin API
 */

const {Article, Category, Tag, Article_Tag} = require('../../../db/db');
const {countPerPage} = require('../../../config/default');
const {getCurrentMonthFirst, getCurrentMonthLast} = require('../../../utils/dateUtils');
const ApiError = require('../../error/ApiError');
const ApiErrorNames = require('../../error/ApiErrorNames');
const moment = require('moment');

/**
 * 文章列表：/api/v1.0/article/admin/list/:currentPage  GET
 *
 * currentPage：当前页码：Integer
 * key：关键字 String
 * categoryId：分类Id Integer
 * tagsId[]：标签Id列表 Array[Integer]
 * create_time：创建时间 String yyyy-mm
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const list = async (ctx, next) => {
    try {
        let data = ctx.request.query;
        let query = {};
        let includes = [];
        //关键字查询
        if (data["key"]) {
            query['$or'] = [
                {
                    title: {
                        '$like': '%' + data["key"] + '%'
                    }
                }, {
                    summary: {
                        '$like': '%' + data["key"] + '%'
                    }
                }
            ];
        }
        //文章分类查询
        if (data["categoryId"]) {
            includes.push({
                'model': Category,
                'where': {
                    'id': data["categoryId"]
                }
            })
        }
        //文章标签查询
        if (data["tagsId"]) {
            let articleIds = await Article_Tag.findAll({
                attributes: ["articleId"],
                where: {
                    tagId: data["tagsId"]
                }
            });
            let idArr = [];
            for (let i = 0; i < articleIds.length; i++) {
                idArr.push(articleIds[i].articleId);
            }
            query.id = {
                '$in': idArr
            }
        }
        //创建时间查询
        if (data["create_time"]) {
            query.create_time = {
                $gte: getCurrentMonthFirst(data["create_time"]),
                $lte: getCurrentMonthLast(data["create_time"])
            }
        }
        let currentPage = ctx.params.currentPage;
        let articles = await Article.findAndCount({
            attributes: ["id", "type", "title", "summary", "categoryId", "create_time","update_time","viewCount","state"],
            limit: countPerPage,
            offset: countPerPage * (currentPage - 1),
            include: includes,
            where: query,
            order: [
                ["id", "DESC"]
            ]
        });
        let results = await _toArticleJson(articles.rows);
        ctx.body = {
            results,
            currentPage,
            rowCount: countPerPage,
            totalPage: Math.ceil(articles.count / countPerPage)
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * 创建文章：/api/v1.0/article/create  POST
 *
 * type：文章类型 Integer
 * title：文章标题 String
 * summary:文章摘要 String
 * content：文章正文 String
 * state：文章状态 Integer
 * tags：所属标签 Array[Integer]
 * categoryId：所属分类 Integer
 * materials：素材头图、视频、音频 Array[String]
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const create = async (ctx, next) => {
    try {
        let data = ctx.request.body;
        let article = await Article.create({
            type: data.type,
            title: data.title,
            summary: data.summary,
            content: data.content,
            state: data.state
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
        throw err;
    }
};


/**
 * 更新文章：/api/v1.0/article/update/:id  PUT
 *
 * id：文章Id Integer
 * type：文章类型 Integer
 * title：文章标题 String
 * summary:文章摘要 String
 * content：文章正文 String
 * state：文章状态 Integer
 * tags：所属标签 Array[Integer]
 * categoryId：所属分类 Integer
 * materials：素材头图、视频、音频 Array[String]
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const update = async (ctx, next) => {
    try {
        let data = ctx.request.body;
        let article = await Article.findById(ctx.params.id);
        if (article !== null) {
            await article.update({
                type: data.type,
                title: data.title,
                summary: data.summary,
                content: data.content,
                state: data.state
            });
            let category = await Category.findById(data.categoryId);
            article.setCategory(category);
            await article.removeTag();
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
            let currentMaterials = await article.getMaterials();
            if (currentMaterials.length !== 0) {
                for (let m = 0; m < currentMaterials.length; m++) {
                    await article.removeMaterial(currentMaterials[m]);
                }
            }
            if (data.materials.length !== 0) {
                data.materials.forEach((item) => {
                    article.createMaterial({path: item});
                })
            }
        } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
    } catch (err) {
        throw err;
    }
};


/**
 * 根据ID查找文章 /api/v1.0/article/findById/:id  GET
 *
 * id：文章Id Integer
 *
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const findById = async (ctx, next) => {
    try {
        let articleId = ctx.params.id;
        let article = await Article.findById(articleId);
        if (article !== null) {
            let results = await _toDetailJson(article);
            ctx.body = {
                results: [results]
            };
        } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
    } catch (err) {
        throw err;
    }
};


/**
 * 删除文章：/api/v1.0/article/destroy/:id DELETE
 *
 * id:文章id Integer
 *
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const destroy = async (ctx, next) => {
    try {
        let articleId = ctx.params.id;
        let article = await Article.findById(articleId);
        if (article !== null) {
            await article.destroy();
        } else throw new ApiError(ApiErrorNames.ID_NOT_EXIST);
    } catch (err) {
        throw err;
    }
};


/**
 * 将数据库对象数组转换为数据（JSON）对象数组
 *
 *
 * @param articles 数据库对象数组
 * @returns {Promise.<Array>}
 * @private
 */
const _toArticleJson = async (articles) => {
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
        data.comment_num = (await item.getComments()).length;
        data.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
        data.update_time = moment(item.update_time).format('YYYY-MM-DD HH:mm:ss');
        delete data.categoryId;
        results.push(data);
    }
    return results;
};

/**
 * 将数据库对象转换为数据（JSON）对象
 *
 * @param article 数据库对象
 * @returns {Promise.<*>}
 * @private
 */
const _toDetailJson = async (article) => {
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
    data.next = await Article.findOne({
        attributes: ["id"],
        where: {
            id: {
                '$gt': article.get("id"),
            }
        }
    });
    data.prev = await Article.findOne({
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
    data.create_time = moment(article.create_time).format('YYYY-MM-DD HH:mm:ss');
    data.update_time = moment(article.update_time).format('YYYY-MM-DD HH:mm:ss');

    delete data.categoryId;
    return data;
};


module.exports = {
    list, create, update, findById, destroy
};
