//https://segmentfault.com/a/1190000003987871

const Sequelize = require('sequelize');

const config = require('./default');
let system = require('../config');


const sequelize = new Sequelize(config.DATABASE, config.USERNAME, config.PASSWORD, {
    host: config.HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    },
    logging: system.env === "development"
});

module.exports = sequelize;