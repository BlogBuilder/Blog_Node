/**
 * Created by qulongjun on 2017/12/8.
 */
const curl = require("curl");
const superagent = require("superagent");
const cheerio = require('cheerio');
const fs = require('fs');
const {UUID} =require('../../../utils/randomUtils');
const qn = require('qn');
const path = require('path');
const qiniu = require('qiniu');


let config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;
// 是否使用https域名
config.useHttpsDomain = true;
// 上传是否使用cdn加速
config.useCdnDomain = true;

const accessKey = 'O3rDOs5bsuhGz3wMnFIXEIepomFD532jCEEhsScx';
const secretKey = '4nOVUHQg_OQeneEFTKCSg8Gs8ceSpIEjQ9iAO7LE';
const options = {
    scope: "blog",
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
};


/**
 * 上传文件到本地
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const uploadLocalFIle = async(ctx, next) => {
    try {

        ctx.body = {
            results: "success"
        }

    } catch (err) {
        console.log(err);
        throw err;
    }
};


const uploadLinkFile = async(ctx, next) => {
    try {
        let url = ctx.request.body.url;
        let img = await superagent.get(url);
        let p = url.split('?')[0];
        let item = p.split(".");
        let fileName = UUID() + "." + item[item.length - 1];
        uploadFileStream(img, fileName, function (path) {
            console.log(path);
        });
        ctx.body = {
            result: "http://cdn.qulongjun.cn/resource/" + fileName
        }

    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
 * 引用网址爬虫
 * @param ctx
 * @param next
 * @returns {Promise.<void>}
 */
const fetchContent = async(ctx, next) => {
    try {
        let url = ctx.request.query.id;
        let data = await superagent.get(url);
        let $ = cheerio.load(data.text); //加载到cheerio中
        let container = $('.RichText.PostIndex-content'); //获取外部容器
        let imgArr = $('.RichText.PostIndex-content img'); //获取图片数组
        for (let i = 0; i < imgArr.length; i++) {
            await uploadQiNiu(imgArr[i], i);
        }
        ctx.body = {
            result: container.html()
        };
    } catch (err) {
        throw err;
    }
};


/**
 * 引用网址中的图片上传
 * @param image
 * @param index
 * @returns {Promise.<void>}
 */
const uploadQiNiu = async(image, index) => {
    let original = image.attribs["data-original"] || image.attribs["data-actualsrc"];
    if (!original)return;
    let img = await superagent.get(original);
    let item = original.split(".");
    let fileName = UUID() + "." + item[item.length - 1];
    fs.writeFileSync('./upload/' + fileName, img.body);
    await uploadFile('./upload/' + fileName, fileName, function (path) {
        image.attribs["src"] = "http://cdn.qulongjun.cn/" + path;
    });
};


/**
 * 上传文件到七牛云 API
 * @param localFile
 * @param fileName
 * @param handle
 * @returns {Promise.<void>}
 */
const uploadFile = async(localFile, fileName, handle) => {
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    let formUploader = new qiniu.form_up.FormUploader(config);
    let putExtra = new qiniu.form_up.PutExtra();
    (async() => {
        formUploader.putFile(uploadToken, "resource/" + fileName, localFile, putExtra, function (respErr, respBody, respInfo) {
            if (respErr) {
                throw respErr;
            }
            if (respInfo.statusCode == 200) {
                handle(respBody.key);
            } else {
                console.log(respInfo.statusCode);
                console.log(fileName);
            }
        });
    })();

};


/**
 * 上传文件到七牛云 API
 * @param localFile
 * @param fileName
 * @param handle
 * @returns {Promise.<void>}
 */
const uploadFileStream = async(fileStream, fileName, handle) => {
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    let formUploader = new qiniu.form_up.FormUploader(config);
    let putExtra = new qiniu.form_up.PutExtra();
    (async() => {
        formUploader.putStream(uploadToken, "resource/" + fileName, fileStream, putExtra, function (respErr, respBody, respInfo) {
            if (respErr) {
                throw respErr;
            }
            if (respInfo.statusCode == 200) {
                handle(respBody.key);
            } else {
                console.log(respInfo.statusCode);
                console.log(fileName);
            }
        });
    })();

};


module.exports = {
    fetchContent, uploadLocalFIle, uploadLinkFile
};