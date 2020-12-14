import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_task_template
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'任务编号 主键',name:'任务名称',parentTaskid:'父任务编号',parentTaskname:'父任务名称',projectId:'项目编号',projectName:'项目名称',level:'任务级别',sortLevel:'排序级别',preTaskid:'前置任务编号',preTaskname:'前置任务名称',startTime:'任务开始时间',endTime:'任务结束时间',milestone:'里程碑',description:'任务描述',remarks:'备注',createUserid:'任务创建人编号',createUsername:'任务创建人',createTime:'创建时间',rate:'任务进度0-100',budgetCost:'当前任务预算金额（包括所有成本，不包括下一级）',budgetWorkload:'预算工时（不包括下一级）',taskState:'任务状态0待领取1已领取执行中2已完工3已结算',taskType:'0售前方案1投标2需求3设计4开发5测试6验收7部署8运维--来自基础数据表taskType',taskClass:'1需结算0不需结算',toTaskCenter:'是否发布到任务大厅0否1是',projectPhaseId:'项目阶段编号',projectPhaseName:'项目阶段名称',taskSkillNames:'技能列表,逗号分隔',taskSkillIds:'技能编号列表逗号分隔',taskOut:'是否外购',planType:'计划类型w1-周,w2-2周,w3-3周,m1-1月,m2-2月,q1-季,q2-半年，y1-年',settleSchemel:'任务结算方案-来自数字字典xmTaskSettleSchemel',menuId:'归属功能编号',menuName:'归属功能名称'}
 **/
 
//普通查询 条件之间and关系  
export const listXmTaskTemplate = params => { return axios.get(`${base}/xm/core/xmTaskTemplate/list`, { params: params }); };

//模糊查询xm_task_template 条件之间or关系  
//export const listXmTaskTemplateKey = params => { return axios.get(`${base}/xm/core/xmTaskTemplate/listKey`, { params: params }); };

//删除一条xm_task_template params={id:'任务编号 主键'}
export const delXmTaskTemplate = params => { return axios.post(`${base}/xm/core/xmTaskTemplate/del`,params); };

//批量删除xm_task_template  params=[{id:'任务编号 主键'}]
export const batchDelXmTaskTemplate = params => { return axios.post(`${base}/xm/core/xmTaskTemplate/batchDel`, params); };

//修改一条xm_task_template记录
export const editXmTaskTemplate = params => { return axios.post(`${base}/xm/core/xmTaskTemplate/edit`, params); };

//新增一条xm_task_template
export const addXmTaskTemplate = params => { return axios.post(`${base}/xm/core/xmTaskTemplate/add`, params); };