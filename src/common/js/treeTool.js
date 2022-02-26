 

export default {
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
            typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
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
