<template>    
    
						<div class="field-box"> 
							<el-avatar class="avater" icon="el-icon-top" :style="{backgroundColor:getMyColor(currentItem)}"></el-avatar> 
							<div class="msg">
								<span class="field-value">{{currentItem.name}} </span>
								<span class="field-label">{{label}}</span>
							</div>   
							<slot name="select" :dict="dict" :value="myVal">
                <dict-select :dict="dict" v-model="myVal" @change="onChange"></dict-select>
              </slot>
						</div> 
  </template>
  
  <script>  
  export default {
    name: 'dict-field',
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
        
      myVal(){
        this.$emit('input',this.myVal)
      }
    },
    props: {
       label:{
        type:String,
        default:''
       },
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
    },
    methods: { 
        
        getMyColor(item){
            if(this.getColor){
                return this.getColor(item.id)
            }
            if(item.color){
                return item.color
            }
            return ""
        },
        getMyIcon(item){
            if(this.getIcon){
                return this.getIcon(item.id)
            }
            if(item.icon){
                return item.icon
            }
            return "";
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
    align-items: center;
	cursor: pointer;
    .avater { 
		background-color:#FF9F73;
    }

    .msg {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        .title { 
			margin-top: 5px;
            font-size: 16px; 
        } 
		.field-label{  
			margin-top: -10px;
			 font-size: 14px;
			 color: #C0C4CC;
		}
        
    }
	.my-select{
		visibility:hidden;  
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
		visibility: visible !important;
} 
</style>
  