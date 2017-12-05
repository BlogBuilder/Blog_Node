const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app.js');

//生成随机标题
const guid = () => {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};
let comment_id = null;//存放测试时保存的数据
let comment_name = guid();
let articleId = null;
describe('测试评论API', () => {
    it('获取评论列表', (done) => {

        request(app.listen())
            .get('/api/v1.0/article/list/1')
            .expect(200)
            .end((err, res) => {
                expect(res.body.data).to.be.an('object');
                articleId = res.body.data.results[0].id;
                request(app.listen())
                    .get('/api/v1.0/comment/list/' + articleId)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.data).to.be.an('object');
                        done();
                    });
            });
    });
    it('创建新评论', (done) => {
        let comment = {
            "content": guid(),
            "nick": comment_name,
            "avatar": "http://cdn.qulongjun.cn/touxiang.jpg",
            "articleId": 2
        };
        request(app.listen())
            .post('/api/v1.0/comment/create')
            .send(comment)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end((err, res) => {
                expect(res.body.code).to.be.equal(200);
                done();
            });
    });
    it('根据昵称查找评论', (done) => {
        request(app.listen())
            .get(encodeURI('/api/v1.0/comment/findByNick/' + comment_name))
            .expect(200)
            .end((err, res) => {
                expect(res.body.data.results.length).to.be.equal(1);
                comment_id = res.body.data.results[0].id;
                done();
            });
    });
    it('根据ID查找评论', (done) => {
        expect(comment_id).not.equal(null);
        request(app.listen())
            .get('/api/v1.0/comment/findById/' + comment_id)
            .expect(200)
            .end((err, res) => {
                expect(res.body.data.results.length).to.be.equal(1);
                done();
            });
    });
    it('更新评论', (done) => {
        expect(comment_id).not.equal(null);
        let comment = {
            "content": guid(),
            "nick": comment_name,
            "avatar": "http://cdn.qulongjun.cn/touxiang.jpg"
        };
        request(app.listen())
            .put('/api/v1.0/comment/update/' + comment_id)
            .send(comment)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end((err, res) => {
                expect(res.body.code).to.be.equal(200);
                done();
            });
    });
    it('删除评论', (done) => {
        expect(comment_id).not.equal(null);
        request(app.listen())
            .delete('/api/v1.0/comment/destroy/' + comment_id)
            .expect(200)
            .end((err, res) => {
                expect(res.body.code).to.be.equal(200);
                done();
            });
    });
});