<template>
	<section class="page-container border">
		<el-row>
			<el-col :span="productVisible==true?3:0" >
				<xm-product-select :sel-project="selProject" :xm-iteration="xmIteration"  @row-click="onProductRowClick" @clear-select="onProductClearSelect"></xm-product-select>
			</el-col>
			<el-col :span="productVisible==true?21:24" >
				<el-tabs type="border-card"  :value="showPanel"  @tab-click="tabClick">
					<el-tab-pane label="产品概览"   name="productOverview">
						<span v-show="productVisible==true" slot="label" ><i class="el-icon-d-arrow-left" @click.stop="productVisible=false"></i> 产品概览</span>
						<span v-show="productVisible==false" slot="label" ><i class="el-icon-d-arrow-right" @click.stop="productVisible=true"></i> 产品概览</span>
            <xm-product-overview v-if="xmProduct && showPanel=='productOverview'"  :xm-product="xmProduct" :sel-project="selProject"></xm-product-overview>

          </el-tab-pane>
					<el-tab-pane label="迭代"   name="iterations" v-if=" !xmIteration" >
						 <xm-iteration-mng v-if=" xmProduct && showPanel=='iterations' && !xmIteration"   :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-iteration-mng>
					</el-tab-pane>
					<el-tab-pane label="项目" lazy  name="projects" v-if="!selProject">
						<xm-product-project-for-link v-if="xmProduct && showPanel=='projects'"  :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-product-project-for-link>
					</el-tab-pane>
					<el-tab-pane label="故事" lazy name="menus" >
						<xm-menu-mng v-if="xmProduct && showPanel=='menus'"   :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"  :disabled-mng="false"></xm-menu-mng>
					</el-tab-pane>
					<el-tab-pane label="任务" lazy name="tasks" >
						<xm-task-mng v-if="xmProduct && showPanel=='tasks'"  :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-task-mng>
					</el-tab-pane>
					<el-tab-pane label="缺陷" lazy name="bugs" >
						<xm-question-mng v-if="xmProduct && showPanel=='bugs'"  :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-question-mng>
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
import XmProductMng from './XmProductMng.vue';
import XmTaskMng from '../xmTask/XmTaskMng.vue';
import XmQuestionMng from '../xmQuestion/XmQuestionMng.vue';
import XmProjectList from '../xmProject/XmProjectList.vue';
import XmProjectForLink from '../xmProject/XmProjectForLink.vue';

import XmProductSelect from './XmProductSelect.vue';
import XmProductProjectForLink from './XmProductProjectForLink.vue';
import XmProductOverview from "./XmProductOverview";


	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
		},
		props:['visible','selProject','xmIteration'],
		watch:{
			visible:function(visible){
				if(visible==true){
				}
			}
		},
		data() {
			 return{
				xmProduct:null,
				showPanel:'productOverview',//menus,tasks,bugs,iterationStateShow
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
				productVisible:true,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {

			/**end 自定义函数请在上面加**/
			onProductRowClick(xmProduct){

				this.xmProduct=xmProduct
			},

			onProductClearSelect(){
				this.iteration=null;
			},
			tabClick(tab){
				 this.showPanel=tab.name
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
			XmProjectList,
			XmProjectForLink,
XmProductProjectForLink,
      XmProductOverview,
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
