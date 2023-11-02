import axios from '@/utils/request'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getSysContext()

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 前端功能菜单表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'菜单编号 主键',pid:'上级菜单编号',accUrl:'访问路径',msort:'菜单顺序',mcate:'菜单大类-指向menu_module.mcate',icon:'菜单图标',mname:'菜单名称',rpath:'路由PATH',rid:'路由编号',isShow:'是否显示',menuType:'菜单类型1菜单2按钮',operQxId:'绑定的操作权限编号',supVers:'支持版本0-免费版可用，1-企业版。假如企业属于企业版，则可以适用免费版和企业版的功能。假如企业为免费版，则只可以使用免费版功能',moduleId:'模块编号-指向menu_module.id',arole:'是否所有角色可用，0-否，1-不区分角色均可以用',qxType:'一般按钮才需要区分权限类型c-新增，r-读，u-更新，d-删除',apiRules:'对应后台的url地址，支持ant表达式匹配，用于后台接口调用时权限控制,多个逗号分隔,多个为or关系'}
 **/
 
//普通查询 条件之间and关系  
export const listMenuDef = params => { return axios.get(`${base}/mdp/menu/menuDef/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryMenuDefById = params => { return axios.get(`${base}/mdp/menu/menuDef/queryById`, { params: params }); };

//删除一条前端功能菜单表 params={id:'菜单编号 主键'}
export const delMenuDef = params => { return axios.post(`${base}/mdp/menu/menuDef/del`,params); };

//批量删除前端功能菜单表  params=[{id:'菜单编号 主键'}]
export const batchAddMenuDef = params => { return axios.post(`${base}/mdp/menu/menuDef/batchAdd`, params); };

//批量删除前端功能菜单表  params=[{id:'菜单编号 主键'}]
export const batchDelMenuDef = params => { return axios.post(`${base}/mdp/menu/menuDef/batchDel`, params); };

//修改一条前端功能菜单表记录
export const editMenuDef = params => { return axios.post(`${base}/mdp/menu/menuDef/edit`, params); };

//新增一条前端功能菜单表
export const addMenuDef = params => { return axios.post(`${base}/mdp/menu/menuDef/add`, params); };

//批量修改某些字段
export const editSomeFieldsMenuDef = params => { return axios.post(`${base}/mdp/menu/menuDef/editSomeFields`, params); };

//批量保存按钮
export const batchSaveMenuButton = params => { return axios.post(`${base}/mdp/menu/menuDef/batchSaveButton`, params); };

export const listMenuTree = params => { return axios.get(`${base}/mdp/menu/menuDef/list/tree`, { params: params }); };