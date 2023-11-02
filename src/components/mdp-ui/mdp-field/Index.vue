<template>    
    
						<span :class="showStyle=='x'?{'field-box-x':true}:{'field-box':true}"  @click="showSelect">  
              <slot>
                <slot v-if="showStyle=='x'" name="avater" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}" >
                     <el-avatar  :class="{'field-avater':true,'dashed-circle':avaterCpd.isNull,disabled:disabled===true,enabled:disabled!==true}" :icon="avaterCpd.icon" :style="{backgroundColor:avaterCpd.color}">{{avaterCpd.innerText}}</el-avatar>  
                 </slot>
              <span class="field-info"  :class="{disabled:disabled===true,enabled:disabled!==true}"> 
                <slot name="info" v-if="showStyle=='x'" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
                  <span class="field-value">
                    <slot name="value" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
                      <span  v-if="!avaterCpd.isNull">{{avaterCpd.innerText}}</span> 
                      <span v-else class="label-font-color">无</span>
                    </slot> 
                  </span>  
                    <span class="field-label" >
                      <slot name="label"> {{label}}</slot> 
                    </span>   
                </slot>
                <slot name="info" v-else :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
                    <slot name="value" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
                      <span  v-if="!avaterCpd.isNull">{{avaterCpd.innerText}}</span> 
                      <span v-else class="label-font-color">无</span>
                    </slot> 
                </slot>
							</span>  
              <span class="field-oper" ref="operRef"  :class="{disabled:disabled===true,enabled:disabled!==true}"> 
                      <slot name="oper"   :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
                        <el-input v-model="myVal" :placeholder="placeholder" @change="onChange"></el-input>
                      </slot>  
              </span>  
              
              </slot>
						</span> 
  </template>
  
  <script> 


import {MdpFieldMixin} from "../mixin/MdpFieldMixin.js" 
  export default {
    name: 'mdp-field-x',
    mixins:[MdpFieldMixin], 
  }
  </script>
  

<style lang="scss" scoped>  
    @import '../index.scss';
</style> 
  