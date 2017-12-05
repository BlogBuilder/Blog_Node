/**
 * Category路由
 */
const router = require('koa-router')();
const category_controller = require('../../app/controllers/category');

router.get('/list', category_controller.list);
router.post('/create', category_controller.create);
router.put('/update/:id', category_controller.update);
router.delete('/destroy/:id', category_controller.destroy);
router.get('/findById/:id', category_controller.findById);
router.get('/findByName/:name', category_controller.findByName);
module.exports = router;