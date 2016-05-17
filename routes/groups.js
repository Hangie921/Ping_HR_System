// node modules
var express = require('express'),
    router = express.Router(),
    async = require('async'),
    uuid = require('node-uuid');

// pinglib
var pinglib = require('pinglib');
var resCode = pinglib.response;
var HrGroup = pinglib.Group;
// var UserService = pinglib.UserService;

// router.get('/users', function(req, res, next) {
//     console.log("user in....");

//     var sys_params = 0;
//     res.render('users', {genId: uuid.v1() });
// });
// varaiables
var routerName = 'groups';
var url = '/' + routerName;
var urlApi = '/api' + url;

router.get(url, function(req, res, next) {
    console.log("groups in....");
    pinglib.SessionService.getUserSession(req, res, function(sess_user_data) {
        if (null == sess_user_data.values) {
            res.render('index', { title: 'Express' }); //進入輸入頁面
        } else {
            //getGroupList,getGroup
            pinglib.GroupService.getGroup(sess_user_data.values[0].system_parameter, function(groupsData) {
                res.render(routerName, { groups: groupsData ,user_login_system_parameter:sess_user_data.values[0].system_parameter,genId: uuid.v1()});
            });
            // res.render(routerName, { title: 'Express' });
        }
        // res.render('groups', { title: 'Express' });
    });
});

router.post(url + '/:act', function(req, res, next) {
    var group = new HrGroup();
    group.system_parameter = req.body.system_parameter;
    group._id = req.body._id;
    group.parent_id = req.body.parent_id;
    group.name = req.body.name;

    var redirectTarget = "/groups";
    switch(req.params.act) {
//      case 'edit':
//          user._id = req.body._id;
//          UserService.setUserById(user,function (data) {
//              res.send({redirect: redirectTarget});
//          });
//          break;
//      case 'remove':
//          HrUser.find({ _id:req.body._id }).remove().exec();
//          res.send({redirect: redirectTarget});
//          break;
     case 'new':
         pinglib.GroupService.setGroup(group,function (data) {
             console.log("group rtn="+data);
             res.send({redirect: redirectTarget});
         });
         break;
//      default:
//          res.send('no result');
//          break;
    }
});



router.get('/groupBySys', function(req, res, next) {
    pinglib.SessionService.getUserSession(req, res, function(sess_user_data) {
        pinglib.GroupService.getGroup(sess_user_data.values[0].system_parameter, function(groupJson) {
            res.json(groupJson);
        });
    });
});

router.get('/groupListBySys', function(req, res, next) {
    pinglib.SessionService.getUserSession(req, res, function(sess_user_data) {
        pinglib.GroupService.getGroupList(sess_user_data.values[0].system_parameter, function(groupJson) {
            res.json(groupJson);
        });
    });
});
module.exports = router;
