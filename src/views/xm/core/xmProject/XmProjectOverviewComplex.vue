<template>
  <section class="page-container  padding-left padding-right">
      <el-menu mode="horizontal" :default-active="showPanelName"  @select="onMenuToolBarSelect">
        <el-menu-item index="overview">
          <span slot="title">项目概览</span>
        </el-menu-item>
        <el-menu-item index="detail">
          <span slot="title">项目详情</span>
        </el-menu-item> 
        <el-menu-item index="productProjectLink"> 
          <span slot="title">关联产品</span>
        </el-menu-item>      
        <el-menu-item index="projectCalc"> 
          <span slot="title">执行项目数据统计计划</span>
        </el-menu-item> 

        <el-menu-item index="currFlow"> 
          <span slot="title">当前审批流</span>
        </el-menu-item> 

        <el-menu-item index="hisFlow"> 
          <span slot="title">历史审批流</span>
        </el-menu-item>    
      </el-menu>
       <xm-project-overview  v-if="showPanelName=='overview'" :sel-project="selProject"></xm-project-overview>
        <xm-project-detail  v-if="showPanelName=='detail'" :sel-project="selProject" @submit="afterEditSubmit" @edit-fields="onEditFields" ref="detail"></xm-project-detail> 
        <xm-product-project-link-mng v-if="showPanelName=='productProjectLink'" :sel-project="selProject"></xm-product-project-link-mng>
        <xm-iteration-link-for-project v-if="showPanelName=='iterationProjectLink'" :sel-project="selProject"></xm-iteration-link-for-project>
        
        <div v-if="showPanelName=='projectCalc'" class="padding">
          <el-row>
            <el-button type="primary" @click="loadTasksToXmProjectState" v-loading="load.calcProject">计算项目预算数据</el-button>
            <br>
              <font color="blue" style="font-size:10px;">将从项目任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到项目统计表</font>
          </el-row>
          <el-row>
            <el-button  type="primary" @click="loadTasksSettleToXmProjectState"  v-loading="load.calcSettle">计算项目结算数据</el-button>
            <br>
              <font color="blue"  style="font-size:10px;">将从项目任务汇总结算数据项目统计表</font>
          </el-row>
        </div>
        
        <task-mng v-if="showPanelName === 'currFlow' " ref="currFlow" :biz-parent-pkid="selProject.id" @submit="afterFlowSubmit"> </task-mng>  
        <procinst-mng v-if="showPanelName === 'hisFlow' " ref="hisFlow" isAll="true" :biz-parent-pkid="selProject.id"></procinst-mng> 
  </section>
</template>

<script>
import util from "@/common/js/util"; // 全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapGetters } from "vuex"; 
import XmProjectOverview from './XmProjectOverview.vue';
import XmProjectDetail from './XmProjectDetail.vue';
import XmProductProjectLinkMng from '../xmProductProjectLink/XmProductProjectLinkMng.vue'; 

import TaskMng from '@/views/mdp/workflow/ru/task/TaskMng'; 
import ProcinstMng from '@/views//mdp/workflow/hi/procinst/ProcinstMng';
import {  loadTasksToXmProjectState , loadTasksSettleToXmProjectState} from '@/api/xm/core/xmProjectState';
import { listXmProject} from '@/api/xm/core/xmProject'; 


export default {
  components: { XmProjectOverview, XmProjectDetail, XmProductProjectLinkMng ,TaskMng,ProcinstMng},
  computed: {
    ...mapGetters(["userInfo"]),
  },

  props:['selProject'],
  watch:{
  },
  data() {
    return {
      showPanelName:'overview',
      
      load:{calcProject:false,calcSettle:false}
    };
  },

  methods:{
    afterEditSubmit(project){
      this.$emit('submit',project)
    },
    onMenuToolBarSelect(menuIndex){
      this.showPanelName=menuIndex;
    },
    
    loadTasksToXmProjectState(){
        var row=this.selProject;
        var params={projectId:row.id}
      loadTasksToXmProjectState(params).then((res) => {
          this.load.calcProject=false;
          var tips=res.data.tips; 
          this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
        }).catch( err  => this.load.calcProject=false ); 
    },
    loadTasksSettleToXmProjectState(){
        var row=this.selProject;
        var params={projectId:row.id}
      loadTasksSettleToXmProjectState(params).then((res) => {
          this.load.calcProject=false;
          var tips=res.data.tips; 
          this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
        }).catch( err  => this.load.calcProject=false ); 
    },
    
    afterFlowSubmit(){
      
      listXmProject({id:this.selProject.id}).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          var selProject=res.data.data[0]
          this.afterEditSubmit(selProject)
        }
      })
    },
    
			onEditFields(row){ 
				Object.assign(this.selProject,row)
				this.$emit("edit-fields",row);
			}
  },

  mounted() {
    this.$nextTick(() => {
    });
  },

};
</script>

<style scoped lang="scss">

</style>
