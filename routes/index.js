const router = require('koa-router')();

const tagRouter = require('./api/tagRouter');
const categoryRouter = require('./api/categoryRouter');
const articleRouter = require('./api/articleRouter');
const commentRouter = require('./api/commentRouter');
const loginRouter = require('./api/loginRouter');


router.use('/api/v1.0/category', categoryRouter.routes(), categoryRouter.allowedMethods());
router.use('/api/v1.0/tag', tagRouter.routes(), tagRouter.allowedMethods());
router.use('/api/v1.0/article', articleRouter.routes(), articleRouter.allowedMethods());
router.use('/api/v1.0/comment', commentRouter.routes(), commentRouter.allowedMethods());
router.use('/api/v1.0/login', loginRouter.routes(), loginRouter.allowedMethods());


module.exports = router;
