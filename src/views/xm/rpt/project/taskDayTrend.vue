<template>
	<section>
        <el-dialog fullscreen :title="(filters.project?'【'+filters.project.name+'】':'')+'任务每日趋势'" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			
			<el-row :gutter="5" v-if="visible">
				<el-col :span="18"> 
					<div>
						<div class="main" id="taskDayTrend"
							style="width:100%;height:600px;margin:0 auto;"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form   :model="filters" class="padding"> 
					<el-form-item label="归属项目" >
						<xm-project-select v-if="!xmProject || !xmProject.id" ref="xmProjectSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProjectSelected"   @clear="onProjectClear"></xm-project-select>
						<span v-else>{{xmProject.id}} <span v-if="xmProject.name"><br/>{{  xmProject.name  }} </span> </span> 
					</el-form-item>  
					<el-form-item label="日期区间">
						<br>
							<mdp-date-range v-model="filters" value-format="yyyy-MM-dd" start-key="startBizDate" end-key="endBizDate"></mdp-date-range>
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
				this.filters.product=this.xmProduct
				this.filters.project=this.xmProject
				this.filters.iteration=this.xmIteration 
				if(this.$refs['xmProjectSelect'])this.$refs['xmProjectSelect'].clearSelect();
				this.$nextTick(()=>{
					this.listXmProjectStateHis();
				})
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("taskDayTrend")); 
				this.myChart.setOption(  
					{	
						
						barMaxWidth: 100,
						legend: {
							right: 40,
							data: ['待领取','执行中','已完成','已结算','已关闭']
						},
						xAxis: {
							type: 'category',
							data: this.datesCpd
						},
						yAxis: {
							type: 'value'
						},
						series: [
							{
								name:'待领取',
								data: this.taskUnstartCntCpd,
								type: 'line',
								smooth: true,  
								itemStyle: {
									normal: {
										// 折点颜色样式
										color: 'orange',
										lineStyle: {
											// 折线颜色样式
											color: 'orange'
										}
									}
								},
							},
							
							{
								name:'执行中',
								data: this.taskExecCntCpd,
								type: 'line',
								smooth: true, 
								itemStyle: {
									normal: {
										// 折点颜色样式
										color: 'blue',
										lineStyle: {
											// 折线颜色样式
											color: 'blue'
										}
									}
								},
							},
							
							{
								name:'已完成',
								data: this.taskFinishCntCpd,
								type: 'line',
								smooth: true, 
								itemStyle: {
									normal: {
										// 折点颜色样式
										color: 'green',
										lineStyle: {
											// 折线颜色样式
											color: 'green'
										}
									}
								},
							},
							
							{
								name:'已结算',
								data: this.taskCloseCntCpd,
								type: 'line',
								smooth: true, 
								itemStyle: {
									normal: {
										// 折点颜色样式
										color: 'red',
										lineStyle: {
											// 折线颜色样式
											color: 'red'
										}
									}
								},
							},
							
							{
								name:'已关闭',
								data: this.taskCloseCntCpd,
								type: 'line',
								smooth: true, 
								itemStyle: {
									normal: {
										// 折点颜色样式
										color: 'red',
										lineStyle: {
											// 折线颜色样式
											color: 'red'
										}
									}
								},
							}
						]
					}
				)
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