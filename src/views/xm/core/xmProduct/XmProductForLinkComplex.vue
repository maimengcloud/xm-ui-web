<template>
	<section>
		<el-row> 
			<el-col :span="24">
				<el-tabs   :value="showPanel"  @tab-click="tabClick">
					<el-tab-pane disabled> 
						<div  slot="label">
								<xm-product-select ref="xmProductSelect" :auto-select="true" :link-project-id="selProject?selProject.id:null" :iterationId="xmIteration?xmIteration.id:null"  @row-click="onProductRowClick" @clear="onProductClearSelect"></xm-product-select>
						</div>
					</el-tab-pane>
					<el-tab-pane disabled> 
						<div  slot="label">
							<el-popover
								placement="bottom"
								width="800"
								v-model="addProductVisible"
								trigger="manual"> 
								<xm-product-add  @cancel="addProductVisible=false"  :sel-project="selProject"  @submit="afterAddProductSubmit"></xm-product-add>
 								 <el-link type="warning" slot="reference" @click="addProductVisible=true" icon="el-icon-plus">产品</el-link> 
							</el-popover> 
						</div>
					</el-tab-pane>
					<el-tab-pane label="产品概览"   name="productOverview" v-if="xmProduct && xmProduct.id">
						 <xm-product-overview v-if="xmProduct && showPanel=='productOverview'"  :xm-product="xmProduct" :sel-project="selProject"></xm-product-overview>

          			</el-tab-pane>

					  
					<el-tab-pane label="产品详情"   name="detail" v-if="xmProduct && xmProduct.id">
						 <xm-product-edit  v-if="showPanel=='detail'" :xm-product="xmProduct"></xm-product-edit>

          			</el-tab-pane>
					<el-tab-pane label="配置关联的项目" lazy  name="productProjectLink" v-if="xmProduct && xmProduct.id && !selProject">
						<xm-product-project-link-mng  v-if="showPanel=='productProjectLink'" :xm-product="xmProduct"></xm-product-project-link-mng>
					</el-tab-pane> 
					<el-tab-pane label="迭代"   name="iterationProductLink" v-if="xmProduct && xmProduct.id" >
						<xm-iteration-mng v-if="showPanel=='iterationProductLink'" :xm-product="xmProduct"></xm-iteration-mng>
					</el-tab-pane> 
					<el-tab-pane label="需求" lazy name="menus" v-if="xmProduct && xmProduct.id">
						<xm-menu-mng v-if="xmProduct && showPanel=='menus'"   :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"  :disabled-mng="true"></xm-menu-mng>
					</el-tab-pane>
					<el-tab-pane label="任务" lazy name="tasks"  v-if="xmProduct && xmProduct.id">
						<xm-task-mng v-if="xmProduct && showPanel=='tasks'" queryScope="task" ptype="0" :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject"></xm-task-mng>
					</el-tab-pane>
					<el-tab-pane label="缺陷" lazy name="bugs" v-if="xmProduct && xmProduct.id">
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
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import XmIterationMng from '../xmIteration/XmIterationMng.vue'
	import XmMenuMng from '../xmMenu/XmMenuBox.vue'
	import XmIterationStateShow from '../xmIterationState/XmIterationStateShow.vue'
	import { mapGetters } from 'vuex'
import XmProductMng from './XmProductMng.vue';
import XmTaskMng from '../xmTask/XmTaskMng.vue';
import XmQuestionMng from '../xmQuestion/XmQuestionMng.vue'; 
import XmProjectForLink from '../xmProject/XmProjectForLink.vue';

import XmProductSelect from '@/views/xm/core/components/XmProductSelect.vue';
import XmProductProjectForLink from './XmProductProjectForLink.vue';
import XmProductOverview from "./XmProductOverview"; 
import XmIterationLinkForProduct from '../xmIterationLink/XmIterationLinkForProduct.vue';
import XmProductProjectLinkMng from '../xmProductProjectLink/XmProductProjectLinkMng.vue'; 

import XmProductEdit from './XmProductEdit.vue';
	import  XmProductAdd from './XmProductAdd';//新增界面

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
				productVisible:true,
				addProductVisible:false,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {

			/**end 自定义函数请在上面加**/
			onProductRowClick(xmProduct){

				this.xmProduct=xmProduct
			},
			afterAddProductSubmit(product){ 
				this.$refs.xmProductSelect.xmProducts.push(product)
				this.$refs.xmProductSelect.rowClick(product)
				this.addProductVisible=false;
			},
			onProductClearSelect(){
				this.xmProduct=null;
			},
			tabClick(tab){
				if(this.xmProduct==null || !this.xmProduct.id){
					this.productVisible=true;
					this.$notify({position:'bottom-left',showClose:true,message:"请先选中左边产品", type: 'warning'});
				}
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
			XmProjectForLink,
			XmProductProjectForLink,
			XmProductOverview,
			XmProductAdd,
			XmIterationLinkForProduct,
			XmProductProjectLinkMng,
			XmProductEdit,
	  
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
