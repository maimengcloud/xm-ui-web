import axios from '@/utils/request'

import config from '@/common/config'



 var h1=require('../../static/images/head/1.png') 
 var h2=require('../../static/images/head/2.png')  
 var h3=require('../../static/images/head/3.png') 
 var h4=require('../../static/images/head/4.png') 
 var h5=require('../../static/images/head/5.png') 
 var h6=require('../../static/images/head/6.png') 
 var h7=require('../../static/images/head/7.png') 
 var h8=require('../../static/images/head/8.png') 
 var h9=require('../../static/images/head/9.png') 
 var h10=require('../../static/images/head/10.png') 
 var h11=require('../../static/images/head/11.png') 
 var h12=require('../../static/images/head/12.png') 
 var h13=require('../../static/images/head/13.png') 
 var h14=require('../../static/images/head/14.png') 
 var h15=require('../../static/images/head/15.png') 
 var h16=require('../../static/images/head/16.png') 
 var h17=require('../../static/images/head/17.png') 
 var h18=require('../../static/images/head/18.png') 
 var h19=require('../../static/images/head/19.png') 
 var h20=require('../../static/images/head/20.png')  
 var h21=require('../../static/images/head/21.png')  
 var h22=require('../../static/images/head/22.png')  
 var h23=require('../../static/images/head/23.png')  
 var h24=require('../../static/images/head/24.png')  
 var h25=require('../../static/images/head/25.png') 
 var h26=require('../../static/images/head/26.png')  
 var h27=require('../../static/images/head/27.png')  
 var h28=require('../../static/images/head/28.png')  
 var h29=require('../../static/images/head/29.png')  
 var h30=require('../../static/images/head/30.png')  
 var h31=require('../../static/images/head/31.png')  
 var h32=require('../../static/images/head/32.png')  
 var h33=require('../../static/images/head/33.png')  
 var h33=require('../../static/images/head/33.png')  
 var h33=require('../../static/images/head/33.png')  
 var h34=require('../../static/images/head/34.png')  
 var h35=require('../../static/images/head/35.png') 
 var h36=require('../../static/images/head/36.png')  
 var h37=require('../../static/images/head/37.png')  
 var h38=require('../../static/images/head/38.png')  
 var h39=require('../../static/images/head/39.png')  
 var h40=require('../../static/images/head/40.png')  
 var h41=require('../../static/images/head/41.png')   
 var h42=require('../../static/images/head/42.png')  
 var h43=require('../../static/images/head/43.png')  
 var h44=require('../../static/images/head/44.png')  
 var h45=require('../../static/images/head/45.png') 
 var h46=require('../../static/images/head/46.png')  
 var h47=require('../../static/images/head/47.png')  
 var h48=require('../../static/images/head/48.png')  
 var h49=require('../../static/images/head/49.png')  
 var h50=require('../../static/images/head/50.png')  
 var h51=require('../../static/images/head/51.png')  
 var h52=require('../../static/images/head/52.png')   
 var h53=require('../../static/images/head/53.png')  
 var h54=require('../../static/images/head/54.png')  
 var h55=require('../../static/images/head/55.png') 
 var h56=require('../../static/images/head/56.png')  
 var h57=require('../../static/images/head/57.png')  
 var h58=require('../../static/images/head/58.png')  
 var h59=require('../../static/images/head/59.png')  
 var h60=require('../../static/images/head/60.png')  
 var h61=require('../../static/images/head/61.png')  
 var h62=require('../../static/images/head/62.png')  
 var h63=require('../../static/images/head/63.png')  
 var h64=require('../../static/images/head/64.png')  
 var h65=require('../../static/images/head/65.png') 
 var h66=require('../../static/images/head/66.png')  
 var h67=require('../../static/images/head/67.png')  
 var h68=require('../../static/images/head/68.png')  
 var h69=require('../../static/images/head/69.png')  
 var h70=require('../../static/images/head/70.png')   

 var defaultMan=require('../../static/images/man.png')

 var noData=require('../../static/images/no-information.png') 

 var imgList=[ h1,h2,h3,h4,h5,h6,h7,h8,h9,h10,h11,h12,h13,h14,h15,h16,h17,h18,h19,h20,h21,h22,h23,h24,h25,h26,
h27,h28,h29,h30,h31,h32,h33,h34,h35,h36,h37,h38,h39,h40,h41,h42,h43,h44,h45,h46,h47,h48,h49,h50,h51,h52,h53,h54,
h55,h56,h57,h58,h59,h60,h61,h62,h63,h64,h64,h66,h67,h68,h69,h70
]

 export default {

  onImgError:function(userid,$event){
    debugger;
    let img = $event.srcElement;
    img.src = this.getDefHeadimg(userid)
    img.onerror = null; //防止闪图
    return false;
  },

/**
 * 对于给定的用户编号，返回一个固定的默认头像，用于用户未设置头像的情况下，给页面显示一个头像
 * @param {*} userid 
 * @returns 
 */
getDefHeadimg:function(userid){  
  
  if(userid){
    var nums=0;
    var codes = userid.split('');
    codes.forEach(e=>{
      nums=nums+e.charCodeAt();
    })
    var cp=imgList[nums%imgList.length]
    return cp;
  }else{ 
    return defaultMan;
  }
},

/**
 * 通过用户编号组装请求用户头像的url
 * @param {*} userid 用户编号
 * @param {*} headimgurl 用户配置的头像地址
 * @param {*} rand false || true ,是否给url添加随机数，用于立即刷新头像，否则头像更新后，会被cdn缓存一段时间
 * @returns 
 */
 getHeadimgurl:function (userid,headimgurl,rand) {  
  debugger;
  if(!userid){
    return null;
  }
  if(headimgurl){
    return headimgurl;
  }else{
    var authorStr=sessionStorage.getItem('authorMsg_' + userid) 
    if(authorStr&&authorStr!='null'&& authorStr!='undefined'){
      var author=JSON.parse(authorStr)
      if(author && author.headimgurl){
        return author.headimgurl
      }
    }
  }
  if(rand){
    var dateTime=new Date().getTime();
    return `/api/${process.env.VERSION}/arc/${dateTime}/arc/image/user/${userid}.jpg`
  }else{
    return `/api/${process.env.VERSION}/arc/arc/image/user/${userid}.jpg`
  }
     
 },

 noDataImg:function(){
  return noData;
 }
 

}
