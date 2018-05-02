var util = require('../../../utils/util.js');
const app = getApp()

Page({
    data: {
        list: []
    },
    onShow: function () {
        console.log(parseInt('100'));
        wx.showLoading();
        util.req('/Api/Memberinfo/money_log').then((rsp)=>{
            wx.hideLoading()
            this.setData({
                list: rsp.data
            });
        });
    },
})
