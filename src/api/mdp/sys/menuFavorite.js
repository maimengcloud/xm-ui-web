import axios from '@/utils/request'
import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

export const userMenuFavoriteList = params => { return axios.get(`${base}/menu/menuFavorite/list`, { params: params }); };
export const saveMenuFavoriteList = params => { return axios.post(`${base}/menu/menuFavorite/batchSaveMenuFavorites`, params); };
