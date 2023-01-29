<template>
	<section>
        
			<el-row :gutter="5" >
				<el-col :span="18"> 
					<div>
						<div class="main" id="xmTaskSort"
							style="width:100%;height:600px;margin:0 auto;"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form  :model="filters" class="padding">
						<el-form-item label="分组属性">
							<el-select   v-model="groupBy"  @change="onXmTaskSomeFieldsChange('groupBy',$event)" clearable>
								<el-option v-for="i in this.groupBys" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>     
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
						 <el-button type="primary" icon="el-icon-search" @click="searchXmTaskSort">查询</el-button>
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
	  
	import { getXmTaskSort } from '@/api/xm/core/xmTask';
	
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
			xmTaskSortsCpd(){
				if(this.xmTaskSorts.length==0){
					return []
				}else{ 
					return this.xmTaskSorts.map(i=>i.value)
				}
			},
			title(){
				
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
				return  preName+this.groupBys.find(i=>i.id==this.groupBy).name+'任务数量排行榜'
			},
			legendCpd(){
				if(this.xmTaskSorts.length==0){
					return []
				}else{ 
					return this.xmTaskSorts.map(i=>i.name)
				}
				
			}
			
        }, 
		watch: {  
			xmTaskSortsCpd(){
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
				groupBy:'create_userid',
				groupBys:[
					{id:'create_userid', name:'创建人'},
					{id:'executor_userid', name:'执行人'}, 
					{id:'menu_id', name:'需求'}, 
				],
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmTaskSorts:[],
				pageInfo: {
					//分页数据
					total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize: 20, //每页数据
					count:true, //是否需要重新计算总记录数
					pageNum: 1, //当前页码、从1开始计算
					orderFields: ["value"], //排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs: ["desc"], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},

			}//end return
		},//end data
		methods: { 
			open(){
				this.visible=true;
				this.filters.product=this.xmProduct
				this.filters.project=this.xmProject
				this.filters.iteration=this.xmIteration 
				this.searchXmTaskSort()
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("xmTaskSort")); 
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
							data: this.legendCpd
						},
						yAxis: {
							type: 'value'
						},
						series: [
							{
							data: this.xmTaskSortsCpd,
							type: 'bar',
							label:{
								show: true, 
							},
							markPoint: {
								data: [
								{ type: 'max', name: 'Max' },
								{ type: 'min', name: 'Min' }
								]
							}, 
							}
						]
					}
				)
			},
			onXmTaskSomeFieldsChange(fieldName,$event){
				this.xmTaskSorts=[]
			},
			searchXmTaskSort(){
				if(!this.groupBy){
					this.$notify({position:'bottom-left',showClose:true,message:'请选中分组属性',type:'warning'})
					return 
				}
				 let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count: this.pageInfo.count,
				};
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

				
				if (
					this.pageInfo.orderFields != null &&
					this.pageInfo.orderFields.length > 0
				) {
					let orderBys = [];
					for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
					orderBys.push(
						this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i]
					);
					}
					params.orderBy = orderBys.join(",");
				}
				getXmTaskSort(params).then(res=>{
					this.xmTaskSorts=res.data.data
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