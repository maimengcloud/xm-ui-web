<template>    
    
						<div class="field-box" @click="showSelect">  
							<el-avatar class="avater" :class="{'dashed-circle':avaterCpd.isNull}" :icon="avaterCpd.icon" :style="{backgroundColor:avaterCpd.color}">{{avaterCpd.innerText}}</el-avatar>  
              <div class="field-info" > 
                <slot name="info">
                  <span class="field-value">
                    <slot name="value" :value="myVal" :field="{label:label,color:color,getColor:getColor,icon:icon,getIcon:getIcon,disabled:disabled,clearable:clearable}">
                      <span  v-if="!avaterCpd.isNull">{{avaterCpd.innerText}}</span> 
                      <span v-else class="label-font-color">无</span>
                    </slot> 
                  </span>  
                    <span class="field-label" >
                      <slot name="label"> {{label}}</slot> 
                    </span>  
                    <span class="oper" ref="operRef">
                      <slot name="oper"   :value="myVal" :field="{label:label,color:color,getColor:getColor,icon:icon,getIcon:getIcon,disabled:disabled,clearable:clearable}">

                      </slot>
                    </span>
                </slot>
							</div>    
						</div> 
  </template>
  
  <script> 

  
import util from '@/common/js/util'
  export default {
    name: 'mdp-field-x',
    components: {   },
    computed: { 
      avaterCpd(){  
        var isEmpty=this.isEmpty(this.myVal)
        var obj={isNull:isEmpty,icon:'el-icon-full-screen',color:'#E4E7ED',innerText:''} 
          if(this.getColor||this.color){
            if(this.getColor){
               obj.color= this.getColor(this.myVal,currentItem,this.dict)
            }else{
              obj.color=this.color
            }
           
          }else{
            if(!isEmpty){ 
                 obj.color= util.getColor(this.myVal) 
            } 
          } 
          if(this.getIcon||this.icon){
            if(this.getIcon){
              obj.icon= this.getIcon(this.myVal,currentItem,this.dict)
            }else if(this.icon){
             obj.icon=this.icon
            }
          }else {
            if(!isEmpty){ 
                obj.icon='' 
            } 
          } 
          if(isEmpty){
            obj.innerText=''
          }else{
             
              obj.innerText=this.myVal
          }   
        return obj;
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
      
        disabled:{
            type:Boolean,
            default:false,
        },
       label:{
        type:String,
        default:''
       },
        clearable:{
            type:Boolean,
            default:false,
        }, 
      value: {
        
      },   
      color:{
        
         type:String,
         default:null, 
      },
      
      icon:{
         type:String,
         default:null, 
      },
      getIcon:{
         type:Function 
      },
      getColor:{
        type:Function 
      } ,
    },
    methods: { 
      showSelect(){
        if(this.disabled){
          return;
        }
        if(this.$refs["operRef"]){
          if(this.$refs["operRef"].onFieldClick){ 
            this.$refs["operRef"].onFieldClick();
          }
        }
      },  
        initData(){
             this.myVal=this.value
            
        }, 
        
        onChange(data){  
          this.$emit('change',data)
        },
        isEmpty(v) { 
          switch (typeof v) {
          case 'undefined':
              return true;
          case 'string':
              if(v.length == 0) return true;
              break; 
          case 'object':
              if (null === v || v.length === 0) return true;
              for (var i in v) {
                  return false;
              }
              return true;
          }
          return false;
        }
    },
    mounted(){
        this.initData();
    }
  }
  </script>
  

<style lang="scss" scoped>
 


.field-box {  
    display: flex;
    margin-right:5px;
    align-items: center;
	  cursor: pointer;
    height: 40px;
    line-height: 40px;
    .avater { 
		  background-color:#FF9F73;
    }

    .field-info {
      
        height: 40px;
        line-height: 40px;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        .field-value {  
            height: 20px;
            line-height: 20px;
            font-size: 0.75rem; 
        } 
        .field-label{   
          height: 20px;
          line-height: 20px;
            font-size: 0.75rem; 
          color: #C0C4CC;
        }
        
    }
	.oper{
    height: 20px;
    line-height: 20px;
    margin-left: 5px;
    margin-right:5px;
    max-width: 250px;
    display: none;
	} 
	 
}
 .field-box:hover .field-label{
  display: none;
}
 .field-box:hover .oper{
    height: 20px;
    margin-left: 5px; 
    display: inline;
}
.dashed-circle{ 
	width:40px;
	height:40px;
	border:2px dashed #000000;
	border-radius:40px/40px;
}
.field-box:hover .dashed-circle{
  
	border:2px dashed #409EFF;
}
</style>
  