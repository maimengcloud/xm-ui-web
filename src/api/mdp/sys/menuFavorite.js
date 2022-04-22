import axios from '@/utils/request'
import config from '@/common/config'

let base = config.getSysBasePath();

export const userMenuFavoriteList = params => { return axios.get(`${base}/menu/menuFavorite/list`, { params: params }); };
export const saveMenuFavoriteList = params => { return axios.post(`${base}/menu/menuFavorite/batchSaveMenuFavorites`, params); };
