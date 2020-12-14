import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_attachment
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',originType:'附件来源类型，0任务，1问题，2文档',originId:'来源id',name:'附件名字',addr:'附件地址',type:'附件类型',remark:'备注说明'}
 **/
 
//普通查询 条件之间and关系  
export const listXmAttachment = params => { return axios.get(`${base}/xm/core/xmAttachment/list`, { params: params }); };

//模糊查询xm_attachment 条件之间or关系  
//export const listXmAttachmentKey = params => { return axios.get(`${base}/xm/core/xmAttachment/listKey`, { params: params }); };

//删除一条xm_attachment params={id:'主键 主键'}
export const delXmAttachment = params => { return axios.post(`${base}/xm/core/xmAttachment/del`,params); };

//批量删除xm_attachment  params=[{id:'主键 主键'}]
export const batchDelXmAttachment = params => { return axios.post(`${base}/xm/core/xmAttachment/batchDel`, params); };

//修改一条xm_attachment记录
export const editXmAttachment = params => { return axios.post(`${base}/xm/core/xmAttachment/edit`, params); };

//新增一条xm_attachment
export const addXmAttachment = params => { return axios.post(`${base}/xm/core/xmAttachment/add`, params); };