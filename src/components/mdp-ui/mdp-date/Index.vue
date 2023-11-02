<template>      
<el-date-picker  v-if="showStyle=='origin'||showStyle==''||!showStyle"  v-model="myVal" :value-format="valueFormat" :format="format"   
@change="onChange" :type="type"
:picker-options="pickerOptions"></el-date-picker>
<span v-else :class="showStyle=='x'?{'field-box-x':true}:{'field-box':true}" @click="showSelect">  
  <slot>
  <slot v-if="showStyle=='x'" name="avater" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}" >
        <el-avatar   :class="{'field-avater':true,'dashed-circle':avaterCpd.isNull,disabled:disabled===true,enabled:disabled!==true}" :icon="avaterCpd.icon" :style="{backgroundColor:avaterCpd.color}">{{avaterCpd.innerText}}</el-avatar>  
    </slot>
<span class="field-info"  :class="{disabled:disabled===true,enabled:disabled!==true}"> 
  <slot name="info">
    <span v-if="showStyle=='x'">
    <span class="field-value">
      <slot name="value" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
        <span  v-if="!avaterCpd.isNull">{{avaterCpd.innerText}}</span> 
        <span v-else class="label-font-color">无</span>
      </slot> 
    </span>  
      <span class="field-label" >
        <slot name="label"> {{label}}</slot> 
      </span>   
    </span>
      <span v-else>
        <slot name="value" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
          <span  v-if="!avaterCpd.isNull">{{avaterCpd.innerText}}</span> 
          <span v-else class="label-font-color">无</span>
        </slot> 
      </span>
  </slot>
</span>  
<span class="field-oper" ref="operRef"  :class="{disabled:disabled===true,enabled:disabled!==true}"> 
        <slot name="oper"   :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
          <el-date-picker    v-model="myVal" :value-format="valueFormat" :format="format"  :type="type"
          @change="onChange"
          :picker-options="pickerOptions"></el-date-picker>
        </slot>  
</span>  

</slot>
</span> 
  </template>
  
  <script>  
  
  import util  from '@/components/mdp-ui/js/util';//全局公共库
  
import {MdpFieldMixin} from "../mixin/MdpFieldMixin.js" 
  export default {
    name: 'mdp-date-x',
    mixins:[MdpFieldMixin],   
    props: { 
      type:{
        type:String,
        default:'date'
      },
      showAvater:{
            type:Boolean,
            default:true,
        },
      valueFormat: {
        type: String,
        default: 'yyyy-MM-dd HH:mm:ss'
      }, 
      
      format: {
        type: String,
        default: 'yyyy-MM-dd'
      },    
      pickerOptions:{
          type:Object,
          default:function(){return util.getPickerOptions('date')}
      },
    },
    methods: {     
    },
    mounted(){ 
    }
  }
  </script>
  

<style lang="scss" scoped>  
    @import '../index.scss';
</style> 
  