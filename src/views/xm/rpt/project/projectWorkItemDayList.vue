<template>
	<section>
        <el-dialog :title="(filters.project?'【'+filters.project.name+'】':'')+'工作项按日分布趋势图'" fullscreen append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
 
			<el-row :gutter="5">
				<el-col :span="18"> 
					<div> 
						<div class="main" id="projectWorkItemDayList" style="width:100%;height:600px;margin:0 auto;"></div> 
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form   :model="filters"> 
					<el-form-item label="归属项目" v-if="!xmProject">
							 <xm-project-select  ref="xmProjectSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProjectSelected"   @clear="onProjectClear"></xm-project-select>
  					</el-form-item>  
					<el-form-item label="日期区间">
						<br>
							<mdp-date-range v-model="filters"   value-format="yyyy-MM-dd" start-key="startBizDate" end-key="endBizDate"></mdp-date-range>
  					</el-form-item>  
					<el-form-item>
						 <el-button type="primary" icon="el-icon-search" @click="listXmProjectStateHis">查询</el-button>
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
	
	import  XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';//新增界面
	import { listXmProjectStateHis } from '@/api/xm/core/xmProjectStateHis';
	export default { 
        
		components: {  
			XmProjectSelect, 
		},
        props:['xmProduct','xmProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]),  
			dataSetCpd(){
				return [
					['日期',...this.xmProjectStateHiss.map(i=>i.bizDate)],
					['未关故事',...this.xmProjectStateHiss.map(i=>i.menuCnt-i.menuCloseCnt)],
					['已关故事',...this.xmProjectStateHiss.map(i=>i.menuCloseCnt)],
					['未关任务',...this.xmProjectStateHiss.map(i=>i.taskCnt-i.taskCloseCnt)],
					['已关任务',...this.xmProjectStateHiss.map(i=>i.taskCloseCnt)],
					['未关缺陷',...this.xmProjectStateHiss.map(i=>i.bugCnt-i.closedBugs)],
					['已关缺陷',...this.xmProjectStateHiss.map(i=>i.closedBugs)]
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
                },
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmProjectStateHiss:[],

			}//end return
		},//end data
		methods: {  
			listXmProjectStateHis(){
				if(!this.filters.project){
					this.$notify({position:'bottom-left',showClose:true,message:'请先选中项目',type:'warning'})
					return;
				}
				
				var params={projectId: this.filters.project.id,orderBy:'biz_date asc'}
				if(this.filters.startBizDate && this.filters.endBizDate){
					params.startBizDate=this.filters.startBizDate;
					params.endBizDate=this.filters.endBizDate;
				}
				listXmProjectStateHis(params).then(res=>{ 
					this.xmProjectStateHiss=res.data.tips.isOk?res.data.data:this.xmProjectStateHiss;
				})
			},
			open(params){
				this.visible=true;
				this.filters.product=params.xmProduct
				this.filters.project=params.xmProject
				this.filters.iteration=params.xmIteration
				this.xmProjectStateHiss=[]
				
				this.$nextTick(()=>{
					if(this.$refs['xmProjectSelect'])this.$refs['xmProjectSelect'].clearSelect();
					this.listXmProjectStateHis();
				})
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("projectWorkItemDayList")); 
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
						{ 	name:'未关故事',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true, 
        					emphasis: { focus: 'series' }, 
						},
						{ 	name:'已关故事',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true, 
        					emphasis: { focus: 'series' }, 
						},
						{ 
							name:'未关任务',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' }, 
						},
						{ 
							name:'已关任务',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' }, 
						},
						{ 	name:'未关缺陷',
							type: 'line',
        					seriesLayoutBy: 'row',
							smooth:true,
        					emphasis: { focus: 'series' },  
						},
						{ 	name:'已关缺陷',
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
				this.xmProjectStateHiss=[]; 
			},
			
			onProjectClear(){
				this.filters.project=null
				
				this.xmProjectStateHiss=[];
				
			},
		},//end method
		mounted() {
			/**
 			initSimpleDicts('all',['planType','xmTaskSettleSchemel','taskType','priority','taskState'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
             */
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