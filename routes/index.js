var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// pinglib
var pinglib = require('pinglib');
var PingUser = pinglib.User;
var GroupService = pinglib.GroupService;
var LeaveService = pinglib.LeaveService;
var clone = require('../common/clone');

router.use(require('./leave'));
router.use(require('./company'));
router.use(require('./groups'));
router.use(require('./users'));

// varaiables
// var routerName = 'users';
// var url = '/' + routerName;
// var urlApi = '/api' + url;

//登入頁面
router.get('/', function(req, res, next) {
    console.log("index...");
    //網站進入點

    pinglib.SessionService.getUserSession(req, res, function(sess_user_data) {
        console.log("sess_user_data.values=" + sess_user_data.values);
        if (null == sess_user_data.values) {

            res.render('index', { title: 'Express' }); //進入輸入頁面
        } else {
            res.redirect('/login', { title: 'Express' }); //進入會員登入menu頁面
        }


    });
});

//登入驗證
router.post('/login', function(req, res, next) {
    var system_parameter = 0;

    var acc = req.body.hr_acc,
        pwd = req.body.hr_pwd;

    userobj = pinglib.User({
        // system_parameter: system_parameter,
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
        var clone_sess_user_data = clone(sess_user_data);
            console.log("layout1sess_fun_data.value=>" + JSON.stringify(clone_sess_user_data.values));
        // console.log(sess_fun_data.values);
        pinglib.SessionService.getMenuSession(req, res, function(menu_data) {
            console.log("layout menu_data.value=>" + JSON.stringify(menu_data.values));
            console.log("layout sess_fun_data.value=>" + JSON.stringify(clone_sess_user_data.values));
            var rtn = [menu_data.values];
            // // rtn.push();
            // try{
            var Today = new Date();
            LeaveService.viewLeaveProcess(clone_sess_user_data.values, Today.getFullYear(), function(leaveData) {
                console.log("leaveData=" + leaveData.values);
                res.render('layout', { clone_sess_user_data: JSON.stringify(clone_sess_user_data.values), menu_tree: menu_data, test: menu_data, leaveData: leaveData }); //進入會員登入menu頁面
            });
            // }catch(e){
            // res.render('layout', { clone_sess_user_data: JSON.stringify(clone_sess_user_data.values), menu_tree: menu_data, test: menu_data }); //進入會員登入menu頁面
            // }
        });
        // res.render('layout', { sess_user_data: sess_fun_data.values });
    });
});

//登出
router.get('/logout', function(req, res, next) {
    // console.log("logout...");
    pinglib.SessionService.cleanUserSession(req, res, function(argument) {
        res.redirect('/');
    });
});

router.get('/meunByUser', function(req, res, next) {
    pinglib.SessionService.getMenuSession(req, res, function(sess_fun_data) {
        // console.log(sess_fun_data.values);
        res.json(sess_fun_data.values);
    });
});



module.exports = router;
