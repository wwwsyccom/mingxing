var util = require('../../../utils/util.js');
const app = getApp()

Page({
    data: {
        userInfo: {},
        showBindPhone: false,
        confirm: {
            title: '绑定手机',
            content: '为了保障账户安全，认证前需绑定手机',
            buttonLeft: '取消认证',
            buttonRight: '绑定手机',
            buttonClass: 'class2'
        }
    },
    onLoad: function () {
        util.req('/Api/Memberinfo/myInfo').then((rsp)=>{
            var userInfo = rsp.data;
            //userInfo.rzstatus = '已认证';
            //userInfo.mobile = '9999';
            this.setData({
                userInfo
            });
        });
    },
    goIdent(){
        if(this.data.userInfo.rzstatus=='待认证'&&this.data.userInfo.mobile==''){
            this.setData({
                showBindPhone: true
            });
        }else if(this.data.userInfo.rzstatus=='待认证'&&this.data.userInfo.mobile!=''){
            wx.navigateTo({
                url: '/pages/selfCenter/ident/ident',
            })
        }else if(this.data.userInfo.rzstatus=='待审核'){
            wx.showToast({
                title: '您的认证工作人员正在加紧审核',
                icon: 'none', 
                duration: 1500,
                mask: false
            });
        }
    },
    cancelIdent(){
        this.setData({
            showBindPhone: false
        });
    },
    bindPhone(){
        wx.navigateTo({
            url: '/pages/selfCenter/phone/phone',
        })
    }
})
