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
		 
		<!--编辑界面 FormView 表单页面--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="表单主键" prop="formId">
					<el-input v-model="editForm.formId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="视图主键" prop="id">
					<el-input v-model="editForm.id" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="页面html内容" prop="viewContext">
					<el-input v-model="editForm.viewContext" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="关联的业务功能编号" prop="bizId">
					<el-input v-model="editForm.bizId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" >
						<el-col :span="4" :offset="16"> 
							<el-button @click.native="handleCancel">取消</el-button> 
						</el-col>
						<el-col :span="4"> 
							<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>  
						</el-col>
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../api/common/code';//下拉框数据查询
	import { editFormView } from '../../../../api/mdp/form/formView';
	
	export default {
		props:['formView','visible'],
		watch: {
	      'formView':function( formView ) {
	        this.editForm = formView;
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
				editLoading: false,
				editFormRules: {
					id: [
						//{ required: true, message: '视图主键', trigger: 'blur' }
					]
				},
				//编辑界面数据  FormView 表单页面
				editForm: {
					formId:'',id:'',viewContext:'',bizId:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//编辑提交FormView 表单页面父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true; 
							let params = Object.assign({}, this.editForm); 
							editFormView(params).then((res) => {
								this.editLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.editLoading = false;
							});
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'form-view-edit':FormViewEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.formView);
			//加载下拉列表 如有需要去掉注释
			/**
			let optionsParams={code:'all',fieldNames:['sex']};
			selectCacheOptions(optionsParams).then(res=>{
				this.options=res.data.data;
			}); 
			**/
			//给下拉列表初始化默认值
			//this.editForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
		}
	}

</script>

<style scoped>

</style>