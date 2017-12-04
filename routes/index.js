const router = require('koa-router')();

const tag_router = require('./api/tag_router');


router.use('/api/v1.0/tag', tag_router.routes(), tag_router.allowedMethods())

module.exports = router;
