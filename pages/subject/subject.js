var util = require('../../utils/util.js');
const app = getApp()

Page({
    data: {
        // userInfo: null,
        stars: [],
    },
    onLoad: function (params) {
        var reqData = {
            theme_id: params.themeId,
            page: 0
        };
        wx.showLoading({
            title: '加载中'
        });
        util.req('/Api/Index/theme_detail', reqData).then((res)=>{
            wx.hideLoading()
            this.setData({
                stars: res.data.theme_list
            });
        });
        //获取用户信息
        // util.getUserInfo().then((rsp)=>{
        //     this.setData({
        //         userInfo: rsp.data
        //     });
        // });
    },
})
