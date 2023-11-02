import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()


/**
 * app_tp_pay
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={payAuthId:'主键 主键',mdpAppid:'应用编号',name:'应用名称',logoUrl:'应用logo',remark:'应用描述',payType:'付款方式0余额1微信2V麦3支付宝4银行5网银6其他',deptid:'归属部门',branchId:'归属机构',cdate:'创建日期',cuserid:'创建人',enabled:'应用状态0下架1上架',appid:'对应第三方提供给的appid',payMchid:'商户编号',payNotifyUrl:'付款成功通知地址',openPay:'开通支付',payKey:'支付加密秘钥私钥',ips:'服务器IP地址列表ip1,ip2,ip3',locationId:'绑定的门店',shopId:'绑定的商户编号',locationName:'门店名称',shopName:'商户名称',payPubKey:'支付加密秘钥公钥',tpServiceCharges:'第三方手续费费率比如0.003',mdpServiceCharges:'mdp平台附加手续费费率比如0.002',mdpPayAccountId:'mdp平台商户账户（一般商户编号+门店编号，用于mdp平台与该商户的结算）'}
 **/
 
//普通查询 条件之间and关系  
export const listAppTpPay = params => { return axios.get(`${base}/mdp/app/appTpPay/list`, { params: params }); };

//模糊查询app_tp_pay 条件之间or关系  
//export const listAppTpPayKey = params => { return axios.get(`${base}/mdp/app/appTpPay/listKey`, { params: params }); };

//删除一条app_tp_pay params={payAuthId:'主键 主键'}
export const delAppTpPay = params => { return axios.post(`${base}/mdp/app/appTpPay/del`,params); };

//批量删除app_tp_pay  params=[{payAuthId:'主键 主键'}]
export const batchDelAppTpPay = params => { return axios.post(`${base}/mdp/app/appTpPay/batchDel`, params); };

//修改一条app_tp_pay记录
export const editAppTpPay = params => { return axios.post(`${base}/mdp/app/appTpPay/edit`, params); };

//新增一条app_tp_pay
export const addAppTpPay = params => { return axios.post(`${base}/mdp/app/appTpPay/add`, params); };