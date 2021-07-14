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
			 
			<!--新增界面 FormView 表单页面--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="表单主键" prop="formId">
					<el-input v-model="addForm.formId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="视图主键" prop="id">
					<el-input v-model="addForm.id" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="页面html内容" prop="viewContext">
					<el-input v-model="addForm.viewContext" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="关联的业务功能编号" prop="bizId">
					<el-input v-model="addForm.bizId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" >
						<el-col :span="4" :offset="16"> 
							<el-button @click.native="handleCancel">取消</el-button> 
						</el-col>
						<el-col :span="4"> 
							<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>  
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
	import { addFormView } from '../../../../api/mdp/form/formView';
	
	export default {
		props:['formView','visible'],
		watch: {
	      'formView':function( formView ) {
	        this.addForm = formView;
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
				addFormRules: {
					id: [
						//{ required: true, message: '视图主键', trigger: 'blur' }
					]
				},
				//新增界面数据 表单页面
				addForm: {
					formId:'',id:'',viewContext:'',bizId:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交FormView 表单页面 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true; 
							let params = Object.assign({}, this.addForm); 
							addFormView(params).then((res) => {
								this.addLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.addLoading = false;
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
			this.addForm=Object.assign(this.addForm, this.formView);
			//加载下拉列表 如有需要去掉注释
			/**
			let optionsParams={code:'all',fieldNames:['sex']};
			selectCacheOptions(optionsParams).then(res=>{
				this.options=res.data.data;
			}); 
			**/
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>