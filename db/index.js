//https://segmentfault.com/a/1190000003987871

const Sequelize = require('sequelize');

const config = require('./default');

const sequelize = new Sequelize(config.DATABASE, config.USERNAME, config.PASSWORD, {
    host: config.HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

//标签数据表
const Tag = sequelize.define('tag', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
}, {
    freezeTableName: true,
    tableName: 'db_tag',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
    deletedAt: false
});

//分类数据表
const Category = sequelize.define('category', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
}, {
    freezeTableName: true,
    tableName: 'db_category',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
    deletedAt: false
});

//文章数据表
const Article = sequelize.define('article', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: Sequelize.INTEGER,
    title: {
        type: Sequelize.STRING,
        length: 100
    },
    summary: {
        type: Sequelize.STRING,
        length: 2000
    },
    content: Sequelize.TEXT,
    state: {
        type: Sequelize.INTEGER,
        notNull: true,
        default: 0
    },
    viewCount: {
        type: Sequelize.INTEGER,
        notNull: true,
        default: 0
    }

}, {
    freezeTableName: true,
    tableName: 'db_article',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
    deletedAt: false
});


//文章 标签 中间表
const Article_Tag = sequelize.define('article_tag', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    freezeTableName: true,
    tableName: 'db_article_tag',
    timestamps: false
});

//文章 分类 关联
Article.belongsTo(Category);
// Category.hasMany(Article);

//文章 标签 关联
Article.belongsToMany(Tag, {through: Article_Tag});
Tag.belongsToMany(Article, {through: Article_Tag});


module.exports = {
    Tag,
    Category,
    Article,
    Article_Tag
};