<template> 
<section> 
  <el-row>
     <question-sort ref="questionSort" :rpt-config-visible="rptConfigVisible" :group-by="'ask_userid'"/>  
  </el-row>
</section>     
</template>

<script> 
  
import questionSort from './questionSort'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
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
