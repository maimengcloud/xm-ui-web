<template>
	<section>
 			
			<el-row :gutter="5" >
				<el-col :span="showParams?23:24"> <div>
					<div class="echart-box" id="iterationMenuDayAccumulate" ></div> 
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
        props:['id','cfg','category','showToolBar','showParams','isRptCfg','xmProduct','xmProject','xmIteration'],
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
			menuCloseCntCpd(){
				if(this.rawDatas.length==0){
					return []
				}else{ 
					return this.rawDatas.map(i=>i.menuCloseCnt)
				}
			},
			menuUnstartCntCpd(){
				if(this.rawDatas.length==0){
					return []
				}else{ 
					return this.rawDatas.map(i=> i.menuUnstartCnt)
				}
			},
			menuExecCntCpd(){
				if(this.rawDatas.length==0){
					return []
				}else{ 
					return this.rawDatas.map(i=> i.menuExecCnt)
				}
			},
			
			menuFinishCntCpd(){
				if(this.rawDatas.length==0){
					return []
				}else{ 
					return this.rawDatas.map(i=>i.menuFinishCnt)
				}
			},
			titleCpd(){ 
				return  '企业需求每日累积图'  
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
				this.rawDatas=[]
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
							axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#6a7985'
							}
							}
						},
						legend: {
							bottom: 'bottom',
							data: ['未开始', '执行中', '已完成', '已关闭']
						},
						grid: { 
							containLabel: true
						},
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
						xAxis: {
							type: 'category',
							boundaryGap: false,
							data: this.datesCpd,
						},
						yAxis: {
							type: 'value'
						},
						series: [
							{
							name: '未开始',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},
							data: this.menuUnstartCntCpd
							},
							{
							name: '执行中',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},
							data: this.menuExecCntCpd,
							},
							{
							name: '已完成',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},
							data: this.menuFinishCntCpd,
							},
							{
							name: '已关闭',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},

							label: {
								show: true,
								position: 'top'
							},
							data: this.menuCloseCntCpd,
							} 
						]
					}
				)
			},
			
			
			onProductSelected(product){
				this.filters.product=product
				this.rawDatas=[];
			},
			
			onProductClear(){
				this.filters.product=null 
				this.rawDatas=[]; 
			},
			
			onIterationSelected(iteration){
				this.filters.iteration=iteration
				this.rawDatas=[]; 
			},
			
			onIterationClear(){
				this.filters.iteration=null 
				this.rawDatas=[];
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