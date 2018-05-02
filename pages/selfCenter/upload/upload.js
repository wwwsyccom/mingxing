var util = require('../../../utils/util.js');
var qiniuUploader = require('../../../utils/qiniuUploader.js');
const app = getApp()

Page({
    data: {
        buttonDisabled: false,
        buttonLoading: false,
        showNotice: false,
        industry: [],
        regions: null, //地区接口返回的原始数据
        regionArr: null,  //picker数据源
        industrySelect: -1,
        qiniuToken: '',
        upData: {
            sex: '',
            name: '',
            ident: '',  //身份证号
            identType: '',  //认证类型，0为企业，1为经纪人
            cardUrl: '',    //名片图片地址
            agencyUrl: '',  //经纪人图片地址
            phone: '',
            company: '',
            industryIndex: -1,
            position: '',
            region: null,
        },
    },
    onLoad: function (params) {
        var ident = params.ident;
        this.setData({
            ['upData.identType']: ident
        });
        var self = this;
        //获取用户信息
        util.req('/Api/Memberinfo/myInfo').then((rsp)=>{
            var userInfo = rsp.data;
            this.setData({
                ['upData.name']: userInfo.nickname,
                ['upData.phone']: userInfo.mobile,
            });
        });
        //获取七牛token
        util.req('/Api/Memberinfo/getQiniuToken').then((rsp)=>{
            this.setData({
                qiniuToken: rsp.data.uploadToken
            });
        });
        //获取认证行业
        util.req('/Api/Memberinfo/industry').then((rsp)=>{
            var industry = rsp.data;
            self.setData({
                industry
            });
        });
        util.req('/Api/Index/appointment',{'do':'get_option'}).then((rsp)=>{
            var regionArr = [[],[]];
            var regions = rsp.data.regions;
            regions.forEach(ele => {
                regionArr[0].push(ele.name);
            });
            regions[0].tree.forEach(ele=>{
                regionArr[1].push(ele.name);
            });
            this.setData({
                regionArr,
                regions
            });
        });
    },
    regionChange(e){
        var region = e.detail.value;
        console.log('region=');
        console.log(region);
        this.setData({
            ['upData.region']: region
        });
    },
    regionColumnChange(e){
        if(e.detail.column==1){
            return;
        }
        var province = e.detail.value;
        var cities = [];
        this.data.regions[province].tree.forEach(item=>{
            cities.push(item.name);
        });
        this.setData({
            'regionArr[1]': cities
        });
    },
    uploadImg(e){
        var self = this;
        var ident = e.currentTarget.dataset.ident;
        wx.chooseImage({
            count: 1,
            success: function(res) {
                var filePath = res.tempFilePaths[0];
                var postFix = filePath.substring(filePath.lastIndexOf('.'), filePath.length);
                qiniuUploader.upload(filePath, (res) => {
                    console.log('res.imageurl='+res.imageURL);
                    self.setData({
                        ['upData.'+ident]: res.imageURL.replace('https','http')
                    });
                },(error) => {
                    console.log('error: ');
                    console.log(error);
                },{
                    region: 'NCN',
                    domain: 'https://static.findingstar.com',
                    key: Date.now()+'_'+(Math.random()+'').split('.')[1]+postFix,
                    uptoken: self.data.qiniuToken
                },(res)=>{
                    console.log('上传进度', res.progress)
                    console.log('已经上传的数据长度', res.totalBytesSent)
                    console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
                });
            }
        });
    },
    bindPickerChange(e){
        var industryIndex = 'upData.industryIndex';
        this.setData({
            [industryIndex]: this.data.industry[e.detail.value].value,
            industrySelect: e.detail.value
        });
    },
    bindInput(e){
        var name = e.currentTarget.dataset.name;
        this.setData({
            [name]: e.detail.value
        });
    },
    confirm(){
        if(this.data.upData.name.trim()===''){
            var title = '请输入姓名';
        }else if(this.data.upData.identType==0 && !this.data.upData.cardUrl){
            title = '请上传名片';
        }else if(this.data.upData.identType==1 && (!this.data.upData.cardUrl||!this.data.upData.agencyUrl)){
            if(!this.data.upData.cardUrl){
                title = '请上传名片';
            }else if(!this.data.upData.agencyUrl){
                title = '请上传经纪人证明';
            }
        }else if(this.data.upData.sex===''){
            title = '请选择性别';
        }else if(this.data.upData.ident.trim()===''){
            title = '请输入身份证号';
        }else if(!/^\d{17}(x|\d)$/.test(this.data.upData.ident.trim().toLowerCase())){
            title = '身份证格式不正确';
        }else if(this.data.upData.company.trim()===''){
            title = '请输入公司名称';
        }else if(this.data.upData.industryIndex===-1){
            title = '请选择行业';
        }else if(this.data.upData.position.trim()===''){
            title = '请输入职位';
        }else if(this.data.upData.regionArr===null){
            title = '请选择地区';
        }
        if(title){
            wx.showToast({
                title: title,
                icon: 'none', 
                duration: 1000,
                mask: false
            })
            return;
        }
        if(!this.validatePhone()){
            return;
        }
        this.setData({
            buttonDisabled: true,
            buttonLoading: true
        });
        //上传认证信息
        var upData = this.data.upData;
        var reqData = {
            card_pic: upData.cardUrl,
            agent_pic: upData.agencyUrl,
            type: upData.identType,
            sex: upData.sex,
            businessid: upData.industryIndex,
            nickname: upData.name,
            mobile: upData.phone,
            personnum: upData.ident,
            companyname: upData.company,
            zhiwu: upData.position,
            linshi: JSON.stringify([this.data.regions[upData.region[0]].aid, this.data.regions[upData.region[0]].tree[upData.region[1]].aid])
        };
        console.log(reqData);
        util.req('/Api/Memberinfo/approve', reqData).then((rsp)=>{
            if(rsp.status==1){
                wx.showToast({
                    title: '提交成功',
                    icon: 'success', // loading
                    duration: 1500,
                    mask: false
                })
                setTimeout(()=>{
                    wx.switchTab({
                        url: '/pages/selfCenter/self/self',
                    })
                }, 1500);
            }else{
                wx.showToast({
                    title: '提交失败',
                    icon: 'none', // loading
                    duration: 1500,
                    mask: false
                });
                this.setData({
                    buttonDisabled: false,
                    buttonLoading: false
                });
            }
        });
    },
    validatePhone(){
        var phone = this.data.upData.phone;
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
})
