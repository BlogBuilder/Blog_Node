/**
 * TAG Admin路由
 */
const router = require('koa-router')();
const tagController = require('../../../app/controllers/admin/tag');

router.get('/list/:currentPage', tagController.list);
router.post('/create', tagController.create);
router.put('/update/:id', tagController.update);
router.delete('/destroy/:id', tagController.destroy);
router.delete('/batchDestroy/:ids', tagController.batchDestroy);
router.get('/findById/:id', tagController.findById);
router.get('/findByName/:name', tagController.findByName);
module.exports = router;