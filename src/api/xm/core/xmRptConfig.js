import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getCoreBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 测试报告配置表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'报告编号 主键',bizId:'业务编号',name:'报告名称',cuserid:'创建人',cusername:'创建人姓名',ctime:'创建时间',cbranchId:'创建机构',cfg:'报告配置项'}
 **/
 
//普通查询 条件之间and关系  
export const listXmRptConfig = params => { return axios.get(`${base}/xm/core/xmRptConfig/list`, { params: params }); };

//删除一条测试报告配置表 params={id:'报告编号 主键'}
export const delXmRptConfig = params => { return axios.post(`${base}/xm/core/xmRptConfig/del`,params); };

//批量删除测试报告配置表  params=[{id:'报告编号 主键'}]
export const batchDelXmRptConfig = params => { return axios.post(`${base}/xm/core/xmRptConfig/batchDel`, params); };

//修改一条测试报告配置表记录
export const editXmRptConfig = params => { return axios.post(`${base}/xm/core/xmRptConfig/edit`, params); };

//新增一条测试报告配置表
export const addXmRptConfig = params => { return axios.post(`${base}/xm/core/xmRptConfig/add`, params); };

//批量修改某些字段
export const editSomeFieldsXmRptConfig = params => { return axios.post(`${base}/xm/core/xmRptConfig/editSomeFields`, params); };



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