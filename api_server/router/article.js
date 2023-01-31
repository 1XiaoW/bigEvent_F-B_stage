//文章的路由模块
const express = require('express');
const router = express.Router();

//导入需要的处理函数模块
const article_handler = require('../router_handler/article');

//导入multer和path
const multer = require('multer');
const path = require('path');

//创建multer的实例
const uploads = multer({ dest: path.join(__dirname, '../uploads') });

//导入校验模块和校验规则
const expressJoi = require('@escook/express-joi');
const {
  add_article_schema,
  delete_get_article_schema,
  getList_article_schema,
  update_article_schema,
} = require('../schema/article');

//发布文章的路由
router.post(
  '/add',
  uploads.single('cover_img'),
  expressJoi(add_article_schema),
  article_handler.addArticle
);

//获取文章的列表数据
router.get(
  '/list',
  expressJoi(getList_article_schema),
  article_handler.getArticle
);

//根据Id删除文章数据
router.get(
  '/delete/:id',
  expressJoi(delete_get_article_schema),
  article_handler.deleteArticleById
);

//根据Id获取文章详情
router.get(
  '/:id',
  expressJoi(delete_get_article_schema),
  article_handler.getArticleById
);

//根据Id更新文章信息
router.post(
  '/edit',
  uploads.single('cover_img'),
  expressJoi(update_article_schema),
  article_handler.updateArticle
);

module.exports = router;
