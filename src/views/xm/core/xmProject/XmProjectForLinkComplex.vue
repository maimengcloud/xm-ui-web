<template>
  <section>
    <el-row>
      <el-col :xl="4" :lg="4" :md="5" :sm="5" :xs="5" class="padding">
           <el-row class="padding" v-if="    (xmProduct&&xmProduct.id) || (xmIteration && xmIteration.id)"> 
              <xm-project-select show-style="tag"
                ref="xmProjectSelect"
                :auto-select="false "
                :link-iteration-id="xmIteration ? xmIteration.id : null"
                :link-product-id="xmProduct ? xmProduct.id : null"
                @change2="onProjectRowClick"
                @clear="onProjectClearSelect"
              > 
            </xm-project-select> 
          </el-row> 
          <el-row
            ref="pageBody"
            class="padding" 
            :style="{ maxHeight: maxTableHeight + 'px', overflowY: 'hidden' }"
          > 
          
        <el-steps :active="calcProjectStatusStep" finish-status="success" direction="vertical" v-if="selProject">
        <el-step
          v-for="(i, index) in dicts['projectStatus']"
          :title="i.name"
          :key="index"
        >
          <el-row slot="description">
          <el-row v-if="i.id=='0'"><!--初始-->
              <span v-if="selProject.status==i.id"> 
                
                <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '1')" title="将项目状态改为售前?">
                  <el-button slot="reference" class="step-btn" type="danger" icon="el-icon-d-caret"  plain>进入售前</el-button>
                </el-popconfirm>   
                <el-button class="step-btn" type="warning"    plain @click="editXmProjectSomeFields(selProject,'status','1')">进入售前</el-button>
              </span>
              <span v-if="selProject.status!=i.id">
              </span> 
          </el-row>
          <el-row v-else-if="i.id=='1'"><!--售前-->
              <span v-if="selProject.status==i.id">
                <el-button class="step-btn" type="warning"    plain @click="showMenusPage">需求管理</el-button> 
                <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '2')" title="将项目状态改为立项中，立项中的项目可以发起立项申请流程?">
                  <el-button slot="reference" class="step-btn" type="danger" icon="el-icon-d-caret"  plain>设为立项中</el-button>
                </el-popconfirm>              
              </span>
              <span v-if="selProject.status!=i.id">
                <el-button class="step-btn" type="warning"    plain @click="showMenusPage">需求管理</el-button> 
              </span> 
          </el-row>
          <el-row v-else-if="i.id=='2'"><!--立项中-->
              <span v-if="selProject.status==i.id"> 
                <el-button class="step-btn" type="warning"    plain @click="showPanel='group'">创建团队</el-button>
                <el-button class="step-btn" type="warning"    plain @click="showPanel='plan'">创建计划</el-button> 
                <el-button class="step-btn" type="warning"    plain @click="showProjectGaiSuan()">项目估算</el-button>
                <el-button class="step-btn" type="warning"    plain @click="showProjectShouYi()">项目收益</el-button>
                
                <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '2')" title="将项目状态改为立项中，立项中的项目可以发起立项申请流程?">
                  <el-button slot="reference" class="step-btn" type="danger" icon="el-icon-d-caret"  plain>设为立项中</el-button>
                </el-popconfirm>
               </span>
              <span v-if="selProject.status!=i.id">
                <el-button class="step-btn" type="warning"    plain @click="showPanel='group'">团队管理</el-button>  
                <el-button class="step-btn" type="warning"    plain @click="showPanel='plan'">计划管理</el-button>  
                <el-button class="step-btn" type="warning"    plain @click="showProjectGaiSuan()">项目估算</el-button>
                <el-button class="step-btn" type="warning"    plain @click="showProjectShouYi()">项目收益</el-button>
              </span> 
          </el-row>
          <el-row v-else-if="i.id=='3'"><!--实施中-->
              <span v-if="selProject.status==i.id"> 
                <el-button class="step-btn" type="warning"    plain @click="showPanel='milestone'">里程碑</el-button>
                <el-button class="step-btn" type="warning"    plain @click="showPanel='tasks'">任务管理</el-button>
                <el-button class="step-btn" type="warning"    plain @click="showPanel='bugs'">缺陷管理</el-button> 
                <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '4')" title="将项目状态改为暂停中，暂停中的项目不允许进行操作，恢复状态后才可以继续?">
                  <el-button slot="reference" class="step-btn" type="danger" icon="el-icon-d-caret"  plain>暂停项目</el-button>
                </el-popconfirm>
                 <el-button class="step-btn" type="warning"    plain @click="projectChangeRequire()">变更申请</el-button>
                <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '5')" title="将项目状态改为结项中，结项申请中的项目可以发起结项流程?">
                  <el-button slot="reference" class="step-btn" type="danger" icon="el-icon-d-caret"  plain>设为结项中</el-button>
                </el-popconfirm>
               </span>
              <span v-if="selProject.status!=i.id"> 
                <el-button class="step-btn" type="warning"    plain @click="showPanel='tasks'">任务管理</el-button>
                <el-button class="step-btn" type="warning"    plain @click="showPanel='bugs'">缺陷管理</el-button>  
                 <el-button class="step-btn" type="warning"    plain @click="projectChangeRequire()">变更申请</el-button>
              </span> 
          </el-row>
          <el-row v-else-if="i.id=='4'"><!--暂停中-->
              <span v-if="selProject.status==i.id">  
                <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '3')" title="将项目重新激活?">
                  <el-button slot="reference" class="step-btn" type="danger" icon="el-icon-d-caret"  plain>重新激活</el-button>
                </el-popconfirm>
               </span>  
          </el-row>
        <el-row v-else-if="i.id=='5'"><!--结项中-->
              <span v-if="selProject.status==i.id">  
          </span>
          <span v-if="selProject.status!=i.id">
          
          </span>  
          </el-row>
          <el-row v-else-if="i.id=='6'"><!--已结项--> 
              <span v-if="selProject.status==i.id"> 
                
                <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '7')" title="将项目状态改为售后?">
                  <el-button slot="reference" class="step-btn" type="danger" icon="el-icon-d-caret"  plain>转入售后</el-button>
                </el-popconfirm>
               </span> 
              <span v-if="selProject.status!=i.id">
              </span>  
          </el-row>
          <el-row v-else-if="i.id=='7'"><!--售后-->
              <span v-if="selProject.status==i.id"> 
                
                <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '8')" title="将项目状态改为已完成?">
                  <el-button slot="reference" class="step-btn" type="danger" icon="el-icon-d-caret"  plain>设为已完成</el-button>
                </el-popconfirm>
               </span> 
          </el-row>
          <el-row v-else-if="i.id=='8'"><!--已完成-->
              <span v-if="selProject.status==i.id"> 
                <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '9')" title="将项目状态改为已关闭?">
                  <el-button slot="reference" class="step-btn" type="danger" icon="el-icon-d-caret"  plain>关闭项目</el-button>
                </el-popconfirm>
               </span> 
              
          </el-row>
          <el-row v-else-if="i.id=='9'"><!--已关闭--> 
            <span v-if="selProject.status==i.id"> 
              <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '3')" title="将项目状态改为实施中?">
                  <el-button slot="reference" class="step-btn" type="danger" icon="el-icon-d-caret"  plain>重新实施</el-button>
                </el-popconfirm>
            </span>
          </el-row> 
          </el-row>
        </el-step>
        </el-steps>
          </el-row> 
      </el-col>
      <el-col :xl="20" :lg="20" :md="19" :sm="19" :xs="19" class="padding-left padding-right">
        <el-tabs :value="showPanel" @tab-click="tabClick" v-if="selProject && selProject.id">
          <el-tab-pane
            label="项目概览"
            name="projectOverview" 
          >
            <xm-project-overview
              v-if="selProject && showPanel == 'projectOverview'"
              :xm-product="xmProduct"
              :xm-iteration="xmIteration"
              :sel-project="selProject"
            ></xm-project-overview>
          </el-tab-pane>
          <el-tab-pane
            label="项目详情"
            name="detail" 
          >
            <xm-project-detail
              v-if="showPanel == 'detail'"
              :sel-project="selProject"
              @submit="onEditFields"
			  ref="detail"
			  @edit-fields="onEditFields"
            ></xm-project-detail>
          </el-tab-pane>
          <el-tab-pane
            label="配置关联的产品"
            name="productProjectLink" 
          >
            <xm-product-project-link-mng class="padding-top"
              v-if="showPanel == 'productProjectLink'"
              :sel-project="selProject"
            ></xm-product-project-link-mng>
          </el-tab-pane>
          <!--
					<el-tab-pane label="配置关联的迭代"   name="iterationProjectLink" v-if="selProject&&selProject.id" >
						<xm-iteration-link-for-project v-if="showPanel=='iterationProjectLink'" :sel-project="selProject"></xm-iteration-link-for-project>
					</el-tab-pane>  
					-->
          <el-tab-pane
            label="需求" 
            name="menus" 
          >
            <xm-menu-mng
              v-if="selProject && showPanel == 'menus'"
              :xm-product="xmProduct"
              :xm-iteration="xmIteration"
              :sel-project="selProject"
              :disabled-mng="false"
            ></xm-menu-mng>
          </el-tab-pane>
          
          <el-tab-pane
            label="计划" 
            name="plan" 
          >
            <xm-plan
              v-if="selProject&&selProject.id && showPanel == 'plan'"
              queryScope="plan"
              ptype="0"
              :xm-product="xmProduct"
              :xm-iteration="xmIteration"
              :sel-project="selProject"
            ></xm-plan>
          </el-tab-pane>
          <el-tab-pane
            label="任务" 
            name="tasks" 
          >
            <xm-task-mng
              v-if="selProject && showPanel == 'tasks'"
              queryScope="task"
              ptype="0"
              :xm-product="xmProduct"
              :xm-iteration="xmIteration"
              :sel-project="selProject"
            ></xm-task-mng>
          </el-tab-pane>
          <el-tab-pane
            label="缺陷" 
            name="bugs" 
          >
            <xm-question-mng
              v-if="selProject && showPanel == 'bugs'"
              :xm-product="xmProduct"
              :xm-iteration="xmIteration"
              :sel-project="selProject"
            ></xm-question-mng>
          </el-tab-pane>
          <el-tab-pane
            label="团队" 
            name="group" 
          >
			<xm-group-mng
			v-if="showPanel == 'group'"
			:sel-project="selProject"
			></xm-group-mng>
          </el-tab-pane>
          <el-tab-pane
            label="执行统计"
            name="projectCalc" 
          >
            <div v-if="showPanel == 'projectCalc'">
              <el-row>
                <el-button
                  type="primary"
                  @click="loadTasksToXmProjectState"
                  v-loading="load.calcProject"
                  >计算项目预算数据</el-button
                >
                <br />
                <font color="blue" style="font-size: 10px"
                  >将从项目任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到项目统计表</font
                >
              </el-row>
              <!--
              <el-row>
                <el-button
                  type="primary"
                  @click="loadTasksSettleToXmProjectState"
                  v-loading="load.calcSettle"
                  >计算项目结算数据</el-button
                >
                <br />
                <font color="blue" style="font-size: 10px"
                  >将从项目任务汇总结算数据项目统计表</font
                >
              </el-row>
              -->
            </div>
          </el-tab-pane>
          
					<el-tab-pane label="效能分析" name="效能"> 
						<xm-rpt v-if="selProject && showPanel=='效能'" :xm-project="selProject" :xm-iteration="xmIteration" :xm-product="xmProduct" category="项目级"></xm-rpt>
 					</el-tab-pane> 
        </el-tabs> 
      </el-col>
    </el-row>
    
            <el-dialog 
              width="80%"
              :visible.sync="projectAddVisible" 
              top="20px"
              append-to-body
            >
              <xm-project-add
                :visible="projectAddVisible"
                op-type="add"
                :xm-product="xmProduct"
                @cancel="projectAddVisible = false"
                @submit="afterProjectAddSubmit"
              ></xm-project-add> 
            </el-dialog>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import config from "@/common/config"; //全局公共库
