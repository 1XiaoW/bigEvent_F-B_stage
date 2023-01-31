//文章的处理函数模块

const path = require('path');
const db = require('../db/index');

//发布文章的处理函数
exports.addArticle = (req, res) => {
  if (!req.file || req.file.fieldname !== 'cover_img')
    return res.cc('文章封面是必选参数！');

  //处理文章的信息对象
  const articleInfo = {
    //标题、内容、发布状态、所属分类的Id
    ...req.body,
    //文章封面的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    //文章的发布时间
    pub_date: new Date(),
    //文章作者的Id
    author_id: req.auth.id,
  };
  const sql = 'insert into ev_articles set ?';
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('发布新文章失败！');
    res.cc('发布文章成功！', 0);
  });
};

//获取文章的处理函数
exports.getArticle = (req, res) => {
  const sql =
    'SELECT a.Id,a.title,a.pub_date,a.state,b.name as cate_name FROM ev_articles as a,ev_article_cate as b where a.cate_id=b.Id and a.is_delete=0 and a.state=ifnull(?, a.state) and a.cate_id = ifnull(?, a.cate_id) order by a.id limit ?,?';
  db.query(
    sql,
    [
      req.query.state || null,
      req.query.cate_id || null,
      req.query.pagesize * req.query.pagenum - req.query.pagesize,
      req.query.pagesize * 1,
    ], //传过来的值为‘1’字符乘与1将其转换为数字1
    (err, results) => {
      if (err) return res.cc(err);
      const sql = 'SELECT * FROM ev_articles where is_delete=0';
      db.query(sql, (err, results1) => {
        if (err) return res.cc(err);
        res.send({
          status: 0,
          message: '获取文章列表成功！',
          data: [...results],
          total: results1.length,
        });
      });
    }
  );
  // res.send('ok');
};

//通过Id删除文章的处理函数
exports.deleteArticleById = (req, res) => {
  const sql = 'update ev_articles set is_delete=1 where Id=?';
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('文章删除失败！');
    res.cc('文章删除成功！', 0);
  });
};

//根据Id获取文章详情的处理函数
exports.getArticleById = (req, res) => {
  const sql = 'select * from ev_articles where Id=?';
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    console.log(results);
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results[0],
    });
  });
};
//根据Id更新文章信息的处理函数
exports.updateArticle = (req, res) => {
  //手动检验文件上传
  if (!req.file || req.file.fieldname !== 'cover_img')
    return res.cc('文章封面是必选参数！');

  //处理文章的信息对象
  const articleInfo = {
    //标题、内容、发布状态、所属分类的Id
    ...req.body,
    //文章封面的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    //文章的发布时间
    pub_date: new Date(),
  };
  const sql = 'update ev_articles set ? where Id=?';
  db.query(sql, [articleInfo, req.body.Id], (err, results) => {
    console.log(articleInfo);
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('更新文章失败！');
    res.cc('更新文章成功！', 0);
  });
};
