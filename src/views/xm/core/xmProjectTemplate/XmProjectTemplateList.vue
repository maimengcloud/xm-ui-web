<template>
	<section class="page-container padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="项目模板名称查询"></el-input>  
			<el-select v-model="filters.xmType" @change="searchXmProjectTemplates">
				<el-option v-for="i in this.dicts.projectType" :label="i.name" :key="i.id" :value="i.id"></el-option>
			</el-select>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectTemplates">查询</el-button> 
  		</el-row>
		<el-row class="page-main"> 
			<!--列表 XmProjectTemplate xm_project_template-->
			<el-table ref="table" :height="maxTableHeight" :data="xmProjectTemplates" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="45"></el-table-column>
				<el-table-column sortable type="index" width="45"></el-table-column>
  				<el-table-column prop="name" label="项目名称" min-width="150" ></el-table-column> 
 				<el-table-column prop="tcusername" label="创建人" min-width="80" ></el-table-column>
				<el-table-column prop="xmType" label="项目类型" min-width="80" :formatter="formatXmType"></el-table-column>  
 				<el-table-column prop="planWorkload" label="总工作量" min-width="80" ></el-table-column> 
				<el-table-column prop="taxRate" label="税率" min-width="80" >
					<template slot-scope="scope">
						{{scope.row.taxRate}}%
					</template>

				</el-table-column>
				<el-table-column prop="budgetMarginRate" label="预估毛利率" min-width="80" >
					<template slot-scope="scope">
						{{scope.row.budgetMarginRate}}%
					</template>
				</el-table-column> 
 				<el-table-column  label="预算(元)" min-width="80" >
 				<el-table-column prop="planTotalCost" label="总预算" min-width="80" ></el-table-column>
 				<el-table-column prop="planNouserAt" label="非人力" min-width="80" ></el-table-column>
				<el-table-column prop="planIuserAt" label="内部" min-width="80" ></el-table-column>
				<el-table-column prop="planOuserAt" label="外购" min-width="80" ></el-table-column> 
				</el-table-column>
				<el-table-column prop="description" label="项目描述" min-width="80" show-overflow-tooltip ></el-table-column>
				<el-table-column label="操作" width="160" fixed="right">
					<template slot-scope="scope"> 
 						<el-button type="primary" @click="selectedProject(scope.row,scope.$index)">选中</el-button>
					</template>
				</el-table-column>
			</el-table> 
		</el-row>
		<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
	</section>
</template>

<script>
	import Vue from 'vue'

	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmProject  } from '@/api/xm/core/xmProject';
 	import { mapGetters } from 'vuex'
 	 
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		data() {
			return {
				filters: {
					key: '',
					xmType:''
				},
				xmProjectTemplates: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
					//sex:[],
					projectType:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProjectTemplate界面是否显示
				//新增xmProjectTemplate界面初始化数据
				addForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planIuserAt:'',planOuserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planIuserPrice:'',planOuserPrice:'',planOuserCnt:'',planIuserCnt:'',planWorkingHours:'',taxRate:'',planIuserWorkload:'',planOuserWorkload:'',productId:'',productName:'',templateId:'',tcuserid:'',tcusername:'',tremark:'',tctime:'',tcbranchId:'',shareScope:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectTemplate界面初始化数据
				editForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planIuserAt:'',planOuserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planIuserPrice:'',planOuserPrice:'',planOuserCnt:'',planIuserCnt:'',planWorkingHours:'',taxRate:'',planIuserWorkload:'',planOuserWorkload:'',productId:'',productName:'',templateId:'',tcuserid:'',tcusername:'',tremark:'',tctime:'',tcbranchId:'',shareScope:''
				},
				projectTemplateInfoVisible:false,
				maxTableHeight:300,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjectTemplates();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectTemplates();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmProjectTemplates();
			},
			searchXmProjectTemplates(){
				 this.pageInfo.count=true; 
				 this.getXmProjectTemplates();
			},
			//获取列表 XmProjectTemplate xm_project_template
			getXmProjectTemplates() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.xmType){
					params.xmType=this.filters.xmType
				} 
				params.isTpl="1"
				this.load.list = true;
				listXmProject(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectTemplates = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectTemplate xm_project_template
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProjectTemplate xm_project_template
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjectTemplates();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProjectTemplate
			selsChange: function (sels) {
				this.sels = sels;
			},  
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			selectedProject(row){
				this.editForm=row
				this.$emit("selected",row)
			}, 
			/**begin 自定义函数请在下面加**/
			
			formatXmType(row,column,cellValue){
				if(this.dicts.projectType){
					var xmType=this.dicts.projectType.find(i=>i.id==cellValue)
					if(xmType){
						return xmType.name
					}else{
						return cellValue;
					}
				}else{	
					return cellValue;
				}
			}
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {  
 		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => { 
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el);
				this.getXmProjectTemplates();
				initSimpleDicts( 'all' ['projectType'] ).then(res=>{
					if(res.data.tips.isOk){ 
						this.dicts['projectType']=res.data.data.projectType
					}
				}); 
			}); 
			
        	/** 举例，
    		initSimpleDicts( "all",["sex","grade"] ).then(res=>{
				if(res.data.tips.isOk){ 
 					this.dicts=res.data.data
				}
			});
			**/
		}
	}

</script>

<style scoped>

</style>