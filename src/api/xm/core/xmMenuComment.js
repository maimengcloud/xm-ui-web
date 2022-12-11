import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getCoreBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 档案评论表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',userid:'评论人',username:'评论人姓名',star:'星级',cdate:'时间',menuId:'需求编号',pid:'上级评论',ups:'点赞数量',isShow:'是否显示0否1是',toUserid:'回复用户编号',toUsername:'回复用户名',lvl:'层级0,1,2,3,4',context:'评论内容',branchId:'机构编号',ip:'ip地址',cityId:'城市编号',cityName:'城市名称',status:'状态0未审核，1已审核，3审核不通过',childNums:'儿子节点数量'}
 **/
 
//普通查询 条件之间and关系  
export const listXmMenuComment = params => { return axios.get(`${base}/xm/core/xmMenuComment/list`, { params: params }); };

//删除一条档案评论表 params={id:'主键 主键'}
export const delXmMenuComment = params => { return axios.post(`${base}/xm/core/xmMenuComment/del`,params); };

//批量删除档案评论表  params=[{id:'主键 主键'}]
export const batchDelXmMenuComment = params => { return axios.post(`${base}/xm/core/xmMenuComment/batchDel`, params); };

//修改一条档案评论表记录
export const editXmMenuComment = params => { return axios.post(`${base}/xm/core/xmMenuComment/edit`, params); };

//新增一条档案评论表
export const addXmMenuComment = params => { return axios.post(`${base}/xm/core/xmMenuComment/add`, params); };


//点赞一条评论
export const praiseXmMenuComment = params => { return axios.post(`${base}/xm/core/xmMenuComment/praise`, params); };

//批量修改某些字段
export const editSomeFieldsXmMenuComment = params => { return axios.post(`${base}/xm/core/xmMenuComment/editSomeFields`, params); };



/**-------------------------前端mng|add|edit界面公共函数---------------请写在下面----------------------------------------------- */
//初始化页面上的字典
export const initDicts = (that) => {
 var itemCodes=[];//在此添加要加载的字典 如['sex','grade','lvl']
 if(itemCodes.length>0){
    initSimpleDicts('all',itemCodes).then(res=>{
        Object.assign(that.dicts,res.data.data)
    });
 }
}; 