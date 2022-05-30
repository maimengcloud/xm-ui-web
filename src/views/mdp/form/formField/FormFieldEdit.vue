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
		 
		<!--编辑界面 FormField 表单字段定义--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="表单编号" prop="formId">
					<el-input v-model="editForm.formId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="字段编号对应数据库" prop="fieldId">
					<el-input v-model="editForm.fieldId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="字段显示内容" prop="fieldTitle">
					<el-input v-model="editForm.fieldTitle" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="下拉时候关联的分组" prop="secondCodeRow">
					<el-input v-model="editForm.secondCodeRow" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="字段类型" prop="fieldType">
					<el-input v-model="editForm.fieldType" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="字段长度" prop="fieldLength">
					<el-input-number v-model="editForm.fieldLength" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="默认值" prop="defaultValue">
					<el-input v-model="editForm.defaultValue" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="是否多选" prop="isMultiple">
					<el-input v-model="editForm.isMultiple" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="输入框占位文本" prop="placeholder">
					<el-input v-model="editForm.placeholder" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="是否必输" prop="isRequired">
					<el-input v-model="editForm.isRequired" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="是否关联基础数据" prop="isFromBaseData">
					<el-input v-model="editForm.isFromBaseData" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="字段驼峰命名" prop="fieldIdCamel">
					<el-input v-model="editForm.fieldIdCamel" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="字段备注" prop="remark">
					<el-input v-model="editForm.remark" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="扩展信息" prop="extFieldType">
					<el-input v-model="editForm.extFieldType" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="是否提交到工作流" prop="isCloneToFlow">
					<el-input v-model="editForm.isCloneToFlow" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="提交到工作流的变量编号" prop="flowFieldId">
					<el-input v-model="editForm.flowFieldId" auto-complete="off"></el-input>
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
	import { editFormField } from '../../../../api/mdp/form/formField';
	
	export default {
		props:['formField','visible'],
		watch: {
	      'formField':function( formField ) {
	        this.editForm = formField;
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
						//{ required: true, message: '主键', trigger: 'blur' }
					]
				},
				//编辑界面数据  FormField 表单字段定义
				editForm: {
					formId:'',id:'',fieldId:'',fieldTitle:'',secondCodeRow:'',fieldType:'',fieldLength:'',defaultValue:'',isMultiple:'',placeholder:'',isRequired:'',isFromBaseData:'',fieldIdCamel:'',remark:'',extFieldType:'',isCloneToFlow:'',flowFieldId:''
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
			//编辑提交FormField 表单字段定义父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true; 
							let params = Object.assign({}, this.editForm); 
							editFormField(params).then((res) => {
								this.editLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
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
		    //在下面添加其它组件 'form-field-edit':FormFieldEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.formField);
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