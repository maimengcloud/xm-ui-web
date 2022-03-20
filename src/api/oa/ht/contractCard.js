import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getOaBasePath();


/**
 * ht_contract_card
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={htId:'合同id 主键',draftId:'合同起草id',cpId:'合同关联相对方id',cpName:'相对方名称',linkName:'相对方联系人名称',linkPhone:'相对方联系人电话',cpAddress:'相对方联系人地址',cpOpenBank:'相对方开户行',cpBankAccount:'相对方开户行账号',htName:'合同名称',htSn:'合同编号',htGrossAmount:'合同总金额',htKaiPiaoAmount:'合同开票金额',htReceivedAmount:'合同已收金额',htReceivableAmount:'合同应收金额',htPayedAmount:'合同已付金额',htPayableAmount:'合同应付金额',htFile:'合同档案',htEffectDate:'合同生效日期',htFzUserid:'合同负责人id',htFzUsername:'合同负责人名称',htParentType:'合同类型主要分类',htType:'合同类型具体小类',htSignDate:'合同签订日期',htExpireDate:'合同到期日期',htStatus:'合同状态',htDemand:'合同需求说明',htParty:'合同签约主体',htPartyName:'合同签约主体名称',htImportantClause:'合同重要条款',branchId:'机构id',createTime:'创建时间',createUserId:'创建用户id',createUserName:'创建用户名称'}
 **/
 
//普通查询 条件之间and关系  
export const listContractCard = params => { return axios.get(`${base}/oa/ht/contractCard/list`, { params: params }); };

//模糊查询ht_contract_card 条件之间or关系  
//export const listContractCardKey = params => { return axios.get(`${base}/oa/ht/contractCard/listKey`, { params: params }); };

//删除一条ht_contract_card params={htId:'合同id 主键'}
export const delContractCard = params => { return axios.post(`${base}/oa/ht/contractCard/del`,params); };

//批量删除ht_contract_card  params=[{htId:'合同id 主键'}]
export const batchDelContractCard = params => { return axios.post(`${base}/oa/ht/contractCard/batchDel`, params); };

//修改一条ht_contract_card记录
export const editContractCard = params => { return axios.post(`${base}/oa/ht/contractCard/edit`, params); };

//新增一条ht_contract_card
export const addContractCard = params => { return axios.post(`${base}/oa/ht/contractCard/add`, params); };

export const computeAmount = params => { return axios.get(`${base}/oa/ht/contractCard/computeAmount`, { params: params }); };

//获取图表数据
export const loadChartData = params => { return axios.get(`${base}/oa/ht/contractCard/loadChartData`, { params: params }); };

//获取统计报表数据
export const getStatisticalStatement = params => { return axios.get(`${base}/oa/ht/contractCard/getStatisticalStatement`, { params: params }); };

