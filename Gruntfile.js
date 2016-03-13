var config = {
	cwd: './dist', //源文件目录
	dest: './dist'//指定生成文件目录
};

module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt); //根据package.json中依赖配置自动加载插件
	require('time-grunt')(grunt); //统计任务耗时

	// 项目配置
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		config: config,
		
		//清除目标文件
		clean: {
			dist: {
				src: '<%= config.dest %>/**/*'
			}
		},

		//执行webpack任务
		webpack:{
			dist: require('./webpack.config.js')		
		},

		//css压缩
		cssmin: {
			traget: {
				files: [{
					expand: true,
					cwd: '<%= config.cwd %>/',
					src: ['**/*.css', '!**/*.min.css'],
					dest: '<%= config.dest %>/'	
				}]
			}
		},

		//js压缩		
		uglify: {
			options: {
				mangle: {
					except: ['jQuery', 'Zepto'] //不混淆配置的变量名
				}
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.cwd %>/',
					src: ['**/*.js', '!**/*.min.js'],
					dest: '<%= config.dest %>/'
				}]
			}
		},
		imagemin: {
	      dynamic: {
	        files: [{
	          expand: true,
	          cwd: '<%= config.cwd %>/',
	          src: '**/*.{gif,jpeg,jpg,png}',
	          dest: '<%= config.dest %>/'
	        }]
	      }
   		}     	
	});
	
	grunt.registerTask('min',['cssmin','uglify','imagemin']);
	
	// 默认任务
	grunt.registerTask('default', ['clean','webpack','min']);
}
