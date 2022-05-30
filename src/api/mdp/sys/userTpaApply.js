import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getSysBasePath();


/**
 * sys_user_tpa_apply
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',userid:'申请人的用户编号',applyPostName:'申请的岗位名称',applyBranchId:'申请的机构编号',applyShopId:'申请的商户编号',applyLocationId:'申请的门店编号',source:'申请来源(从哪个途径申请)',status:'申请的状态(0.申请中',remark:'备注',createDate:'申请时间',updateDate:'修改时间',cuserid:'创建人id',lopuserid:'最后操作人'}
 **/
 
//普通查询 条件之间and关系  
export const listSysUserTpaApply = params => { return axios.get(`${base}/mdp/sys/userTpaApply/list`, { params: params }); };

//模糊查询sys_user_tpa_apply 条件之间or关系  
//export const listSysUserTpaApplyKey = params => { return axios.get(`${base}/mdp/sys/userTpaApply/listKey`, { params: params }); };

//删除一条sys_user_tpa_apply params={id:'主键 主键'}
export const delSysUserTpaApply = params => { return axios.post(`${base}/mdp/sys/userTpaApply/del`,params); };

//批量删除sys_user_tpa_apply  params=[{id:'主键 主键'}]
export const batchDelSysUserTpaApply = params => { return axios.post(`${base}/mdp/sys/userTpaApply/batchDel`, params); };

//修改一条sys_user_tpa_apply记录
export const editSysUserTpaApply = params => { return axios.post(`${base}/mdp/sys/userTpaApply/edit`, params); };

//新增一条sys_user_tpa_apply
export const addSysUserTpaApply = params => { return axios.post(`${base}/mdp/sys/userTpaApply/add`, params); };