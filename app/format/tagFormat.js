/**
 * Created by qulongjun on 2017/12/4.
 */
const _toListJson = (tags) => {
    let results = [];
    tags.forEach((item) => {
        let temp = item.dataValues
        temp.count = 11;
        results.push(temp);
    });
    return results;
};
module.exports = {
    _toListJson
};