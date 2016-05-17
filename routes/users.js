// node modules
var express = require('express'),
    router = express.Router(),
    async = require('async'),
    uuid = require('node-uuid');

// pinglib
var pinglib = require('pinglib');
var resCode = pinglib.response;
var HrUser = pinglib.User;
var UserService = pinglib.UserService;

// router.get('/users', function(req, res, next) {
//     console.log("user in....");
//     var sys_params = 0;
//     res.render('users', {genId: uuid.v1() });
// });
// varaiables
var routerName = 'users';
var url = '/' + routerName;
var urlApi = '/api' + url;

router.get(url, function(req, res, next) {
    console.log("users in...."+req.query.name_search+"|"+req.params.name_search);
    pinglib.SessionService.getUserSession(req, res, function(sess_user_data) {
    	if (null == sess_user_data.values) {
            res.render('index', { title: 'Express' }); //進入輸入頁面
        } else {
        	var hrUser = new HrUser();
        	hrUser.system_parameter = sess_user_data.values[0].system_parameter;
        	if(req.query.name_search){
        		hrUser.name = req.query.name_search;
        	}
	    	UserService.getColleague(hrUser,function (serach_user_data) {
        		console.log("users search..."+serach_user_data.values);
                pinglib.GroupService.getGroup(sess_user_data.values[0].system_parameter, function(groupsData) {
            	   res.render(routerName, { groups: groupsData ,users: serach_user_data.values,nameSearchValue: req.query.name_search,
                    user_login_system_parameter:sess_user_data.values[0].system_parameter,user_login_company:sess_user_data.values[0].company_id});
                });
	    	});
        }
    });
});

router.post(url + '/:act', function(req, res, next) {
    var user = new HrUser();
    user.system_parameter = req.body.system_parameter;
    user.name = req.body.name;
    user.email = req.body.email;
    user.pwd = req.body.pwd;
    user.company_id = req.body.company_id;
    user.available_date = req.body.available_date;
    user.group_id = req.body.group_id;

    var redirectTarget = "/users";
    switch(req.params.act) {
    	case 'edit':
    		user._id = req.body._id;
    		UserService.setUserById(user,function (data) {
    			res.send({redirect: redirectTarget});
    		});
    		break;
    	case 'remove':
    		HrUser.find({ _id:req.body._id }).remove().exec();
    		res.send({redirect: redirectTarget});
    		break;
    	case 'new':
    		UserService.registered(user,function (data) {
    			res.send({redirect: '/users'});
    		});
    		break;
    	default:
    		res.send('no result');
    		break;
    }
});


router.get('/search/:name_search', function(req, res, next) {
	var searchObj = new HrUser();
	searchObj.system_parameter = 0;
	searchObj.name = req.params.name_search;
	UserService.getColleague(searchObj ,function (search_data) {
		res.send({data:search_data});
	});
});

module.exports = router;
