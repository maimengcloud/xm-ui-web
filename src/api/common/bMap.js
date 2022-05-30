import axios from '@/utils/request'




/**
 * 商品信息
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'商品编号 主键',categoryId:'分类编号',goodsSn:'商品编码',name:'商品名称',brandId:'品牌编号',goodsNumber:'商品数量',keywords:'关键词',goodsBrief:'商品简介',goodsDesc:'商品详情',isOnSale:'是否在售',addTime:'添加时间',sortOrder:'排序',isDelete:'是否已删除',attributeCategory:'商品属性分类',isNew:'是否是新品',goodsUnit:'商品单位',primaryPicUrl:'商品主图',listPicUrl:'商品列表图',primaryProductId:'主产品编号',promotionDesc:'推广描述',promotionTag:'推广标签',isLimited:'是否限制',isHot:'是否热销',shopLocationId:'商品所属门店编号',retailPrice:'零售价格',wholesalePrice:'批发价格',purchasePrice:'进货价格',floorPrice:'最低价格'}
 **/
// '/api/m1/bMap/'    target: 'https://api.map.baidu.com/
// https://api.map.baidu.com/?qt=rgc&x=12609455&y=2620453.94&dis_poi=100&poi_num=10&latest_admin=1&ie=utf-8&oue=1&fromproduct=jsapi&res=api&callback=BMap._rd._cbk30753&ak=T4lll3sQi7ZdbnVb1INOCrxequ1kp4PG
// 百度地图api,点转纤细
// export const pointToLocation = params => { return axios.get(`https://api.map.baidu.com/`, { params: params }) }
export const pointToLocation = params => { return axios.get(`/bmap`, { params: params }) }
