import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getSysBasePath();


/**
 * 数据项定义
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',itemCode:'代码，小写,下横线分割，请不要用驼峰命名',itemName:'名称',remark:'备注',categoryId:'分类编号',itemSize:'长度',itemType:'类型',branchId:'机构编号',deptid:'部门编号',cmenu:'是否创建菜单',values:'默认值,如果是列表，则存储列表编号，多个逗号分割',names:'默认名称，如果是列表，则存储列表名称，多个则逗号分割',options:'item_type=4,5时的选项列表[{value:值,name:显示名称}]',inputFormat:'输入提示',required:'是否必须0否1是',seq:'排序顺序',table:'表名',show:'是否显示0否1是',qx:'权限，是否可以0-新增，1-删除，2-编辑，3-查询，多个以逗号分割'}
 **/
 
//普通查询 条件之间and关系  
export const listItem = params => { return axios.get(`${base}/mdp/meta/item/list`, { params: params }); };

export const getDicts = params => { return axios.get(`${base}/mdp/meta/item/dicts`, { params: params }); };

/**下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex','grade']} 返回结果 
{
    sex:  [{id:'1',name:'男'},{id:'2',name:'女'}],
    grade:[{id:'1',name:'等级1'},{id:'2',name:'等级2'}]
}
**/
export const initSimpleDicts=function(categoryId,itemCodes){ 
    if(!categoryId){
        categoryId="all"
    }
    return new Promise((resolve, reject) => {
        var keys=itemCodes
        var localDicts={}
        var nolocalDictsKeys=[];
        var datetime=new Date().getTime();
        var millSec=24*60*60*1000;//一天的毫秒数
        keys.forEach(i=>{
            var key=categoryId+"_@"+i;
           var value= localStorage.getItem(key)
           if(value!=null &&value.length>0){
               var data=JSON.parse(value)
               var time=data.time;
               if((datetime-time)>millSec){
                nolocalDictsKeys.push(i)
                localStorage.removeItem(key);
               }else{
                localDicts[i]=data.options
               }
                
           }else{
                nolocalDictsKeys.push(i)
           }
        })
        if(nolocalDictsKeys.length==0){
            var res={data:{tips:{isOk:true,msg:"成功"},data:localDicts}}
            resolve(res)
        }else{
            getDicts({categoryId:categoryId,itemCodes:nolocalDictsKeys}).then(res=>{ 
                if(!res.data.tips){
                    reject(res)
                }else if(res.data.tips.isOk){
                    var data=res.data.data
                    var dicts=localDicts;
                    data.forEach(dict=>{
                        if(dict.optionList){
                            dict.options=JSON.parse(dict.optionList)
                            dict.options.forEach(k=>{
                                var cellValue=k.id
                                var classNames=['info','primary','success','warning','danger']; 
                                var colors=['#909399','#409EFF','#67C23A','#E6A23C','#F56C6C','#00ced1','#c71585','#ff8c00','#c7158577','#ffd700'];
                                var cellValueInt=parseInt(cellValue)
                                if( isNaN(cellValueInt) ){ 
                                  if(cellValue instanceof String && cellValue.length>0){
                                    cellValueInt=cellValue.chartCodeAt(cellValue.length-1)
                                  }else if(cellValue instanceof Object){
                                    if(cellValue['userid']){
                                      cellValueInt=cellValue['userid'].chartCodeAt(cellValue['userid'].length-1)
                                    }else{
                                      cellValueInt=0;
                                    }
                                    
                                  }else{
                                    cellValueInt=0;
                                  }
                                }
                                var colorIndex=cellValueInt % 10
                                if(cellValueInt > 0 && colorIndex==0){
                                  colorIndex=1
                                }
                                var typeIndex=cellValueInt % 5
                                if(cellValueInt > 0 && typeIndex==0){
                                  typeIndex=1
                                }
                                if(!k.color){
                                    k.color=colors[colorIndex]
                                }
                                k.className=classNames[typeIndex]
                            })
                        }else{
                        dict.options=[]
                        }
                        dicts[dict.itemCode]=dict.options
                        localStorage.setItem(categoryId+'_@'+dict.itemCode,JSON.stringify({options:dict.options,time:datetime}))
                    })
                    res.data.data=dicts;
                    resolve(res);
                }else{
                    resolve(res);
                }  
            }).catch(e=>reject(e));
        } 
    });
};
/**下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex','grade']} 返回结果 
  {
      sex:{id:'',itemCode:'',itemName:'',itemType:'',values:'',names:'','options':[{id:'1',name:'男'},{id:'2',name:'女'}]}
      grade:{id:'',itemCode:'',itemName:'',itemType:'',values:'',names:'','options':[{id:'1',name:'等级1'},{id:'2',name:'等级2'}]}
  }
  
 ***/
export const initComplexDicts=function(categoryId,itemCodes){
    
    if(!categoryId){
        categoryId="all"
    }
    return new Promise((resolve, reject) => {
        getDicts({categoryId:categoryId,itemCodes:itemCodes}).then(res=>{ 
                if(!res.data.tips){
                    reject(res)
                }else if(res.data.tips.isOk){
                    var data=res.data.data
                    var dicts={};
                    data.forEach(dict=>{
                        if(dict.optionList){
                            dict.options=JSON.parse(dict.optionList)
                        }else{
                        dict.options=[]
                        }
                        dicts[dict.itemCode]=dict
                    })
                    res.data.data=dicts;
                    resolve(res);
                }else{
                    resolve(res);
                }  
        }).catch(e=>reject(e));
    });
};
 
//模糊查询数据项定义 条件之间or关系  
//export const listItemKey = params => { return axios.get(`${base}/mdp/meta/item/listKey`, { params: params }); };

//删除一条数据项定义 params={id:'主键 主键'}
export const delItem = params => { return axios.post(`${base}/mdp/meta/item/del`,params); };

//批量删除数据项定义  params=[{id:'主键 主键'}]
export const batchDelItem = params => { return axios.post(`${base}/mdp/meta/item/batchDel`, params); };

//修改一条数据项定义记录
export const editItem = params => { return axios.post(`${base}/mdp/meta/item/edit`, params); };

//新增一条数据项定义
export const addItem = params => { return axios.post(`${base}/mdp/meta/item/add`, params); };

//新增一条数据项定义
export const copyToNewCategory = params => { return axios.post(`${base}/mdp/meta/item/copyToNewCategory`, params); };

//新增或者修改
export const insertOrUpdateItem = params => { return axios.post(`${base}/mdp/meta/item/insertOrUpdate`, params); };


