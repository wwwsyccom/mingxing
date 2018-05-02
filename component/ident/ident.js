var util = require('../../utils/util.js');
Component({
    properties: {
    },
    ready: function(){
    },
    data: {
        confirm: {
            title: '立即认证',
            content: '认证后能立即查看明星费用哦~',
            buttonLeft: '取消',
            buttonRight: '立即认证',
            buttonClass: 'class2'
        }
    },
    methods: {
        cancel(){
            this.triggerEvent('cancel');
        },
        confirm(){
            wx.navigateTo({
                url: '/pages/selfCenter/ident/ident',
            })
        }
    }
})