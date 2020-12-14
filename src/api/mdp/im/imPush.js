import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getImBasePath();

export const publishMessage = params => { return axios.post(`${base}/mdp/im/push/publishMessage`, params); };