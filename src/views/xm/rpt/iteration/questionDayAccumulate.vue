<template>
	<section>
			
			<el-row :gutter="5" >
				<el-col :span="18"> <div>
					<div class="main" id="iterationQuestionDayAccumulate"
							style="width:100%;height:600px;margin:0 auto;"></div> 
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form :model="filters" class="padding"> 
						
						<el-form-item label="归属产品"  >
							<xm-product-select v-if="!xmProductCpd || !xmProductCpd.id"  ref="xmProductSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProductSelected"  :iterationId="xmIteration?xmIteration.id:null"  @clear="onProductClear"></xm-product-select>
							<span v-else>{{xmProductCpd.id}} <span v-if="xmProductCpd.productName"><br/>{{  xmProductCpd.productName  }} </span> </span>
						</el-form-item>
						<el-form-item label="归属迭代">
							<xm-iteration-select  v-if="!xmIteration || !xmIteration.id" ref="xmIterationSelect"  :auto-select="false"  :product-id="filters.product?filters.product.id:null" :link-project-id="xmProject?xmProject.id:null"   placeholder="迭代"  @row-click="onIterationSelected" @clear="onIterationClear"></xm-iteration-select>
							<span v-else>  {{xmIteration.id}}
								<span v-if="xmIteration.iterationName"><br/>{{ xmIteration.iterationName  }} </span></span> 
						</el-form-item>  
					<el-form-item label="日期区间">
						<br>
							<mdp-date-range v-model="filters" value-format="yyyy-MM-dd" start-key="startBizDate" end-key="endBizDate"></mdp-date-range>
  					</el-form-item>  
					<el-form-item>
						 <el-button type="primary" icon="el-icon-search" @click="listXmIterationStateHis">查询</el-button>
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
	
	import { listXmIterationStateHis } from '@/api/xm/core/xmIterationStateHis';
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//产品选择界面
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect';//迭代选择界面
	export default { 
        
		components: {   
			XmIterationSelect,XmProductSelect,
		},
        props:['xmProduct','xmProject','xmIteration'],
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
				if(this.xmIteration && this.xmIteration.id){
					return (this.xmIteration?'迭代【'+this.xmIteration.iterationName+'】':'')+'缺陷每日累积图'
				}else {
					return (this.filters.product?'产品【'+this.filters.product.productName+'】':'')+'缺陷每日累积图'
				}
				
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
                filters:{
                    category:'', 
                    product:null, 
                    project:null,
                    iteration:null,
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
			listXmIterationStateHis(){
				if(!this.filters.product){
					this.$notify({position:'bottom-left',showClose:true,message:'请先选中产品',type:'warning'})
					return;
				}
				
				if(!this.filters.iteration){
					this.$notify({position:'bottom-left',showClose:true,message:'请先选中迭代',type:'warning'})
					return;
				}
				var params={productId:this.filters.product.id,iterationId:this.filters.iteration.id,orderBy:'biz_date asc'}
				
				if(this.filters.startBizDate && this.filters.endBizDate){
					params.startBizDate=this.filters.startBizDate;
					params.endBizDate=this.filters.endBizDate;
				}
				listXmIterationStateHis(params).then(res=>{ 
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
				if(this.$refs['xmIterationSelect'])this.$refs['xmIterationSelect'].clearSelect();
				this.$nextTick(()=>{
					this.listXmIterationStateHis();
				})
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("iterationQuestionDayAccumulate")); 
				this.myChart.setOption(  
					{
						title: {
							text: '缺陷累积图',
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
							top:'5%',
							left: 'center',
							data: ['新提出', '执行中', '已解决', '已关闭']
						},
						grid: {
							left: '3%',
							right: '4%',
							bottom: '3%',
							containLabel: true
						},
						toolbox: {
							show: true,
							right:"20px",
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

							label: {
								show: true,
								position: 'top'
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
			
			onIterationSelected(iteration){
				this.filters.iteration=iteration
				this.xmProductStateHiss=[]; 
			},
			
			onIterationClear(){
				this.filters.iteration=null 
				this.xmProductStateHiss=[];
			}
		},//end method
		mounted() {
			/**
 			initSimpleDicts('all',['demandSource','demandLvl','demandType','priority','menuStatus'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
             */
			//this.charts();
			this.open()
			
		}//end mounted
	}

</script>

<style scoped>
   .image {
    width: 100%;
    display: block;
  }
</style>