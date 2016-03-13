'use strict';

var webpack = require('webpack'),
	webpackDevServer = require('webpack-dev-server'),
	config = require('./webpack.config.js');
config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/");
var compiler = webpack(config);
var server = new webpackDevServer(webpack(config),{});
console.log('listening on port of 8080...');
server.listen(8080);