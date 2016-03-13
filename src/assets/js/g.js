/**
 * @authors xieZhendong
 * @update  2016-03-02
 *
 * --------------提供的通用方法,依赖zepto.js----------
 * 调用方式：G.methodName(params...);
 *
 * getUrlParam   获取参数,如?name=12
 * getHashParam  获取Hash参数值，如#key=12&value=12
 * jsonToUrlParam 转换为页面传参形式,如{k:12,id: 23} --> 'k=12&id=23'
 * getJsonp 封装jsonp请求
 * ajax 封装ajax请求
 * decrypted 解密手机号码，依赖 lib/crypto-js.js
 * setItem 本地缓存，localStorage.setItem(key,value)
 * getItem
 * toast 通用信息提示框，模仿安卓的toast
 * arrayFill 数组填充，如G.arrayFill([1,2,3],[a,b]) == [a,b,3]
 * goBack 回退网页
 * static 静态资源链接（url,phone）配置
 * phoneCall 拨打电话通用处理，参数为号码数组，依赖weiget/tfpop/
 * getOpenId 获取OpenId
 * getToken 获取登录的用户信息及token
 * loading 通用loading效果，一般不需要手动调用，ajax 及 getJsonp方法中已做了处理
 * setAuthUrl 拼接授权Url,获取openid前需引导用户访问此url
 * getMobileSystem 机型判定
 * formCheck 通用表单检验
 *
 * -------------资源，路径，外部依赖的配置，方便管理-------------------------
 *
 * static 一些静态的路径或外部依赖的集合
 * pages 项目中页面路径的集合
 * key 外部api调用凭证
 * appId 微信公众号appId
 *
 *  -----------下面是私有方法，不对外提供-------------
 *
 * initFastClick 使用FastClick解决移动端300ms延迟
 * init 初始化操作或做一些预加载
 *
 */

'use strict';

var G = {};
//运行环境
G.TEST = 'test';
G.PRODUCT = 'product';
if(location.href.indexOf('voice.tf56.com') !== -1){
    G.envType = G.PRODUCT;
}else{
    G.envType = G.TEST;
}

if(G.envType === G.TEST){
    G.version = '20160201';
    G.isLog = true; //是否显示日志,测试环境开启
    G.appId = 'wx450248afa4895936';
}
else{
    G.version = '20151223';
    G.isLog = false;
    G.appId = 'wx5053c332b89a4729';
}

//在生产机下开启日志
G.isLog = false;

//根目录
G.root = '../..';

//请求路径
if(G.envType === G.TEST){
    G.host = 'http://124.160.27.13';
    G.url = 'http://124.160.27.13/lujingWechatApi/';
}
else{
    G.host = 'http://voice.tf56.com';
    G.url = 'http://voice.tf56.com/action.yaws';
}

//获取参数
G.getUrlParam = function(key) {
    var reg = new RegExp("(^|&|\\?)"+ key +"=([^&]*)(&|$)"),
        ret = location.search.match(reg);
    if (ret) {
        return decodeURIComponent(ret[2]);
    }
    return '';
}

//获取哈希值，
//即#key=12&value=122,比？key=12的好处在于可以使用JS进行修改，且页面不刷新
G.getHashParam = function(name){
    var reg = new RegExp("(^|&|\\#)"+ name +"=([^&]*)(&|$)"),
        ret = location.hash.match(reg);
    if (ret) {
        return decodeURIComponent(ret[2]);
    }
    return '';
};

//将json对象转换为页面传参形式 如 {k:12,id: 23} --> 'k=12&id=23'
//keyArr 需要转换的字段，如果不传，全部转化
//不支持value为对象的，如{k:12,v:[1,2]}
G.jsonToUrlParam = function (jsonObj,keyArr) {
    keyArr = keyArr || [];
    var len = keyArr.length,
        str = '',
        i = 0,
        temp = '';
    if(len===0){
        //在for in循环中使用Object.prototype.hasOwnProperty()来过滤原型链中的属性
        for(var key in jsonObj){
            if (jsonObj.hasOwnProperty(key)) {
                if(G.getMobileSystem().iPhone){
                    keyArr.unshift(key);
                }else{
                    keyArr.push(key);
                }
            }
        }
    }

    keyArr.forEach(function(key){
        temp = i === 0 ? '' : '&';
        i++;
        str += temp + key + '=' + jsonObj[key];
    });
    return str;
}

//本地缓存存取简写
G.setItem = function(key,value){
    localStorage.setItem(key,value);
}
G.getItem = function(key){
    return localStorage.getItem(key);
}

