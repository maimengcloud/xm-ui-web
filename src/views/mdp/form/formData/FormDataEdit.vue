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
			 
			<!--新增界面 FormData 表单数据表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
 				<form-data :formData.sync="editForm" :formFields="formFields" :submitEvent="formDataSubmitEvent" @submit="submitHandle"><div></div></form-data>
				<slot>
				<el-form-item>
					<el-col :span="24" >
						<el-col :span="4" :offset="16"> 
							<el-button @click.native="handleCancel">取消</el-button> 
						</el-col>
						<el-col :span="4"> 
							<el-button type="primary" @click.native="startHandle" :loading="editLoading">提交</el-button>  
						</el-col>
					</el-col> 
				</el-form-item> 
				</slot>
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库	 
	import { editFormData } from '@/api/mdp/form/formData';
	import { mapGetters } from 'vuex'   
	import FormData from './FormData';
	export default {  
		props:['formData','visible','formDef','formFields'],
		watch: {
	      'formData':function( formData ) {
	        this.editForm = formData; 
	      }, 
	    },	
		data() {
			return { 
				editLoading: false,
				editFormRules: {
					 
				},
				//新增界面数据 表单数据表
				editForm: {
					id:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',lastTime:'',one:'',zero:'',remark:'',formId:'',userid:'',eleven:'',twelve:'',thirteen:'',fourteen:'',fifteen:'',attachmentUrls:'',attachmentNames:'',flowState:'0'
				},
				 
				formDataSubmitEvent:'',
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			startHandle(){ 
				var date=new Date();
				this.formDataSubmitEvent=date.getTime(); 
			},
			//新增提交FormData 表单数据表 父组件监听@submit="afterAddSubmit"
			submitHandle: function (formData) {
 						this.editForm=formData;
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;  
							let params = Object.assign({}, this.editForm);  
							editFormData(params).then((res) => {
								this.editLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit',formData);//  @submit="afterAddSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.editLoading = false;
							});
						});
					 
			},
			 
			
		},//end method
		components: {   
			'form-data':FormData
		},
		mounted() {
			 this.editForm=this.formData 
			
		}//end mounted
	}

</script>

<style scoped>

</style>