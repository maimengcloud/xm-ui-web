<template> 
<section class="padding"> 
  <el-row>
     <comps-card v-if="xmRptData && xmRptData.id" ref="compsCard" :xm-rpt-data="xmRptData" :show-params="false"/>  
  </el-row>
</section>     
</template>

<script> 
 
import compsCard from './CompsCardHisDetail'
import compsSet from './CompsSet'
import {  listXmRptData  } from '@/api/xm/core/xmRptData';

import { mapGetters } from 'vuex' 

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
      xmRptData:null,
    }
  },

  methods: {   
    getXmRptData(){
      var params={id:this.$route.query.id}
      listXmRptData(params).then(res=>{
        this.xmRptData=res.data.data[0]
      })
    }
  },


  mounted() {
    this.getXmRptData();
  }
}
</script>

<style lang="scss"> 
  @import './index.scss'; 
  @import './common.scss';
</style>
