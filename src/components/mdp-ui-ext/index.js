import MdpSelectUser from './mdp-select-user/Index' 
import MdpSelectDept from './mdp-select-dept/Index'  
import MdpDeptTree from './mdp-select-dept/DeptTree'  
import MdpSelectTag from './mdp-select-tag/Index' 
import MdpSelectImage from './mdp-select-image/Index' 
import MdpImage from './mdp-image/Index' 
import MdpSelectAtt from './mdp-select-att/Index' 
import MdpMetaItem from './mdp-meta-item/Index' 
import MdpMetaOption from './mdp-meta-option/Index' 
import MdpExtInfos from './mdp-ext-infos/Index' 
import MdpSelectCate from './mdp-select-cate/Index' 
import MdpCateTree from './mdp-cate-tree/Index' 
import MdpFormData from './mdp-expand/FormData' 
import MdpFormExpand from './mdp-expand/FormExpand' 
import MdpColumnExpand from './mdp-expand/ColumnExpand'  

const compLists = {
    install: function(Vue) {
        // 注册并获取组件，然后在main.js中引用，在Vue.use()就可以了
        Vue.component('MdpSelectUser', MdpSelectUser) 
        Vue.component('MdpSelectDept', MdpSelectDept) 
        Vue.component('MdpDeptTree', MdpDeptTree) 
        Vue.component('MdpSelectTag', MdpSelectTag) 
        Vue.component('MdpSelectImage', MdpSelectImage) 
        Vue.component('MdpImage', MdpImage) 
        Vue.component('MdpSelectAtt', MdpSelectAtt) 
        Vue.component('MdpMetaItem', MdpMetaItem) 
        Vue.component('MdpMetaOption', MdpMetaOption) 
        Vue.component('MdpExtInfos', MdpExtInfos) 
        Vue.component('MdpCateTree', MdpCateTree) 
        Vue.component('MdpSelectCate', MdpSelectCate) 
        Vue.component('MdpFormData', MdpFormData) 
        Vue.component('MdpFormExpand', MdpFormExpand) 
        Vue.component('MdpColumnExpand', MdpColumnExpand) 
    }
}
export default compLists