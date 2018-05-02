var util = require('../../utils/util.js');
const app = getApp()

Page({
    data: {
        userInfo: '',
        bannerImgs: [],
        themes: [],
        currentSwiper: 0,  
        showIdent: false,
        showPromote: false,
        promoteImg: '', //活动图片
        promoteUrl: ''  //活动跳转链接
    },
    onLoad: function () {
        var self = this;
        var baseApi = app.globalData.baseApi;
        //获取轮播图
        var api = '/Api/Index/index_mainpage';
        util.req(api).then((rsp)=>{
            this.setData({
                bannerImgs: rsp.data.mainpage,
                promoteImg: rsp.data.dialogpage && rsp.data.dialogpage.picpath,
                promoteUrl: rsp.data.dialogpage && rsp.data.dialogpage.jumpurl
            });
            if(this.data.promoteImg){
                this.setData({
                    showPromote: true
                });
            }
            self.getUserInfo();
        },()=>{
            self.getUserInfo();
        });

        //获取主题
        api = '/Api/Index/theme';
        util.req(api).then((rsp)=>{
            this.setData({
                themes: rsp.data.theme
            });
        });
    },
    getUserInfo(){
        util.getUserInfo().then((rsp)=>{
            var userInfo = rsp.data;
            this.setData({
                userInfo
            });
            if(userInfo.rzstatus=='待认证' && !this.data.promoteImg){
                this.setData({
                    showIdent: true
                });
            }
        });
    },
   swiperChange: function (e) {  
        this.setData({  
            currentSwiper: e.detail.current  
        })  
    } ,
    closeIdent(){
        this.setData({
            showIdent: false
        });
    },
    tapCat(e){
        var cat = e.currentTarget.dataset.cat;
        app.globalData.cat = cat;
        wx.switchTab({
            url: "/pages/category/category"
        });
    },
    closePromote(){
        this.setData({
            showPromote: false,
        });
        this.showIdent();
    },
    //判断用户是否认证，待认证则弹出窗口
    showIdent(){
        if(this.data.userInfo.rzstatus=='待认证'){
            this.setData({
                showIdent : true
            });
        }
    }
})
