const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const logUtil = require('./utils/log_utils');


const DB = require('./db/db');

const index = require('./routes/index')
const response_formatter = require('./middlewares/response_formatter');
const error_catch = require('./middlewares/error_catch');

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'pug'
}));

for (let key in DB)
    DB[key].sync();

// logger
app.use(async(ctx, next) => {
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
    } finally {
        //打印在控制台
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    }
});

//Final Error Handle
app.use(error_catch);

//添加格式化处理响应结果的中间件，在添加路由之前调用
app.use(response_formatter('^/api'));

// routes
app.use(index.routes(), index.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
