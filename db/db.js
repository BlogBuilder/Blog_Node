const Sequelize = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    nick: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '佚名'
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: false
    },
    activation: {
        type: Sequelize.STRING,
        allowNull: false
    },
    state: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    freezeTableName: true,
    tableName: 'db_user',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
    deletedAt: 'delete_time',
    paranoid: true
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
        defaultValue: 0
    },
    viewCount: {
        type: Sequelize.INTEGER,
        notNull: true,
        defaultValue: 0
    }

}, {
    freezeTableName: true,
    tableName: 'db_article',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
    deletedAt: false
});

//素材数据表
const Material = sequelize.define('material', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    path: {
        type: Sequelize.TEXT
    }
}, {
    freezeTableName: true,
    tableName: 'db_material',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
    deletedAt: false
});

//评论数据表
const Comment = sequelize.define('comment', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nick: {
        type: Sequelize.STRING,
        notNull: true,
        defaultValue: 0
    },
    content: {
        type: Sequelize.TEXT,
        notNull: true
    },
    avatar: {
        type: Sequelize.STRING,
        notNull: true
    }
}, {
    freezeTableName: true,
    tableName: 'db_comment',
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
Category.hasMany(Article);

//文章 标签 关联
Article.belongsToMany(Tag, {through: Article_Tag});
Tag.belongsToMany(Article, {through: Article_Tag});

//文章 素材 关联
Material.belongsTo(Article);
Article.hasMany(Material);

//文章 评论  关联
Comment.belongsTo(Article);
Article.hasMany(Comment);
//评论 父级评论 关联
Comment.belongsTo(Comment);
Comment.hasMany(Comment);

module.exports = {
    Tag,
    Category,
    Material,
    Article,
    Comment,
    Article_Tag,
    User
};