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
						  
						 <el-form-item label="缺陷状态" prop="bugStatus">
							<el-select   v-model="filters.bugStatus"  @change="onXmQuestionSomeFieldsChange('bugStatus',$event)" clearable>
								<el-option v-for="i in this.dicts.bugStatus" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>  
						<el-form-item  label="缺陷类型" prop="bugType" >
							<el-select v-model="filters.bugType"  @change="onXmQuestionSomeFieldsChange('bugType',$event)" clearable>
								<el-option v-for="i in this.dicts.bugType" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item> 
						<el-form-item  label="缺陷原因" prop="bugReason">
							<el-select v-model="filters.bugReason"  @change="onXmQuestionSomeFieldsChange('bugReason',$event)" clearable>
								<el-option v-for="i in this.dicts.bugReason" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item> 
						<el-form-item  label="严重程度" prop="bugSeverity" >
							<el-select v-model="filters.bugSeverity"  @change="onXmQuestionSomeFieldsChange('bugSeverity',$event)" clearable>
								<el-option v-for="i in this.dicts.bugSeverity" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item> 
					<el-form-item  label="优先级" prop="priority" >
						<el-select v-model="filters.priority" @change="onXmQuestionSomeFieldsChange('priority',$event)" clearable>
								<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option>
						</el-select>
					</el-form-item>  
					<el-form-item  label="解决方案" prop="solution" >
						<el-select v-model="filters.solution" @change="onXmQuestionSomeFieldsChange('solution',$event)" clearable>
								<el-option v-for="i in dicts.bugSolution" :label="i.name" :key="i.id" :value="i.id"></el-option>
						</el-select>
					</el-form-item>  

					<el-form-item  label="重现频率" prop="repRate" >
						<el-select v-model="filters.repRate" @change="onXmQuestionSomeFieldsChange('repRate',$event)" clearable>
								<el-option v-for="i in dicts.bugRepRate" :label="i.name" :key="i.id" :value="i.id"></el-option>
						</el-select>
					</el-form-item>  
					
					<el-form-item>
						 <el-button type="primary" icon="el-icon-search" @click="searchXmQuestionAgeDist">查询</el-button>
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
	  
	import { getXmQuestionAgeDist } from '@/api/xm/core/xmQuestion';
	
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect.vue';//修改界面 
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//新增界面

	export default { 
        
		components: {   
			XmIterationSelect,XmProductSelect,
		},
        props:['xmTestPlan','xmRptConfig','compCfg'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			xmQuestionAgeDistsCpd(){
				if(this.xmQuestionAgeDists.length==0){
					return []
				}else{   
					var datas=[]
					this.xmQuestionAgeDists.forEach(i=>{
						var data={...i}
						 data.name=this.legendCpd[i.name]
						 datas.push(data)
					})
					return datas;
				}
			},
			title(){
				return '缺陷年龄数量分布'
			},
			legendCpd(){
				 return ['0-2天','3-5天','6-7天','8-15天','16-30天','30天以上']
			},
			id(){
				return this.compCfg.id
			}
			
        }, 
		watch: {   
			xmQuestionAgeDistsCpd(){
				this.drawCharts();
			}
	    },
		data() {
			return {
                filters:{ 
					planId:'',
					productId:'',
					projectId:'',
					bugStatus:'',
					bugType:'',
					bugReason:'',
					bugSeverity:'',
					priority:'',
					solution:'',
					repRate:'',


                }, 
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmQuestionAgeDists:[],
				conditionBtnVisible:false,

			}//end return
		},//end data
		methods: {   
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
							data: this.xmQuestionAgeDistsCpd,
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
				this.xmQuestionAgeDists=[]
			},
			searchXmQuestionAgeDist(){ 
				var params={...this.filters}
				 if(this.xmTestPlan && this.xmTestPlan.id){
					params.planId=this.xmTestPlan.id
				 }
				 
				getXmQuestionAgeDist(params).then(res=>{
					this.xmQuestionAgeDists=res.data.data
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
			doDelete(){
				this.$emit("delete",this.compCfg)
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
				if(this.compCfg && this.compCfg.params){
					Object.assign(this.filters,this.compCfg.params) 
				} 
			},
			sizeAutoChange(){
				this.myChart.resize();
			}
		},//end method
		mounted() {  
 			initSimpleDicts('all',['bugSeverity','bugSolution','bugStatus','bugType','priority','bugRepRate','bugReason'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
			this.initData();
			this.searchXmQuestionAgeDist();
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