import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getSysBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 机构权益关联表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={branchId:'公司ID 主键',ilvlId:'等级ID',ilvlName:'等级名称',idesc:'等级描述',ilevel:'1-粉丝,2-',discount:'权益，折扣',istatus:'等级状态',ctime:'创建时间',ltime:'更新时间',picUrl:'等级图标url',isFree:'是否付费获取权益',rtimeRule:'续会时间叠加规则：1.有效期日期后叠加续会时间',rtimeType:'续会时间类型：1.天数',rtime:'下次续会时间yyyy-MM-dd型',itype:'权益分类',shopId:'商户编号',instId:'当前流程实例编号',flowState:'当前流程状态，0初始1审批中2审批通过3审批不通过4流程取消或者删除',smaxAt:'单个任务最大金额（任务型用户才有）0代表不限制',totalAt:'累计接单金额（任务型用户才有）0代表不限制',mtype:'适用会员类型（2商户型、1普通型、3任务型）',totalExp:'累计经验值0代表不限制',smaxExp:'单个任务最大经验值0代表不限制',bids:'投标次数上限',sfeeRate:'服务费率0-100之间',idBak:'覆盖上一条的等级编号，即变成当前等级之前的等级编号',currTotalExp:'累计完成工作量',currBids:'当前月份投标次数（每月最后一天清零）',currTotalAt:'当前累计完成金额',currTotalBids:'累计投标总数',mfee:'月均费用',maxUsers:'最大人员数',currUsers:'当前人员数',maxRtime:'产品模块下次续费截止时间yyyy-MM-dd类型',mver:'产品版本0个人版1企业版'}
 **/
 
//普通查询 条件之间and关系  
export const listBranchInterests = params => { return axios.get(`${base}/mdp/sys/branchInterests/list`, { params: params }); };


export const getBranchInterestsDetail = params => { return axios.get(`${base}/mdp/sys/branchInterests/detail`, { params: params }); };

//删除一条机构权益关联表 params={branchId:'公司ID 主键'}
export const delBranchInterests = params => { return axios.post(`${base}/mdp/sys/branchInterests/del`,params); };

//批量删除机构权益关联表  params=[{branchId:'公司ID 主键'}]
export const batchDelBranchInterests = params => { return axios.post(`${base}/mdp/sys/branchInterests/batchDel`, params); };

//修改一条机构权益关联表记录
export const editBranchInterests = params => { return axios.post(`${base}/mdp/sys/branchInterests/edit`, params); };

//新增一条机构权益关联表
export const addBranchInterests = params => { return axios.post(`${base}/mdp/sys/branchInterests/add`, params); };

//批量修改某些字段
export const editSomeFieldsBranchInterests = params => { return axios.post(`${base}/mdp/sys/branchInterests/editSomeFields`, params); };



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