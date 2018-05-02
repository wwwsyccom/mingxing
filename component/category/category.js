Component({
    properties: {
        theme: {
            type: Object,
            value: {},
        },
        userInfo: {
            type: Object,
            value: null
        }
    },
    ready(){
        console.log(this.properties.theme);
    },
    data: {
    },
    methods: {
    }
})