// 设置表格高度
const doResize = async (el, binding, vnode) => {

  // 获取表格Dom对象 
  if(vnode.componentInstance){ 
    const {
      componentInstance: $table
    } = await vnode
  
    // 获取调用传递过来的数据 
    const {
      value
    } = binding
  
    if (!$table.height) {
      throw new Error(`el-$table must set the height. Such as height='100px'`)
    }
    // 获取距底部距离（用于展示页码等信息）
    const bottomOffset = (value && value.bottomOffset) || 50
  
    // 计算列表高度并设置
    const height = window.innerHeight - el.getBoundingClientRect().top - bottomOffset
    $table.layout.setHeight(height)
    $table.doLayout()
  }else{ 
    //要起作用，请先给容器添加一个默认高度，否则不起作用
    // 获取调用传递过来的数据 
    const {
      value
    } = binding
    // 获取距底部距离（用于展示页码等信息）
    const bottomOffset = (value && value.bottomOffset) || 50
    
    // 计算列表高度并设置
    const height = window.innerHeight - el.getBoundingClientRect().top - bottomOffset 
    el.style.height = height+'px'; // 更新元素高度
  }
  
}

export default {
  // 初始化设置
  bind(el, binding, vnode) { 
    // 设置resize监听方法
    el.resizeListener = async () => {
      await doResize(el, binding, vnode)
    }
    // 绑定监听方法到addResizeListener
    // addResizeListener(window.document.body, el.resizeListener)
    window.addEventListener('resize', el.resizeListener)
  },
  update(el, binding, vnode) {
    debugger;
    doResize(el, binding, vnode)
  },
  // 绑定默认高度
  async inserted(el, binding, vnode) {
    await doResize(el, binding, vnode)
  },
  // 销毁时设置
  unbind(el) {
    // 移除resize监听
    // removeResizeListener(el, el.resizeListener)
    window.removeEventListener('resize', el.resizeListener)
  }
}


