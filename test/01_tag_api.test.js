const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app.js');

let tag_id = null;//存放测试时保存的数据

describe('测试标签API', () => {
    it('获取标签列表', (done) => {
        request(app.listen())
            .get('/api/v1.0/tag/list')
            .expect(200)
            .end((err, res) => {
                expect(res.body.data).to.be.an('object');
                done();
            });
    });
    it('创建新标签', (done) => {
        let tag = {
            name: "测试标签"
        };
        request(app.listen())
            .post('/api/v1.0/tag/create')
            .send(tag)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end((err, res) => {
                expect(res.body.code).to.be.equal(200);
                done();
            });
    });
    it('根据名称查找标签', (done) => {
        let tag = {
            name: "测试标签"
        };
        request(app.listen())
            .get(encodeURI('/api/v1.0/tag/findByName/' + tag.name))
            .expect(200)
            .end((err, res) => {
                expect(res.body.data.results.length).to.be.equal(1);
                tag_id = res.body.data.results[0].id;
                done();
            });
    });
    it('根据ID查找标签', (done) => {
        expect(tag_id).not.equal(null);
        request(app.listen())
            .get('/api/v1.0/tag/findById/' + tag_id)
            .expect(200)
            .end((err, res) => {
                expect(res.body.data.results.length).to.be.equal(1);
                done();
            });
    });
    it('更新标签', (done) => {
        expect(tag_id).not.equal(null);
        let tag = {
            name: "测试标签2"
        };
        request(app.listen())
            .put('/api/v1.0/tag/update/' + tag_id)
            .send(tag)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end((err, res) => {
                expect(res.body.code).to.be.equal(200);
                done();
            });
    });
    it('删除标签', (done) => {
        expect(tag_id).not.equal(null);
        request(app.listen())
            .delete('/api/v1.0/tag/destroy/' + tag_id)
            .expect(200)
            .end((err, res) => {
                expect(res.body.code).to.be.equal(200);
                done();
            });
    });
});