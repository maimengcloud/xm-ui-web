<template> 

     <el-date-picker v-if="showStyle=='origin'||showStyle==''||!showStyle" :type="type" :style="styleObj"  v-model="dateRange" :value-format="valueFormat" :format="format" 
      unlink-panels 
      :range-separator="rangeSepaSrator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :default-range="[-30,0]"
      @change="onDateRangeChange"
      :picker-options="pickerOptions"   
      ></el-date-picker>    
   <span v-else :class="showStyle=='x'?{'field-box-x':true}:{'field-box':true}" >  
    <slot class="field-avater" name="avater">
      <el-avatar :size="size"  :class="{'dashed-circle':avaterCpd.isNull,disabled:disabled===true,enabled:disabled!==true}"  :icon="avaterCpd.icon" :style="{backgroundColor:avaterCpd.color}">{{avaterCpd.innerText}}</el-avatar> 
    </slot> 
    <span class="field-info"  :class="{disabled:disabled===true,enabled:disabled!==true}">
      <slot name="info" :value="dateRange" > 
        <span v-if="showStyle=='x'">
          <div class="field-value">
            <slot name="value"> 
              <div  v-if="!avaterCpd.isNull">{{avaterCpd.innerText}}</div> 
              <div v-else class="label-font-color">无</div>
            </slot> 
          </div> 
          <div class="field-label">
              <slot name="label">{{label||'请选择日期'}}</slot>
          </div>  
        </span>
        <span v-else class="field-value">
          <slot name="value" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
            <div  v-if="!avaterCpd.isNull">{{avaterCpd.innerText}}</div> 
            <div v-else class="label-font-color">无</div>
          </slot> 
        </span> 
      </slot>  
    </span>   
    <span v-if="disabled!==true" class="field-oper"  :class="{disabled:disabled===true,enabled:disabled!==true}">
          
        <el-date-picker :type="type" :style="styleObj"  v-model="dateRange" :value-format="valueFormat" :format="format" 
            unlink-panels 
            :range-separator="rangeSepaSrator"
            :start-placeholder="startPlaceholder"
            :end-placeholder="endPlaceholder"
            :default-range="[-30,0]"
            @change="onDateRangeChange"
            :picker-options="pickerOptions"   
            ></el-date-picker>  
    </span>
  </span>  
</template>

<script> 
import util from '../js/util.js' 
import {MdpFieldMixin} from "../mixin/MdpFieldMixin.js" 
export default {
  name: 'mdp-date-range-x',  
  mixins:[MdpFieldMixin],   
  computed: {
        avaterCpd(){  
            var isEmpty=!this.dateRange||this.dateRange.length==0
            var obj={isNull:isEmpty,icon:this.icon?this.icon:'el-icon-full-screen',color:this.color?this.color:'#E4E7ED',innerText:''} 
            if(isEmpty){
                return obj;
            }else{
                if(this.color){
                    obj.color=this.color
                }else{
                    obj.color= util.getColorById(this.myVal) 
                }

                if(this.icon){
                    obj.icon=this.icon
                }else{
                    obj.icon=''
                } 
                obj.innerText=this.dateRange.join(this.rangeSepaSrator)
            } 
            return obj;
        }, 
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
    
      showAvater:{
          type:Boolean,
          default:true,
      },
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
        default:false,
    },
    defaultRange:{
        type:Array,
        default:function(){
            return [-15,15]
        }
    },
    icon:{
      type:String,
      default:'el-icon-date'
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
            }else{
              this.value[this.startKey]=null
              this.value[this.endKey]=null
            }
            this.$emit('input',this.value)
          }else if(this.value instanceof Array){
               this.$emit('input',dates)
          }
          this.$emit('change',dates)
      }, 
  },
  mounted(){
      this.initData();
  }
}
</script>

 
<style lang="scss" scoped>  
    @import '../index.scss';
</style> 
