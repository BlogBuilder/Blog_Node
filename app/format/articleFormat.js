/**
 * Created by qulongjun on 2017/12/4.
 */
var co = require('co');
const {Article, Category, Tag} = require('../../db/db');

const _toListJson = async(article) => {
    let results = [];
    article.forEach((item) => {
        let temp = item.dataValues;
        temp.category = Category.findById(item.get("categoryId"));
        results.push(temp);
    });
    return results;
};
module.exports = {
    _toListJson
};