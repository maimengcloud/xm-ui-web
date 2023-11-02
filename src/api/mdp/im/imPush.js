import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getImContext();

export const publishMessage = params => { return axios.post(`${base}/mdp/im/push/publishMessage`, params); };
