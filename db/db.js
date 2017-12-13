const Sequelize = require('sequelize');
const sequelize = require('./index');

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
    },
    state: {
        type: Sequelize.INTEGER,
        defaultValue: 1
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
    },
    state: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    }
}, {
    freezeTableName: true,
    tableName: 'db_category',
    timestamps: false
});


//文章数据表
const Article = sequelize.define('article', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: Sequelize.INTEGER,
        notNull: true,
    },
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
    view_count: {
        type: Sequelize.INTEGER,
        notNull: true,
        defaultValue: 0
    }
}, {
    freezeTableName: true,
    tableName: 'db_article',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: false,
    deletedAt: false
});

//素材数据表
const Material = sequelize.define('material', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    material: {
        type: Sequelize.TEXT
    }
}, {
    freezeTableName: true,
    tableName: 'db_article_material',
    timestamps: false
});

//评论数据表
const Comment = sequelize.define('comment', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        notNull: true,
        defaultValue: 0
    },
    content: {
        type: Sequelize.TEXT,
        notNull: true
    },
    photo: {
        type: Sequelize.STRING,
        notNull: true
    },
    state: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    }
}, {
    freezeTableName: true,
    tableName: 'db_comment',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: false,
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
Article.belongsTo(Category, {
    foreignKey: {
        name: "category_id"
    }
});
Category.hasMany(Article, {
    foreignKey: {
        name: "category_id"
    }
});

//文章 标签 关联
Article.belongsToMany(Tag, {
    through: Article_Tag, foreignKey: {
        name: "tag_id"
    }
});
Tag.belongsToMany(Article, {
    through: Article_Tag, foreignKey: {
        name: "article_id"
    }
});


//文章 素材 关联
Material.belongsTo(Article, {
    foreignKey: {
        name: "article_id"
    }
});
Article.hasMany(Material, {
    foreignKey: {
        name: "article_id"
    }
});

//文章 评论  关联
Comment.belongsTo(Article, {
    foreignKey: {
        name: "article_id"
    }
});
Article.hasMany(Comment, {
    foreignKey: {
        name: "article_id"
    }
});
//评论 父级评论 关联
Comment.belongsTo(Comment, {
    foreignKey: {
        name: "parent"
    }
});
Comment.hasMany(Comment, {
    foreignKey: {
        name: "parent"
    }
});


module.exports = {
    Tag,
    Category,
    Material,
    Article,
    Comment,
    Article_Tag
};