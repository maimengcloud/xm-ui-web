import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getWorkflowBasePath();

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
 * 新增候选人/部门/岗位 {branchId:'',taskId:'',procInstId:'',userids:[userid],deptids:[deptid],postids:[postid]}
 * */
export const addCandidate = params => { return axios.post(`${base}/mdp/workflow/ru/task/addCandidate`, params); };

/**
 * 删除候选人/部门/岗位 {taskId:'',procInstId:'',userids:[userid],deptids:[deptid],postids:[postid]}
 * */
export const delCandidate = params => { return axios.post(`${base}/mdp/workflow/ru/task/delCandidate`, params); };

/**
 * 查询候选个人
 * */
export const listCandidateUsers = params => { return axios.get(`${base}/mdp/workflow/ru/task/listCandidateUsers`, { params: params }); };

/**
 * 查询候选组（实际指部门）
 * */
export const listCandidateDepts = params => { return axios.get(`${base}/mdp/workflow/ru/task/listCandidateDepts`, { params: params }); };

/**
 * 查询候选岗位
 * */
export const listCandidatePosts = params => { return axios.get(`${base}/mdp/workflow/ru/task/listCandidatePosts`, { params: params }); }; 