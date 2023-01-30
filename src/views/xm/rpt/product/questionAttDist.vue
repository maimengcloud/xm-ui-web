<template>
	<section>
			<el-row :gutter="5" >
				<el-col :span="18"> 
					<div>
						<div class="main" id="xmQuestionAttDist"
							style="width:100%;height:600px;margin:0 auto;"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form   :model="filters" class="padding">
						<el-form-item label="分组属性">
							<el-select   v-model="groupBy"  @change="onXmQuestionSomeFieldsChange('groupBy',$event)" clearable>
								<el-option v-for="i in this.groupBys" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>        
						
						<el-form-item label="测试库" v-if="xmTestCasedb && xmTestCasedb.id" >
 							<span >{{xmTestCasedb.id}} <span v-if="xmTestCasedb.name"><br/>{{  xmTestCasedb.name  }} </span> </span>
						</el-form-item>
						<el-form-item label="归属项目">
							<xm-project-select  v-if="!xmProject"  ref="xmProjectSelect" style="display:inline;"  :auto-select="false" :link-product-id="xmProductCpd?xmProductCpd.id:null" @row-click="onProjectSelected"  @clear="onProjectClear"></xm-project-select>
							<span v-else>{{xmProject.id}} <span v-if="xmProject.name"><br/>{{  xmProject.name  }} </span> </span>
						</el-form-item> 
						<el-form-item label="归属产品"  >
							<xm-product-select v-if="!xmProductCpd || !xmProductCpd.id"  ref="xmProductSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProductSelected"  :iterationId="xmIteration?xmIteration.id:null"  @clear="onProductClear"></xm-product-select>
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
						<el-form-item label="缺陷状态" prop="bugStatus">
							<el-select   v-model="filters.bugStatus"  @change="onXmQuestionSomeFieldsChange('bugStatus',$event)" clearable>
								<el-option v-for="i in this.dicts.bugStatus" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>  
						<el-form-item  label="缺陷类型" prop="bugType" >
							<el-select v-model="filters.bugType"  @change="onXmQuestionSomeFieldsChange('bugType',$event)" clearable>
								<el-option v-for="i in this.dicts.bugType" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item> 
						<el-form-item  label="缺陷原因" prop="bugReason">
							<el-select v-model="filters.bugReason"  @change="onXmQuestionSomeFieldsChange('bugReason',$event)" clearable>
								<el-option v-for="i in this.dicts.bugReason" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item> 
						<el-form-item  label="严重程度" prop="bugSeverity" >
							<el-select v-model="filters.bugSeverity"  @change="onXmQuestionSomeFieldsChange('bugSeverity',$event)" clearable>
								<el-option v-for="i in this.dicts.bugSeverity" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item> 
					<el-form-item  label="优先级" prop="priority" >
						<el-select v-model="filters.priority" @change="onXmQuestionSomeFieldsChange('priority',$event)" clearable>
								<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option>
						</el-select>
					</el-form-item>  
					<el-form-item  label="解决方案" prop="solution" >
						<el-select v-model="filters.solution" @change="onXmQuestionSomeFieldsChange('solution',$event)" clearable>
								<el-option v-for="i in dicts.bugSolution" :label="i.name" :key="i.id" :value="i.id"></el-option>
						</el-select>
					</el-form-item>  

					<el-form-item  label="重现频率" prop="repRate" >
						<el-select v-model="filters.repRate" @change="onXmQuestionSomeFieldsChange('repRate',$event)" clearable>
								<el-option v-for="i in dicts.bugRepRate" :label="i.name" :key="i.id" :value="i.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						 <el-button type="primary" icon="el-icon-search" @click="searchXmQuestionAttDist">查询</el-button>
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
	  
	import { getXmQuestionAttDist } from '@/api/xm/core/xmQuestion';
	
	import  XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';//项目选择
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//产品选择界面
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect';//迭代选择界面
	import  xmTestPlanSelect from '@/views/xm/core/xmTestPlan/XmTestPlanSelect';//计划选择器

	export default { 
        
		components: {   
			XmProjectSelect,XmIterationSelect,XmProductSelect,xmTestPlanSelect,
		},
        props:['xmProject','xmProduct','xmIteration','xmTestCasedb','xmTestPlan',],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			xmQuestionAttDistsCpd(){
				if(!this.xmQuestionAttDists || this.xmQuestionAttDists.length==0){
					return []
				}else{ 
					var itemId="";
					if(this.groupBy=='bug_status'){
						itemId="bugStatus"
					}else if(this.groupBy=='bug_type'){
						itemId="bugType"
					}else if(this.groupBy=='bug_reason'){
						itemId="bugReason"
					}else if(this.groupBy=='bug_severity'){
						itemId="bugSeverity"
					}else if(this.groupBy=='priority'){
						itemId="priority"
					} else if(this.groupBy=='solution'){
						itemId="bugSolution"
					} else if(this.groupBy=='rep_rate'){
						itemId="bugRepRate"
					} 
					return this.xmQuestionAttDists.map(i=>{
						var data={...i}
						data.name=this.formatDict(itemId,data.name)
						return data;
					})
				}
			},
			title(){
				return this.groupBys.find(i=>i.id==this.groupBy).name+'数量分布'
			},
			legendCpd(){
				var itemId="";
				if(this.groupBy=='bug_status'){
					itemId="bugStatus"
				}else if(this.groupBy=='bug_type'){
					itemId="bugType"
				}else if(this.groupBy=='bug_reason'){
					itemId="bugReason"
				}else if(this.groupBy=='bug_severity'){
					itemId="bugSeverity"
				}else if(this.groupBy=='priority'){
					itemId="priority"
				} else if(this.groupBy=='solution'){
					itemId="bugSolution"
				} else if(this.groupBy=='rep_rate'){
					itemId="bugRepRate"
				} 

				return this.dicts[itemId].map(i=>i.name)
			},
			title(){
				
				var preName=""
				if(this.filters.testPlan && this.filters.testPlan.id){
					preName=`测试计划【${this.filters.testPlan.name}】`
				}else if(this.filters.testCasedb && this.filters.testCasedb.id){
					preName=`测试库【${this.filters.testCasedb.name}】`
				}else if(this.filters.iteration && this.filters.iteration.id){
					preName=`迭代【${this.filters.iteration.iterationName}】`
				}else if(this.filters.project && this.filters.project.id){ 
					if(this.filters.project.name){
						preName=`项目【${this.filters.project.name}】`
					}else{
						preName=`项目【${this.filters.project.id}】`
					}
				}else if(this.filters.product && this.filters.product.id){
					if(this.filters.product.productName){
						preName=`产品【${this.filters.product.productName}】`
					}else{
						preName=`产品【${this.filters.product.id}】`
					}
					
				}
				return  preName+'缺陷属性数量分布' 
				
			},
			xmProductCpd(){
				if(this.xmIteration && this.xmIteration.id){
					return {id:this.xmIteration.productId,productName:this.xmIteration.productName}
				}
				if(this.xmProduct && this.xmProduct.id){
					return this.xmProduct
				}
				return null;
			}
			
        }, 
		watch: {  
			xmQuestionAttDistsCpd(){
				this.drawCharts();
			}
	    },
		data() {
			return {
				id:Math.floor(Math.random() * 10000000),
                filters:{
                    product:null, 
                    project:null,
					testPlan:null,
					iteration:null,
					testCasedb:null,
                },
				groupBy:'bug_status',
				groupBys:[
					{id:'bug_status', name:'缺陷状态'},
					{id:'bug_type', name:'缺陷类型'},
					{id:'bug_reason', name:'缺陷原因'},
					{id:'bug_severity', name:'紧急程度'},
					{id:'priority', name:'优先级'},
					{id:'solution', name:'解决方案'},
					{id:'rep_rate', name:'复现频率'},
					
				],
				dicts:{
					'bugSeverity':[],'bugSolution':[],'bugStatus':[],'bugType':[],'priority':[],'bugRepRate':[],'bugReason':[]
				},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmQuestionAttDists:[],

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
			 findMax( list ) {
				var i, max = list[0];
				
				if(list.length < 2) return max;
			
				for (i = 0; i < list.length; i++) {
					if (list[i].distBudgetWorkload > max.distBudgetWorkload) {
						max = list[i];
					}
				}
				return max;
			}, 
			open(){
				this.visible=true;
				this.filters.testPlan=this.xmTestPlan
				this.filters.product=this.xmProduct
				this.filters.project=this.xmProject
				this.filters.iteration=this.xmIteration
				this.filters.testCasedb=this.xmTestCasedb
				this.searchXmQuestionAttDist()
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("xmQuestionAttDist")); 
				this.myChart.setOption(   
					{
						
						title: {
							text: this.title, 
							left: 'center'
						}, 
						tooltip: {
							trigger: 'item',
							
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
							data: this.xmQuestionAttDistsCpd,
							emphasis: {
								itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},

							label: {
								show: true, 
								formatter:'{b}: {c}  ({d}%)' 
							},
							}
						]
					}
				)
			},
			onXmQuestionSomeFieldsChange(fieldName,$event){
				this.xmQuestionAttDists=[]
			},
			searchXmQuestionAttDist(){
				if(!this.groupBy){
					this.$notify({position:'bottom-left',showClose:true,message:'请选中分组属性',type:'warning'})
					return 
				}
				var params={}
				if(this.filters.solution){
					params.solution=this.filters.solution
				}
				if(this.filters.bugType){
					params.bugType=this.filters.bugType
				}
				if(this.filters.bugStatus){
					params.bugStatus=this.filters.bugStatus
				}
				if(this.filters.bugReason){
					params.bugReason=this.filters.bugReason
				}
				if(this.filters.bugSeverity){
					params.bugSeverity=this.filters.bugSeverity
				}
				if(this.filters.repRate){
					params.repRate=this.filters.repRate
				}
				if(this.filters.priority){
					params.priority=this.filters.priority
				} 

				if(this.filters.project){
					params.projectId=this.filters.project.id
				} 
				if(this.filters.product){
					params.productId=this.filters.product.id
				} 
				if(this.filters.iteration){
					params.linkIterationId=this.filters.iteration.id
				}
				if(this.filters.testPlan && this.filters.testPlan.id){
					params.planId=this.filters.testPlan.id
				}
				if(this.filters.testCasedb && this.filters.testCasedb.id){
					params.casedbId=this.filters.testCasedb.id
				}
				params.groupBy=this.groupBy 
				getXmQuestionAttDist(params).then(res=>{
					this.xmQuestionAttDists=res.data.data
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
		},//end method
		mounted() { 
 			initSimpleDicts('all',['bugSeverity','bugSolution','bugStatus','bugType','priority','bugRepRate','bugReason'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
			//this.charts();
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