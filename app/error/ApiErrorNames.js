/**
 * API错误名称
 */
var ApiErrorNames = {};

ApiErrorNames.UNKNOW_ERROR = "unknowError";//未知错误
ApiErrorNames.SERVICE_ERROR = "serviceError";//服务器异常错误，通用错误
ApiErrorNames.UNIQUE_ERROR = "uniqueError"; //唯一性约束错误
ApiErrorNames.DATA_RULE_ERROR = "dataRuleError";//数据格式错误
ApiErrorNames.ID_NOT_EXIST = "idNotExist";//该记录不存在
ApiErrorNames.NO_SIGNED_IN = 'noSignedIn';//尚未登录
ApiErrorNames.INFO_EXPIRE_ERROR = 'infoExpireError';//登录信息过期
ApiErrorNames.PASSWORD_ERROR = 'passwordError';//登录密码错误
ApiErrorNames.SIGNATURE_ERROR = 'signatureError';//签名错误

/**
 * API错误名称对应的错误信息
 */
const error_map = new Map();

error_map.set(ApiErrorNames.UNKNOW_ERROR, {code: -1, message: '未知错误'});
error_map.set(ApiErrorNames.SERVICE_ERROR, {code: 500, message: '服务器异常'});
error_map.set(ApiErrorNames.UNIQUE_ERROR, {code: 501, message: '当前已存在相同值'});
error_map.set(ApiErrorNames.DATA_RULE_ERROR, {code: 502, message: '数据格式错误'});
error_map.set(ApiErrorNames.ID_NOT_EXIST, {code: 503, message: '该记录不存在'});
error_map.set(ApiErrorNames.NO_SIGNED_IN, {code: 504, message: '用户尚未登陆'});
error_map.set(ApiErrorNames.INFO_EXPIRE_ERROR, {code: 505, message: '登录信息过期'});
error_map.set(ApiErrorNames.PASSWORD_ERROR, {code: 506, message: '登录密码错误'});
error_map.set(ApiErrorNames.SIGNATURE_ERROR, {code: 507, message: '加密签名错误'});


//根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = (error_name) => {

    let error_info;

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