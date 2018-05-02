var util = require('../../../utils/util.js');
const app = getApp()

Page({
    data: {
        starId: '',
        showDail: false, //控制是否显示拨号提示弹窗
        orderIndex: -1, //评价的订单下标
        orders: [],
        showComment: false,
        content: '', //评论内容
    },
    onShow: function () {
        wx.showLoading({
            title: '加载中'
        });
        util.req('/Api/Memberinfo/myOrder').then((rsp)=>{
            /*
            rsp.data = [
                {
                    "wid": "2171",
                    "starid": "2683",
                    "chinesename": "歌手权重",
                    "star_pic": "http://static.findingstar.com/o_1c1p88u312va139p1la01qof3o2h.jpg",
                    "coin_fee": "-2000",
                    "createtime": "2017-12-20 15:42:47",
                    "is_comment": 0
                },
                {
                    "wid": "2172",
                    "starid": "2683",
                    "chinesename": "歌手权",
                    "star_pic": "http://static.findingstar.com/o_1c1p88u312va139p1la01qof3o2h.jpg",
                    "coin_fee": "-2000",
                    "createtime": "2017-12-20 15:42:47",
                    "is_comment": 1
                },
                {
                    "wid": "2173",
                    "starid": "2683",
                    "chinesename": "歌手权重",
                    "star_pic": "http://static.findingstar.com/o_1c1p88u312va139p1la01qof3o2h.jpg",
                    "coin_fee": "-2000",
                    "createtime": "2017-12-20 15:42:47",
                    "is_comment": 1
                }
            ];
            */
            wx.hideLoading();
            if(rsp.status==1){
                this.setData({
                    orders: rsp.data
                });
            }else{
                wx.showToast({
                    title: '加载失败',
                    icon: 'none',
                    duration: 1500,
                    mask: false
                })
            }
        });
    },
    toComment(e){
        var index = e.currentTarget.dataset.item;
        if(this.data.orders[index].is_comment){
            return;
        }
        this.setData({
            showComment: true,
            orderIndex: index
        });

        // var commented = "orders["+index+"].is_comment";
        // this.setData({
        //     [commented]: 0
        // });
    },
    cancel(){
        this.setData({
            showComment: false
        });
    },
    confirm(){
        var content = this.data.content.trim();
        if(content.length<5){
            wx.showToast({
                title: '评论内容不能少于5个字',
                icon: 'none', 
                duration: 1200,
                mask: false
            })
            return;
        }else{
            
            var api = '/Api/Memberinfo/comment';
            var reqData = {
                orderid: this.data.orders[this.data.orderIndex].wid,
                assessword: content
            };
            util.req(api, reqData).then((rsp)=>{
                if(rsp.status==1){
                    var isComment = 'orders['+this.data.orderIndex+'].is_comment';
                    this.setData({
                        showComment: false,
                        [isComment]: 1
                    });
                    var title = '评论成功';
                }else{
                    title = '评论失败';
                }
                wx.showToast({
                    title: title,
                    icon: 'none', // loading
                    duration: 1000,
                    mask: false
                })
            });
        }
    },
    getContent(e){
        this.setData({
            content: e.detail.value
        });
    },
    showDail(e){
        var starId = e.currentTarget.dataset.id;
        this.setData({
            showDail: true,
            starId
        });
    },
    cancelDail(){
        this.setData({
            showDail: false
        });
    }
})
