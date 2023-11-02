import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base=config.getWorkflowContext();

//默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:1,pageSize:10,total:0}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，

//普通查询
export const listAssigneeToAnyTasks = params => { return axios.get(`${base}/mdp/workflow/ru/task/listAssigneeToAnyTasks`, { params: params }); };
//普通查询
export const listAssigneeToMeTasks = params => { return axios.get(`${base}/mdp/workflow/ru/task/listAssigneeToMeTasks`, { params: params }); };
//普通查询
export const listMyCandidateUserTasks = params => { return axios.get(`${base}/mdp/workflow/ru/task/listMyCandidateUserTasks`, { params: params }); };
//普通查询
export const listAnyCandidateUserTasks = params => { return axios.get(`${base}/mdp/workflow/ru/task/listAnyCandidateUserTasks`, { params: params }); };
//普通查询
export const listMyCandidateGroupTasks = params => { return axios.get(`${base}/mdp/workflow/ru/task/listMyCandidateGroupTasks`, { params: params }); };
//普通查询
export const listAnyCandidateGroupTasks = params => { return axios.get(`${base}/mdp/workflow/ru/task/listAnyCandidateGroupTasks`, { params: params }); };

//关键字模糊查询 {字段1:v1,字段2:v1,字段3:v1},字段驼峰命名，条件之间默认为or关系
//export const listTaskKey = params => { return axios.get(`${base}/mdp/workflow/ru/task/listKey`, { params: params }); };

//删除一个
export const delTask = params => { return axios.post(`${base}/mdp/workflow/ru/task/del`,params); };

//批量删除
export const batchDelTask = params => { return axios.post(`${base}/mdp/workflow/ru/task/batchDel`, params); };

//修改一个
export const editTask = params => { return axios.post(`${base}/mdp/workflow/ru/task/edit`, params); };

//新增一个
export const addTask = params => { return axios.post(`${base}/mdp/workflow/ru/task/add`, params); };

//完成一个任务 action=complete/resolve/delegate/calim
export const completeTask = params => { return axios.post(`${base}/mdp/workflow/ru/task/complete`, params); };

// 添加办理意见，但是不提交任务
export const addComment = params => { return axios.post(`${base}/mdp/workflow/ru/task/addComment`, params); };


/**
 * 新增候选人/部门/岗位/角色 {branchId:'',taskId:'',procInstId:'',hxUserids:'逗号分割的用户列表',hxDeptids:'逗号分割的部门列表',hxPostids:'逗号分割的岗位列表',hxRoleids:'逗号分割的岗位列表'}
 * */
export const addCandidate = params => { return axios.post(`${base}/mdp/workflow/ru/task/addCandidate`, params); };

/**
 * 删除候选人/部门/岗位/角色 {branchId:'',taskId:'',procInstId:'',hxUserids:'逗号分割的用户列表',hxDeptids:'逗号分割的部门列表',hxPostids:'逗号分割的岗位列表',hxRoleids:'逗号分割的岗位列表'}
 * */
export const delCandidate = params => { return axios.post(`${base}/mdp/workflow/ru/task/delCandidate`, params); };

/**
 * 查询候选人/部门/岗位/角色 请求参数 {taskId:'任务编号'}, 返回 data={hxUserids:'逗号分割的用户列表',hxDeptids:'逗号分割的部门列表',hxPostids:'逗号分割的岗位列表',hxRoleids:'逗号分割的岗位列表'}
 * */
export const listCandidate = params => { return axios.get(`${base}/mdp/workflow/ru/task/listCandidate`, { params: params }); };
 