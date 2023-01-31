//这是路由处理函数模块

//导入数据库操作模块
const db = require('../db/index');

//获取文章分类列表的处理函数
exports.getArtCates = (req, res) => {
  //定义查询分类列表数据的sql语句
  const sql = 'select * from ev_article_cate where is_delete=0 order by id';
  //调用db.query()执行sql语句
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      message: '获取文章分类数据成功！',
      data: results,
    });
  });
};

//新增文章分类列表的处理函数
//TODO:此处有bug如果你将分类删除后，想添加与刚删除的分类相同的名称与别名将会进入如下判断导致数据库含有重名的分类但是已经标记为删除。
//解决方案：
//1.改变表的结构（一劳永逸）直接删除分类不进行删除标记，但是可能会出现新的bug或安全性
//2.改变sql语句仅判断is_delete=0的数据，也要改变表的结构。具体自己思考
//以上仅是个人瞬间浮想出来的，没有经过准确的思考，仅供参考
exports.addArtCates = (req, res) => {
  //1.定义查重的sql语句
  const sql = 'select * from ev_article_cate where name=? or alias=?';
  //2.执行查重的sql语句
  db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    //3.判断是否执行sql语句失败
    if (err) return res.cc(err);
    //4.1判断数据的length
    if (results.length === 2)
      return res.cc('分类名称与分类别名被占用，请更换后重试！');
    //4.2length等于1的三种情况
    if (
      results.length === 1 &&
      results[0].name === req.body.name &&
      results[0].alias === req.body.alias
    )
      return res.cc('分类名称与分类别名被占用，请更换后重试！');
    if (results.length === 1 && results[0].name === req.body.name)
      return res.cc('分类名称被占用，请更换后重试！');
    if (results.length === 1 && results[0].alias === req.body.alias)
      return res.cc('分类别名被占用，请更换后重试！');

    //定义插入文章分类的sql语句
    const sql = 'insert into ev_article_cate set ?';
    //执行插入文章分类的sql语句
    db.query(sql, req.body, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc('新增文章分类失败！');
      res.cc('新增文章分类成功！', 0);
    });
  });
};

//删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
  const sql = 'update ev_article_cate set is_delete=1 where id=?';
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('删除文章分类失败！');
    //当分类删除时，默认文章列表对应分类的文章全删除
    const sql = 'update ev_articles set is_delete=1 where cate_id=?';
    db.query(sql, req.params.id, (err, results) => {
      if (err) return res.cc(err);
      res.cc('删除文章分类成功！', 0);
    });
  });
};

//根据Id获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
  const sql = 'select * from ev_article_cate where id=?';
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('获取文章分类失败！');
    res.send({
      status: 0,
      message: '获取文章分类成功！',
      data: results[0],
    });
  });
};

//根据Id更新文章分类的处理函数
exports.updateArtCateById = (req, res) => {
  //定义查重的sql语句
  const sql =
    'select * from ev_article_cate where Id<>? and (name=? or alias=?)';
  db.query(
    sql,
    [req.body.Id, req.body.name, req.body.alias],
    (err, results) => {
      if (err) return res.cc(err);
      //判断名称和别名被占用的4种情况
      if (results.length === 2)
        return res.cc('分类名称与分类别名被占用，请更换后重试！');
      if (
        results.length === 1 &&
        results[0].name === req.body.name &&
        results[0].alias === req.body.alias
      )
        return res.cc('分类名称与分类别名被占用，请更换后重试！');
      if (results.length === 1 && results[0].name === req.body.name)
        return res.cc('分类名称被占用，请更换后重试！');
      if (results.length === 1 && results[0].alias === req.body.alias)
        return res.cc('分类别名被占用，请更换后重试！');
      const sql = 'update ev_article_cate set ? where id=?';
      db.query(sql, [req.body, req.body.Id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('更新文章分类失败！');
        res.cc('更新文章分类成功！', 0);
      });
    }
  );
};
