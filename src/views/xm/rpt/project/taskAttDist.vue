<template>
	<section>
        <el-dialog fullscreen :title="(filters.project?'【'+filters.project.name+'】':'')+'任务属性分布'" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			<el-row :gutter="5">
				<el-col :span="18"> 
					<div>
						<div class="main" id="xmTaskAttDist"
							style="width:100%;height:600px;margin:0 auto;"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form   :model="filters" class="padding">
						<el-form-item label="分组属性">
							<el-select   v-model="groupBy"  @change="onXmTaskSomeFieldsChange('groupBy',$event)" clearable>
								<el-option v-for="i in this.groupBys" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>     
						
						<el-form-item label="归属项目" v-if="!xmProject">
							<xm-project-select  v-if="!xmProject"  ref="xmProjectSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProjectSelected"  :iterationId="xmIteration?xmIteration.id:null"  @clear="onProjectClear"></xm-project-select>
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
						<el-form-item  label="计划类型" prop="planType">
							<el-select v-model="filters.planType"  @change="onXmTaskSomeFieldsChange('planType',$event)" clearable>
								<el-option v-for="i in this.dicts.planType" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item> 
						<el-form-item  label="结算方案" prop="settleSchemel" >
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
						 <el-button type="primary" icon="el-icon-search" @click="searchXmTaskAttDist">查询</el-button>
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
	  
	import { getXmTaskAttDist } from '@/api/xm/core/xmTask';
	
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
			xmTaskAttDistsCpd(){
				if(this.xmTaskAttDists.length==0){
					return []
				}else{ 
					var itemId="";
					if(this.groupBy=='task_state'){
						itemId="taskState"
					}else if(this.groupBy=='settle_schemel'){
						itemId="xmTaskSettleSchemel"
					}else if(this.groupBy=='task_type'){
						itemId="taskType"
					}else if(this.groupBy=='priority'){
						itemId="priority"
					}else if(this.groupBy=='plan_type'){
						itemId="planType"
					} 
					return this.xmTaskAttDists.map(i=>{
						var data={...i}
						data.name=this.formatDict(itemId,data.name)
						return data;
					})
				}
			},
			title(){
				return this.groupBys.find(i=>i.id==this.groupBy).name+'数量分布'
			},
			legendCpd(){
				var itemId="";
				if(this.groupBy=='task_state'){
					itemId="taskState"
				}else if(this.groupBy=='settle_schemel'){
					itemId="xmTaskSettleSchemel"
				}else if(this.groupBy=='task_type'){
					itemId="taskType"
				}else if(this.groupBy=='priority'){
					itemId="priority"
				}else if(this.groupBy=='plan_type'){
					itemId="planType"
				} 

				return this.dicts[itemId].map(i=>i.name)
			}
			
        }, 
		watch: {  
			xmTaskAttDistsCpd(){
				this.drawCharts();
			}
	    },
		data() {
			return {
                filters:{
                    product:null,  
					iteration:null,
                },
				groupBy:'task_state',
				groupBys:[
					{id:'task_state', name:'任务状态'},
					{id:'task_type', name:'任务类型'},
					{id:'plan_type', name:'计划类型'},
					{id:'settle_schemel', name:'结算方案'},
					{id:'priority', name:'优先级'}
				],
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmTaskAttDists:[],

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
			open(params){
				this.visible=true;
				this.filters.product=params.xmProduct
				this.filters.project=params.xmProject
				this.filters.Product=params.xmProduct 
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("xmTaskAttDist")); 
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
							data: this.xmTaskAttDistsCpd,
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
				this.xmTaskAttDists=[]
			},
			searchXmTaskAttDist(){
				if(!this.groupBy){
					this.$notify({position:'bottom-left',showClose:true,message:'请选中分组属性',type:'warning'})
					return 
				}
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
				getXmTaskAttDist(params).then(res=>{
					this.xmTaskAttDists=res.data.data
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