<template>    
    
						<div class="field-box">  
							<el-avatar class="avater" :class="{'dashed-circle':avaterCpd.isNull}"  :icon="avaterCpd.icon" :style="{backgroundColor:avaterCpd.color}">{{avaterCpd.innerText}}</el-avatar> 
							
              <div class="field-info">
                <slot name="field-info" :value="dateRange">
								<span class="field-value" v-if="!avaterCpd.isNull">{{avaterCpd.innerText}} </span> 
								<span class="field-value" v-else><span class="label-font-color">无</span></span> 
                <slot name="label">
								  <span class="field-label">{{label}}</span> 
                  <div v-if="disabled!==true" class="my-select" name="select" :value="myVal">
                    <el-date-picker    v-model="myVal" :value-format="valueFormat" :format="format"   
                    @change="onChange"
                    :picker-options="pickerOptions"></el-date-picker>
                  </div>
                </slot>
                </slot>
							</div>   
						</div> 
  </template>
  
  <script>  
  
  import util  from '@/common/js/util';//全局公共库
  export default {
    name: 'date-field',
    components: {   },
    computed: { 
      
      avaterCpd(){ 
         
        var isEmpty=!this.myVal
        var date=isEmpty?"":this.formatDate(new Date(this.myVal),this.format)
        var obj={isNull:isEmpty,icon:'el-icon-date',color:'#E4E7ED',innerText:date} 
          if(this.getColor||this.color){
            if(this.getColor){
               obj.color= this.getColor(this.myVal)
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
              obj.icon= this.getIcon(this.myVal )
            }else if(this.icon){
             obj.icon=this.icon
            }
          } 
          if(isEmpty){
            obj.innerText=''
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
      
      getIcon:{
         type:Function 
      },
      getColor:{
        type:Function 
      },
       
    styleObj:{
        type:Object,
        default:function(){return { maxWidth:'100%' }}
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
      formatDate:util.formatDate,
      getPickerOptions:util.getPickerOptions,
        getMyAvaterInfo(item){
          if(!item){
            return ""
          }else{
            return item
          }
        },
        getMyColor(item){
          if(this.getColor){
             return this.getColor(item)
          }else{
            return util.getColor(item)
          } 
        },
        getMyIcon(item){
           if(this.getIcon){
                return this.getIcon(item)
            }else{
              return "el-icon-date"
            }
        },
        initData(){
             this.myVal=this.value
            
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
	.my-select{
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
 .field-box:hover .my-select{
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
  