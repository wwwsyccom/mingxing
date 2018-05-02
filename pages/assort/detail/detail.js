var util = require('../../../utils/util.js');
const app = getApp()

Page({
    data: {
        showIdent: false, //控制显示认证弹窗
        showDail: false, //控制是否显示拨号提示弹窗
        cost: -1, //打电话需消耗的星币数量
        balance: -1, //用户星币余额
        confirmType: '', //confirm弹窗类型，认证/打电话提示
        userInfo: null,
        starId: '',
        collected: false,
        choosed: 'basic',
        // confirm: {
        //     title: '立即认证',
        //     content: '认证后能立即查看明星费用额～',
        //     buttonLeft: '取消',
        //     buttonRight: '认证',
        //     buttonClass: 'class2'
        // },
        noticeTitle: '已收藏',
        remark:{
            'img': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523877086276&di=72f70e807b31820766636c64a5467ad6&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4d086e061d950a7b9138ff1000d162d9f3d3c9d1.jpg',
            'name': '张三',
            'date': '2018-12-12',
            'comment': 'kkkkkkkkkkkkkk'
        },
        starData: {}
    },
    
    onLoad: function (params) {
        wx.showLoading({
            title: '加载中'
        });
        var reqData = {
            starid: params.id
        };
        this.setData({
            starId: params.id
        });
        util.req('/Api/Starcategory/star_detail', reqData).then((rsp)=>{
            // rsp.data.assess = [
            //     {
            //         "nickname": "谢**",  //姓名
            //         "photo": "http://static.findingstar.com/o_1bt6f8jol134o1bel9h910mq1rbd7.png",//头像
            //         "createtime": "2017-09-30 16:15:10",//评论时间
            //         "content": "阿斯顿发阿斯顿萨达放阿斯顿发阿斯顿萨达放阿斯顿发阿斯顿萨达放阿斯顿发阿斯顿萨达放"//评论内容
            //     },
            //     {
            //         "nickname": "谢**",  //姓名
            //         "photo": "http://static.findingstar.com/o_1bt6f8jol134o1bel9h910mq1rbd7.png",//头像
            //         "createtime": "2017-09-30 16:15:10",//评论时间
            //         "content": "阿斯顿发阿斯顿萨达放阿斯顿发阿斯顿萨达放阿斯顿发阿斯顿萨达放阿斯顿发阿斯顿萨达放"//评论内容
            //     }
            // ];
            //rsp.data.info.intro = ' <p style="text-indent: 2em;">阿木，1976年5月2日出生于四川凉山彝族自治州甘洛县，职业歌手。1997年，组合出版彝语专辑《传说中的英雄》，其事迹被列入《中国五十六个民族大词典》。1998年，签约于北京鸟人艺术推广有限责任公司，组合正式更名为“彝人制造”。推出第二张个人专辑《有一种爱叫做放手》，主打歌《有一种爱叫做放手》风靡歌坛。 最新新歌《泪点》首发被称内地版陈奕迅。</p><p style="text-indent: 2em;"><br></p><p style="text-indent: 2em;"><strong style="text-indent: 2em;">单曲：</strong></p><p style="text-indent: 2em;">《梦想的方向》《我们在一起》<br></p><p style="text-indent: 2em;"><br></p><p style="text-indent: 2em;"><strong>专辑：</strong></p><p style="text-indent: 2em;">2011年《悬崖上的爱》<br></p><p style="text-indent: 2em;">2010年《不要说我们是朋友》《江山》《情歌七年》<br></p><p style="text-indent: 2em;">2007年《有一种爱叫做放手》《戏梦》<br></p><p style="text-indent: 2em;"><br></p><p style="text-indent: 2em;"><strong>演</strong><strong>唱会：</strong></p><p style="text-indent: 2em;">暂无</p><p style="text-indent: 2em;"><br></p>            <div style="clear: both;"></div> ';
            // rsp.data.assess_count = 2;
            wx.hideLoading();
            rsp.data.info.intro = this.htmlDecode(rsp.data.info.intro);
            rsp.data.info.works= this.htmlDecode(rsp.data.info.works);
            rsp.data.info.ad= this.htmlDecode(rsp.data.info.ad);
            rsp.data.info.achi= this.htmlDecode(rsp.data.info.achi);
            this.setData({
                starData: rsp.data
            });
            app.globalData.remarks = rsp.data.assess;
            wx.setNavigationBarTitle({
                title: rsp.data.info.chinesename
            })
        });
        //获取收藏明星
        util.req('/Api/Memberinfo/collect').then((rsp)=>{
            var list = rsp.data.collect_star[0];
            var list2 = list.filter((item)=>{
                return item.starid === this.data.starId;
            });
            if(list2.length>0){
                this.setData({
                    collected: true
                });
            }
        });
        //获取用户信息
        util.getUserInfo().then((rsp)=>{
            this.setData({
                userInfo: rsp.data
            });
        });
    },
    chooseTap(e){
        var choosed = e.currentTarget.dataset.tap;
        this.setData({
            choosed
        });
    },
    collect(){
        var api = '/Api/Memberinfo/collectStar';
        var reqData = {
            starid: this.data.starId
        };
        //已收藏则取消收藏
        if(this.data.collected){
            util.req(api, reqData).then((rsp)=>{
                if(rsp.status == 1){
                    var title = '取消收藏成功';
                    var icon = 'success';
                    this.setData({
                        collected: false
                    });
                }else{
                    title = '取消收藏失败';
                    icon = 'none';
                }
                wx.showToast({
                    title: title,
                    icon: icon,
                    duration: 600,
                    mask: false
                })
            });
        }else{
            util.req(api, reqData).then((rsp)=>{
                if(rsp.status == 1){
                    var title = '收藏成功';
                    var icon = 'success';
                    this.setData({
                        collected: true
                    });
                }else{
                    title = '收藏失败';
                    icon = 'none';
                }
                wx.showToast({
                    title: title,
                    icon: icon,
                    duration: 600,
                    mask: false
                })
            });
        }
    },
    showDail(){
        this.setData({
            showDail: true
        });
    },
    cancelDail(){
        this.setData({
            showDail: false
        });
    },
    showIdent(){
        this.setData({
            showIdent: true
        });
    },
    cancelIdent(){
        this.setData({
            showIdent: false
        });
    },
    htmlDecode(str){
        if(!str){
            return;
        }
        return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    },
    onShareAppMessage: function( options ){
        var that = this;
        // 设置菜单中的转发按钮触发转发事件时的转发内容
        console.log(this.data.starData.info.detailpic[0]);
    　　var shareObj = {
            title: this.data.starData.info.chinesename+'个人档案',        // 默认是小程序的名称(可以写slogan等)
            path: '/pages/assort/detail/detail?id='+this.data.starId,        // 默认是当前页面，必须是以‘/’开头的完整路径
            imageUrl: this.data.starData.info.detailpic[0],     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
            success: function(res){
                // 转发成功之后的回调
                if(res.errMsg == 'shareAppMessage:ok'){
                }
            },
            fail: function(){
                if(res.errMsg == 'shareAppMessage:fail cancel'){
                }else if(res.errMsg == 'shareAppMessage:fail'){
                }
            },
            complete: function(){}
        };
        // 返回shareObj
        return shareObj;
    }
})
