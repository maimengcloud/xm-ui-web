import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 操作日志表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'日志编号 主键',operUserid:'操作人id',operUsername:'操作人名字',operTime:'操作时间',objType:'对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代6',oldValue:'历史值',newValue:'新值',remarks:'备注-只描述新旧值之间的变化',gloNo:'全局根踪号，用于跟踪日志',branchId:'机构编号',ip:'ip地址',bizId:'业务主键编号',pbizId:'对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号'}
 **/
 
//普通查询 条件之间and关系  
export const listRecord = params => { return axios.get(`${base}/mdp/sys/record/list`, { params: params }); };

//删除一条操作日志表 params={id:'日志编号 主键'}
export const delRecord = params => { return axios.post(`${base}/mdp/sys/record/del`,params); };

//批量删除操作日志表  params=[{id:'日志编号 主键'}]
export const batchDelRecord = params => { return axios.post(`${base}/mdp/sys/record/batchDel`, params); };

//修改一条操作日志表记录
export const editRecord = params => { return axios.post(`${base}/mdp/sys/record/edit`, params); };

//新增一条操作日志表
export const addRecord = params => { return axios.post(`${base}/mdp/sys/record/add`, params); };

//批量修改某些字段
export const editSomeFieldsRecord = params => { return axios.post(`${base}/mdp/sys/record/editSomeFields`, params); };
