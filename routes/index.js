const router = require('koa-router')();


//前端页面路由配置

const tagRouter = require('./api/tagRouter');
const categoryRouter = require('./api/categoryRouter');
const articleRouter = require('./api/articleRouter');
const commentRouter = require('./api/commentRouter');
const loginRouter = require('./api/loginRouter');
const userRouter = require('./api/userRouter');

router.use('/api/v1.0/category', categoryRouter.routes(), categoryRouter.allowedMethods());
router.use('/api/v1.0/tag', tagRouter.routes(), tagRouter.allowedMethods());
router.use('/api/v1.0/article', articleRouter.routes(), articleRouter.allowedMethods());
router.use('/api/v1.0/comment', commentRouter.routes(), commentRouter.allowedMethods());
router.use('/api/v1.0/login', loginRouter.routes(), loginRouter.allowedMethods());
router.use('/api/v1.0/user', userRouter.routes(), userRouter.allowedMethods());


//后台管理系统路由配置

const tagRouterAdmin = require('./api/admin/tagRouter');
const categoryRouterAdmin = require('./api/admin/categoryRouter');
const articleRouterAdmin = require('./api/admin/articleRouter');
// const commentRouterAdmin = require('./api/admin/commentRouter');
// const loginRouterAdmin = require('./api/admin/loginRouter');
// const userRouterAdmin = require('./api/admin/userRouter');
const uploadRouterAdmin = require('./api/admin/uploadRouter');


router.use('/api/v1.0/admin/category', categoryRouterAdmin.routes(), categoryRouterAdmin.allowedMethods());
router.use('/api/v1.0/admin/tag', tagRouterAdmin.routes(), tagRouterAdmin.allowedMethods());
router.use('/api/v1.0/admin/article', articleRouterAdmin.routes(), articleRouterAdmin.allowedMethods());
// router.use('/api/v1.0/admin/comment', commentRouterAdmin.routes(), commentRouterAdmin.allowedMethods());
// router.use('/api/v1.0/admin/login', loginRouterAdmin.routes(), loginRouterAdmin.allowedMethods());
// router.use('/api/v1.0/admin/user', userRouterAdmin.routes(), userRouterAdmin.allowedMethods());

router.use('/api/v1.0/admin/upload', uploadRouterAdmin.routes(), uploadRouterAdmin.allowedMethods());


module.exports = router;
