<template> 
<section>
  <el-row v-if="rptConfigVisible">
   <span style="float:right;"> <el-button @click="rptConfigVisible=false">取消配置</el-button><el-button @click="rptConfigVisible=true" type="primary">保存配置</el-button></span>
  </el-row>
  <el-row>
     <comps-card ref="compsCard" :rpt-config-visible="rptConfigVisible"/>  
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

  },


  mounted() {
    
  }
}
</script>

<style lang="scss" scoped> 
</style>
