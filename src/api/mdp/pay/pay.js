import axios from '@/utils/request'
import config from '@/api/mdp_pub/mdp_config'
let base = config.getPayContext();

export const aliPay = params => { return axios.post(`${base}/alipay/uniOrder`, params) }
export const weixinPay = params => { return axios.post(`${base}/wxpay/uniOrder/native`, params) }
export const checkWxPayStatus = params => { return axios.get(`${base}/wxpay/uniOrder/checkOrderStatus`, {params}) }
