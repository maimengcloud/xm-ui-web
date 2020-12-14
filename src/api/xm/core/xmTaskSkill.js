import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_task_skill
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',taskId:'任务编号',taskSkillId:'技能要求',taskSkillName:'技能名称',skillRemarks:'技能描述'}
 **/
 
//普通查询 条件之间and关系  
export const listXmTaskSkill = params => { return axios.get(`${base}/xm/core/xmTaskSkill/list`, { params: params }); };

//模糊查询xm_task_skill 条件之间or关系  
//export const listXmTaskSkillKey = params => { return axios.get(`${base}/xm/core/xmTaskSkill/listKey`, { params: params }); };

//删除一条xm_task_skill params={id:'主键 主键'}
export const delXmTaskSkill = params => { return axios.post(`${base}/xm/core/xmTaskSkill/del`,params); };

//批量删除xm_task_skill  params=[{id:'主键 主键'}]
export const batchDelXmTaskSkill = params => { return axios.post(`${base}/xm/core/xmTaskSkill/batchDel`, params); };

//修改一条xm_task_skill记录
export const editXmTaskSkill = params => { return axios.post(`${base}/xm/core/xmTaskSkill/edit`, params); };

//新增一条xm_task_skill
export const addXmTaskSkill = params => { return axios.post(`${base}/xm/core/xmTaskSkill/add`, params); };

export const batchAddSkill = params => { return axios.post(`${base}/xm/core/xmTaskSkill/batchAdd`, params); };