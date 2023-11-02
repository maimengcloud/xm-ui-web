import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 商务合作申请
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',userid:'用户编号',username:'用户名称',branchId:'公司编号',branchName:'公司名称',email:'邮箱',phoneno:'电话',remark:'合作要求',status:'状态0-初始，1-申请中，2-进行中，3-已结束',ctime:'申请日期',replyUserid:'根进人编号',replyUsername:'跟进人姓名',replyTime:'跟进时间',bizType:'合作类型1-项目合作，2-广告合作，3-服务商入驻，4-校企合作'}
 **/
 
//普通查询 条件之间and关系  
export const listCoop = params => { return axios.get(`${base}/mdp/biz/coop/list`, { params: params }); };

//删除一条商务合作申请 params={id:'主键 主键'}
export const delCoop = params => { return axios.post(`${base}/mdp/biz/coop/del`,params); };

//批量删除商务合作申请  params=[{id:'主键 主键'}]
export const batchDelCoop = params => { return axios.post(`${base}/mdp/biz/coop/batchDel`, params); };

//修改一条商务合作申请记录
export const editCoop = params => { return axios.post(`${base}/mdp/biz/coop/edit`, params); };

//新增一条商务合作申请
export const addCoop = params => { return axios.post(`${base}/mdp/biz/coop/add`, params); };

//批量修改某些字段
export const editSomeFieldsCoop = params => { return axios.post(`${base}/mdp/biz/coop/editSomeFields`, params); };

