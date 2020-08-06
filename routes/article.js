var express = require('express');
var router = express.Router();
const querySql = require('../db/index');


/* 新增博客接口 */
router.post('/add',async function(req, res, next) {
  console.log(req,1111);
  let {title,content} = req.body;
  let {username} = req.user;
  console.log(req.user,222333);
  try {
    let result = await querySql('select * from user where username = ?', [username]);
    console.log(result,999);
    let {id:user_id,nickname} = result[0];
    await querySql('insert into article(title,content,user_id,username,nickname,create_time) values(?,?,?,?,?,NOW())', [title,content,user_id,username,nickname]);
    res.send({code:1,msg:'新增成功'});
  }catch (e) {
    console.log(e,11112223333);
    next(e);
  }
});
/* 更新博客接口 */
router.post('/update',async function(req, res, next) {
  console.log(req,1111);
  let {id:article_id,title,content} = req.body;
  let {username} = req.user;
  console.log( article_id,title, content,222333);
  try {
    let result1 = await querySql('select id from user where username = ?', [username]);
    console.log(result1,999);
    let user_id = result1[0].id;
    let sql = 'update article set title = ?,content = ? where id = ? and user_id = ?';
    let result = await querySql(sql, [title, content,article_id,user_id]);
    console.log(result);
    res.send({code:1,data:result,msg:'新增成功'});
  }catch (e) {
    console.log(e,11112223333);
    next(e);
  }
});
/* 删除博客接口 */
router.post('/delete',async function(req, res, next) {
  console.log(req,1111);
  let {article_id} = req.body;
  let {username} = req.user;
  console.log( article_id,222333);
  try {
    let result1 = await querySql('select id from user where username = ?', [username]);
    let user_id = result1[0].id;
    let sql = 'delete from article where id = ? and user_id = ?';
    let result = await querySql(sql, [article_id,user_id]);
    console.log(result);
    res.send({code:1,data:result,msg:'删除成功'});
  }catch (e) {
    console.log(e,11112223333);
    next(e);
  }
});
/* 获取全部博客接口 */
router.get('/alllist',async function(req, res, next) {
  try {
    let sql ='select id,nickname,title,content,username,create_time from article';
    let result = await querySql(sql);
    res.send({code:1,data:result,msg:'查询成功'});
  }catch (e) {
    console.log(e,11112223333);
    next(e);
  }
});
/* 获取我的博客接口 */
router.get('/mylist',async function(req, res, next) {
  console.log(req);
  let { username } = req.user;
  try {
    let sql ='select id,title,content,username,create_time from article where username = ?';
    let result = await querySql(sql,[username]);
    res.send({code:1,data:result,msg:'查询成功'});
  }catch (e) {
    console.log(e,11112223333);
    next(e);
  }
});
/* 文章详情接口 */
router.post('/detail',async function(req, res, next) {
  let { article_id } = req.body;
  console.log(req,332312);
  try {
    let sql ='select * from article where id = ?';
    let result = await querySql(sql,[article_id]);
    res.send({code:1,data:result,msg:'查询成功'});
  }catch (e) {
    console.log(e,111122233334);
    next(e);
  }
});

module.exports = router;
