import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_group_user_candidate
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',groupId:'团队编号',userid:'团队成员编号',username:'团队成员',isHead:'是否组长，1是，0否',createTime:'成为候选人时间',candidateStatus:'候选状态0候选排对中1已加入项目做2已退出候选名单',outTime:'退出时间'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectGroupUserCandidate = params => { return axios.get(`${base}/xm/core/xmProjectGroupUserCandidate/list`, { params: params }); };

//模糊查询xm_group_user_candidate 条件之间or关系  
//export const listXmProjectGroupUserCandidateKey = params => { return axios.get(`${base}/xm/core/xmProjectGroupUserCandidate/listKey`, { params: params }); };

//删除一条xm_group_user_candidate params={id:'主键 主键'}
export const delXmProjectGroupUserCandidate = params => { return axios.post(`${base}/xm/core/xmProjectGroupUserCandidate/del`,params); };

//批量删除xm_group_user_candidate  params=[{id:'主键 主键'}]
export const batchDelXmProjectGroupUserCandidate = params => { return axios.post(`${base}/xm/core/xmProjectGroupUserCandidate/batchDel`, params); };

//修改一条xm_group_user_candidate记录
export const editXmProjectGroupUserCandidate = params => { return axios.post(`${base}/xm/core/xmProjectGroupUserCandidate/edit`, params); };

//新增一条xm_group_user_candidate
export const addXmProjectGroupUserCandidate = params => { return axios.post(`${base}/xm/core/xmProjectGroupUserCandidate/add`, params); };