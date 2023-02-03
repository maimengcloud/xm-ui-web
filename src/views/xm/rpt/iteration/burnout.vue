<template>
	<section>
 			
			 
			<el-row :gutter="5" >
				<el-col :span="18"> 
					<div>
						<div class="echart-box" id="burnout"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form :model="filters" class="padding" :style="{width:'100%',maxHeight:maxTableHeight+'px',overflow: 'auto'}" ref="filtersRef"> 
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
						<el-form-item>
							<div class="padding"> <el-button  type="primary" icon="el-icon-search" @click="listXmIterationStateHis">查询</el-button></div>
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
        props:['id','xmProduct','xmIteration','xmProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles', 
		    ]), 
            datesCpd(){
				if(this.xmIterationStateHiss.length==0){
					return []
				}else{ 
					return this.xmIterationStateHiss.map(i=>i.bizDate)
				}
			},
			
			remainStandWorkloadsCpd(){
				if(this.xmIterationStateHiss.length==0){
					return []
				}else{ 
					var max=this.findMax(this.xmIterationStateHiss);
					var length=this.findLength();
					if(length==0){
						return [];
					}  
					var startDate=this.filters.iteration.startTime.substring(0,10)
					var endDate=this.filters.iteration.endTime.substring(0,10)
					var uniDayWorkload=max.budgetWorkload/(length+1)
					return this.xmIterationStateHiss.map((i,index)=>{
						if(i.bizDate<startDate || i.bizDate>endDate){
							return 0;
						}
						var days= util.timeDifference(i.bizDate+" 00:00:00",endDate+" 00:00:00")/60/24
						return parseInt(uniDayWorkload*days)
					})
				}
			},
			remainWorkloadsCpd(){
				if(this.xmIterationStateHiss.length==0){
					return []
				}else{ 
					return this.xmIterationStateHiss.map(i=>i.budgetWorkload-i.actWorkload)
				}
			},
			
			remainEstimateWorkloadsCpd(){
				if(this.xmIterationStateHiss.length==0){
					return []
				}else{ 
					return this.xmIterationStateHiss.map(i=>i.budgetWorkload-i.estimateWorkload)
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
				return  preName+"迭代燃尽图" 
				
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
					testPlan:null,
					iteration:null,
					testCasedb:null,
                },
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmIterationStateHiss:[],

			}//end return
		},//end data
		methods: { 
			 findMax( list ) {
				var i, max = list[0]; 
				if(list.length < 2) return max;
			
				for (i = 0; i < list.length; i++) { 
					if (list[i].budgetWorkload > max.budgetWorkload) {
						max = list[i];
					}
				}
				return max;
			},
			findLength(){
				if(this.filters.iteration && this.filters.iteration.id){
					return parseInt(util.timeDifference(this.filters.iteration.startTime.substring(0,10)+" 00:00:00",this.filters.iteration.endTime.substring(0,10)+" 00:00:00")/60/24)
				}else if(this.xmIterationStateHiss){
					return this.xmIterationStateHiss.length;
				}else{
					return 0;
				}
			},
			listXmIterationStateHis(){
				if(!this.filters.iteration|| !this.filters.iteration.id){
					this.$notify({position:'bottom-left',showClose:true,message:'请先选中迭代',type:'warning'})
					return;
				}
				var params={iterationId:this.filters.iteration.id,orderBy:'biz_date asc'}
				listXmIterationStateHis(params).then(res=>{ 
					this.xmIterationStateHiss=res.data.tips.isOk?res.data.data:this.xmIterationStateHiss;
				})
			},
			open(){
				this.visible=true;
				this.filters.testPlan=this.xmTestPlan
				this.filters.product=this.xmProduct
				this.filters.project=this.xmProject
				this.filters.iteration=this.xmIteration
				this.filters.testCasedb=this.xmTestCasedb
				this.$nextTick(()=>{
					this.listXmIterationStateHis();
				})
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("burnout")); 
				this.myChart.setOption({
					title: {
						text: this.titleCpd,
						left:'center'
					},
					tooltip: {
						trigger: 'axis'
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
					legend: {
							bottom: 'bottom',
						data: ['理想线','预估剩余工时', '剩余工时']
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						splitLine: {
							show: false
						},
						data: this.datesCpd,
					},
					yAxis: {},
					series: [
						{
							name: '理想线',
							type: 'line',
							// stack: '剩余工作量',
							data: this.remainStandWorkloadsCpd,
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
							// data: this.opinionData,
						},
						{
							name: '预估剩余工时',
							type: 'line',
							// stack: '剩余工作量',
							data: this.remainEstimateWorkloadsCpd,
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
							// data: this.opinionData,
						},
						{
							name: '剩余工时',
							type: 'line',
							// stack: '剩余工作量',
							data: this.remainWorkloadsCpd,
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
							// data: this.opinionData,
						}, 
					]
				})
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