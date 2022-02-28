  
export default {

  reloadAllChildren: function(table,maps, parentId,parentIdName,loadChildren) {   
    var lazyTreeNodeMap=table.store.states.lazyTreeNodeMap
    if (maps.get(parentId)) {
      const { tree, treeNode, resolve } = maps.get(parentId)  
      lazyTreeNodeMap[parentId]=[]
      if (tree) { // 重新执行父节点加载子级操作
        loadChildren(tree, treeNode, resolve)
        if (tree[parentIdName]) { // 若存在爷爷结点，则执行爷爷节点加载子级操作，防止最后一个子节点被删除后父节点不显示删除按钮
          const a = maps.get(tree[parentIdName])
          if(a && a.tree){
            this.reloadAllChildren(table,maps,tree[parentIdName],parentIdName,loadChildren)
          } 
        }
      }
    } 
  },

  reloadChildrenByCount_:function(table,maps, parentId,parentIdName,loadChildren,toCount,currCount){
    var lazyTreeNodeMap=table.store.states.lazyTreeNodeMap
    if (maps.get(parentId)) {
      const { tree, treeNode, resolve } = maps.get(parentId)  
      lazyTreeNodeMap[parentId]=[]
      if (tree) { // 重新执行父节点加载子级操作
        loadChildren(tree, treeNode, resolve)
        if(toCount==currCount+1){
          return;
        }
        currCount=currCount+1;
        if (tree[parentIdName]) { // 若存在爷爷结点，则执行爷爷节点加载子级操作，防止最后一个子节点被删除后父节点不显示删除按钮
          const a = maps.get(tree[parentIdName])
          if(a && a.tree){
            this.reloadChildrenByCount_(table,maps,tree[parentIdName],parentIdName,loadChildren,toCount,currCount)
          } 
        }
      }
    } 
  },

  reloadChildren: function(table,maps, parentId,parentIdName,loadChildren,toCount) {  
    if(!toCount){
      this.reloadAllChildren(table,maps, parentId,parentIdName,loadChildren)
    }else{
      this.reloadParentByCount_(table,maps,parentId,parentIdName,loadChildren,toCount,0)
    }
     
  }, 
  reloadChildrenByOpType: function(table,maps, parentId,parentIdName,loadChildren,opType) {  
    var lazyTreeNodeMap=table.store.states.lazyTreeNodeMap
    if (maps.get(parentId)) {
      const { tree, treeNode, resolve } = maps.get(parentId)   
      if (tree) { // 重新执行父节点加载子级操作
        var oldDatas=lazyTreeNodeMap[parentId]
        lazyTreeNodeMap[parentId]=[]
        loadChildren(tree, treeNode, resolve,oldDatas,opType) 
      }
    } 
     
  }, 
  /**
   * 将类表数据转换为如下树状结构的数据
   * {
   *  xxx:'',
   *  xxx2:'',
   *  children:[
   *    xxx:'',
   *    xxx2:'',
   *  ]
   * }
   * @param {*} data2 将要转换的数据
   * @param {*} pidName 上级字段名称，如 pmenId
   * @param {*} idName 本条数据主键字段名称 如 menuId
   * @param {*} rowCallBack(data),如果需要对部分字段进行转换，可以传入这个回调函数。比如需要将 name:'陈天财' => label:'陈天财'
   * @returns 
   */
  translateDataToTree: function(data2,pidName,idName,rowCallBack) { 
    var data=JSON.parse(JSON.stringify(data2));
    let parents = data.filter(value =>{
      //如果我的上级为空，则我是最上级 
      if(value[pidName] == 'undefined' || value[pidName] == null  || value[pidName] == ''|| value[pidName] == '0'){
        return true;

        //如果我的上级不在列表中，我作为最上级
      }else if(data.some(i=>value[pidName]==i[idName])){
        return false;
      }else {
        return true
      }
     
    }) 
    let children = data.filter(value =>{
      if(data.some(i=>value[pidName]==i[idName])){
        return true;
      }else{
        return false;
      } 
    })  
    let translator = (parents, children) => {
      parents.forEach((parent) => {
        if(rowCallBack){
          rowCallBack(parent)
        }
        children.forEach((current, index) => {
          if (current[pidName] === parent[idName]) {
            let temp = JSON.parse(JSON.stringify(children))
            temp.splice(index, 1)
            translator([current], temp)
            typeof parent.children !== 'undefined'  && parent.children ? parent.children.push(current) : parent.children = [current]
            parent.childrenCnt=parent.children.length
          }
        }
        )
      }
      )
    }

    translator(parents, children)

    return parents
  },	

}
