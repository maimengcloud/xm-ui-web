import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

/**
 * 第三方系统向我方开放的用户列表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',unionid:'全局唯一编号',openid:'帐户加密后的编号，用于对第三方系统进行开放',userid:'MDP用户编号',locked:'是否被锁定',startdate:'启用日期',nickname:'昵称',username:'用户名称',phoneno:'移动电话号码',country:'国家',city:'城市',headimgurl:'头像地址',province:'省份',userunionid:'对应本系统user表的UNIONID',mdpAppid:'前端应用系统编号',deptid:'机构编号',branchId:'云用户机构编号',appid:'第三方登录应用系统编号',authId:'授权编号'}
 **/

//普通查询 条件之间and关系
export const listUserTpa = params => { return axios.get(`${base}/mdp/sys/userTpa/list`, { params: params }); };

//模糊查询第三方系统向我方开放的用户列表 条件之间or关系
//export const listUserTpaKey = params => { return axios.get(`${base}/mdp/sys/userTpa/listKey`, { params: params }); };

//删除一条第三方系统向我方开放的用户列表 params={id:'主键 主键'}
export const delUserTpa = params => { return axios.post(`${base}/mdp/sys/userTpa/del`,params); };

//批量删除第三方系统向我方开放的用户列表  params=[{id:'主键 主键'}]
export const batchDelUserTpa = params => { return axios.post(`${base}/mdp/sys/userTpa/batchDel`, params); };

//修改一条第三方系统向我方开放的用户列表记录
export const editUserTpa = params => { return axios.post(`${base}/mdp/sys/userTpa/edit`, params); };

//新增一条第三方系统向我方开放的用户列表
export const addUserTpa = params => { return axios.post(`${base}/mdp/sys/userTpa/add`, params); };

//查询用户表关联的第三方系统的向我方开放的用户列表
export const selectByUserTpa = params => { return axios.get(`${base}/mdp/sys/userTpa/selectByUserTpa`, { params: params }); };
//查看mk的会员表
export const selectByMemMember = params => { return axios.get(`${base}/mdp/sys/userTpa/selectByMemMember`, { params: params }); };
//添加
export const addSubacctAddForm = params => { return axios.post(`${base}/mdp/sys/userTpa/addSubacctAddForm`, params); };
