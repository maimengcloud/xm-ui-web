<template>
	<section class="page-container border">
		<el-row>  
			<el-col :span="24">
				<el-tabs type="border-card"  :value="showPanel" @tab-click="tabClick">
					<el-tab-pane disabled> 
						<div  slot="label"> 
								<xm-project-select ref="xmProjectSelect" :auto-select="true"  :link-iteration-id="xmIteration?xmIteration.id:null" :link-product-id="xmProduct?xmProduct.id:null"  @row-click="onProjectRowClick" @clear="onProjectClearSelect"></xm-project-select>
 								  
						</div>
					 </el-tab-pane> 
					<el-tab-pane disabled> 
						<div  slot="label">
							<el-popover
								placement="bottom"
								width="800"
								v-model="projectAddVisible"
								trigger="manual"> 
								
 								 <xm-project-add :visible="projectAddVisible" op-type="add" :xm-product="xmProduct" @cancel="projectAddVisible=false" @submit="afterProjectAddSubmit"></xm-project-add>
  								 <el-link type="warning" slot="reference" @click="projectAddVisible=true"  icon="el-icon-plus"><font style="font-size:14px;">项目</font></el-link> 
							</el-popover>
							
						</div>
					 </el-tab-pane> 
					<el-tab-pane label="项目概览"   name="projectOverview" v-if="selProject&&selProject.id">
					 	<xm-project-overview v-if="selProject && showPanel=='projectOverview'" :xm-product="xmProduct"  :xm-iteration="xmIteration" :sel-project="selProject"></xm-project-overview>
					</el-tab-pane>
					<el-tab-pane label="项目详情"   name="detail" v-if="selProject&&selProject.id"> 
        				<xm-project-detail  v-if="showPanel=='detail'" :sel-project="selProject" @submit="afterEditSubmit"></xm-project-detail> 
					</el-tab-pane> 
					<el-tab-pane label="配置关联的产品"   name="productProjectLink" v-if="selProject&&selProject.id && !xmProduct" >
						<xm-product-project-link-mng v-if="showPanel=='productProjectLink'" :sel-project="selProject"></xm-product-project-link-mng>
					</el-tab-pane> 
					<!--
					<el-tab-pane label="配置关联的迭代"   name="iterationProjectLink" v-if="selProject&&selProject.id" >
						<xm-iteration-link-for-project v-if="showPanel=='iterationProjectLink'" :sel-project="selProject"></xm-iteration-link-for-project>
					</el-tab-pane>  
					-->
					<el-tab-pane label="需求" lazy name="menus" v-if="selProject&&selProject.id">
						<xm-menu-mng v-if="selProject && showPanel=='menus'"   :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"  :disabled-mng="false"></xm-menu-mng>
					</el-tab-pane>
					
					<el-tab-pane label="计划" lazy name="plan" v-if="selProject&&selProject.id">
						<xm-plan v-if="selProject && showPanel=='plan'"  queryScope="plan" ptype="0" :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-plan>
					</el-tab-pane>
					<el-tab-pane label="任务" lazy name="tasks" v-if="selProject&&selProject.id">
						<xm-task-mng v-if="selProject && showPanel=='tasks'"  queryScope="task" ptype="0" :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-task-mng>
					</el-tab-pane>
					<el-tab-pane label="缺陷" lazy name="bugs" v-if="selProject&&selProject.id">
						<xm-question-mng v-if="selProject && showPanel=='bugs'"  :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-question-mng>
					</el-tab-pane> 
				</el-tabs>
				<el-row>

				</el-row>

			</el-col>

		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import XmIterationMng from '../xmIteration/XmIterationMng.vue'
	import XmMenuMng from '../xmMenu/XmMenuMng.vue'
	import XmIterationStateShow from '../xmIterationState/XmIterationStateShow.vue'
	import { mapGetters } from 'vuex'
import XmProductMng from '../xmProduct/XmProductMng.vue';
import XmTaskMng from '../xmTask/XmTaskMng.vue';
import XmQuestionMng from '../xmQuestion/XmQuestionMng.vue';
import XmProjectSelect from '@/views/xm/core/components/XmProjectSelect.vue';
import XmProjectForLink from './XmProjectForLink.vue';

import XmProductSelect from '@/views/xm/core/components/XmProductSelect.vue'
import XmProductProjectForLink from '../xmProduct/XmProductProjectForLink.vue';
import XmProjectOverview from "./XmProjectOverview";

	import  XmProjectAdd from './XmProjectEdit';//新增界面
	import  XmProjectDetail from './XmProjectDetail';//新增界面

import XmProductProjectLinkMng from '../xmProductProjectLink/XmProductProjectLinkMng.vue';
import XmIterationLinkForProject from '../xmIterationLink/XmIterationLinkForProject.vue';
import XmPlan from '../xmTask/XmPlan.vue';
	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
		},
		props:['visible','xmIteration','xmProduct'],
		watch:{
			visible:function(visible){
				if(visible==true){
				}
			}
		},
		data() {
			 return{
				selProject:null,
				showPanel:'projectOverview',//menus,tasks,bugs,iterationStateShow 
				projectAddVisible:false,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {

			/**end 自定义函数请在上面加**/
			onProjectRowClick(xmProject){

				this.selProject=xmProject
			},

			onProjectClearSelect(){
				this.selProject=null;
			},
			tabClick(tab){ 
				 this.showPanel=tab.name
			},
			afterProjectAddSubmit(project){
				this.projectAddVisible=false;
				if(this.$refs.xmProjectSelect){
					this.$refs.xmProjectSelect.xmProjects.push(project)
					this.$refs.xmProjectSelect.rowClick(project);
				}  
			}
		},//end methods
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
	  XmIterationLinkForProject,
XmPlan,
		},
		mounted() {
		this.$nextTick(() => {

        	});

		}
	}

</script>

<style scoped>
  .more-label-font{
  	text-align:center;
  	float:left;
  	padding-top:5px;
  }
</style>
