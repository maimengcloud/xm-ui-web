<template>    
    <div :class="{'field-box':true,'small':size=='small','medium':size=='medium'}">
        <div class="field-info" :class="{disabled:disabled===true,enabled:disabled!==true}">
           <div v-if="(currentItem&&currentItem.id)">
            <el-tag     :type="currentItem.className" :closable="closable" :color="currentItem.color" :effect="effect">{{currentItem.name}}</el-tag></div> 
           <div v-else> {{currentItem.name}} </div> 
        </div>
        <div v-if="disabled!==true" class="field-oper" :class="{disabled:disabled===true,enabled:disabled!==true}">
            <mdp-select-dict :size="size" :dict="dict" v-model="myVal" @change="onChange" :clearable="closable" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)"></mdp-select-dict>
        </div>
    </div>
    
  </template>
  
  <script> 
  export default {
    name: 'mdp-select-dict-tag',
    components: {  },
    computed: {
       currentItem(){
        if(this.myVal===''||this.myVal===null){
            return {id:'',name:'无',className:'info'};
        }
        if(this.dict){
           var item= this.dict.find(k=>k.id==this.myVal)
           if(item){
            return item
           }else{
            return {id:this.myVal,name:this.myVal,className:'info'}
           }
        }else{
            return {id:this.myVal,name:this.myVal,className:'info'};
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
        myVal(){
            this.$emit('input',this.myVal)
        }
    },
    props: {
        size:{
            type:String,
            default:'small',// medium/small/mini	 
        },
        disabled:{
            type:Boolean,
            default:false,
        },
        closable:{
            type:Boolean,
            default:false,
        },
        effect:{
            type:String,
            default:'dark'//dark / light / plain	
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
<style lang="scss" scoped>  
    @import '../Mdp/index.scss';
</style> 
  