/**
 * Login路由
 */
const router = require('koa-router')();
const loginController = require('../../app/controllers/login');

router.post('/', loginController.login);
router.post('/logOff', loginController.logOff);
router.get('/fetchState', loginController.fetchState);

module.exports = router;