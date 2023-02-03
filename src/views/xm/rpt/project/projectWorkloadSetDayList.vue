<template>
	<section>
        
 
			<el-row :gutter="5" >
				<el-col :span="18"> 
					<div> 
						<div class="main" :id="this.id"></div> 
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form :model="filters" class="padding" :style="{width:'100%',maxHeight:maxTableHeight+'px',overflow: 'auto'}" ref="filtersRef"> 
					<el-form-item label="归属项目" >
						<xm-project-select v-if="!xmProject || !xmProject.id" ref="xmProjectSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProjectSelected"   @clear="onProjectClear"></xm-project-select>
						<span v-else>{{xmProject.id}} <span v-if="xmProject.name"><br/>{{  xmProject.name  }} </span> </span> 
					</el-form-item>  
					<el-form-item label="人员编号">
						<mdp-select-user-xm label="选择人员" :clearable="true" v-model="filters" userid-key="userid" username-key="username" :project-id="filters.project?filters.project.id:null"></mdp-select-user-xm>

  					</el-form-item>  
					  
					<el-form-item label="任务编号编号">
							<el-input v-model="filters.taskId"></el-input>
  					</el-form-item>  
					<el-form-item label="日期区间">
						<br>
							<mdp-date-range v-model="filters"   value-format="yyyy-MM-dd" start-key="startBizDate" end-key="endBizDate"></mdp-date-range>
  					</el-form-item>  
					<el-form-item>
						 <el-button type="primary" icon="el-icon-search" @click="listProjectWorkloadSetDay">查询</el-button>
					</el-form-item>  
					</el-form>
				</el-col>
			</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import seq from '@/common/js/sequence';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	
	import  XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';//新增界面
	import { listProjectWorkloadSetDay } from '@/api/xm/core/xmWorkload';
	export default { 
        
		components: {  
			XmProjectSelect,
    		"mdp-select-user-xm":()=>import("@/views/xm/core/components/MdpSelectUserXm/index")
		},
        props:['id','cfg','category','showToolBar','showParams','isRptCfg','xmProduct','xmProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),  
			dataSetCpd(){
				return [
					['日期',...this.xmProjectWorkloadSetDays.map(i=>i.bizDate)],
					['登记工时',...this.xmProjectWorkloadSetDays.map(i=>i.workload)],
					['待确认',...this.xmProjectWorkloadSetDays.map(i=>i.toConfirmWorkload)],
					['已确认',...this.xmProjectWorkloadSetDays.map(i=>i.hadConfirmWorkload)],
					['待结算',...this.xmProjectWorkloadSetDays.map(i=>i.toSetWorkload)],
					['已提交审核',...this.xmProjectWorkloadSetDays.map(i=>i.hadCommitSworkload)],
					['已审核',...this.xmProjectWorkloadSetDays.map(i=>i.hadAgreeSworkload)],
					['已结算',...this.xmProjectWorkloadSetDays.map(i=>i.hadSetSworkload)]
				]
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
				return  preName+"项目工时每日分布"
			}
        }, 
		watch: {  
			dataSetCpd(){  
				this.$nextTick(()=>{
					this.drawCharts();
				})
				
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

                    category:'',  
					startBizDate:'',
					endBizDate:'',
					userid:'',
					taskId:''
                },
				params:{

				},
				title:'',//报表配置项
				remark:'', //报表配置项
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				 
                maxTableHeight:300, 
                visible:false,
				xmProjectWorkloadSetDays:[],
				id:seq.sn(),

			}//end return
		},//end data
		methods: {  
			listProjectWorkloadSetDay(){
				if(!this.filters.project){
					this.$notify({position:'bottom-left',showClose:true,message:'请先选中项目',type:'warning'})
					return;
				}
				
				var params={...this.params,orderBy:'biz_date asc'}
				 
				listProjectWorkloadSetDay(params).then(res=>{ 
					this.xmProjectWorkloadSetDays=res.data.tips.isOk?res.data.data:this.xmProjectWorkloadSetDays;
				})
			},
			open(){
				this.visible=true;
				this.filters.product=this.xmProduct
				this.filters.project=this.xmProject
				this.filters.iteration=this.xmIteration   
				this.xmProjectWorkloadSetDays=[] 
				this.$nextTick(()=>{
					if(this.$refs['xmProjectSelect'])this.$refs['xmProjectSelect'].clearSelect();
					this.listProjectWorkloadSetDay();
				})
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById(this.id)); 
				var that=this;
				this.myChart.on('updateAxisPointer', function (event) {
					const xAxisInfo = event.axesInfo[0];
					if (xAxisInfo) {
					const dimension = xAxisInfo.value + 1;
					that.myChart.setOption({
						series: {
						id: 'pie',
						label: {
							formatter: '{b}: {@[' + dimension + ']} ({d}%)'
						},
						encode: {
							value: dimension,
							tooltip: dimension
						}
						}
					});
					}
				});
				this.myChart.setOption({	
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
					legend: { 
							bottom: 'bottom',
					},

					dataset: {
						source:  this.dataSetCpd
					},
					xAxis: {
						type: 'category', 
					},
					yAxis: { gridIndex: 0 },
    				grid: { top: '55%' },
					series: [
						{ 	name:'登记工时',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true, 
        					emphasis: { focus: 'series' }, 
						},
						{ 	name:'待确认',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true, 
        					emphasis: { focus: 'series' }, 
						},
						{ 
							name:'已确认',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' }, 
						},
						{ 
							name:'无需结算',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' }, 
						},
						{ 	name:'待结算',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' },  
						},
						{ 	name:'已提交审核',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' },  
						},
						{ 	name:'已审核',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' },  
						},
						
						{ 	name:'已结算',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' },  
						},
						{
							type: 'pie',
							id: 'pie',
							radius: '30%',
							center: ['50%', '30%'],
							emphasis: {
								focus: 'self'
							},
							label: {
								formatter: '{b}: {@日期} ({d}%)'
							},
							encode: {
								itemName: '日期',
								value:this.dataSetCpd[0][this.dataSetCpd[0].length-1],
								tooltip: '日期'
							}
						}
					]
				}); 
			},
			
			onProjectSelected(project){
				this.filters.project=project
				this.xmProjectWorkloadSetDays=[]; 
			},
			
			onProjectClear(){
				this.filters.project=null
				
				this.xmProjectWorkloadSetDays=[];
				
			},
		},//end method
		mounted() {
			/**
 			initSimpleDicts('all',['planType','xmTaskSettleSchemel','taskType','priority','taskState'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
             */
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