<template>
	<section>
			
			<el-row :gutter="5" >
				<el-col :span="18"> <div>
					<div class="echart-box" id="questionDayAccumulate"></div> 
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form :model="filters" class="padding" :style="{width:'100%',maxHeight:maxTableHeight+'px',overflow: 'auto'}" ref="filtersRef"> 
						
						<el-form-item label="归属产品"  >
							<xm-product-select v-if="!xmProductCpd || !xmProductCpd.id"  ref="xmProductSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProductSelected"  :iterationId="xmIteration?xmIteration.id:null"  @clear="onProductClear"></xm-product-select>
							<span v-else>{{xmProductCpd.id}} <span v-if="xmProductCpd.productName"><br/>{{  xmProductCpd.productName  }} </span> </span>
						</el-form-item>
					<el-form-item label="日期区间">
						<br>
							<mdp-date-range v-model="filters" value-format="yyyy-MM-dd" start-key="startBizDate" end-key="endBizDate"></mdp-date-range>
  					</el-form-item>  
					<el-form-item>
						 <el-button type="primary" icon="el-icon-search" @click="listXmProductStateHis">查询</el-button>
					</el-form-item>  
					</el-form>
				</el-col>
			</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	
	import { listXmProductStateHis } from '@/api/xm/core/xmProductStateHis';
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//新增界面
	export default { 
        
		components: {   
			XmProductSelect,
		},
        props:['xmProduct','xmProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
            datesCpd(){
				if(this.xmProductStateHiss.length==0){
					return []
				}else{ 
					return this.xmProductStateHiss.map(i=>i.bizDate)
				}
			}, 
			closedBugsCpd(){
				if(this.xmProductStateHiss.length==0){
					return []
				}else{ 
					return this.xmProductStateHiss.map(i=>i.closedBugs)
				}
			},
			activeBugsCpd(){
				if(this.xmProductStateHiss.length==0){
					return []
				}else{ 
					return this.xmProductStateHiss.map(i=> i.menuUnstartCnt)
				}
			},
			confirmedBugsCpd(){
				if(this.xmProductStateHiss.length==0){
					return []
				}else{ 
					return this.xmProductStateHiss.map(i=> i.confirmedBugs)
				}
			},
			
			resolvedBugsCpd(){
				if(this.xmProductStateHiss.length==0){
					return []
				}else{ 
					return this.xmProductStateHiss.map(i=>i.resolvedBugs)
				}
			},
			
			title(){
				
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
				return  preName+"产品缺陷每日累积图" 
			},
			xmProductCpd(){ 
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
                filters:{
                    category:'', 
                    product:null, 
                    project:null,
					testPlan:null,
					iteration:null,
					testCasedb:null,
                },
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
				var params={productId:this.filters.product.id,orderBy:'biz_date asc'}
				
				if(this.filters.startBizDate && this.filters.endBizDate){
					params.startBizDate=this.filters.startBizDate;
					params.endBizDate=this.filters.endBizDate;
				}
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
				this.xmProductStateHiss=[]
				if(this.$refs['xmProductSelect'])this.$refs['xmProductSelect'].clearSelect();
				this.$nextTick(()=>{
					this.listXmProductStateHis();
				})
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("questionDayAccumulate")); 
				this.myChart.setOption(  
					{
						title: {
							text: this.title,
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
							data: ['新提出', '执行中', '已解决', '已关闭']
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
							name: '新提出',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},
							data: this.activeBugsCpd
							},
							{
							name: '执行中',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},
							data: this.confirmedBugsCpd,
							},
							{
							name: '已解决',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},
							data: this.resolvedBugsCpd,
							},
							{
							name: '已关闭',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							}, 
							data: this.closedBugsCpd,
							} 
						]
					}
				)
			},
			
			
			onProductSelected(product){
				this.filters.product=product
				this.xmProductStateHiss=[]; 
			},
			
			onProductClear(){
				this.filters.product=null
				
				this.xmProductStateHiss=[];
				
			},
		},//end method
		mounted() {
			/**
 			initSimpleDicts('all',['demandSource','demandLvl','demandType','priority','menuStatus'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
             */
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