import axios from '@/utils/request' 
import axiosNoAuth from '@/utils/requestNoAuth' 
import { getToken, setToken, removeToken,getCacheUserInfo,setCacheUserInfo,removeCacheUserInfo} from '@/utils/auth'


import config from '@/api/mdp_pub/mdp_config'

let base=config.getOauth2LoginContext();

//let base='';
export function doLoginByUserloginid(userloginid, password,grantType,authType,deptid,userid) {
   const data = {
    userloginid: userloginid,
    password: password, 
    authType:authType,
    deptid:deptid,
    userid:userid,
  }
  return axiosNoAuth({
    url: base+'/login/token?grantType='+grantType,
    method: 'post',
    data
  })
}
export function switchUser(userloginid, password,grantType,authType,deptid,userid) { 
  const data = {
    userloginid: userloginid,
    password: password, 
    authType:authType,
    deptid:deptid,
    userid:userid,
  }
  return axios({
    url: base+'/login/token?grantType='+grantType,
    method: 'post',
    data
  })
}
export function setDefLogin(userid,defLogin) { 
  const data = {
    userid: userid,
    defLogin:defLogin
  }
  return axios({
    url: base+'/user/setDefLogin',
    method: 'post',
    data
  })
}
export function checkUserid(userid ) { 
  const data = {
    userid: userid
  }
  return axiosNoAuth({
    url: base+'/user/check/userid',
    method: 'post',
    data
  })
}
export function checkDisplayUserid(displayUserid ) { 
  const data = {
    displayUserid: displayUserid
  }
  return axiosNoAuth({
    url: base+'/user/check/displayUserid',
    method: 'post',
    data
  })
}

export function updatePhoneno(params ) { 
  const data = params
  return axios({
    url: base+'/user/update/phoneno',
    method: 'post',
    data
  })
}
export function checkPhoneno(phoneno ) { 
  const data = {
    phoneno: phoneno
  }
  return axiosNoAuth({
    url: base+'/user/check/phoneno',
    method: 'post',
    data
  })
}
export function queryByUserloginid( params ) {  
  return axiosNoAuth({
    url: base+'/user/queryByUserloginid',
    method: 'get',
    params:params
  })
}

export function doRegister( userInfo ) {
  removeToken();
  const data = {
    username:userInfo.username,
    userid:userInfo.displayUserid,
    displayUserid:userInfo.displayUserid,
    password:userInfo.password,
    phoneno:userInfo.phoneno,
    smsCode:userInfo.smsCode,
    deptid:userInfo.deptid,
    branchId:userInfo.branchId
  }
  return axios({
    url: base+'/user/register',
    method: 'post',
    data
  })
}

export function resetPasswordByPhoneno( userInfo ) {
   const data = {  
    newPassword:userInfo.newPassword,
    phoneno:userInfo.phoneno,
    smsCode:userInfo.smsCode, 
    userid:userInfo.userid
  }
  return axios({
    url: base+'/user/password/reset?type=sms',
    method: 'post',
    data
  })
}
export function logout() {
  removeToken();
  /**
  return axios({
    url: base+'/logout',
    method: 'post'
  })
   */
}

export function getUserInfo(params) {
  if( !params || !params.scopes ){
    params={
      scopes:['userInfo','roles','posts','menus','qxs','depts','branchs']
    }
  }
  const data=params;
  return axios({
    url: base+'/user/info',
    method: 'post',
    data
  })
}

/**
 * 发送邮件
 */

export function sendEmail(params) {  
  const data=params;
  return axiosNoAuth({
    url: base+'/user/sendEmail',
    method: 'post',
    data
  })
}
/**
 * 验证邮箱
 */

export function validEmailCode(params) {   
  return axios({
    url: base+'/user/validEmailCode',
    method: 'get',
    params:params
  })
}


/**
 * 获取第三方登录需要state参数，防止crfs攻击
 * @param 
 * @returns 
 */
export function getTpaState( ) {  
   return axiosNoAuth({
    url: '/tpa/login/wechat/wxpub/state',
    method: 'post', 
    data:{}
  })
}

/**
 * 获取查询当前登录账户的所有关联账户
  * @returns 
 */
 export function queryMyUsers( ) {  
  return axios({
    url: base+'/user/queryMyUsers',
    method: 'get'
  })
}

