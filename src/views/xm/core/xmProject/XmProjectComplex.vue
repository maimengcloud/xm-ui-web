<template>
	<section class="page-container border">
		<el-row>  
			<el-col :span="24">
				<el-tabs type="border-card"  :value="showPanel" @tab-click="tabClick">
					<el-tab-pane disabled> 
						<div  slot="label">
							<el-popover
								placement="right"
								width="400"
								trigger="click"> 
								<xm-project-select ref="xmProjectSelect" :auto-select="true"  :xm-iteration="xmIteration" :xm-product="xmProduct"  @row-click="onProjectRowClick" @clear-select="onProjectClearSelect"></xm-project-select>
 								 <el-link type="warning" slot="reference"  icon="el-icon-search"><font style="font-size:14px;">{{selProject?selProject.name:'选择项目'}}</font></el-link> 
							</el-popover>
							
						</div>
					 </el-tab-pane> 
					<el-tab-pane disabled> 
						<div  slot="label">
							<el-popover
								placement="bottom"
								width="800"
								v-model="projectAddVisible"
								trigger="manual"> 
								
 								 <xm-project-add :visible="projectAddVisible" @cancel="projectAddVisible=false" @submit="afterProjectAddSubmit"></xm-project-add>
  								 <el-link type="warning" slot="reference" @click="projectAddVisible=true"  icon="el-icon-plus"><font style="font-size:14px;">项目</font></el-link> 
							</el-popover>
							
						</div>
					 </el-tab-pane> 
					<el-tab-pane label="项目概览"   name="projectOverview" v-if="selProject&&selProject.id">
					 	<xm-project-overview v-if="selProject && showPanel=='projectOverview'" :xm-product="xmProduct"  :xm-iteration="xmIteration" :sel-project="selProject"></xm-project-overview>
					</el-tab-pane>
					<el-tab-pane label="迭代"   name="iterations" v-if=" !xmIteration && selProject&&selProject.id" >
						 <xm-iteration-mng v-if=" selProject && showPanel=='iterations' && !xmIteration"   :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-iteration-mng>
					</el-tab-pane>
					<el-tab-pane label="产品、战略"   name="products" v-if=" !xmProduct && selProject&&selProject.id" >
						 <xm-product-mng v-if=" selProject && showPanel=='products'"   :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-product-mng>
					</el-tab-pane>
					<el-tab-pane label="项目" lazy  name="projects" v-if="!selProject">
						<xm-product-project-for-link v-if="selProject && showPanel=='projects'"  :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-product-project-for-link>
					</el-tab-pane>
					<el-tab-pane label="需求" lazy name="menus" v-if="selProject&&selProject.id">
						<xm-menu-mng v-if="selProject && showPanel=='menus'"   :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"  :disabled-mng="false"></xm-menu-mng>
					</el-tab-pane>
					<el-tab-pane label="任务" lazy name="tasks" v-if="selProject&&selProject.id">
						<xm-task-mng v-if="selProject && showPanel=='tasks'"  :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-task-mng>
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
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import XmIterationMng from '../xmIteration/XmIterationMng.vue'
	import XmMenuMng from '../xmMenu/XmMenuMng.vue'
	import XmIterationStateShow from '../xmIterationState/XmIterationStateShow.vue'
	import { mapGetters } from 'vuex'
import XmProductMng from '../xmProduct/XmProductMng.vue';
import XmTaskMng from '../xmTask/XmTaskMng.vue';
import XmQuestionMng from '../xmQuestion/XmQuestionMng.vue';
import XmProjectSelect from './XmProjectSelect.vue';
import XmProjectForLink from './XmProjectForLink.vue';

import XmProductSelect from '../xmProduct/XmProductSelect.vue';
import XmProductProjectForLink from '../xmProduct/XmProductProjectForLink.vue';
import XmProjectOverview from "./XmProjectOverview";

	import  XmProjectAdd from './XmProjectAdd';//新增界面

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
				topModules:
				[
					{
					moduleName:"项目",
					topModuleId:'xm',
					link:"/xm/core/xmProject/XmProjectMng",
					icon: require("@/assets/image/platform/module-project.png"),
					isHighlight:false,
					moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
					},
					{
					moduleName:"产品",
					topModuleId:'xm',
					link:"/xm/core/xmProduct/XmProductMng",
					icon: require("@/assets/image/platform/module-marketing.png"),
					isHighlight:false,
					moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
					},
					{
					moduleName:"需求",
					topModuleId:'xm',
					link:"/xm/core/xmMenu/XmMenuMng",
					icon: require("@/assets/image/platform/module-intelligentForms.png"),
					isHighlight:false,
					moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
					},
					{
					moduleName:"迭代",
					topModuleId:'xm',
					link:"/xm/core/xmIteration/XmIterationMng",
					icon: require("@/assets/image/platform/module-iteration.png"),
					isHighlight:false,
					moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
					},
					{
					moduleName:"任务",
					topModuleId:'xm',
					link:"/xm/core/xmTask/XmMyTaskCenter",
					icon: require("@/assets/image/platform/module-task.png"),
					isHighlight:false,
					moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
					},
					{
					moduleName:"缺陷",
					topModuleId:'xm',
					link:"/xm/core/xmQuestion/XmQuestionMng",
					icon: require("@/assets/image/platform/anti-fake.png"),
					isHighlight:false,
					moduleType : '1' // 模块类型，1-系统类模块 2-系统外模块
					}
				],
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
				this.$refs.xmProjectSelect.xmProjects.push(project)
				this.$refs.xmProjectSelect.rowClick(project);
				this.projectAddVisible=false;
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
      XmProjectOverview,
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
