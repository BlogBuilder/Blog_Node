/**
 * Blog 标签路由
 */
var router = require('koa-router')();
var tag_controller = require('../../app/controllers/tag_controller');

router.get('/getUser', tag_controller.getuser);
router.post('/registeruser', tag_controller.registeruser);

module.exports = router;