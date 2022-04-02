<template>
	<section>
        <el-dialog :title="filters.iteration?'【'+filters.iterationName+'】':''+'迭代燃尽图'" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			<div>
				<div class="main" id="main"
					style="width:100%;height:600px;margin:0 auto;"></div>
				<div class="progress"></div>
			</div>
        </el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	
	import { listXmIterationStateHis } from '@/api/xm/core/xmIterationStateHis';
	export default { 
        
		components: {   
		},
        props:['xmProduct','xmIteration','xmProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
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
					var length=this.xmIterationStateHiss.length;
					return this.xmIterationStateHiss.map((i,index)=>{
						return max.distBudgetWorkload*(length-index)/length
					})
				}
			},
			remainWorkloadsCpd(){
				if(this.xmIterationStateHiss.length==0){
					return []
				}else{ 
					return this.xmIterationStateHiss.map(i=>i.distBudgetWorkload-i.actWorkload)
				}
			},
			
			remainEstimateWorkloadsCpd(){
				if(this.xmIterationStateHiss.length==0){
					return []
				}else{ 
					return this.xmIterationStateHiss.map(i=>i.distBudgetWorkload-i.estimateWorkload)
				}
			},
			
        }, 
		watch: {  
			xmIterationStateHiss(){
				this.drawWorkload();
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
					if (list[i].distBudgetWorkload > max.distBudgetWorkload) {
						max = list[i];
					}
				}
				return max;
			},
			listXmIterationStateHis(){
				var params={iterationId:'IT2022-0001-Z5TA',orderBy:'biz_date asc'}
				listXmIterationStateHis({iterationId:'IT2022-0001-Z5TA'}).then(res=>{ 
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
			drawWorkload() {
				this.myChart = this.$echarts.init(document.getElementById("main")); 
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
			}
		},//end method
		mounted() {
			/**
 			initSimpleDicts('all',['demandSource','demandLvl','demandType','priority','menuStatus'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
             */
			//this.charts();
			
		}//end mounted
	}

</script>

<style scoped>
   .image {
    width: 100%;
    display: block;
  }
</style>