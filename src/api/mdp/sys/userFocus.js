import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getSysBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 我关注的项目或者任务
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={userid:'用户编号 主键',bizId:'关注的对象主键 主键',pbizId:'对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号 主键',username:'用户名称',focusType:'对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代-6/团队-7/组织-8/个人-9/文章-W/合同-H/客户-K',bizName:'任务名称',pbizName:'对象上级名称',ftime:'关注时间',ubranchId:'用户归属机构'}
 **/
 
//普通查询 条件之间and关系  
export const listUserFocus = params => { return axios.get(`${base}/mdp/sys/userFocus/list`, { params: params }); };

//删除一条我关注的项目或者任务 params={userid:'用户编号 主键',bizId:'关注的对象主键 主键',pbizId:'对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号 主键'}
export const delUserFocus = params => { return axios.post(`${base}/mdp/sys/userFocus/del`,params); };

//批量删除我关注的项目或者任务  params=[{userid:'用户编号 主键',bizId:'关注的对象主键 主键',pbizId:'对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号 主键'}]
export const batchDelUserFocus = params => { return axios.post(`${base}/mdp/sys/userFocus/batchDel`, params); };

//修改一条我关注的项目或者任务记录
export const editUserFocus = params => { return axios.post(`${base}/mdp/sys/userFocus/edit`, params); };

//新增一条我关注的项目或者任务
export const addUserFocus = params => { return axios.post(`${base}/mdp/sys/userFocus/add`, params); };

//批量修改某些字段
export const editSomeFieldsUserFocus = params => { return axios.post(`${base}/mdp/sys/userFocus/editSomeFields`, params); };

//普通查询 条件之间and关系  
export const myFocusForIndex = params => {  
    return axios.get(`${base}/mdp/sys/userFocus/myFocusForIndex`, { params: params }); 
};

/**-------------------------前端mng|add|edit界面公共函数---------------请写在下面----------------------------------------------- */
//初始化页面上的字典
export const initDicts = (that) => {
 var itemCodes=['objType'];//在此添加要加载的字典 如['sex','grade','lvl']
 if(itemCodes.length>0){
    initSimpleDicts('all',itemCodes).then(res=>{
        Object.assign(that.dicts,res.data.data)
    });
 }
};