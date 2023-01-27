<template>
	<section>

		<el-dialog fullscreen :title="title" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			<el-row :gutter="5" v-if="visible">
				<el-col :span="18"> 
					<div>
						<div class="main" id="testPlanCaseExecStatusDist"
							style="width:100%;height:600px;margin:0 auto;"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border padding">
					<el-form  :model="filters">   
						
						
						<el-form-item label="归属产品"  >
							<xm-product-select v-if="!xmProductCpd || !xmProductCpd.id"  ref="xmProductSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProductSelected"  :iterationId="xmTestPlan?xmTestPlan.id:null"  @clear="onProductClear"></xm-product-select>
							<span v-else>{{xmProductCpd.id}} <span v-if="xmProductCpd.productName"><br/>{{  xmProductCpd.productName  }} </span> </span>
						</el-form-item>
						<el-form-item label="测试计划" v-if="xmTestPlan && xmTestPlan.id">
 							<span>  {{xmTestPlan.id}}
								<span v-if="xmTestPlan.name"><br/>{{ xmTestPlan.name  }} </span>
							</span> 
						</el-form-item>  
						<el-form-item label="测试计划" v-else-if="filters.product && filters.product.id">
							<span v-if="filters.testPlan">{{ filters.testPlan.name }}</span><el-button type="primary" @click="$refs['xmTestPlanSelectRef'].open()">选择计划</el-button>
						</el-form-item> 
						 
						<el-form-item label="归属项目"  >
							<xm-project-select  v-if="!xmProject"  ref="xmProjectSelect" style="display:inline;"  :auto-select="false" :link-product-id="xmProductCpd?xmProductCpd.id:null" @row-click="onProjectSelected" @clear="onProjectClear"></xm-project-select>
							<span v-else>{{xmProject.id}} <span v-if="xmProject.name"><br/>{{  xmProject.name  }} </span> </span>
						</el-form-item>
					<el-form-item>
						 <el-button type="primary" icon="el-icon-search" @click="searchXmTestPlanCaseExecStatusDist">查询</el-button>
					</el-form-item>  
					</el-form>
				</el-col>
				<xm-test-plan-select  ref="xmTestPlanSelectRef" :casedb-id="xmTestCasedb?xmTestCasedb.id:null" :product-id="xmProduct?xmProduct.id:null" :project-id="xmProject?xmProject.id:null"   placeholder="迭代"  @select="onXmTestPlanSelected" @clear="onXmTestPlanClear"></xm-test-plan-select >
			</el-row>
        </el-dialog>

		
 	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	  
	import { getXmTestPlanCaseExecStatusDist } from '@/api/xm/core/xmTestPlanCase';
	
	import  XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';//项目
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//产品
	import  xmTestPlanSelect from '@/views/xm/core/xmTestPlan/XmTestPlanSelect';//计划选择器

	export default { 
        
		components: {   
			XmProjectSelect,XmProductSelect,xmTestPlanSelect,
		},
        props:['xmProject','xmProduct','xmTestCasedb','xmTestPlan'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			xmTestPlanCaseExecStatusDistsCpd(){
				if(this.xmTestPlanCaseExecStatusDists.length==0){
					return []
				}else{   
					var datas=[]
					this.xmTestPlanCaseExecStatusDists.forEach(i=>{
						var data={}
						var itemId="testStepTcode"; 
						data.name=this.formatDict(itemId,i.execStatus)
						data.value=i.totalCnt
						datas.push(data)
					})
					return datas;
				} 
			},
			title(){
				return  '测试用例执行结果数量分布'
			},
			/**0-未测，1-通过，2-受阻，3-忽略，4-失败 */
			legendCpd(){
				var itemId="testStepTcode"; 
				return this.dicts[itemId].map(i=>this.formatDict(itemId,i.id))
			}, 
			
			xmProductCpd(){
				if(this.xmTestPlan && this.xmTestPlan.id){
					return {id:this.xmTestPlan.productId,productName:this.xmTestPlan.productName}
				}
				if(this.xmProduct && this.xmProduct.id){
					return this.xmProduct
				}
				return null;
			}
        }, 
		watch: {  
			xmTestPlanCaseExecStatusDistsCpd(){
				this.drawCharts();
			}
	    },
		data() {
			return {
                filters:{ 
					testPlan:null,
					product:null,
					project:null,
                }, 
				 
				dicts:{testStepTcode:[]},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmTestPlanCaseExecStatusDists:[],
				conditionBtnVisible:false,

			}//end return
		},//end data
		methods: { 
			formatDict(itemId,val){
				var dict=this.dicts[itemId]
				if(dict){
					var item=dict.find(i=>i.id==val)
					if(item){
						return item.name
					}
				}
				return val;
			}, 
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("testPlanCaseExecStatusDist")); 
				this.myChart.setOption(   
					{
						title: {
							text: this.title, 
							left: 'center'
						},
						tooltip: {
							trigger: 'item'
						},
						legend: { 
							top:'5%',
							left: 'center',
							data:this.legendCpd,
						},
						series: [
							{
							type: 'pie',
							radius: '50%',
							data: this.xmTestPlanCaseExecStatusDistsCpd,
							emphasis: {
								itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},

							label: {
								show: true,
								position: 'center'
							},
							}
						]
					}
				)
			},
			onXmQuestionSomeFieldsChange(fieldName,$event){
				this.xmTestPlanCaseExecStatusDists=[]
			},
			searchXmTestPlanCaseExecStatusDist(){ 

				var params={ } 
				if(this.filters.product && this.filters.product.id){
					params.productId=this.filters.product.id
				}
				
				if(this.filters.project && this.filters.project.id){
					params.projectId=this.filters.project.id
				}

				
				if(this.filters.project && this.filters.project.id){
					params.projectId=this.filters.project.id
				}

				
				if(this.filters.testPlan && this.filters.testPlan.id){
					params.planId=this.filters.testPlan.id
				}
				if(this.filters.testCasedb && this.filters.testCasedb.id){
					params.casedbId=this.filters.testCasedb.id
				}
				if(params.productId || params.projectId || params.planId || params.casedbId){
					getXmTestPlanCaseExecStatusDist(params).then(res=>{
						this.xmTestPlanCaseExecStatusDists=res.data.data
					})
				}else{
					this.$message.error("请选择查询条件，产品、项目、测试计划最少选择一个")
				}
			},
			onProductSelected(product){
				this.filters.product=product
			},
			
			onProductClear(){
				this.filters.product=null
				
			},
			
			onProjectSelected(project){
				this.filters.project=project
			},
			
			onProjectClear(){
				this.filters.project=null
				
			},
			onXmTestPlanSelected(xmTestPlan){
				this.filters.testPlan=xmTestPlan
			},
			
			onXmTestPlanClear(){
				this.filters.testPlan=null
			},
			initData(){
				if(this.xmTestPlan){ 
					this.filters.testPlan=this.xmTestPlan
				} 
			}, 
			sizeAutoChange(){
				this.myChart.resize();
			},
			open(params){
				this.visible=true;
				this.filters.testPlan=this.xmTestPlan
				this.filters.product=this.xmProduct
				this.filters.project=this.xmProject
				this.filters.testCasedb=this.xmTestCasedb
				
				if(this.xmTestPlan && this.xmTestPlan.id){ 
						this.searchXmTestPlanCaseExecStatusDist(); 
					
				}
				
			}
		},//end method
		mounted() { 
 			initSimpleDicts('all',['testStepTcode'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
			this.initData();   
			
		}//end mounted
	}

</script>

<style scoped>
   .image {
    width: 100%;
    display: block;
  }
</style>