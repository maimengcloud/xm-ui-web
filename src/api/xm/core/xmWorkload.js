import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 工时登记表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',userid:'员工编号',username:'姓名',ctime:'创建日期',taskId:'业务对象主键任务编号',cuserid:'创建人编号',bizDate:'业务日期yyyy-MM-dd',wstatus:'状态0-待确认，1-已确认，2-无效',remark:'备注',ttype:'任务类型-关联字典taskType',sbillId:'结算单据编号',stime:'结算提交时间',sstatus:'结算状态0-无需结算，1-待结算2-已提交3-已通过4-已结算',amt:'工时对应金额',samt:'结算金额',workload:'工时，一个task_id可多次提交，小时'}
 **/

//普通查询 条件之间and关系
export const listXmWorkload = params => { return axios.get(`${base}/xm/core/xmWorkload/list`, { params: params }); };

//模糊查询工时登记表 条件之间or关系
//export const listXmWorkloadKey = params => { return axios.get(`${base}/xm/core/xmWorkload/listKey`, { params: params }); };

//删除一条工时登记表 params={id:'主键 主键'}
export const delXmWorkload = params => { return axios.post(`${base}/xm/core/xmWorkload/del`,params); };

//批量删除工时登记表  params=[{id:'主键 主键'}]
export const batchDelXmWorkload = params => { return axios.post(`${base}/xm/core/xmWorkload/batchDel`, params); };

//修改一条工时登记表记录
export const editXmWorkload = params => { return axios.post(`${base}/xm/core/xmWorkload/edit`, params); };

//新增一条工时登记表
export const addXmWorkload = params => { return axios.post(`${base}/xm/core/xmWorkload/add`, params); };

//普通查询 条件之间and关系
export const listByProject = params => { return axios.get(`${base}/xm/core/xmWorkload/listByProject`, { params: params }); };

export const editWorkloadToSbill = params => { return axios.post(`${base}/xm/core/xmWorkload/editWorkloadToSbill`, params); };

export const editXmWorkloadSomeFields = params => { return axios.post(`${base}/xm/core/xmWorkload/editSomeFields`, params); };


export const listProjectWorkloadSetDay = params => { return axios.get(`${base}/xm/core/xmWorkload/listProjectWorkloadSetDay`, { params: params }); };
export const listProjectWorkloadSetMonth = params => { return axios.get(`${base}/xm/core/xmWorkload/listProjectWorkloadSetMonth`, { params: params }); };
export const batchSetSbillIdNull = params => { return axios.post(`${base}/xm/core/xmWorkload/batchSetSbillIdNull`, params); };


export const listXmWorkloadGroupByTaskIdAndUserid = params => { return axios.get(`${base}/xm/core/xmWorkload/ListGroupByTaskIdAndUserid`, { params: params }); };

export const listXmWorkloadGroupByTaskIdAndUseridToSet = params => { return axios.get(`${base}/xm/core/xmWorkload/ListGroupByTaskIdAndUseridToSet`, { params: params }); };

 


/**-------------------------前端mng|add|edit界面公共函数---------------请写在下面----------------------------------------------- */
//初始化页面上的字典
export const initDicts = (that) => {
    var itemCodes=['taskState','taskType'];//在此添加要加载的字典 如['sex','grade','lvl']
    
    var wlBizType=[{id:'1',name:'任务'},{id:'2',name: '缺陷'},{id:'3',name:'测试用例'},{id:'4',name:'执行用例'},{id:'5',name:'需求'}]
    var wstatus=[{id:'0',name:'待确认'},{id:'1',name: '已确认'}]
    var sstatus=[{id:'0',name:'无需结算'},{id:'1',name: '待结算'},{id:'2',name:'已提交'},{id:'3',name:'已通过'},{id:'4',name:'已结算'}]
    that.dicts.wstatus=wstatus
    that.dicts.sstatus=sstatus
    that.dicts.wlBizType=wlBizType
    if(itemCodes.length>0){
       initSimpleDicts('all',itemCodes).then(res=>{
           Object.assign(that.dicts,res.data.data)
       });
    }
   };

