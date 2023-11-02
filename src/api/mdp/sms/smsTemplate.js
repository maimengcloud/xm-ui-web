import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getSmsContext();


/**
 * sms_template
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'短信模板ID 主键',status:'模板状态',type:'短信类型，0表示普通短信,',international:'0表示国内短信，1表示国际/港澳台短信，默认为0',text:'短信内容',title:'模板名称',remark:'模板备注，例如申请原因，使用场景等',shopId:'商户ID',locationId:'门店ID',branchId:'机构ID',createDate:'创建时间'}
 **/
 
//普通查询 条件之间and关系  
export const listSmsTemplate = params => { return axios.get(`${base}/sms/smsTemplate/list`, { params: params }); };

//模糊查询sms_template 条件之间or关系  
//export const listSmsTemplateKey = params => { return axios.get(`${base}/sms/smsTemplate/listKey`, { params: params }); };

//删除一条sms_template params={id:'短信模板ID 主键'}
export const delSmsTemplate = params => { return axios.post(`${base}/sms/smsTemplate/del`,params); };

//批量删除sms_template  params=[{id:'短信模板ID 主键'}]
export const batchDelSmsTemplate = params => { return axios.post(`${base}/sms/smsTemplate/batchDel`, params); };

//修改一条sms_template记录
export const editSmsTemplate = params => { return axios.post(`${base}/sms/smsTemplate/edit`, params); };

//新增一条sms_template
export const addSmsTemplate = params => { return axios.post(`${base}/sms/smsTemplate/add`, params); };

export const addTemplateApi = params => { return axios.post(`${base}/sms/smsTemplate/addTemplate`, params); };

export const delTemplateApi = params => { return axios.post(`${base}/sms/smsTemplate/delTemplate`, params); };

export const editTemplateApi = params => { return axios.post(`${base}/sms/smsTemplate/editTemplate`, params); };