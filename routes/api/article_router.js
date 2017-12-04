/**
 * TAG路由
 */
const router = require('koa-router')();
const article_controller = require('../../app/controllers/article');

router.get('/list/:currentPage', article_controller.list);
router.post('/create', article_controller.create);
module.exports = router;