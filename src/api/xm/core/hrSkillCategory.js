import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * hr_skill_category
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'分组编号 主键',branchId:'机构号',categoryName:'分组名称',isPub:'是否公共0否1是'}
 **/
 
//普通查询 条件之间and关系  
export const listHrSkillCategory = params => { return axios.get(`${base}/oa/hr/skill/hrSkillCategory/list`, { params: params }); };

//模糊查询hr_skill_category 条件之间or关系  
//export const listHrSkillCategoryKey = params => { return axios.get(`${base}/oa/hr.skill/hrSkillCategory/listKey`, { params: params }); };

//删除一条hr_skill_category params={id:'分组编号 主键'}
export const delHrSkillCategory = params => { return axios.post(`${base}/oa/hr/skill/hrSkillCategory/del`,params); };

//批量删除hr_skill_category  params=[{id:'分组编号 主键'}]
export const batchDelHrSkillCategory = params => { return axios.post(`${base}/oa/hr/skill/hrSkillCategory/batchDel`, params); };

//修改一条hr_skill_category记录
export const editHrSkillCategory = params => { return axios.post(`${base}/oa/hr/skill/hrSkillCategory/edit`, params); };

//新增一条hr_skill_category
export const addHrSkillCategory = params => { return axios.post(`${base}/oa/hr/skill/hrSkillCategory/add`, params); };