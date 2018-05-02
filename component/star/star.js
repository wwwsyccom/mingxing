var util = require('../../utils/util.js');
const app = getApp()
Component({
    properties: {
        star: {
            type: Object,
            value: {}
        },
        userInfo: {
            type: Object,
            value: null
        }
    },
    data: {
        showDail: false,
        userInfo: null,
    },
    methods: {
        cancelDail(){
            this.setData({
                showDail: false
            });
        },
        dail(){
            this.setData({
                showDail: true
            });
        }
    }
})