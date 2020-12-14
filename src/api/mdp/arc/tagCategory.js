import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getArcBasePath();


/**
 * arc_tag_category
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'分组编号 主键',branchId:'机构号',shopId:'商户编号',categoryName:'分组名称'}
 **/
 
//普通查询 条件之间and关系  
export const listTagCategory = params => { return axios.get(`${base}/mdp/arc/tagCategory/list`, { params: params }); };

//模糊查询arc_tag_category 条件之间or关系  
//export const listTagCategoryKey = params => { return axios.get(`${base}/mdp/arc/tagCategory/listKey`, { params: params }); };

//删除一条arc_tag_category params={id:'分组编号 主键'}
export const delTagCategory = params => { return axios.post(`${base}/mdp/arc/tagCategory/del`,params); };

//批量删除arc_tag_category  params=[{id:'分组编号 主键'}]
export const batchDelTagCategory = params => { return axios.post(`${base}/mdp/arc/tagCategory/batchDel`, params); };

//修改一条arc_tag_category记录
export const editTagCategory = params => { return axios.post(`${base}/mdp/arc/tagCategory/edit`, params); };

//新增一条arc_tag_category
export const addTagCategory = params => { return axios.post(`${base}/mdp/arc/tagCategory/add`, params); };