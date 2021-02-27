import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getOauth2LoginBasePath();

//let base='';
export function loginByUsername(username, password,deptid) {
  const data = {
    userloginid: username,
    password: password, 
    authType:'password_display_userid',
    deptid:deptid
  }
  return axios({
    url: base+'/login/token?grantType=password',
    method: 'post',
    data
  })
}
export function loginByPhoneno(phoneno, smsCode,isAdmin,deptid) {
  const data = {
    userloginid: phoneno,
    password: smsCode, 
    authType:'sms',
    isAdmin:true,
    deptid:deptid
  }
  return axios({
    url: base+'/login/token?grantType=password',
    method: 'post',
    data
  })
}
export function logout() {
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
export function getUserDepts(userid) {
  if( !userid ){
    params={
      userid:userid
    }
  }else{
    return 
  }
  const data= { params: params };
  return axios({
    url: base+'/user/depts',
    method: 'get',
    data
  })
}
export function switchDept(params) { 
	  return axios.post(  base+'/login/switch', params )
	}
