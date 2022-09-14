import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getCoreBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * xm_task_eval
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'评价 主键',type:'评价类型1-雇主对服务商的评价，2-服务商对雇主的评价，3-组长对组员的评价',wspeed:'工作速度0-5分',wattit:'工作态度0-5分',wquality:'工作质量0-5分',totalStar:'总体评价0-5分',remark:'评价内容',evalUserid:'评价人编号',evalUsername:'评价人姓名',toUserid:'被评价人编号',toUsername:'被评价人姓名',evalBranchId:'评价人归属机构',toBranchId:'被评价人归属机构号',taskId:'任务编号',evalTime:'评价时间',paySpeed:'付款及时度0-5分',coopHappy:'合作愉快度0-5分'}
 **/
 
//普通查询 条件之间and关系  
export const listXmTaskEval = params => { return axios.get(`${base}/xm/core/xmTaskEval/list`, { params: params }); };

//删除一条xm_task_eval params={id:'评价 主键'}
export const delXmTaskEval = params => { return axios.post(`${base}/xm/core/xmTaskEval/del`,params); };

//批量删除xm_task_eval  params=[{id:'评价 主键'}]
export const batchDelXmTaskEval = params => { return axios.post(`${base}/xm/core/xmTaskEval/batchDel`, params); };

//修改一条xm_task_eval记录
export const editXmTaskEval = params => { return axios.post(`${base}/xm/core/xmTaskEval/edit`, params); };

//新增一条xm_task_eval
export const addXmTaskEval = params => { return axios.post(`${base}/xm/core/xmTaskEval/add`, params); };

//批量修改某些字段
export const editSomeFieldsXmTaskEval = params => { return axios.post(`${base}/xm/core/xmTaskEval/editSomeFields`, params); };



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