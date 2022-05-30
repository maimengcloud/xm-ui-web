import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getSysBasePath();


/**
 * 平台收付款账户
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={cardAccountId:'银行卡账户编号 主键',platformId:'平台编号 主键',bankName:'银行名称',bankCode:'银行机构码',cardAccountName:'银行卡账户名称',subBankName:'银行分支机构名称',subBankCode:'分支机构编码',ctime:'新增时间',ltime:'更新时间',opUserid:'操作用户编号',opUsername:'操作用户名称',status:'账户状态0无效1有效',type:'账户性质0-平台收款'}
 **/
 
//普通查询 条件之间and关系  
export const listBankAccount = params => { return axios.get(`${base}/mdp/plat/bankAccount/list`, { params: params }); };

//模糊查询平台收付款账户 条件之间or关系  
//export const listBankAccountKey = params => { return axios.get(`${base}/mdp/plat/bankAccount/listKey`, { params: params }); };

//删除一条平台收付款账户 params={cardAccountId:'银行卡账户编号 主键',platformId:'平台编号 主键'}
export const delBankAccount = params => { return axios.post(`${base}/mdp/plat/bankAccount/del`,params); };

//批量删除平台收付款账户  params=[{cardAccountId:'银行卡账户编号 主键',platformId:'平台编号 主键'}]
export const batchDelBankAccount = params => { return axios.post(`${base}/mdp/plat/bankAccount/batchDel`, params); };

//修改一条平台收付款账户记录
export const editBankAccount = params => { return axios.post(`${base}/mdp/plat/bankAccount/edit`, params); };

//新增一条平台收付款账户
export const addBankAccount = params => { return axios.post(`${base}/mdp/plat/bankAccount/add`, params); };