var util = require('../../../utils/util');
const app = getApp()

Page({
    data: {
        cat: 'all',
        userInfo: null,
        loading: true,
        intoView: '',
        starList: [],
        starListAll: [],
        showFilter: false,  //控制显示搜索过滤弹窗
    },
    onLoad: function (params) {
        var self = this;
        wx.showLoading({
            title: '加载中'
        });
        util.req('/Api/Starcategory/screen_list', params).then((res)=>{
            var starList = [];
            if(res.status==1){
                var starsObj = res.data.star_list;
                var keys = Object.keys(starsObj).sort();
                for(var i=0,len=keys.length;i<len;i++){
                    if(starsObj[keys[i]].length>0){
                        var obj = {};
                        obj.key = keys[i];
                        obj.data = starsObj[keys[i]];
                        starList.push(obj);
                    }
                }
            }
            this.setData({
                starListAll: starList,
                starList
            });
            wx.hideLoading({
                success(){
                    self.setData({
                        loading: false
                    });
                }
            });
        });
        util.getUserInfo().then((rsp)=>{
            this.setData({
                userInfo: rsp.data
            });
        });
    },
    //显示搜索过滤弹窗
    showFilter(){
        console.log('showfilter');
        this.setData({
            showFilter: true
        });
    },
    closeFilter(){
        this.setData({
            showFilter: false
        });
    },
    chooseCat(e){
        var cat = e.detail.cat;
        if(cat=='all'){
            this.setData({
                starList: this.data.starListAll
            });
            return;
        }
        var catMap = {
            'singer': 1,
            'actor': 2,
            'mul': 3,
            'others': 4
        };
        var starList = JSON.parse(JSON.stringify(this.data.starListAll));
        starList.forEach(function(item){
            var data = item.data;
            item.data = data.filter(function(item){
                return item.catalogid == catMap[cat];
            });
        });
        this.setData({
            starList,
            cat
        });
    },
    scroll: function(e){
        this.setData({
            intoView: 'id-'+e.currentTarget.dataset.id
        });
    },
    searchTapped(){
        wx.navigateTo({
            url: '/pages/search/search',
        })
    }
})
