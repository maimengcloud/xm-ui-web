import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * xm_project
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'项目编号 主键',code:'项目代号',name:'项目名称',xmType:'项目类型',startTime:'项目开始时间',endTime:'项目结束时间',urgent:'紧急程度',priority:'优先程度',description:'项目描述',createUserid:'项目创建人编号',createUsername:'项目创建人',createTime:'创建时间',assess:'项目考核',assessRemarks:'考核备注',status:'项目状态，0-初始，1-立项中，2-执行中，3-已结项，4-暂停',branchId:'机构编号',planTotalCost:'总预算',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除',planNouserAt:'非人力成本总预算-应该大于或等于阶段计划非人力总成本',planInnerUserAt:'内部人力成本总预算-应该大于或等于阶段计划内部人力总成本',planOutUserAt:'外购人力成本总预算-应该大于或等于阶段计划外购人力总成本',locked:'是否锁定整个项目不允许变化0否1是',baseTime:'基线时间',baseRemark:'基线备注',baselineId:'基线主键',planWorkload:'总预算工作量-应该大于或等于阶段计划总工作量',totalReceivables:'总预计收款金额',budgetMarginRate:'预估毛利率',contractAmt:'合同总金额',planInnerUserPrice:'内部人力成本单价元/人时',planOutUserPrice:'外购人力成本单价元/人时',planOutUserCnt:'外购人数',planInnerUserCnt:'内部人数',planWorkingHours:'预计工作小时数目',taxRate:'税率',planInnerUserWorkload:'内部人力总工作量-应该大于或等于阶段计划内部人力总成本',planOutUserWorkload:'外购人力总工作量-应该大于或等于阶段计划外购人力总成本',productId:'产品编号',productName:'产品名称',fromTplId:'关联模板编号'}
 **/
 
//普通查询 条件之间and关系  
export const listXmProject = params => { return axios.get(`${base}/xm/core/xmProject/list`, { params: params }); };

//模糊查询xm_project 条件之间or关系  
//export const listXmProjectKey = params => { return axios.get(`${base}/xm/core/xmProject/listKey`, { params: params }); };

//删除一条xm_project params={id:'项目编号 主键'}
export const delXmProject = params => { return axios.post(`${base}/xm/core/xmProject/del`,params); };

//批量删除xm_project  params=[{id:'项目编号 主键'}]
export const batchDelXmProject = params => { return axios.post(`${base}/xm/core/xmProject/batchDel`, params); };

//修改一条xm_project记录
export const editXmProject = params => { return axios.post(`${base}/xm/core/xmProject/edit`, params); };

//新增一条xm_project
//新增一条xm_project
export const addXmProject = params => { return axios.post(`${base}/xm/core/xmProject/add`, params); };

export const editAssess = params => { return axios.post(`${base}/xm/core/xmProject/editAssess`, params); };

export const editStatus = params => { return axios.post(`${base}/xm/core/xmProject/editStatus`, params); };

export const editBudget = params => { return axios.post(`${base}/xm/core/xmProject/editBudget`, params); };


export const copyTo = params => { return axios.post(`${base}/xm/core/xmProject/copyTo`, params); };


export const createProjectCode = params => { return axios.post(`${base}/xm/core/xmProject/createProjectCode`, params); };


export const unDelXmProject = params => { return axios.post(`${base}/xm/core/xmProject/unDel`, params); };


export const getDefOptions= ()=>{
    
    var options={
    "projectStatus" : [ {
        "optionValue" : "0",
        "optionName" : "初始"
        }, {
        "optionValue" : "1",
        "optionName" : "售前"
        }, {
        "optionValue" : "2",
        "optionName" : "立项中"
        }, {
        "optionValue" : "3",
        "optionName" : "实施中"
        }, {
        "optionValue" : "4",
        "optionName" : "暂停中"
        }, {
        "optionValue" : "5",
        "optionName" : "结项中"
        }, {
        "optionValue" : "6",
        "optionName" : "已结项"
        }, {
        "optionValue" : "7",
        "optionName" : "售后"
        }, {
        "optionValue" : "8",
        "optionName" : "已完成"
        }, {
        "optionValue" : "9",
        "optionName" : "已关闭"
        } ],
        "projectType" : [ {
        "optionValue" : "0",
        "optionName" : "it-新建-瀑布"
        }, {
        "optionValue" : "2",
        "optionName" : "it-新建-敏捷"
        }, {
        "optionValue" : "1",
        "optionName" : "it-存量-瀑布"
        } ],
        "priority" : [ {
        "optionValue" : "zyx",
        "optionName" : "最优先"
        }, {
        "optionValue" : "yb",
        "optionName" : "一般优先"
        }, {
        "optionValue" : "ksh",
        "optionName" : "可稍缓"
        } ],
        "urgencyLevel" : [ {
        "optionValue" : "1",
        "optionName" : "非常紧急"
        }, {
        "optionValue" : "3",
        "optionName" : "一般紧急"
        }, {
        "optionValue" : "2",
        "optionName" : "紧急"
        }, {
        "optionValue" : "4",
        "optionName" : "低"
        } ]
        }
        return options;
}


