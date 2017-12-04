/**
 * TAG路由
 */
const router = require('koa-router')();
const tag_controller = require('../../app/controllers/tags');

router.get('/list', tag_controller.list);
router.post('/create', tag_controller.create);
router.put('/update/:id', tag_controller.update);
router.delete('/destroy/:id', tag_controller.destroy);
router.get('/findById/:id', tag_controller.findById);
router.get('/findByName/:name', tag_controller.findByName);
module.exports = router;