//封装jsonp请求
G.getJsonp = function(param){
    var ajaxConf = {};
    ajaxConf = {
        type: "get",
        url: param.url,
        data: param.data,
        async: true,
        dataType: 'jsonp',
        callback: "callback",
        timeout: 10000,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (data) {
            G.loading('hide');
            if (typeof param.callback === 'function') {
                param.callback(data);
            }
        },
        error: function (r) {
            G.loading('hide');
            if (typeof param.errorCallback === 'function') {
                param.errorCallback(r);
            } else {
               G.toast('网络不给力,请检查网络连接');
            }
        }
    }

    //当data中有密钥sign时写死jsonp
    if (param.data && param.data.sign) {
        ajaxConf.jsonpCallback = "jsonp"
    }
    G.loading('show','加载中');
    $.ajax(ajaxConf);
}

//封装ajax请求,默认Get请求
G.ajax = function(param,type){
    var ajaxConf = {}
    ajaxConf = {
        type: type || 'get',
        url: param.url,
        data: param.data,
        async: true,
        dataType: 'json',
        timeout: 10000,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (data) {
            G.loading('hide');
            if (typeof param.callback == 'function') {
                param.callback(data);
            }
        },
        error: function (r) {
            G.loading('hide');
            if (typeof param.errorCallback == 'function') {
                param.errorCallback(r);
            } else {
                G.toast('网络不给力,请检查网络连接');
            }
        }
    }
    G.loading('show','加载中');
    $.ajax(ajaxConf);
}

//数组复制 [1,2] [9] = [9,2]
G.arrayFill = function(arr1,arr2){
    var len1 =  arr1.length;
    arr2.forEach(function(v,i){
        if(i>len1){
            arr1.push(v);
        }else if(v){
            arr1[i] = v;
        }
    });
    return arr1;
}

//DES解密手机号码
G.decrypted = function(ciphertext){
    var key = '$&%@.!^~',
        iv = '70121455';
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var ivHex = CryptoJS.enc.Utf8.parse(iv);
    var decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex,{
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
        iv: ivHex
    });
    var code = decrypted.toString(),
        len = code.length,
        str = '';

    //这里有凑巧的嫌疑，目前解密的结果都正确
    for(var i=-1;i<len;i=i+2){
        str += code.charAt(i);
    }
    return str;
}

//toast提示
G.toast = function(str){
    var html = '<div class="toast"><span class="text">' + str + '</span></div>',
        existToast = $('.toast');
    html = $(html);
    if(existToast.length > 0){
        setTimeout(function(){
            existToast&&existToast.remove();
            $('body').append(html);
        },500);
    }else{
        $('body').append(html);
    }
    setTimeout(function(){
        html&&html.remove();
    },4000);
}

//返回
G.goBack = function() {
    window.history.back();
};

//算天数
G.getDays = function(fromTimeStamp,toTimeStamp,type){
    toTimeStamp = toTimeStamp || Date.now();
    var sub = toTimeStamp/1 - fromTimeStamp/1,
        count = '';
    count = sub/(1000 * 60 * 60 *24);
    if(count >= 1){
        count = Math.floor(count) + '天';
    }else{
        count = sub/(1000 * 60 * 60);
        if(count >=1 ){
            count = Math.floor(count) + '小时';
        }else{
            count = sub/(1000 * 60);
            if(count>=1){
                count = Math.floor(count) + '分钟';
            }else{
                count = '少于1分钟';
            }
        }
    }
    return count;
}

//静态资源配置
if(G.envType === G.TEST){
    G.serverUrl = 'test.tf56.com';
}else{
    G.serverUrl = 'tf56.com';
}

G.static = {
  url: {
      download: 'http://e.tf56.com/mobile.html?source=wechatlujing-owner&openid=' + G.getItem('tradeOwner_openid'),
      register: 'http://static.' + G.serverUrl + '/partyCenter/view/my_regist2.html?tradetype=货主&source=weChatOwner',
      js_sdk: 'http://res.wx.qq.com/open/js/jweixin-1.0.0'
  }
};

//测试机处理
if(G.envType === G.TEST){
    G.static.url.download = 'http://site.test.tf56.com/epeihuo/moblie.html?source=wechatlujing-owner' + '&openid=' + G.getItem('tradeOwner_openid')
}

