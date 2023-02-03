<template>
	<section>
        
			
			<el-row :gutter="5" >
				<el-col :span="18"> <div>
					<div class="echart-box" :id="this.id"></div> 
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form :model="filters" class="padding" :style="{width:'100%',maxHeight:maxTableHeight+'px',overflow: 'auto'}" ref="filtersRef"> 
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
        props:['id','cfg','category','showToolBar','showParams','isRptCfg','xmProduct','xmProject'],
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
			
			taskFinishCntCpd(){
				if(this.xmProjectStateHiss.length==0){
					return []
				}else{ 
					return this.xmProjectStateHiss.map(i=>i.taskFinishCnt)
				}
			}, 
			taskSetCntCpd(){
				if(this.xmProjectStateHiss.length==0){
					return []
				}else{ 
					return this.xmProjectStateHiss.map(i=>i.taskSetCnt)
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
				return  preName+"任务每日累积图"
			}
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
				var params={...this.params,orderBy:'biz_date asc'}
				 
				listXmProjectStateHis(params).then(res=>{ 
					this.xmProjectStateHiss=res.data.tips.isOk?res.data.data:this.xmProjectStateHiss;
				})
			},
			open(){
				this.visible=true;
				this.filters.product=this.xmProduct
				this.filters.project=this.xmProject
				this.filters.iteration=this.xmIteration 
				this.xmProjectStateHiss=[]
				if(this.$refs['xmProjectSelect'])this.$refs['xmProjectSelect'].clearSelect();
				this.$nextTick(()=>{
					this.listXmProjectStateHis();
				})
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById(this.id));
				this.myChart.setOption(  
					{
						title: {
							text: this.titleCpd,
							left:"center"
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
						calculable: true,
						barMaxWidth: 100,
						legend: { 
							bottom: 'bottom',
							data: ['未开始', '执行中', '已验收','已结算', '已关闭']
						},
						grid: { 
							containLabel: true
						},
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
							name: '已验收',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},
							data: this.taskFinishCntCpd,
							}, 
							{
							name: '已结算',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
							},
							data: this.taskSetCntCpd,
							}, 
							{
							name: '已关闭',
							type: 'line',
							stack: 'Total',
							areaStyle: {},
							emphasis: {
								focus: 'series'
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