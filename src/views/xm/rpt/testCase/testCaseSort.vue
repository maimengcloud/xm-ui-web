<template>
	<section>

		
			<el-row :gutter="5" >
				<el-col :span="18"> 
					<div>
						<div class="echart-box" :id="this.id"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form :model="params" class="padding" :style="{width:'100%',overflow: 'auto'}" ref="filtersRef">        
						<el-form-item label="分组属性">
							<el-select style="width:100px;" size="small"   v-model="params.groupBy">
								<el-option v-for="i in this.groupBys" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>   
						<el-form-item label="测试库" v-if="xmTestCasedb && xmTestCasedb.id" >
 							<span >{{xmTestCasedb.id}} <span v-if="xmTestCasedb.name"><br/>{{  xmTestCasedb.name  }} </span> </span>
						</el-form-item>
						<el-form-item label="归属项目"  >
							<xm-project-select  v-if="!xmProject"  ref="xmProjectSelect" style="display:inline;"  :auto-select="false" :link-product-id="xmProductCpd?xmProductCpd.id:null" @row-click="onProjectSelected" @clear="onProjectClear"></xm-project-select>
							<span v-else>{{xmProject.id}} <span v-if="xmProject.name"><br/>{{  xmProject.name  }} </span> </span>
						</el-form-item>
						<el-form-item label="归属产品"  >
							<xm-product-select v-if="!xmProductCpd || !xmProductCpd.id"  ref="xmProductSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProductSelected"    @clear="onProductClear"></xm-product-select>
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
						
						<el-form-item label="用例状态" prop="caseStatus">
								<el-select style="width:100px;" size="small"   v-model="params.caseStatus" clearable>
									<el-option v-for="i in this.dicts.caseStatus" :label="i.name" :key="i.id" :value="i.id"></el-option>
								</el-select>
							</el-form-item>  
							<el-form-item  label="用例类型" prop="caseType" >
								<el-select style="width:100px;" size="small" v-model="params.bugType" clearable>
									<el-option v-for="i in this.dicts.bugType" :label="i.name" :key="i.id" :value="i.id"></el-option>
								</el-select>
							</el-form-item> 
							<el-form-item  label="测试方式" prop="testType">
								<el-select style="width:100px;" size="small" v-model="params.testType" clearable>
									<el-option v-for="i in this.dicts.testType" :label="i.name" :key="i.id" :value="i.id"></el-option>
								</el-select>
							</el-form-item>  
							<el-form-item  label="优先级别" prop="cpriority" >
								<el-select style="width:100px;" size="small" v-model="params.cpriority" clearable>
										<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option>
								</el-select>
							</el-form-item>
					<el-form-item>
						 <el-button type="primary" icon="el-icon-search" @click="searchXmTestCaseSort">查询</el-button>
					</el-form-item>  
					</el-form>
				</el-col> 
			</el-row>
 	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import {formatterLabel} from '@/api/xm/rpt.js';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	  
	import { getXmTestCaseSort } from '@/api/xm/core/xmTestCase';
	
	import  XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';//项目
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//产品
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect';//迭代选择界面
 
	export default { 
        
		components: {   
			XmProjectSelect,XmProductSelect,XmIterationSelect
		},
        props:['id','cfg','category','showToolBar','showParams','isRptCfg','xmProject','xmProduct','xmIteration','xmTestCasedb','initGroupBy',],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),  

			xmTestCaseSortCpd(){
				if(this.xmTestCaseSort.length==0){
					return []
				}else{ 
					return this.xmTestCaseSort.map(i=>i.value)
				}
			},
			legendCpd(){
				if(this.xmTestCaseSort.length==0){
					return []
				}else{ 
					return this.xmTestCaseSort.map(i=>i.name)
				}
			},
			titleCpd(){
				var preName=""
				if(this.filters.testCasedb && this.filters.testCasedb.id){
					preName=`测试库【${this.filters.testCasedb.name}】`
				}else if(this.filters.iteration && this.filters.iteration.id){
					preName=`迭代【${this.filters.iteration.iterationName}】`
				}else if(this.filters.product && this.filters.product.id){
					if(this.filters.product.productName){
						preName=`产品【${this.filters.product.productName}】`
					}else{
						preName=`产品【${this.filters.product.id}】`
					}
					
				}else if(this.filters.project && this.filters.project.id){ 
					if(this.filters.project.name){
						preName=`项目【${this.filters.project.name}】`
					}else{
						preName=`项目【${this.filters.project.id}】`
					}
				}
				return preName+ this.groupBys.find(i=>i.id==this.params.groupBy).name+'测试用例数量排行榜'
 			}, 
			xmProductCpd(){
				if(this.xmIteration && this.xmIteration.id && this.xmIteration.productId){
					return {id:this.xmIteration.productId,productName:this.xmIteration.productName}
				}
				if(this.xmTestCasedb && this.xmTestCasedb.id && this.xmTestCasedb.productId){
					return {id:this.xmTestCasedb.productId,productName:this.xmTestCasedb.productName}
				}
				if(this.xmProduct && this.xmProduct.id){
					return this.xmProduct
				}
				return null;
			}
        }, 
		watch: {  
			xmTestCaseSortCpd(){
				this.drawCharts();
			}
	    },
		data() {
			return {
                filters:{ 
                    product:null, 
                    project:null, 
					iteration:null,
					testCasedb:null,
					caseStatus:'',
					testType:'',
					cpriority:'',
					caseType:'',
                },  
				params:{
					groupBy:'menu_id',
				},
				title:'',//报表配置项
				remark:'', //报表配置项 
				groupBys:[ 
					{id:'menu_id', name:'故事'}, 
 					{id:'cuserid', name:'负责人'},
					{id:'func_id', name:'模块'},   
					
				],
				dicts:{testPlanTcode:[]},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmTestCaseSort:[],
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
				this.myChart = this.$echarts.init(document.getElementById(this.id)); 
				this.myChart.setOption(      
					{	
						title: {
							text: this.titleCpd, 
							left: 'center', 
						}, 
						
						tooltip: {
							trigger: 'axis', 
						},
						barMaxWidth: 100,
						toolbox: {
							show: true,
							top:"5%", 
							top:"5%",
							right:"10px",
							feature: {
							dataView: { show: true, readOnly: false },
							magicType: { show: true, type: ['line', 'bar'] },
							
							saveAsImage: { show: true }
							}
						},

						calculable: true,
						xAxis: {
							type: 'category',
							data: this.legendCpd,
							axisLabel: { 
								formatter:  formatterLabel
							}
						},
						yAxis: { 
							type: 'value'
						},
						series: [
							{
							data: this.xmTestCaseSortCpd,
							type: 'bar',							
							label:{ 
									show: true,  
								},
							}
						]
					}
				)
			},
			searchXmTestCaseSort(){ 
				var params={ ...this.params}   
				getXmTestCaseSort(params).then(res=>{
					var data=res.data.data
					if(data){
						data.sort((a,b)=>{
							if(a.value<b.value){
								return 1
							}else if(a.value>b.value){
								return -1
							}else{
								return 0
							}
						})
					}
					this.xmTestCaseSort=data
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
			 
			initData(){ 
			}, 
			sizeAutoChange(){
				this.myChart.resize();
			},
			open(){
				this.visible=true; 
				if(this.initGroupBy){
					this.params.groupBy=this.initGroupBy
				} 
				this.filters.testPlan=this.xmTestPlan
				this.filters.product=this.xmProduct
				this.filters.project=this.xmProject
				this.filters.iteration=this.xmIteration
				this.filters.testCasedb=this.xmTestCasedb 

				if( this.filters.testPlan && this.filters.testPlan.id){
					this.params.planId= this.filters.testPlan.id
				} 
				 
				if( this.filters.product && this.filters.product.id){
					this.params.productId= this.filters.product.id
				}
				 
				if( this.filters.project && this.filters.project.id){
					this.params.projectId= this.filters.project.id
				}
				 
				if( this.filters.iteration && this.filters.iteration.id){
					this.params.iterationId= this.filters.iteration.id
				} 
				 
				if( this.filters.testCasedb && this.filters.testCasedb.id){
					this.params.casedbId= this.filters.testCasedb.id
				}
				if(this.cfg && this.cfg.id){
					this.params=this.cfg.params
					this.title=this.cfg.title
					this.remark=this.cfg.remark
				}
				if(this.showToolBar && !this.title){
					this.title="企业工作项每日趋势图"
				}
				this.searchXmTestCaseSort();   
			}
		},//end method
		mounted() { 
 			initSimpleDicts('all',['caseStatus','testType','priority','bugType'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
			this.initData();   
            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.filtersRef.$el)
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