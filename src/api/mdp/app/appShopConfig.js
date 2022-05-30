import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getSysBasePath();


/**
 * app_shop_config
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={shopId:'商户编号 主键',shopBranchId:'商户自身归属机构号',tpServiceCharges:'第三方手续费费率如支付宝/微信支付的费率比如0.003',platServiceCharges:'mdp平台附加手续费费率比如0.002,即该商户下所有交易需要支付给平台的手续费费率',platShopDepositAccountId:'mdp平台分配给该商户（门店）预存款账户（一般商户编号-门店编号-01，用于mdp平台与该商户的结算，商户充值等），如果是总部店，为一般商户编号-0-01',platAssetAccountId:'平台资产账户，商户缴纳给平台手续费等，从商户预存款账户转出，转入该账户计入平台主营业务收入',platShopId:'归属平台商户编号',shopServiceCharges:'mdp平台商户手续费费率一般为门店订单交易需要支付一定的手续费给商户',shopAssetAccountId:'商户内部主营业务收入账户，在途资金到账后，转入主营业务收入',isPlatSc:'商户是否需要向平台缴纳手续费',isShopSc:'门店是否需要向商户缴纳手续费',acctPrjType:'核算项目platform-由平台结算，shop-由商户独立结算，location-由门店独立结算',paySetType:'支付结算方式platform-使用平台支付通道结算，shop-使用商户结算通道，location-使用门店独立结算通道',setLevel:'结算级别1-商户2-门店，将在途资金账户余额归入商户的预存款账户还是门店预存款账户',allowLocationWithdraw:'是否允许门店提现0否1允许3按门店配置自定义',settleShopId:'归属计算商户pay_set_type=platform时，指向平台商户编号platform_shop_id，pay_set_type=shop时指向本商户编号shop_id',isJoinPlat:'是否加入平台，如果加入平台将在平台的大商城可以展现数据-同步到shop表，避免多表关联',shopDepositAccountId:'商户预存款账户，shop模式下，作为客户',settleBranchId:'结算商户对应的机构号',platBranchId:'商户归属的平台机构号'}
 **/
 
//普通查询 条件之间and关系  
export const listAppShopConfig = params => { return axios.get(`${base}/mdp/app/appShopConfig/list`, { params: params }); };

//模糊查询app_shop_config 条件之间or关系  
//export const listAppShopConfigKey = params => { return axios.get(`${base}/mdp/app/appShopConfig/listKey`, { params: params }); };

//删除一条app_shop_config params={shopId:'商户编号 主键'}
export const delAppShopConfig = params => { return axios.post(`${base}/mdp/app/appShopConfig/del`,params); };

//批量删除app_shop_config  params=[{shopId:'商户编号 主键'}]
export const batchDelAppShopConfig = params => { return axios.post(`${base}/mdp/app/appShopConfig/batchDel`, params); };

//修改一条app_shop_config记录
export const editAppShopConfig = params => { return axios.post(`${base}/mdp/app/appShopConfig/edit`, params); };

//新增一条app_shop_config
export const addAppShopConfig = params => { return axios.post(`${base}/mdp/app/appShopConfig/add`, params); };