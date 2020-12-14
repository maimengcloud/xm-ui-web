<template>
	<section>
		<el-row class="app-container"> 
		<!--新增界面 FormDef 表单定义-->  
			<form-field ref="fields" :visible="visible" :form-def.sync="addForm" :fields.sync="fields" :load-from-db="0"></form-field>
			<el-form  :model="addForm"  label-width="120px" :rules="addFormRules"  ref="addForm">
		
	
			<el-col :span="24" :offset="1">   
						<el-button  @click.native="handleCancel">取消</el-button>  
						<el-button  type="primary" @click.native="addFormDefAndFieldsSubmit" :loading="addLoading">提交</el-button>    
			</el-col> 
			</el-form> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import {sn} from '@/common/js/sequence';//全局公共库
	//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../api/common/code';//下拉框数据查询
	import { addFormDef,addFormDefAndFields } from '@/api/mdp/form/formDef'; 
	import FormField from '../formField/FormField' 
	import { mapGetters } from 'vuex'
	export default { 
	    computed: {
		    ...mapGetters([
		      'userInfo','myDepts'
		    ])
		},
		props:['formId','visible','formFieldsJson'],
		watch: {
	      'formId':function( formId ) {
			  if(this.formId){
				this.addForm.id=formId  
			  }else{
				  this.addForm.id=''
			  }
		  },
		'formFieldsJson':function( formFieldsJson ) {
			  if(this.formFieldsJson){ 
				  this.fields=JSON.parse(formFieldsJson)
			  }else{
				  this.fields=[]
			  }
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
					formName: [
						//{ required: true, message: '表单名称能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 表单定义
				addForm: {
					id:'',tableName:'',tableOwner:'',isCreateTable:'',formName:'',userid:'',deptid:'',formType:'',isTemplate:'',bizType:'',ctime:'',branchId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				fields:[]//表单的所有属性
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			}, 
			//新增提交FormDef 表单定义 父组件监听@submit="afterAddSubmit"
			addFormDefAndFieldsSubmit: function () { 
							if(this.addForm.id==''){
								this.addForm.id=sn()
							}
							var fields=this.$refs.fields.selectedFields;
							fields.forEach((i,index)=>{i.seqNo=index});
							var params={formDef:this.addForm,formFields:fields}; 
							this.$emit('submit',params);//  @submit="afterAddSubmit" 
						 
			},
			 
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {   
		    "form-field":FormField, 
		    
		},
		mounted() {
			if(this.formId){
				this.addForm.id=this.formId
			}
			if(this.formFieldsJson){
				this.fields=JSON.parse(this.formFieldsJson)
			}
			
			
		}//end mounted
	}

</script>

<style scoped>

</style>