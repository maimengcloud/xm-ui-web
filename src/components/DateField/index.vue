<template>    
    
						<div class="field-box">  
							<el-avatar class="avater" :icon="getMyIcon(myVal)" :style="{backgroundColor:getMyColor(myVal)}">{{getMyAvaterInfo(myVal)}}</el-avatar> 
							
              <div class="field-info">
                <slot name="field-info" :value="myVal">
								<span class="field-value">{{myVal?formatDate( new Date(myVal),format):'' }} </span>
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
    .avater { 
		  background-color:#FF9F73;
    }

    .field-info {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        .field-value {  
            font-size: 16px;  
        } 
        .field-label{   
          height: 40px;
          font-size: 14px;
          color: #C0C4CC;
        }
        
    }
	.my-select{
    margin-left: 5px;
    margin-right:5px;
    max-width: 120px;
		display: none;  
	}
	.btn{
		margin-top: 0px;
		visibility:hidden; 
	} 
	 
}
 .field-box:hover .btn{
		visibility: visible !important;
}
 .field-box:hover .my-select{
  
    height: 40px;
    margin-left: 5px;
    display: inline;
} 
 .field-box:hover .field-label{ 
    display: none;
} 
</style>
  