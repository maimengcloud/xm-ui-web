<template>
	<section class="page-container border">
		<el-row> 
			<el-col :span="24">
				<el-tabs type="border-card"  :value="showPanel" @tab-click="tabClick"> 
					<el-tab-pane  lazy   name="iterations" disabled> 
						<div  slot="label"> 
								<xm-iteration-select ref="xmIterationSelect" :auto-select="true" :link-project-id="selProject?selProject.id:null" :product-id="xmProduct?xmProduct.id:null"  @row-click="onIterationRowClick" @clear="onIterationClearSelect"></xm-iteration-select>
 								 
						</div>
					</el-tab-pane>


					<el-tab-pane  lazy   name="iterations2" disabled> 
						<div  slot="label">
							<el-popover
								placement="bottom"
								width="800"
								v-model="iterationAddVisible"
								trigger="manual">  
 										<xm-iteration-add  :xm-product="xmProduct" :sel-project="selProject" :visible="iterationAddVisible" @cancel="iterationAddVisible=false" @submit="afterIterationAddSubmit"></xm-iteration-add>
  								<el-link type="warning" slot="reference" @click="iterationAddVisible=true" icon="el-icon-plus">迭代</el-link> 
							</el-popover> 
						</div>
					</el-tab-pane>
					<el-tab-pane label="迭代概览" lazy  name="iterationOverview" v-if="xmIteration && xmIteration.id">
						<xm-iteration-overview v-if="xmIteration && showPanel=='iterationOverview'"  :xm-iteration="xmIteration" :sel-project="selProject"></xm-iteration-overview>
					</el-tab-pane>
					<el-tab-pane label="执行统计" lazy  name="iterationCalc" v-if="xmIteration && xmIteration.id">
						  <div v-if="showPanel=='iterationCalc'">
							<el-row>
							<el-button type="primary" @click="loadTasksToXmIterationState" v-loading="load.calcIteration">计算迭代统计数据</el-button>
							<br>
								<font color="blue" style="font-size:10px;">将从项目任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到迭代统计表;
								<br/>
								<strong>注意：</strong>该统计实时统计迭代涉及到的各方面数据，执行量较大，一般更改了任务进度数据、重新调整了需求范围，需要迭代的实时数据的情况下，再手动执行。
								
								</font>
							</el-row> 
						</div>
					</el-tab-pane>
					
					<el-tab-pane label="迭代详情" lazy name="detail" v-if="xmIteration&&xmIteration.id">
						<xm-iteration-edit v-if="showPanel=='detail'" :xm-iteration="xmIteration"></xm-iteration-edit>
					</el-tab-pane> 
					<el-tab-pane label="配置需求范围" lazy name="iterationMenuMng" v-if="xmIteration&&xmIteration.id">
      					<xm-iteration-menu-mng v-if="showPanel=='iterationMenuMng'" :xm-iteration="xmIteration"></xm-iteration-menu-mng>
					</el-tab-pane>
					<el-tab-pane label="需求列表" lazy name="menus" v-if="xmIteration&&xmIteration.id">
						<xm-menu-mng v-if="xmIteration && showPanel=='menus'" :xm-product="xmProduct"  :xm-iteration="xmIteration" :sel-project="selProject"></xm-menu-mng>
					</el-tab-pane>
					<el-tab-pane label="任务列表" lazy name="tasks" v-if="xmIteration&&xmIteration.id">
						<xm-task-mng v-if="xmIteration && showPanel=='tasks'" :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-task-mng>
					</el-tab-pane> 
					<el-tab-pane label="缺陷列表" lazy name="bugs" v-if="xmIteration&&xmIteration.id">
						<xm-question-mng v-if="xmIteration && showPanel=='bugs'" :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-question-mng>
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
	import { delXmIterationLink } from '@/api/xm/core/xmIterationLink';

 	import XmIterationSelect from '@/views/xm/core/components/XmIterationSelect.vue'
	import XmMenuMng from '../xmMenu/XmMenuMng.vue'
	import XmIterationStateShow from '../xmIterationState/XmIterationStateShow.vue'
	import { mapGetters } from 'vuex'
	import XmProductMng from '../xmProduct/XmProductMng.vue';
	import XmProjectForLink from '../xmProject/XmProjectForLink.vue';
	import XmTaskMng from '../xmTask/XmTaskMng.vue';
	import XmQuestionMng from '../xmQuestion/XmQuestionMng.vue';
	import XmIterationOverview from "./XmIterationOverview";

	import XmIterationEdit from './XmIterationEdit.vue';
 	import XmIterationLinkForProduct from '../xmIterationLink/XmIterationLinkForProduct.vue';
 	import XmIterationLinkForProject from '../xmIterationLink/XmIterationLinkForProject.vue';
	import  XmIterationAdd from './XmIterationAdd';//新增界面

	import XmIterationMenuMng from '../xmIterationMenu/XmIterationMenuMng.vue';
	import { loadTasksToXmIterationState } from '@/api/xm/core/xmIteration';
	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
		},
		props:['visible','selProject','xmProduct'],
		watch:{
			visible:function(visible){
				if(visible==true){
				}
			}
		},
		data() {
			 return{
				load:{calcIteration:false},
				xmIteration:null,
				showPanel:'iterationOverview',//menus,tasks,bugs,iterationStateShow 
				iterationAddVisible:false,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			loadTasksToXmIterationState(){ 
				this.load.calcIteration=true;
				loadTasksToXmIterationState({id:this.xmIteration.id}).then(res=>{
					this.load.calcIteration=false;
					var tips =res.data.tips; 
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
				});
			},

			/**end 自定义函数请在上面加**/
			onIterationRowClick(iteration){

				this.xmIteration=iteration
			},

			onIterationClearSelect(){
				this.xmIteration=null;
			},
			afterIterationAddSubmit(iteration){
				this.$refs.xmIterationSelect.xmIterations.push(iteration)
				this.$refs.xmIterationSelect.rowClick(iteration);
				this.iterationAddVisible=false;
			},
			tabClick(tab){  
				this.showPanel=tab.name 
			}, 
		},//end methods
		components: {
      XmIterationOverview,
		    //在下面添加其它组件
			XmIterationSelect,
			XmMenuMng,
			XmIterationStateShow,
			XmProductMng,
			XmTaskMng,
			XmQuestionMng,
			XmProjectForLink,
			XmIterationAdd,
			XmIterationEdit,
			XmIterationLinkForProduct,
			XmIterationLinkForProject,
			XmIterationMenuMng,

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
