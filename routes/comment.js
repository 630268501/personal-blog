var express = require('express');
var router = express.Router();
const querySql = require('../db/index');

/* 新增评论接口 */
router.post('/public',async function(req, res, next) {
    console.log(req,1111);
    let {article_id,content,nickname} = req.body;
    let {username} = req.user;
    console.log(username,article_id, content,222333);
    try {
        let result = await querySql('select id,head_img from user where username = ?', [username]);
        console.log(result,999);
        let {id:user_id,head_img} = result[0];
        await querySql('insert into comment(cm_content,user_id,article_id,head_img,username,nickname,create_time) values(?,?,?,?,?,?,NOW())', [content,user_id,article_id,head_img,username,nickname]);
        res.send({code:1,msg:'新增成功'});
    }catch (e) {
        console.log(e,11112223333);
        next(e);
    }
});

/* 评论列表接口 */
router.post('/list',async function(req, res, next) {
    console.log(req,1111);
    let {article_id} = req.body;
    try {
        let result = await querySql('select * from comment where article_id = ? order by create_time desc', [article_id]);
        console.log(result,999);
        res.send({code:1,data:result,msg:'新增成功'});
    }catch (e) {
        console.log(e,11112223333);
        next(e);
    }
});
module.exports = router;