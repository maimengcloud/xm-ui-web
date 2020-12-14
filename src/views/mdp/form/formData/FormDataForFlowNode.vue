<template>
	<section>
		<el-row>
				<form-data :form-data.sync="addForm" :form-fields="formFields" :submit-event="submitEvent" @submit="submitHandle"><div></div></form-data>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listFormField } from '@/api/mdp/form/formField';
	import FormData from './FormData';
	export default {
		props:['visible','formId','formFieldsJson','submitEvent'],//formData双向绑定
		watch: {
	       visible:function(visible){
			   if(visible==true){
					this.addForm=JSON.parse(JSON.stringify(this.addFormInit))
					if(this.formFieldsJson){
					
						this.formFields=JSON.parse(this.formFieldsJson)
					}else{
						this.formFields=[]
					}
		   	   }
		   }
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
				addFormInit: {
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
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'form-data-edit':FormDataEdit
		    'form-data':FormData
		},
		mounted() {
			 
			this.addForm=JSON.parse(JSON.stringify(this.addFormInit))
			if(this.formFieldsJson){
				
				this.formFields=JSON.parse(this.formFieldsJson)
			}else{
				this.formFields=[]
			}
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>