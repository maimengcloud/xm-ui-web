<template>
	<section>
        <el-dialog fullscreen :title="dialogTitle" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			<el-row :gutter="5">
				<el-col :span="18"> 
					<div>
						<div class="main" id="xmMenuSort"
							style="width:100%;height:600px;margin:0 auto;"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border padding">
					<el-form  :model="filters">
						<el-form-item label="分组属性">
							<el-select   v-model="groupBy"  @change="onXmMenuSomeFieldsChange('groupBy',$event)" clearable>
								<el-option v-for="i in this.groupBys" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>     
						<el-form-item label="归属产品"  >
							<xm-product-select v-if="!xmProductCpd || !xmProductCpd.id"  ref="xmProductSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProductSelected"  :iterationId="xmIteration?xmIteration.id:null"  @clear="onProductClear"></xm-product-select>
							<span v-else>{{xmProductCpd.id}} <span v-if="xmProductCpd.productName"><br/>{{  xmProductCpd.productName  }} </span> </span>
						</el-form-item>
						<el-form-item label="归属迭代">
							<xm-iteration-select  v-if="!xmIteration || !xmIteration.id" ref="xmIterationSelect"  :auto-select="false"  :product-id="filters.product?filters.product.id:null" :link-project-id="xmProject?xmProject.id:null"   placeholder="迭代"  @row-click="onIterationSelected" @clear="onIterationClear"></xm-iteration-select>
							<span v-else>  {{xmIteration.id}}
								<span v-if="xmIteration.iterationName"><br/>{{ xmIteration.iterationName  }} </span></span> 
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
						 <el-button type="primary" icon="el-icon-search" @click="searchXmMenuSort">查询</el-button>
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
	  
	import { getXmMenuSort } from '@/api/xm/core/xmMenu';
	
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
			xmMenuSortsCpd(){
				if(this.xmMenuSorts.length==0){
					return []
				}else{ 
					return this.xmMenuSorts.map(i=>i.value)
				}
			},
			title(){
				return this.groupBys.find(i=>i.id==this.groupBy).name+'用户故事数量排行榜'
			},
			legendCpd(){
				if(this.xmMenuSorts.length==0){
					return []
				}else{ 
					return this.xmMenuSorts.map(i=>i.name)
				}
				
			},
			dialogTitle(){
				if(this.xmIteration && this.xmIteration.id){
					return (this.xmIteration?'迭代【'+this.xmIteration.iterationName+'】':'')+'用户故事数量排行榜'
				}else {
					return (this.filters.product?'产品【'+this.filters.product.productName+'】':'')+'用户故事数量排行榜'
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
			xmMenuSortsCpd(){
				this.drawCharts();
			}
	    },
		data() {
			return {
                filters:{
                    product:null,  
					iteration:null,
                },
				groupBy:'proposer_id',
				groupBys:[
					{id:'proposer_id', name:'提出人'},
					{id:'mm_userid', name:'负责人'}, 
				],
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmMenuSorts:[],
				pageInfo: {
					//分页数据
					total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize: this.queryScope==='plan' || this.queryScope==='planTask'?50:20, //每页数据
					count:true, //是否需要重新计算总记录数
					pageNum: 1, //当前页码、从1开始计算
					orderFields: ["value"], //排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs: ["desc"], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},

			}//end return
		},//end data
		methods: { 
			open(params){
				this.visible=true;
				this.filters.product=params.xmProduct
				this.filters.project=params.xmProject
				this.filters.iteration=params.xmIteration 
				
				if((this.filters.product && this.filters.product.id) || ( this.filters.iteration && this.filters.iteration.id)){
					this.searchXmMenuSort()
				}
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("xmMenuSort")); 
				this.myChart.setOption(      
					{
						xAxis: {
							type: 'category',
							data: this.legendCpd
						},
						yAxis: {
							type: 'value'
						},
						series: [
							{
							data: this.xmMenuSortsCpd,
							type: 'bar'
							}
						]
					}
				)
			},
			onXmMenuSomeFieldsChange(fieldName,$event){
				this.xmMenuSorts=[]
			},
			searchXmMenuSort(){
				if(!this.groupBy){
					this.$notify({position:'bottom-left',showClose:true,message:'请选中分组属性',type:'warning'})
					return 
				}
				 let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count: this.pageInfo.count,
				};
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

				
				if (
					this.pageInfo.orderFields != null &&
					this.pageInfo.orderFields.length > 0
				) {
					let orderBys = [];
					for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
					orderBys.push(
						this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i]
					);
					}
					params.orderBy = orderBys.join(",");
				}
				getXmMenuSort(params).then(res=>{
					this.xmMenuSorts=res.data.data
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