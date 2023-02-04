import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getCoreBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * xm_rpt_data
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'报表主键 主键',cfgId:'报表配置主键',rptName:'报表名称',rptData:'报表数据json对象,比rptCfg.cfg多了rawDatas',cuserid:'创建人编号',cbranchId:'创建人机构号',cusername:'创建人名称',ctime:'创建日期',bizDate:'归属业务日期yyyy-MM-dd型',bizType:'业务类型，同rpt_config.biz_type'}
 **/
 
//普通查询 条件之间and关系  
export const listXmRptData = params => { return axios.get(`${base}/xm/core/xmRptData/list`, { params: params }); };

//删除一条xm_rpt_data params={id:'报表主键 主键'}
export const delXmRptData = params => { return axios.post(`${base}/xm/core/xmRptData/del`,params); };

//批量删除xm_rpt_data  params=[{id:'报表主键 主键'}]
export const batchDelXmRptData = params => { return axios.post(`${base}/xm/core/xmRptData/batchDel`, params); };

//修改一条xm_rpt_data记录
export const editXmRptData = params => { return axios.post(`${base}/xm/core/xmRptData/edit`, params); };

//新增一条xm_rpt_data
export const addXmRptData = params => { return axios.post(`${base}/xm/core/xmRptData/add`, params); };

//批量修改某些字段
export const editSomeFieldsXmRptData = params => { return axios.post(`${base}/xm/core/xmRptData/editSomeFields`, params); };



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
 