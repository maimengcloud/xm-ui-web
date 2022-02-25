import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_project_group
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',groupName:'团队名称',projectId:'项目编号-属于产品线则可为空',pgTypeId:'项目团队类型编号',pgTypeName:'团队类型名称',leaderUserid:'团队负责人',leaderUsername:'负责人姓名',ctime:'创建时间',ltime:'更新时间',productId:'产品编号，属于项目组的团队则可为空',branchId:'机构编号',pgClass:'团队类别0项目1产品',pgroupId:'上级团队编号',lvl:'级别0级1级2级3级4级',pidPaths:'上级编号路径逗号分割,0,开始，本组编号+逗号结束',isTpl:'是否为模板',assUserid:'副组长编号',assUsername:'副组长姓名',childrenCnt:'下级团队数量',userCnt:'组员数量',qxCode:'权限码',calcWorkload:'是否计算工作量0否1是',ntype:'节点类型0管理团队、1执行团队'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectGroup = params => { return axios.get(`${base}/xm/core/xmProjectGroup/list`, { params: params }); };

//模糊查询xm_project_group 条件之间or关系  
//export const listXmProjectGroupKey = params => { return axios.get(`${base}/xm/core/xmProjectGroup/listKey`, { params: params }); };

//删除一条xm_project_group params={id:'主键 主键'}
export const delXmProjectGroup = params => { return axios.post(`${base}/xm/core/xmProjectGroup/del`,params); };

//批量删除xm_project_group  params=[{id:'主键 主键'}]
export const batchDelXmProjectGroup = params => { return axios.post(`${base}/xm/core/xmProjectGroup/batchDel`, params); };

//修改一条xm_project_group记录
export const editXmProjectGroup = params => { return axios.post(`${base}/xm/core/xmProjectGroup/edit`, params); };

//新增一条xm_project_group
export const addXmProjectGroup = params => { return axios.post(`${base}/xm/core/xmProjectGroup/add`, params); };

export const getGroups = params => { return axios.get(`${base}/xm/core/xmProjectGroup/getGroups`, { params: params }); };



 