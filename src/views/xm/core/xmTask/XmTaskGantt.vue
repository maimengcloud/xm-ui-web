<template> 
  <section>
    <wl-gantt :data="tasks" 
            :usePreColumn="true"
            :checkSource="true"
            :useRealTime="true"
						:treeProps="{children: 'children', hasChildren: 'childrenCnt',pid:'parentTaskid',pre:'preTaskid'}"
						row-key="id"></wl-gantt>
  </section>
</template>

<script>
import Vue from 'vue'

import util from '@/common/js/util'; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
import {mapGetters} from 'vuex';   
import wlGantt from 'wl-gantt' 
import "wl-gantt/lib/wl-gantt.css" 
Vue.use(wlGantt)
 export default {
  props: ["tasks"],
  watch:{
    tasks(tasks){
     }
  },
  components: {
    
  },
  data() {
    return {
       
    };
  },
  methods: {
     
  },
  mounted() {
     
  },
  beforeDestroy() {
     
  }
};
</script>

<style scoped> 
</style>