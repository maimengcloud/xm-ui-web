import axios from '@/utils/request'
import config from '@/common/config'
let base = config.getSysBasePath();

export const createOrder = params => { return axios.post(`${base}/mdp/mo/moOrder/create`, params) };

