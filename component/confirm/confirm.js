Component({
    properties: {
        confirm: {
            type: Object,
            value: {
                title: '',
                buttonLeft: '',
                buttonRight: '',
                buttonClass: '',//calss1,class2
                content: ''
            }
        },
    },
    ready: function(){
    },
    data: {
    },
    methods: {
        leftTap(){
            this.triggerEvent('leftTap');
        },
        rightTap(){
            this.triggerEvent('rightTap');
        },
        wrapTap(){
            this.triggerEvent('wrapTap');
        },
        preventPop(){}
    }
})