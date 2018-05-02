var util = require('../../../utils/util.js');
const app = getApp()

Page({
    data: {
        userInfo: {},
        chargeFee: 60, //选择充值星币数量
        showCharge: false,  //显示充值窗口
        money: ''   //我的余额
    },
    onLoad: function () {
        this.setData({
            userInfo: app.globalData.userInfo
        });
        util.req('/Api/Memberinfo/money').then((rsp)=>{
            this.setData({
                money: rsp.data.jieduan
            });
        });

    },
    charge(){
        this.setData({
            showCharge: true
        });
    },
    chooseAmount(e){
        this.setData({
            chargeFee: e.currentTarget.dataset.amount
        });
    },
    cancelCharge(){
        this.setData({
            showCharge: false
        });
    },
    cancelBuble(){},
    withdraw(){
        wx.navigateTo({
            url: '/pages/wallet/withdraw/withdraw',
        })
    },
    pay(){
        var reqData = {
            title: '充值',
            fee: this.data.chargeFee
        };
        util.req('/Api/Memberinfo/pay', reqData).then((rsp)=>{
            wx.requestPayment({
                'timeStamp': rsp.data.timeStamp,
                'nonceStr': rsp.data.nonceStr,
                'package': rsp.data.package,
                'signType': rsp.data.signType,
                'paySign': rsp.data.paySign,
                'success':function(res){
                    console.log('success');
                    console.log(res);
                },
                'fail':function(res){
                    console.log('fail');
                    console.log(res);
                }
             })
        });
    }
})
