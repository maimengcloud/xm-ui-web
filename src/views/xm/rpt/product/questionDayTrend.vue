<template>
	<section>
        <el-dialog fullscreen :title="(this.filters.product?'产品【'+this.filters.product.productName+'】':'')+'缺陷每日趋势'" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			
			<el-row :gutter="5">
				<el-col :span="18"> 
					<div>
						<div class="main" id="questionDayTrend"
							style="width:100%;height:600px;margin:0 auto;"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border padding">
					<el-form :model="filters"> 
						<el-form-item label="归属产品" v-if="!xmProduct" >
							 <xm-product-select   ref="xmProductSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProductSelected"   @clear="onProductClear"></xm-product-select>
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
        </el-dialog>
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
					return this.xmProductStateHiss.map(i=> i.activeBugs)
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
			open(params){
				this.visible=true;
				this.filters.product=params.xmProduct
				this.filters.project=params.xmProject
				this.filters.Product=params.xmProduct 
				if(this.$refs['xmProductSelect'])this.$refs['xmProductSelect'].clearSelect();
				this.$nextTick(()=>{
					this.listXmProductStateHis();
				})
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("questionDayTrend")); 
				this.myChart.setOption(  
					{	
						legend: {
							right: 40,
							data: ['新提出','执行中','已解决','已关闭']
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
								name:'新提出',
								data: this.activeBugsCpd,
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
								name:'执行中',
								data: this.confirmedBugsCpd,
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
								name:'已解决',
								data: this.resolvedBugsCpd,
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
								name:'已关闭',
								data: this.closedBugsCpd,
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
			},
			
			onProductSelected(product){
				this.filters.product=product
				this.xmProductStateHiss=[];
				this.listXmProductStateHis();
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