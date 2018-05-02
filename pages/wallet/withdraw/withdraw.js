var util = require('../../../utils/util.js');
const app = getApp()

Page({
    data: {
        buttonLoading: false,
        coin: 0,
        rmb: 0,
        coinRemain: 0,
        rmbRemain: 0,
        withDrawMoney: 0    //提现金额
    },
    onShow: function () {
        util.req('/Api/Memberinfo/money').then((rsp)=>{
            // rsp.data.coin = 11111111;
            // rsp.data.jieduan = 11111111;
            if(rsp.status==1){
                this.setData({
                    coin: rsp.data.coin,
                    rmb: rsp.data.jieduan,
                    coinRemain: rsp.data.coin,
                    rmbRemain: rsp.data.jieduan
                });
            }
        });
    },
    inputMoney(e){
        var input = e.detail.value;
        var rmbRemain = (this.data.rmb - input).toFixed(2);
        var coinRemain = parseInt(1.2*rmbRemain);
        this.setData({
            rmbRemain,
            coinRemain,
            withDrawMoney: input
        });
    },
    confirm(){
        if(this.data.rmbRemain<0){
            wx.showToast({
                title: '提现金额不能大于余额',
                icon: 'none', 
                duration: 1500,
                mask: false
            })
            return;
        }
        this.setData({
            buttonLoading: true
        });
        var reqData = {
            cost: parseInt(1.2*this.data.withDrawMoney)
        };
        util.req('/Api/Memberinfo/tocash', reqData).then((rsp)=>{
            if(rsp.status==1){
                wx.showToast({
                    title: '申请提现成功',
                    icon: 'success', // loading
                    duration: 1500,
                    mask: false
                });
                setTimeout(()=>{
                    wx.navigateTo({
                        url: '/pages/selfCenter/self/self',
                    })
                }, 1500);
            }
        });
    }
})
