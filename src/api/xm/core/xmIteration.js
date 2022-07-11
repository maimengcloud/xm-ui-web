import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getCoreBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 迭代定义
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'迭代编码 主键',branchId:'机构编号',iterationName:'迭代名称',startTime:'开始时间',endTime:'结束时间',onlineTime:'上线时间',pid:'上级迭代-作废，不以树状结构',adminUserid:'负责人',adminUsername:'负责人姓名',ctime:'创建时间',budgetCost:'预算成本',budgetWorkload:'预算工作量',seqNo:'顺序号',istatus:'迭代状态0未结束1已结束',cuserid:'创建人编号',cusername:'创建人人姓名',remark:'备注',iphase:'迭代阶段:0未开始,1需求评审,2计划会,3研发中,4测试中,5迭代上线,6已完成7已关闭',isTpl:'是否为模板',productId:'产品编号'}
 **/
 
//普通查询 条件之间and关系  
export const listXmIteration = params => { return axios.get(`${base}/xm/core/xmIteration/list`, { params: params }); };
export const listXmIterationWithState = params => { return axios.get(`${base}/xm/core/xmIteration/listWithState`, { params: params }); };


//模糊查询迭代定义 条件之间or关系  
//export const listXmIterationKey = params => { return axios.get(`${base}/xm/core/xmIteration/listKey`, { params: params }); };

//删除一条迭代定义 params={id:'迭代编码 主键'}
export const delXmIteration = params => { return axios.post(`${base}/xm/core/xmIteration/del`,params); };

//批量删除迭代定义  params=[{id:'迭代编码 主键'}]
export const batchDelXmIteration = params => { return axios.post(`${base}/xm/core/xmIteration/batchDel`, params); };

//修改一条迭代定义记录
export const editXmIteration = params => { return axios.post(`${base}/xm/core/xmIteration/edit`, params); };

//新增一条迭代定义
export const addXmIteration = params => { return axios.post(`${base}/xm/core/xmIteration/add`, params); };

//批量修改某些字段
export const editSomeFieldsXmIteration = params => { return axios.post(`${base}/xm/core/xmIteration/editSomeFields`, params); };



/**-------------------------前端mng|add|edit界面公共函数---------------请写在下面----------------------------------------------- */
//初始化页面上的字典
export const initDicts = (that) => {
 var itemCodes=['iterationStatus'];//在此添加要加载的字典 如['sex','grade','lvl']
 if(itemCodes.length>0){
    initSimpleDicts('all',itemCodes).then(res=>{
        Object.assign(that.dicts,res.data.data)
    });
 }
};