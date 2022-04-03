<template>
	<section>
        <el-dialog :title="filters.product?'产品【'+filters.product.productName+'】':''+'需求属性分布'" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			<el-row :gutter="5">
				<el-col :span="18"> 
					<div>
						<div class="main" id="xmMenuAttDist"
							style="width:100%;height:600px;margin:0 auto;"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form :label-position="'top'" label-width="120px" :model="filters">
						<el-form-item label="分组属性">
							<el-select   v-model="groupBy"  @change="onXmMenuSomeFieldsChange('groupBy',$event)" clearable>
								<el-option v-for="i in this.groupBys" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>     
							 <xm-product-select class="padding" v-if="!xmProduct && !xmIteration"  ref="xmProductSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProductSelected"  :iterationId="xmIteration?xmIteration.id:null"  @clear="onProductClear"></xm-product-select>
						    
							<xm-iteration-select ref="xmIterationSelect" class="padding" v-if="!xmIteration || !xmIteration.id"  :auto-select="false"  :product-id="filters.product?filters.product.id:null" :link-project-id="xmProject?xmProject.id:null"   placeholder="迭代"  @row-click="onIterationSelected" @clear="onIterationClear"></xm-iteration-select>
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
						 <el-button type="primary" icon="el-icon-search" @click="searchXmMenuAttDist">查询</el-button>
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
	  
	import { getXmMenuAttDist } from '@/api/xm/core/xmMenu';
	
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect.vue';//修改界面 
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//新增界面

	export default { 
        
		components: {   
			XmIterationSelect,XmProductSelect,
		},
        props:['xmProduct','xmIteration','xmProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ]), 
			xmMenuAttDistsCpd(){
				if(this.xmMenuAttDists.length==0){
					return []
				}else{ 
					var itemId="";
					if(this.groupBy=='status'){
						itemId="menuStatus"
					}else if(this.groupBy=='dlvl'){
						itemId="demandLvl"
					}else if(this.groupBy=='dtype'){
						itemId="demandType"
					}else if(this.groupBy=='priority'){
						itemId="priority"
					}else if(this.groupBy=='source'){
						itemId="demandSource"
					} 
					return this.xmMenuAttDists.map(i=>{
						var data={...i}
						data.name=this.formatDict(itemId,data.name)
						return data;
					})
				}
			},
			title(){
				return this.groupBys.find(i=>i.id==this.groupBy).name+'数量分布'
			},
			legendCpd(){
				var itemId="";
				if(this.groupBy=='status'){
					itemId="menuStatus"
				}else if(this.groupBy=='dlvl'){
					itemId="demandLvl"
				}else if(this.groupBy=='dtype'){
					itemId="demandType"
				}else if(this.groupBy=='priority'){
					itemId="priority"
				}else if(this.groupBy=='source'){
					itemId="demandSource"
				} 

				return this.dicts[itemId].map(i=>i.name)
			}
			
        }, 
		watch: {  
			xmMenuAttDistsCpd(){
				this.drawCharts();
			}
	    },
		data() {
			return {
                filters:{
                    product:null,  
					iteration:null,
                },
				groupBy:'status',
				groupBys:[
					{id:'status', name:'需求状态'},
					{id:'dtype', name:'需求类型'},
					{id:'source', name:'需求来源'},
					{id:'dlvl', name:'需求层次'},
					{id:'priority', name:'优先级'}
				],
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmMenuAttDists:[],

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
				this.myChart = this.$echarts.init(document.getElementById("xmMenuAttDist")); 
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
							data: this.xmMenuAttDistsCpd,
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
			onXmMenuSomeFieldsChange(fieldName,$event){
				this.xmMenuAttDists=[]
			},
			searchXmMenuAttDist(){
				if(!this.groupBy){
					this.$notify({showClose:true,message:'请选中分组属性',type:'warning'})
					return 
				}
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
				getXmMenuAttDist(params).then(res=>{
					this.xmMenuAttDists=res.data.data
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