var util = require('../../utils/util');
var app = getApp();
Component({
    properties: {
        showFilter:{    //显示筛选页
            type: Boolean,
            value: false
        },
        val: {
            type: String,
            value: ''
        },
        autoFocus: {
            type: Boolean,
            value: false
        },
        disabled: {
            type: Boolean,
            value: true
        }
    },
    data: {
        cost: 'show',  //活动费用-show or 代言费用-ad
        searchVal: '',  //搜索框取值
        filterData: null,  //筛选条件数据
        costId: '',  //筛选查询参数
        regionId: '',
        sexId: '',
        tagId: '',
        showCostId: '',
        adCostId: ''
    },
    methods: {
        buttonTapped(){
            var reqData = {
                type: this.data.sexId,
                tagid: this.data.tagId,
                regionid: this.data.regionId,
                showcost: this.data.showCostId,
                endorsementcost: this.data.adCostId,
                catalogid: ''
            };
            var paramStr = '';
            var count = 0;
            for(var i in reqData){
                if(count++>0){
                    paramStr += '&';
                }
                paramStr += (i+'='+reqData[i]);
            }
            console.log(paramStr);
            wx.navigateTo({
                url: '/pages/assort/filter/filter?'+paramStr,
            })
            // util.req('/Api/Starcategory/screen_list', reqData).then((res)=>{
            //     var starList = [];
            //     if(res.status==1){
            //         var starsObj = res.data.star_list;
            //         var keys = Object.keys(starsObj).sort();
            //         for(var i=0,len=keys.length;i<len;i++){
            //             if(starsObj[keys[i]].length>0){
            //                 var obj = {};
            //                 obj.key = keys[i];
            //                 obj.data = starsObj[keys[i]];
            //                 starList.push(obj);
            //             }
            //         }
            //     }
            //     app.globalData.starFilterList = starList;

            //     wx.navigateTo({
            //         url: '/pages/assort/filter/filter'
            //     });
            // });
        },
        closeFilter(){
            this.triggerEvent('closeFilter');
            // this.setData({
            //     showFilter: false
            // });
        },
        changeCost(e){
            this.setData({
                cost: e.currentTarget.dataset.cost
            });
        },
        search(e){
            if(e.detail.value.trim()!=''){
                this.triggerEvent('search',{val: e.detail.value});
            }
        },
        showFilter(){
            if(this.data.filterData){
                this.triggerEvent('showFilter');
            }else{
                wx.showLoading({
                    title: '加载中'
                });
                util.req('/Api/Starcategory/Screening_conditions').then((res)=>{
                    wx.hideLoading();
                    this.setData({
                        filterData: {
                            showCost : res.data.showcosts,
                            adCost: res.data.endorsementcosts,
                            region : res.data.regioninfo,
                            sex : res.data.types,
                            tag : res.data.taginfo
                        }
                    });
                    console.log('trigger showfilter');
                    this.triggerEvent('showFilter');
                });
            }
            // this.setData({
            //     showFilter: true
            // });
        },
        filterQuery(){
            
        },
        regionTap(e){
            if(e.currentTarget.dataset.id === this.data.regionId){
                return;
            }
            this.setData({
                regionId: e.currentTarget.dataset.id
            });
        },
        sexTap(e){
            if(e.currentTarget.dataset.id === this.data.sexId){
                return;
            }
            this.setData({
                sexId: e.currentTarget.dataset.id
            });
        },
        tagTap(e){
            if(e.currentTarget.dataset.id === this.data.tagId){
                return;
            }
            this.setData({
                tagId: e.currentTarget.dataset.id
            });
        },
        showCostTap(e){
            if(e.currentTarget.dataset.id === this.data.showCostId){
                return;
            }
            this.setData({
                showCostId: e.currentTarget.dataset.id
            });
        },
        adCostTap(e){
            if(e.currentTarget.dataset.id === this.data.adCostId){
                return;
            }
            this.setData({
                adCostId: e.currentTarget.dataset.id
            });
        },
        searchTapped(){
            this.triggerEvent('searchTapped');
        }
    }
})