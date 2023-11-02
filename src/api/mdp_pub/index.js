import axios from '@/utils/request'
import mdp_base from './mdp_api_base.js';//全局mdp-核心公共api库 mdp所有组件库依赖于此
import mdp_ext from './mdp_api_ext.js';//全局mdp-扩展的组件使用的公共api库
import mdp_config from './mdp_config.js';//全局mdp-配置信息，主要配置一些请求路径的前缀，方便合并+拆分工程等，改下前缀即可
import mdp_api_biz from './mdp_api_biz.js';//业务功能需要的api,可根据实际情况添加更多业务相关的api
 
 export default {
  ...mdp_config,
  ...mdp_base, 
  ...mdp_ext,
  ...mdp_api_biz
}