import XmIterationMng from "../xmIteration/XmIterationMng.vue";
import XmMenuMng from "../xmMenu/XmMenuBox.vue";
import XmIterationStateShow from "../xmIterationState/XmIterationStateShow.vue";
import { mapGetters } from "vuex";
import XmProductMng from "../xmProduct/XmProductMng.vue";
import XmTaskMng from "../xmTask/XmTaskMng.vue";
import XmQuestionMng from "../xmQuestion/XmQuestionMng.vue";
import XmProjectSelect from "@/views/xm/core/components/XmProjectSelect.vue";
import XmProjectForLink from "./XmProjectForLink.vue";

import XmProductSelect from "@/views/xm/core/components/XmProductSelect.vue";
import XmProductProjectForLink from "../xmProduct/XmProductProjectForLink.vue";
import XmProjectOverview from "./XmProjectOverview";

import XmProjectAdd from "./XmProjectEdit"; //新增界面
import XmProjectDetail from "./XmProjectDetail"; //新增界面

import XmProductProjectLinkMng from "../xmProductProjectLink/XmProductProjectLinkMng.vue"; 
import XmPlan from "../xmTask/XmPlan.vue";
import xmGroupMng from "../xmGroup/XmGroupMng";
 
import XmRpt from "@/views/xm/rpt/index";
import store from '@/store'

