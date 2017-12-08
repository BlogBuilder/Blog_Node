/**
 * Category Admin 路由
 */
const router = require('koa-router')();
const categoryController = require('../../../app/controllers/admin/category');

router.get('/list/:currentPage', categoryController.list);
router.post('/create', categoryController.create);
router.put('/update/:id', categoryController.update);
router.delete('/destroy/:id', categoryController.destroy);
router.delete('/batchDestroy/:ids', categoryController.batchDestroy);
router.get('/findById/:id', categoryController.findById);
router.get('/findByName/:name', categoryController.findByName);
module.exports = router;