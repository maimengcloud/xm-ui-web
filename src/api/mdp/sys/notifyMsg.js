import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getSysBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 个人消息通知
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'消息编号 主键',sendUserid:'操作人id',sendUsername:'操作人名字',operTime:'操作时间',objType:'对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代-6/团队-7',msg:'备注-完整描述',gloNo:'全局根踪号，用于跟踪日志',branchId:'机构编号',ip:'ip地址',bizId:'业务主键编号',pbizId:'对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号',bizName:'对象名称',toUserid:'接收用户编号',toUsername:'接收用户名称',hadRead:'是否已读'}
 **/
 
//普通查询 条件之间and关系  
export const listNotifyMsg = params => { return axios.get(`${base}/mdp/sys/notifyMsg/list`, { params: params }); };

//删除一条个人消息通知 params={id:'消息编号 主键'}
export const delNotifyMsg = params => { return axios.post(`${base}/mdp/sys/notifyMsg/del`,params); };

//批量删除个人消息通知  params=[{id:'消息编号 主键'}]
export const batchDelNotifyMsg = params => { return axios.post(`${base}/mdp/sys/notifyMsg/batchDel`, params); };

//修改一条个人消息通知记录
export const editNotifyMsg = params => { return axios.post(`${base}/mdp/sys/notifyMsg/edit`, params); };

//新增一条个人消息通知
export const addNotifyMsg = params => { return axios.post(`${base}/mdp/sys/notifyMsg/add`, params); };

//批量修改某些字段
export const editSomeFieldsNotifyMsg = params => { return axios.post(`${base}/mdp/sys/notifyMsg/editSomeFields`, params); };



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