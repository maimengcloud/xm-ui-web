import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 任务结算表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'结算单据编号 主键',title:'结算单标题',amt:'金额=工时表中结算金额之和',ctime:'创建时间',cuserid:'创建人编号',cusername:'创建人姓名',remark:'备注',branchId:'机构编号',deptid:'部门编号',cpId:'相对方编号(机构写机构号，个人写个人编号)',cpName:'相对方名称（机构写机构名称，个人写个人名称）',workload:'结算工作量=工时表中工时之和',bizMonth:'业务月份yyyy-MM',bizDate:'业务日期yyyy-MM-dd',bizFlowState:'结算流程状态',bizProcInstId:'结算流程实例',ltime:'更新时间',status:'0-待提交，1-已提交，2-已通过，3-已付款，4-已完成',fmsg:'最后审核意见',projectId:'项目编号',projectName:'项目名称'}
 **/

//普通查询 条件之间and关系
export const listXmTaskSbill = params => { return axios.get(`${base}/xm/core/xmTaskSbill/list`, { params: params }); };

//模糊查询任务结算表 条件之间or关系
//export const listXmTaskSbillKey = params => { return axios.get(`${base}/xm/core/xmTaskSbill/listKey`, { params: params }); };

//删除一条任务结算表 params={id:'结算单据编号 主键'}
export const delXmTaskSbill = params => { return axios.post(`${base}/xm/core/xmTaskSbill/del`,params); };

//批量删除任务结算表  params=[{id:'结算单据编号 主键'}]
export const batchDelXmTaskSbill = params => { return axios.post(`${base}/xm/core/xmTaskSbill/batchDel`, params); };

//修改一条任务结算表记录
export const editXmTaskSbill = params => { return axios.post(`${base}/xm/core/xmTaskSbill/edit`, params); };

//新增一条任务结算表
export const addXmTaskSbill = params => { return axios.post(`${base}/xm/core/xmTaskSbill/add`, params); };
