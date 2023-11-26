/**
 * mdp框架前端与后端交互核心公共api 
 * 一般情况下请勿将业务代码加入此文件，业务代码及其它模块及api应该放入各自单独的api文件中，如果实在要添加，请添加到$mdp_api_biz.js文件中，实现全局调用
 * 扩展组件的api请加入到fly_mdp_ext.js中
 */
import axios from '@/utils/request'
import util from '@/components/mdp-ui/js/util';//全局公共库
import {sn} from '@/components/mdp-ui/js/sequence';//全局公共库
import config from './mdp_config'
let sysBase = config.getSysContext(); 

const mdpBaseCache=new Map();

var SIGN_REGEXP = /([yMdhsmH])(\1*)/g
var DEFAULT_PATTERN = 'yyyy-MM-dd'
 
const colors=['#909399','#409EFF','#67C23A','#E6A23C','#F56C6C','#00ced1','#c71585','#ff8c00','#c7158577','#ffd700'];

var funcs = {

  ...util,
/**
 * 从后端请求数据字典列表
 * @param {*} params {itemCode:xxx,categoryId:xxx,....其它参数}
 * @returns 
 */
 getDicts: function(params){ return axios.get(`/${sysBase}/mdp/meta/item/dicts`, { params: params }); },

 /**
  * 检查某个按钮是否具有访问权限
  * @param {*} btnId 按钮编号
  * @param {*} menuDefId 
  * @returns true/false
  */
 checkBtnQx:function(btnId,menuDefId,params){
   return true;
 },
 

  /**
   * 生成缓存key
   * @param {*} itemCode 
   * @param {*} params 
   * @returns 
   */
  getCodeKey:function (itemCode,params){
    var codeKey='mdp-dict-cache'+'@'+itemCode 
    if(params){
      for (let [key, value] of Object.entries(params)) {
        if(key=="itemCode"){
          continue;
        }
        codeKey=codeKey+"@"+key+":"+value
       }
    }
    return codeKey;
  },
clearDictCache:function(itemCode,params){
  var codeKey=funcs.getCodeKey(itemCode,params); 
  var lockKey=codeKey+'@lock'
  mdpBaseCache.delete(codeKey)
  sessionStorage.removeItem(codeKey)
  sessionStorage.removeItem(lockKey)
  
},
/**
 * 字典标签专用（通过itemCode获取字典下拉列表数组）
 * 注意：该api将首先寻找全局缓存，找不到再祥服务器申请
 **/
ajaxGetDictOptions:function(itemCode, params)
{ 
  
  var codeKey=funcs.getCodeKey(itemCode,params); 
   return new Promise((resolve,reject)=>{ 
    var data=funcs.getDictOptionsFromCache(codeKey,itemCode,params) 
    if(data){
      var res2={
        tips:{
          isOk:true,
          tipscode:'ok',
          msg:'成功'
        },
        data:data
      }
      resolve(res2)  
    }else{
      
      var lockKey=codeKey+'@lock'
      var lock=sessionStorage.getItem(lockKey)
       let func = function(){ 
        var data=funcs.getDictOptionsFromCache(codeKey,itemCode,params) 
        if(data){
          var res2={
            tips:{
              isOk:true,
              tipscode:'ok',
              msg:'成功'
            },
            data:data
          }
          resolve(res2)  
          return;
        } 
        if(!params){
          params={itemCode:itemCode}
        }else{
          params.itemCode=itemCode
        }
        sessionStorage.setItem(lockKey,"1")
        funcs.getDicts(params).then(res=>{ 
            
            if(res.data.tips && res.data.tips.isOk){
              if(!res.data.data || res.data.data.length==0){
                resolve({tips:res.data.tips,data:{}}) 
                return;
              }
              var item=res.data.data[0]
              if(item.options && item.options.length>0){
                item.options.forEach(k=>{
                  if(k!=null && k.id!=null){ 
                    if(!k.color){
                        k.color=funcs.getColorById(k.id)
                    }
                  } 
                })
              }
              
              sessionStorage.setItem(codeKey,JSON.stringify(res.data.data[0]))
              sessionStorage.removeItem(lockKey)
              var res2={
                tips:res.data.tips,
                data:res.data.data[0]
              }
              mdpBaseCache.set(codeKey,res2)
              resolve(res2) 
              
            }else{
              sessionStorage.removeItem(lockKey)
              mdpBaseCache.set(codeKey,null)
              reject(res) 
            }
          }).catch(e=>{
            mdpBaseCache.set(codeKey,null)
            sessionStorage.removeItem(lockKey)
            reject(e)  
          }) 
      }
      if(lock){
        setTimeout(()=>{
          func();
        },1000)
      }else{
        func();
      }
      
    } 
  }) 
 },
 
 /**
  * 默认颜色列表
  * @returns 
  */
 getDefaultColors:function(){ 
  return colors
 }, 

 /**
  * 根据id获取系统默认的对应颜色
  * @param {*} id 
  * @returns 
  */
 getColorById(id){ 
    var cellValue=id
    var colors=this.getDefaultColors();
    if(!cellValue){
      return colors[0]
    } 
    var cellValueInt=parseInt(cellValue)
      if( isNaN( cellValueInt) ){ 
        if(typeof cellValue =='string' && cellValue.length>0){
           var idxList=[]
           if(cellValue.length==1){ 
               idxList=[0]
           }else if(cellValue.length==2){
               idxList=[0,1] 
           }else if(cellValue.length==3){
               idxList=[0,1,2] 
           }else{
               idxList=[0,parseInt((cellValue.length-1)/2),cellValue.length-1] 
           }
           
           cellValueInt=0;
           for(var i=0;i<idxList.length;i++){
               cellValueInt=cellValueInt+ cellValue.charCodeAt(idxList[i])
           } 
        }else{
          cellValueInt=0;
        } 
      }
      var colorIndex=cellValueInt % colors.length
      if(cellValueInt > 0 && colorIndex==0){
        colorIndex=1
      }
      return  colors[colorIndex]

}, 

/**
 * 从缓存中获取字典列表，该函数不会向后端请求
 * */
getDictOptionsFromCache: function(codeKey,itemCode,params) { 
  var item=mdpBaseCache.get(codeKey)
  if(item && item.id){
    return item
  }
  var clistStr=sessionStorage.getItem(codeKey);
  if (clistStr&& clistStr!='null' && clistStr!='undefined') {
    let item = JSON.parse(clistStr)
    return item;
  }else{
    return null;
  }
},

/**
 * 反显字典值
 * @param {*} itemCode 字典代码
 * @param {*} value 字典值
 * @param {*} params 参数可空
 * @returns 
 */
formatDict:async function(itemCode, value,params)
{ 
   if(!value){
    return value;
  }
  this.ajaxGetDictOptions(itemCode,params).then(res=>{ 
    if(res.tips.isOk && res.data){
      var item=res.data
      var find=item.options.find(k=>k.id==value)
      if(find){
        return find.name
      }else{
        return value;
      }
    }else{
      return value;
    }  
  })  
},

createSeqNo:function(prefix){
  return  sn(prefix);
},
/**
 * 字段转成驼峰命名
 * @param {*} name
 */
  toCamel:function(name) {
  var name1= name.replace(/\_(\w)/g, function(all, letter) {
    return letter.toUpperCase();
  });
  return name1.replace(/\-(\w)/g, function(all, letter) {
    return letter.toUpperCase();
  });
},
/**
 * 驼峰转下横线
 * @param {*} name
 */
toLine:function(name) {
  return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}, 
/**
 * 格式化日期
 * @param {*} date 
 * @param {*} pattern 
 * @returns 
 */
formatDate: function(date, pattern) {
  pattern = pattern || DEFAULT_PATTERN
  return pattern.replace(SIGN_REGEXP, function($0) {
    switch ($0.charAt(0)) {
      case 'y':
        return padding(date.getFullYear(), $0.length)
      case 'M':
        return padding(date.getMonth() + 1, $0.length)
      case 'd':
        return padding(date.getDate(), $0.length)
      case 'w':
        return date.getDay() + 1
      case 'h':
        return padding(date.getHours(), $0.length)
      case 'H':
        return padding(date.getHours(), $0.length)
      case 'm':
        return padding(date.getMinutes(), $0.length)
      case 's':
        return padding(date.getSeconds(), $0.length)
    }
  })
},
 
}


export default funcs;


