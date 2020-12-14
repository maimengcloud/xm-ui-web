import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getArcBasePath();

//普通查询
export const listArchiveAttachment = params => { return axios.get(`${base}/mdp/arc/file/list`, { params: params }); };

//将base64的图片数据保存为png图片附件
export const uploadBase64ArchiveAttachment = params => { return axios.post(`${base}/mdp/arc/file/upload/base64`, params); };

//关键字模糊查询 {字段1:v1,字段2:v1,字段3:v1},字段驼峰命名，条件之间默认为or关系
//export const listArchiveAttachmentKey = params => { return axios.get(`${base}/mdp/arc/file/listKey`, { params: params }); };

//删除一个
export const delArchiveAttachment = params => { return axios.post(`${base}/mdp/arc/file/del`,params); };

//批量删除
export const batchDelArchiveAttachment = params => { return axios.post(`${base}/mdp/arc/file/batchDel`, params); };

//修改一个
export const editArchiveAttachment = params => { return axios.post(`${base}/mdp/arc/file/edit`, params); };

//新增一个
export const addArchiveAttachment = params => { return axios.post(`${base}/mdp/arc/file/add`, params); };