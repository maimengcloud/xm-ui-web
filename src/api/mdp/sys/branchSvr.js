import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 企业服务列表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'服务编号 主键',branchId:'企业编号',name:'服务名称',remark:'服务简介',price:'服务价格',pimg:'服务主图',times:'服务时间范围',status:'状态0初始1上架2下架',summary:'简介'}
 **/
 
//普通查询 条件之间and关系  
export const listBranchSvr = params => { return axios.get(`${base}/mdp/sys/branchSvr/list`, { params: params }); };

//删除一条企业服务列表 params={id:'服务编号 主键'}
export const delBranchSvr = params => { return axios.post(`${base}/mdp/sys/branchSvr/del`,params); };

//批量删除企业服务列表  params=[{id:'服务编号 主键'}]
export const batchDelBranchSvr = params => { return axios.post(`${base}/mdp/sys/branchSvr/batchDel`, params); };

//修改一条企业服务列表记录
export const editBranchSvr = params => { return axios.post(`${base}/mdp/sys/branchSvr/edit`, params); };

//新增一条企业服务列表
export const addBranchSvr = params => { return axios.post(`${base}/mdp/sys/branchSvr/add`, params); };

//批量修改某些字段
export const editSomeFieldsBranchSvr = params => { return axios.post(`${base}/mdp/sys/branchSvr/editSomeFields`, params); };

