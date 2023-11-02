import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext();

/**
 * 用户登录信息登记
 * 1 默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 * 2 查询、新增、修改的参数格式  params={id:'主键 主键',userid:'用户编号',shopId:'商户编号',locationId:'门店编号',loginShopid:'登录的商户编号',loginLocationid:'登录的门店编号',branchId:'机构编号',loginType:'1-微信扫门店二维码，2-点击小程序登录，3-账户密码登录，4-手机号码登录',loginTime:'登录时间',loginBranchId:'登录机构号',username:'登录用户名',authId:'授权码',mdpAppid:'mdp平台appid',lockNo:'批处理编号',lockStatus:'批处理状态0-待处理1-处理中2处理完毕',lockTime:'批处理时间',phoneno:'登录手机号',loginIp:'登录ip',userType:'mem-会员端用户，adm-管理端用户',loginDeviceId:'登录设备编号',loginDeviceSn:'设备特征码',userAgent:'请求特征码',reqNo:'请求特征码-方便前端补充回填部分信息',deviceType:'设备类型COMPUTER/MOBILE/TABLET/GAME_CONSOLE/DMR/WEARABLE/UNKNOWN',os:'操作系统Windows/ios/Android',osVersion:'操作系统版本如Android',osName:'操作系统名称如Android',renderingEngine:'浏览器渲染引擎如WEBKIT',deviceManufacturer:'设备生产厂商',browerGroup:'浏览器组',borderName:'浏览器名称',borderVersion:'浏览器版本',longitude:'经度',latitude:'纬度',regionId:'区域编号精确到4级镇、街道',regionName:'定位街道名称',formatAddress:'定位格式化地址名称',districtId:'定位区县编号',memType:'用户类型',loginStatus:'1-登录成功，0-登录失败',loginMsg:'登录成功或者失败的说明',authType:'授权码',grantType:'授权码'}
 * @author maimeng-mdp code-gen
 * @since 2023-10-1
 **/
 
//普通查询 条件之间and关系  
export const listUserLoginRecord = params => { return axios.get(`${base}/mdp/sys/userLoginRecord/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryUserLoginRecordById = params => { return axios.get(`${base}/mdp/sys/userLoginRecord/queryById`, { params: params }); };

//删除一条用户登录信息登记 params={id:'主键 主键'}
export const delUserLoginRecord = params => { return axios.post(`${base}/mdp/sys/userLoginRecord/del`,params); };

//批量删除用户登录信息登记  params=[{id:'主键 主键'}]
export const batchAddUserLoginRecord = params => { return axios.post(`${base}/mdp/sys/userLoginRecord/batchAdd`, params); };

//批量删除用户登录信息登记  params=[{id:'主键 主键'}]
export const batchDelUserLoginRecord = params => { return axios.post(`${base}/mdp/sys/userLoginRecord/batchDel`, params); };

//修改一条用户登录信息登记记录
export const editUserLoginRecord = params => { return axios.post(`${base}/mdp/sys/userLoginRecord/edit`, params); };

//新增一条用户登录信息登记
export const addUserLoginRecord = params => { return axios.post(`${base}/mdp/sys/userLoginRecord/add`, params); };

//批量修改某些字段
export const editSomeFieldsUserLoginRecord = params => { return axios.post(`${base}/mdp/sys/userLoginRecord/editSomeFields`, params); };