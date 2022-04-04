<template>
  <el-date-picker :type="type" :style="style" v-model="dateRange" :value-format="valueFormat" :format="format" 
       unlink-panels
      :range-separator="rangeSepaSrator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
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
     
    style:{
        typeof:Object,
        default:{'display':'inline'}
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
        default:util.pickerOptions('datarange')
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
