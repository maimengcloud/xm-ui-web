import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getWorkflowBasePath();

//默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:1,pageSize:10,total:0}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，

//普通查询
export const listExecution = params => { return axios.get(`${base}/mdp/workflow/ru/execution/list`, { params: params }); };

//启动流程
export const startProc = params => { return axios.post(`${base}/mdp/workflow/ru/execution/start`, params); };
//激活流程
export const activiteExecution = params => { return axios.post(`${base}/mdp/workflow/ru/execution/activite`, params); };
//挂起流程
export const suspendExecution = params => { return axios.post(`${base}/mdp/workflow/ru/execution/suspend`, params); };

//删除流程
export const delExecution = params => { return axios.post(`${base}/mdp/workflow/ru/execution/del`, params); };