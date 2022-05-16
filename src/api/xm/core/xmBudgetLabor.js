import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getCoreBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 项目人力成本预算
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',projectId:'项目编号',userid:'项目成员编号',budgetAt:'预算金额/每月',remark:'备注',username:'用户名',subjectId:'预算科目编号',bizSdate:'费用归属周期开始日期',bizEdate:'费用归属周期结束日期',bizMonth:'费用归属月份yyyy-mm',instId:'当前流程实例编号',bizFlowState:'当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除',costType:'成本类型0非人力1内部人力2外购人力',subjectName:'科目名称',branchId:'项目归属机构编号',ubranchId:'用户归属机构编号-也就是将来的结算对象'}
 **/
 
//普通查询 条件之间and关系  
export const listXmBudgetLabor = params => { return axios.get(`${base}/xm/core/xmBudgetLabor/list`, { params: params }); };

//删除一条项目人力成本预算 params={id:'主键 主键'}
export const delXmBudgetLabor = params => { return axios.post(`${base}/xm/core/xmBudgetLabor/del`,params); };

//批量删除项目人力成本预算  params=[{id:'主键 主键'}]
export const batchDelXmBudgetLabor = params => { return axios.post(`${base}/xm/core/xmBudgetLabor/batchDel`, params); };

//修改一条项目人力成本预算记录
export const editXmBudgetLabor = params => { return axios.post(`${base}/xm/core/xmBudgetLabor/edit`, params); };

//新增一条项目人力成本预算
export const addXmBudgetLabor = params => { return axios.post(`${base}/xm/core/xmBudgetLabor/add`, params); };

//批量修改某些字段
export const editSomeFieldsXmBudgetLabor = params => { return axios.post(`${base}/xm/core/xmBudgetLabor/editSomeFields`, params); };



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