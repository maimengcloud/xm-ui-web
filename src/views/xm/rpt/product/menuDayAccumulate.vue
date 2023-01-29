<template>
	<section>
			
			<el-row :gutter="5" >
				<el-col :span="18"> <div>
					<div class="main" id="menuDayAccumulate"
							style="width:100%;height:600px;margin:0 auto;"></div> 
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form  :model="filters" class="padding"> 
						
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
			title(){
				var productName=""; 
				if(this.filters.product && this.filters.product.id){
					if(this.filters.product.productName){
						productName=this.filters.product.productName
					}else{ 
						productName=this.filters.product.id
					}
				} 
				if(productName){
					return `产品【${productName}】需求每日累积图`
				}else{
					return "产品需求每日累积图"
				}
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
				this.myChart = this.$echarts.init(document.getElementById("menuDayAccumulate")); 
				this.myChart.setOption(  
					{
						title: {
							text: '需求累积图'
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
						
						toolbox: {
							show: true,
							right:"20px",
							feature: {
							dataView: { show: true, readOnly: false },
							magicType: { show: true, type: ['line', 'bar'] },
							restore: { show: true },
							saveAsImage: { show: true }
							}
						},
						legend: {
							top:'5%',
							left: 'center',
							data: ['未开始', '执行中', '已完成', '已关闭']
						},
						grid: {
							left: '3%',
							right: '4%',
							bottom: '3%',
							containLabel: true
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
							name: '未开始',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},
							data: this.menuUnstartCntCpd
							},
							{
							name: '执行中',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},
							data: this.menuExecCntCpd,
							},
							{
							name: '已完成',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},
							data: this.menuFinishCntCpd,
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
							data: this.menuCloseCntCpd,
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