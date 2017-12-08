/**
 * Login路由
 */
const router = require('koa-router')();
const loginController = require('../../app/controllers/login');

router.post('/', loginController.login);
router.post('/logOff', loginController.logOff);
router.get('/fetchState', loginController.fetchState);
router.post('/admin', loginController.admin);

module.exports = router;