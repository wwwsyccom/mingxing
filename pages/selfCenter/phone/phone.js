var util = require('../../../utils/util.js');
const app = getApp()

Page({
    data: {
        code: '',
        phone1: '',
        phone2: '',
        codeTxt: '获取验证码',
        leftTime: 59,
        codeFail: false,
        codeWaiting: false,
        buttonDisabled: false,
        buttonLoading: false,
        changePhone: false
    },
    onLoad: function () {
        //获取用户信息
        util.req('/Api/Memberinfo/myInfo').then((rsp)=>{
            var userInfo = rsp.data;
            //userInfo.mobile = '';
            if(userInfo.mobile){
                this.setData({
                    phone1: userInfo.mobile,
                    changePhone: true
                });
            }
        });
    },
    getCode(){
        if(!this.validatePhone()){
            return;
        }
        if(!this.data.codeWaiting){
            this.setData({
                codeWaiting: true
            });
            this.setData({
                codeTxt : this.data.leftTime-- +' '+'重新获取验证码'
            });
            var timer = setInterval(()=>{
                if(this.data.leftTime==0){
                    this.setData({
                        codeTxt: '获取验证码',
                        codeWaiting: false
                    });
                    clearInterval(timer);
                }else{
                    this.setData({
                        codeTxt : this.data.leftTime-- +' '+'重新获取验证码'
                    });
                }
            }, 1000);
            //发送验证码
            var reqData = {
                mobile: this.data.changePhone?this.data.phone2:this.data.phon1
            };
            util.req('/Api/Memberinfo/phone_verify', reqData).then((rsp)=>{
            });
        }
    },
    validatePhone(){
        if(this.data.changePhone){
            var phone = this.data.phone2;
        }else{
            phone = this.data.phone1;
        }
        if(!phone){
            wx.showToast({
                title: '请输入手机号',
                icon: 'none',
                duration: 600,
            })
            return false;
        }else if(phone.length!=11){
            wx.showToast({
                title: '手机号位数不正确',
                icon: 'none',
                duration: 600,
            })
            return false;
        }else if(phone.charAt(0)!=1){
            wx.showToast({
                title: '手机号格式不正确',
                icon: 'none',
                duration: 600,
            })
            return false;
        }
        return true;
    },
    phoneInput(e){
        if(this.data.changePhone){
            this.setData({
                phone2: e.detail.value.trim()
            });
        }else{
            this.setData({
                phone1: e.detail.value.trim()
            });
        }
    },
    codeInput(e){
        var code = e.detail.value.trim();
        this.setData({
            code
        });
    },
    confirm(){
        if(!this.validatePhone()){
            return;
        }
        if(this.data.code==''){
            wx.showToast({
                title: '请输入验证码',
                icon: 'none',
                duration: 600,
            })
            return;
        }
        if(this.data.changePhone){
            var api = '/Api/Memberinfo/edit_phone';
            var reqData = {
                phone_code: this.data.code,
                newphone: this.data.phone2
            };
        }else{
            api = '/Api/Memberinfo/addPhone';
            reqData = {
                phone: this.data.phone1,
                code: this.data.code
            };
        }
        this.setData({
            buttonDisabled: true,
            buttonLoading: true
        });
        util.req(api, reqData).then((rsp)=>{
            if(rsp.status==1){
                if(this.data.changePhone){
                    var title = '修改绑定成功';
                }else{
                    title = '绑定成功';
                }
                var icon = 'success';
            }else{
                if(this.data.changePhone){
                    var title = '修改绑定失败 '+ rsp.msg;
                }else{
                    title = '绑定失败 '+ rsp.msg;
                }
                this.setData({
                    buttonDisabled: false,
                    buttonLoading: false 
                });
                icon = 'none';
            }
            wx.showToast({
                title: title,
                icon: icon,
                duration: 1500,
                success(){
                    setTimeout(()=>{
                        wx.navigateBack({
                            delta: 1, 
                        })
                    }, 1000);
                }
            })
        });
    }
})
