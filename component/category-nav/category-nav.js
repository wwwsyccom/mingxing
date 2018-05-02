Component({
    properties: {
        cat: {
            type: String,
            value: ''
        }
    },
    data: {
        // catSelf: ''
    },
    ready(){
        // this.setData({
        //     catSelf: this.properties.cat
        // });
    },
    methods: {
        choose(e){
            var cat = e.currentTarget.dataset.cat;
            this.triggerEvent('chooseCat', {cat: cat});
        }
    }
})