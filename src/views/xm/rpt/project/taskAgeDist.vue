<template>
	<section>
        <el-dialog :title="(filters.project?'【'+filters.project.name+'】':'')+'任务属性分布'" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			<el-row :gutter="5">
				<el-col :span="18"> 
					<div>
						<div class="main" id="xmTaskAgeDist"
							style="width:100%;height:600px;margin:0 auto;"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form :label-position="'top'" label-width="120px" :model="filters">   
							 <xm-project-select class="padding" v-if="!xmProject"  ref="xmProjectSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProjectSelected"  :iterationId="xmIteration?xmIteration.id:null"  @clear="onProjectClear"></xm-project-select>
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
        </el-dialog>
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
        props:['xmProduct','xmIteration','xmProject'],
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
			title(){
				return '任务年龄数量分布'
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
					iteration:null,
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
			open(params){
				this.visible=true;
				this.filters.product=params.xmProduct
				this.filters.project=params.xmProject
				this.filters.Product=params.xmProduct 
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("xmTaskAgeDist")); 
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
								position: 'center'
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