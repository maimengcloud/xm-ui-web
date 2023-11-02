import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base=config.getSysContext()

/**
 * 角色权限关系表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',qxId:'权限编号增删改查批量更新导出导入',remark:'备注',roleid:'角色编号',enabled:'是否启用',deptid:'机构编号',branchId:'云用户机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listRoleQx = params => { return axios.get(`${base}/mdp/sys/roleQx/list`, { params: params }); };

//模糊查询角色权限关系表 条件之间or关系  
//export const listRoleQxKey = params => { return axios.get(`${base}/mdp/sys/roleQx/listKey`, { params: params }); };

//删除一条角色权限关系表 params={id:'主键 主键'}
export const delRoleQx = params => { return axios.post(`${base}/mdp/sys/roleQx/del`,params); };

//批量删除角色权限关系表  params=[{id:'主键 主键'}]
export const batchDelRoleQx = params => { return axios.post(`${base}/mdp/sys/roleQx/batchDel`, params); };

//批量更新角色权限
export const batchEditRoleQx = params => { return axios.post(`${base}/sys/roleQx/batchEdit`, params); };

//新增一条角色权限关系表
export const addRoleQx = params => { return axios.post(`${base}/mdp/sys/roleQx/add`, params); };