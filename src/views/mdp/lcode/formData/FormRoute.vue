<template>
	<section class="padding">
		<el-row class="border" style="max-width:1000px;"> 
			<el-row class="padding"><h3 style="text-align:center;">{{ formDef.formName }}</h3></el-row>
 				<mdp-form-data :sub-op-type="currOpType" ref="formDataRef" v-if="formFields && formFields.length>0" :formDef="formDef" :formData.sync="addForm" :formFields="formFields" @submit="submitHandle">
 				</mdp-form-data>  
 		</el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
 	import { listFormField } from '@/api/mdp/lcode/formField';
	 import * as FormDataApi from '@/api/mdp/lcode/formData';

	import FormData from './Form';
	import { mapGetters } from 'vuex'   
	export default { 
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ]) 
		},
		watch:{
			$route(to){
				this.initCurrData(); 
			}
		},
		data() {
			return { 
				formDef:{},
				load:{list:false},
				addFormRules: {
					id: [
						//{ required: true, message: '主键', trigger: 'blur' }
					]
				},
				//新增界面数据 表单数据表
				addForm: {
					id:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',lastTime:'',one:'',zero:'',remark:'',formId:'',userid:'',eleven:'',twelve:'',thirteen:'',fourteen:'',fifteen:'',attachmentUrls:'',attachmentNames:''
				},
				currOpType:'add',
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				formFields:[],
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			initCurrData(){
				this.queryFormDataById();
				this.getFormFields();
			},
			queryFormDataById(){
				var params={}
				var dataId=this.$route.params.dataId
				if(dataId){
					params.id=dataId
					this.currOpType='edit'
				}
 				FormDataApi.queryFormDataById(params).then(res=>{
					var tips = res.data.tips
					if(tips.isOk){
						var data=res.data.data
						if(data){
							this.currOpType='edit'
							this.addForm={...data}
						}else{
							this.$notify({position:'bottom-left',showClose:true,message: "无法查询到表单数据", type: 'error' }); 
						}
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' }); 
					}
				})
			},
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
			//获取列表 FormField 表单字段定义
			getFormFields() {
				this.formFields=[];
				var formId=this.$route.params.formId
				if(!formId){
					this.$notify({position:'bottom-left',showClose:true,message: "formId不能为空", type: 'error' });
					return;
				} 
				let params = {
					formId:formId
				};
				this.load.list=true;
				listFormField(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
                        this.formFields = res.data.data.formFields;
						this.formDef=res.data.data.formDef
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					this.load.list=false;
				}).catch(() => {
					this.load.list=false;
					 
				});
			},
			  
			
		},//end method
		components: {  
		    //在下面添加其它组件 'form-data-edit':FormDataEdit
		    'form-data':FormData
		},
		mounted() {  
 			this.getFormFields();    
			
		}//end mounted
	}

</script>

<style scoped>

</style>