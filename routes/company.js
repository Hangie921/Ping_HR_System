// node modules
var express = require('express'),
    router = express.Router(),
    async = require('async'),
    uuid = require('node-uuid');

// module

// pinglib
var pinglib = require('pinglib');
var resCode = pinglib.response;
var HrCompany = pinglib.Company;
var CompanyService = pinglib.CompanyService;

// varaiables
var routerName = 'company';
var url = '/' + routerName;
var urlApi = '/api' + url;

router.get(url, function(req, res, next) {
    console.log("company in....");
    var sys_params = 0;
    pinglib.SessionService.getUserSession(req, res, function(sess_user_data) {
    	if (null == sess_user_data.values) {
            res.render('index', { title: 'Express' }); //進入輸入頁面
        } else {
	    	CompanyService.getCompany(sys_params,function (company_data) {
        		console.log("company search..."+company_data.values);
            	res.render(routerName, { companys: company_data.values ,genId: uuid.v1() });
	    	});
        }
    });
});


router.post(url + '/:id/:act', function(req, res, next) {
    var company = new HrCompany();
    company._id=req.body._id;
    company.system_parameter = req.body.system_parameter;
    company.id_number = req.body.id_number;
    company.name = req.body.name;
    company.phone1 = req.body.phone1;
    company.phone2 = req.body.phone2;
    company.fax = req.body.fax;
    company.address = req.body.address;
    company.url = req.body.url;
    switch(req.params.act) {
    	case 'edit':
    		CompanyService.setCompanyById(company,function (data) {
    			res.send({redirect: '/company'});
    		});
    		break;
    	case 'remove':
    		HrCompany.find({ _id:req.params.id }).remove().exec();
    		res.send({redirect: '/company'});
    		break;
    	case 'new':
    		CompanyService.setCompany(company,function (data) {
    			console.log(data);
    			res.send({redirect: '/company'});
    		});
    		break;
    	default:
    		res.send('no result');
    		break;
    }
});


module.exports = router;
