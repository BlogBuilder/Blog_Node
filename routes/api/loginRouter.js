/**
 * Login路由
 */
const router = require('koa-router')();
const loginController = require('../../app/controllers/login');

router.get('/login', loginController.login);


module.exports = router;