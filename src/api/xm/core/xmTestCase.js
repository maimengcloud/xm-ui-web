import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getCoreBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 测试用例
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',caseName:'标题',caseRemark:'备注',testStep:'测试步骤',expectResult:'期望结果',menuId:'关联的故事',menuName:'关联故事名',ctime:'创建时间',ltime:'更新时间',luserid:'更新人编号',lusername:'更新人姓名',cbranchId:'创建机构',moduleId:'模块编号',moduleName:'模块名称',caseStatus:'用例状态1正常0废弃',cuserid:'创建人编号',cusername:'创建人姓名',productId:'产品编号',verNum:'版本号',casedbId:'用例库编号',casedbName:'用例库名称'}
 **/
 
//普通查询 条件之间and关系  
export const listXmTestCase = params => { return axios.get(`${base}/xm/core/xmTestCase/list`, { params: params }); };

//删除一条测试用例 params={id:'主键 主键'}
export const delXmTestCase = params => { return axios.post(`${base}/xm/core/xmTestCase/del`,params); };

//批量删除测试用例  params=[{id:'主键 主键'}]
export const batchDelXmTestCase = params => { return axios.post(`${base}/xm/core/xmTestCase/batchDel`, params); };

//修改一条测试用例记录
export const editXmTestCase = params => { return axios.post(`${base}/xm/core/xmTestCase/edit`, params); };

//新增一条测试用例
export const addXmTestCase = params => { return axios.post(`${base}/xm/core/xmTestCase/add`, params); };

//批量修改某些字段
export const editSomeFieldsXmTestCase = params => { return axios.post(`${base}/xm/core/xmTestCase/editSomeFields`, params); };



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