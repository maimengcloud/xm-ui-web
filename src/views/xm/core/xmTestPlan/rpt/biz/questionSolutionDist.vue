<template> 
<section> 
  <el-row>
     <question-att-dist :ref="compCfg.id" :xm-test-plan="xmTestPlan" :comp-cfg="compCfg" :rpt-config-visible="rptConfigVisible" :group-by="'solution'"  @delete="$emit('delete',$event)"/>  
  </el-row>
</section>     
</template>

<script> 
  
import questionAttDist from './questionAttDist'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
  props:['xmTestPlan','compCfg'],
  components: {questionAttDist}, 
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

    sizeAutoChange(){
				this.refs[this.compCfg.id].sizeAutoChange()
			}
  },


  mounted() {
    
  }
}
</script>

<style lang="scss" scoped> 
</style>
