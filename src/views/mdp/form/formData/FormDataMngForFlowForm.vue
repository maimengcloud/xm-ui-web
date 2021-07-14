<template>
	<section>
		
		<el-row> 
			<el-col :span="24"  v-loading="listLoading" > 
				<form-data  :form-data="editForm" :form-def="{id:formId}" :form-fields="formFields"  :submit-event="submitEvent"  :@cancel="addFormVisible=false" @submit="afterEditSubmit" ref="formData"><div></div></form-data>
			</el-col>
			
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	
	import qxutil from '@/common/js/qxutil';//全局公共库
	import { listOption,listOptionByItemIds } from '@/api/itemOption';//下拉框数据查询
	import { listFormData, delFormData, batchDelFormData } from '@/api/mdp/form/formData';
	import { listFormField} from '@/api/mdp/form/formField';
	import  FormData from './FormData';//新增界面
	import { mapGetters } from 'vuex'

	import { listFormQx } from '@/api/mdp/form/formQx';
	export default { 
		props: ['isFlowStart','formId','procInstId','formFieldsJson','formDataId','submitEvent','qxCode'],
		watch: {
		      
		      'formId':function(formId) { 
				  if(!formId||formId==''||formId==null){
					  return;
				  }
		    	  this.getFormFields();
					this.formQx=null;
					/**工作流中不需要权限
					listFormQx({formId:formId}).then(res=>{ 
							if(res.data.tips.isOk){
								if(res.data.data.length>0){
									let formQxTemp=res.data.data[0]
									this.formQx=this.formQxStringTransferArray(formQxTemp)

								}  
							} 
						})
						 */
		      },
		      'procInstId':function(procInstId) {  
				  if(procInstId==null||procInstId==""){
					  return;
				  }
		    	  this.getFormDatas()
		      },
		      'formDataId':function(formDataId) {  
				  if(formDataId==null ||formDataId.length==0){
					  return;
				  }
		    	  this.getFormDatas()
			  },
			  
		      'formFieldsJson':function(formFieldsJson) {  
				  if(formFieldsJson==null ||formFieldsJson.length==0){
					  return;
				  }else{
					  this.formFields=JSON.parse(formFieldsJson)
				  }
		    	   
			  },
			  'qxCode':function(qxCode){
				  this.qxCodeArr=qxutil.flow.parseQxCode(this.qxCode)
				  this.formFields=qxutil.flow.parseFormFieldsQx(this.qxCodeArr,this.formFields);
			  },
			  'submitEvent':function(submitEvent) {  
			  }
				  
		    },	
	    computed: {
		    ...mapGetters([
		      'userInfo','myDepts'
		    ]),
		},
		data() {
			return {
				filters: {
					key: '', 
				},   
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				}, 
				listLoading: false,//查询中...
				sels: [],//列表选中数据 
				options2:{},//下拉选择框的所有静态数据 options.sex,options.project
				
				addFormVisible: false,//新增formData界面是否显示
				//新增formData界面初始化数据
				addForm: {
					id:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',lastTime:'',one:'',zero:'',remark:'',formId:'',userid:'',eleven:'',twelve:'',thirteen:'',fourteen:'',fifteen:'',attachmentUrls:'',attachmentNames:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑formData界面初始化数据
				editForm: {
					id:'',two:'',three:'',four:'',five:'',six:'',seven:'',eight:'',nine:'',ten:'',lastTime:'',one:'',zero:'',remark:'',formId:'',userid:'',eleven:'',twelve:'',thirteen:'',fourteen:'',fifteen:'',attachmentUrls:'',attachmentNames:''
				}, 
				formFields:[], 
				qxCodeArr:[],
				formQx: null,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
		 
			//如果是嵌入工作流i时调用此函数
			getFormDatas() {
				let params = { 
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total 
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					params.orderFields=this.pageInfo.orderFields;
					params.orderDirs=this.pageInfo.orderDirs;
				} 
					 
					if(this.procInstId && this.procInstId!='' && this.procInstId!=null){//工作流中直接发起
						params.procInstId=this.procInstId
						//params.flowState='1';
					}else if( this.formDataId ){//从智能表单跳转过来的审批流，指定了智能表单数据
							params.ids=[this.formDataId]
					}else {
						return;
					}
				 
				this.listLoading = true;
				listFormData(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						 
						this.editForm=res.data.data[0]
						
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					
				});
			},
     
			//获取列表 FormField 表单字段定义
			getFormFields() {
				if(  !this.formId  ){
					return;
				}
				let params = {
					formId:this.formId
				};
				this.formFields=[]
				this.listLoading=true;
				listFormField(params).then((res) => {
					var tips=res.data.tips;
					this.listLoading=false;
					if(tips.isOk){ 
						var formFields = res.data.data;
						this.formFields=qxutil.flow.parseFormFieldsQx(this.qxCodeArr,formFields);
						this.getOptions2();
						this.$emit('formFieldsLoad',this.formFields);
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
				}).catch(() => {
					 this.listLoading=false;
				});
			},	 
			afterAddSubmit:function(formData){
				this.$emit("submit",formData);
			},
			
			afterEditSubmit:function(formData){
				this.$emit("submit",formData);
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
			'form-data':FormData,
		    //在下面添加其它组件
		},
		mounted() {
			//this.getFormDatas();
			console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
			console.log(this.formId+"----formDataId---"+JSON.stringify( this.formDataId)) 
			this.qxCodeArr=qxutil.flow.parseQxCode(this.qxCode);
			this.getFormFields();
			this.getFormDatas();
		}
	}

</script>

<style scoped>

</style>