<template>
	<section>
		<el-row> 
			<el-col :span="4" class="padding-right padding-left">
				 <el-row class="padding">
					<el-col :span="20">
						<xm-iteration-select ref="xmIterationSelect" :auto-select="true" :link-project-id="selProject?selProject.id:null" :product-id="xmProduct?xmProduct.id:null"  @row-click="onIterationRowClick" @clear="onIterationClearSelect"></xm-iteration-select>
 					</el-col>
					<el-col :span="4">  
 							<el-link type="warning" @click="iterationAddVisible=true" icon="el-icon-plus">迭代</el-link> 
 					</el-col>
 				 </el-row> 
				<el-row ref="pageMainRef" class="padding border" :style="{ maxHeight: maxTableHeight + 'px', overflowY: 'auto' }"> 
								<h4 class="padding-bottom">常用功能导航</h4>
								<el-steps
								:active="calcIterationStatusStep"
								finish-status="success"
								direction="vertical"
								>
								<el-step
									v-for="(i, index) in dicts['iterationStatus']"
									:title="i.name"
									:key="index"
								>
									<el-row slot="description">
									<el-row v-if="i.id == '0'"
										><!--打开-->
										<span v-if="xmIteration.istatus == i.id">
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="showPanel = 'menus'"
											>需求管理</el-button
										> 
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="showIterationMenu"
											>配置需求范围</el-button
										> 
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="editSomeFields(xmIteration, 'istatus', '1')"
											>开启需求评审</el-button
										> 
										</span>
										<span v-if="xmIteration.istatus != i.id">
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="showPanel = 'menus'"
											>需求管理</el-button
										> 
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="showIterationMenu"
											>需求范围</el-button
										> 
										</span>
									</el-row>
									<el-row v-else-if="i.id == '1'"
										><!--需求评审-->
										<span v-if="xmIteration.istatus == i.id"> 
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="showIterationMenu"
											>确认需求范围</el-button
										> 
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="showPanel='bugs'"
											>缺陷登记</el-button
										>
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="editSomeFields(xmIteration, 'istatus', '2')"
											>进入计划会</el-button
										>
										</span>
										<span v-if="xmIteration.istatus != i.id">
										
										</span>
									</el-row>
									<el-row v-else-if="i.id == '2'"
										><!--计划会-->
										<span v-if="xmIteration.istatus == i.id">
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="showIterationDetail"
											>迭代计划</el-button
										>
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="showPanel = 'tasks'"
											>任务管理</el-button
										> 
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="editSomeFields(xmIteration, 'istatus', '3')"
											>设为研发中</el-button
										>
										</span>
										<span v-if="xmIteration.istatus != i.id">
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="showIterationDetail"
											>迭代计划</el-button
										>
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="showPanel = 'tasks'"
											>任务管理</el-button
										> 
										</span>
									</el-row>
									<el-row v-else-if="i.id == '3'"
										><!--研发中-->
										<span v-if="xmIteration.istatus == i.id"> 
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="showPanel = 'tasks'"
											>任务管理</el-button
										>  
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="showPanel = '效能'"
											>效能分析</el-button
										> 
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="editSomeFields(xmIteration, 'istatus', '4')"
											>设为测试中</el-button
										>
										</span>
										<span v-if="xmIteration.istatus != i.id"> 
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="showPanel = '效能'"
											>效能分析</el-button
										> 
										</span>
									</el-row>
									<el-row v-else-if="i.id == '4'"
										><!--测试中-->
										<span v-if="xmIteration.istatus == i.id"> 
											<el-button
												class="step-btn"
												type="warning"
												size="mini"
												plain
												@click="showPanel = 'bugs'"
												>缺陷管理</el-button
											>  
											<el-button
												class="step-btn"
												type="warning"
												size="mini"
												plain
												@click="editSomeFields(xmIteration, 'istatus', '5')"
												>设为待上线</el-button
											>
										</span>
										
										<span v-if="xmIteration.istatus != i.id">
											<el-button
												class="step-btn"
												type="warning"
												size="mini"
												plain
												@click="showPanel = 'bugs'"
												>缺陷管理</el-button
											>   
										</span>
									</el-row>
									<el-row v-else-if="i.id == '5'"
										><!--上线中-->
										<span v-if="xmIteration.istatus == i.id">
										
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="editSomeFields(xmIteration, 'istatus', '6')"
											>设为已完成</el-button
										>
										</span>
										<span v-if="xmIteration.istatus != i.id">
										
										</span>
									</el-row>
									<el-row v-else-if="i.id == '6'"
										><!--已完成-->
										<span v-if="xmIteration.istatus == i.id">
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="editSomeFields(xmIteration, 'istatus', '7')"
											>设为已关闭</el-button
										>
										</span>
										<span v-if="xmIteration.istatus != i.id"> 
										
										</span>
									</el-row>
									<el-row v-else-if="i.id == '7'"
										><!--已关闭-->
										<span v-if="xmIteration.istatus == i.id">
										<el-button
											class="step-btn"
											type="warning"
											size="mini"
											plain
											@click="editSomeFields(xmIteration, 'istatus', '0')"
											>重新打开</el-button
										>
										</span> 
									</el-row>  
									</el-row>
								</el-step>
								</el-steps> 
						</el-row>			 
			</el-col>
			<el-col :span="20">
				<el-tabs :value="showPanel" @tab-click="tabClick">  
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
						<xm-iteration-edit v-if="showPanel=='detail'" :xm-iteration="xmIteration" @edit-fields="onEditFields"></xm-iteration-edit>
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
					
					<el-tab-pane label="效能分析" lazy name="效能" v-if="xmIteration&&xmIteration.id"> 
						<xm-report v-if="xmIteration && showPanel=='效能'" :xm-iteration="xmIteration" ></xm-report>
 					</el-tab-pane> 
				</el-tabs>
				<el-row>

				</el-row>

			</el-col>

		</el-row>
		
		<el-dialog  width="60%" top="20px" :visible.sync="iterationAddVisible" append-to-body>  
					<xm-iteration-add  :xm-product="xmProduct" :sel-project="selProject" :visible="iterationAddVisible" @cancel="iterationAddVisible=false" @submit="afterIterationAddSubmit"></xm-iteration-add>
 		</el-dialog> 
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
	import XmReport from "@/views/xm/rpt/reportIndex";

	import XmIterationMenuMng from '../xmIterationMenu/XmIterationMenuMng.vue';
	import { initDicts,loadTasksToXmIterationState,editSomeFieldsXmIteration } from '@/api/xm/core/xmIteration';
	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),

			calcIterationStatusStep() {
			if (this.dicts["iterationStatus"] && this.xmIteration) {
				var index = this.dicts["iterationStatus"].findIndex((i) => {
				if (i.id == this.xmIteration.istatus) {
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
		props:['visible','selProject','xmProduct'],
		watch:{
			visible:function(visible){
				if(visible==true){
				}
			}
		},
		data() {
			 return{
				dicts:{iterationStatus:[]},
				load:{calcIteration:false},
				xmIteration:null,
				showPanel:'iterationOverview',//menus,tasks,bugs,iterationStateShow 
				iterationAddVisible:false,
				maxTableHeight:300,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			loadTasksToXmIterationState(){ 
				this.load.calcIteration=true;
				loadTasksToXmIterationState({id:this.xmIteration.id}).then(res=>{
					this.load.calcIteration=false;
					var tips =res.data.tips; 
					if(this.$refs['xmIterationSelect']){
						this.$refs['xmIterationSelect'].reloadOne();
					}
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

			editSomeFields(row,fieldName,$event){ 
				let params={};
				params['ids']=[row].map(i=>i.id)
				params[fieldName]=$event
				var func = editSomeFieldsXmIteration
				func(params).then(res=>{
					let tips = res.data.tips;
					if(tips.isOk){
					Object.assign(row,params)
					this.$emit('edit-fields',params)
					}else{ 
						this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
					}
				}).catch((e)=>Object.assign(this.editForm,this.editFormBak))
			},
			showIterationMenu(){
				this.showPanel='iterationMenuMng'
			},
			showIterationDetail(){
				this.showPanel='detail'
			},
			onEditFields(row){
				Object.assign(this.xmIteration,row)
				this.$emit('edit-fields',row)
			}
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
			XmReport,

		},
		mounted() { 
			this.$nextTick(() => {
				initDicts(this)
				
      this.maxTableHeight = util.calcTableMaxHeight(this.$refs.pageMainRef.$el);
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
.step-btn{
	margin-left:0px;margin-bottom: 5px;
}
</style>
