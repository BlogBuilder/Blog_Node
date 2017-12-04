const router = require('koa-router')();

const tag_router = require('./api/tag_router');
const category_router = require('./api/category_router');

router.use('/api/v1.0/category', category_router.routes(), category_router.allowedMethods());
router.use('/api/v1.0/tag', tag_router.routes(), tag_router.allowedMethods());


module.exports = router;
