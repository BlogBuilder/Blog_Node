/**
 * Comment路由
 */
const router = require('koa-router')();
const commentController = require('../../app/controllers/comment');

router.get('/list/:articleId', commentController.list);
router.post('/create', commentController.create);
router.put('/update/:id', commentController.update);
router.delete('/destroy/:id', commentController.destroy);
router.get('/findById/:id', commentController.findById);
router.get('/findByNick/:nick', commentController.findByNick);

module.exports = router;