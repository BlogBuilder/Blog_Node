/**
 * Article路由
 */
const router = require('koa-router')();
const articleController = require('../../app/controllers/article');

router.get('/list/:currentPage', articleController.list);
router.post('/create', articleController.create);
router.put('/update/:id', articleController.update);
router.get('/findById/:id', articleController.findById);
router.delete('/destroy/:id', articleController.destroy);

module.exports = router;