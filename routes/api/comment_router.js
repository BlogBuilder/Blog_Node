/**
 * Comment路由
 */
const router = require('koa-router')();
const comment_controller = require('../../app/controllers/comment');

router.get('/list/:articleId', comment_controller.list);
router.post('/create', comment_controller.create);
router.put('/update/:id', comment_controller.update);
router.delete('/destroy/:id', comment_controller.destroy);
router.get('/findById/:id', comment_controller.findById);
router.get('/findByNick/:nick', comment_controller.findByNick);


module.exports = router;