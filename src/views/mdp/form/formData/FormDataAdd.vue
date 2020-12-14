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
			<el-form :model="addForm"  label-width="120px"  :rules="addFormRules" ref="addForm">
 				<form-data :formData.sync="addForm" :formFields="formFields" :submitEvent="formDataSubmitEvent" @submit="submitHandle"><div></div></form-data>
				<slot>
				<el-form-item>
					<el-col :span="24" >
						<el-col :span="4" :offset="16"> 
							<el-button @click.native="handleCancel">取消</el-button> 
						</el-col>
						<el-col :span="4"> 
							<el-button type="primary" @click.native="startHandle" :loading="addLoading">提交</el-button>  
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
	import { addFormData } from '@/api/mdp/form/formData';
	import { mapGetters } from 'vuex'   
	import FormData from './FormData';
	export default {  
		props:['formData','visible','formDef','formFields'],
	    computed: {
		    ...mapGetters([
		      'userInfo','myDepts'
		    ]) 
		},
		watch: {
	      'formData':function( formData ) {
	        this.addForm = formData;
	        this.addForm.formId=this.formDef.id
	      }, 
	    },	
		data() {
			return { 
				addLoading: false,
				addFormRules: {
					 
				},
				//新增界面数据 表单数据表
				addForm: {
					id:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',lastTime:'',one:'',zero:'',remark:'',formId:'',userid:'',eleven:'',twelve:'',thirteen:'',fourteen:'',fifteen:'',attachmentUrls:'',attachmentNames:'',flowState:'0'
				},
				 
				formDataSubmitEvent:'',
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			startHandle(){ 
				var date=new Date();
				this.formDataSubmitEvent=date.getTime(); 
			},
			//新增提交FormData 表单数据表 父组件监听@submit="afterAddSubmit"
			submitHandle: function (formData) {
 						this.addForm=formData;
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;  
							let params = Object.assign({}, formData);
							  params.cuserid=this.userInfo.userid
							  params.cusername=this.userInfo.username
							  params.deptid=this.userInfo.deptid
							  params.deptName=this.userInfo.deptName
							addFormData(params).then((res) => {
								this.addLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit',formData);//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.addLoading = false;
							});
						});
					 
			},
			 
			
		},//end method
		components: {   
			'form-data':FormData
		},
		mounted() {
			 this.addForm=this.formData
			 if(this.formDef){
				this.addForm.formId=this.formDef.id
			 }
			 
			
		}//end mounted
	}

</script>

<style scoped>

</style>