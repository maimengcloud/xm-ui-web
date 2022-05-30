import axios from '@/utils/request'

import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
import config from '@/common/config'

let base = config.getMoBasePath();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 订单与模块关系表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={orderId:'订单编号 主键',moduleId:'模块编号 主键',name:'模块名称',fee:'模块费用',billMode:'计费模式：0-不计费，1-按购买人数计费，2-总包费用,3-按实际使用人数每月计费',uniFee:'人均费用,单位人天',discount:'折扣比率，可折上折，叠加折扣。-按最大人数、按月数优惠',mcate:'分类(关联mo_cate)',logoUrl:'logo地址',feeDesc:'费用解释',udisRate:'人数折算比例。购买总人数*折扣率为当前模块购买人数',udis:'是否折算人数0否1是',musers:'购买人数=订单表中购买总人数*人数折扣',finalFee:'最终总费用=orgin_fee*dis_rate',days:'购买天数',orginFee:'原始总费用，未进行折扣方案前的总费用如果计费模式为1，则为uni_fee*musers*days单价*折扣方案天数折扣*折扣方案中人数折扣，如果计费模式为2，则为fee',disRate:'订单折扣率（可能会根据客户类型后台改订单折扣，从新计算订单价格）',ucheck:'是否控制总人数0-否1-是',ousers:'企业总人数=订单表中ousers',ver:'购买的版本0免费版，1企业版'}
 **/
 
//普通查询 条件之间and关系  
export const listMoOrderModule = params => { return axios.get(`${base}/mdp/mo/moOrderModule/list`, { params: params }); };

//删除一条订单与模块关系表 params={orderId:'订单编号 主键',moduleId:'模块编号 主键'}
export const delMoOrderModule = params => { return axios.post(`${base}/mdp/mo/moOrderModule/del`,params); };

//批量删除订单与模块关系表  params=[{orderId:'订单编号 主键',moduleId:'模块编号 主键'}]
export const batchDelMoOrderModule = params => { return axios.post(`${base}/mdp/mo/moOrderModule/batchDel`, params); };

//修改一条订单与模块关系表记录
export const editMoOrderModule = params => { return axios.post(`${base}/mdp/mo/moOrderModule/edit`, params); };

//新增一条订单与模块关系表
export const addMoOrderModule = params => { return axios.post(`${base}/mdp/mo/moOrderModule/add`, params); };

//批量修改某些字段
export const editSomeFieldsMoOrderModule = params => { return axios.post(`${base}/mdp/mo/moOrderModule/editSomeFields`, params); };



/**-------------------------前端mng|add|edit界面公共函数---------------请写在下面----------------------------------------------- */
//初始化页面上的字典
export const initDicts = (that) => {
 var itemCodes=['moduleBillMode'];//在此添加要加载的字典 如['sex','grade','lvl']
 if(itemCodes.length>0){
    initSimpleDicts('all',itemCodes).then(res=>{
        Object.assign(that.dicts,res.data.data)
    });
 }
};