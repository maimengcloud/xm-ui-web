<template>
	<section>
			<el-row :gutter="5" >
				<el-col :span="showParams?23:24"> 
					<el-row :class="{'row-box':true,'cfg':isRptCfg}">
						<div class="title">{{ title?title:(isRptCfg?'标题':'') }}</div>
						<el-input class="input" v-model="title" placeholder="标题"/>
					</el-row> 
					<el-row :class="{'row-box':true,'cfg':isRptCfg}">
						<div class="remark">{{ remark?remark:(isRptCfg?'详细说明':'') }}</div>
						<el-input class="input" v-model="remark" placeholder="说明"/>
					</el-row> 
					<el-row> 
						<div class="echart-box" :id="this.id"></div> 
					</el-row>
				</el-col>
				<el-col :span="showParams?1:0" v-if="showParams"> 
					 <el-popover   trigger="manual" v-model="filterVisible" style="float:right;" width="500">
						<el-button slot="reference" style="margin-top:10px;margin-right:10px;z-index: 99999;" icon="el-icon-more" @click="filterVisible=!filterVisible"></el-button> 
						<el-row>
							<el-button type="danger" icon="el-icon-delete" @click="$emit('delete',cfg)">从报告移出该报表</el-button>
							<el-button icon="el-icon-close" style="float:right;" @click="filterVisible=false">关闭</el-button>
						</el-row>
						<el-row>
							<el-form :model="params" class="padding"   :style="{width:'100%',overflow: 'auto'}" ref="filtersRef">
								<el-row>
									<el-col :span="15">
										<el-form-item label="分组属性">
											<el-select style="width:100px;" size="small"   v-model="params.groupBy"  @change="onXmMenuSomeFieldsChange('groupBy',$event)">
												<el-option v-for="i in this.groupBys" :label="i.name" :key="i.id" :value="i.id"></el-option>
											</el-select>
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
									</el-col>
									<el-col :span="9">
										<el-form-item label="需求状态" prop="status">
											<el-select style="width:100px;" size="small"   v-model="params.status"  @change="onXmMenuSomeFieldsChange('status',$event)" clearable>
												<el-option v-for="i in this.dicts.menuStatus" :label="i.name" :key="i.id" :value="i.id"></el-option>
											</el-select>
										</el-form-item>  
										<el-form-item  label="需求类型" prop="dtype" >
											<el-select style="width:100px;" size="small" v-model="params.dtype"  @change="onXmMenuSomeFieldsChange('dtype',$event)" clearable>
												<el-option v-for="i in this.dicts.demandType" :label="i.name" :key="i.id" :value="i.id"></el-option>
											</el-select>
										</el-form-item> 
										<el-form-item  label="需求来源" prop="source">
											<el-select style="width:100px;" size="small" v-model="params.source"  @change="onXmMenuSomeFieldsChange('source',$event)" clearable>
												<el-option v-for="i in this.dicts.demandSource" :label="i.name" :key="i.id" :value="i.id"></el-option>
											</el-select>
										</el-form-item> 
										<el-form-item  label="需求层次" prop="dlvl" >
											<el-select style="width:100px;" size="small" v-model="params.dlvl"  @change="onXmMenuSomeFieldsChange('dlvl',$event)" clearable>
												<el-option v-for="i in this.dicts.demandLvl" :label="i.name" :key="i.id" :value="i.id"></el-option>
											</el-select>
										</el-form-item> 
										<el-form-item  label="优先级别" prop="priority" >
											<el-select style="width:100px;" size="small" v-model="params.priority" @change="onXmMenuSomeFieldsChange('priority',$event)" clearable>
													<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option>
											</el-select>
										</el-form-item>  
									</el-col>
								</el-row>
								
									
								<el-form-item>
									<el-button type="primary"  style="float:right;" icon="el-icon-search" @click="searchXmMenuSort">查询</el-button>
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
	  
	import { getXmMenuSort } from '@/api/xm/core/xmMenu';
	
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//产品选择界面
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect';//迭代选择界面

	export default { 
        
		components: {   
			XmIterationSelect,XmProductSelect,
		},
        props:['id','cfg','category','showToolBar','showParams','isRptCfg','rptDatas','xmProduct','xmIteration','xmProject','initGroupBy',],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			rawDatasCpd(){
				if(this.rawDatas.length==0){
					return []
				}else{ 
					return this.rawDatas.map(i=>i.value)
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
				}else if(this.filters.product && this.filters.product.id){
					if(this.filters.product.productName){
						preName=`产品【${this.filters.product.productName}】`
					}else{
						preName=`产品【${this.filters.product.id}】`
					}
					
				}else if(this.filters.project && this.filters.project.id){ 
					if(this.filters.project.name){
						preName=`项目【${this.filters.project.name}】`
					}else{
						preName=`项目【${this.filters.project.id}】`
					}
				}
				return  preName+this.groupBys.find(i=>i.id==this.params.groupBy).name+'需求数量排行榜'
			},
			legendCpd(){
				if(this.rawDatas.length==0){
					return []
				}else{ 
					return this.rawDatas.map(i=>i.name)
				}
				
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
			rawDatasCpd(){
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
					groupBy:'mm_userid'
				},
				title:'',//报表配置项
				remark:'', //报表配置项
				groupBy:'proposer_id',
				groupBys:[
					{id:'proposer_id', name:'提出人'},
					{id:'product_id', name:'产品'},
					{id:'iteration_id', name:'迭代'},
					{id:'mm_userid', name:'负责人'}, 
					{id:'func_id', name:'模块'}, 
				],
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				rawDatas:[],
				pageInfo: {
					//分页数据
					total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize: this.queryScope==='plan' || this.queryScope==='planTask'?50:20, //每页数据
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
				if(this.initGroupBy){
					this.params.groupBy=this.initGroupBy
				}
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
				
					this.searchXmMenuSort()
				
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
							trigger: 'axis', 
						},
						barMaxWidth: 100,
						toolbox: {
							show: true,
							top:"5%",
							right:"10px",
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
							data: this.rawDatasCpd,
							type: 'bar', 						
							label:{
									show: true, 
								},
							}
						]
					}
				)
			},
			onXmMenuSomeFieldsChange(fieldName,$event){
				
			},
			searchXmMenuSort(){
				if(this.rptDatas){
					this.rawDatas=this.rptDatas
					return;
				}
				 let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count: this.pageInfo.count,
					...this.params
				};  
				if(!params.groupBy){
					this.$notify({position:'bottom-left',showClose:true,message:'请选中分组属性',type:'warning'})
					return 
				}
				getXmMenuSort(params).then(res=>{
					this.rawDatas=res.data.data
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
			}
		},//end method
		mounted() { 
 			initSimpleDicts('all',['demandSource','demandLvl','demandType','priority','menuStatus'] ).then(res=>{
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