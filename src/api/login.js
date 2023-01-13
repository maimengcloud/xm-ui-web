import axios from 'axios'//免登录访问
import axiosAuth from '@/utils/request'//待token访问


import { getToken, setToken, removeToken,getCacheUserInfo,setCacheUserInfo,removeCacheUserInfo} from '@/utils/auth'


import config from '@/common/config'

let base=config.getOauth2LoginBasePath();


var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
var baseApiUrl="";
if(process.env.BASE_API ){
  if(process.env.BASE_API.indexOf("http")<0 && process.env.BASE_API.indexOf("wwww.")<0){
    baseApiUrl=curlDomain+"/"+process.env.BASE_API+"/"+process.env.VERSION;
  }else{
    baseApiUrl=process.env.BASE_API+"/"+process.env.VERSION;
  }

}else{
  baseApiUrl=curlDomain+"/api/"+process.env.VERSION
}
var indexOfHttp=baseApiUrl.indexOf("://");
if(indexOfHttp>0){
  baseApiUrl=baseApiUrl.substr(0,indexOfHttp+3)+baseApiUrl.substr(indexOfHttp+3,baseApiUrl.length).replace("//","/");
}else{
  baseApiUrl=baseApiUrl.replace("//","/")
}


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
    url: baseApiUrl+'/'+base+'/login/token?grantType='+grantType,
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
  return axiosAuth({
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
    url: baseApiUrl+'/'+base+'/user/check/userid',
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
    url: baseApiUrl+'/'+base+'/user/check/displayUserid',
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
    url: baseApiUrl+'/'+base+'/user/check/phoneno',
    method: 'post',
    data
  })
}
export function queryByUserloginid( params ) {
  return axios({
    url: baseApiUrl+'/'+base+'/user/queryByUserloginid',
    method: 'get',
    params:params
  })
}

export function doRegister( userInfo ) {
  removeToken();
  const data = {
    username:userInfo.username,
    displayUserid:userInfo.displayUserid,
    password:userInfo.password,
    phoneno:userInfo.phoneno,
    smsCode:userInfo.smsCode,
    deptid:userInfo.deptid,
    branchId:userInfo.branchId
  }
  return axios({
    url: baseApiUrl+'/'+base+'/user/register',
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
    url: baseApiUrl+'/'+base+'/user/password/reset?type=sms',
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
  return axiosAuth({
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
    url: baseApiUrl+'/'+base+'/user/sendEmail',
    method: 'post',
    data
  })
}
/**
 * 验证邮箱
 */

export function validEmailCode(params) {
  return axios({
    url: baseApiUrl+'/'+base+'/user/validEmailCode',
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
    url: baseApiUrl+'/tpa/login/wechat/wxpub/state',
    method: 'post',
    data:{}
  })
}
/**
 * 获取查询当前登录账户的所有关联账户
  * @returns
 */
 export function queryMyUsers( ) {
  return axiosAuth({
    url: base+'/user/queryMyUsers',
    method: 'get'
  })
}

