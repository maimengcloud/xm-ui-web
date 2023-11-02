<template>
	<el-row>
    <mdp-form-data ref="formDataRef" v-model="editForm" :formFields="formFields" :form-def="formDef" @submit="submitHandle" @change="onChange"><div></div></mdp-form-data>
 
	</el-row>
</template>

<script>

	import * as FormDataApi from '@/api/mdp/lcode/formData';
  	import { listFormField } from '@/api/mdp/lcode/formField';
 	import { mapGetters } from 'vuex'   
	export default { 
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ]) 
		},
		props:{
			/**
			 * 表单编号
			 */
			formId:{
				type:String,
				default:null,
			},
			/**
			 * 流程实例编号
			 */
			procInstId:{
				type:String,
				default:null
			},
			/**
			 * 流程启动人
			 */
			flowStartUserid:{
				type:String,
				default:null,
			}

		},
		watch:{ 
			formId(val){
				this.getFormFields();
			},
			procInstId(val){
				this.loadFormData();
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
				editForm: {
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				formFields:[],
				formFieldLoadOk:false,
				formDataLoadOk:false,
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
			//获取列表 FormField 表单字段定义
			getFormFields() {
				this.formFieldLoadOk=false;
				this.formFields=[];
				var formId=this.formId
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
						this.formFieldLoadOk=false;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					this.load.list=false;
				}).catch(() => {
					this.load.list=false;
					 
				});
			},
			loadFormData(){
				
				this.formDataLoadOk=false;
				if(!this.formId){
					return;
				}
				if(!this.procInstId){
					return;
				}
				var params={formId:this.formId,procInstId:this.procInstId}
				FormDataApi.listFormData(params).then(res=>{
					var tips = res.data.tips
					if(tips.isOk){
						this.formDataLoadOk=true;
						if(res.data.data.length>0){
							this.editForm=res.data.data[0]
						}else{
							this.editForm={...this.editFormInit}
						}
						
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					

				})
			},
			submitHandle(formData){
				this.$emit('submit',formData)
			},
			editSubmit(){
				this.$refs['formDataRef'].editSubmit();
			},
			getChangeLogs(){
				return this.$refs['formDataRef'].getChangeLogs(); 
			},
			onChange(val,changeLogs){ 
				this.$emit('change',val,changeLogs)
			}
			
		},//end method
		components: {   
		},
		mounted() {  
			this.editFormInit={...this.editForm};
 			this.getFormFields();    
			this.loadFormData();
			
		}//end mounted
	}

</script>

<style scoped>

</style>