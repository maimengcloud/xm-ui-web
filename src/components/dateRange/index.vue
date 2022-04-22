<template>
  <el-date-picker :type="type" :style="styleObj" v-model="dateRange" :value-format="valueFormat" :format="format" 
       unlink-panels
      :range-separator="rangeSepaSrator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :default-range="[-30,0]"
      @change="onDateRangeChange"
      :picker-options="pickerOptions"
      ></el-date-picker>
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
      value(){
          this.initData();
      }
  },
  props: {
      
    value: {
      
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
        default:function(){return {'display':'inline'}}
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
      default: '至'
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
                  this.dateRange.push(util.formatDate.format(start,this.valueFormat))
                  this.dateRange.push(util.formatDate.format(end,this.valueFormat))
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
      }
  },
  mounted(){
      this.initData();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped> 
</style>
