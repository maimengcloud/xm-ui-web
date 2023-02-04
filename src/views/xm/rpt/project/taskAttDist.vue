<template>
	<section>
        
			<el-row :gutter="5" >
				<el-col :span="18"> 
					<div>
						<div class="echart-box" :id="this.id"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" v-if="showParams"> 
					 <el-popover   trigger="manual" v-model="filterVisible" style="float:right;" width="500">
						<el-button slot="reference" style="margin-top:10px;" icon="el-icon-more" @click="filterVisible=!filterVisible"></el-button> 
						<el-row>
							<el-button type="danger" icon="el-icon-delete" @click="$emit('delete',cfg)">从报告移出该报表</el-button>
							<el-button icon="el-icon-close" style="float:right;" @click="filterVisible=false">关闭</el-button>
						</el-row>
						<el-row>
							<el-form :model="params" class="padding"   :style="{width:'100%',overflow: 'auto'}" ref="filtersRef">
								<el-row>
									<el-col :span="15">
										<el-form-item label="分组属性">
											<el-select style="width:100px;" size="small"   v-model="params.groupBy"  @change="onXmTaskSomeFieldsChange('groupBy',$event)" clearable>
												<el-option v-for="i in this.groupBys" :label="i.name" :key="i.id" :value="i.id"></el-option>
											</el-select>
										</el-form-item>     
										<el-form-item label="归属项目" >
											<xm-project-select v-if="!xmProject || !xmProject.id" ref="xmProjectSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProjectSelected"   @clear="onProjectClear"></xm-project-select>
											<span v-else>{{xmProject.id}} <span v-if="xmProject.name"><br/>{{  xmProject.name  }} </span> </span> 
										</el-form-item>  
									</el-col>
									<el-col :span="9">
										<el-form-item label="任务状态" prop="taskState">
											<el-select style="width:100px;" size="small"   v-model="params.taskState"  @change="onXmTaskSomeFieldsChange('taskState',$event)" clearable>
												<el-option v-for="i in this.dicts.taskState" :label="i.name" :key="i.id" :value="i.id"></el-option>
											</el-select>
										</el-form-item>  
										<el-form-item  label="任务类型" prop="taskType" >
											<el-select style="width:100px;" size="small" v-model="params.taskType"  @change="onXmTaskSomeFieldsChange('taskType',$event)" clearable>
												<el-option v-for="i in this.dicts.taskType" :label="i.name" :key="i.id" :value="i.id"></el-option>
											</el-select>
										</el-form-item> 
										<el-form-item  label="任务来源" prop="planType">
											<el-select style="width:100px;" size="small" v-model="params.planType"  @change="onXmTaskSomeFieldsChange('planType',$event)" clearable>
												<el-option v-for="i in this.dicts.planType" :label="i.name" :key="i.id" :value="i.id"></el-option>
											</el-select>
										</el-form-item> 
										<el-form-item  label="任务层次" prop="settleSchemel" >
											<el-select style="width:100px;" size="small" v-model="params.settleSchemel"  @change="onXmTaskSomeFieldsChange('settleSchemel',$event)" clearable>
												<el-option v-for="i in this.dicts.xmTaskSettleSchemel" :label="i.name" :key="i.id" :value="i.id"></el-option>
											</el-select>
										</el-form-item> 
										<el-form-item  label="优先级别" prop="priority" >
											<el-select style="width:100px;" size="small" v-model="params.priority" @change="onXmTaskSomeFieldsChange('priority',$event)" clearable>
													<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option>
											</el-select>
										</el-form-item>  
									</el-col>
								</el-row>
								
									
								<el-form-item>
									<el-button type="primary"  style="float:right;" icon="el-icon-search" @click="searchXmTaskAttDist">查询</el-button>
								</el-form-item>  
							</el-form>
						</el-row>
					 </el-popover>
					
				</el-col>  
			</el-row>
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
        props:['id','cfg','category','showToolBar','showParams','isRptCfg','xmProduct','xmIteration','xmProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			xmTaskAttDistsCpd(){
				if(this.xmTaskAttDists.length==0){
					return []
				}else{ 
					var itemId="";
					if(this.params.groupBy=='task_state'){
						itemId="taskState"
					}else if(this.params.groupBy=='settle_schemel'){
						itemId="xmTaskSettleSchemel"
					}else if(this.params.groupBy=='task_type'){
						itemId="taskType"
					}else if(this.params.groupBy=='priority'){
						itemId="priority"
					}else if(this.params.groupBy=='plan_type'){
						itemId="planType"
					} 
					return this.xmTaskAttDists.map(i=>{
						var data={...i}
						data.name=this.formatDict(itemId,data.name)
						return data;
					})
				}
			},
			
			total(){ 
				if(!this.xmTaskAttDists || this.xmTaskAttDists.length==0){
					return 0
				}else{   
					return this.xmTaskAttDists.reduce((n, i) => {
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
				return  preName+this.groupBys.find(i=>i.id==this.params.groupBy).name+'数量分布'
			},
			legendCpd(){
				var itemId="";
				if(this.params.groupBy=='task_state'){
					itemId="taskState"
				}else if(this.params.groupBy=='settle_schemel'){
					itemId="xmTaskSettleSchemel"
				}else if(this.params.groupBy=='task_type'){
					itemId="taskType"
				}else if(this.params.groupBy=='priority'){
					itemId="priority"
				}else if(this.params.groupBy=='plan_type'){
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
                
                filterVisible:false,
				filters:{
                    product:null, 
                    project:null,
					testPlan:null,
					iteration:null,
					testCasedb:null,
                },
				params:{ 
					groupBy:'task_state',
				},
				title:'',//报表配置项
				remark:'', //报表配置项
				groupBys:[
					{id:'task_state', name:'任务状态'},
					{id:'task_type', name:'任务类型'},
					{id:'plan_type', name:'计划类型'},
					{id:'settle_schemel', name:'结算方案'},
					{id:'priority', name:'优先级别'}
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
			open(){
				this.visible=true;
				this.filters.testPlan=this.xmTestPlan
				this.filters.product=this.xmProduct
				this.filters.project=this.xmProject
				this.filters.iteration=this.xmIteration
				this.filters.testCasedb=this.xmTestCasedb 

				if( this.filters.testPlan && this.filters.testPlan.id){
					this.params.planId= this.filters.testPlan.id
				} 
				 
				if( this.filters.product && this.filters.product.id){
					this.params.productId= this.filters.product.id
				}
				 
				if( this.filters.project && this.filters.project.id){
					this.params.projectId= this.filters.project.id
				}
				 
				if( this.filters.iteration && this.filters.iteration.id){
					this.params.iterationId= this.filters.iteration.id
				}
				 
				 
				if( this.filters.testCasedb && this.filters.testCasedb.id){
					this.params.casedbId= this.filters.testCasedb.id
				}
				if(this.initGroupBy){
					this.params.groupBy=this.initGroupBy
				}
				if(this.cfg && this.cfg.id){
					this.params=this.cfg.params
					this.title=this.cfg.title
					this.remark=this.cfg.remark
				}
				if(this.showToolBar && !this.title){
					this.title="企业工作项每日趋势图"
				}
				this.searchXmTaskAttDist()
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
								formatter:'{b}: {c}  ({d}%)'
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

				var params={...this.params} 
				if(!params.groupBy){
					this.$notify({position:'bottom-left',showClose:true,message:'请选中分组属性',type:'warning'})
					return 
				}
				params.ntype='0'
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
			            //this.maxTableHeight = util.calcTableMaxHeight(this.$refs.filtersRef.$el)
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