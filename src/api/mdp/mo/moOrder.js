import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getMoContext();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * mo_order
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'订单编号 主键',name:'订单名称',obranchId:'下单机构号码',ouserid:'下单用户编号',ousername:'下单用户名称',moFinalFee:'模块合计总金额=模块中的final_fee合计',status:'订单状态0-初始，1-待确认，2-待付款，3-已付款，4-已完成，5-已取消-未付款前可取消，取消后可删除，6-退单-退单后变为已取消，8已关闭-售后完成后可以关闭订单',sstatus:'结算状态0-待结算，1-已结算',ctime:'创建时间',payTime:'付款时间',payCtime:'付款确认时间',moOrginFee:'折扣前总价=模块中orgin_fee合计',ousers:'购买人数',ocates:'购买分类数',omodules:'购买模块数',poid:'上级订单-如果是续费订单，记录原订单号',startTime:'启用日期',endTime:'结束日期',payType:'支付方式1-微信，2-支付宝，3-线下支付',payId:'付款流水号(内部生成，传给第三方原样传回，如果不正确，不允许更新数据库，防止作弊)',prepayId:'预下单付款订单号（第三方返回）',topenId:'第三方账号编号',pbankId:'收款银行编号(支付方式为3时必填)',pbankName:'收款银行名称(支付方式为3时必填)',pbankCardNo:'收款银行卡号(支付方式为3时必填)',pbankUsername:'收款账户姓名(支付方式为3时必填)',remark:'备注',finishTime:'完成时间',closeTime:'关闭时间',setTime:'结算时间',odays:'购买天数',ofinalFee:'最终订单价格、最终付款金额=mo_final_fee+oth_fee',odisRate:'订单折扣率(下单后后台根据不同客户进行折扣调整)=将在模块表中执行折扣操作，再从新合计价格',othFee:'其它费用',otype:'订单类型0-电商商城商品，1-应用模块使用购买，2-vip购买会员，3-购买服务保障',osource:'订单来源1-前端客户下单，2-后台待客下单',memType:'客户类型-参考sys_user表mem_type',atype:'账户类型-根据sys_user表atype',saleUserid:'销售经理编号',saleUsername:'销售经理名称',custPhone:'客户联系电话',custAddress:'客户联系地址',payAt:'最终付款金额-客户付款后回填',obranchName:'下单机构名称',ooper:'订单操作类型1-新购，2-续费，3-新增人数',tranId:'第三方付款事务号',invoice:'是否已开票',invoiceTime:'开票时间',invoiceId:'发票编号'}
 **/
 
//普通查询 条件之间and关系  
export const listMoOrder = params => { return axios.get(`${base}/mdp/mo/moOrder/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryMoOrderById = params => { return axios.get(`${base}/mdp/mo/moOrder/queryById`, { params: params }); };

//删除一条mo_order params={id:'订单编号 主键'}
export const delMoOrder = params => { return axios.post(`${base}/mdp/mo/moOrder/del`,params); };

//批量删除mo_order  params=[{id:'订单编号 主键'}]
export const batchAddMoOrder = params => { return axios.post(`${base}/mdp/mo/moOrder/batchAdd`, params); };

//批量删除mo_order  params=[{id:'订单编号 主键'}]
export const batchDelMoOrder = params => { return axios.post(`${base}/mdp/mo/moOrder/batchDel`, params); };

//修改一条mo_order记录
export const editMoOrder = params => { return axios.post(`${base}/mdp/mo/moOrder/edit`, params); };

//新增一条mo_order
export const addMoOrder = params => { return axios.post(`${base}/mdp/mo/moOrder/add`, params); };

//批量修改某些字段
export const editSomeFieldsMoOrder = params => { return axios.post(`${base}/mdp/mo/moOrder/editSomeFields`, params); };