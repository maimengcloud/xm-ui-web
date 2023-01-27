<template>
	<section>
        <el-dialog fullscreen :title="dialogTitle" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			<el-row :gutter="5" v-if="visible">
				<el-col :span="18"> 
					<div>
						<div class="main" id="xmQuestionAgeDist"
							style="width:100%;height:600px;margin:0 auto;"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form :model="filters">   
						
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
						 <el-button type="primary" icon="el-icon-search" @click="searchXmQuestionAgeDist">查询</el-button>
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
	  
	import { getXmQuestionAgeDist } from '@/api/xm/core/xmQuestion';
	
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//产品选择界面
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect';//迭代选择界面

	export default { 
        
		components: {   
			XmIterationSelect,XmProductSelect,
		},
        props:['xmProduct','xmIteration','xmProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			xmQuestionAgeDistsCpd(){
				if(this.xmQuestionAgeDists.length==0){
					return []
				}else{   
					var datas=[]
					this.xmQuestionAgeDists.forEach(i=>{
						var data={...i}
						 data.name=this.legendCpd[i.name]
						 datas.push(data)
					})
					return datas;
				}
			},
			title(){
				return '缺陷年龄数量分布'
			},
			legendCpd(){
				 return ['0-2天','3-5天','6-7天','8-15天','16-30天','30天以上']
			},
			dialogTitle(){
				if(this.xmIteration && this.xmIteration.id){
					return (this.xmIteration?'迭代【'+this.xmIteration.iterationName+'】':'')+'缺陷年龄数量分布'
				}else {
					return (this.filters.product?'产品【'+this.filters.product.productName+'】':'')+'缺陷年龄数量分布'
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
			xmQuestionAgeDistsCpd(){
				this.drawCharts();
			}
	    },
		data() {
			return {
                filters:{
                    product:null,  
					iteration:null,
                }, 
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmQuestionAgeDists:[],

			}//end return
		},//end data
		methods: {   
			open(params){
				this.visible=true;
				this.filters.product=params.xmProduct
				this.filters.project=params.xmProject
				this.filters.iteration=params.xmIteration 
				if((this.filters.product && this.filters.product.id) || ( this.filters.iteration && this.filters.iteration.id)){
					this.searchXmQuestionAgeDist()
				}
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("xmQuestionAgeDist")); 
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
							data: this.xmQuestionAgeDistsCpd,
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
				this.xmQuestionAgeDists=[]
			},
			searchXmQuestionAgeDist(){ 
				var params={}
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
				params.groupBy=this.groupBy
				if(this.filters.product){
					params.productId=this.filters.product.id
				}
				
				if(this.filters.iteration){
					params.linkIterationId=this.filters.iteration.id
				}
				getXmQuestionAgeDist(params).then(res=>{
					this.xmQuestionAgeDists=res.data.data
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
 			initSimpleDicts('all',['bugSeverity','bugSolution','bugStatus','bugType','priority','bugRepRate','bugReason'] ).then(res=>{
				this.dicts=res.data.data;
			}) 
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