import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getSysBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * sys_branch_config
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={branchId:'机构编号 主键',musers:'购买用户数',lvl:'机构等级',mbidNum:'可投标次数-每月恢复为套餐数量，包含公司账户次数+个人以组织名义接单的次数，以上每接一单扣减此处',startTime:'开始日期yyyy-MM-dd',endTime:'结束日期yyyy-MM-dd',sfeeRate:'服务费率，15=15%'}
 **/
 
//普通查询 条件之间and关系  
export const listBranchConfig = params => { return axios.get(`${base}/mdp/sys/branchConfig/list`, { params: params }); };

//删除一条sys_branch_config params={branchId:'机构编号 主键'}
export const delBranchConfig = params => { return axios.post(`${base}/mdp/sys/branchConfig/del`,params); };

//批量删除sys_branch_config  params=[{branchId:'机构编号 主键'}]
export const batchDelBranchConfig = params => { return axios.post(`${base}/mdp/sys/branchConfig/batchDel`, params); };

//修改一条sys_branch_config记录
export const editBranchConfig = params => { return axios.post(`${base}/mdp/sys/branchConfig/edit`, params); };

//新增一条sys_branch_config
export const addBranchConfig = params => { return axios.post(`${base}/mdp/sys/branchConfig/add`, params); };

//批量修改某些字段
export const editSomeFieldsBranchConfig = params => { return axios.post(`${base}/mdp/sys/branchConfig/editSomeFields`, params); };



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