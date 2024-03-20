<template> 
  <section>
    <wl-gantt :data="treeData" 
            :usePreColumn="true"
            :dateType="'monthAndDay'"
            :startDate="projectDateRange.startTime"
            :endDate="projectDateRange.endTime"
            :autoGanttDateType="true"
            :checkSource="true"
            :useRealTime="useRealTime" 
						:treeProps="{children: 'children', hasChildren: 'hasChildren',pid:'parentTaskid', pre: 'preTaskid',startDate:'startTime',endDate:'endTime',realStartDate:'actStartTime',realEndDate:'actEndTime'}"
            @preChange="preChange"
            @timeChange="timeChange"
            @nameChange="nameChange"
            @taskAdd="taskAdd"
            @taskRemove="taskRemove"
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
import { 
getTask,
delXmTask,
batchDelXmTask,
batchImportTaskFromTemplate,
batchChangeParentTask,
editXmTaskSomeFields,
calcProgress,
calcProjectProgress,
} from "@/api/xm/core/xmTask";
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
    projectDateRange: {
      type: Object,
      default: () => {
        var date=new Date();
        return {
          startTime: date.getFullYear()+'-01-01',
          endTime: date.getFullYear()+'-12-30'
        }
      }
    },
    useRealTime: {
      type: Boolean,
      default: false
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
    taskRemove(row){

    },
    taskAdd(row){

    },
    preChange(row){

    },
    timeChange(row){
      debugger;

    },
    nameChange(row){
      debugger;
    }
     
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