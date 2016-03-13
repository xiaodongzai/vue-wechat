<template>
	<div>
		用户个人信息
		{{userName}}
		<input type="text" placeholder="请输入用户名" v-model="userName">
	</div>
</template>
<script>
	module.exports = {
		data: {
			userName: ''
		}	
	};
</script>
<style>
	input{
		width: 100%;
	}
</style>
