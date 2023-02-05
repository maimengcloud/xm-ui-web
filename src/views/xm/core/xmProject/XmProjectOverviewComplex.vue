<template>
  <section>
    <el-row>
      <el-col :span="4" class="padding" >
        <div class="border">
          <el-row class="padding">
          <h4 >常用功能快捷导航</h4>
        </el-row> 
          <el-row 
            ref="pageBody"
            class="padding" :style="{height:maxTableHeight+'px',overflowY:'auto'}">
        <el-steps :active="calcProjectStatusStep" finish-status="success" direction="vertical">
          <el-step
            v-for="(i, index) in dicts['projectStatus']"
            :title="i.name"
            :key="index"
          >
            <el-row slot="description">
               <el-row v-if="i.id=='0'"><!--初始-->
			   		<span v-if="projectInfo.status==i.id">
						<el-button class="step-btn" type="warning"    plain @click="createProduct()">创建产品</el-button>
						<el-button class="step-btn" type="warning"    plain @click="linkProduct()">关联产品</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectEnv')">环境清单</el-button>
						<el-button class="step-btn" type="danger" icon="el-icon-d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','1')">进入售前</el-button>
					</span>
					<span v-if="projectInfo.status!=i.id"> 
						<el-button class="step-btn" type="warning"    plain @click="linkProduct()">关联产品</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectEnv')">环境清单</el-button>
					</span> 
			   </el-row>
               <el-row v-else-if="i.id=='1'"><!--售前-->
			   		<span v-if="projectInfo.status==i.id">
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectMenu')">需求管理</el-button>
						<el-button class="step-btn" type="danger" icon="el-icon-d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','2')">设为立项中</el-button>
					</span>
					<span v-if="projectInfo.status!=i.id">
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectMenu')">需求管理</el-button> 
					</span> 
			   </el-row>
               <el-row v-else-if="i.id=='2'"><!--立项中-->
			   		<span v-if="projectInfo.status==i.id">
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectContract')">签订合同</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectGroup')">创建团队</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectPlan')">创建计划</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectBudget')">预算清单</el-button>
						<el-button class="step-btn" type="warning"    plain @click="showProjectGaiSuan()">项目估算</el-button>
						<el-button class="step-btn" type="warning"    plain @click="showProjectShouYi()">项目收益</el-button>
						<el-button class="step-btn" type="danger" icon="el-icon-d-caret"     plain @click="editXmProjectSomeFields(projectInfo,'status','3')">设为立项中</el-button>
					</span>
					<span v-if="projectInfo.status!=i.id">
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectContract')">合同管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectGroup')">团队管理</el-button>  
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectPlan')">计划管理</el-button> 
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectBudget')">预算管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="showProjectGaiSuan()">项目估算</el-button>
						<el-button class="step-btn" type="warning"    plain @click="showProjectShouYi()">项目收益</el-button>
					</span> 
			   </el-row>
               <el-row v-else-if="i.id=='3'"><!--实施中-->
			   		<span v-if="projectInfo.status==i.id">
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectIteration')">迭代管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectPlan')">任务管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectQuestion')">缺陷管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectWorkloadDay')">每日工时</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectWorkloadMonth')">每月工时</el-button> 
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectCost')">费用管理</el-button> 
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectRpt')">效能分析</el-button> 
						<el-button class="step-btn" type="danger" icon="el-icon-d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','4')">暂停项目</el-button>
						<el-button class="step-btn" type="warning"    plain @click="projectChangeRequire()">变更申请</el-button>
						<el-button class="step-btn" type="danger" icon="el-icon-d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','5')">设为结项中</el-button>
					</span>
					<span v-if="projectInfo.status!=i.id">
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectIteration')">迭代管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectPlan')">任务管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectQuestion')">缺陷管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectWorkloadDay')">每日工时</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectWorkloadMonth')">每月工时</el-button> 
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectCost')">费用管理</el-button> 
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectRpt')">效能分析</el-button> 
						<el-button v-if="projectInfo.status<i.id" class="step-btn"  type="danger" icon="el-icon-d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','5')">结项申请</el-button>
						<el-button class="step-btn" type="warning"    plain @click="showDetail()">变更申请</el-button>
					</span> 
			   </el-row>
               <el-row v-else-if="i.id=='4'"><!--暂停中-->
			   		<span v-if="projectInfo.status==i.id"> 
						<el-button class="step-btn"  type="danger" icon="el-icon-d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','3')">重新激活</el-button>
					</span>  
			   </el-row>
        <el-row v-else-if="i.id=='5'"><!--结项中-->
			   		<span v-if="projectInfo.status==i.id"> 
              <el-button class="step-btn" type="warning"    plain @click="showDetail()">结项申请</el-button>
              <el-button class="step-btn" type="warning"    plain @click="showCurrFlow()">结项审批</el-button>
            </span>
            <span v-if="projectInfo.status!=i.id">
              <el-button class="step-btn" type="warning"    plain @click="showHisFlow()">结项审批</el-button>  
            </span>  
			   </el-row>
               <el-row v-else-if="i.id=='6'"><!--已结项--> 
			   		<span v-if="projectInfo.status==i.id"> 
						<el-button class="step-btn"  type="danger" icon="el-icon-d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','7')">转入售后</el-button>
					</span> 
					<span v-if="projectInfo.status!=i.id">
					</span>  
			   </el-row>
               <el-row v-else-if="i.id=='7'"><!--售后-->
					<span v-if="projectInfo.status==i.id"> 
						<el-button class="step-btn"  type="danger" icon="el-icon-d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','8')">设为已完成</el-button>
					</span> 
			   </el-row>
               <el-row v-else-if="i.id=='8'"><!--已完成-->
					<span v-if="projectInfo.status==i.id"> 
						<el-button class="step-btn"  type="danger" icon="el-icon-d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','9')">关闭项目</el-button>
					</span> 
					
			   </el-row>
               <el-row v-else-if="i.id=='9'"><!--已关闭-->
					
			   </el-row> 
            </el-row>
          </el-step>
        </el-steps>
      </el-row>
      </div>
      </el-col>
      <el-col :span="20"  class="padding-left padding-right">
        <el-tabs :value="showPanelName" @tab-click="tabClick">
          <el-tab-pane
            label="项目概览"
            name="overview"
            v-if="projectInfo && projectInfo.id"
          > 
          <xm-project-overview  v-if="showPanelName=='overview'" :sel-project="projectInfo"></xm-project-overview>

          </el-tab-pane>
          <el-tab-pane
            label="项目详情"
            name="detail"
            v-if="projectInfo && projectInfo.id"
          > 
          <xm-project-detail  v-if="showPanelName=='detail'" :sel-project="projectInfo" @submit="afterEditSubmit" @edit-fields="onEditFields" ref="detail"></xm-project-detail> 

          </el-tab-pane>
          <el-tab-pane
            label="关联产品"
            name="productProjectLink"
            v-if="projectInfo && projectInfo.id"
          > 
          <xm-product-project-link-mng v-if="showPanelName=='productProjectLink'" :sel-project="projectInfo"></xm-product-project-link-mng>

          </el-tab-pane>
          <el-tab-pane
            label="执行项目数据统计计划"
            name="projectCalc"
            v-if="projectInfo && projectInfo.id"
          > 
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
          </el-tab-pane>
          <el-tab-pane
            label="当前审批流"
            name="currFlow"
            v-if="projectInfo && projectInfo.id"
          > 
          <task-mng v-if="showPanelName === 'currFlow' " ref="currFlow" :biz-parent-pkid="projectInfo.id" @submit="afterFlowSubmit"> </task-mng>  

          </el-tab-pane>
          <el-tab-pane
            label="历史审批流"
            name="hisFlow"
            v-if="projectInfo && projectInfo.id"
          > 
          <procinst-mng v-if="showPanelName === 'hisFlow' " ref="hisFlow" isAll="true" :biz-parent-pkid="projectInfo.id"></procinst-mng> 

          </el-tab-pane>
        </el-tabs> 
        <xm-iteration-link-for-project v-if="showPanelName=='iterationProjectLink'" :sel-project="projectInfo"></xm-iteration-link-for-project>
        
        
        
      </el-col>
    </el-row>
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

