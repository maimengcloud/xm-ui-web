import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getArcBasePath();

/**
 * 档案信息表
 *1 默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',tagNames:'标签名多个,分割',deptid:'创建部门',userid:'创建人',isShare:'是否共享',url:'访问路径',archiveAbstract:'摘要',archiveContext:'内容',archiveTitle:'标题',archivingUserid:'归档人',isFromArchiving:'是否来自归档',archivingDate:'归档日期',createDate:'创建日期',authorUserid:'作者编号',authorName:'作者名称',canDel:'是否可删除',canEdit:'是否可修改',canRead:'是否可读',bizKey:'业务编号',encryptType:'加密方式0不加密1私钥2公钥',canComment:'开放评论',status:'0草稿1发布2取消发布',isStorageDir:'是否存到硬盘',branchId:'机构编号'}
 **/

//普通查询 条件之间and关系  
export const listArchive = params => {
  return axios.get(`${base}/mdp/arc/archive/list`, {
    params: params
  });
};

export const getNew = params => {
  return axios.get(`${base}/archive/listNews`, {
    params: params
  });
};

//常见问题
export const getNorQuestions = params => {
  return axios.get(`${base}/mdp/arc/aq/aqFaq/list`, {
    params: params
  });
};

export const getOneArchive = params => {
  return axios.get(`${base}/mdp/arc/archive/one`, {
    params: params
  });
};

//模糊查询档案信息表 条件之间or关系  
//export const listArchiveKey = params => { return axios.get(`${base}/mdp/arc/archive/listKey`, { params: params }); };

//删除一条档案信息表 params={id:'主键 主键'}
export const delArchive = params => {
  return axios.post(`${base}/mdp/arc/archive/del`, params);
};

//批量删除档案信息表  params=[{id:'主键 主键'}]
export const batchDelArchive = params => {
  return axios.post(`${base}/mdp/arc/archive/batchDel`, params);
};

//修改一条档案信息表记录
export const editArchive = params => {
  return axios.post(`${base}/mdp/arc/archive/editSomeFields`, params);
};

//新增一条档案信息表
export const addArchive = params => {
  return axios.post(`${base}/mdp/arc/archive/add`, params);
};

//打开评论
export const openComment = params => {
  return axios.post(`${base}/mdp/arc/archive/comment/open`, params);
};

//关闭评论
export const closeComment = params => {
  return axios.post(`${base}/mdp/arc/archive/comment/close`, params);
};

//发布
export const publish = params => {
  return axios.post(`${base}/mdp/arc/archive/publish`, params);
};

//取消发布
export const unPublish = params => {
  return axios.post(`${base}/mdp/arc/archive/unpublish`, params);
};

//新增一个
export const addWorkflowArchive = params => {
  return axios.post(`${base}/mdp/arc/archive/add/workflow`, params);
};
