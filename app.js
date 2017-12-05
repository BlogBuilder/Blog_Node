const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const logUtil = require('./utils/logUtils');


const tables = require('./db/db');

const index = require('./routes/index')
const response_formatter = require('./middlewares/responseFormatter');
const error_catch = require('./middlewares/errorCatch');

// 异常处理
onerror(app);

//参数解析
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));

app.use(json());
app.use(logger());

//初始化数据库
for (let name in tables) tables[name].sync();

// 日志操作
app.use(async (ctx, next) => {
    const start = new Date();
    let ms;
    try {
        await next();
        //请求日志记录
        ms = new Date() - start;
        logUtil.logResponse(ctx, ms);
    } catch (error) {
        //错误日志记录
        ms = new Date() - start;
        logUtil.logError(ctx, error, ms);
    }
});

//Final Error Handle
app.use(error_catch);

//添加格式化处理响应结果的中间件，在添加路由之前调用
app.use(response_formatter('^/api'));

// API路由
app.use(index.routes(), index.allowedMethods());

// 错误处理，显示在控制台
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app;
