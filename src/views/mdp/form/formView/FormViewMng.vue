<template>
	<section>
		<el-row>
			<!--工具条1-->
			<el-col :span="24" class="toolbar"  style="padding-bottom: 0px;padding-left: 0px">
				<el-col :span="4">
					<el-input v-model="filters.key"  placeholder="模糊查询"></el-input>
				</el-col>
				<el-col :span="8">
					<el-button type="primary"   v-on:click="searchFormViews">查询</el-button>
					<el-button type="primary"   @click="showAdd">新增</el-button>
					<el-button type="danger"    @click="batchDel" :disabled="this.sels.length===0">批量删除</el-button>
				</el-col>	
				<el-col :span="12">
					<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
					</el-pagination>
				</el-col>	
			</el-col>
			
			<!--工具条2-->  
			<!--如果有更多工具条,放开此注释
			<el-col :span="24" class="toolbar"  style="padding-bottom: 0px;">
				<el-col :span="4">
				</el-col>
			</el-col>
			-->		
			
			<!--列表 FormView 表单页面-->
			<el-table :data="formViews"  @sort-change="sortChange" height="480" highlight-current-row v-loading="listLoading" border @selection-change="selsChange" style="width: 100%;">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="formId" label="表单主键" min-width="80"></el-table-column>
				<el-table-column prop="id" label="视图主键" min-width="80"></el-table-column>
				<el-table-column prop="viewContext" label="页面html内容" min-width="80"></el-table-column>
				<el-table-column prop="bizId" label="关联的业务功能编号" min-width="80"></el-table-column>
				<el-table-column label="操作" min-width="150"  fixed="right">
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger"  @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!--编辑 FormView 表单页面界面-->
			<el-dialog title="编辑" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <form-view-edit :form-view="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></form-view-edit>
			</el-dialog>
	
			<!--新增 FormView 表单页面界面-->
			<el-dialog title="新增" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<form-view-add :form-view="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></form-view-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../api/common/code';//下拉框数据查询
	import { listFormView, delFormView, batchDelFormView } from '../../../../api/mdp/form/formView';
	import  FormViewAdd from './FormViewAdd';//新增界面
	import  FormViewEdit from './FormViewEdit';//修改界面
	
	export default {
		data() {
			return {
				filters: {
					key: ''
				},
				formViews: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				listLoading: false,//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 options.sex,options.project
				
				addFormVisible: false,//新增formView界面是否显示
				//新增formView界面初始化数据
				addForm: {
					formId:'',id:'',viewContext:'',bizId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑formView界面初始化数据
				editForm: {
					formId:'',id:'',viewContext:'',bizId:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			//获取代码对应的名称 用于数据反显 如 getCodeName(options.sex,'1');
			getCodeName(options,codeValue){
				if(!options)return codeValue;
				let code=options.filter(i=>i.codeValue==codeValue);
				if(code.length>0){
					return code[0].codeName
				}else{
					return codeValue
				} 
			},
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.total=0;
				this.pageInfo.pageNum=1;
				this.getFormViews();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getFormViews();
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
				this.getFormViews();
			},
			searchFormViews(){
				 this.pageInfo.pageNum=1;
				 this.pageInfo.total=0;
				 this.getFormViews();
			},
			//获取列表 FormView 表单页面
			getFormViews() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					params.orderFields=this.pageInfo.orderFields;
					params.orderDirs=this.pageInfo.orderDirs;
				}
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.listLoading = true;
				listFormView(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.formViews = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					 
				});
			},

			//显示编辑界面 FormView 表单页面
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 FormView 表单页面
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.total=0;
				this.getFormViews();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行formView
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除formView
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = { id: row.id };
					delFormView(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.total=0;
							this.getFormViews();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.listLoading = false;
					 
				});
			},
			//批量删除formView
			batchDel: function () {
				var ids = this.sels.map(item => item.id);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					batchDelFormView(ids).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.total=0;
							this.getFormViews(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => {
					this.listLoading = false;
					 
				});
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'form-view-add':FormViewAdd,
		    'form-view-edit':FormViewEdit
		    //在下面添加其它组件
		},
		mounted() {
			this.getFormViews();
			
			//加载下拉列表 如有需要去年注释
			/**
			let optionsParams={code:'all',fieldNames:['sex']};
			selectCacheOptions(optionsParams).then(res=>{
				this.options=res.data.data;
			}); 
			**/
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
		}
	}

</script>

<style scoped>

</style>