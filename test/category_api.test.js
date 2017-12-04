const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app.js');

let category_id = null;//存放测试时保存的数据

describe('测试分类API', () => {
    it('获取分类列表', (done) => {
        request(app.listen())
            .get('/api/v1.0/category/list')
            .expect(200)
            .end((err, res) => {
                expect(res.body.data).to.be.an('object');
                done();
            });
    });
    it('创建新分类', (done) => {
        let tag = {
            name: "测试分类"
        };
        request(app.listen())
            .post('/api/v1.0/category/create')
            .send(tag)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end((err, res) => {
                expect(res.body.code).to.be.equal(200);
                done();
            });
    });
    it('根据名称查找分类', (done) => {
        let tag = {
            name: "测试分类"
        };
        request(app.listen())
            .get(encodeURI('/api/v1.0/category/findByName/' + tag.name))
            .expect(200)
            .end((err, res) => {
                expect(res.body.data.results.length).to.be.equal(1);
                category_id = res.body.data.results[0].id;
                done();
            });
    });
    it('根据ID查找分类', (done) => {
        expect(category_id).not.equal(null);
        request(app.listen())
            .get('/api/v1.0/category/findById/' + category_id)
            .expect(200)
            .end((err, res) => {
                expect(res.body.data.results.length).to.be.equal(1);
                done();
            });
    });
    it('更新分类', (done) => {
        expect(category_id).not.equal(null);
        let tag = {
            name: "测试分类2"
        };
        request(app.listen())
            .put('/api/v1.0/category/update/' + category_id)
            .send(tag)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end((err, res) => {
                expect(res.body.code).to.be.equal(200);
                done();
            });
    });
    it('删除分类', (done) => {
        expect(category_id).not.equal(null);
        request(app.listen())
            .delete('/api/v1.0/category/destroy/' + category_id)
            .expect(200)
            .end((err, res) => {
                expect(res.body.code).to.be.equal(200);
                done();
            });
    });
});