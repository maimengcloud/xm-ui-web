import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getCoreBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 任务相关费用订单表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'订单编号 主键',ouserid:'下单用户编号',obranchId:'公司ID-下单客户对应的企业',ostatus:'订单状态0-初始，1-待确认，2-待付款，3-已付款，4-已完成，5-已取消-未付款前可取消，取消后可删除，6-退单-退单后变为已取消，8已关闭-售后完成后可以关闭订单',ctime:'创建时间',ltime:'更新时间',payType:'支付方式',payStatus:'支付状态0待付款，1已付款',payTime:'支付时间',prepayId:'第三方支付订单编号',finalFee:'最终总费用=origin_fee',othFee:'其它费用',originFee:'原始价格=top_fee+urgent_fee+crm_sup_fee+hot_fee+efunds+share_fee',payAt:'最终付款金额-客户付款后回填',payAuthId:'支付授权码',payOpenid:'支付账户对应的第三方openid,注意，下单根付款不一定是同一个人',payUserid:'付款用户编号',payUsername:'付款用户名称',discount:'折扣率0-199',topFee:'置顶费用',topStime:'置顶开始时间',topEtime:'置顶结束时间',hotFee:'热搜费用',hotStime:'热搜开始时间',hotEtime:'热搜结束时间',top:'是否置顶0否1待付款2已开通3已过期',hot:'是否热搜0否1待付款2已开通3已过期',crmSupFee:'客服包办费用',urgentFee:'加急费用',urgent:'是否加急0否1待付款2已开通3已过期',crmSup:'是否客服包办0否1待付款2已开通3已过期',efunds:'托管金额',estate:'资金托管状况0-无须托管，1-待付款，2-已托管资金，3-已付款给服务商，4-已退款',etoPlatTime:'托管资金付款给平台的时间',etoDevTime:'托管资金支付给服务商的时间',ebackTime:'托管资金退回甲方时间',taskId:'任务编号',topDays:'置顶天数',hotDays:'热搜天数',urgentDays:'加急天数',urgentStime:'加急开始时间',urgentEtime:'加急结束时间',calcStatus:'定时检查日期是否已过期，已过期则取消任务中的置顶、加急、热搜状态计算状态0-无须计算，1-本周期已计算待下周期计算，2-结束',calcTime:'计算时间',oshare:'是否开启分享赚0否1待付款2已开通3已过期',shareFee:'分享赚佣金',payId:'付款流水号(内部生成，传给第三方原样传回，如果不正确，不允许更新数据库，防止作弊)',tranId:'第三方付款事务号',remark:'订单备注',name:'订单名称'}
 **/
 
//普通查询 条件之间and关系  
export const listXmTaskOrder = params => { return axios.get(`${base}/xm/core/xmTaskOrder/list`, { params: params }); };

//删除一条任务相关费用订单表 params={id:'订单编号 主键'}
export const delXmTaskOrder = params => { return axios.post(`${base}/xm/core/xmTaskOrder/del`,params); };

//批量删除任务相关费用订单表  params=[{id:'订单编号 主键'}]
export const batchDelXmTaskOrder = params => { return axios.post(`${base}/xm/core/xmTaskOrder/batchDel`, params); };

//修改一条任务相关费用订单表记录
export const editXmTaskOrder = params => { return axios.post(`${base}/xm/core/xmTaskOrder/edit`, params); };

//新增一条任务相关费用订单表
export const addXmTaskOrder = params => { return axios.post(`${base}/xm/core/xmTaskOrder/add`, params); };

//批量修改某些字段
export const editSomeFieldsXmTaskOrder = params => { return axios.post(`${base}/xm/core/xmTaskOrder/editSomeFields`, params); };

//计算任务订单应付金额
export const calcXmTaskOrder = params => { return axios.get(`${base}/xm/core/xmTaskOrder/calcOrder`, { params: params }); };

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