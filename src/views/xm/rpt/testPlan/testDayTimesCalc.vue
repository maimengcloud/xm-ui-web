<template>
	<section>
        <el-dialog fullscreen :title="dialogTitle" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			
			<el-row :gutter="5" v-if="visible">
				<el-col :span="18"> 
					<div>
						<div class="main" id="testDayTimesCalc"
							style="width:100%;height:600px;margin:0 auto;"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form :model="filters" class="padding"> 
						
						<el-form-item label="归属产品"  >
							<xm-product-select v-if="!xmProductCpd || !xmProductCpd.id"  ref="xmProductSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProductSelected"  :iterationId="xmIteration?xmIteration.id:null"  @clear="onProductClear"></xm-product-select>
							<span v-else>{{xmProductCpd.id}} <span v-if="xmProductCpd.productName"><br/>{{  xmProductCpd.productName  }} </span> </span>
						</el-form-item>
					<el-form-item label="日期区间">
						<br>
							<mdp-date-range v-model="filters" value-format="yyyy-MM-dd" start-key="startExecDate" end-key="endExecDate"></mdp-date-range>
  					</el-form-item>    
					<el-form-item>
						 <el-button type="primary" icon="el-icon-search" @click="getXmTestDayTimesList">查询</el-button>
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
	import { getXmTestDayTimesList } from '@/api/xm/core/xmTestPlanCase'; 
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
				if(this.xmTestDayTimesList.length==0){
					return []
				}else{ 
					return this.xmTestDayTimesList.map(i=>i.execDate)
				}
			}, 
			testDayTimesCpd(){
				if(this.xmTestDayTimesList.length==0){
					return []
				}else{ 
					return this.xmTestDayTimesList.map(i=>i.hadExec)
				}
			}, 
			
			
			dialogTitle(){
				var productName=""; 
				if(this.filters.product && this.filters.product.id){
					if(this.filters.product.productName){
						productName=this.filters.product.productName
					}else{ 
						productName=this.filters.product.id
					}
				} 
				if(productName){
					return `产品【${productName}】测试用例每日执行次数统计`
				}else{
					return "测试用例每日执行次数统计"
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
				xmTestDayTimesList:[],

			}//end return
		},//end data
		methods: {  
			getXmTestDayTimesList(){
				if(!this.filters.product){
					this.$notify({position:'bottom-left',showClose:true,message:'请先选中产品',type:'warning'})
					return;
				}
				var params={productId:this.filters.product.id}
				
				if(this.filters.startExecDate && this.filters.endExecDate){
					params.startExecDate=this.filters.startExecDate;
					params.endExecDate=this.filters.endExecDate;
				}
				getXmTestDayTimesList(params).then(res=>{ 
					this.xmTestDayTimesList=res.data.tips.isOk?res.data.data:this.xmTestDayTimesList;
				})
			},
			open(params){
				this.visible=true;
				this.filters.product=params.xmProduct
				this.filters.project=params.xmProject
				this.filters.Product=params.xmProduct 
				if(this.$refs['xmProductSelect'])this.$refs['xmProductSelect'].clearSelect();
				this.$nextTick(()=>{
					this.getXmTestDayTimesList();
				})
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("testDayTimesCalc")); 
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
								name:'已执行',
								data: this.testDayTimesCpd,
								type: 'bar',
								smooth: true,  
							}
						]
					}
				)
			},
			
			onProductSelected(product){
				this.filters.product=product
				this.xmTestDayTimesList=[]; 
			},
			
			onProductClear(){
				this.filters.product=null
				
				this.xmTestDayTimesList=[];
				
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