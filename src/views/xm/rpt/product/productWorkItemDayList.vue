<template>
	<section>
 
			<el-row :gutter="5" >
				<el-col :span="18"> 
					<div> 
						<div class="echart-box" :id="this.id"></div> 
					</div>
				</el-col>
				
				<el-col :span="6" v-if="showParams"> 
					 <el-popover   trigger="manual" v-model="filterVisible" style="float:right;" width="500">
						<el-button slot="reference" style="margin-top:10px;" icon="el-icon-more" @click="filterVisible=!filterVisible"></el-button> 
						<el-row>
							<el-button type="danger" icon="el-icon-delete" @click="doDelete">从报告移出该报表</el-button>
							<el-button icon="el-icon-close" style="float:right;" @click="filterVisible=false">关闭</el-button>
						</el-row>
						<el-row>
							<el-form :model="params" class="padding"   :style="{width:'100%',overflow: 'auto'}" ref="filtersRef">
								<el-form-item label="归属产品"  >
									<xm-product-select v-if="!xmProductCpd || !xmProductCpd.id"  ref="xmProductSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProductSelected"  :iterationId="xmIteration?xmIteration.id:null"  @clear="onProductClear"></xm-product-select>
									<span v-else>{{xmProductCpd.id}} <span v-if="xmProductCpd.productName"><br/>{{  xmProductCpd.productName  }} </span> </span>
								</el-form-item>
								<el-form-item label="日期区间">
									<br>
										<mdp-date-range v-model="params" value-format="yyyy-MM-dd" start-key="startBizDate" end-key="endBizDate"></mdp-date-range>
								</el-form-item>    
								
									
								<el-form-item>
									<el-button type="primary"  style="float:right;" icon="el-icon-search" @click="listXmProductStateHis">查询</el-button>
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
	
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//新增界面
	import { listXmProductStateHis } from '@/api/xm/core/xmProductStateHis';
	export default { 
        
		components: {  
			XmProductSelect, 
		},
        props:['id','cfg','category','showToolBar','showParams','isRptCfg','xmProduct','xmProject'],
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
				return  preName+"产品工作项每日分布图" 
			},
			xmProductCpd(){ 
				if(this.xmProduct && this.xmProduct.id){
					return this.xmProduct
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
                
                filterVisible:false,
				filters:{
                    product:null, 
                    project:null,
					testPlan:null,
					iteration:null,
					testCasedb:null,
                    category:'',   
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
			listXmProductStateHis(){
				if(!this.filters.product){
					this.$notify({position:'bottom-left',showClose:true,message:'请先选中产品',type:'warning'})
					return;
				}
				
				var params={...this.params,orderBy:'biz_date asc'}
				 
				listXmProductStateHis(params).then(res=>{ 
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
				this.$nextTick(()=>{
					this.listXmProductStateHis();
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
					trigger: 'axis',
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
				
				this.myChart.resize();
			},
			
			onProductSelected(product){
				this.filters.product=product 
			},
			
			onProductClear(){
				this.filters.product=null 
				
			},
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