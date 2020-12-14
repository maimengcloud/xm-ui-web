import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getCoreBasePath();


/**
 * 功能表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'评论编号 主键',menuId:'功能编号',menuName:'功能名称',productId:'归属产品编号',remark:'备注',pid:'上级评论编号',cuserid:'评论人编号',cusername:'评论人名称',ctime:'评论时间',cbranchId:'评论人所属机构',adopt:'是否采纳0否1采纳',adoptUserid:'采纳人编号',adoptUsername:'采纳人名称',adoptTime:'采纳时间',closed:'关闭该评论0否1是',puserid:'上级用户编号',pusername:'上级姓名',premark:'上级备注',notifyUserids:'本评论需要同步给的人列表,逗号分隔',notifyChannels:'发送通知渠道inner-email/wxpub/sms/im/out-email等逗号分割',notifyUsernames:'通知用户姓名逗号分隔',cuserHeadImg:'发言人头像地址',replyType:'回复方式1引用2回复'}
 **/
 
//普通查询 条件之间and关系  
export const listXmMenuExchange = params => { return axios.get(`${base}/xm/core/xmMenuExchange/list`, { params: params }); };

//模糊查询功能表 条件之间or关系  
//export const listXmMenuExchangeKey = params => { return axios.get(`${base}/xm/core/xmMenuExchange/listKey`, { params: params }); };

//删除一条功能表 params={id:'评论编号 主键'}
export const delXmMenuExchange = params => { return axios.post(`${base}/xm/core/xmMenuExchange/del`,params); };

//批量删除功能表  params=[{id:'评论编号 主键'}]
export const batchDelXmMenuExchange = params => { return axios.post(`${base}/xm/core/xmMenuExchange/batchDel`, params); };

//修改一条功能表记录
export const editXmMenuExchange = params => { return axios.post(`${base}/xm/core/xmMenuExchange/edit`, params); };

//新增一条功能表
export const addXmMenuExchange = params => { return axios.post(`${base}/xm/core/xmMenuExchange/add`, params); };