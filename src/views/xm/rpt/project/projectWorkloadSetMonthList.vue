<template>
	<section>
        
 
			<el-row :gutter="5" >
				<el-col :span="18"> 
					<div> 
						<div class="main" id="projectWorkloadSetMonthList" style="width:100%;height:600px;margin:0 auto;"></div> 
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form   :model="filters" class="padding"> 
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
						 <el-button type="primary" icon="el-icon-search" @click="listProjectWorkloadSetMonth">查询</el-button>
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
	
	import  XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';//新增界面
	import { listProjectWorkloadSetMonth } from '@/api/xm/core/xmWorkload';
	export default { 
        
		components: {  
			XmProjectSelect, 
    		"mdp-select-user-xm":()=>import("@/views/xm/core/components/MdpSelectUserXm/index"),
		},
        props:['xmProduct','xmProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),  
			dataSetCpd(){
				return [
					['日期',...this.xmProjectWorkloadSetMonths.map(i=>i.bizMonth)],
					['登记工时',...this.xmProjectWorkloadSetMonths.map(i=>i.workload)],
					['待确认',...this.xmProjectWorkloadSetMonths.map(i=>i.toConfirmWorkload)],
					['已确认',...this.xmProjectWorkloadSetMonths.map(i=>i.hadConfirmWorkload)],
					['待结算',...this.xmProjectWorkloadSetMonths.map(i=>i.toSetWorkload)],
					['已提交审核',...this.xmProjectWorkloadSetMonths.map(i=>i.hadCommitSworkload)],
					['已审核',...this.xmProjectWorkloadSetMonths.map(i=>i.hadAgreeSworkload)],
					['已结算',...this.xmProjectWorkloadSetMonths.map(i=>i.hadSetSworkload)]
				]
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
                    category:'', 
                    product:null,
                    iteration:null,
                    project:null,
					startBizDate:'',
					endBizDate:'',
					userid:'',
					taskId:''
                },
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmProjectWorkloadSetMonths:[],

			}//end return
		},//end data
		methods: {  
			listProjectWorkloadSetMonth(){
				if(!this.filters.project){
					this.$notify({position:'bottom-left',showClose:true,message:'请先选中项目',type:'warning'})
					return;
				}
				
				var params={projectId: this.filters.project.id}
				if(this.filters.startBizDate && this.filters.endBizDate){
					params.startBizDate=this.filters.startBizDate;
					params.endBizDate=this.filters.endBizDate;
				}
				
				if(this.filters.userid){
					params.userid=this.filters.userid
				}
				if(this.filters.taskId){
					params.taskId=this.filters.taskId
				}
				listProjectWorkloadSetMonth(params).then(res=>{ 
					this.xmProjectWorkloadSetMonths=res.data.tips.isOk?res.data.data:this.xmProjectWorkloadSetMonths;
				})
			},
			open(){
				this.visible=true;
				this.filters.product=this.xmProduct
				this.filters.project=this.xmProject
				this.filters.iteration=this.xmIteration 
				this.xmProjectWorkloadSetMonths=[]
				
				this.$nextTick(()=>{
					if(this.$refs['xmProjectSelect'])this.$refs['xmProjectSelect'].clearSelect();
					this.listProjectWorkloadSetMonth();
				})
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("projectWorkloadSetMonthList")); 
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
						text: '工作项分布',
					},
					tooltip: {
						trigger: 'axis',
      					showContent: false
					},
					
					barMaxWidth: 100,
					legend: { 
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
							center: ['50%', '25%'],
							emphasis: {
								focus: 'self'
							},
							label: {
								formatter: '{b}: {@日期} ({d}%)'
							},
							encode: {
								itemName: '日期',
								value: '日期',
								tooltip: '日期'
							}
						}
					]
				}); 
			},
			
			onProjectSelected(project){
				this.filters.project=project
				this.xmProjectWorkloadSetMonths=[]; 
			},
			
			onProjectClear(){
				this.filters.project=null
				
				this.xmProjectWorkloadSetMonths=[];
				
			},
		},//end method
		mounted() {
			/**
 			initSimpleDicts('all',['planType','xmTaskSettleSchemel','taskType','priority','taskState'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
             */
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