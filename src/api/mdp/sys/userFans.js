import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * sys_user_fans
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={userid:'我的账户 主键',fuserid:'我关注的用户 主键',ftime:'关注时间'}
 **/
 
//普通查询 条件之间and关系  
export const listUserFans = params => { return axios.get(`${base}/mdp/sys/userFans/list`, { params: params }); };

//删除一条sys_user_fans params={userid:'我的账户 主键',fuserid:'我关注的用户 主键'}
export const delUserFans = params => { return axios.post(`${base}/mdp/sys/userFans/del`,params); };

//批量删除sys_user_fans  params=[{userid:'我的账户 主键',fuserid:'我关注的用户 主键'}]
export const batchDelUserFans = params => { return axios.post(`${base}/mdp/sys/userFans/batchDel`, params); };

//修改一条sys_user_fans记录
export const editUserFans = params => { return axios.post(`${base}/mdp/sys/userFans/edit`, params); };

//新增一条sys_user_fans
export const addUserFans = params => { return axios.post(`${base}/mdp/sys/userFans/add`, params); };

//批量修改某些字段
export const editSomeFieldsUserFans = params => { return axios.post(`${base}/mdp/sys/userFans/editSomeFields`, params); };
