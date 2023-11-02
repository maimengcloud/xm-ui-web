import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base=config.getSysContext()

/**
 * MDP平台应用与第三方应用关系
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={authId:'第三方应用编号 主键',mdpAppid:'应用编号',name:'应用名称',logoUrl:'应用logo',remark:'应用描述',bizType:'应用分类',deptid:'归属部门',branchId:'归属机构',appToken:'登录验证码',loginUrl:'登录地址',cdate:'创建日期',cuserid:'创建人',appSecret:'加密串',authUrl:'授权地址',authPattern:'监听发起授权地址',encKey:'秘钥EncodingAESKey(消息加密密钥)',enabled:'应用状态0下架1上架',appid:'对应第三方提供给的appid',payMchid:'商户编号',payNotifyUrl:'付款成功通知地址',openPay:'开通支付',payKey:'支付加密秘钥',msgNotifyUrl:'消息推送地址',ips:'服务器IP地址列表ip1,ip2,ip3',locationId:'绑定的门店',shopId:'绑定的商户编号',locationName:'门店名称',shopName:'商户名称',multiLoca:'是否为多点0否1是'}
 **/
 
//普通查询 条件之间and关系  
export const listAppTpAuth = params => { return axios.get(`${base}/mdp/app/appTpAuth/list`, { params: params }); };

//模糊查询MDP平台应用与第三方应用关系 条件之间or关系  
//export const listAppTpAuthKey = params => { return axios.get(`${base}/mdp/app/appTpAuth/listKey`, { params: params }); };

//删除一条MDP平台应用与第三方应用关系 params={authId:'第三方应用编号 主键'}
export const delAppTpAuth = params => { return axios.post(`${base}/mdp/app/appTpAuth/del`,params); };

//批量删除MDP平台应用与第三方应用关系  params=[{authId:'第三方应用编号 主键'}]
export const batchDelAppTpAuth = params => { return axios.post(`${base}/mdp/app/appTpAuth/batchDel`, params); };

//修改一条MDP平台应用与第三方应用关系记录
export const editAppTpAuth = params => { return axios.post(`${base}/mdp/app/appTpAuth/edit`, params); };

//新增一条MDP平台应用与第三方应用关系
export const addAppTpAuth = params => { return axios.post(`${base}/mdp/app/appTpAuth/add`, params); };