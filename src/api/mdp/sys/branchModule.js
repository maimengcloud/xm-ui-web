import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getSysBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 管理端机构表（机构下面若干部门）
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={branchId:'机构编号 主键',moduleId:'模块编号 主键',startTime:'启用日期',endTime:'结束日期',ctime:'创建日期',ltime:'更新日期',cuserid:'创建人编号',cusername:'创建人姓名',luserid:'修改人编号',lusername:'修改人姓名',status:'状态0停用1启用',musers:'购买用户数',mbidNum:'可投标次数-每月恢复为套餐数量，包含公司账户次数+个人以组织名义接单的次数，以上每接一单扣减此处',sfeeRate:'服务费率，15=15%',ver:'购买版本'}
 **/
 
//普通查询 条件之间and关系  
export const listBranchModule = params => { return axios.get(`${base}/mdp/sys/branchModule/list`, { params: params }); };


//统计登录机构的产品购买情况
export const calcBranchModule = params => { return axios.get(`${base}/mdp/sys/branchModule/calcBranchModule`, { params: params }); };

//删除一条管理端机构表（机构下面若干部门） params={branchId:'机构编号 主键',moduleId:'模块编号 主键'}
export const delBranchModule = params => { return axios.post(`${base}/mdp/sys/branchModule/del`,params); };

//批量删除管理端机构表（机构下面若干部门）  params=[{branchId:'机构编号 主键',moduleId:'模块编号 主键'}]
export const batchDelBranchModule = params => { return axios.post(`${base}/mdp/sys/branchModule/batchDel`, params); };

//修改一条管理端机构表（机构下面若干部门）记录
export const editBranchModule = params => { return axios.post(`${base}/mdp/sys/branchModule/edit`, params); };

//新增一条管理端机构表（机构下面若干部门）
export const addBranchModule = params => { return axios.post(`${base}/mdp/sys/branchModule/add`, params); };

//批量修改某些字段
export const editSomeFieldsBranchModule = params => { return axios.post(`${base}/mdp/sys/branchModule/editSomeFields`, params); };



/**-------------------------前端mng|add|edit界面公共函数---------------请写在下面----------------------------------------------- */
//初始化页面上的字典
export const initDicts = (that) => {
 that.dicts['status']=[{id:'0',name:'停用'},{id:'1',name:'启用'}]
 var itemCodes=['moduleBillMode',"bizFlowState"];//在此添加要加载的字典 如['sex','grade','lvl']
 if(itemCodes.length>0){
    initSimpleDicts('all',itemCodes).then(res=>{
        Object.assign(that.dicts,res.data.data)
    });
 }
};