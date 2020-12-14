import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_project_kpi
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',projectId:'项目编号',branchId:'机构编码',kpiIndex:'指标编号',kpiName:'指标名称',maxValue:'最大值',minValue:'最小值',score:'得分0~10分',scoreDate:'评分日期',bizFlowState:'流程状态',bizProcInstId:'流程实例编号',kpiValue:'kpi当前值',remark:'备注',calcType:'考核方式0月1季度3半年4一年',nextCalcDate:'下次考核开始时间'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProjectKpi = params => { return axios.get(`${base}/xm/core/xmProjectKpi/list`, { params: params }); };

//模糊查询xm_project_kpi 条件之间or关系  
//export const listXmProjectKpiKey = params => { return axios.get(`${base}/xm/core/xmProjectKpi/listKey`, { params: params }); };

//删除一条xm_project_kpi params={id:'主键 主键'}
export const delXmProjectKpi = params => { return axios.post(`${base}/xm/core/xmProjectKpi/del`,params); };

//批量删除xm_project_kpi  params=[{id:'主键 主键'}]
export const batchDelXmProjectKpi = params => { return axios.post(`${base}/xm/core/xmProjectKpi/batchDel`, params); };

//修改一条xm_project_kpi记录
export const editXmProjectKpi = params => { return axios.post(`${base}/xm/core/xmProjectKpi/edit`, params); };

//新增一条xm_project_kpi
export const addXmProjectKpi = params => { return axios.post(`${base}/xm/core/xmProjectKpi/add`, params); };