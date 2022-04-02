<template>
	<section>
        <el-dialog title="xxxxxxxxxxxxx" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			<div>
				<div class="main" id="main"
					style="width:600px;height:400px;margin:0 auto;"></div>
				<div class="progress"></div>
			</div>
        </el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	
	export default { 
        
		components: {   
		},
        props:['xmProduct','xmIteration','xmProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
            
        }, 
		watch: {  
			datas(){
				this.charts();
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
				datas:[],

			}//end return
		},//end data
		methods: { 
			open(params){
				this.visible=true;
				this.filters.product=params.xmProduct
				this.filters.project=params.xmProject
				this.filters.iteration=params.xmIteration
				this.$nextTick(()=>{
					this.charts()
				})
				
			},
			charts() {
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
						data: ['剩余工作量', '任务量']
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						splitLine: {
							show: false
						},
						data: ['迭代一', '迭代二', '迭代三', '迭代四', '迭代五']
					},
					yAxis: {},
					series: [
						{
							name: '剩余工作量',
							type: 'line',
							// stack: '剩余工作量',
							data: [5, 4.6, 3.9, 2.7, 0.2],
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
							name: '任务量',
							type: 'line',
							data: [5, 4, 3, 2, 0],
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