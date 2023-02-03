<template>
	<section>
        
			<el-row :gutter="5" >
				<el-col :span="18"> 
					<div>
						<div class="echart-box" :id="this.id"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form :model="filters" class="padding" :style="{width:'100%',maxHeight:maxTableHeight+'px',overflow: 'auto'}" ref="filtersRef">   
						<el-form-item label="归属项目" >
							<xm-project-select v-if="!xmProject || !xmProject.id" ref="xmProjectSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProjectSelected"   @clear="onProjectClear"></xm-project-select>
							<span v-else>{{xmProject.id}} <span v-if="xmProject.name"><br/>{{  xmProject.name  }} </span> </span> 
						</el-form-item>  
						 <el-form-item label="任务状态" prop="taskState">
							<el-select   v-model="filters.taskState"  @change="onXmTaskSomeFieldsChange('taskState',$event)" clearable>
								<el-option v-for="i in this.dicts.taskState" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>  
						<el-form-item  label="任务类型" prop="taskType" >
							<el-select v-model="filters.taskType"  @change="onXmTaskSomeFieldsChange('taskType',$event)" clearable>
								<el-option v-for="i in this.dicts.taskType" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item> 
						<el-form-item  label="任务来源" prop="planType">
							<el-select v-model="filters.planType"  @change="onXmTaskSomeFieldsChange('planType',$event)" clearable>
								<el-option v-for="i in this.dicts.planType" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item> 
						<el-form-item  label="任务层次" prop="settleSchemel" >
							<el-select v-model="filters.settleSchemel"  @change="onXmTaskSomeFieldsChange('settleSchemel',$event)" clearable>
								<el-option v-for="i in this.dicts.xmTaskSettleSchemel" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item> 
					<el-form-item  label="优先级" prop="priority" >
						<el-select v-model="filters.priority" @change="onXmTaskSomeFieldsChange('priority',$event)" clearable>
								<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option>
						</el-select>
					</el-form-item>  
					<el-form-item>
						 <el-button type="primary" icon="el-icon-search" @click="searchXmTaskAgeDist">查询</el-button>
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
	  
	import { getXmTaskAgeDist } from '@/api/xm/core/xmTask';
	import  XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';//新增界面

	export default { 
        
		components: {   
			XmProjectSelect,
		},
        props:['id','xmProduct','xmIteration','xmProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			xmTaskAgeDistsCpd(){
				if(this.xmTaskAgeDists.length==0){
					return []
				}else{   
					var datas=[]
					this.xmTaskAgeDists.forEach(i=>{
						var data={...i}
						 data.name=this.legendCpd[i.name]
						 datas.push(data)
					})
					return datas;
				}
			},
			
			total(){
				if(!this.xmTaskAgeDists || this.xmTaskAgeDists.length==0){
					return 0
				}else{   
					return this.xmTaskAgeDists.reduce((n, i) => {
						return (n += i.value);
					}, 0)
				} 
			},
			titleCpd(){
				
				var preName=""
				if(this.filters.testPlan && this.filters.testPlan.id){
					preName=`测试计划【${this.filters.testPlan.name}】`
				}else if(this.filters.testCasedb && this.filters.testCasedb.id){
					preName=`测试库【${this.filters.testCasedb.name}】`
				}else if(this.filters.iteration && this.filters.iteration.id){
					preName=`迭代【${this.filters.iteration.iterationName}】`
				}else if(this.filters.project && this.filters.project.id){ 
					if(this.filters.project.name){
						preName=`项目【${this.filters.project.name}】`
					}else{
						preName=`项目【${this.filters.project.id}】`
					}
				}else if(this.filters.product && this.filters.product.id){
					if(this.filters.product.productName){
						preName=`产品【${this.filters.product.productName}】`
					}else{
						preName=`产品【${this.filters.product.id}】`
					}
					
				}
				return  preName+'任务年龄数量分布'
			},
			legendCpd(){
				 return ['0-2天','3-5天','6-7天','8-15天','16-30天','30天以上']
			}
			
        }, 
		watch: {  
			xmTaskAgeDistsCpd(){
				this.drawCharts();
			}
	    },
		data() {
			return {
                filters:{
                    product:null, 
                    project:null,
					testPlan:null,
					iteration:null,
					testCasedb:null,
                }, 
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmTaskAgeDists:[],

			}//end return
		},//end data
		methods: {   
			open(){
				this.visible=true;
				this.filters.product=this.xmProduct
				this.filters.project=this.xmProject
				this.filters.iteration=this.xmIteration 
				this.searchXmTaskAgeDist();
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById(this.id));
				this.myChart.setOption(   
					{
						title: {
							text: this.titleCpd, 
							left: 'center'
						}, 
						tooltip: {
							trigger: 'item',
							
						},
						
						toolbox: {
							show: true,
							top:"5%",
							right:"10px",
							feature: {
								dataView: { show: true, readOnly: false },  
								saveAsImage: { show: true }, 
							}
						}, 
						calculable: true,
						
						legend:{
							bottom: 'bottom',
							data:this.legendCpd,
						},
						graphic: {
							type: 'text',
							left: 'center',
							top: 'center',
							style: {
							// text: '总数',
							text:
								'任务数'+this.total ,

							textAlign: 'center',
							fill: '#333',
							width: 30,
							height: 30,
							fontSize: 14
							}
						}, 

						series: [
							{
							type: 'pie',
							radius: ['50%','70%'],
							data: this.xmTaskAgeDistsCpd,
							emphasis: {
								itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},

							label: {
								show: true, 
								formatter:'{b}: {c}  ({d}%)'
							},
							}
						]
					}
				)
			},
			onXmTaskSomeFieldsChange(fieldName,$event){
				this.xmTaskAgeDists=[]
			},
			searchXmTaskAgeDist(){ 
				var params={}
				if(this.filters.taskType){
					params.taskType=this.filters.taskType
				}
				if(this.filters.taskState){
					params.taskState=this.filters.taskState
				}
				if(this.filters.planType){
					params.planType=this.filters.planType
				}
				if(this.filters.settleSchemel){
					params.settleSchemel=this.filters.settleSchemel
				}
				if(this.filters.priority){
					params.priority=this.filters.priority
				} 
				params.groupBy=this.groupBy
				if(this.filters.project){
					params.projectId=this.filters.project.id
				}
				
				if(this.filters.iteration){
					params.iterationId=this.filters.iteration.id
				}
				params.ntype='0'
				getXmTaskAgeDist(params).then(res=>{
					this.xmTaskAgeDists=res.data.data
				})
				
			},
			onProjectSelected(project){
				this.filters.project=project
			},
			
			onProjectClear(){
				this.filters.project=null
				
			},
			
			onIterationSelected(iteration){
				this.filters.iteration=iteration
			},
			
			onIterationClear(){
				this.filters.iteration=null
			}
		},//end method
		mounted() {  
 			initSimpleDicts('all',['planType','xmTaskSettleSchemel','taskType','priority','taskState'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
			            this.maxTableHeight = util.calcTableMaxHeight(this.$refs.filtersRef.$el)
			//this.charts();
			this.open();
			
		}//end mounted
	}

</script>

<style scoped>
   .image {
    width: 100%;
    display: block;
  }
</style>