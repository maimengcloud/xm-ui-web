import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_project_options
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',branchId:'机构编号',optionType:'选项类型，0项目类型，1紧急程度，2优先程度',name:'选项名字'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectOptions = params => { return axios.get(`${base}/xm/core/xmProjectOptions/list`, { params: params }); };

//模糊查询xm_project_options 条件之间or关系  
//export const listXmProjectOptionsKey = params => { return axios.get(`${base}/xm/core/xmProjectOptions/listKey`, { params: params }); };

//删除一条xm_project_options params={id:'主键 主键'}
export const delXmProjectOptions = params => { return axios.post(`${base}/xm/core/xmProjectOptions/del`,params); };

//批量删除xm_project_options  params=[{id:'主键 主键'}]
export const batchDelXmProjectOptions = params => { return axios.post(`${base}/xm/core/xmProjectOptions/batchDel`, params); };

//修改一条xm_project_options记录
export const editXmProjectOptions = params => { return axios.post(`${base}/xm/core/xmProjectOptions/edit`, params); };

//新增一条xm_project_options
export const addXmProjectOptions = params => { return axios.post(`${base}/xm/core/xmProjectOptions/add`, params); };