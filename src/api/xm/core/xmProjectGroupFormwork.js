import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();
/**
 * xm_group_formwork
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',branchId:'机构编号',groupName:'团队名称',isPub:'是否公共，0为否，1为是'}
 **/
export const listXmProjectGroupFormwork = params => { return axios.get(`${base}/xm/core/xmProjectGroupFormwork/list`, { params: params }); };

export const delXmProjectGroupFormwork = params => { return axios.post(`${base}/xm/core/xmProjectGroupFormwork/del`,params); };

export const batchDelXmProjectGroupFormwork = params => { return axios.post(`${base}/xm/core/xmProjectGroupFormwork/batchDel`, params); };

export const editXmProjectGroupFormwork = params => { return axios.post(`${base}/xm/core/xmProjectGroupFormwork/edit`, params); };

export const addXmProjectGroupFormwork = params => { return axios.post(`${base}/xm/core/xmProjectGroupFormwork/add`, params); };   