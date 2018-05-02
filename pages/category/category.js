var util = require('../../utils/util.js');
const app = getApp()
Page({
    data: {
        catList: {},
        catListShow: [],
        cat: '',    //url参数   
        showFilter: false,  //控制显示搜索过滤弹窗
    },
    onShow: function () {
        var cat = app.globalData.cat;
        this.setData({
            cat: cat || 'singer'
        });
        //获取明星分类详情
        wx.showLoading({
            title: '加载中'
        });
        util.req('/Api/Starcategory/star_list').then((res)=>{
            wx.hideLoading();
            this.setData({
                catList: res.data
            });
            this.showCat();
        });
    },
    onHide(){
        this.setData({
            showFilter: false
        });
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
    chooseCat(e){
        this.setData({
            cat: e.detail.cat
        });
        this.showCat();
    },
    showCat(){
        var catList = this.data.catList;
        if(this.data.cat == 'singer'){
            var male = {
                queryParam: 'catalogid=1&typeid=1',
                theme_name: '男歌手',
                data: catList.singer_male
            };
            var female = {
                queryParam: 'catalogid=1&typeid=2',
                theme_name: '女歌手',
                data: catList.singer_female
            };
            var team = { 
                queryParam: 'catalogid=1&typeid=3',
                theme_name: '团体歌手',
                data: catList.star_team
            };
        }else if(this.data.cat == 'actor'){
            male = {
                queryParam: 'catalogid=2&typeid=1',
                theme_name: '男演员',
                data: catList.actor_male
            };
            female = {
                queryParam: 'catalogid=2&typeid=2',
                theme_name: '女演员',
                data: catList.actor_female
            };
        }else if(this.data.cat == 'mul'){
            male = {
                queryParam: 'catalogid=3&typeid=1',
                theme_name: '男综艺',
                data: catList.variety_male
            };
            female = {
                queryParam: 'catalogid=3&typeid=2',
                theme_name: '女综艺',
                data: catList.variety_female
            };
        }else if(this.data.cat == 'others'){
            male = {
                queryParam: 'catalogid=4&typeid=1',
                theme_name: '其他男',
                data: catList.other_male
            };
            female = {
                queryParam: 'catalogid=4&typeid=2',
                theme_name: '其他女',
                data: catList.other_female
            };
        }else if(this.data.cat == 'all'){
            male = {
                queryParam: 'catalogid=&typeid=1',
                theme_name: '男明星',
                data: [...catList.singer_male, ...catList.actor_male,...catList.variety_male,...catList.other_male]
            };
            female = {
                queryParam: 'catalogid=&typeid=2',
                theme_name: '女明星',
                data: [...catList.singer_female, ...catList.actor_female,...catList.variety_female,...catList.other_female]
            };
            team = { 
                queryParam: 'catalogid=&typeid=3',
                theme_name: '团体明星',
                data: catList.star_team
            };
        }
        this.setData({
            catListShow: [male, female, team]
        });
    },
    searchTapped(){
        console.log('taper');
        wx.navigateTo({
            url: '/pages/search/search',
        })
    }
})