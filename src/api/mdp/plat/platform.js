import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getSysBasePath();


/**
 * plat_platform
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'平台编号建议为platform-001 主键',platformName:'平台名称',status:'0-未启用，1-已启用，只能有一条数据有效',ctime:'创建时间',ltime:'更新时间',cuserid:'创建人编号',cusername:'创建人姓名',logoUrl:'平台logo图片地址',platformTitle:'前端显示的平台名称',keywords:'关键词逗号分割',minBuyAmount:'最小购买金额，达到此购物金额，才能提交订单',autoConfirmReceipt:'自动确认收货0否1是，确认收货时长请在订单设置中进行设置',canBill:'是否可开发票0否1是',billContextList:'发票内容选项,逗号分割',cutStock:'扣减库存时机0-下单付款完成，1-发货后',remarkJson:'备注填写要求',plusSales:'增加销量时机0-发货后，1-付款后',evaluate:'评价是否需要审核0否1是',discountPct:'全局折扣0~100之间',usePriceGroup:'是否使用价格套0否1是'}
 **/
 
//普通查询 条件之间and关系  
export const listPlatform = params => { return axios.get(`${base}/mdp/plat/platform/list`, { params: params }); };

//模糊查询plat_platform 条件之间or关系  
//export const listPlatformKey = params => { return axios.get(`${base}/mdp/plat/platform/listKey`, { params: params }); };

//删除一条plat_platform params={id:'平台编号建议为platform-001 主键'}
export const delPlatform = params => { return axios.post(`${base}/mdp/plat/platform/del`,params); };

//批量删除plat_platform  params=[{id:'平台编号建议为platform-001 主键'}]
export const batchDelPlatform = params => { return axios.post(`${base}/mdp/plat/platform/batchDel`, params); };

//修改一条plat_platform记录
export const editPlatform = params => { return axios.post(`${base}/mdp/plat/platform/edit`, params); };

//新增一条plat_platform
export const addPlatform = params => { return axios.post(`${base}/mdp/plat/platform/add`, params); };