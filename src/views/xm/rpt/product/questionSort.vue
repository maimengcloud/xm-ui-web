<template>
	<section>
        <el-dialog :title="filters.product?'产品【'+filters.product.productName+'】':''+'缺陷排行榜'" append-to-body modal-append-to-body width="80%" top="20px" :visible.sync="visible">
			<el-row :gutter="5">
				<el-col :span="18"> 
					<div>
						<div class="main" id="xmQuestionSort"
							style="width:100%;height:600px;margin:0 auto;"></div>
						<div class="progress"></div>
					</div>
				</el-col>
				<el-col :span="6" class="border">
					<el-form :label-position="'top'" label-width="120px" :model="filters">
						<el-form-item label="分组属性">
							<el-select   v-model="groupBy"  @change="onXmQuestionSomeFieldsChange('groupBy',$event)" clearable>
								<el-option v-for="i in this.groupBys" :label="i.name" :key="i.id" :value="i.id"></el-option>
							</el-select>
						</el-form-item>     
							 <xm-product-select class="padding" v-if="!xmProduct && !xmIteration"  ref="xmProductSelect" style="display:inline;"  :auto-select="false" :link-project-id="xmProject?xmProject.id:null" @row-click="onProductSelected"  :iterationId="xmIteration?xmIteration.id:null"  @clear="onProductClear"></xm-product-select>
						    
							<xm-iteration-select ref="xmIterationSelect" class="padding" v-if="!xmIteration || !xmIteration.id"  :auto-select="false"  :product-id="filters.product?filters.product.id:null" :link-project-id="xmProject?xmProject.id:null"   placeholder="迭代"  @row-click="onIterationSelected" @clear="onIterationClear"></xm-iteration-select>
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
						 <el-button type="primary" icon="el-icon-search" @click="searchXmQuestionSort">查询</el-button>
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
	  
	import { getXmQuestionSort } from '@/api/xm/core/xmQuestion';
	
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
			xmQuestionSortsCpd(){
				if(this.xmQuestionSorts.length==0){
					return []
				}else{ 
					return this.xmQuestionSorts.map(i=>i.value)
				}
			},
			title(){
				return this.groupBys.find(i=>i.id==this.groupBy).name+'排行榜'
			},
			legendCpd(){
				if(this.xmQuestionSorts.length==0){
					return []
				}else{ 
					return this.xmQuestionSorts.map(i=>i.name)
				}
			}
			
        }, 
		watch: {  
			xmQuestionSortsCpd(){
				this.drawCharts();
			}
	    },
		data() {
			return {
                filters:{
                    product:null,  
					iteration:null,
                },
				groupBy:'handler_userid',
				groupBys:[
					{id:'create_userid', name:'创建人'},
					{id:'ask_userid', name:'提出人'},
					{id:'handler_userid', name:'负责人'},
					{id:'menu_id', name:'故事'}, 
					
				],
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中... 
				dateRanger:[], 
                maxTableHeight:300, 
                visible:false,
				xmQuestionSorts:[], 
				pageInfo: {
					//分页数据
					total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize: this.queryScope==='plan' || this.queryScope==='planTask'?50:20, //每页数据
					count: false, //是否需要重新计算总记录数
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
				this.filters.Product=params.xmProduct 
				
			},
			drawCharts() {
				this.myChart = this.$echarts.init(document.getElementById("xmQuestionSort")); 
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
							data: this.xmQuestionSortsCpd,
							type: 'bar'
							}
						]
					}
				)
			},
			onXmQuestionSomeFieldsChange(fieldName,$event){
				this.xmQuestionSorts=[]
			},
			searchXmQuestionSort(){
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
				getXmQuestionSort(params).then(res=>{
					this.xmQuestionSorts=res.data.data
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