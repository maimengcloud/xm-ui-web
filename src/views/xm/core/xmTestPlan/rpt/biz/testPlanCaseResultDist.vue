<template>
	<section>
		<el-row class="padding">
			<span>{{comp?comp.compName:'执行结果分布'}}</span>
			<el-popover   trigger="manual" v-model="conditionBtnVisible" style="float:right;" width="300">  
				<el-button slot="reference" icon="el-icon-more" @click="conditionBtnVisible=!conditionBtnVisible"></el-button> 
					<el-form :model="filters">    
					<el-form-item>
						  <el-button type="primary" icon="el-icon-search" @click="searchXmTestPlanCaseResultDist">查询</el-button>
					</el-form-item>  
					</el-form> 
			</el-popover>
		</el-row>
		<el-row>  
			<div>
				<div class="main" id="xmTestPlanCaseResultDist"
					style="width:100%;height:600px;margin:0 auto;"></div>
				<div class="progress"></div>
			</div> 
		</el-row>
 	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	  
	import { getXmTestPlanCaseResultDist } from '@/api/xm/core/xmTestPlanCase';
	
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect.vue';//修改界面 
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//新增界面

	export default { 
        
		components: {   
			XmIterationSelect,XmProductSelect,
		},
        props:['xmTestPlan','xmRptConfig','comp'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			xmTestPlanCaseResultDistsCpd(){
				if(this.xmTestPlanCaseResultDists.length==0){
					return []
				}else{ 
					var itemId="testPlanTcode"; 
					return this.xmTestPlanCaseResultDists.map(i=>{
						var data={...i}
						data.name=this.formatDict(itemId,data.name)
						return data;
					})
				}
			},
			title(){
				return  '执行结果数量分布'
			},
			legendCpd(){
				var itemId="testPlanTcode"; 
				return this.dicts[itemId].map(i=>i.name)
			}
			
        }, 
		watch: {  
			xmTestPlanCaseResultDistsCpd(){
				this.drawCharts();
			}
	    },
		data() {
			return {
                filters:{ 
                    planId:'', 
                }, 
				 
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmTestPlanCaseResultDists:[],
				conditionBtnVisible:false,

			}//end return
		},//end data
		methods: { 
			formatDict(itemId,val){
				var dict=this.dicts[itemId]
				if(dict){
					var item=dict.find(i=>i.id==val)
					if(item){
						return item.name
					}
				}
				return val;
			}, 
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("xmTestPlanCaseResultDist")); 
				this.myChart.setOption(   
					{
						title: {
							text: this.title, 
							left: 'center'
						},
						tooltip: {
							trigger: 'item'
						},
						legend: { 
							top:'5%',
							left: 'center',
							data:this.legendCpd,
						},
						series: [
							{
							type: 'pie',
							radius: '50%',
							data: this.xmTestPlanCaseResultDistsCpd,
							emphasis: {
								itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},

							label: {
								show: true,
								position: 'center'
							},
							}
						]
					}
				)
			},
			onXmQuestionSomeFieldsChange(fieldName,$event){
				this.xmTestPlanCaseResultDists=[]
			},
			searchXmTestPlanCaseResultDist(){ 
				var params={...this.filters} 
				getXmTestPlanCaseResultDist(params).then(res=>{
					this.xmTestPlanCaseResultDists=res.data.data
				})
				
			},
			onProductSelected(product){
				this.filters.product=product
			},
			
			onProductClear(){
				this.filters.product=null
				
			},
			
			onIterationSelected(iteration){
				this.filters.iteration=iteration
			},
			
			onIterationClear(){
				this.filters.iteration=null
			},
			initData(){
				if(this.xmTestPlan){
					this.filters.productId=this.xmTestPlan.productId
					this.filters.projectId=this.xmTestPlan.projectId
					this.filters.planId=this.xmTestPlan.id
				}
				if(this.xmRptConfig && this.xmRptConfig.cfg){
					var compCfg=this.xmRptConfig.cfg.find(k=>k.id==this.comp.id)
					if(compCfg && compCfg.params){
						compCfg.params.forEach(k=>{
							this.filters[k.id]=k.value
						})
					}
				}
			}
		},//end method
		mounted() { 
 			initSimpleDicts('all',['testPlanTcode'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
			this.initData();
			this.searchXmTestPlanCaseResultDist();
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