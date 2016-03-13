<template>
	<div class="login-bg gpu">
		<div class="common-pbox lg-box hid" v-bind:class="{'show': 'isReady'}">
			<img src="../../assets/img/logo@2x.png" class="logo" alt="陆鲸Logo">
			<div>
				<div class="fn-re">
					<div class="fn-mb20 after-scale sp">
						<input type="email" class="common-input-lg login-input" placeholder="请输入帐号" v-model="user.partyname" v-on:focus="status=true">	
					</div>
					<div v-show="user.partyname" class="icon-close" v-on:tap="clearInput('partyname')"  transition="clear-icon">
						<i></i>
					</div>
				</div>
				<div class="fn-re">
					<div class="fn-mb60 after-scale sp">
						<input type="password" class="common-input-lg login-input" placeholder="请输入密码" v-model="user.password" >
					</div>
					<div v-show="user.password" class="icon-close" v-on:tap="clearInput('password')"  transition="clear-icon">
						<i></i>
					</div>
				</div>
				<button class="common-btn-lg gray" v-bind:class="{'gray': !(user.partyname&&user.password)}" v-on:click="login()">登录</button>
			</div>
		</div>
		<div class="register-area" v-show="register">
			<a class="a-link" href="{{registerUrl}}">新用户注册</a>
		</div>
		<com-keyboard v-show="status"
                  v-bind:status.sync="status"
                  v-bind:value.sync="user.partyname">
    	</com-keyboard>
	<div>

</template>
<script>
	module.exports = {
	   data: {
	   		user: {
	   			partyname: '',
	   			password: ''
	   		},
	   		status: false
	   },
	   components:{
            "comKeyboard": require('../../components/keyboard.vue')
        }
	};
</script>
<style>
html,body{
	height: 100%;
	overflow: hidden;
	position: relative;
}
#app{
	height: 100%;
}
.login-bg{
	height: 100%;
	-webkit-background-size: cover;
	background: transparent url(../../assets/img/login-bg.jpg) no-repeat 0 0/cover;
}

.register-area{
    position: absolute;
    width: 100%;
    bottom: 0.938rem;
    text-align: center;
}

.a-link{
	display: inline-block;
	width: 6rem;
	height: 1.875rem;
	line-height: 1.875rem;
	font-size: 0.875rem;
	text-align: center;
	color: #FFF;
	border: 1px solid #FFF;
	-webkit-border-radius: 0.25rem;
	border-radius: 0.25rem;
}
.lg-box{
	text-align: center;			
}
.logo{
	width: 5rem;
	margin: 3rem 0 2.5rem 0;	
}
</style>
