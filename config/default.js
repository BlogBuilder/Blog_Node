/**
 * 统一配置
 *
 */
const md5 = require('md5');

const config = {
    countPerPage: 5, //每页显示的记录数
    privateKey: "dc0e040d-bc2b-f344-61fd-8a3907d9ca71",
    publicKey: "428f12a2-2b42-0947-67c2-08b9ebc41c29",
    adminUser: "qulongjun",
    adminPassword: md5('jun920221')
};

module.exports = config;``