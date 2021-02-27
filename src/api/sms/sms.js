import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSmsBasePath();

/**
 * 发送短信验证码、验证短信验证码接口
 **/
 
//发送短信验证码
export const sendSmsCode = params => { return axios.post(`${base}/sms/sendSmsCode`, params); };

//验证短信验证码 
export const validateSmsCode = params => { return axios.post(`${base}/sms/validateSmsCode`, params); };