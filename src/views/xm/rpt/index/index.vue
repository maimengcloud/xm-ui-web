<template> 
<section> 
  <el-row>
    <div class="padding">商业版功能，请联系客服！ 
    </div> 
    <div class="padding"> 
      欢迎扫描下方左侧微信二维码和我们进一步沟通！（备注 唛盟研发商业合作） 
    </div> 
    <div class="padding">  
      <img src="https://maimengcloud.com/img/5ff0a747a4a1f14cf6a5.png" alt="drawing" width="200"/>
    </div> 

  </el-row>
</section>     
</template>

<script> 
 
import compsCard from './CompsCard'
import compsSet from './CompsSet'
import { mapGetters } from 'vuex' 

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

<style lang="scss"> 
  @import './index.scss'; 
  @import './common.scss';
</style>