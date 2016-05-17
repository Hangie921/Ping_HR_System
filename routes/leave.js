// node modules
var express = require('express'),
    router = express.Router(),
    async = require('async'),
    uuid = require('node-uuid');

// module

// pinglib
var pinglib = require('pinglib');
var resCode = pinglib.response;
var LeavePermit = pinglib.LeavePermit;
var CompanyService = pinglib.CompanyService;
var LeaveService = pinglib.LeaveService;
var HrUser = pinglib.User;
var UserService = pinglib.UserService;
var clone = require('../common/clone');

// varaiables
var routerName = 'leave';
var url = '/' + routerName;
var urlApi = '/api' + url;
var Today = new Date();

router.get(url, function(req, res, next) {
    pinglib.SessionService.getUserSession(req, res, function(sess_user_data) {
        var clone_sess_user_data = clone(sess_user_data);
        console.log("clone_sess_user_data=" + clone_sess_user_data.values[0].name);
        if (null == clone_sess_user_data.values) {
            res.render('index', { title: 'Express' }); //進入輸入頁面
        } else {
            var hrUser = new HrUser();
            console.log("clone_sess_user_data="+clone_sess_user_data.values[0].system_parameter);
            hrUser.system_parameter = clone_sess_user_data.values[0].system_parameter;
            UserService.getColleague(hrUser, function(serach_user_data) {
                LeaveService.viewLeaveProcess(clone_sess_user_data.values[0], Today.getFullYear(), function(leaveData) {
                    console.log("users search..." + serach_user_data.values);
                    console.log("leaveData search..." + leaveData.values);
                    var myCheckData = new Array();
                    var temp_bundle_id = null;

                    pinglib.GroupService.getGroupList(clone_sess_user_data.values[0].system_parameter, function(groupData) {

                        var myRank = null;
                        for (var i in groupData) {
                            if (groupData[i]._id == clone_sess_user_data.values[0].group_id) {
                                myRank = groupData[i].rank;
                            }
                        }

                        for (var i in leaveData.values.myTeamLeaveProcess) {
                            console.log("temp_bundle_id=" + temp_bundle_id);
                            console.log("leaveData.values.myTeamLeaveProcess[i]=" + leaveData.values.myTeamLeaveProcess[i].bundle_id);
                            if (temp_bundle_id != leaveData.values.myTeamLeaveProcess[i].bundle_id  && !leaveData.values.myTeamLeaveProcess[i].permit_apply_day) {
                                temp_bundle_id = leaveData.values.myTeamLeaveProcess[i].bundle_id;
                                console.log("myRank=" + myRank);
                                console.log("leaveData.values.myTeamLeaveProcess[i].rank=" + leaveData.values.myTeamLeaveProcess[i].permit_rank);
                                if (myRank == leaveData.values.myTeamLeaveProcess[i].permit_rank && !leaveData.values.myTeamLeaveProcess[i].permit_apply_day) {
                                    myCheckData.push(leaveData.values.myTeamLeaveProcess[i]);
                                }
                            }
                        }

                        LeaveService.getUserLeaveProcess(clone_sess_user_data.values[0], Today.getFullYear(), function(leaveAllData) {
                            console.log("leaveAllData="+leaveAllData.values.rtnLeaveRoleByLevel);
                            res.render(routerName, {
                                users: serach_user_data.values,
                                genId: uuid.v1(),
                                user_login_system_parameter: clone_sess_user_data.values[0].system_parameter,
                                user_id: clone_sess_user_data.values[0]._id,
                                leaveData: myCheckData,
                                leaveAllData:leaveAllData.values
                            });
                        });
                    });
                });
            });
        }
    });
});


router.post(url + '/:id/:act', function(req, res, next) {
    switch (req.params.act) {
        case 'new':
            console.log("add....");
            pinglib.SessionService.getUserSession(req, res, function(sess_user_data) {
                var clone_sess_user_data = clone(sess_user_data);
                console.log("222clone_sess_user_data=" + clone_sess_user_data.values[0].name);
                LeavePermit.system_parameter = req.body.system_parameter;
                LeavePermit.days = req.body.totalHour * 60;
                LeavePermit.leave_year = Today.getFullYear();
                LeavePermit.leave_type = req.body.leave_type;
                LeaveService.createLeaveProcess(clone_sess_user_data.values[0], LeavePermit, function(data) {
                    res.send({ redirect: '/leave' });
                });
            });
        case 'edit':
            pinglib.SessionService.getUserSession(req, res, function(sess_user_data) {
                var clone_sess_user_data = clone(sess_user_data.values[0]);
                console.log("簽核:" + req.body.leaveData);
                var newLeavePermit = new LeavePermit();
                var tempLeavePermit = eval("(" +req.body.leaveData+")");
                newLeavePermit.system_parameter =  tempLeavePermit.system_parameter;
                newLeavePermit.bundle_id =  tempLeavePermit.bundle_id;
                newLeavePermit.leave_year =  tempLeavePermit.leave_year;
                newLeavePermit.leave_user_id =  tempLeavePermit.leave_user_id;
                newLeavePermit.permit_rank =  tempLeavePermit.permit_rank;
                newLeavePermit.permit_total_hour =  tempLeavePermit.permit_total_hour;
                console.log("tempLeavePermit="+tempLeavePermit);
                newLeavePermit._id = req.body._id;
                newLeavePermit.permit_group_id = clone_sess_user_data.group_id;
                newLeavePermit.permit_id = clone_sess_user_data._id;
                newLeavePermit.permit_name = clone_sess_user_data.name;
                newLeavePermit.permit_apply_day = Today.getFullYear() + "/" + (Today.getMonth() + 1) + "/" + Today.getDate();
                console.log(newLeavePermit);
                LeaveService.setLeavePermitById(newLeavePermit, function(leaveDataRetrun) {
                    res.send({ redirect: '/leave' });
                });
            });
            break;
        default:
            res.send('no result');
            break;
    }
});

module.exports = router;
