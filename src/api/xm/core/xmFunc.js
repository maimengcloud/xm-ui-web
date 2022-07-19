import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getCoreBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 功能模块表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',name:'名称',pid:'上级编号',pname:'上级名称',pidPaths:'上级路径，直到自身，逗号分割，包含自身',productId:'产品编号',lvl:'菜单级别0-根，1，2，3，4，5依次类推'}
 **/
 
//普通查询 条件之间and关系  
export const listXmFunc = params => { return axios.get(`${base}/xm/core/xmFunc/list`, { params: params }); };

//删除一条功能模块表 params={id:'主键 主键'}
export const delXmFunc = params => { return axios.post(`${base}/xm/core/xmFunc/del`,params); };

//批量删除功能模块表  params=[{id:'主键 主键'}]
export const batchDelXmFunc = params => { return axios.post(`${base}/xm/core/xmFunc/batchDel`, params); };

//修改一条功能模块表记录
export const editXmFunc = params => { return axios.post(`${base}/xm/core/xmFunc/edit`, params); };

//新增一条功能模块表
export const addXmFunc = params => { return axios.post(`${base}/xm/core/xmFunc/add`, params); };

//批量修改某些字段
export const editSomeFieldsXmFunc = params => { return axios.post(`${base}/xm/core/xmFunc/editSomeFields`, params); };



/**-------------------------前端mng|add|edit界面公共函数---------------请写在下面----------------------------------------------- */
//初始化页面上的字典
export const initDicts = (that) => {
 var itemCodes=[];//在此添加要加载的字典 如['sex','grade','lvl']
 if(itemCodes.length>0){
    initSimpleDicts('all',itemCodes).then(res=>{
        Object.assign(that.dicts,res.data.data)
    });
 }
};