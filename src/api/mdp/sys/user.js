import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

/**
 * 用户表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={userid:'内部用户编号 主键',unionid:'全局唯一编号',displayUserid:'登录展示使用用户编号',locked:'是否被锁定0否1是',startdate:'启用日期',nickname:'昵称',username:'用户名称',phoneno:'移动电话号码',password:'密码',salt:'盐值',fgOne:'指纹1',fgTwo:'指纹2',fgThr:'指纹3',idCardNo:'身份证号码',pwdtype:'密码类型1指纹2密码',headimgurl:'头像地址',country:'国家',city:'城市',province:'省份',address:'详细地址',sex:'性别',enddate:'到期日期',districtId:'区县编号',email:'邮箱',userId:'user_id',userAccount:'user_account',userPwd:'user_pwd',userName:'user_name',userDesc:'user_desc'}
 **/
 
//普通查询 条件之间and关系  
export const listUser = params => { return axios.get(`${base}/mdp/sys/user/list`, { params: params }); };
export const listUserNames = params => { return axios.get(`${base}/mdp/sys/user/listUserNames`, { params: params }); };
export const  selectlistKey= params => { return axios.get(`${base}/mdp/sys/user/selectlistKey`, { params: params }); }; 

//模糊查询用户表 条件之间or关系  
//export const listUserKey = params => { return axios.get(`${base}/mdp/sys/user/listKey`, { params: params }); };

export const addUser = params => { return axios.post(`${base}/mdp/sys/user/add`,params); };

//删除一条用户表 params={userid:'内部用户编号 主键'}
export const delUser = params => { return axios.post(`${base}/mdp/sys/user/del`,params); };

//批量删除用户表  params=[{userid:'内部用户编号 主键'}]
export const batchDelUser = params => { return axios.post(`${base}/mdp/sys/user/batchDel`, params); };

//修改一条用户表记录
export const editUser = params => { return axios.post(`${base}/mdp/sys/user/edit`, params); };

//重置管理人员帮别人重置密码
export const resetPasswordByAdmin = params => { return axios.post(`${base}/safe/user/password/reset/byAdmin`, params); };