import axios from '@/utils/request'
import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表

import config from '@/common/config'

let base=config.getSysBasePath();

/**
 * 前端功能菜单表
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'菜单编号 主键',pid:'上级菜单编号',accUrl:'访问路径',msort:'菜单顺序',category:'菜单大类',icon:'菜单图标',mname:'菜单名称',rpath:'路由PATH',rid:'路由编号',isShow:'是否显示',menuType:'菜单类型1菜单2按钮',operQxId:'绑定的操作权限编号'}
 **/
 
//普通查询 条件之间and关系  
export const listMenuDef = params => { return axios.get(`${base}/mdp/menu/menuDef/list`, { params: params }); };

export const listMenuTree = params => { return axios.get(`${base}/mdp/menu/menuDef/list/tree`, { params: params }); };
//模糊查询前端功能菜单表 条件之间or关系  
//export const listMenuDefKey = params => { return axios.get(`${base}/mdp/menu/menuDef/listKey`, { params: params }); };

//删除一条前端功能菜单表 params={id:'菜单编号 主键'}
export const delMenuDef = params => { return axios.post(`${base}/mdp/menu/menuDef/del`,params); };

//批量删除前端功能菜单表  params=[{id:'菜单编号 主键'}]
export const batchDelMenuDef = params => { return axios.post(`${base}/mdp/menu/menuDef/batchDel`, params); };

export const batchInsertMenuDef = params => { return axios.post(`${base}/mdp/menu/menuDef/batchInsert`, params); };

//修改一条前端功能菜单表记录
export const editMenuDef = params => { return axios.post(`${base}/mdp/menu/menuDef/edit`, params); };

//新增一条前端功能菜单表
export const addMenuDef = params => { return axios.post(`${base}/mdp/menu/menuDef/add`, params); };


//批量保存按钮
export const batchSaveMenuButton = params => { return axios.post(`${base}/mdp/menu/menuDef/batchSaveButton`, params); };

/**-------------------------前端mng|add|edit界面公共函数---------------请写在下面----------------------------------------------- */
//初始化页面上的字典
export const initDicts = (that) => {
    var itemCodes=['menuSupVers'];//在此添加要加载的字典 如['sex','grade','lvl']
    that.dicts['status']=[{id:'0',name:'停用'},{id:'1',name:'启用'}]
    if(itemCodes.length>0){
       initSimpleDicts('all',itemCodes).then(res=>{
           Object.assign(that.dicts,res.data.data)
       });
    }
   };
