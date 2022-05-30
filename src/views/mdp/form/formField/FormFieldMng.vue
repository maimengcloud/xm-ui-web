<template>
	<section>
		<el-row>
			<!--工具条1-->
			<el-col :span="24" class="toolbar"  style="padding-bottom: 0px;padding-left: 0px">
				<el-col :span="4">
					<el-input v-model="filters.key"  placeholder="模糊查询"></el-input>
				</el-col>
				<el-col :span="8">
					<el-button type="primary"   v-on:click="searchFormFields" icon="el-icon-search"></el-button>
					<el-button type="primary"   @click="showAdd">新增</el-button>
					<el-button type="danger"    @click="batchDel" :disabled="this.sels.length===0" icon="el-icon-delete"></el-button>
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
			
			<!--列表 FormField 表单字段定义-->
			<el-table height="480" :data="formFields"  @sort-change="sortChange"  highlight-current-row v-loading="listLoading" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column type="selection" width="40"></el-table-column>
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="formId" label="表单编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="id" label="主键" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="fieldId" label="字段编号对应数据库" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="fieldTitle" label="字段显示内容" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="secondCodeRow" label="下拉时候关联的分组" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="fieldType" label="字段类型" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="fieldLength" label="字段长度" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="defaultValue" label="默认值" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="isMultiple" label="是否多选" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="placeholder" label="输入框占位文本" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="isRequired" label="是否必输" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="isFromBaseData" label="是否关联基础数据" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="fieldIdCamel" label="字段驼峰命名" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="remark" label="字段备注" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="extFieldType" label="扩展信息" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="isCloneToFlow" label="是否提交到工作流" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="flowFieldId" label="提交到工作流的变量编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" min-width="150"  fixed="right">
					<template scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button type="danger"  @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!--编辑 FormField 表单字段定义界面-->
			<el-dialog title="编辑" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <form-field-edit :form-field="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></form-field-edit>
			</el-dialog>
	
			<!--新增 FormField 表单字段定义界面-->
			<el-dialog title="新增" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<form-field-add :form-field="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></form-field-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../api/common/code';//下拉框数据查询
	import { listFormField, delFormField, batchDelFormField } from '../../../../api/mdp/form/formField';
	import  FormFieldAdd from './FormFieldAdd';//新增界面
	import  FormFieldEdit from './FormFieldEdit';//修改界面
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { mapGetters } from 'vuex'
	export default { 
	    computed: {
		    ...mapGetters([
		      'userInfo','myDepts'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				formFields: [],//查询结果
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
				
				addFormVisible: false,//新增formField界面是否显示
				//新增formField界面初始化数据
				addForm: {
					formId:'',id:'',fieldId:'',fieldTitle:'',secondCodeRow:'',fieldType:'',fieldLength:'',defaultValue:'',isMultiple:'',placeholder:'',isRequired:'',isFromBaseData:'',fieldIdCamel:'',remark:'',extFieldType:'',isCloneToFlow:'',flowFieldId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑formField界面初始化数据
				editForm: {
					formId:'',id:'',fieldId:'',fieldTitle:'',secondCodeRow:'',fieldType:'',fieldLength:'',defaultValue:'',isMultiple:'',placeholder:'',isRequired:'',isFromBaseData:'',fieldIdCamel:'',remark:'',extFieldType:'',isCloneToFlow:'',flowFieldId:''
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
				this.getFormFields();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getFormFields();
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
				this.getFormFields();
			},
			searchFormFields(){
				 this.pageInfo.pageNum=1;
				 this.pageInfo.total=0;
				 this.getFormFields();
			},
			//获取列表 FormField 表单字段定义
			getFormFields() {
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
				listFormField(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.formFields = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					 
				});
			},

			//显示编辑界面 FormField 表单字段定义
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 FormField 表单字段定义
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.total=0;
				this.getFormFields();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行formField
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除formField
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = { id: row.id };
					delFormField(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.total=0;
							this.getFormFields();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.listLoading = false;
					 
				});
			},
			//批量删除formField
			batchDel: function () {
				var ids = this.sels.map(item => item.id);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					batchDelFormField(ids).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.total=0;
							this.getFormFields(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => {
					this.listLoading = false;
					 
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'form-field-add':FormFieldAdd,
		    'form-field-edit':FormFieldEdit,
		     
		    //在下面添加其它组件
		},
		mounted() {
			
			this.$nextTick(() => {
				this.getFormFields();
        	});
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