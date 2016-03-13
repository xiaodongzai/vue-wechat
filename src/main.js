'use strict';

require('./assets/css/common/common.css');
require('./assets/css/common/normalize.css');

var Vue = require('vue'),
	VueRouter = require('vue-router'),
	routerConfig = require('./router.js');	
// 显示加载 router 插件
Vue.use(VueRouter);	

var App = Vue.extend({});
var router = new VueRouter({
	hashbang: true,
    history: false,
    saveScrollPosition: true,
    transitionOnLoad: true
});
router.map(routerConfig);
router.start(app,'#app');