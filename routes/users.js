var express = require('express');
var router = express.Router();
const querySql = require('../db/index');
const {PWD_SALT,PRIVATE_KEY,EXPIRED} = require('../utils/constant');
const {md5,upload} = require('../utils/index');
const jwt = require('jsonwebtoken');


/* 注册接口 */
router.post('/register',async function(req, res, next) {
  let {username,password,nickname} = req.body;
  console.log(username,password,nickname,1);
  try {
    let user =await querySql('select * from user where username = ?', [username]);
    if(!user || user.length === 0){
      password = md5(`${password}${PWD_SALT}`);
      console.log(password,111);
      await querySql('insert into user(username,password,nickname) value(?,?,?)',[username,password,nickname])
      res.send({code:1,msg:'注册成功！'})
    }else{
      res.send({code:-1,msg:'该账户已经注册'})
    }
  }catch (e) {
    console.log(e,11112223333);
    next(e);
  }
});

/* 登陆接口 */
router.post('/login',async function(req, res, next) {
  let {username,password} = req.body;

  try {
    password = md5(`${password}${PWD_SALT}`);
    console.log(username,password,1);
    let user =await querySql('select * from user where username = ? and password = ?', [username,password]);
    if(!user || user.length === 0){
      res.send({code:-1,msg:'账号或密码错误'});
    }else{
      let token = jwt.sign({username},PRIVATE_KEY,{expiresIn:EXPIRED});
      res.send({code:1,msg:'登录成功',token:token});
    }
  }catch (e) {
    console.log(e,11112223333);
    next(e);
  }
});

/* 用户信息接口 */
router.get('/info',async function(req, res, next) {
  try {
    let userinfo =await querySql('select nickname,head_img from user where username = ?', [req.user.username]);
    res.send({code:1,data:userinfo[0],msg:'成功'});
  }catch (e) {
    console.log(e,11112223333);
    next(e);
  }
});

/* 上传接口 */
router.post('/upload',upload.single('head_img'),async function(req, res, next) {
  console.log(req.file,1111);
  let imgPath = req.file.path.split('public')[1];
  let imgUrl = 'http://127.0.0.1:3000'+imgPath;
  res.send({code:1,msg:'上传成功',data:imgUrl});
  // try {
  //   let userinfo =await querySql('select nickname,head_img from user where username = ?', [req.user.username]);
  //   console.log(userinfo,4444);
  //   res.send({code:1,data:userinfo[0],msg:'成功'});
  // }catch (e) {
  //   console.log(e,11112223333);
  //   next(e);
  // }
});

/* 用户信息更新接口 */
router.post('/updateUser',async function(req, res, next) {
  console.log(req,1111);
  let {nickname,head_img} = req.body;
  let {username} = req.user;
  try {
    let result = await querySql('update user set nickname = ?,head_img = ?  where username = ?', [nickname,head_img,username]);
    console.log(result,4444);
    res.send({code:1,data:result[0],msg:'更新成功'});
  }catch (e) {
    console.log(e,11112223333);
    next(e);
  }
});

module.exports = router;