//页面配置
G.pages = {
    login: G.root + '/view/user/login.html', //登录
    userInfo: G.root + '/view/user/user_info.html',//用户信息
    sendGoods: G.root + '/view/goods/send_goods.html', //发货
    myGoods: G.root + '/view/goods/my_goods.html', //货源管理
    contactUs: G.root + '/view/about/contact_us.html',//联系我们
    help: G.root + '/view/about/help.html' //使用帮助
};

//拨打电话通用处理
//传入电话号码数组
G.phoneCall = function(numberArr){
    var arr = numberArr || [],
        len = arr.length;
    if(len === 0){
        return;
    }
    else if(len === 1){
        location.href = 'tel:' + numberArr;
    }else{
        var str = '<div class="tfpop-ul">';
        numberArr.forEach(function(v,index){
           var clazz = '';
           if(index !== numberArr.length - 1){
               clazz =  ' thin-border thin-border-bottom';    
           }
           str += '<a class="tfpop-li ' + clazz + '" href="tel:' + v + '">'+ v +'</a>'
        });
        str += '</div>';
        if(typeof $.tfpop === 'undefined'){
        }else{
            var tfpop = $.tfpop({
                content: str,
                coverClick: false//点击背景是否关闭弹窗，默认为false
            });
            tfpop.find('.tf-pop').css({
                borderRadius: '0.38rem'    
            });
            $('.tfpop-li').on('click',function(){
                tfpop.hide();
            });
        }
    }
};

//获取openId
G.getOpenId = function(callback){
    var key = 'tradeOwner_openid',
        openId = G.getItem(key),
        code = G.getUrlParam('code');
    //缓存中有openid,直接返回
    if(openId){
        if(typeof callback === 'function'){
            callback(openId);
        }
        return openId;
    }

    //url中携带有code
    if(code){
        var config = {};
        config.url = G.url + '/getopenidcs/getOpenidByCode';
        config.data = {
            code: code
        }
        config.callback = function(res){
            res = res || {};
            if(res.result == 'success'){
                var data = res.data || {};
                G.setItem(key,data.openid);
                callback(data.openid);
            }else{
                G.toast(res.msg);
            }
        }
        G.getJsonp(config);
    }
    else{
        location.replace(G.setAuthUrl(location.href));
    }
}

//清除openid
G.cleanLocalOpenId = function(){
    G.setItem('tradeOwner_openid','');
};

//获取token及用户信息
G.getToken = function(loginCallback,noLoginCallback,errorCallback){
    G.getOpenId(function(openId){
        var config = {};
        config.url = apiUrl.getAppStoken;
        config.data = {
            openname: '陆鲸货主',
            openid: openId
        };
        config.callback = function(res){
            if(res.result === 'success'){
                var app_stoken = res.data.app_stoken;
                loginCallback(res,app_stoken,openId);
            }else{
                noLoginCallback(res,openId);
            }
        };
        config.errorCallback = function(){
            if(errorCallback){
                errorCallback();
            }else{
                G.toast('获取登录信息失败');
            }
        };
        G.getJsonp(config);
    });
};

//机型判定
G.getMobileSystem =  function () {
    var u = navigator.userAgent,
        app = navigator.appVersion;
    return { //移动终端浏览器版本信息
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1 //是否iPad
    };
};

//统一loading加载动效
G.loading = function(method,text){
    var obj = {};
    if(method === 'show'){
        if($('.g-loading').length === 0) {
            var html = '<div class="g-loading"><div class="g-loading-box"><i class="icon"></i>' +
                '<p>' + text+ '...</p>' +
                '</div></div>';
            $('body').append($(html));
        } else{
            $('.g-loading').show();
        }
    }

    else{
        $('.g-loading').hide();
    }
};

//开发者key
G.key = {
    tx_map: 'CMFBZ-Z5JH4-F4UUI-DQMJ4-N4KPV-FEBJD'//腾讯地图
};

//引导用户访问此授权Url
G.setAuthUrl = function(url){
    // 为url添加
    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
        'appid=' + G.appId +
        '&redirect_uri=' + encodeURIComponent(url) +
        '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
    return url;
};

//表单校验
G.formCheck = function(str){
    str = $.trim(str);
    return{
        isMobile: /^1\d{10}$/.test(str),
        isTelephone: /^0\d{2,3}-?\d{7,8}$/.test(str)
    }
}

//使用 FastClick解决300ms 延迟问题
G.initFastClick = function(){
    FastClick&&FastClick.attach(document.body);
}

// 初始化操作或预加载
function init(){
    document.addEventListener('DOMContentLoaded',function(){
    });
};
init();
