import MdpField from './mdp-field/Index'
import MdpInput from './mdp-input/Index' 
import MdpNumber from './mdp-Number/Index' 
import MdpDate from './mdp-date/Index'
import MdpDateRange from './mdp-date-range/Index' 
import MdpSelect from './mdp-select/Index' 
import MdpSelectTable from './mdp-select-table/Index'
import MdpDialog from './mdp-dialog/Index'
import MdpTable from './mdp-table/Index'
import MdpTableConfigs from './mdp-table-configs/Index'
import MdpHiQuery from './mdp-hi-query/Index' 
// 表格高度设定指令
import adaptive from './directive'

import './mdp.scss' // global css


const compLists = {
    install: function(Vue) {
        //注册v-adaptive指令，控制表格离底部高度
        Vue.use(adaptive)

        // 注册并获取组件，然后在main.js中引用，在Vue.use()就可以了
        Vue.component('MdpField', MdpField)
        Vue.component('MdpInput', MdpInput)
        Vue.component('MdpNumber', MdpNumber)
        Vue.component('MdpDate', MdpDate)
        Vue.component('MdpDateRange', MdpDateRange)
        Vue.component('MdpSelect', MdpSelect)
        Vue.component('MdpSelectTable', MdpSelectTable)
        Vue.component('MdpDialog', MdpDialog)
        Vue.component('MdpTable', MdpTable)
        Vue.component('MdpTableConfigs', MdpTableConfigs)
        Vue.component('MdpHiQuery', MdpHiQuery)
    }
}
export default compLists