const config=require('../../config.js');
const Q=require('q.js')
const md5 = require('md5/md5.js');
const _ = require('underscore');
//通用方法
module.exports= function(method,param={}){
        var q=Q.defer();
        let data = {
            method:method,
            appkey:config.AE.AEAPI_APPKEY,
            timestamp:new Date().getTime(),
            param:param
        };
        let sign = signParams(data);
        data['sign'] = sign ;
        wx.request({
            url:config.AE.URL,
            method:'POST',
            data:data,
            success:res=>{
                if(res.data.errno<0){
                    q.reject(res.data.error);
                }else{
                    q.resolve(res.data.data);
                }
            },
            fail:err=>{
                q.reject(err)
            }
        })
        return q.promise;
};
//md6加密
var signParams = function(args){
    args['masterKey'] = config.AE.AEAPI_MASTERKEY;
    var ks = [];
    for(var k in args){
        ks.push(k)
    }
    ks = ks.sort();
    var strArgs = [];
    _.each(ks,(item)=>{
        var val = args[item] ;
        if(_.isObject(val)){
              val = JSON.stringify(val);
        }
        strArgs.push(item+"="+encodeURIComponent(val));
    });
    var content = strArgs.join('&');
    var d = md5(content);
    delete args['masterkey'];
    return d;
}
    
