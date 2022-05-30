import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getSysBasePath();

//没用到的api请注释掉

export const listAdmin = params => { return axios.post(`${base}/pub/admin/list`, params) };

