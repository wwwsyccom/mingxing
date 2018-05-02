var util = require('../../utils/util.js');
var _ = require('../../utils/underscore.js');
const app = getApp()

Page({
    data: {
        showFilter: false,  //控制显示搜索过滤弹窗
        confirmTitle: '消耗20星币',
        confirmContent: '......',
        confirmButtonLeft: '否',
        confirmButtonRight: '是',
        searchVal: '',
        searched: false,
        loading: true,
        starList: [],
        hot: [],
        recent: []
    },
    //搜索搜索
    onShow: function () {
        var self = this;
        //热搜列表
        var api = '/Api/Index/hot_search';
        util.req(api).then(function(res){
            self.setData({
                hot: res.data.hot
            });
        });
        //最近搜索
        var recent = wx.getStorageSync('recentSearch');
        if(recent){
            self.setData({
                recent
            });
        }
    },
    //显示搜索过滤弹窗
    showFilter(){
        this.setData({
            showFilter: true
        });
    },
    closeFilter(){
        this.setData({
            showFilter: false
        });
    },
    search(e){
        this.setData({
            loading: true
        });
        if(e.detail){
            var name = e.detail.val.trim();
        }else{
            name = e;
        }
        var recentSearch = wx.getStorageSync('recentSearch');
        if(!recentSearch){
            recentSearch = [];
        }
        if(_.indexOf(recentSearch, name)!=-1){
            recentSearch = _.without(recentSearch, name);
        }
        recentSearch.unshift(name);
        wx.setStorageSync('recentSearch', recentSearch);
        this.setData({
            searched: true
        });
        var reqData = {
            searchword: name
        }
        wx.showLoading({
            title: '搜索中'
        });
        util.req('/Api/Index/search', reqData).then((res)=>{
            this.setData({
                loading: false
            });
            wx.hideLoading();
            this.setData({
                starList: res.data.starinfo
            });
        });
    },
    searchTap(e){
        var name = e.currentTarget.dataset.name;
        this.setData({
            searchVal: name
        });
        this.search(name);
    },
    clearHistory(){
        wx.removeStorageSync('recentSearch');
        this.setData({
            recent: []
        });
    }
})
