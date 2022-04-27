import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getCoreBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 工时登记表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',userid:'员工编号',username:'姓名',ctime:'创建日期',taskId:'业务对象主键任务编号',bizDate:'业务日期yyyy-MM-dd',remark:'备注',sbillId:'结算单据编号-来自task_sbill.id',stime:'结算提交时间',sstatus:'结算状态0-无需结算，1-待结算2-已提交3-已通过4-已结算',amt:'工时对应金额',samt:'结算工时对应结算金额-根据结算方案计算结算金额',workload:'报工工时',projectId:'归属项目',sworkload:'结算工时，用于结算，默认=workload',bizMonth:'月份yyyy-MM型',budgetAt:'任务预算金额-来自task表',budgetWorkload:'任务预算工时-来自task表',initWorkload:'任务初始工时-来自task表',quoteAt:'报价金额-来自task_execuser表',quoteWorkload:'报价工时-来自task_execuser表',sschemel:'任务结算方案,来自task表、来自数字字典xmTaskSettleSchemel',uniPrice:'工时单价，来自task表，根据task_out判断取内部还是外部单价',qendTime:'报价结束时间',qstartTime:'报价开始时间',actEndTime:'实际完工时间-来自task表',actStartTime:'实际开始时间-来自task表'}
 **/
 
//普通查询 条件之间and关系  
export const listXmTaskSbillDetail = params => { return axios.get(`${base}/xm/core/xmTaskSbillDetail/list`, { params: params }); };

//删除一条工时登记表 params={id:'主键 主键'}
export const delXmTaskSbillDetail = params => { return axios.post(`${base}/xm/core/xmTaskSbillDetail/del`,params); };

//批量删除工时登记表  params=[{id:'主键 主键'}]
export const batchDelXmTaskSbillDetail = params => { return axios.post(`${base}/xm/core/xmTaskSbillDetail/batchDel`, params); };

//修改一条工时登记表记录
export const editXmTaskSbillDetail = params => { return axios.post(`${base}/xm/core/xmTaskSbillDetail/edit`, params); };

//新增一条工时登记表
export const addXmTaskSbillDetail = params => { return axios.post(`${base}/xm/core/xmTaskSbillDetail/add`, params); };

//批量修改某些字段
export const editSomeFieldsXmTaskSbillDetail = params => { return axios.post(`${base}/xm/core/xmTaskSbillDetail/editSomeFields`, params); };


//普通查询 条件之间and关系  
export const listSumSamtGroupByUseridBizMonth = params => { return axios.get(`${base}/xm/core/xmTaskSbillDetail/listSumSamtGroupByUseridBizMonth`, { params: params }); };

export const listSumSamtGroupByProjectIdBizMonth = params => { return axios.get(`${base}/xm/core/xmTaskSbillDetail/listSumSamtGroupByProjectIdBizMonth`, { params: params }); };

export const listSumSamtGroupByBranchIdBizMonth = params => { return axios.get(`${base}/xm/core/xmTaskSbillDetail/listSumSamtGroupByBranchIdBizMonth`, { params: params }); };

 

/**-------------------------前端mng|add|edit界面公共函数---------------请写在下面----------------------------------------------- */
//初始化页面上的字典
export const initDicts = (that) => { 
 var itemCodes=['taskState','taskType','xmTaskSettleSchemel'];//在此添加要加载的字典 如['sex','grade','lvl'] 
 var wstatus=[{id:'0',name:'待确认'},{id:'1',name: '已确认'}]
 var sstatus=[{id:'0',name:'无需结算'},{id:'1',name: '待结算'},{id:'2',name:'已提交'},{id:'3',name:'已通过'},{id:'4',name:'已结算'}]
 that.dicts.wstatus=wstatus
 that.dicts.sstatus=sstatus
 if(itemCodes.length>0){
    initSimpleDicts('all',itemCodes).then(res=>{
        Object.assign(that.dicts,res.data.data)
    });
 }
};