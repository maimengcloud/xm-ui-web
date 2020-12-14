import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_env_list
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',remark:'备注说明',ipAddress:'内网ip地址',port:'内网访问端口',branchId:'归属机构',accessUserid:'访问用户编号',accessPassword:'访问密码',effect:'作用说明',accessUrl:'访问链接',supplier:'供应商',webIpAddress:'外网ip地址',webPort:'外网端口',otherRemark:'其它说明',createUserid:'添加人员',createUsername:'添加人员姓名',createTime:'添加时间',envState:'状态0不可用1已启用2已过期',startTime:'有效日期开始',endTime:'有效日期结束',feeAmount:'费用',feeRule:'计费规则'}
 **/
 
//普通查询 条件之间and关系  
export const listXmEnvList = params => { return axios.get(`${base}/xm/core/xmEnvList/list`, { params: params }); };

//模糊查询xm_env_list 条件之间or关系  
//export const listXmEnvListKey = params => { return axios.get(`${base}/xm/core/xmEnvList/listKey`, { params: params }); };

//删除一条xm_env_list params={id:'主键 主键'}
export const delXmEnvList = params => { return axios.post(`${base}/xm/core/xmEnvList/del`,params); };

//批量删除xm_env_list  params=[{id:'主键 主键'}]
export const batchDelXmEnvList = params => { return axios.post(`${base}/xm/core/xmEnvList/batchDel`, params); };

//修改一条xm_env_list记录
export const editXmEnvList = params => { return axios.post(`${base}/xm/core/xmEnvList/edit`, params); };

//新增一条xm_env_list
export const addXmEnvList = params => { return axios.post(`${base}/xm/core/xmEnvList/add`, params); };