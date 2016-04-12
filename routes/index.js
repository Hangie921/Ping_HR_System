var express = require('express');
var router = express.Router();
// var pinglib = require('../node_modules/hr-api/interface/session.js');
var pinglib = require('pinglib');

// var sessionManager = require('pinglib');
// var usersobj = pinglib.User;
// sessionManager.

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

module.exports = router;
