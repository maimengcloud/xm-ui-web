import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getSysBasePath();


/**
 * 发布关联，管理端客户管理界面只能看到发布到各自平台的字典
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={itemId:'item_id 主键',targetId:'发布到目标编号 主键',ptime:'发布时间'}
 **/
 
//普通查询 条件之间and关系  
export const listPushLink = params => { return axios.get(`${base}/mdp/meta/pushLink/list`, { params: params }); };

//模糊查询发布关联，管理端客户管理界面只能看到发布到各自平台的字典 条件之间or关系  
//export const listPushLinkKey = params => { return axios.get(`${base}/mdp/meta/pushLink/listKey`, { params: params }); };

//删除一条发布关联，管理端客户管理界面只能看到发布到各自平台的字典 params={itemId:'item_id 主键',targetId:'发布到目标编号 主键'}
export const delPushLink = params => { return axios.post(`${base}/mdp/meta/pushLink/del`,params); };

//批量删除发布关联，管理端客户管理界面只能看到发布到各自平台的字典  params=[{itemId:'item_id 主键',targetId:'发布到目标编号 主键'}]
export const batchDelPushLink = params => { return axios.post(`${base}/mdp/meta/pushLink/batchDel`, params); };

//修改一条发布关联，管理端客户管理界面只能看到发布到各自平台的字典记录
export const editPushLink = params => { return axios.post(`${base}/mdp/meta/pushLink/edit`, params); };

//新增一条发布关联，管理端客户管理界面只能看到发布到各自平台的字典
export const addPushLink = params => { return axios.post(`${base}/mdp/meta/pushLink/add`, params); };


//新增一条发布关联，管理端客户管理界面只能看到发布到各自平台的字典
export const pushToTargetApps = params => { return axios.post(`${base}/mdp/meta/pushLink/pushToTargetApps`, params); };
