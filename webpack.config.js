var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var plugins = [
    new webpack.DefinePlugin({
        version: JSON.stringify('0.0.1') //全局
    }),
    new webpack.optimize.CommonsChunkPlugin('common.js'),//通用代码
    new ExtractTextPlugin('style.css',{  //css代码从js中分离出来
        allChunks: true,
        disable: false
    }),
    new webpack.ProvidePlugin({ 
        $: 'webpack-zepto'   //自动注入
    })
];

module.exports = {
    entry: {
        app: ["./src/main.js"]
    },
    output: {
        path: __dirname + '/dist',
        filename: "build.js",
        publicPath: 'http://127.0.0.1:8080/'
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    "style-loader", "css-loader?sourceMap!cssnext-loader")
            },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpg)$/,
                // loader: 'url-loader?limit=8192' //小于8k转为 base64
                loader: "url-loader?limit=8192&name=images/[hash].[ext]"
            }

        ]
    },
    vue: {
        css: ExtractTextPlugin.extract("css")            
    },
    plugins: plugins,
    devtool: '#source-map'//便于调试
};