<template>
	<section>
		<el-row class="padding">
			<span>{{compCfg?compCfg.name:'缺陷属性数量分布'}}</span>
			<el-popover   trigger="manual" v-model="conditionBtnVisible" style="float:right;" width="300">  
				<el-button slot="reference" icon="el-icon-more" @click="conditionBtnVisible=!conditionBtnVisible"></el-button> 
				<el-row>
					<el-button type="danger" icon="el-icon-delete" @click="doDelete">删除</el-button>
				  <el-button style="float:right;" type="text" icon="el-icon-close" @click="conditionBtnVisible=false">关闭</el-button> 
				</el-row>
					<el-form :model="filters">   
						<el-form-item label="分组属性">
							<el-select   v-model="filters.groupBy"  @change="onXmQuestionSomeFieldsChange('groupBy',$event)" clearable>
								<el-option v-for="i in this.groupBys" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
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
						  <el-button type="primary" icon="el-icon-search" @click="searchXmQuestionAttDist">查询</el-button>
					</el-form-item>  
					</el-form> 
			</el-popover>
		</el-row>
		<el-row>  
			<div>
				<div class="main" :id="id"
					style="width:100%;height:600px;margin:0 auto;"></div>
				<div class="progress"></div>
			</div> 
		</el-row>
 	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询  
	import { mapGetters } from 'vuex'	 
	  
	import { getXmQuestionAttDist } from '@/api/xm/core/xmQuestion';
	
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect.vue';//修改界面 
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//新增界面

	export default { 
        
		components: {   
			XmIterationSelect,XmProductSelect,
		},
        props:['xmTestPlan','xmRptConfig','compCfg'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			xmQuestionAttDistsCpd(){
				if(this.xmQuestionAttDists.length==0){
					return []
				}else{ 
					var itemId="";
					if(this.filters.groupBy=='bug_status'){
						itemId="bugStatus"
					}else if(this.filters.groupBy=='bug_type'){
						itemId="bugType"
					}else if(this.filters.groupBy=='bug_reason'){
						itemId="bugReason"
					}else if(this.filters.groupBy=='bug_severity'){
						itemId="bugSeverity"
					}else if(this.filters.groupBy=='priority'){
						itemId="priority"
					} else if(this.filters.groupBy=='bug_solution'){
						itemId="bugSolution"
					} else if(this.filters.groupBy=='rep_rate'){
						itemId="bugRepRate"
					} 
					return this.xmQuestionAttDists.map(i=>{
						var data={...i}
						data.name=this.formatDict(itemId,data.name)
						return data;
					})
				}
			},
			title(){
				return this.groupBys.find(i=>i.id==this.filters.groupBy).name+'数量分布'
			},
			legendCpd(){
				var itemId="";
				if(this.filters.groupBy=='bug_status'){
					itemId="bugStatus"
				}else if(this.filters.groupBy=='bug_type'){
					itemId="bugType"
				}else if(this.filters.groupBy=='bug_reason'){
					itemId="bugReason"
				}else if(this.filters.groupBy=='bug_severity'){
					itemId="bugSeverity"
				}else if(this.filters.groupBy=='priority'){
					itemId="priority"
				} else if(this.filters.groupBy=='bug_solution'){
					itemId="bugSolution"
				} else if(this.filters.groupBy=='rep_rate'){
					itemId="bugRepRate"
				} 

				return this.dicts[itemId].map(i=>i.name)
			},
			id(){
				return this.compCfg.id
			},
			
        }, 
		watch: {  
			xmQuestionAttDistsCpd(){
				this.drawCharts();
			}
	    },
		data() {
			return {
                filters:{
					groupBy:'bug_status',
                    planId:'',
					productId:'',
					projectId:'',
					bugStatus:'',
					bugType:'',
					bugReason:'',
					bugSeverity:'',
					priority:'',
					solution:'',
					repRate:'',
                }, 
				groupBys:[
					{id:'bug_status', name:'缺陷状态'},
					{id:'bug_type', name:'缺陷类型'},
					{id:'bug_reason', name:'缺陷原因'},
					{id:'bug_severity', name:'紧急程度'},
					{id:'priority', name:'优先级'},
					{id:'bug_solution', name:'解决方案'},
					{id:'rep_rate', name:'复现频率'},
					
				],
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmQuestionAttDists:[],
				conditionBtnVisible:false,

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
			open(params){
				this.visible=true;
				this.filters.product=params.xmProduct
				this.filters.project=params.xmProject
				this.filters.Product=params.xmProduct 
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById(this.id)); 
				this.myChart.setOption(   
					{
						title: {
							text: this.title, 
							left: 'center'
						},
						tooltip: {
							trigger: 'item'
						},
						legend: { 
							top:'5%',
							left: 'center',
							data:this.legendCpd,
						},
						series: [
							{
							type: 'pie',
							radius: '50%',
							data: this.xmQuestionAttDistsCpd,
							emphasis: {
								itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},

							label: {
								show: true,
								position: 'center'
							},
							}
						]
					}
				)
			},
			onXmQuestionSomeFieldsChange(fieldName,$event){
				this.xmQuestionAttDists=[]
			},
			searchXmQuestionAttDist(){
				if(!this.filters.groupBy){
					this.$notify({position:'bottom-left',showClose:true,message:'请选中分组属性',type:'warning'})
					return 
				}
				var params={...this.filters}
				 
				getXmQuestionAttDist(params).then(res=>{
					this.xmQuestionAttDists=res.data.data
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
			},
			initData(){
				if(this.xmTestPlan){
					this.filters.productId=this.xmTestPlan.productId
					this.filters.projectId=this.xmTestPlan.projectId
					this.filters.planId=this.xmTestPlan.id
				}
				
				if(this.compCfg && this.compCfg.params){
					Object.assign(this.filters,this.compCfg.params) 
				} 
			},
			doDelete(){
				this.$emit("delete",this.compCfg)
			},
			sizeAutoChange(){
				this.myChart.resize();
			}
		},//end method
		mounted() { 
 			initSimpleDicts('all',['bugSeverity','bugSolution','bugStatus','bugType','priority','bugRepRate','bugReason'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
			this.initData();
			this.searchXmQuestionAttDist();
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