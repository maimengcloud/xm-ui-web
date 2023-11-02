import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 用户实名验证资料库
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={userid:'用户编号，如果是机构就是机构编号对应的用户编号 主键',idFront:'身份证正面',idBack:'身份证反面',idHold:'手持身份证',bizLicense:'营业执照',oths:'其它逗号分割多个',idNo:'身份证号',idEtime:'身份证到期日期',uscc:'统一信用代码号税号营业执照号等',actBname:'机构实名名称',actUname:'实名用户名称或者法人名称',ctime:'新增时间',ltime:'修改时间',flowState:'审核状态0-初始，1-审核中，2-通过，3-拒绝',isOrg:'是否为机构，0-否，1-是，机构指企业认证，个人指实名认证',validRemarks:'审核原因说明',branchId:'归属机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listUserValidInfo = params => { return axios.get(`${base}/mdp/sys/userValidInfo/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryUserValidInfoById = params => { return axios.get(`${base}/mdp/sys/userValidInfo/queryById`, { params: params }); };

//删除一条用户实名验证资料库 params={userid:'用户编号，如果是机构就是机构编号对应的用户编号 主键'}
export const delUserValidInfo = params => { return axios.post(`${base}/mdp/sys/userValidInfo/del`,params); };

//批量删除用户实名验证资料库  params=[{userid:'用户编号，如果是机构就是机构编号对应的用户编号 主键'}]
export const batchAddUserValidInfo = params => { return axios.post(`${base}/mdp/sys/userValidInfo/batchAdd`, params); };

//批量删除用户实名验证资料库  params=[{userid:'用户编号，如果是机构就是机构编号对应的用户编号 主键'}]
export const batchDelUserValidInfo = params => { return axios.post(`${base}/mdp/sys/userValidInfo/batchDel`, params); };

//修改一条用户实名验证资料库记录
export const editUserValidInfo = params => { return axios.post(`${base}/mdp/sys/userValidInfo/edit`, params); };

//新增一条用户实名验证资料库
export const addUserValidInfo = params => { return axios.post(`${base}/mdp/sys/userValidInfo/add`, params); };

//批量修改某些字段
export const editSomeFieldsUserValidInfo = params => { return axios.post(`${base}/mdp/sys/userValidInfo/editSomeFields`, params); };