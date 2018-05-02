var util = require('../../../utils/util.js');
const app = getApp()

Page({
    data: {
        photo: '',
        changePhoto: false,
        checkin: '',
        userInfo: {},
    },
    onShow: function () {
        util.req('/Api/Memberinfo/myInfo').then((rsp)=>{
            var userInfo = rsp.data;
            //如果用户使用微信默认头像
            if(userInfo.photo.indexOf('findingstar')==-1){
                userInfo.photo = userInfo.photo.substring(0,userInfo.photo.length-1)+'96';
            }
            userInfo.photo = userInfo.photo.replace('https','http');
            this.setData({
                userInfo,
                checkin: userInfo.sign==0?'签到':'已签到',
                photo: userInfo.photo
            });
            app.globalData.userInfo = userInfo;
        });
    },
    checkin(){
        if(this.data.checkin=='已签到'){
            return;
        }
        util.req('/Api/Memberinfo/sign').then((rsp)=>{
            if(rsp.status==1){
                this.setData({
                    checkin: '已签到'
                });
                wx.showToast({
                    title: '已签到',
                    icon: 'success', 
                    duration: 800,
                    mask: false
                })
            }else{
                wx.showToast({
                    title: '签到失败',
                    icon: 'none', 
                    duration: 800,
                    mask: false
                })
            }
        });
    },
    ident(){
        wx.navigateTo({
            url: '/pages/selfCenter/profile/profile',
        })
        // if(this.data.userInfo.rzstatus=='待审核'){
        //     wx.showToast({
        //         title: '您的认证工作人员正在加紧审核',
        //         icon: 'none', // loading
        //         duration: 1500,
        //         mask: false
        //     });
        // }else {
        // }
    },
    cancelPhoto(){
        this.setData({
            changePhoto: false
        });
    },
    changePhoto(){
        this.setData({
            changePhoto: true
        });
    },
    uploadPhoto(e){
        var self = this;
        var source = e.currentTarget.dataset.source;
        var photo = '';
        util.uploadImg(source).then((imgSrc)=>{
            var reqData = {
                photo: imgSrc
            };
            photo = imgSrc;
            return util.req('/Api/Memberinfo/uploadPic', reqData);
        }).then((rsp)=>{
            if(rsp.status==1){
                self.setData({
                    changePhoto: false
                });
                wx.showToast({
                    title: '上传头像成功',
                    icon: 'none', 
                    duration: 1000,
                    mask: false
                });
                self.setData({
                    photo
                });
                console.log('photo='+photo);
            }else{
                wx.showToast({
                    title: '上传头像失败',
                    icon: 'none', // loading
                    duration: 1500,
                    mask: false
                })
            }
        });
    }
})
