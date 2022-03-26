import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 工时登记表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',userid:'员工编号',username:'姓名',ctime:'创建日期',taskId:'业务对象主键任务编号',cuserid:'创建人编号',bizDate:'业务日期yyyy-MM-dd',wstatus:'状态0-待确认，1-已确认，2-无效',remark:'备注',ttype:'任务类型-关联字典taskType',sbillId:'结算单据编号',stime:'结算提交时间',sstatus:'结算状态0-无需结算，1-待结算2-已提交3-已通过4-已结算',amt:'工时对应金额',samt:'结算金额',workload:'工时，一个task_id可多次提交，小时'}
 **/

//普通查询 条件之间and关系
export const listXmTaskWorkload = params => { return axios.get(`${base}/xm/core/xmTaskWorkload/list`, { params: params }); };

//模糊查询工时登记表 条件之间or关系
//export const listXmTaskWorkloadKey = params => { return axios.get(`${base}/xm/core/xmTaskWorkload/listKey`, { params: params }); };

//删除一条工时登记表 params={id:'主键 主键'}
export const delXmTaskWorkload = params => { return axios.post(`${base}/xm/core/xmTaskWorkload/del`,params); };

//批量删除工时登记表  params=[{id:'主键 主键'}]
export const batchDelXmTaskWorkload = params => { return axios.post(`${base}/xm/core/xmTaskWorkload/batchDel`, params); };

//修改一条工时登记表记录
export const editXmTaskWorkload = params => { return axios.post(`${base}/xm/core/xmTaskWorkload/edit`, params); };

//新增一条工时登记表
export const addXmTaskWorkload = params => { return axios.post(`${base}/xm/core/xmTaskWorkload/add`, params); };