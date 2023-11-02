import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * sys_dept
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={deptid:'部门编号 主键',deptName:'部门全称',pdeptid:'上级部门编号',deptType:'参考数据字典deptType',state:'状态A正常E无效',manager:'负责人编号',leader:'上级领导编号',shortName:'简称',displayDeptid:'部门编码外部使用',orgType:'参考数据字典orgType',managerName:'负责人名称',leaderName:'上级领导名称',branchId:'云用户机构编号',levelType:'层级类型(科云：0国,1省,2市,3区县,4街道,5自然村)',idPath:'部门编号路径',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态',ltime:'最后更新时间',isCbCenter:'是否为成本中心0否1是'}
 **/
 
//普通查询 条件之间and关系  
export const listDept = params => { return axios.get(`${base}/mdp/sys/dept/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryDeptById = params => { return axios.get(`${base}/mdp/sys/dept/queryById`, { params: params }); };

//删除一条sys_dept params={deptid:'部门编号 主键'}
export const delDept = params => { return axios.post(`${base}/mdp/sys/dept/del`,params); };

//批量删除sys_dept  params=[{deptid:'部门编号 主键'}]
export const batchAddDept = params => { return axios.post(`${base}/mdp/sys/dept/batchAdd`, params); };

//批量删除sys_dept  params=[{deptid:'部门编号 主键'}]
export const batchDelDept = params => { return axios.post(`${base}/mdp/sys/dept/batchDel`, params); };

//修改一条sys_dept记录
export const editDept = params => { return axios.post(`${base}/mdp/sys/dept/edit`, params); };

//新增一条sys_dept
export const addDept = params => { return axios.post(`${base}/mdp/sys/dept/add`, params); };

//批量修改某些字段
export const editSomeFieldsDept = params => { return axios.post(`${base}/mdp/sys/dept/editSomeFields`, params); };

//普通查询
export const listTreeDept = params => { return axios.get(`${base}/sys/dept/list/tree`, { params: params }); };
