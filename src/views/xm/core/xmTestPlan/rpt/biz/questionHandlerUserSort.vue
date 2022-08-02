<template> 
<section> 
  <el-row>
     <question-sort ref="questionSort" :xm-test-plan="xmTestPlan" :comp-cfg="compCfg"  :rpt-config-visible="rptConfigVisible" :group-by="'handler_userid'"  @delete="$emit('delete',$event)"/>  
  </el-row>
</section>     
</template>

<script> 
  
import questionSort from './questionSort'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
  props:['xmTestPlan','compCfg'],
  components: {questionSort}, 
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

  },


  mounted() {
    
  }
}
</script>

<style lang="scss" scoped> 
</style>
