<template>
	<section>
        <el-dialog :title="filters.product?'产品【'+filters.product.productName+'】':''+'需求每日趋势'" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
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
			menuCloseCntCpd(){
				if(this.xmProductStateHiss.length==0){
					return []
				}else{ 
					return this.xmProductStateHiss.map(i=>i.menuCloseCnt)
				}
			},
			menuUnstartCntCpd(){
				if(this.xmProductStateHiss.length==0){
					return []
				}else{ 
					return this.xmProductStateHiss.map(i=> i.menuUnstartCnt)
				}
			},
			menuExecCntCpd(){
				if(this.xmProductStateHiss.length==0){
					return []
				}else{ 
					return this.xmProductStateHiss.map(i=> i.menuExecCnt)
				}
			},
			
			menuFinishCntCpd(){
				if(this.xmProductStateHiss.length==0){
					return []
				}else{ 
					return this.xmProductStateHiss.map(i=>i.menuFinishCnt)
				}
			},
			
        }, 
		watch: {  
			xmProductStateHiss(){
				this.drawWorkload();
			}
	    },
		data() {
			return {
                filters:{
                    category:'', 
                    product:null, 
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
				this.filters.Product=params.xmProduct
				this.$nextTick(()=>{
					this.listXmProductStateHis();
				})
				
			},
			drawWorkload() {
				this.myChart = this.$echarts.init(document.getElementById("main")); 
				this.myChart.setOption(  
					{	
						legend: {
							right: 40,
							data: ['未开始故事数','执行中故事数','已完成故事数','已关闭故事数']
						},
						xAxis: {
							type: 'category',
							data: this.datesCpd
						},
						yAxis: {
							type: 'value'
						},
						series: [
							{
								name:'未开始故事数',
								data: this.menuUnstartCntCpd,
								type: 'line',
								smooth: true,  
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
							
							{
								name:'执行中故事数',
								data: this.menuExecCntCpd,
								type: 'line',
								smooth: true, 
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
							},
							
							{
								name:'已完成故事数',
								data: this.menuFinishCntCpd,
								type: 'line',
								smooth: true, 
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
							},
							
							{
								name:'已关闭故事数',
								data: this.menuCloseCntCpd,
								type: 'line',
								smooth: true, 
								itemStyle: {
									normal: {
										// 折点颜色样式
										color: 'red',
										lineStyle: {
											// 折线颜色样式
											color: 'red'
										}
									}
								},
							}
						]
					}
				)
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