<template>
	<section>
		<el-row class="padding">
 			<el-popover   trigger="manual" v-model="conditionBtnVisible" style="float:right;" width="300">  
				<el-button slot="reference" icon="el-icon-more" @click="conditionBtnVisible=!conditionBtnVisible"></el-button> 
				<el-row>
					<el-button type="danger" icon="el-icon-delete" @click="doDelete">删除</el-button>
				  <el-button style="float:right;" type="text" icon="el-icon-close" @click="conditionBtnVisible=false">关闭</el-button> 
				</el-row>
					<el-form :model="filters">    
					<el-form-item>
						  <el-button type="primary" icon="el-icon-search" @click="searchXmTestDayTimesList">查询</el-button>
					</el-form-item>  
					</el-form> 
			</el-popover>
		</el-row>
		<el-row>  
			<div>
				<div class="main" :id="id"
					style="width:100%;height:600px;margin:0 auto;"></div>
				<div class="progress"></div>
			</div> 
		</el-row>
 	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
 	import { mapGetters } from 'vuex'	 
	  
	import { getXmTestDayTimesList } from '@/api/xm/core/xmTestPlanCase'; 

	export default { 
        
		components: {    
		},
        props:['xmTestPlan','xmRptConfig','compCfg'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
            datesCpd(){
				if(!this.xmTestDayTimesList || this.xmTestDayTimesList.length==0){
					return []
				}else{ 
					return this.xmTestDayTimesList.map(i=>i.execDate)
				}
			}, 
			testDayTimesCpd(){
				if(!this.xmTestDayTimesList || this.xmTestDayTimesList.length==0){
					return []
				}else{ 
					return this.xmTestDayTimesList.map(i=>i.hadExec)
				}
			}, 
			
			title(){
				return  '测试用例每日执行次数统计'
			},
			id(){
				return this.compCfg.id
			},
			
        }, 
		watch: {  
			testDayTimesCpd(){
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
				xmTestDayTimesList:[],
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
				this.myChart = this.$echarts.init(document.getElementById(this.id)); 
				this.myChart.setOption(   
					{
						title: {
							text: this.title, 
							left: 'center'
						}, 
						
						tooltip: {
							trigger: 'axis',  
						},
						barMaxWidth: 100,
						toolbox: {
							show: true,
							right:"20px",
							feature: {
							dataView: { show: true, readOnly: false },
							magicType: { show: true, type: ['line', 'bar'] },
							
							saveAsImage: { show: true }
							}
						},

						calculable: true, 
						xAxis: {
							type: 'category',
							data: this.datesCpd
						},
						yAxis: {
							type: 'value'
						},
						series: [ 
							{
								name:'次数',
								data: this.testDayTimesCpd,
								type: 'line',
								label:{
									show: true, 
								},								
								smooth: true,  
							}
						]
					}
				)
			},
			onXmQuestionSomeFieldsChange(fieldName,$event){
				this.xmTestDayTimesList=[]
			},
			searchXmTestDayTimesList(){ 
				var params={...this.filters} 
				getXmTestDayTimesList(params).then(res=>{
					this.xmTestDayTimesList=res.data.data
				})
				
			}, 
			initData(){
				if(this.xmTestPlan){
					this.filters.productId=this.xmTestPlan.productId
					this.filters.projectId=this.xmTestPlan.projectId
					this.filters.planId=this.xmTestPlan.id
				}

				if(this.compCfg && this.compCfg.params){
					Object.assign(this.filters,this.compCfg.params) 
				} 
				this.drawCharts();
			},
			doDelete(){
				this.$emit("delete",this.compCfg)
			}, 
			sizeAutoChange(){
				this.myChart.resize();
			}
		},//end method
		mounted() {  
			this.initData();
			this.searchXmTestDayTimesList();
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