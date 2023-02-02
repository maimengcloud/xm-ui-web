<template>
	<section>
			<el-row :gutter="5" >
				<el-col :span="18"> 
					<div>
						<div class="echart-box" id="xmMenuAgeDist"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form :model="filters" class="padding" :style="{width:'100%',maxHeight:maxTableHeight+'px',overflow: 'auto'}" ref="filtersRef">   
						
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
						<el-form-item label="需求状态" prop="status">
							<el-select   v-model="filters.status"  @change="onXmMenuSomeFieldsChange('status',$event)" clearable>
								<el-option v-for="i in this.dicts.menuStatus" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>  
						<el-form-item  label="需求类型" prop="dtype" >
							<el-select v-model="filters.dtype"  @change="onXmMenuSomeFieldsChange('dtype',$event)" clearable>
								<el-option v-for="i in this.dicts.demandType" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item> 
						<el-form-item  label="需求来源" prop="source">
							<el-select v-model="filters.source"  @change="onXmMenuSomeFieldsChange('source',$event)" clearable>
								<el-option v-for="i in this.dicts.demandSource" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item> 
						<el-form-item  label="需求层次" prop="dlvl" >
							<el-select v-model="filters.dlvl"  @change="onXmMenuSomeFieldsChange('dlvl',$event)" clearable>
								<el-option v-for="i in this.dicts.demandLvl" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item> 
					<el-form-item  label="优先级" prop="priority" >
						<el-select v-model="filters.priority" @change="onXmMenuSomeFieldsChange('priority',$event)" clearable>
								<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option>
						</el-select>
					</el-form-item>  
					<el-form-item>
						 <el-button type="primary" icon="el-icon-search" @click="searchXmMenuAgeDist">查询</el-button>
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
	  
	import { getXmMenuAgeDist } from '@/api/xm/core/xmMenu';
	
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
			xmMenuAgeDistsCpd(){
				if(this.xmMenuAgeDists.length==0){
					return []
				}else{   
					var datas=[]
					this.xmMenuAgeDists.forEach(i=>{
						var data={...i}
						 data.name=this.legendCpd[i.name]
						 datas.push(data)
					})
					return datas;
				}
			},
			
			legendCpd(){
				 return ['0-2天','3-5天','6-7天','8-15天','16-30天','30天以上']
			}, 
			
			total(){
				if(!this.xmMenuAgeDists || this.xmMenuAgeDists.length==0){
					return 0
				}else{   
					return this.xmMenuAgeDists.reduce((n, i) => {
						return (n += i.value);
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
				return  preName+'需求年龄数量分布' 
				
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
			xmMenuAgeDistsCpd(){
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
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmMenuAgeDists:[],

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
				
  				this.searchXmMenuAgeDist()  
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("xmMenuAgeDist")); 
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
								'需求数'+this.total ,

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
							data: this.xmMenuAgeDistsCpd,
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
			onXmMenuSomeFieldsChange(fieldName,$event){
				this.xmMenuAgeDists=[]
			},
			searchXmMenuAgeDist(){ 
				var params={}
				if(this.filters.dtype){
					params.dtype=this.filters.dtype
				}
				if(this.filters.status){
					params.status=this.filters.status
				}
				if(this.filters.source){
					params.source=this.filters.source
				}
				if(this.filters.dlvl){
					params.dlvl=this.filters.dlvl
				}
				if(this.filters.priority){
					params.priority=this.filters.priority
				} 
				params.groupBy=this.groupBy
				if(this.filters.product){
					params.productId=this.filters.product.id
				}
				
				if(this.filters.iteration){
					params.iterationId=this.filters.iteration.id
				}
				getXmMenuAgeDist(params).then(res=>{
					this.xmMenuAgeDists=res.data.data
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