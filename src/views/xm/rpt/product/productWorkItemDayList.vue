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
			dataSetCpd(){
				return [
					['日期',...this.xmProductStateHiss.map(i=>i.bizDate)],
					['未关故事',...this.xmProductStateHiss.map(i=>i.menuCnt-i.menuFinishCnt)],
					['已关故事',...this.xmProductStateHiss.map(i=>i.menuFinishCnt)],
					['未关任务',...this.xmProductStateHiss.map(i=>i.taskCnt-i.finishTaskCnt)],
					['已关任务',...this.xmProductStateHiss.map(i=>i.finishTaskCnt)],
					['未关缺陷',...this.xmProductStateHiss.map(i=>i.bugCnt-i.closedBugs)],
					['已关缺陷',...this.xmProductStateHiss.map(i=>i.closedBugs)]
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
							center: ['50%', '25%'],
							emphasis: {
								focus: 'self'
							},
							label: {
								formatter: '{b}: {@日期} ({d}%)'
							},
							encode: {
								itemName: '日期',
								value: '日期',
								tooltip: '日期'
							}
						}
					]
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