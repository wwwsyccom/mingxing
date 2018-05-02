var qiniuUploader = require('qiniuUploader.js');
const req = (api, data={})=>{
    var promise = new Promise(function(resolve, reject){
        request(api, data, resolve, reject);
    });
    return promise;
}
function request(api, data, resolve, reject){
    var baseApi = 'https://dev.findingstar.com';
    var token = wx.getStorageSync('token');
    wx.request({
        url: baseApi + api,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': token
        },
        data: data,
        method: 'POST',
        success: function(res){
            //如果需要登陆,且还没有登陆
            if(res.data.status==401){
                login().then(()=>{
                    request(api, data, resolve, reject);
                });
            }else{
                resolve(res.data);
            }
        },
        fail: function(res){
            reject(res);
        }
    });
}
function login(){
    var self = this;
    var promise = new Promise((resolve, reject)=>{
        //登陆
        wx.login({
            success: function(res){
                var code = res.code;
                wx.getUserInfo({
                    withCredentials: true,
                    success: function(res){
                        var encryptedData = res.encryptedData;
                        var iv = res.iv;
                        //登陆获取token
                        var api = '/Api/Memberinfo/login';
                        var reqData = {
                            code,
                            encryptedData,
                            iv
                        };
                        req(api, reqData).then(function(rsp){
                            var token = rsp.token;
                            wx.setStorageSync('token', token);
                            resolve();
                        });
                    }
                })
            }
        })
    });
    return promise;
}
function getUserInfo(){
    return req('/Api/Memberinfo/myInfo');
}
//上传图片
function uploadImg(source=['album','camera']){
    var promise = new Promise((resolve, reject)=>{
        req('/Api/Memberinfo/getQiniuToken').then((rsp)=>{
            return rsp.data.uploadToken;
        }).then((qiniuToken)=>{
            wx.chooseImage({
                count: 1,
                sourceType: source,
                success: function(res) {
                    var filePath = res.tempFilePaths[0];
                    var postFix = filePath.substring(filePath.lastIndexOf('.'), filePath.length);
                    qiniuUploader.upload(filePath, (res) => {
                        resolve(res.imageURL);
                    },(error) => {
                        reject(error);
                    },{
                        region: 'NCN',
                        domain: 'https://static.findingstar.com',
                        key: Date.now()+'_'+(Math.random()+'').split('.')[1]+postFix,
                        uptoken: qiniuToken
                    },(res)=>{
                        console.log('上传进度', res.progress)
                        console.log('已经上传的数据长度', res.totalBytesSent)
                        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
                    });
                }
            });
        });
    });
    return promise;
}
module.exports = {
    req,
    getUserInfo,
    uploadImg
}