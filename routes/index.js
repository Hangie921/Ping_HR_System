var express = require('express');
var router = express.Router();
var pinglib = require('pinglib');

//登入頁面
router.get('/', function(req, res, next) {
    console.log("index...");
    //網站進入點

    pinglib.SessionService.getMenuSession(req, res, function(menu_data) {
        console.log(menu_data.value);
    });
    pinglib.SessionService.getUserSession(req, res, function(sess_user_data) {
        if (null == sess_user_data.values) {
            res.render('index', { title: 'Express' }); //進入輸入頁面
        } else {
            res.redirect('/login'); //進入會員登入menu頁面
        }


    });
});

//登入驗證
router.post('/login', function(req, res, next) {
    var system_parameter = 0;

    var acc = req.body.hr_acc,
        pwd = req.body.hr_pwd;

    userobj = pinglib.User({
        system_parameter: system_parameter,
        email: acc,
        pwd: pwd
    });

    pinglib.SessionService.login(req, res, userobj, function(user_data) {
        res.json(user_data);
    });
});

//登入後 畫面輸出
router.get('/layout', function(req, res, next) {
    pinglib.SessionService.getUserSession(req, res, function(sess_user_data) {
        res.render('layout', { sess_user_data: sess_fun_data.values });
    });
});

//登出
router.get('/logout', function(req, res, next) {
    console.log("logout...");
    pinglib.SessionService.cleanUserSession(req, res, function(argument) {
        res.redirect('/');
    });
});

router.get('/meunByUser', function(req, res, next) {
    pinglib.SessionService.getMenuSession(req, res, function(sess_fun_data) {
        res.json(sess_fun_data.values);
    });
});
module.exports = router;
