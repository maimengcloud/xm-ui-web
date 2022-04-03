<template>
	<section>
        <el-dialog :title="filters.product?'【'+filters.product.productName+'】':''+'工作项按日分布趋势图'" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			<div>
				<div class="main" id="productWorkItemDayList"
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
	
	import { listXmProductStateHis } from '@/api/xm/core/xmProductStateHis';
	export default { 
        
		components: {   
		},
        props:['xmProduct'],
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
			
			menuNumCpd(){
				if(this.xmProductStateHiss.length==0){
					return []
				}else{ 
					return this.xmProductStateHiss.map(i=>i.menuCnt)
				}
			},
			bugNumCpd(){
				if(this.xmProductStateHiss.length==0){
					return []
				}else{ 
					return this.xmProductStateHiss.map(i=>i.bugCnt)
				}
			},
			
			taskNumCpd(){
				if(this.xmProductStateHiss.length==0){
					return []
				}else{ 
					return this.xmProductStateHiss.map(i=>i.taskCnt)
				}
			},
			dataSetCpd(){
				return [
					['date',...this.datesCpd],
					['故事数',...this.menuNumCpd],
					['缺陷数',...this.bugNumCpd],
					['任务数',...this.taskNumCpd]
				]
			}
			
        }, 
		watch: {  
			xmProductStateHiss(){
				this.drawCharts();
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
				xmProductStateHiss:[],

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
			listXmProductStateHis(){
				var params={productId:'mmcloud-xm',orderBy:'biz_date asc'}
				listXmProductStateHis(params).then(res=>{ 
					this.xmProductStateHiss=res.data.tips.isOk?res.data.data:this.xmProductStateHiss;
				})
			},
			open(params){
				this.visible=true;
				this.filters.product=params.xmProduct
				this.filters.project=params.xmProject
				this.filters.iteration=params.xmIteration
				this.$nextTick(()=>{
					this.listXmProductStateHis();
				})
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("productWorkItemDayList")); 
				this.myChart.setOption({
					title: {
						text: '工作项分布',
					},
					tooltip: {
						trigger: 'axis',
      					showContent: false
					},
					legend: { 
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
						{
							name: '故事数',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true, 
        					emphasis: { focus: 'series' },
							// stack: '剩余工作量', 
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
							name: '任务数',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' },
							// stack: '剩余工作量', 
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
							name: '缺陷数',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' },
							// stack: '剩余工作量', 
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
						{
							type: 'pie',
							id: 'pie',
							radius: '30%',
							center: ['50%', '25%'],
							emphasis: {
								focus: 'self'
							},
							label: {
								formatter: '{b}: {@2012} ({d}%)'
							},
							encode: {
								itemName: 'date',
								value: '2012',
								tooltip: '2012'
							}
						}
					]
				});

				this.myChart.on('updateAxisPointer', function (event) {
					const xAxisInfo = event.axesInfo[0];
					if (xAxisInfo) {
					const dimension = xAxisInfo.value + 1;
					this.myChart.setOption({
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
			}
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