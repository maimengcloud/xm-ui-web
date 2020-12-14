import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_project_env_list
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',remark:'备注说明',ipAddress:'ip地址',port:'访问端口',projectId:'归属项目组',projectName:'归属项目组名称',accessUserid:'访问用户编号',accessPassword:'访问密码',effect:'作用说明',accessUrl:'访问链接',webIpAddress:'外网ip地址',webPort:'外网端口',otherRemark:'其它说明',createUserid:'添加人员',createUsername:'添加人员姓名',createTime:'添加时间'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectEnvList = params => { return axios.get(`${base}/xm/core/xmProjectEnvList/list`, { params: params }); };

//模糊查询xm_project_env_list 条件之间or关系  
//export const listXmProjectEnvListKey = params => { return axios.get(`${base}/xm/core/xmProjectEnvList/listKey`, { params: params }); };

//删除一条xm_project_env_list params={id:'主键 主键'}
export const delXmProjectEnvList = params => { return axios.post(`${base}/xm/core/xmProjectEnvList/del`,params); };

//批量删除xm_project_env_list  params=[{id:'主键 主键'}]
export const batchDelXmProjectEnvList = params => { return axios.post(`${base}/xm/core/xmProjectEnvList/batchDel`, params); };

//修改一条xm_project_env_list记录
export const editXmProjectEnvList = params => { return axios.post(`${base}/xm/core/xmProjectEnvList/edit`, params); };

//新增一条xm_project_env_list
export const addXmProjectEnvList = params => { return axios.post(`${base}/xm/core/xmProjectEnvList/add`, params); };