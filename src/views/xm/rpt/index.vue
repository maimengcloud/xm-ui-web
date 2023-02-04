<template> 
<section>
  <el-row v-if="isRptCfg">
   <span style="float:right;"> <el-button @click="isRptCfg=false">取消配置</el-button><el-button @click="saveXmRptConfig" type="primary">保存配置</el-button></span>
  </el-row>
  <el-row>
     <comps-card ref="compsCard" :category="category" :xm-test-plan="xmTestPlan" :xm-product="xmProduct" :xm-project="xmProject" :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb" :show-params=" isRptCfg || !isRptShow" :is-rpt-cfg="isRptCfg"/>  
  </el-row>
</section>     
</template>

<script>
import NProgress from 'nprogress' // progress bar
 
import compsCard from './CompsCard'
import compsSet from './CompsSet'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
  props:['xmProduct','xmIteration','xmProject','xmTestCasedb','xmTestPlan','category','isRptShow'],
  components: {compsSet, compsCard}, 
  computed: {
    ...mapGetters([
      'userInfo'
    ]), 
  },

  watch: {
  },

  data() {
    return { 
      isRptCfg:false, 
    }
  },

  methods: {  
    saveXmRptConfig(){
      var callback=()=>{
        this.isRptCfg=false;
      }
      this.$refs['compsCard'].submitXmPrtConfig(callback)
    },
    showPrint(){
      this.$refs.compsCard.printVisible=true;
    }
  },


  mounted() {
    
  }
}
</script>

<style lang="scss" scoped> 
</style>
