<template>
	<section class="page-container border"> 
		<el-row>
			<el-col :span="iterationVisible==true?6:0" >
				<xm-iteration-select :sel-project="selProject"  @row-click="onIterationRowClick" @clear-select="onIterationClearSelect"></xm-iteration-select>
			</el-col>  
			<el-col :span="iterationVisible==true?18:24" >  
				<el-tabs type="border-card" @tab-click="tabClick">  
					<el-tab-pane label="产品、战略"  lazy>   
						<span v-show="iterationVisible==true" slot="label" ><i class="el-icon-d-arrow-left" @click.stop="iterationVisible=false"></i> 产品、战略</span>
						<span v-show="iterationVisible==false" slot="label" ><i class="el-icon-d-arrow-right" @click.stop="iterationVisible=true"></i> 产品、战略</span> 
						<xm-product-mng  v-if="xmIteration" :xm-iteration="xmIteration" :sel-project="selProject"></xm-product-mng>
					</el-tab-pane>
					<el-tab-pane label="故事" lazy  >  
						<xm-menu-mng v-if="xmIteration" :xm-iteration="xmIteration" :sel-project="selProject"></xm-menu-mng>
					</el-tab-pane>
					<el-tab-pane label="任务" lazy  >
						<xm-task-mng v-if="xmIteration" :sel-project="selProject"></xm-task-mng>
					</el-tab-pane>
					<el-tab-pane label="缺陷" lazy  > 
						<xm-question-mng  v-if="xmIteration" :sel-project="selProject"></xm-question-mng>
					</el-tab-pane>
					<el-tab-pane label="迭代概览" lazy  >
						<xm-iteration-state-show v-if="xmIteration" :sel-project="selProject"></xm-iteration-state-show>
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
	import { listXmIteration,listXmIterationWithState, delXmIteration, batchDelXmIteration,loadTasksToXmIterationState } from '@/api/xm/core/xmIteration';
	import XmIterationSelect from './XmIterationSelect.vue'
	import XmMenuMng from '../xmMenu/XmMenuMng.vue'
	import XmIterationStateShow from '../xmIterationState/XmIterationStateShow.vue'
	import { mapGetters } from 'vuex' 
import XmProductMng from '../xmProduct/XmProductMng.vue';
import XmTaskMng from '../xmTask/XmTaskMng.vue';
import XmQuestionMng from '../xmQuestion/XmQuestionMng.vue';
 

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]), 
		},
		props:['visible','selProject'],
		watch:{
			visible:function(visible){
				if(visible==true){ 
				}
			}
		},
		data() {
			 return{
				xmIteration:null,
				showPanel:'menus',//menus,tasks,bugs,iterationStateShow
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
					moduleName:"故事",
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
				iterationVisible:true,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			 
			/**end 自定义函数请在上面加**/ 
			onIterationRowClick(iteration){ 

				this.xmIteration=iteration 
			},
			
			onIterationClearSelect(){
				this.iteration=null; 
			},
			tabClick(tab){  
				if(tab.label=='任务' || tab.label=='故事'){ 
					this.iterationVisible=false;
				}
			}
		},//end methods
		components: { 
		    //在下面添加其它组件
			XmIterationSelect,
			XmMenuMng,
			XmIterationStateShow, 
			XmProductMng,
			XmTaskMng,
			XmQuestionMng
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
