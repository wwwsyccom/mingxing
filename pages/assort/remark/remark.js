const app = getApp()

Page({
    data: {
        remarks: [
            {
                'img': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523877086276&di=72f70e807b31820766636c64a5467ad6&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4d086e061d950a7b9138ff1000d162d9f3d3c9d1.jpg',
                'name': '张三',
                'date': '2018-12-12',
                'comment': 'kkkkkkkkkkkkkk'
            },
            {
                'img': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523877086276&di=72f70e807b31820766636c64a5467ad6&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4d086e061d950a7b9138ff1000d162d9f3d3c9d1.jpg',
                'name': '张三',
                'date': '2018-12-12',
                'comment': 'kkkkkkkkkkkkkk'
            },
            {
                'img': 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523877086276&di=72f70e807b31820766636c64a5467ad6&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F4d086e061d950a7b9138ff1000d162d9f3d3c9d1.jpg',
                'name': '张三',
                'date': '2018-12-12',
                'comment': 'kkkkkkkkkkkkkk'
            },
        ]
    },
    onLoad: function () {
        this.setData({
            remarks: app.globalData.remarks
        });
    },
})
