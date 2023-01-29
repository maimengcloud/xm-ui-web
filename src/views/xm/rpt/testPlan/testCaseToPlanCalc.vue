<template>
	<section>

		
			<el-row :gutter="5" >
				<el-col :span="18"> 
					<div>
						<div class="main" id="testPlanCaseExecStatusDist"
							style="width:100%;height:600px;margin:0 auto;"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form  :model="filters" class="padding">    
						
						<el-form-item label="测试库" v-if="xmTestCasedb && xmTestCasedb.id" >
 							<span >{{xmTestCasedb.id}} <span v-if="xmTestCasedb.name"><br/>{{  xmTestCasedb.name  }} </span> </span>
						</el-form-item>
						<el-form-item label="归属项目"  >
							<xm-project-select  v-if="!xmProject"  ref="xmProjectSelect" style="display:inline;"  :auto-select="false" :link-product-id="xmProductCpd?xmProductCpd.id:null" @row-click="onProjectSelected" @clear="onProjectClear"></xm-project-select>
							<span v-else>{{xmProject.id}} <span v-if="xmProject.name"><br/>{{  xmProject.name  }} </span> </span>
						</el-form-item>
						<el-form-item label="归属产品"  >
							<xm-product-select v-if="!xmProductCpd || !xmProductCpd.id"  ref="xmProductSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProductSelected"  :iterationId="xmTestPlan?xmTestPlan.id:null"  @clear="onProductClear"></xm-product-select>
							<span v-else>{{xmProductCpd.id}} <span v-if="xmProductCpd.productName"><br/>{{  xmProductCpd.productName  }} </span> </span>
						</el-form-item> 
						<el-form-item label="归属迭代" v-if="xmIteration && xmIteration.id">
							<span>  {{xmIteration.id}}
								<span v-if="xmIteration.iterationName"><br/>{{ xmIteration.iterationName  }} </span>
							</span> 
						</el-form-item>  
						<el-form-item label="归属迭代" v-else-if="filters.product && filters.product.id">
							<xm-iteration-select  ref="xmIterationSelect"  :auto-select="false"  :product-id="filters.product?filters.product.id:null" :link-project-id="xmProject?xmProject.id:null"   placeholder="迭代"  @row-click="onIterationSelected" @clear="onIterationClear"></xm-iteration-select>
						</el-form-item> 
						<el-form-item label="测试计划" v-if="xmTestPlan && xmTestPlan.id">
 							<span>  {{xmTestPlan.id}}
								<span v-if="xmTestPlan.name"><br/>{{ xmTestPlan.name  }} </span>
							</span> 
						</el-form-item>  
						<el-form-item label="测试计划" v-else-if="filters.product && filters.product.id">
							<span v-if="filters.testPlan">{{ filters.testPlan.name }}</span>
							<el-button v-if="filters.testPlan" type="text" @click="filters.testPlan=null" plain icon="el-icon-circle-close">清除</el-button>
							<el-button v-if="!filters.testPlan" type="text" @click="$refs['xmTestPlanSelectRef'].open()" plain>选择计划</el-button>
						</el-form-item> 
					<el-form-item>
						 <el-button type="primary" icon="el-icon-search" @click="searchXmTestPlanCaseExecStatusDist">查询</el-button>
					</el-form-item>  
					</el-form>
				</el-col> 
			</el-row>
			<xm-test-plan-select  ref="xmTestPlanSelectRef" :casedb-id="xmTestCasedb?xmTestCasedb.id:null" :product-id="xmProduct?xmProduct.id:null" :project-id="xmProject?xmProject.id:null"   placeholder="迭代"  @select="onXmTestPlanSelected" @clear="onXmTestPlanClear"></xm-test-plan-select >

 
 	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	  
	import { getXmTestCaseToPlanCalcList } from '@/api/xm/core/xmTestPlanCase';
	
	import  XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';//项目
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//产品
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect';//迭代选择界面
	import  xmTestPlanSelect from '@/views/xm/core/xmTestPlan/XmTestPlanSelect';//计划选择器

	export default { 
        
		components: {   
			XmProjectSelect,XmProductSelect,XmIterationSelect,xmTestPlanSelect,
		},
        props:['xmProject','xmProduct','xmIteration','xmTestCasedb','xmTestPlan'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			xmTestCaseToPlanCalcListCpd(){
				if(!this.xmTestCaseToPlanCalcList || this.xmTestCaseToPlanCalcList.length==0){
					return []
				}else{   
					var names=this.legendCpd;
					var datas=[]
					this.xmTestCaseToPlanCalcList.forEach(i=>{
						var nameIndex=0;
						if(i.useTimes<=2){
							nameIndex=i.useTimes
						}else if(i.useTimes>=3 && i.useTimes<=5){
							nameIndex=3
						}else if(i.useTimes>5 && i.useTimes<=10){
							nameIndex=4
						}else if(i.useTimes>10){
							nameIndex=5
						}
						var data={name:names[nameIndex],value:i.caseNum}
						datas.push(data)
					})
					return datas;
				} 
			},
			title(){
				return  '测试用例规划分析'
			},
			/**0-未测，1-通过，2-受阻，3-忽略，4-失败 */
			legendCpd(){ 
				 return ['0次','1次','2次','3-5次','5-10次','10次以上']
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
			xmTestCaseToPlanCalcListCpd(){
				this.drawCharts();
			}
	    },
		data() {
			return {
                filters:{ 
                    product:null, 
                    project:null,
					testPlan:null,
					iteration:null,
					testCasedb:null,
                }, 
				 
				dicts:{testStepTcode:[]},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmTestCaseToPlanCalcList:[],
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
							trigger: 'item',
							formatter:'{b} {c}个 {d}%',
						},
						
						toolbox: {
							show: true,
							right:"20px",
							feature: {
								dataView: { show: true, readOnly: false },  
								saveAsImage: { show: true }, 
							}
						}, 
						calculable: true,
						
						legend: { 
							top:'5%',
							left: 'center',
							data:this.legendCpd,
						},
						series: [
							{
							type: 'pie',
							radius: '50%',
							data: this.xmTestCaseToPlanCalcListCpd,
							emphasis: {
								itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},

							label: {
								show: true, 
								formatter:'{b} {c}个 {d}%',
							},
							}
						]
					}
				)
			},
			onXmQuestionSomeFieldsChange(fieldName,$event){
				this.xmTestCaseToPlanCalcList=[]
			},
			searchXmTestPlanCaseExecStatusDist(){ 

				var params={ } 
				if(this.filters.product && this.filters.product.id){
					params.productId=this.filters.product.id
				}
				
				if(this.filters.project && this.filters.project.id){
					params.projectId=this.filters.project.id
				} 
				if(this.filters.iteration && this.filters.iteration.id){
					params.linkIterationId=this.filters.iteration.id
				} 
				if(this.filters.testPlan && this.filters.testPlan.id){
					params.planId=this.filters.testPlan.id
				}
				if(this.filters.testCasedb && this.filters.testCasedb.id){
					params.casedbId=this.filters.testCasedb.id
				}
 					getXmTestCaseToPlanCalcList(params).then(res=>{
						this.xmTestCaseToPlanCalcList=res.data.data
					})
				 
			}, 

			onProjectSelected(project){
				this.filters.project=project
			},
			
			onProjectClear(){
				this.filters.project=null
				
			},
			onProductSelected(product){
				this.filters.product=product
			},
			
			onProductClear(){
				this.filters.product=null
				
			},

			onIterationSelected(iteration){
				this.filters.iteration=iteration
			},

			onIterationClear(){
				this.filters.iteration=null
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
			open(){
				this.visible=true;
				this.filters.testPlan=this.xmTestPlan
				this.filters.product=this.xmProduct
				this.filters.project=this.xmProject
				this.filters.iteration=this.xmIteration
				this.filters.testCasedb=this.xmTestCasedb
				 
				this.searchXmTestPlanCaseExecStatusDist();  
				
			}
		},//end method
		mounted() { 
 			initSimpleDicts('all',['testStepTcode'] ).then(res=>{
				this.dicts=res.data.data;
			})  
			this.initData();
			this.open(); 
			
		}//end mounted
	}

</script>

<style scoped>
   .image {
    width: 100%;
    display: block;
  }
</style>