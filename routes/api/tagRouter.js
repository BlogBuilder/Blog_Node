/**
 * TAG路由
 */
const router = require('koa-router')();
const tagController = require('../../app/controllers/tag');

router.get('/list', tagController.list);
router.post('/create', tagController.create);
router.put('/update/:id', tagController.update);
router.delete('/destroy/:id', tagController.destroy);
router.get('/findById/:id', tagController.findById);
router.get('/findByName/:name', tagController.findByName);
module.exports = router;