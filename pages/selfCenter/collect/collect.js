var util = require('../../../utils/util.js');
const app = getApp()

Page({
    data: {
        list: [],
        userInfo: {}
    },
    onShow: function () {
        util.req('/Api/Memberinfo/collect').then((rsp)=>{
            this.setData({
                list: rsp.data.collect_star[0],
                userInfo: app.globalData.userInfo
            });
        });
    },
})
