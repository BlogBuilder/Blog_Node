const router = require('koa-router')();

const tag_router = require('./api/tag_router');
const category_router = require('./api/category_router');
const article_router = require('./api/article_router');
const comment_router = require('./api/comment_router');


router.use('/api/v1.0/category', category_router.routes(), category_router.allowedMethods());
router.use('/api/v1.0/tag', tag_router.routes(), tag_router.allowedMethods());
router.use('/api/v1.0/article', article_router.routes(), article_router.allowedMethods());
router.use('/api/v1.0/comment', comment_router.routes(), comment_router.allowedMethods());


module.exports = router;
