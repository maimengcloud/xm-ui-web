<template>
	<section class="page-container border">
		<el-row> 
			<el-col :span="24">
				<el-tabs type="border-card"  :value="showPanel" @tab-click="tabClick"> 
					<el-tab-pane  lazy @click.stop="iterationVisible=!iterationVisible" name="iterations" disabled> 
						<div  slot="label">
							<el-popover
								placement="right"
								width="400"
								trigger="click"> 
								<xm-iteration-select :auto-select="true" :sel-project="selProject" :product-id="xmProduct?xmProduct.id:null"  @row-click="onIterationRowClick" @clear-select="onIterationClearSelect"></xm-iteration-select>
 								<el-link type="warning" slot="reference"  icon="el-icon-search"><font style="font-size:14px;">{{xmIteration?xmIteration.iterationName:'选择迭代'}}</font></el-link> 
							</el-popover> 
						</div>
					</el-tab-pane>
					<el-tab-pane label="迭代概览" lazy  name="iterationOverview" v-if="xmIteration && xmIteration.id">
						<xm-iteration-overview v-if="xmIteration && showPanel=='iterationOverview'"  :xm-iteration="xmIteration" :sel-project="selProject"></xm-iteration-overview>
					</el-tab-pane>
					<el-tab-pane label="产品、战略"   name="products" v-if="!xmProduct&&xmIteration&&xmIteration.id">
						 <xm-product-mng  v-if="xmIteration && showPanel=='products'"    :xm-iteration="xmIteration" :sel-project="selProject"></xm-product-mng>
 					</el-tab-pane>
					<el-tab-pane label="项目"   name="projects" v-if="!selProject&&xmIteration&&xmIteration.id">
  						<xm-project-for-link v-if="xmIteration && showPanel=='projects'"  :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-project-for-link>
					</el-tab-pane>
					<el-tab-pane label="需求" lazy name="menus" v-if="xmIteration&&xmIteration.id">
						<xm-menu-mng v-if="xmIteration && showPanel=='menus'" :xm-product="xmProduct"  :xm-iteration="xmIteration" :sel-project="selProject" :disabled-mng="false"></xm-menu-mng>
					</el-tab-pane>
					<el-tab-pane label="任务" lazy name="tasks" v-if="xmIteration&&xmIteration.id">
						<xm-task-mng v-if="xmIteration && showPanel=='tasks'" :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-task-mng>
					</el-tab-pane> 
					<el-tab-pane label="缺陷" lazy name="bugs" v-if="xmIteration&&xmIteration.id">
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
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { delXmIterationLink } from '@/api/xm/core/xmIterationLink';

 	import XmIterationSelect from './XmIterationSelect.vue'
	import XmMenuMng from '../xmMenu/XmMenuMng.vue'
	import XmIterationStateShow from '../xmIterationState/XmIterationStateShow.vue'
	import { mapGetters } from 'vuex'
	import XmProductMng from '../xmProduct/XmProductMng.vue';
	import XmProjectForLink from '../xmProject/XmProjectForLink.vue';
	import XmTaskMng from '../xmTask/XmTaskMng.vue';
	import XmQuestionMng from '../xmQuestion/XmQuestionMng.vue';
	import XmIterationOverview from "./XmIterationOverview";


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
				xmIteration:null,
				showPanel:'iterationOverview',//menus,tasks,bugs,iterationStateShow
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
				this.xmIteration=null;
			},
			tabClick(tab){
				if(this.xmIteration==null || !this.xmIteration.id){
					this.iterationVisible=true;
					this.$notify({showClose: true, message:"请先选中左边迭代", type: 'warning' });
					return;
				} 
				
				if(tab.name=='iterations'){
					this.iterationVisible=!this.iterationVisible;
					return;
				}
				this.showPanel=tab.name 
			},
			doDelXmIterationLink(){
				this.$confirm('移出后，迭代试图将看不到该产品信息，确认将产品【'+this.xmProduct.productName+'】从迭代【'+this.xmIteration.iterationName+'】移出吗？', '提示', {}).then(() => {
					var params={iterationId:this.xmIteration.id,productId:this.xmProduct.id}
					delXmIterationLink(params).then(res=>{
						var tips = res.data.tips;
						if(tips.isOk){
							this.$notify({showClose: true, message:"移出成功", type: tips.isOk?'success':'error' });
						}
					})
				})
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