import {
	initDicts,
  getDefOptions,
  editXmProjectSomeFields,
} from "@/api/xm/core/xmProject";
import {
  loadTasksToXmProjectState,
  loadTasksSettleToXmProjectState,
} from "@/api/xm/core/xmProjectState";
export default {
  computed: {
    ...mapGetters(["userInfo", "roles", "xmIteration", "xmProduct"]),

    calcProjectStatusStep() {
      if (this.dicts["projectStatus"] && this.selProject) {
        var index = this.dicts["projectStatus"].findIndex((i) => {
          if (i.id == this.selProject.status) {
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
  props: ["visible"],
  watch: {
    visible: function (visible) {
      if (visible == true) {
      }
    },
  },
  data() {
    return {
      load: {
        calcProject: false,
      },
	  dicts:{
		"projectType":[], "priority":[], "projectStatus":[]
	  },
      selProject: null,
      showPanel: "projectOverview", //menus,tasks,bugs,iterationStateShow
      projectAddVisible: false,
	  maxTableHeight:300,
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    /**end 自定义函数请在上面加**/
    onProjectRowClick(xmProject) {
      this.selProject = xmProject;
    },

    onProjectClearSelect() {
      this.selProject = null;
    },
    tabClick(tab) {
      this.showPanel = tab.name;
    },
    afterProjectAddSubmit(project) {
      this.projectAddVisible = false;
      if (this.$refs.xmProjectSelect) {
        this.$refs.xmProjectSelect.xmProjects.push(project);
        this.$refs.xmProjectSelect.rowClick(project);
      }
    },

    loadTasksToXmProjectState() {
      var row = this.selProject;
      var params = { projectId: row.id };
      loadTasksToXmProjectState(params)
        .then((res) => {
          this.load.calcProject = false;
          var tips = res.data.tips;
          if (this.$refs["xmProjectSelect"]) {
            this.$refs["xmProjectSelect"].reloadOne();
          }
          this.$notify({
            position: "bottom-left",
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        })
        .catch((err) => (this.load.calcProject = false));
    },
    loadTasksSettleToXmProjectState() {
      var row = this.selProject;
      var params = { projectId: row.id };
      loadTasksSettleToXmProjectState(params)
        .then((res) => {
          this.load.calcProject = false;
          var tips = res.data.tips;
          this.$notify({
            position: "bottom-left",
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        })
        .catch((err) => (this.load.calcProject = false));
    },
    onEditFields(row) {
      Object.assign(this.selProject, row);
      this.$emit("edit-fields", row);
    },
    showCurrFlow() {
      this.showPanel = "currFlow";
    },
    showHisFlow() {
      this.showPanel = "hisFlow";
    },
    showDetail() {
      this.showPanel = "detail";
    },
    projectChangeRequire() {
      this.showPanel = "detail";
      this.$nextTick(() => {
        this.$refs["detail"].$refs['projectEdit'].currTabPane = "3";
      });
    },
    showProjectGaiSuan() {
      this.showPanel = "detail";
      this.$nextTick(() => {
        this.$refs["detail"].$refs['projectEdit'].currTabPane = "4";
      });
    },
    showProjectShouYi() {
      this.showPanel = "detail";
      this.$nextTick(() => {
        this.$refs["detail"].$refs['projectEdit'].currTabPane = "5";
      });
    },
    showMenusPage() {
      this.showPanel = "menus"; 
    },
    
			
			editXmProjectSomeFields(row,fieldName,$event){ 
				 
				var func=(params)=>{
					editXmProjectSomeFields(params).then(res=>{
						var tips = res.data.tips;
						if(tips.isOk){
							
							Object.assign(row,params) 
							Object.assign(this.selProject,row) 
							this.$emit('edit-fields',row)
							store.dispatch("setProjectInfo",this.selProject)
							this.editFormBak=Object.assign({},row)
						}else{   
							Object.assign(this.editForm,this.editFormBak)
 							this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
						}
					})
				}
				var params={ids:[row.id]}; 
				  
					params[fieldName]=$event  
				 
					func(params) 
			},
  }, //end methods
  components: {
    //在下面添加其它组件
    XmIterationMng,
    XmMenuMng,
    XmIterationStateShow,
    XmProductMng,
    XmTaskMng,
    XmQuestionMng,
    XmProductSelect,
    XmProjectSelect,
    XmProjectForLink,
    XmProductProjectForLink,
    XmProjectAdd,
    XmProjectDetail,
    XmProjectOverview,
    XmProductProjectLinkMng, 
    XmPlan,
    XmRpt,
	xmGroupMng,
  },
  mounted() {
	
    this.$nextTick(() => {
      
      this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.pageBody.$el); 
    });
    
    initDicts(this) 
  },
};
</script>

<style scoped>
.more-label-font {
  text-align: center;
  float: left;
  padding-top: 5px;
}
.step-btn{
	margin-left:0px;margin-bottom: 5px;
}
</style>
