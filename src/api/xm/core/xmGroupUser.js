import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_group_user
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={groupId:'团队编号 主键',userid:'团队成员编号 主键',joinTime:'加入时间',username:'团队成员',outTime:'离队时间',status:'当前状态0参与中1已退出团队',obranchId:'组员原归属机构编号',isPri:'是否私人加入0否1是',seqNo:'排序号--从1开始',projectId:'项目编号',productId:'产品编号',pgClass:'0-项目，1-产品'}
 **/
 
//普通查询 条件之间and关系  
export const listXmGroupUser = params => { return axios.get(`${base}/xm/core/xmGroupUser/list`, { params: params }); };

//模糊查询xm_group_user 条件之间or关系  
//export const listXmGroupUserKey = params => { return axios.get(`${base}/xm/core/xmGroupUser/listKey`, { params: params }); };

//删除一条xm_group_user params={groupId:'团队编号 主键',userid:'团队成员编号 主键'}
export const delXmGroupUser = params => { return axios.post(`${base}/xm/core/xmGroupUser/del`,params); };

//批量删除xm_group_user  params=[{groupId:'团队编号 主键',userid:'团队成员编号 主键'}]
export const batchDelXmGroupUser = params => { return axios.post(`${base}/xm/core/xmGroupUser/batchDel`, params); };

//修改一条xm_group_user记录
export const editXmGroupUser = params => { return axios.post(`${base}/xm/core/xmGroupUser/edit`, params); };

//新增一条xm_group_user
export const addXmGroupUser = params => { return axios.post(`${base}/xm/core/xmGroupUser/add`, params); };
//批量删除xm_group_user  params=[{groupId:'团队编号 主键',userid:'团队成员编号 主键'}]
export const batchAddXmGroupUser = params => { return axios.post(`${base}/xm/core/xmGroupUser/batchAdd`, params); };