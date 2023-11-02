import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 服务保障定义表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'编号 主键',name:'名称',fee:'价格',remark:'备注',dayLimit:'期限,单位天数，360天，付款成功当天算起'}
 **/
 
//普通查询 条件之间and关系  
export const listGuard = params => { return axios.get(`${base}/mdp/sys/guard/list`, { params: params }); };

//删除一条服务保障定义表 params={id:'编号 主键'}
export const delGuard = params => { return axios.post(`${base}/mdp/sys/guard/del`,params); };

//批量删除服务保障定义表  params=[{id:'编号 主键'}]
export const batchDelGuard = params => { return axios.post(`${base}/mdp/sys/guard/batchDel`, params); };

//修改一条服务保障定义表记录
export const editGuard = params => { return axios.post(`${base}/mdp/sys/guard/edit`, params); };

//新增一条服务保障定义表
export const addGuard = params => { return axios.post(`${base}/mdp/sys/guard/add`, params); };

//批量修改某些字段
export const editSomeFieldsGuard = params => { return axios.post(`${base}/mdp/sys/guard/editSomeFields`, params); };

