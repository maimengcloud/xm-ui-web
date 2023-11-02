/**
 * 业务模块前端与后端交互公共api 
 * 一般情况下请勿将业务代码加入此文件，业务代码及其它模块及api应该放入各自单独的api文件中，如果实在要添加，请添加到$mdp_api_biz.js文件中，实现全局调用
 * 扩展组件的api请加入到fly_mdp_ext.js中
 */

 import axios from '@/utils/request'
 import config from './mdp_config'
 let sysBase = config.getSysContext();
export default {
//统计机构权益、用户数据等
getBranchInterestsDetail: params => { return axios.get(`${sysBase}/mdp/sys/branchInterests/detail`, params); },
//加入企业申请
addUserJoinBranchRequire: params => { return axios.post(`${sysBase}/mdp/sys/userJoinBranchRequire/add`, params); },
//查询登陆日志  
listUserLoginRecord: params => { return axios.get(`${sysBase}/mdp/sys/userLoginRecord/list`, { params: params }); },

//取消关注
delUserFocus: params => { return axios.post(`${sysBase}/mdp/sys/userFocus/del`,params); },
 
//关注一个对象
addUserFocus: params => { return axios.post(`${sysBase}/mdp/sys/userFocus/add`, params); },

//修改关注信息
editSomeFieldsUserFocus: params => { return axios.post(`${sysBase}/mdp/sys/userFocus/editSomeFields`, params); },

//我的关注列表
myFocusForIndex: params => {  return axios.get(`${sysBase}/mdp/sys/userFocus/myFocusForIndex`, { params: params });},

//查询我的收藏
userMenuFavoriteList : params => { return axios.get(`${sysBase}/menu/menuFavorite/list`, { params: params }); },

//保存我的收藏
saveMenuFavoriteList : params => { return axios.post(`${sysBase}/menu/menuFavorite/batchSaveMenuFavorites`, params); },

//创建邀请码
createInviteId : params => { return axios.post(`${sysBase}/mdp/sys/userTpaInvite/createInviteId`,params); },


//检查邀请码是否有效
checkInviteId : params => { return axios.get(`${sysBase}/mdp/sys/userTpaInvite/checkInviteId`, { params: params }); },


//查询通知
listNotifyMsg : params => { return axios.get(`${sysBase}/mdp/sys/notifyMsg/list`, { params: params }); },


//更新消息的已读未读状态
editSomeFieldsNotifyMsg : params => { return axios.post(`${sysBase}/mdp/sys/notifyMsg/editSomeFields`, params); },

//查询所有模块
getAllMenuModule : params => { return axios.get(`${sysBase}/sys/sys/mdp/menu/menuModule/list`, {params: params }); },

//查询已购买的模块
getBuyMenuModule : params => { return axios.get(`${sysBase}/sys/sys/mdp/menu/menuModuleBranch/list`, {params: params }); },

}
