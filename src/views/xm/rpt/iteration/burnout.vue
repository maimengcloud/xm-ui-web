<template>
	<section>
        <el-dialog fullscreen :title="(	filters.iteration?'【'+filters.iteration.iterationName+'】':'')+'迭代燃尽图'" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			
			 
			<el-row :gutter="5" v-if="visible">
				<el-col :span="18"> 
					<div>
						<div class="main" id="burnout"
							style="width:100%;height:600px;margin:0 auto;"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form  :model="filters" label-position="top" class="padding"> 
						<el-form-item label="归属产品" v-if="!xmProduct&&!xmIteration">
								<xm-product-select     ref="xmProductSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProductSelected"   @clear="onProductClear"></xm-product-select>
						</el-form-item>  
						<el-form-item label="归属产品" v-if="xmProduct && xmProduct.id">
							<span v-if="xmProduct.id">编号：{{ xmProduct.id }}</span><br>
							<span v-if="xmProduct.productName">名称：{{ xmProduct.productName }}</span>
 						</el-form-item>  
 						<el-form-item label="归属迭代" v-if="!xmIteration || !xmIteration.id"> 
							<xm-iteration-select  style="display:inline;" :auto-select="false"  :product-id="filters.product?filters.product.id:null" :link-project-id="xmProject?xmProject.id:null"   placeholder="迭代"  @row-click="onIterationSelected" @clear="onIterationClear"></xm-iteration-select>
						</el-form-item>  
 						<el-form-item label="归属迭代" v-if="xmIteration &&xmIteration.id"> 
							编号：<span v-if="xmIteration.id">{{ xmIteration.id }}</span><br>
							名称：<span v-if="xmIteration.iterationName">{{ xmIteration.iterationName }}</span>

 						</el-form-item>  
						<el-form-item>
							<div class="padding"> <el-button  type="primary" icon="el-icon-search" @click="listXmIterationStateHis">查询</el-button></div>
						</el-form-item>  
					</el-form>
				</el-col>
			</el-row>
        </el-dialog>
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
        props:['xmProduct','xmIteration','xmProject'],
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
                    iteration:null,
                    project:null,
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
			open(params){
				this.visible=true;
				this.filters.product=params.xmProduct
				this.filters.project=params.xmProject
				this.filters.iteration=params.xmIteration
				this.$nextTick(()=>{
					this.listXmIterationStateHis();
				})
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("burnout")); 
				this.myChart.setOption({
					title: {
						text: '燃尽图：',
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						right: 40,
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
				this.listXmIterationStateHis();
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
			//this.charts();
			//this.drawCharts();
			
		}//end mounted
	}

</script>

<style scoped>
   .image {
    width: 100%;
    display: block;
  }
</style>