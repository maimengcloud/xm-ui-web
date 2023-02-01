import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getCoreBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 测试计划
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'测试计划编号 主键',name:'计划名称',casedbId:'用例库编号',casedbName:'用例库名称',projectId:'项目编号',projectName:'项目名称',cuserid:'创建人编号',cusername:'创建人名称',ctime:'创建时间',stime:'开始时间',etime:'结束时间',status:'状态0-未开始，1-进行中，2已结束',tcode:'测试结果0未通过，1已通过',totalCases:'总用例数',okCases:'通过用例数',errCases:'失败用例数',igCases:'忽略用例数',blCases:'阻塞用例数',productId:'产品编号',productName:'产品名称',flowState:'评审结果0-待评审，1-已评审通过，2-已拒绝'}
 **/
 
//普通查询 条件之间and关系  
export const listXmTestPlan = params => { return axios.get(`${base}/xm/core/xmTestPlan/list`, { params: params }); };

//删除一条测试计划 params={id:'测试计划编号 主键'}
export const delXmTestPlan = params => { return axios.post(`${base}/xm/core/xmTestPlan/del`,params); };

//批量删除测试计划  params=[{id:'测试计划编号 主键'}]
export const batchDelXmTestPlan = params => { return axios.post(`${base}/xm/core/xmTestPlan/batchDel`, params); };

//修改一条测试计划记录
export const editXmTestPlan = params => { return axios.post(`${base}/xm/core/xmTestPlan/edit`, params); };

//新增一条测试计划
export const addXmTestPlan = params => { return axios.post(`${base}/xm/core/xmTestPlan/add`, params); };

//批量修改某些字段
export const editSomeFieldsXmTestPlan = params => { return axios.post(`${base}/xm/core/xmTestPlan/editSomeFields`, params); };


export const calcXmTestPlan = params => { return axios.post(`${base}/xm/core/xmTestPlan/calc`, params); };

/**-------------------------前端mng|add|edit界面公共函数---------------请写在下面----------------------------------------------- */
//初始化页面上的字典
export const initDicts = (that) => {
 var itemCodes=['testPlanStatus','testPlanTcode','testStepTcode','priority','bizFlowState','testType'];//在此添加要加载的字典 如['sex','grade','lvl']
 if(itemCodes.length>0){
    initSimpleDicts('all',itemCodes).then(res=>{
        Object.assign(that.dicts,res.data.data)
    });
 }
};