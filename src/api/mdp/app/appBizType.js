import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base=config.getSysContext()

 

/**
 * app_biz_type
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'业务分类编号 主键',name:'分类名称'}
 **/
 
//普通查询 条件之间and关系  
export const listAppBizType = params => { return axios.get(`${base}/mdp/app/appBizType/list`, { params: params }); };

//模糊查询app_biz_type 条件之间or关系  
//export const listAppBizTypeKey = params => { return axios.get(`${base}/mdp/app/appBizType/listKey`, { params: params }); };

//删除一条app_biz_type params={id:'业务分类编号 主键'}
export const delAppBizType = params => { return axios.post(`${base}/mdp/app/appBizType/del`,params); };

//批量删除app_biz_type  params=[{id:'业务分类编号 主键'}]
export const batchDelAppBizType = params => { return axios.post(`${base}/mdp/app/appBizType/batchDel`, params); };

//修改一条app_biz_type记录
export const editAppBizType = params => { return axios.post(`${base}/mdp/app/appBizType/edit`, params); };

//新增一条app_biz_type
export const addAppBizType = params => { return axios.post(`${base}/mdp/app/appBizType/add`, params); };