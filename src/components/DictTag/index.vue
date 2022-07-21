<template>    
    <div class="item-box">
        <div class="item-info">
            <el-tag v-if="currentItem"  :type="currentItem.className" :closable="closable" :effect="effect">{{currentItem.name}}</el-tag>
        </div>
        <div class="item-select">
            <dict-select :dict="dict" v-model="myVal" @change="onChange"></dict-select>
        </div>
    </div>
    
  </template>
  
  <script> 
  export default {
    name: 'dict-tag',
    components: {  },
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
        effect:{
            type:String,
            default:'light'//dark / light / plain	
        },
      dict:{
        type:Array,
        default:function(){return []}
      },
      value: {
        
      },   
      
        
    },
    methods: { 
        
        onChange(data){  
          this.$emit('change',data)
        },
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
    .item-box{
        display: flex;
        cursor: pointer;
        .item-info{
            display:inherit; 
            height: 60px;
        }
        .item-select{
            display: none;
        }  
    }
    .item-box:hover .item-info{
       display: none;
    }
    .item-box:hover .item-select{
        display:inherit;
    }
  </style>
  