import axios from '@/utils/request'

import config from '@/common/config'

let base=config.getArcBasePath();

/**
 * 图片素材库
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',name:'附件名称',url:'访问路径',relativePath:'硬盘存放路径',fileSuffix:'后缀名',rootPath:'根目录',createDate:'存入时间',fileSize:'文件大小',deptid:'归属部门',tag:'标签',remark:'备注信息',categoryId:'图片分类',storageName:'硬盘存储名字(不带后缀)',urlPrefix:'链接前缀',isOutUrl:'是否外部链接',outUrl:'外部链接',branchId:'机构编号'}
 **/
 
//普通查询 条件之间and关系  
export const listImage = params => { return axios.get(`${base}/mdp/arc/image/list`, { params: params }); };

//模糊查询图片素材库 条件之间or关系  
//export const listImageKey = params => { return axios.get(`${base}/mdp/arc/image/listKey`, { params: params }); };

//删除一条图片素材库 params={id:'主键 主键'}
export const delImage = params => { return axios.post(`${base}/mdp/arc/image/del`,params); };

//批量删除图片素材库  params=[{id:'主键 主键'}]
export const batchDelImage = params => { return axios.post(`${base}/mdp/arc/image/batchDel`, params); };

//修改一条图片素材库记录
export const editImage = params => { return axios.post(`${base}/mdp/arc/image/edit`, params); };

//新增一条图片素材库
export const addImage = params => { return axios.post(`${base}/mdp/arc/image/add`, params); };

//获取图片分类名
export const listTags = params => { return axios.get(`${base}/mdp/arc/image/listTags`, params); };

export const uploadBase64 = params => { return axios.post(`${base}/mdp/arc/image/upload/base64`, params); };