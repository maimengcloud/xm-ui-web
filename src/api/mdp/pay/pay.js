import axios from '@/utils/request'
import config from '@/common/config'
let base = config.getPayBasePath();

export const aliPay = params => { return axios.post(`${base}/alipay/uniOrder`, params) }
export const weixinPay = params => { return axios.post(`${base}/wxpay/uniOrder/native`, params) }
