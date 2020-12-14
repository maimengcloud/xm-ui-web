import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getWorkflowBasePath();


/**
 * mdp_ru_procinst_node_info
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',actId:'节点编号',actName:'流程节点名称',procDefId:'流程定义编号',isMultiple:'是否多选',branchId:'云用户机构编号',showNextAssignees:'是否默认打开手选下一步执行人',candidate:'是否候选',candidateType:'候选类型user/group/post/complex用户/部门/岗位/综合',instanceCount:'多实例个数',groupIds:'候选组编号列表，以逗号分隔，如部门_dept_deptid1,_dept_deptid2,_post_postid1,_post_postid2',qxCode:'权限码',outUrl:'跳转链接及参数，使用普通的url进行，内置${userid}当前用，${startUserid}流程启动人，${deptid}流程启动部门，${procDefId}流程定义编号，${procInstId}流程实例编号，${taskId}流程任务编号，${actId}流程节点编号,${taskName}为任务名称，${mainTitle}为流程名称',procInstId:'实例编号',formFieldsJson:'表单字段定义，存为json',submitName:'提交按钮名字',formId:'表单编号',addTime:'新增时间',lastUpdateTime:'最后更新时间'}
 **/
 
//普通查询 条件之间and关系  
export const listProcinstNodeInfo = params => { return axios.get(`${base}/mdp/workflow/ru/procinstNodeInfo/list`, { params: params }); };

//模糊查询mdp_ru_procinst_node_info 条件之间or关系  
//export const listProcinstNodeInfoKey = params => { return axios.get(`${base}/mdp/workflow/ru/procinstNodeInfo/listKey`, { params: params }); };

//删除一条mdp_ru_procinst_node_info params={id:'主键 主键'}
export const delProcinstNodeInfo = params => { return axios.post(`${base}/mdp/workflow/ru/procinstNodeInfo/del`,params); };

//批量删除mdp_ru_procinst_node_info  params=[{id:'主键 主键'}]
export const batchDelProcinstNodeInfo = params => { return axios.post(`${base}/mdp/workflow/ru/procinstNodeInfo/batchDel`, params); };

//修改一条mdp_ru_procinst_node_info记录
export const editProcinstNodeInfo = params => { return axios.post(`${base}/mdp/workflow/ru/procinstNodeInfo/edit`, params); };

//新增一条mdp_ru_procinst_node_info
export const addProcinstNodeInfo = params => { return axios.post(`${base}/mdp/workflow/ru/procinstNodeInfo/add`, params); };


export const getNodeInfos = params => { return axios.get(`${base}/mdp/workflow/ru/procinstNodeInfo/getNodeInfos`, { params: params }); };