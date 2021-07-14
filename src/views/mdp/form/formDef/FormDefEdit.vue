<template>
	<section>
		<el-row>
		<!--工具条1-->  
		<!--如果有更多工具条,放开此注释
		<el-col :span="24" class="toolbar"  style="padding-bottom: 0px;">
			<el-col :span="4">
			</el-col>
		</el-col>
		-->
		<!--新增界面 FormDef 表单定义--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
			</el-form>
			<form-field  ref="fields" :form-def.sync="editForm" :visible="visible" :fields.sync="fields"></form-field>
			<el-col :span="24"   :offset="1"> 
				<el-col :span="4"><category-tree ref="categoryTree"  :expandOnClickNode="false" :defaultExpandAll="false" show-checkbox  :current-key="editForm.categoryId"  v-on:check-change="handleCategoryCheckChange" ></category-tree>
					</el-col>
					<el-col :span="20"> 
						<el-button  @click.native="handleCancel">取消</el-button>  
						<el-button  type="primary" @click.native="editFormDefAndFieldsSubmit" :loading="addLoading">提交</el-button>   
					</el-col>
				 
			</el-col> 
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	import { listOption,listOptionByItemIds } from '@/api/itemOption';//下拉框数据查询
	import { editFormDef,editFormDefAndFields } from '../../../../api/mdp/form/formDef';
	import draggable from 'vuedraggable'
	import FormField from '../formField/FormField'
	import { mapGetters } from 'vuex'
	import  CategoryTree from '@/views/mdp/arc/category/CategoryTree';//修改界面
	export default { 
	    computed: {
		    ...mapGetters([
		      'userInfo','myDepts'
		    ])
		},
		props:['formDef','visible'],
		watch: {
	      'formDef':function( formDef ) {
	        this.editForm = formDef;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据
				addLoading: false,
				editFormRules: {
					formName: [
						{ required: true, message: '表单名称不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 表单定义
				editForm: {
					id:'',tableName:'',tableOwner:'',isCreateTable:'',formName:'',userid:'',deptid:'',formType:'',isTemplate:'',bizType:'',ctime:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				fields:[]//表单的所有属性
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交FormDef 表单定义 父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						if(this.editForm.formName==''){
							this.$message({showClose: true, message: '表单名称不能为空', type: 'error' });
							return;
						}
						
						if(this.editForm.formName==''){
							this.$message({showClose: true, message: '表单名称不能为空', type: 'error' });
							return;
						}
						if(this.editForm.categoryId==null || this.editForm.categoryId==''  ){
							this.$message({showClose: true, message: '归属分类不能为空', type: 'error' });
							return;
						}
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true; 
							let params = Object.assign({}, this.editForm); 
							editFormDef(params).then((res) => {
								this.addLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.addLoading = false;
							});
						});
					}
				});
			},
			//新增提交FormDef 表单定义 父组件监听@submit="afterEditSubmit"
			editFormDefAndFieldsSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						if(this.editForm.formName==''){
							this.$message({showClose: true, message: '表单名称不能为空', type: 'error' });
							return;
						}
						
						if(this.editForm.formName==''){
							this.$message({showClose: true, message: '表单名称不能为空', type: 'error' });
							return;
						}
						if(this.editForm.categoryId==null || this.editForm.categoryId==''  ){
							this.$message({showClose: true, message: '归属分类不能为空', type: 'error' });
							return;
						}
						
						if(this.fields.length==0  ){
							this.$message({showClose: true, message: '最少需要定义一个字段', type: 'error' });
							return;
						}
						
						if(this.fields.length>15){
							this.$message({showClose: true, message: '最多支持15个字段', type: 'error' });
							return;
						}
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true; 
							let formDef = Object.assign({}, this.editForm); 
							formDef.deptid=this.userInfo.deptid
							formDef.branchId=this.userInfo.branchId
							this.$refs.fields.setPrimaryKeys();
							var fields=this.$refs.fields.selectedFields;
							fields.forEach((i,index)=>{i.seqNo=index});
							var params={formDef:formDef,formFields:fields};
							editFormDefAndFields(params).then((res) => {
								this.addLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.addLoading = false;
							});
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			
			handleCategoryCheckChange(data, checked, indeterminate){ 
				if(data.id=='C0'){//选择了根节点，默认不按分类查询
				 
					return;
				}
				this.editForm.categoryId=data.id
			},	
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'form-def-edit':FormDefEdit
		    "draggable":draggable,
		    "form-field":FormField,CategoryTree
		    
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.formDef); 
			
		}//end mounted
	}

</script>

<style scoped>

</style>