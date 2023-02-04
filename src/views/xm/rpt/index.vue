<template> 
<section> 
  <el-row>
     <comps-card ref="compsCard" :category="category" :xm-test-plan="xmTestPlan" :xm-product="xmProduct" :xm-project="xmProject" :xm-iteration="xmIteration" :xm-test-casedb="xmTestCasedb"/>  
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
    }
  },

  methods: {  
    saveXmRptConfig(){
      var callback=()=>{
        this.isRptCfg=false;
      }
      this.$refs['compsCard'].submitXmPrtConfig(callback)
    },
    showExportToolBar(){
      this.$refs.compsCard.exportToolBarVisible=true;
    }
  },


  mounted() {
    
  }
}
</script>

<style lang="scss" scoped> 
</style>
