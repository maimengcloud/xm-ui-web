<template>    
    <el-tag v-if="currentItem"  :type="currentItem.className" :closable="closable">{{currentItem.name}}</el-tag>
  </template>
  
  <script>  
  export default {
    name: 'dict-tag',
    components: {   },
    computed: {
       currentItem(){
        if(this.dict){
           return this.dict.find(k=>k.id==this.myVal)
        }else{
            return null;
        }
       }
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
    },
    props: {
        closable:{
            type:Boolean,
            default:false,
        },
      dict:{
        type:Array,
        default:function(){return []}
      },
      value: {
        
      },   
    },
    methods: { 
        
        initData(){
             this.myVal=this.value
            
        }, 
    },
    mounted(){
        this.initData();
    }
  }
  </script>
  
  <style rel="stylesheet/scss" lang="scss" scoped> 
  </style>
  