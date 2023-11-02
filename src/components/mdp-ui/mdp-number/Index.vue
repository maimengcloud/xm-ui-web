<template>    
    <el-input-number v-if="showStyle=='origin'||showStyle==''||!showStyle" v-model="myVal" :disabled="disabled" :placeholder="placeholder" :min="min" :max="max" :controls="controls" :step="step"
    :step-strictly="stepStrictly"  :precision="precision" :controls-position="controlsPosition" @change="onChange"
    ></el-input-number>   
						<span v-else :class="showStyle=='x'?{'field-box-x':true}:{'field-box':true}" @click="showSelect">  
              <slot>
                <slot name="avater" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}" >
                     <el-avatar   v-if="showStyle=='x'" :class="{'field-avater':true,'dashed-circle':avaterCpd.isNull,disabled:disabled===true,enabled:disabled!==true}" :icon="avaterCpd.icon" :style="{backgroundColor:avaterCpd.color}">{{avaterCpd.innerText}}</el-avatar>  
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
                        <el-input-number v-model="myVal" :disabled="disabled" :placeholder="placeholder" :min="min" :max="max" :controls="controls" :step="step"
                        :step-strictly="stepStrictly"  :precision="precision" :controls-position="controlsPosition" @change="onChange"
                        ></el-input-number>
                      </slot>  
              </span>  
              
              </slot>
						</span> 
  </template>
  
  <script> 


import {MdpFieldMixin} from "../mixin/MdpFieldMixin.js" 
  export default {
    name: 'mdp-number-x',
    mixins:[MdpFieldMixin], 
    props:{
     /**
       * 最小值
       */
       min:{
        type:Number,
        default:-Infinity,
      },
      
      /**
       * 最大值
       */
       max:{
        type:Number,
        default:Infinity,
      },
      
      /**
       * 步长
       */
       step:{
        type:Number,
        default:1,
      },
      
      /**
       * 是否只能输入步长的倍数
       */
       stepStrictly	:{
        type:Boolean,
        default:false,
      },
      
      /**
       * 数值精度	
       */
       precision	:{
        type:Number,
        default:2,
      },
      
      /**
       * 是否使用控制按钮	
       */
       controls	:{
        type:Boolean,
        default:true,
      },
      
      /**
       * 控制按钮位置	
       */
       controlsPosition:{
        type:String,
        default:'right',
      }, 
    },
    methods:{ 
    }
  }
  </script>
  

<style lang="scss" scoped>  
    @import '../index.scss';
</style> 
  