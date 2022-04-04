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
			<el-form :model="addForm"  :label-width="labelWidth" :rules="addFormRules" ref="addForm">
				<form-data :formData.sync="addForm" :formFields="formFields" :submitEvent="submitEvent" @submit="submitHandle"><div></div></form-data>
				<slot>
				<el-form-item>
					 
							<el-button @click.native="handleCancel">取消</el-button> 
						 
							<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>  
						 
				</el-form-item> 
				</slot>
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	import { addFormData,listFormData } from '@/api/mdp/form/formData';
	import { listFormField } from '@/api/mdp/form/formField';
	import FormData from './FormData';
	export default {
		props:['visible','formId','formDataId','submitEvent'],//formData双向绑定
		watch: {
	      'formId':function(formId) { 
	    	  if(formId==''||formId==null){
	    		  this.formFields=[]
	    	  }else{
	    		  this.getFormFields();
	    	  }
	      	
	      },
	      'formDataId':function(formDataId) { 
	    	  if(formDataId==''||formDataId==null){
	    		  this.addForm={}
	    	  }else{
	    		  this.getFormDatas();
	    	  }
	      	
	      },
	    },	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据

				addLoading: false,
				addFormRules: {
					id: [
						//{ required: true, message: '主键', trigger: 'blur' }
					]
				},
				//新增界面数据 表单数据表
				addForm: {
					id:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',lastTime:'',one:'',zero:'',remark:'',formId:'',userid:'',eleven:'',twelve:'',thirteen:'',fourteen:'',fifteen:'',attachmentUrls:'',attachmentNames:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				formFields:[],
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			
			 labelWidth:function(){
				if (screen.width <=375){
					return "50px"
				}else  if (screen.width <= 500){
						return "75px"
				}else if (screen.width<=1024){
						return "100px"
				}else {
						return "100px"
				}
			} ,	
			//新增提交FormData 表单数据表 父组件监听@submit="afterAddSubmit"
			submitHandle: function (formData) {
 				this.$emit('submit',formData);//  @submit="afterAddSubmit" 
			},
			//获取列表 FormField 表单字段定义
			getFormFields() {
				this.formFields=[];
				if(this.formId==''||this.formId==null){
					return;
				}
				let params = {
					formId:this.formId
				};
				this.addLoading=true;
				listFormField(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
                        this.formFields = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					this.addLoading=false;
				}).catch(() => {
					this.addLoading=false;
					 
				});
			},
			//获取列表 FormData 表单数据表
			getFormDatas() {
				if(!this.formDataId){
					return;
				}
				let params = { 
					id:this.formDataId
				}; 
				listFormData(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){  
						this.addForm = res.data.data[0];
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}  
				}).catch(() => { 
					 
				});
			},
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'form-data-edit':FormDataEdit
		    'form-data':FormData
		},
		mounted() {
			
			this.$nextTick(() => {
				this.getFormFields();
				 this.getFormDatas();
        	});
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>