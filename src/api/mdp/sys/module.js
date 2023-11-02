import axios from '@/utils/request'
import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'编号 主键',name:'模块名称',fee:'模块费用',billMode:'计费模式：0-不计费，1-按购买人数计费，2-总包费用,3-按实际使用人数每月计费',uniFee:'人均费用',discount:'折扣比率，可折上折，叠加折扣。-按最大人数、按年份优惠(',url:'匹配的url,如果匹配得到，则计费，以逗号分割多个',ignoreUrl:'匹配这个地址的不计费',bizFlowState:'审核状态',procInstId:'审核流程实例编号'}
 **/
 
//普通查询 条件之间and关系  
export const listModule = params => { return axios.get(`${base}/mdp/sys/module/list`, { params: params }); };

//删除一条模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问 params={id:'编号 主键'}
export const delModule = params => { return axios.post(`${base}/mdp/sys/module/del`,params); };

//批量删除模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问  params=[{id:'编号 主键'}]
export const batchDelModule = params => { return axios.post(`${base}/mdp/sys/module/batchDel`, params); };

//修改一条模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问记录
export const editModule = params => { return axios.post(`${base}/mdp/sys/module/edit`, params); };

//新增一条模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问
export const addModule = params => { return axios.post(`${base}/mdp/sys/module/add`, params); };

//批量修改某些字段
export const editSomeFieldsModule = params => { return axios.post(`${base}/mdp/sys/module/editSomeFields`, params); };

