import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getCoreBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 项目实际人工成本费用
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',projectId:'项目编号',userid:'用户编号-费用主责人',ctime:'创建时间',sendTime:'费用发放时间',username:'用户名称',projectName:'项目名称',remark:'备注',taskId:'任务编号',taskName:'任务名称',subjectId:'科目编号',bizSdate:'费用归属周期开始日期',bizEdate:'费用归属周期结束日期',actAt:'实际成本金额',costType:'成本类型0非人力1内部人力2外购人力,此表都是非人力',bizMonth:'业务归属月份yyyy-MM',bizDate:'业务归属日期yyyy-MM-dd',subjectName:'科目名称',ubranchId:'用户归属机构',branchId:'项目归属机构'}
 **/
 
//普通查询 条件之间and关系  
export const listXmCostNlabor = params => { return axios.get(`${base}/xm/core/xmCostNlabor/list`, { params: params }); };

//删除一条项目实际人工成本费用 params={id:'主键 主键'}
export const delXmCostNlabor = params => { return axios.post(`${base}/xm/core/xmCostNlabor/del`,params); };

//批量删除项目实际人工成本费用  params=[{id:'主键 主键'}]
export const batchDelXmCostNlabor = params => { return axios.post(`${base}/xm/core/xmCostNlabor/batchDel`, params); };

//修改一条项目实际人工成本费用记录
export const editXmCostNlabor = params => { return axios.post(`${base}/xm/core/xmCostNlabor/edit`, params); };

//新增一条项目实际人工成本费用
export const addXmCostNlabor = params => { return axios.post(`${base}/xm/core/xmCostNlabor/add`, params); };

//批量修改某些字段
export const editSomeFieldsXmCostNlabor = params => { return axios.post(`${base}/xm/core/xmCostNlabor/editSomeFields`, params); };


//普通查询 条件之间and关系  
export const listSumXmCostNlabor = params => { return axios.get(`${base}/xm/core/xmCostNlabor/listSum`, { params: params }); };


/**-------------------------前端mng|add|edit界面公共函数---------------请写在下面----------------------------------------------- */
//初始化页面上的字典
export const initDicts = (that) => {
 var itemCodes=['projectSubject'];//在此添加要加载的字典 如['sex','grade','lvl']
 if(itemCodes.length>0){
    initSimpleDicts('all',itemCodes).then(res=>{
        Object.assign(that.dicts,res.data.data)
    });
 }
};