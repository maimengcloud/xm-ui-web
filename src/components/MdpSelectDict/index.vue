<template>   
    <el-select class="my-select" ref="selectRef" v-model="myVal" @change="onChange" :clearable="clearable" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)">
        <slot>
            <el-option :style="styleObj" v-for="(item,index) in dict" :key="index" :value="item.id" :label="item.name"> 
             <slot :item="item" :dict="dict"> 
                    <span :style="{backgroundColor:getMyColor(item),color:'aliceblue'}" class="padding">  
                            <i  :class="getMyIcon(item)" ></i> 
                        {{item.name}}
                    </span>  
                    <i v-if="myVal==item.id" class="el-icon-check"></i> 
                    <i v-else>&nbsp;&nbsp;</i> 
             </slot>
            </el-option>
        </slot>
    </el-select> 
  </template>
  
  <script>  
  export default {
    name: 'mdp-select-dict',
    components: {   },
    computed: {
       
    },
    data(){
        return {
            myVal:'',
        }
    },
    watch:{ 
        value:{ 
          deep:true,
          handler(){
             this.initData();
          }
           
        }, 
        myVal(){
            this.$emit('input',this.myVal)
        }
    },
    props: {
        clearable:{
            type:Boolean,
            default:false,
        },
      dict:{
        type:Array,
        default:function(){return []}
      },
      value: {
        
      },  
      getIcon:{
         type:Function 
      },
      getColor:{
        type:Function 
      } ,
      styleObj:{
          type:Object,
          default:function(){return { marginTop:'5px' }}
      }, 
    },
    methods: { 
        
        initData(){
             this.myVal=this.value
            
        },
        
        getMyColor(item){
          if(item){
           
            if(this.getColor){
                return this.getColor(item.id)
            }
            if(item.color){
                return item.color
            }
            return ""
            
          }else{
            if(this.getColor){
                return this.getColor(this.myVal)
            }else{
              return ""
            }
          }
        },
        getMyIcon(item){
          if(item){ 
            if(this.getIcon){
                return this.getIcon(item.id)
            }
            if(item.icon){
                return item.icon
            }
            return "";
          }else{
            if(this.getIcon){
                return this.getIcon(this.myVal)
            }else{
              return ""
            }
          }
        },
        onChange(data){ 
            this.$emit('change',data)
        }
    },
    mounted(){
        this.initData();
    }
  }
  </script>
  
  <style rel="stylesheet/scss" lang="scss" scoped> 
  </style>
  