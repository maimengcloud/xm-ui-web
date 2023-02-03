<template> 
<section>
  <el-row v-if="rptConfigVisible">
   <span style="float:right;"> <el-button @click="rptConfigVisible=false">取消配置</el-button><el-button @click="saveXmRptConfig" type="primary">保存配置</el-button></span>
  </el-row>
  <el-row>
     <comps-card ref="compsCard" :category="category" :xm-test-plan="xmTestPlan" :xm-product="xmProduct" :xm-project="xmProject" :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb" :show-params="true" :show-tool-bar="true" :is-rpt-cfg="rptConfigVisible"/>  
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
  props:['xmProduct','xmIteration','xmProject','xmTestCasedb','xmTestPlan','category'],
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
      rptConfigVisible:false,
    }
  },

  methods: {  
    saveXmRptConfig(){
      var callback=()=>{
        this.rptConfigVisible=false;
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
