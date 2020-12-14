import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

export function loginByUsername(username, password) {
  const data = {
    displayUserid: username,
    password: password,
    loginType:'password'
  }
  return axios({
    url: base+'/common/login',
    method: 'post',
    data
  })
}
export function loginByPhoneno(phoneno, smsCode,isAdmin) {
  const data = {
    phoneno: phoneno,
    smsCode: smsCode,
    loginType:'sms',
    isAdmin:true
  }
  return axios({
    url: base+'/common/login',
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
  return axios({
    url: base+'/sys/pub/login/user/info/all',
    method: 'get',
    params:  params
  })
}

export function createShortToken(params) { 
  return axios.post(  base+'/sys/pub/login/createShortToken', params )
}

export function switchDept(params) { 
	  return axios.post(  base+'/sys/pub/login/user/switch', params )
	}
