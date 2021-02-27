import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

/**
 * 数据项取值列表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',itemId:'数据项编号',optionValue:'选项值',optionName:'选项名称',keys:'快捷键',isShow:'是否显示',seqOrder:'顺序',fp:'第一扩展字段',tp:'第三扩展字段',sp:'第二扩展字段',isDefault:'是否默认',cdate:'创建日期',branchId:'机构编号',deptid:'部门编号'}
 **/
 
//普通查询 条件之间and关系  
export const listItemOption = params => { return axios.get(`${base}/mdp/meta/itemOption/list`, { params: params }); };


//普通查询 条件之间and关系 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
export const listOption = params => { 
    var date=new Date();
    var dateStr=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay() 
    var result={
        data:{
            tips:{
                isOk:true,
            },
            data:{

            }
        }
    }
    var noExistsParams=params.filter(i=>{
        var key=i.categoryId+"-"+i.itemCode+"-"+dateStr;
        var options = localStorage.getItem(key);
        if(options){ 
            result.data.data[i.itemCode]=JSON.parse(options)
            return false
        }return true;
    });
    return new Promise((resolve,reject) => { 
        if(noExistsParams.length>0){ 
            axios.post(`${base}/mdp/meta/itemOption/list/byItemCode`,   noExistsParams ).then(res=>{
                var tips = res.data.tips;
                if(tips.isOk){
                    var data=res.data.data;
                    noExistsParams.forEach(k=>{
                        var key=k.categoryId+"-"+k.itemCode+"-"+dateStr;
                        localStorage.setItem(key, JSON.stringify(data[k.itemCode]));
                        result.data.data[k.itemCode]= data[k.itemCode]
                    })
                }else{
                    result.data.tips=tips;
                }
                resolve(result); 
            }).catch(e=>reject(e));
        }else{
            resolve(result); 
        }  
        
  });

};
export const listOptionByItemIds = params => { 
    var date=new Date();
    var dateStr=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay() 
    var result={
        data:{
            tips:{
                isOk:true,
            },
            data:{

            }
        }
    }
    var noExistsParams=params.filter(i=>{
        var key=i+"-"+dateStr;
        var options = localStorage.getItem(key);

        if(options){ 
            var optionsJson=JSON.parse(options);
            result.data.data[i]=optionsJson
            return false
        }return true;
    });
    return new Promise((resolve,reject) => { 
        if(noExistsParams.length>0){ 
            axios.post(`${base}/mdp/meta/itemOption/listItemOptionByItemIds`,   noExistsParams ).then(res=>{
                var tips = res.data.tips;
                if(tips.isOk){
                    var data=res.data.data;
                    noExistsParams.forEach(k=>{
                        var key= k+"-"+dateStr;
                        localStorage.setItem(key, JSON.stringify(data[k]));
                        result.data.data[k]= data[k]
                    })
                }else{
                    result.data.tips=tips;
                }
                resolve(result); 
            }).catch(e=>reject(e));
        }else{
            resolve(result); 
        }  
        
  });

}; 


//params={id:''} 返回 {optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'} 
export const getSysParam = params => { return axios.post(`${base}/mdp/meta/itemOption/sysParam`,   params ); };
//模糊查询数据项取值列表 条件之间or关系  
//export const listItemOptionKey = params => { return axios.get(`${base}/mdp/meta/itemOption/listKey`, { params: params }); };

//删除一条数据项取值列表 params={id:'主键 主键'}
export const delItemOption = params => { return axios.post(`${base}/mdp/meta/itemOption/del`,params); };

//批量删除数据项取值列表  params=[{id:'主键 主键'}]
export const batchDelItemOption = params => { return axios.post(`${base}/mdp/meta/itemOption/batchDel`, params); };

//修改一条数据项取值列表记录
export const editItemOption = params => { return axios.post(`${base}/mdp/meta/itemOption/edit`, params); };

//新增一条数据项取值列表
export const addItemOption = params => { return axios.post(`${base}/mdp/meta/itemOption/add`, params); };