const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app.js');

let article_id = null;//存放测试时保存的数据

//生成随机标题
const guid = () => {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};
let article_title = guid();//保存测试文章的标题

describe('测试文章API', () => {
    it('获取文章列表', (done) => {
        let query = "categoryId=1&key=UI&create_time=2017-10&tagsId[]=1&tagsId[]=2";
        request(app.listen())
            .get('/api/v1.0/article/list/1?' + query)
            .expect(200)
            .end((err, res) => {
                expect(res.body.data).to.be.an('object');
                done();
            });

    });
    it('创建新文章', (done) => {
        let article = {
            "type": 1,
            "title": article_title,
            "summary": "更新HTTPS（全称：Hyper Text Transfer Protocol over Secure Socket Layer），是以安全为目标的HTTP通道，简单讲是HTTP的安全版。",
            "content": "<p>更新正如大家所看到的，当归全站已经启用了Https访问了，连续几天的网站安装和调试SSL终于可以告一段落了。</p><p>经过几个月的逐步测试，现在，我们终于将博客全站切换到 HTTPS。大家在浏览文章的时候，可以在浏览器地址栏看到如下效果：</p><p><img src=\"http://cdn.qulongjun.cn/resource/vgXyrE0YlX.png\" style=\"max-width:100%;\"><br>HTTPS 相比 HTTP，简单来说就是加密了传输过程和数据，有了这层加密，好处主要有两点。</p><p>首先，更好地保护了大家的隐私。在 HTTP 时代，你的所有浏览数据都是明文和服务器之间交互的，可能会被窃取和修改。比如在公共场合连接的 WIFI 热点。使用 HTTPS 以后，因为对于传输过程和数据都进行了加密，避免了中间节点的监听，密码和隐私泄露风险得到很大程度的降低。</p><p>其次，HTTPS 还可以防止运营商劫持流量，给精美的博客页面上插一个弹窗广告。也就是说，大家在访问博客时，可以不被流量劫持插入的广告打扰了。</p><p>推进全站 HTTPS 肯定不是在 HTTP 后面加上个 S 那么简单，比如， HTTPS 相比 HTTP 多了证书交换和加密的过程，所以当设备较老旧的情况下，会遇到的性能问题；HTTPS 没法安全加载 HTTP 链接内容，而且部分资源网站不支持 HTTPS，所以导致部分资源没法嵌套在我们的页面内。此外，我们还遇到了很多其他问题，经过我们的不断尝试和努力，大部分技术上的难点已经克服，但是也有些设计上的细节需要后续不断调整完善。</p><p>面临日益复杂的互联网环境，以及日益严重的隐私泄露问题，我们希望通过技术上的努力，给大家提供更安全的服务和更好的体验。</p>",
            "state": 1,
            "categoryId": 1,
            "tags": [1],
            "materials": ["http://cdn.qulongjun.cn/resource/mrZt1LlJkh.jpeg", "http://cdn.qulongjun.cn/resource/Yn6rGR7WTa.jpg"]
        };
        request(app.listen())
            .post('/api/v1.0/article/create')
            .send(article)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end((err, res) => {
                expect(res.body.code).to.be.equal(200);
                done();
            });
    });
    it('查找该文章', (done) => {
        let query = "key=" + article_title;
        request(app.listen())
            .get('/api/v1.0/article/list/1?' + query)
            .expect(200)
            .end((err, res) => {
                expect(res.body.data).to.be.an('object');
                expect(res.body.data.results.length).equal(1);
                article_id = res.body.data.results[0].id;
                done();
            });
    });
    it('根据ID查找文章', (done) => {
        expect(article_id).not.equal(null);
        request(app.listen())
            .get('/api/v1.0/article/findById/' + article_id)
            .expect(200)
            .end((err, res) => {
                expect(res.body.data.results.length).equal(1);
                done();
            });
    });
    it('更新文章', (done) => {
        expect(article_id).not.equal(null);
        let article = {
            "type": 2,
            "title": article_title,
            "summary": "【修改】更新HTTPS（全称：Hyper Text Transfer Protocol over Secure Socket Layer），是以安全为目标的HTTP通道，简单讲是HTTP的安全版。",
            "content": "<p>更新正如大家所看到的，当归全站已经启用了Https访问了，连续几天的网站安装和调试SSL终于可以告一段落了。</p><p>经过几个月的逐步测试，现在，我们终于将博客全站切换到 HTTPS。大家在浏览文章的时候，可以在浏览器地址栏看到如下效果：</p><p><img src=\"http://cdn.qulongjun.cn/resource/vgXyrE0YlX.png\" style=\"max-width:100%;\"><br>HTTPS 相比 HTTP，简单来说就是加密了传输过程和数据，有了这层加密，好处主要有两点。</p><p>首先，更好地保护了大家的隐私。在 HTTP 时代，你的所有浏览数据都是明文和服务器之间交互的，可能会被窃取和修改。比如在公共场合连接的 WIFI 热点。使用 HTTPS 以后，因为对于传输过程和数据都进行了加密，避免了中间节点的监听，密码和隐私泄露风险得到很大程度的降低。</p><p>其次，HTTPS 还可以防止运营商劫持流量，给精美的博客页面上插一个弹窗广告。也就是说，大家在访问博客时，可以不被流量劫持插入的广告打扰了。</p><p>推进全站 HTTPS 肯定不是在 HTTP 后面加上个 S 那么简单，比如， HTTPS 相比 HTTP 多了证书交换和加密的过程，所以当设备较老旧的情况下，会遇到的性能问题；HTTPS 没法安全加载 HTTP 链接内容，而且部分资源网站不支持 HTTPS，所以导致部分资源没法嵌套在我们的页面内。此外，我们还遇到了很多其他问题，经过我们的不断尝试和努力，大部分技术上的难点已经克服，但是也有些设计上的细节需要后续不断调整完善。</p><p>面临日益复杂的互联网环境，以及日益严重的隐私泄露问题，我们希望通过技术上的努力，给大家提供更安全的服务和更好的体验。</p>",
            "state": 1,
            "categoryId": 1,
            "tags": [1],
            "materials": ["http://cdn.qulongjun.cn/resource/mrZt1LlJkh.jpeg", "http://cdn.qulongjun.cn/resource/Yn6rGR7WTa.jpg"]
        };
        request(app.listen())
            .put('/api/v1.0/article/update/' + article_id)
            .send(article)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end((err, res) => {
                expect(res.body.code).to.be.equal(200);
                done();
            });
    });
    it('删除文章', (done) => {
        expect(article_id).not.equal(null);
        request(app.listen())
            .delete('/api/v1.0/article/destroy/' + article_id)
            .expect(200)
            .end((err, res) => {
                expect(res.body.code).to.be.equal(200);
                done();
            });
    });


});