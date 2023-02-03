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
						
						<el-form-item label="测试库" v-if="xmTestCasedb && xmTestCasedb.id" >
 							<span >{{xmTestCasedb.id}} <span v-if="xmTestCasedb.name"><br/>{{  xmTestCasedb.name  }} </span> </span>
						</el-form-item>  
						<el-form-item label="归属项目">
							<xm-project-select  v-if="!xmProject"  ref="xmProjectSelect" style="display:inline;"  :auto-select="false" :link-product-id="xmProductCpd?xmProductCpd.id:null" @row-click="onProjectSelected"  @clear="onProjectClear"></xm-project-select>
							<span v-else>{{xmProject.id}} <span v-if="xmProject.name"><br/>{{  xmProject.name  }} </span> </span>
						</el-form-item> 
						<el-form-item label="归属产品"  >
							<xm-product-select v-if="!xmProductCpd || !xmProductCpd.id"  ref="xmProductSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProductSelected"  :iterationId="xmIteration?xmIteration.id:null"  @clear="onProductClear"></xm-product-select>
							<span v-else>{{xmProductCpd.id}} <span v-if="xmProductCpd.productName"><br/>{{  xmProductCpd.productName  }} </span> </span>
						</el-form-item>
						<el-form-item label="归属迭代" v-if="xmIteration && xmIteration.id">
							<span>  {{xmIteration.id}}
								<span v-if="xmIteration.iterationName"><br/>{{ xmIteration.iterationName  }} </span>
							</span> 
						</el-form-item>  
						<el-form-item label="归属迭代" v-else-if="filters.product && filters.product.id">
							<xm-iteration-select  ref="xmIterationSelect"  :auto-select="false"  :product-id="filters.product?filters.product.id:null" :link-project-id="xmProject?xmProject.id:null"   placeholder="迭代"  @row-click="onIterationSelected" @clear="onIterationClear"></xm-iteration-select>
						</el-form-item> 	
						<el-form-item label="测试计划" v-if="xmTestPlan && xmTestPlan.id">
							<span>  {{xmTestPlan.id}}
								<span v-if="xmTestPlan.name"><br/>{{ xmTestPlan.name  }} </span>
							</span> 
						</el-form-item>  
						<el-form-item label="测试计划" v-else-if="filters.product && filters.product.id">
							<span v-if="filters.testPlan">{{ filters.testPlan.name }}</span>
							<el-button v-if="filters.testPlan" type="text" @click="filters.testPlan=null" plain icon="el-icon-circle-close">清除</el-button>
							<el-button v-if="!filters.testPlan" type="text" @click="$refs['xmTestPlanSelectRef'].open()" plain>选择计划</el-button>
						</el-form-item> 
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
						 <el-button type="primary" icon="el-icon-search" @click="searchXmQuestionRetestDist">查询</el-button>
					</el-form-item>  
					</el-form>
				</el-col>
			</el-row>			
			<xm-test-plan-select  ref="xmTestPlanSelectRef" :casedb-id="xmTestCasedb?xmTestCasedb.id:null" :product-id="xmProduct?xmProduct.id:null" :project-id="xmProject?xmProject.id:null"   placeholder="迭代"  @select="onXmTestPlanSelected" @clear="onXmTestPlanClear"></xm-test-plan-select >

	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	  
	import { getXmQuestionRetestDist } from '@/api/xm/core/xmQuestion';
	
	import  XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';//项目选择
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//产品选择界面
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect';//迭代选择界面
	import  xmTestPlanSelect from '@/views/xm/core/xmTestPlan/XmTestPlanSelect';//计划选择器

	export default { 
        
		components: {   
			XmProjectSelect,XmIterationSelect,XmProductSelect,xmTestPlanSelect,
		},
        props:['id','cfg','category','showToolBar','showParams','isRptCfg','xmProject','xmProduct','xmIteration','xmTestCasedb','xmTestPlan'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			xmQuestionRetestDistsCpd(){
				var def=[
						{name:"1次",value:0} ,
						{name:"2次",value:0} ,
						{name:"3次",value:0} ,
						{name:"4次",value:0} ,
						{name:"5次",value:0} ,
						{name:"5次以上",value:0}
					]
				if(this.xmQuestionRetestDists.length==0){
					return def
				}else{   
					var datas=[]
					this.xmQuestionRetestDists.forEach(i=>{
						var data={} 
						 if(i.retimes>5){
							data.name="5次以上"
						 }else{
							data.name=this.legendCpd[i.retimes]
						 }
						 data.value=i.bugsNum
						 datas.push(data)
					})
					def.forEach(k=>{
						if(!datas.some(i=>k.name==i.name)){
							datas.push(k)
						}
					})
					return datas;
				}
			}, 
			legendCpd(){ 
				return ["1次","2次","3次","4次","5次","5次以上"] 
			},
			
			total(){
				if(!this.xmQuestionRetestDists || this.xmQuestionRetestDists.length==0){
					return 0
				}else{   
					return this.xmQuestionRetestDists.reduce((n, i) => {
						return (n += i.bugsNum);
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
				return  preName+'缺陷回归分布' 
				
			},
			xmProductCpd(){
				if(this.xmIteration && this.xmIteration.id){
					return {id:this.xmIteration.productId,productName:this.xmIteration.productName}
				}
				if(this.xmProduct && this.xmProduct.id){
					return this.xmProduct
				}
				return null;
			}
			
        }, 
		watch: {  
			xmQuestionRetestDistsCpd(){
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
				params:{

				},
				title:'',//报表配置项
				remark:'', //报表配置项
				groupBy:'handler_userid',
				groupBys:[
					{id:'create_userid', name:'创建人'},
					{id:'ask_userid', name:'提出人'},
					{id:'handler_userid', name:'负责人'},
					{id:'menu_id', name:'故事'}, 
					
				],
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmQuestionRetestDists:[], 
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
				if(this.cfg && this.cfg.id){
					this.params=this.cfg.params
					this.title=this.cfg.title
					this.remark=this.cfg.remark
				}
				if(this.showToolBar && !this.title){
					this.title="企业工作项每日趋势图"
				}
				
				this.searchXmQuestionRetestDist()
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
								'缺陷数'+this.total ,

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
							data: this.xmQuestionRetestDistsCpd,
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
			onXmQuestionSomeFieldsChange(fieldName,$event){
				this.xmQuestionRetestDists=[]
			},
			searchXmQuestionRetestDist(){
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
				if(this.filters.solution){
					params.solution=this.filters.solution
				}
				if(this.filters.bugType){
					params.bugType=this.filters.bugType
				}
				if(this.filters.bugStatus){
					params.bugStatus=this.filters.bugStatus
				}
				if(this.filters.bugReason){
					params.bugReason=this.filters.bugReason
				}
				if(this.filters.bugSeverity){
					params.bugSeverity=this.filters.bugSeverity
				}
				if(this.filters.repRate){
					params.repRate=this.filters.repRate
				}
				if(this.filters.priority){
					params.priority=this.filters.priority
				} 

				if(this.filters.project){
					params.projectId=this.filters.project.id
				} 
				if(this.filters.product){
					params.productId=this.filters.product.id
				} 
				if(this.filters.iteration){
					params.linkIterationId=this.filters.iteration.id
				}
				
				if(this.filters.testPlan && this.filters.testPlan.id){
					params.planId=this.filters.testPlan.id
				}
				if(this.filters.testCasedb && this.filters.testCasedb.id){
					params.casedbId=this.filters.testCasedb.id
				}

				params.groupBy=this.groupBy  
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
				getXmQuestionRetestDist(params).then(res=>{
					this.xmQuestionRetestDists=res.data.data
				})
				
			},
			onProjectSelected(project){
				this.filters.project=project
			},
			
			onProjectClear(){
				this.filters.project=null
				
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

			onXmTestPlanSelected(xmTestPlan){
				this.filters.testPlan=xmTestPlan
			},

			onXmTestPlanClear(){
				this.filters.testPlan=null
			},
		},//end method
		mounted() { 
 			initSimpleDicts('all',['bugSeverity','bugSolution','bugStatus','bugType','priority','bugRepRate','bugReason'] ).then(res=>{
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