//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
    },
    onLoad: function () {
        var baseUrl = 'https://dev.findingstar.com';
        var api = '/Api/Index/search';
        console.log('about login..........');
        // wx.login({  
        //     success: function (rsp) {  
        //         console.log('log success');
        //         console.log(rsp);
        //       wx.getUserInfo({  
        //        // withCredentials: true,
        //         success: function (res) {  
        //             console.log('get info success');
        //             console.log(res);  
        //         },
        //         fail: function(err){
        //             console.log('get info failed');
        //             console.log(err);
        //         }  
        //       })  
        //     },
        //     fail: function(err){
        //         console.log('log failed');
        //         console.log(err);
        //     }  
        // });  
    },
})
