import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getSmsContext();


/**
 * sms_sign
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'短信签名ID 主键',international:'0表示国内短信，1表示国际/港澳台短信，默认为0',status:'签名状态(0:已通过，1表示待审核，2表示已拒绝)',text:'text',remark:'签名备注',pic:'签名对应的资质证明图片',createDate:'创建时间'}
 **/
 
//普通查询 条件之间and关系  
export const listSmsSign = params => { return axios.get(`${base}/sms/smsSign/list`, { params: params }); };

//模糊查询sms_sign 条件之间or关系  
//export const listSmsSignKey = params => { return axios.get(`${base}/mdp/sms/smsSign/listKey`, { params: params }); };

//删除一条sms_sign params={id:'短信签名ID 主键'}
export const delSmsSign = params => { return axios.post(`${base}/sms/smsSign/del`,params); };

//批量删除sms_sign  params=[{id:'短信签名ID 主键'}]
export const batchDelSmsSign = params => { return axios.post(`${base}/sms/smsSign/batchDel`, params); };

//修改一条sms_sign记录
export const editSmsSign = params => { return axios.post(`${base}/sms/smsSign/edit`, params); };

//新增一条sms_sign
export const addSmsSign = params => { return axios.post(`${base}/sms/smsSign/add`, params); };

export const addSmsSignApi = params => { return axios.post(`${base}/sms/smsSign/addSmsSign`, params); };

export const delSmsSignApi = params => { return axios.post(`${base}/sms/smsSign/delSmsSign`, params); };

export const editSmsSignApi = params => { return axios.post(`${base}/sms/smsSign/editSmsSign`, params); };

export const groupSendSmsApi = params => { return axios.post(`${base}/sms/smsSign/groupSendSms`, params); };
 