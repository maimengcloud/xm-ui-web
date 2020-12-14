import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_skill
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'技能编号 主键',skillName:'技能名',branchId:'机构号',categoryId:'技能分组',isPub:'是否公共0否1是',skillRemarks:'技能描述'}
 **/
 
//普通查询 条件之间and关系  
export const listHrSkill = params => { return axios.get(`${base}/oa/hr/skill/hrSkill/list`, { params: params }); };

//模糊查询hr_skill 条件之间or关系  
//export const listHrSkillKey = params => { return axios.get(`${base}/oa/hr.skill/hrSkill/listKey`, { params: params }); };

//删除一条hr_skill params={id:'技能编号 主键'}
export const delHrSkill = params => { return axios.post(`${base}/oa/hr/skill/hrSkill/del`,params); };

//批量删除hr_skill  params=[{id:'技能编号 主键'}]
export const batchDelHrSkill = params => { return axios.post(`${base}/oa/hr/skill/hrSkill/batchDel`, params); };

//修改一条hr_skill记录
export const editHrSkill = params => { return axios.post(`${base}/oa/hr/skill/hrSkill/edit`, params); };

//新增一条hr_skill
export const addHrSkill = params => { return axios.post(`${base}/oa/hr/skill/hrSkill/add`, params); };

export const getAllHrSkill = params => { return axios.get(`${base}/oa/hr/skill/hrSkill/getAllHrSkill`, { params: params }); };

export const delHrSkillCategory= params => { return axios.post(`${base}/oa/hr/skill/hrSkill/delHrSkillCategory`, params); };