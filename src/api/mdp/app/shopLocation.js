import axios from '@/utils/request'

import config from '@/api/mdp_pub/mdp_config'

let base=config.getMallmBasePath();
 
/**
 * 门店地址表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'门店编号 主键',shopId:'店铺编号',longitude:'经度',latitude:'纬度',address:'地址',rank:'服务范围',province:'省',city:'市',district:'区',admin:'主负责人',createTime:'创建时间',title:'门店简称',formatAddress:'地址简称',country:'国家',districtId:'区县编号',deptid:'机构编号',branchId:'云用户机构编号',businessName:'门店名称（仅为商户名，如：国美、麦当劳，不应包含地区、地址、分店名等信息，错误示例：北京国美）',branchName:'分店名称（不应包含地区信息，不应与门店名有重复，错误示例：北京王府井店）',telephone:'门店的电话（纯数字，区号、分机号均由“-”隔开）',categories:'门店的类型（不同级分类用“,”隔开，如：美食，川菜，火锅。详细分类参见附件：微信门店类目表）',offsetType:'坐标类型：',recommend:'推荐品，餐厅可为推荐菜；酒店为推荐套房；景点为推荐游玩景点等，针对自己行业的推荐内容',special:'特色服务，如免费wifi，免费停车，送货上门等商户能提供的特色功能或服务',introduction:'商户简介，主要介绍商户信息等',openTime:'营业时间，24',avgPrice:'人均价格，大于0',status:'审核状态'}
 **/
 
//普通查询 条件之间and关系  
export const listSimpleLocation = params => { return axios.get(`${base}/shop/shopLocation/list/simple`, { params: params }); }; 