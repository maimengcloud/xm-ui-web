import axios from '@/utils/request'

import config from '@/common/config'

let base = config.getArcBasePath();


/**
 * arc_tag
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'标签编号 主键',tagName:'标签名',branchId:'机构号',shopId:'商户编号',categoryId:'标签分组'}
 **/
 
//普通查询 条件之间and关系  
export const listTag = params => { return axios.get(`${base}/mdp/arc/tag/list`, { params: params }); };

//模糊查询arc_tag 条件之间or关系  
//export const listTagKey = params => { return axios.get(`${base}/mdp/arc/tag/listKey`, { params: params }); };

//删除一条arc_tag params={id:'标签编号 主键'}
export const delTag = params => { return axios.post(`${base}/mdp/arc/tag/del`,params); };

//批量删除arc_tag  params=[{id:'标签编号 主键'}]
export const batchDelTag = params => { return axios.post(`${base}/mdp/arc/tag/batchDel`, params); };

//修改一条arc_tag记录
export const editTag = params => { return axios.post(`${base}/mdp/arc/tag/edit`, params); };

//新增一条arc_tag
export const addTag = params => { return axios.post(`${base}/mdp/arc/tag/add`, params); };


export const getAllTag = params => { return axios.get(`${base}/mdp/arc/tag/getAllTag`, { params: params }); };

//新增一条arc_tag
export const deleteTagCategory= params => { return axios.post(`${base}/mdp/arc/tag/deleteTagCategory`, params); };

//将tags转换成树状结构
export const translateTagsToTree = data => { 
  var tags=JSON.parse(JSON.stringify(data))
    if(!tags||tags.length<=0){
        return []
    }
    var cates={};
    tags.forEach(k=>{
        if(k.categoryId && k.categoryName){
            cates[k.categoryId]={id:k.categoryId,name:k.categoryName,children:[],disabled:true} 
        } 
    }) 
    tags.forEach(k=>{
        k.name=k.tagName
        k.id=k.tagId
        k.disabled=false
        var cate=cates[k.categoryId]
        if(cate){
            cate.children.push(k)
        }
         
    })
    var datas=[]
    for(let key in cates){
        datas.push(cates[key])
    }
    return datas;
};

export const initTags = callback => {   
    var tagkey='forum-tags-list'
    var tagStr=localStorage.getItem(tagkey);
    if(!tagStr||tagStr=='null' || tagStr=='undefined'){
      getAllTag().then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){ 
          localStorage.setItem(tagkey,JSON.stringify(res.data.data))
          callback(res.data.data)
        }else{
          this.$message.error(tips.isOk)
        } 
      })
    }else{ 
        callback(JSON.parse(tagStr))
    }
  };