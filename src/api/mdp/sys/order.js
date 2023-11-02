import axios from '@/utils/request'
import config from '@/api/mdp_pub/mdp_config'
let base = config.getSysContext()

export const createOrder = params => { return axios.post(`${base}/mdp/mo/moOrder/create`, params) };
export const calcOrder = params => { return axios.get(`${base}/mdp/mo/moOrder/calcOrder`,  { params: params })};
export const createAddUsersOrder = params => { return axios.post(`${base}/mdp/mo/moOrder/addUsers/create`, params) };
export const calcAddUsersOrder = params => { return axios.get(`${base}/mdp/mo/moOrder/addUsers/calcOrder`,  { params: params })};
export const createRenewOrder = params => { return axios.post(`${base}/mdp/mo/moOrder/renew/create`, params) };
export const calcRenewOrder = params => { return axios.get(`${base}/mdp/mo/moOrder/renew/calcOrder`,  { params: params })};

export const createFlagShipOrder = params => { return axios.post(`${base}/mdp/mo/moOrderFligship/add`, params) };



