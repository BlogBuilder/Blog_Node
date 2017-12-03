//https://segmentfault.com/a/1190000003987871

const Sequelize = require('sequelize');

const config = require('./default');

//创建一个sequelize对象实例：
var sequelize = new Sequelize(config.DATABASE, config.USERNAME, config.PASSWORD, {
    host: config.HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});
var Test = sequelize.define('db_pet', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: Sequelize.STRING
}, {
    timestamps: false,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
});


const write = function () {
    (async() => {
        var dog = await Test.create({
            name: "测试"
        });
        console.log('created: ' + JSON.stringify(dog));
    })();
}

const read = async() => {
    var pets = await Test.findAll({
        where: {
            name: '测试'
        }
    });
    console.log(`find ${pets.length} pets:`);
    for (let p of pets) {
        console.log(JSON.stringify(p));
    }
    return pets;

};

const update = (async() => {
    try {
        var pets = await read();
        for (let p of pets) {
            p.name = "测试2";
            await p.save();
        }
    } catch (err) {
        console.log(err);
    }
});

const deleteData = (async() => {
    try {
        var pets = await read();
        for (let p of pets) {
            await p.destroy();
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = {
    write,
    read,
    update,
    deleteData
};