/**
 * API错误名称
 */
var ApiErrorNames = {};

ApiErrorNames.UNKNOW_ERROR = "unknowError";//未知错误
ApiErrorNames.SERVICE_ERROR = "serviceError";//服务器异常错误，通用错误
ApiErrorNames.UNIQUE_ERROR = "uniqueError"; //唯一性约束错误
ApiErrorNames.DATA_RULE_ERROR = "dataRuleError";//数据格式错误
ApiErrorNames.ID_NOT_EXIST = "idNotExist";//该记录不存在


/**
 * API错误名称对应的错误信息
 */
const error_map = new Map();

error_map.set(ApiErrorNames.UNKNOW_ERROR, {code: -1, message: '未知错误'});
error_map.set(ApiErrorNames.SERVICE_ERROR, {code: 500, message: '服务器异常'});
error_map.set(ApiErrorNames.UNIQUE_ERROR, {code: 501, message: '当前已存在相同值'});
error_map.set(ApiErrorNames.DATA_RULE_ERROR, {code: 502, message: '数据格式错误'});
error_map.set(ApiErrorNames.ID_NOT_EXIST, {code: 503, message: '该记录不存在'});

//根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = (error_name) => {

    var error_info;

    if (error_name) {
        error_info = error_map.get(error_name);
    }

    //如果没有对应的错误信息，默认'未知错误'
    if (!error_info) {
        error_name = 'UNKNOW_ERROR';
        error_info = error_map.get(error_name);
    }

    return error_info;
}

module.exports = ApiErrorNames;