//cmd line : set NODE_ENV = 'development'
var env = require('./config.json');
exports.config = function() {
  var node_env = process.env.NODE_ENV || 'development';
  global.config = env[node_env];
  return env[node_env];
};