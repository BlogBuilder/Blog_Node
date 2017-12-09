/**
 * Article路由
 */
const router = require('koa-router')();
const uploadController = require('../../../app/controllers/admin/upload');

router.get('/fetchContent', uploadController.fetchContent);
router.post('/uploadFIle', uploadController.uploadLocalFIle);
router.post('/uploadLinkFile', uploadController.uploadLinkFile);

module.exports = router;