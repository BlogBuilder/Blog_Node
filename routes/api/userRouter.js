/**
 * User路由
 */
const router = require('koa-router')();
const userController = require('../../app/controllers/user');

router.post('/register', userController.register);
router.put('/update', userController.update);

module.exports = router;