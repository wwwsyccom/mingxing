Component({
    properties: {
        title:{
            type: String,
            value: '确定'
        },
        styleStr: {
            type: String,
            value: ''
        },
        disabled: {
            type: Boolean,
            value: false
        },
        loading: {
            type: Boolean,
            value: false
        }
    },
    ready: function(){
    },
    data: {
    },
    methods: {
        tapped(){
            console.log('button tapped....');

            this.setData({
                disabled: true,
                loading: true
            });
            this.triggerEvent('tapped');
        }
    }
})