import { initDicts,getDefOptions,editXmProjectSomeFields } from "@/api/xm/core/xmProject";

export default {
  components: { XmProjectOverview, XmProjectDetail, XmProductProjectLinkMng ,TaskMng,ProcinstMng},
  computed: {
    ...mapGetters(["userInfo","projectInfo"]),
    calcProjectStatusStep() {
      if (this.dicts["projectStatus"] && this.projectInfo) {
        var index = this.dicts["projectStatus"].findIndex((i) => {
          if (i.id == this.projectInfo.status) {
            return true;
          } else {
            return false;
          }
        });
        return index + 1;
      } else {
        return 0;
      }
    },
  }, 
  watch:{
  },
  data() {
    return {
      showPanelName:'overview',
      maxTableHeight:500, 
      dicts:  getDefOptions(), 
      load:{calcProject:false,calcSettle:false}
    };
  },

  methods:{
    jumpTo(name){
      this.$router.push({
        name:name,
        query:{
          projectId:this.projectInfo.id
        }
      })
    },
    afterEditSubmit(project){
      this.$emit('submit',project)
    },
    onMenuToolBarSelect(menuIndex){
      this.showPanelName=menuIndex;
    },
    
    loadTasksToXmProjectState(){
        var row=this.projectInfo;
        var params={projectId:row.id}
      loadTasksToXmProjectState(params).then((res) => {
          this.load.calcProject=false;
          var tips=res.data.tips; 
          listXmProject({id:this.projectInfo.id}).then(res=>{
            var tips = res.data.tips;
            if(tips.isOk){
              var projectInfo=res.data.data[0] 
              this.onEditFields(projectInfo)
            }
          })
          this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
        }).catch( err  => this.load.calcProject=false ); 
    },
    loadTasksSettleToXmProjectState(){
        var row=this.projectInfo;
        var params={projectId:row.id}
      loadTasksSettleToXmProjectState(params).then((res) => {
          this.load.calcProject=false;
          var tips=res.data.tips; 
          this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
        }).catch( err  => this.load.calcProject=false ); 
    },
    
    afterFlowSubmit(){
      
      listXmProject({id:this.projectInfo.id}).then(res=>{
        var tips = res.data.tips;
        if(tips.isOk){
          var projectInfo=res.data.data[0]
          this.afterEditSubmit(projectInfo)
        }
      })
    },
    
			onEditFields(row){ 
				Object.assign(this.projectInfo,row)
				this.$emit("edit-fields",row);
			},
      goBack() {
      localStorage.setItem("project-infotype", "项目概览");  
      this.$router.back(-1); 
    },
    goHome(){ 
      localStorage.setItem("project-infotype", "项目概览");  
      this.$router.push({path:'/'}) 
    },
     
      showCurrFlow(){
        this.showPanelName='currFlow'
      },
      showHisFlow(){
        this.showPanelName='hisFlow'
      },
      showDetail(){
        this.showPanelName='detail'
      },
      showProjectGaiSuan(){ 
        this.showPanelName='detail' 
        this.$nextTick(()=>{ 
          this.$refs['detail'].$refs['projectEdit'].currTabPane='4'
        })
      },
      showProjectShouYi(){
        this.showPanelName='detail' 
        this.$nextTick(()=>{  
          this.$refs['detail'].$refs['projectEdit'].currTabPane='5'
        })
        
      },
      showMenusPage(){
        this.infotype='需求'  
      },
      linkProduct(){
        this.showPanelName='productProjectLink' 
      },
      createProduct(){
        this.infotype='产品'
        this.$nextTick(()=>{
          this.$refs['xmProductComplex'].addProductVisible=true
        })
      }, 
      editXmProjectSomeFields(row,fieldName,$event){ 
        var that=this;
        var func=(params)=>{
          editXmProjectSomeFields(params).then(res=>{
            var tips = res.data.tips;
            if(tips.isOk){
              this.$emit('edit-fields',params)
              Object.assign(row,params)  
              store.dispathc("setProjectInfo",row)
            }else{    
              this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
            }
          })
        }
        var params={ids:[row.id]};  
        params[fieldName]=$event  
        func(params) 
      },
    tabClick(tab) {
      this.showPanelName = tab.name;
    },
  },

  mounted() {
    
    
    this.$nextTick(() => {
      this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.pageBody.$el);  
    });
  },

};
</script>

<style scoped lang="scss">
.menus {
  .el-menu-item {
    padding-left: 0px !important;
  }
}
/* 超过宽度则用...代替 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.step-btn{
	margin-left:0px;margin-bottom: 5px;
}
</style>
