var express = require('express');
var config = require('./config/config').config();
var mongoose = require("mongoose");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('./common/logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session      = require('express-session');


var MongoStore = require('connect-mongo')(session);
mongoose.connect(config.db);
var app = express();

app.use(require('express-session')({
    key: 'session',
    secret: 'SUPER SECRET SECRET',
    store: require('mongoose-session')(mongoose),
    cookie: { maxAge: 1000*60*30 },
}));
// app.use(session({
//     cookie: { maxAge: 1000*60*2 } ,
//     secret: "session secret" ,
//     store:new MongoStore({
//             db: 'test',
//             host: '192.168.60.65',
//             port: 27019,  
//             // username: 'cm',
//             // password: 'cm', 
//             collection: 'session', 
//             auto_reconnect:true
//     })
// }));

// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('connected', function() {
    console.log('connected', mongoose.connection.readyState);
});
db.once('disconnected', function() {
    console.log('disconnected', mongoose.connection.readyState);
});

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.listen(config.port,function(){
  logger.debug("Express server listening on port "+config.port);
  logger.info("Express server listening on port "+config.port);
});
// module.exports = app;
