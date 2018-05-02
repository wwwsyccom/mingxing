Component({
    properties: {
    },
    ready: function(){
    },
    data: {
    },
    methods: {
        close(){
            this.triggerEvent('close');
            console.log('close');
        }
    }
})