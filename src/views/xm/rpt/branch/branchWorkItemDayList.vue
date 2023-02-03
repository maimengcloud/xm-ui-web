<template> 
			<el-row :gutter="5" >
				<el-col :span="18">  
					<div class="rpt-box">
						<el-row v-if="isRptCfg">
							<el-row class="row-box padding-top">
								<span class="title">{{title?title:'请输入标题'}}</span><el-input class="input" v-model="title" placeholder="请输入标题"></el-input>
							</el-row>
							<el-row class="row-box">
								<el-row class="remark"><div v-html="remark?remark:'请输入说明'"></div></el-row>
								<el-row ><el-input class="input"  type="textarea" :rows="4" v-model="remark" placeholder="请输入说明"></el-input></el-row>
							</el-row>
						</el-row>
						<el-row v-else-if="cfg &&  cfg.id">
							<el-row v-if="title"  class="row-box">
								<span class="title">{{title}}</span>
							</el-row>
							<el-row v-if="remark"  class="row-box">
								<span class="remark">{{remark}}</span>
							</el-row>
						</el-row>
						<el-row> 
							<div class="echart-box" :id="this.id"></div> 
						</el-row>
					</div>
				</el-col>
				<el-col :span="6" class="border" v-if="isRptCfg">
					<el-row v-if="showToolBar">
						<el-button type="danger" icon="el-icon-delete" @click="doDelete">从报告移除该报表</el-button>
 					</el-row>
					<el-row v-if="showParams">
						<el-form :model="params" class="padding" :style="{width:'100%',maxHeight:maxTableHeight+'px',overflow: 'auto'}" ref="filtersRef">  
						
						<el-form-item label="日期区间">
							<br>
								<mdp-date-range v-model="params" value-format="yyyy-MM-dd" start-key="startBizDate" end-key="endBizDate"></mdp-date-range>
						</el-form-item>  
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" @click="listXmBranchStateHis">查询</el-button>
						</el-form-item>  
						</el-form>
					</el-row>
				</el-col>
			</el-row>  
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//产品选择界面
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect';//迭代选择界面
	import { listXmBranchStateHis } from '@/api/xm/core/xmBranchStateHis';
	export default { 
        
		components: {  
			XmIterationSelect,XmProductSelect,
		},
        props:['id','xmProduct','xmProject','xmIteration','cfg','category','showToolBar','showParams','isRptCfg'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),  
			dataSetCpd(){
				return [
					['日期',...this.xmProductStateHiss.map(i=>i.bizDate)],
					['未关故事',...this.xmProductStateHiss.map(i=>i.menuCnt-i.menuCloseCnt)],
					['已关故事',...this.xmProductStateHiss.map(i=>i.menuCloseCnt)],
					['未关任务',...this.xmProductStateHiss.map(i=>i.taskCnt-i.taskCloseCnt)],
					['已关任务',...this.xmProductStateHiss.map(i=>i.taskCloseCnt)],
					['未关缺陷',...this.xmProductStateHiss.map(i=>i.bugCnt-i.closedBugs)],
					['已关缺陷',...this.xmProductStateHiss.map(i=>i.closedBugs)]
				]
			},
 
			titleCpd(){
				return "企业工作项每日趋势图"
				
			},
			xmProductCpd(){
				if(this.xmIteration && this.xmIteration.id){
					return {id:this.xmIteration.productId,productName:this.xmIteration.productName}
				}
				if(this.xmProduct && this.xmProduct.id){
					return this.xmProduct
				}
				if(this.cfg && this.cfg.params && this.cfg.params.productId){
					return {id:this.cfg.params.productId}
				}
				return null;
			}
			
        }, 
		watch: {  
			dataSetCpd(){ 
				this.$nextTick(()=>{
					this.drawCharts();
				})
				
			}
	    },
		data() {
			return {
                filters:{
                    category:'', 
                    product:null, 
                    project:null,
					testPlan:null,
					iteration:null,
					testCasedb:null,
					startBizDate:'',
					endBizDate:'',
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
				xmProductStateHiss:[],

			}//end return
		},//end data
		methods: {  
			listXmBranchStateHis(){ 
				var params=this.params
				listXmBranchStateHis(params).then(res=>{ 
					this.xmProductStateHiss=res.data.tips.isOk?res.data.data:this.xmProductStateHiss;
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
				this.xmProductStateHiss=[]
				if(this.$refs['xmProductSelect'])this.$refs['xmProductSelect'].clearSelect();
				if(this.$refs['xmIterationSelect'])this.$refs['xmIterationSelect'].clearSelect();
				this.$nextTick(()=>{
					this.listXmBranchStateHis();
				})
				
			}, 
			drawCharts() { 
				this.myChart = this.$echarts.init(document.getElementById(this.id));
				var that=this;
				this.myChart.on('updateAxisPointer', function (event) {
					const xAxisInfo = event.axesInfo[0];
					if (xAxisInfo) {
					const dimension = xAxisInfo.value + 1;
					that.myChart.setOption({
						series: {
						id: 'pie',
						label: {
							formatter: '{b}: {@[' + dimension + ']} ({d}%)'
						},
						encode: {
							value: dimension,
							tooltip: dimension
						}
						}
					});
					}
				});
				this.myChart.setOption({
						
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
					},

					dataset: {
						source:  this.dataSetCpd
					},
					xAxis: {
						type: 'category', 
					},
					yAxis: { gridIndex: 0 },
    				grid: { top: '55%' },
					series: [
						{ 	name:'未关故事',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true, 
        					emphasis: { focus: 'series' }, 
						},
						{ 	name:'已关故事',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true, 
        					emphasis: { focus: 'series' }, 
						},
						{ 
							name:'未关任务',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' }, 
						},
						{ 
							name:'已关任务',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' }, 
						},
						{ 	name:'未关缺陷',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' },  
						},
						{ 	name:'已关缺陷',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' },  
						},
						{
							type: 'pie',
							id: 'pie',
							radius: '30%',
							center: ['50%', '30%'],
							emphasis: {
								focus: 'self'
							},
							label: {
								formatter: '{b}: {@日期} ({d}%)'
							},
							encode: {
								itemName: '日期',
								value:this.dataSetCpd[0][this.dataSetCpd[0].length-1],
								tooltip: '日期'
							}
						}
					]
				}); 
			},
			
			onProductSelected(product){
				this.filters.product=product
				this.xmProductStateHiss=[]; 
			},
			
			onProductClear(){
				this.filters.product=null
				
				this.xmProductStateHiss=[];
				
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
            this.maxTableHeight = this.$refs.filtersRef?util.calcTableMaxHeight(this.$refs.filtersRef.$el):this.maxTableHeight;
			//this.charts(); 
			this.open();
			
		}//end mounted
	}

</script>

<style lang="less" scoped> 
   .image {
    width: 100%;
    display: block;
  }
  .row-box{     
	.title{
		font-weight: 600;
		font-size: large;
		visibility: visible;
	} 
	.remark{
		font-size:medium;
		visibility: visible;
	} 
	.input {
		visibility: hidden;
		z-index: 10000;  
		top: 0%; 
		left:0%;  
		position:absolute;  
	}
  }
  .row-box:hover{
	.title{
		display:none;
	}
	.remark{
		display:none;
	} 
	.input{
		visibility: visible;
	}
  } 
  .rpt-box{
	margin-left: 10px;
	margin-right: 10px;
  	border: 1px solid #e8e8e8;
  }
</style>