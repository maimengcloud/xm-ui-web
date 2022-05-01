import axios from '@/utils/request'
import { getToken, setToken, removeToken,getCacheUserInfo,setCacheUserInfo,removeCacheUserInfo} from '@/utils/auth'


import config from '@/common/config'

let base=config.getOauth2LoginBasePath();

//let base='';
export function doLoginByUserloginid(userloginid, password,grantType,authType,deptid,userid) {
  removeToken();
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
export function checkUserid(userid ) {
  removeToken();
  const data = {
    userid: userid
  }
  return axios({
    url: base+'/user/check/userid',
    method: 'post',
    data
  })
}
export function checkDisplayUserid(displayUserid ) {
  removeToken();
  const data = {
    displayUserid: displayUserid
  }
  return axios({
    url: base+'/user/check/displayUserid',
    method: 'post',
    data
  })
}

export function checkPhoneno(phoneno ) {
  removeToken();
  const data = {
    phoneno: phoneno
  }
  return axios({
    url: base+'/user/check/phoneno',
    method: 'post',
    data
  })
}
export function queryByUserloginid( params ) {  
  return axios({
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
    deptid:userInfo.deptid
  }
  return axios({
    url: base+'/user/register',
    method: 'post',
    data
  })
}

export function resetPasswordByPhoneno( userInfo ) {
  removeToken();
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
  return axios({
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
  return axios({
    url: '/tpa/login/wechat/wxpub/state',
    method: 'post', 
    data:{}
  })
}