const router = require('koa-router')()

const user_router = require('./api/user_router');
const tag_router = require('./api/tag_router');
router.get('/', async(ctx, next) => {
    await ctx.render('index', {
        title: 'Hello Koa 2!'
    })
})

router.get('/string', async(ctx, next) => {
    ctx.body = 'koa2 string'
})

router.get('/json', async(ctx, next) => {
    ctx.body = {
        title: 'koa2 json'
    }
})

router.use('/api/users', user_router.routes(), user_router.allowedMethods());
router.use('/api/v1/tags', tag_router.routes(), tag_router.allowedMethods())

module.exports = router
