import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

/**
 * 管理端机构表（机构下面若干部门）
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'机构编号 主键',branchName:'机构名称',enabled:'是否可用',industryCategory:'行业分类',cuserid:'创建人编号',cdate:'创建日期',cusername:'创建人姓名',phoneNo:'联系电话',emaill:'邮件'}
 **/

//普通查询 条件之间and关系
export const listBranchNoAuth = params => { return axios.get(`${base}/mdp/sys/branch/listBranchNoAuth`, { params: params }); };

//模糊查询管理端机构表（机构下面若干部门） 条件之间or关系
//export const listBranchKey = params => { return axios.get(`${base}/mdp/sys/branch/listKey`, { params: params }); };

//删除一条管理端机构表（机构下面若干部门） params={id:'机构编号 主键'}
export const delBranch = params => { return axios.post(`${base}/mdp/sys/branch/del`,params); };

//批量删除管理端机构表（机构下面若干部门）  params=[{id:'机构编号 主键'}]
export const batchDelBranch = params => { return axios.post(`${base}/mdp/sys/branch/batchDel`, params); };

//修改一条管理端机构表（机构下面若干部门）记录
export const editBranch = params => { return axios.post(`${base}/mdp/sys/branch/edit`, params); };

//新增一条管理端机构表（机构下面若干部门）
export const addBranchNoAuth = params => { return axios.post(`${base}/mdp/sys/branch/addBranchNoAuth`, params); };


//新增一条企业入驻审核流程
export const addUserJoinBranchRequire = params => { return axios.post(`${base}/mdp/sys/userJoinBranchRequire/add`, params); };
