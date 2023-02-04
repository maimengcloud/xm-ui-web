<template>
	<section>

		
			<el-row :gutter="5" >
				<el-col :span="showParams?23:24"> 
					<div>
						<div class="echart-box" :id="this.id"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="showParams?1:0" v-if="showParams"> 
					 <el-popover   trigger="manual" v-model="filterVisible" style="float:right;" width="500">
						<el-button slot="reference" style="margin-top:10px;margin-right:10px;z-index: 99999;" icon="el-icon-more" @click="filterVisible=!filterVisible"></el-button> 
						<el-row>
							<el-button type="danger" icon="el-icon-delete" @click="$emit('delete',cfg)">从报告移出该报表</el-button>
							<el-button icon="el-icon-close" style="float:right;" @click="filterVisible=false">关闭</el-button>
						</el-row>
						<el-row>
							<el-form :model="params" class="padding"   :style="{width:'100%',overflow: 'auto'}" ref="filtersRef">
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
									<el-button type="primary"  style="float:right;" icon="el-icon-search" @click="searchXmTestPlanCaseUserDist">查询</el-button>
								</el-form-item>  
							</el-form>
						</el-row>
					 </el-popover>
					
				</el-col> 
			</el-row>
			<xm-test-plan-select  ref="xmTestPlanSelectRef" :casedb-id="xmTestCasedb?xmTestCasedb.id:null" :product-id="xmProduct?xmProduct.id:null" :project-id="xmProject?xmProject.id:null"   placeholder="迭代"  @select="onXmTestPlanSelected" @clear="onXmTestPlanClear"></xm-test-plan-select >

 
 	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	  
	import { getXmTestPlanCaseUserDist } from '@/api/xm/core/xmTestPlanCase';
	
	import  XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';//项目
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//产品
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect';//迭代选择界面
	import  xmTestPlanSelect from '@/views/xm/core/xmTestPlan/XmTestPlanSelect';//计划选择器

	export default { 
        
		components: {   
			XmProjectSelect,XmProductSelect,XmIterationSelect,xmTestPlanSelect,
		},
        props:['id','cfg','category','showToolBar','showParams','isRptCfg','xmProject','xmProduct','xmIteration','xmTestCasedb','xmTestPlan',],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			 
			hadExecCpd(){
				if(!this.rawDatas ||this.rawDatas.length==0){
					return []
				}else{ 
					return this.rawDatas.map(i=>i.hadExec)
				}
			}, 
			
			notExecCpd(){
				if(!this.rawDatas ||this.rawDatas.length==0){
					return []
				}else{ 
					return this.rawDatas.map(i=>i.notExec)
				}
			}, 
			legendCpd(){
				if(!this.rawDatas ||this.rawDatas.length==0){
					return []
				}else{ 
					return this.rawDatas.map(i=>i.execUsername)
				}
				
			},
			rawDatasCpd(){
				if(!this.rawDatas || this.rawDatas.length==0){
					return []
				}else{   
					var datas=[]
					this.rawDatas.forEach(i=>{
						var data={}
						var itemId="testPlanTcode"; 
						data.name=this.formatDict(itemId,i.execStatus)
						data.value=i.totalCnt
						datas.push(data)
					})
					return datas;
				} 
			},
			titleCpd(){
				var preName=""
				if(this.filters.testPlan && this.filters.testPlan.id){
					preName=`测试计划【${this.filters.testPlan.name}】`
				}else if(this.filters.testCasedb && this.filters.testCasedb.id){
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
				return  preName+ '测试用例执行结果数量分布'
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
			rawDatasCpd(){
				this.drawCharts();
			}
	    },
		data() {
			return {
                
                filterVisible:false,
				filters:{ 
                    product:null, 
                    project:null,
					testPlan:null,
					iteration:null,
					testCasedb:null,
                }, 
				params:{

				},
				title:'',//报表配置项
				remark:'', //报表配置项
				 
				dicts:{testPlanTcode:[]},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				rawDatas:[],
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
							left: 'center'
						}, 
						
						tooltip: {
							trigger: 'item', 
						},
						barMaxWidth: 100,
						toolbox: {
							show: true,
							top:"5%",
							right:"10px",
							feature: {
							dataView: { show: true, readOnly: false },
							magicType: { show: true, type: ['line', 'bar'] },
							
							saveAsImage: { show: true }
							}
						},

						calculable: true,
						
						legend: {
							bottom: 'bottom',
							data: ['已执行', '未执行']
						},
						xAxis: {
							type: 'category',
							data: this.legendCpd
						},
						yAxis: {
							type: 'value'
						},
						series: [ 
							{
								name: '已执行',
								type: 'bar', 
								data: this.hadExecCpd, 
								label:{
									show: true, 
								}, 
							},
							{
								name: '未执行',
								type: 'bar',  
								data: this.notExecCpd,
								label:{
									show: true, 
								}, 
							},
						]
					}
				)
			},
			searchXmTestPlanCaseUserDist(){ 
				var params={...this.params }  
				getXmTestPlanCaseUserDist(params).then(res=>{
					this.rawDatas=res.data.data
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
				this.searchXmTestPlanCaseUserDist();   
			}
		},//end method
		mounted() { 
 			initSimpleDicts('all',['testPlanTcode'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
			this.initData();   
            //this.maxTableHeight = util.calcTableMaxHeight(this.$refs.filtersRef.$el)
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