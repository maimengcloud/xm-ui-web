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
						  <el-button type="primary" icon="el-icon-search" @click="searchXmTestCaseToPlanCalcList">查询</el-button>
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
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	  
	import { getXmTestCaseToPlanCalcList } from '@/api/xm/core/xmTestPlanCase';

	export default { 
        
		components: {   
		},
        props:['xmTestPlan','xmRptConfig','compCfg'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			xmTestCaseToPlanCalcListCpd(){
				if(!this.xmTestCaseToPlanCalcList || this.xmTestCaseToPlanCalcList.length==0){
					return []
				}else{   
					var names=this.legendCpd;
					var datas=[]
					this.xmTestCaseToPlanCalcList.forEach(i=>{
						var nameIndex=0;
						if(i.useTimes<=2){
							nameIndex=i.useTimes
						}else if(i.useTimes>=3 && i.useTimes<=5){
							nameIndex=3
						}else if(i.useTimes>5 && i.useTimes<=10){
							nameIndex=4
						}else if(i.useTimes>10){
							nameIndex=5
						}
						var data={name:names[nameIndex],value:i.caseNum}
						datas.push(data)
					})
					return datas;
				} 
			},
			title(){
				return  '测试用例规划分析'
			},
			legendCpd(){ 
				 return ['0次','1次','2次','3-5次','5-10次','10次以上']
			}, 
			id(){
				return this.compCfg.id
			},
			
        }, 
		watch: {  
			xmTestCaseToPlanCalcListCpd(){
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
				xmTestCaseToPlanCalcList:[],
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
							trigger: 'item',
							
						},
						
						toolbox: {
							show: true,
							right:"20px",
							feature: {
								dataView: { show: true, readOnly: false },  
								saveAsImage: { show: true }, 
							}
						}, 
						calculable: true,
						
						legend: { 
							top:'5%',
							left: 'center',
							data:this.legendCpd,
						},
						series: [
							{
							type: 'pie',
							radius: '50%',
							data: this.xmTestCaseToPlanCalcListCpd,
							emphasis: {
								itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},

							label: {
								show: true, 
								
							},
							}
						]
					}
				)
			},
			onXmQuestionSomeFieldsChange(fieldName,$event){
				this.xmTestCaseToPlanCalcList=[]
			},
			searchXmTestCaseToPlanCalcList(){ 
				var params={...this.filters} 
				getXmTestCaseToPlanCalcList(params).then(res=>{
					this.xmTestCaseToPlanCalcList=res.data.data
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
			this.searchXmTestCaseToPlanCalcList();
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