<template>
	<section>
 			
			<el-row :gutter="5" >
				<el-col :span="showParams?23:24"> 
					<el-row :class="{'row-box':true,'cfg':isRptCfg}">
						<div class="title">{{ title?title:(isRptCfg?'标题':'') }}</div>
						<el-input class="input" v-model="title" placeholder="标题"/>
					</el-row> 
					<el-row :class="{'row-box':true,'cfg':isRptCfg}">
						<div class="remark">{{ remark?remark:(isRptCfg?'详细说明':'') }}</div>
						<el-input class="input" v-model="remark" placeholder="说明"/>
					</el-row> 
					<el-row> 
						<div class="echart-box" :id="this.id"></div> 
					</el-row>
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
								 
								<el-form-item label="日期区间">
									<br>
										<mdp-date-range v-model="params" value-format="yyyy-MM-dd" start-key="startBizDate" end-key="endBizDate"></mdp-date-range>
								</el-form-item>    
								
									
								<el-form-item>
									<el-button type="primary"  style="float:right;" icon="el-icon-search" @click="listXmBranchStateHis">查询</el-button>
								</el-form-item>  
							</el-form>
						</el-row>
					 </el-popover>
					
				</el-col> 
			</el-row> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	
	import { listXmBranchStateHis } from '@/api/xm/core/xmBranchStateHis';
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//产品选择界面
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect';//迭代选择界面
	export default { 
        
		components: {   
			XmIterationSelect,XmProductSelect,
		},
        props:['id','cfg','category','showToolBar','showParams','isRptCfg','rptDatas','xmProduct','xmProject','xmIteration'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
            datesCpd(){
				if(this.rawDatas.length==0){
					return []
				}else{ 
					return this.rawDatas.map(i=>i.bizDate)
				}
			}, 
			closedBugsCpd(){
				if(this.rawDatas.length==0){
					return []
				}else{ 
					return this.rawDatas.map(i=>i.closedBugs)
				}
			},
			activeBugsCpd(){
				if(this.rawDatas.length==0){
					return []
				}else{ 
					return this.rawDatas.map(i=> i.activeBugs)
				}
			},
			confirmedBugsCpd(){
				if(this.rawDatas.length==0){
					return []
				}else{ 
					return this.rawDatas.map(i=> i.confirmedBugs)
				}
			},
			
			resolvedBugsCpd(){
				if(this.rawDatas.length==0){
					return []
				}else{ 
					return this.rawDatas.map(i=>i.resolvedBugs)
				}
			},
			titleCpd(){
				return '企业缺陷每日趋势图'
				
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
			datesCpd(){

				this.$nextTick(()=>{
					this.drawCharts();
				})
				 
			}
	    },
		data() {
			return {
                
                filterVisible:false,
				filters:{
                    category:'', 
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
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				rawDatas:[],

			}//end return
		},//end data
		methods: {  
			listXmBranchStateHis(){
				 
				if(this.rptDatas){
					this.rawDatas=this.rptDatas
					return;
				}
				
				var params={...this.params,orderBy:'biz_date asc'} 
				listXmBranchStateHis(params).then(res=>{ 
					this.rawDatas=res.data.tips.isOk?res.data.data:this.rawDatas;
				})
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
				if(this.$refs['xmProductSelect'])this.$refs['xmProductSelect'].clearSelect();
				if(this.$refs['xmIterationSelect'])this.$refs['xmIterationSelect'].clearSelect();
				this.$nextTick(()=>{
					this.listXmBranchStateHis();
				})
				
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
							trigger: 'axis', 
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
							data: ['新提出','执行中','已解决','已关闭']
						},
						xAxis: {
							type: 'category',
							data: this.datesCpd
						},
						yAxis: {
							type: 'value'
						},
						series: [
							{
								name:'新提出',
								data: this.activeBugsCpd,
								type: 'line',
								smooth: true,  
								itemStyle: {
									normal: {
										// 折点颜色样式
										color: 'orange',
										lineStyle: {
											// 折线颜色样式
											color: 'orange'
										}
									}
								},
							},
							
							{
								name:'执行中',
								data: this.confirmedBugsCpd,
								type: 'line',
								smooth: true, 
								itemStyle: {
									normal: {
										// 折点颜色样式
										color: 'blue',
										lineStyle: {
											// 折线颜色样式
											color: 'blue'
										}
									}
								},
							},
							
							{
								name:'已解决',
								data: this.resolvedBugsCpd,
								type: 'line',
								smooth: true, 
								itemStyle: {
									normal: {
										// 折点颜色样式
										color: 'green',
										lineStyle: {
											// 折线颜色样式
											color: 'green'
										}
									}
								},
							},
							
							{
								name:'已关闭',
								data: this.closedBugsCpd,
								type: 'line',
								smooth: true, 
								itemStyle: {
									normal: {
										// 折点颜色样式
										color: 'red',
										lineStyle: {
											// 折线颜色样式
											color: 'red'
										}
									}
								},
							}
						]
					}
				)
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
			
			}
		},//end method
		mounted() {
			/**
 			initSimpleDicts('all',['demandSource','demandLvl','demandType','priority','menuStatus'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
             */
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