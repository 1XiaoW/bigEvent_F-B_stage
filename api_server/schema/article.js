const joi = require('joi');

//分别定义标题、分类Id、内容、发布状态的校验规则
const title = joi.string().required();
const cate_id = joi.number().integer().min(1).required();
const cate_id1 = joi.number().integer().min(1);
const content = joi.string().required().allow('');
const state = joi.string().valid('已发布', '草稿').required();
const state1 = joi.string().valid('已发布', '草稿');

const id = joi.number().integer().min(1).required();
const pagesize = joi.number().integer().min(1).required();
const pagenum = joi.number().integer().min(1).required();

//验证规则对象-发布文章
exports.add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state,
  },
};

//验证规则对象-Id检测
exports.delete_get_article_schema = {
  params: {
    id,
  },
};

//验证规则对象-文章列表检测
exports.getList_article_schema = {
  query: {
    state: state1,
    cate_id: cate_id1,
    pagesize,
    pagenum,
  },
};

//验证规则对象-更新文章检测
exports.update_article_schema = {
  body: {
    Id: id,
    title,
    cate_id,
    content,
    state,
  },
};
