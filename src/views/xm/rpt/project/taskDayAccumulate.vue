<template>
	<section>
        <el-dialog :title="(filters.project?'【'+filters.project.name+'】':'')+'任务累积图'" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			
			<el-row :gutter="5">
				<el-col :span="18"> <div>
					<div class="main" id="taskDayAccumulate"
							style="width:100%;height:600px;margin:0 auto;"></div> 
					</div>
				</el-col>
				<el-col :span="6" class="border padding">
					<el-form   :model="filters"> 
						<el-form-item label="归属项目" v-if="!xmProject">
							 <xm-project-select  v-if="!xmProject"  ref="xmProjectSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProjectSelected"   @clear="onProjectClear"></xm-project-select>
  					  </el-form-item>    
					<el-form-item label="日期区间">
						<br>
							< mdp-date-range v-model="filters" value-format="yyyy-MM-dd" start-key="startBizDate" end-key="endBizDate"></ mdp-date-range>
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
	
	import { listXmProjectStateHis } from '@/api/xm/core/xmProjectStateHis';
	import  XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';//新增界面
	export default { 
        
		components: {   
			XmProjectSelect,
		},
        props:['xmProduct','xmProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
            datesCpd(){
				if(this.xmProjectStateHiss.length==0){
					return []
				}else{ 
					return this.xmProjectStateHiss.map(i=>i.bizDate)
				}
			}, 
			taskCloseCntCpd(){
				if(this.xmProjectStateHiss.length==0){
					return []
				}else{ 
					return this.xmProjectStateHiss.map(i=>i.taskCloseCnt)
				}
			},
			taskUnstartCntCpd(){
				if(this.xmProjectStateHiss.length==0){
					return []
				}else{ 
					return this.xmProjectStateHiss.map(i=> i.taskUnstartCnt)
				}
			},
			taskExecCntCpd(){
				if(this.xmProjectStateHiss.length==0){
					return []
				}else{ 
					return this.xmProjectStateHiss.map(i=> i.taskExecCnt)
				}
			},
			
			taskFinishCntCpd(){
				if(this.xmProjectStateHiss.length==0){
					return []
				}else{ 
					return this.xmProjectStateHiss.map(i=>i.taskFinishCnt)
				}
			},
			
        }, 
		watch: {  
			datesCpd(){
				
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
                    project:null,
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
				this.filters.Product=params.xmProduct
				this.xmProjectStateHiss=[]
				if(this.$refs['xmProjectSelect'])this.$refs['xmProjectSelect'].clearSelect();
				this.$nextTick(()=>{
					this.listXmProjectStateHis();
				})
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("taskDayAccumulate")); 
				this.myChart.setOption(  
					{
						title: {
							text: '任务累积图'
						}, 

						tooltip: {
							trigger: 'axis',
							axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#6a7985'
							}
							}
						},
						legend: {
							data: ['未开始', '执行中', '已完成', '已关闭']
						},
						grid: {
							left: '3%',
							right: '4%',
							bottom: '3%',
							containLabel: true
						},
						toolbox: {
							feature: {
							saveAsImage: {}
							}
						},
						xAxis: {
							type: 'category',
							boundaryGap: false,
							data: this.datesCpd,
						},
						yAxis: {
							type: 'value'
						},
						series: [
							{
							name: '未开始',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},
							data: this.taskUnstartCntCpd
							},
							{
							name: '执行中',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},
							data: this.taskExecCntCpd,
							},
							{
							name: '已完成',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},
							data: this.taskFinishCntCpd,
							},
							{
							name: '已关闭',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},

							label: {
								show: true,
								position: 'top'
							},
							data: this.taskCloseCntCpd,
							} 
						]
					}
				)
			},
			
			
			onProjectSelected(project){
				this.filters.project=project
				this.xmProjectStateHiss=[];
				this.listXmProjectStateHis();
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
			//this.drawCharts()
			
		}//end mounted
	}

</script>

<style scoped>
   .image {
    width: 100%;
    display: block;
  }
</style>