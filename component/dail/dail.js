var util = require('../../utils/util.js');
Component({
    properties: {
        starId: {
            type: String, 
            value: ''
        }
    },
    ready: function(){
        util.req('/Api/Memberinfo/yuepay',{starid:this.properties.starId}).then((rsp)=>{
            this.setData({
                showConfirm: true,
                cost: rsp.data.cost,
                balance: rsp.data.balance
            });
            if(this.data.cost>this.data.balance){
                this.setData({
                    ['confirm.title']: '余额不足',
                    ['confirm.content']: '查看明星需要消耗'+this.data.cost+'星币, 是否充值'
                });
            }else{
                this.setData({
                    ['confirm.title']: '消耗'+ this.data.cost +'星币',
                    ['confirm.content']: '查看明星需要消耗'+this.data.cost+'星币, 是否消耗'
                });
            }
        });
    },
    data: {
        showConfirm: false,  //子组件控制是否显示
        cost: -1, //拨打电话消耗星币数
        balance: -1, //账户星币余额
        confirm: {
            title: '',
            content: '',
            buttonLeft: '否',
            buttonRight: '是',
            buttonClass: 'class1'
        }
    },
    methods: {
        cancel(){
            this.triggerEvent('cancel');
        },
        confirm(){
            //余额不足去充值
            if(this.data.balance<this.data.cost){
                wx.navigateTo({
                    url: '/pages/wallet/remain/remain',
                })
            }else{
                this.triggerEvent('cancel');
                var reqData = {
                    starid: this.properties.starId
                };
                //拨打电话
                util.req('/Api/Memberinfo/phone_call', reqData).then((rsp)=>{
                    var phoneNumber = rsp.data.virtualMobile;
                    wx.makePhoneCall({
                        phoneNumber: phoneNumber
                    })
                });
            }
        }
    }
})