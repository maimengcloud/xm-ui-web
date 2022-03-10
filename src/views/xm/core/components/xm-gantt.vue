<template> 
  <section>
    <wl-gantt :data="treeData" 
            :start-date="projectPhase.startTime"
            :end-date="projectPhase.endTime"
            :usePreColumn="true"
            :checkSource="true"
            :useRealTime="useRealTime"
						:treeProps="{children: 'children', hasChildren: 'hasChildren',pid:'parentPhaseId', pre: 'finishTaskCnt'}"
						:props="columns"
            row-key="id">
            <!-- <el-table-column prop="name" label="计划名称" min-width="160" > 
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column> -->
      </wl-gantt>
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
  props: {
    treeData: {
      type: Array,
      default() {
        return [];
      }
    },
    columns: {
      type: Object,
      default() {
        return {};
      }
    },
    projectPhase: {
      type: Object,
      default: () => {
        return {
          startTime: '2020-06-01',
          endTime: '2021-12-30'
        }
      }
    },
    useRealTime: {
      type: Boolean,
      default: true
    }
    // 'projectPhase', 'columns', 'useRealTime'
  },
  watch:{
    treeData(treeData){
     },
     projectPhase(val) {
       console.log('projectPhase--val==', val)
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
    console.log('gantt--this.treeData==', this.treeData);
    console.log('gantt--this.projectPhase==', this.projectPhase);
  },
  beforeDestroy() {
     
  }
};
</script>

<style scoped> 
</style>