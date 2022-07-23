<template>   
<div class="field-box">  
							<el-avatar class="avater" :icon="getMyIcon(dateRange)" :style="{backgroundColor:getMyColor(dateRange)}">{{getMyAvaterInfo(dateRange)}}</el-avatar> 
							
              <div class="field-info">
                <slot name="field-info" :value="dateRange">
								<span class="field-value">{{formatDateRange(dateRange) }} </span>
                <slot name="label">
								  <span class="field-label">{{label}}</span>
                  
                  <div v-if="disabled!==true" class="my-select" name="select" :value="dateRange">
                    
                  <el-date-picker :type="type" :style="styleObj"  v-model="dateRange" :value-format="valueFormat" :format="format" 
                      unlink-panels 
                      :range-separator="rangeSepaSrator"
                      :start-placeholder="startPlaceholder"
                      :end-placeholder="endPlaceholder"
                      :default-range="[-30,0]"
                      @change="onDateRangeChange"
                      :picker-options="pickerOptions"   
                      ></el-date-picker>  
                  </div>
                </slot>
                </slot>
							</div>   
						</div>  
</template>

<script> 
import util from '@/common/js/util'
export default {
  name: 'date-range',
  components: {   },
  computed: {
     
  },
  data(){
      return {
          dateRange:[],
      }
  },
  watch:{
      dateRange(){

      },
      value:{ 
        deep:true,
        handler(){
           this.initData();
        }
         
      }
  },
  props: {
      disabled:{
        type:Boolean,
        default:false,
      },
    value: {
      
    }, 
    label:{
      type:String,
      default:'起止时间',
    },
    type: {
      type: String,
      default: 'daterange'
    }, 
    startKey: {
      type: String,
      default: 'startTime'
    }, 
     
    styleObj:{
        typeof:Object,
        default:function(){return { maxWidth:'100%' }}
    },
    
    endKey: {
      type: String,
      default: 'endTime'
    }, 
    
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd HH:mm:ss'
    }, 
    
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    }, 
    startPlaceholder: {
      type: String,
      default: '开始日期'
    }, 
    
    endPlaceholder: {
      type: String,
      default: '结束日期'
    }, 
    rangeSepaSrator:{ 
      type: String,
      default: '~'
    },
    pickerOptions:{
        typeof:Object,
        default:function(){return util.getPickerOptions('datarange')}
    },
    autoDefault:{
        type:Boolean,
        default:true,
    },
    defaultRange:{
        type:Array,
        default:function(){
            return [-15,15]
        }
    }
  },
  methods: { 
      formatDateRange(dateRange){
        if(!dateRange||dateRange.length==0){
          return ""
        }else{
          if(dateRange.length==1){
            return util.formatDate(new Date(dateRange[0]),this.format)
          }else if(dateRange.length==2){
             return util.formatDate(new Date(dateRange[0]),this.format)+this.rangeSepaSrator+util.formatDate(new Date(dateRange[1]),this.format)
          }
        }
      },
      initData(){
          this.dateRange=[];
          if(this.value instanceof Array){
              this.dateRange=this.value
          }else if(this.value instanceof Object){
            if(this.value && this.value[this.startKey] && this.value[this.endKey]){
              this.dateRange=[this.value[this.startKey],this.value[this.endKey]]
            }
          }
          if( !this.dateRange || this.dateRange.length===0){
              if(this.autoDefault===true || (this.autoDefault!==false && this.defaultRange && this.defaultRange.length==2)){
                  var now=new Date();
                  var start=new Date(); 
                  var end=new Date(); 
                  start.setTime(now.getTime() + 3600 * 1000 * 24 * this.defaultRange[0]);
                  end.setTime(now.getTime() + 3600 * 1000 * 24 * this.defaultRange[1]);
                  this.dateRange.push(util.formatDate(start,this.valueFormat))
                  this.dateRange.push(util.formatDate(end,this.valueFormat))
                this.onDateRangeChange(this.dateRange);
              }
          }
          
      },
      onDateRangeChange(dates){ 
          if(this.value && this.value instanceof Object){
            if(dates && dates.length===2){
                this.value[this.startKey]=dates[0]
                this.value[this.endKey]=dates[1]
            }else if(dates && dates.length===1){
                this.value[this.startKey]=dates[0]
                this.value[this.endKey]=null
            }else if(dates && dates.length===0){
                this.value[this.startKey]=null
                this.value[this.endKey]=null
            }
            this.$emit('input',this.value)
          }else if(this.value instanceof Array){
               this.$emit('input',dates)
          }
          this.$emit('change',dates)
      },
      getMyAvaterInfo(item){
          if(!item||item.length==0){
            return ""
          }else{
            return item[0]
          }
        },
        getMyColor(item){
          if(this.getColor){
             return this.getColor(item)
          }
          if(item && item.length>0){ 
            return util.getColor(item[0]) 
          }else{ 
              return util.getColor("") 
          }
        },
        getMyIcon(item){
          if(this.getIcon){
             return this.getIcon(item)
          }else{
             return "el-icon-date";
          } 
        },
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

    margin-left: 5px;
    display: inline;
    height: 40px;
} 
 .field-box:hover .field-label{ 
    display: none;
} 
</style>
