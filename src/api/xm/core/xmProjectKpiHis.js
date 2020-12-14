import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_project_kpi_his
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={kpiId:'kpi主表主键 主键',projectId:'项目编号',branchId:'机构编码',kpiIndex:'指标编号',kpiName:'指标名称',maxValue:'最大值',minValue:'最小值',score:'得分0~10分',scoreDate:'评分日期',bizFlowState:'流程状态',bizProcInstId:'流程实例编号',kpiValue:'kpi当前值',cdate:'创建日期',id:'主键',remark:'备注',calcType:'考核方式0月1季度3半年4一年',nextCalcDate:'下次考核开始时间'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectKpiHis = params => { return axios.get(`${base}/xm/core/xmProjectKpiHis/list`, { params: params }); };

//模糊查询xm_project_kpi_his 条件之间or关系  
//export const listXmProjectKpiHisKey = params => { return axios.get(`${base}/xm/core/xmProjectKpiHis/listKey`, { params: params }); };

//删除一条xm_project_kpi_his params={kpiId:'kpi主表主键 主键'}
export const delXmProjectKpiHis = params => { return axios.post(`${base}/xm/core/xmProjectKpiHis/del`,params); };

//批量删除xm_project_kpi_his  params=[{kpiId:'kpi主表主键 主键'}]
export const batchDelXmProjectKpiHis = params => { return axios.post(`${base}/xm/core/xmProjectKpiHis/batchDel`, params); };

//修改一条xm_project_kpi_his记录
export const editXmProjectKpiHis = params => { return axios.post(`${base}/xm/core/xmProjectKpiHis/edit`, params); };

//新增一条xm_project_kpi_his
export const addXmProjectKpiHis = params => { return axios.post(`${base}/xm/core/xmProjectKpiHis/add`, params); };