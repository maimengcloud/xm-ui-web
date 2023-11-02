import axiosAuth from '@/utils/request'
import axios from '@/utils/requestNoAuth'//免登录访问


import config from '@/api/mdp_pub/mdp_config'

let base=config.getSmsContext();

/**
 * 发送短信验证码、验证短信验证码接口
 **/
 
 
//发送短信验证码
export const sendNoAuthSmsCode = params => { return axios.post(`${base}/sms/sendSmsCode`, params); };
 
//发送短信验证码
export const sendSmsCode = params => { return axiosAuth.post(`${base}/sms/sendSmsCode`, params); };

//验证短信验证码 
export const validateSmsCode = params => { return axiosAuth.post(`${base}/sms/validateSmsCode`, params); };