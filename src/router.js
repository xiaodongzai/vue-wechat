module.exports = {
		'/': {
			name: 'login',
			component: require('./view/user/login.vue')
		},
		'/login': {
			name: 'login',
			component: require('./view/user/login.vue')
		},
		'/user_info': {
			name: 'userInfo',
			component: require('./view/user/user_info.vue')
		}	
	};