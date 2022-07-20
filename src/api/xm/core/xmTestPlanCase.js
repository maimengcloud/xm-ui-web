import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getCoreBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 测试计划与用例关系表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={caseId:'测试用例编号 主键',planId:'计划编号 主键',bugs:'bug数目',execUserid:'执行人',ltime:'更新时间',ctime:'创建时间',execStatus:'0-未测，1-通过，2-受阻，3-忽略，4-失败',execUsername:'执行人姓名',caseName:'用例名称',priority:'优先级',remark:'执行备注',testStep:'测试步骤'}
 **/
 
//普通查询 条件之间and关系  
export const listXmTestPlanCase = params => { return axios.get(`${base}/xm/core/xmTestPlanCase/list`, { params: params }); };

//删除一条测试计划与用例关系表 params={caseId:'测试用例编号 主键',planId:'计划编号 主键'}
export const delXmTestPlanCase = params => { return axios.post(`${base}/xm/core/xmTestPlanCase/del`,params); };

//批量删除测试计划与用例关系表  params=[{caseId:'测试用例编号 主键',planId:'计划编号 主键'}]
export const batchDelXmTestPlanCase = params => { return axios.post(`${base}/xm/core/xmTestPlanCase/batchDel`, params); };

//修改一条测试计划与用例关系表记录
export const editXmTestPlanCase = params => { return axios.post(`${base}/xm/core/xmTestPlanCase/edit`, params); };

//新增一条测试计划与用例关系表
export const addXmTestPlanCase = params => { return axios.post(`${base}/xm/core/xmTestPlanCase/add`, params); };

//批量修改某些字段
export const editSomeFieldsXmTestPlanCase = params => { return axios.post(`${base}/xm/core/xmTestPlanCase/editSomeFields`, params); };


//批量导入测试用例到测试计划中
export const importFromTestCase = params => { return axios.post(`${base}/xm/core/xmTestPlanCase/importFromTestCase`, params); };


/**-------------------------前端mng|add|edit界面公共函数---------------请写在下面----------------------------------------------- */
//初始化页面上的字典
export const initDicts = (that) => {
 var itemCodes=['testPlanStatus','testPlanTcode','testStepTcode','priority','testCaseStatus','caseType'];//在此添加要加载的字典 如['sex','grade','lvl']
 if(itemCodes.length>0){
    initSimpleDicts('all',itemCodes).then(res=>{
        Object.assign(that.dicts,res.data.data)
    });
 }
};