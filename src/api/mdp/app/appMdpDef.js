import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getSysBasePath();

/**
 * MDP平台应用定义表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={mdpAppid:'应用编号 主键',name:'应用名称',logoUrl:'应用logo',remark:'应用描述',bizType:'应用分类',deptid:'归属部门',branchId:'归属机构',cdate:'创建日期',cuserid:'创建人',enabled:'应用状态0下架1上架'}
 **/
 
//普通查询 条件之间and关系  
export const listAppMdpDef = params => { return axios.get(`${base}/mdp/app/appMdpDef/list`, { params: params }); };

//模糊查询MDP平台应用定义表 条件之间or关系  
//export const listAppMdpDefKey = params => { return axios.get(`${base}/mdp/app/appMdpDef/listKey`, { params: params }); };

//删除一条MDP平台应用定义表 params={mdpAppid:'应用编号 主键'}
export const delAppMdpDef = params => { return axios.post(`${base}/mdp/app/appMdpDef/del`,params); };

//批量删除MDP平台应用定义表  params=[{mdpAppid:'应用编号 主键'}]
export const batchDelAppMdpDef = params => { return axios.post(`${base}/mdp/app/appMdpDef/batchDel`, params); };

//修改一条MDP平台应用定义表记录
export const editAppMdpDef = params => { return axios.post(`${base}/mdp/app/appMdpDef/edit`, params); };

//新增一条MDP平台应用定义表
export const addAppMdpDef = params => { return axios.post(`${base}/mdp/app/appMdpDef/add`, params); };