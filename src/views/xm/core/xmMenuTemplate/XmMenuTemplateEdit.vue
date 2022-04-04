<template>
	<section class="page-container  padding border">
		<el-row> 
		<!--编辑界面 XmMenuTemplate 项目需求表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="序号" prop="seqNo">
					<el-input v-model="editForm.seqNo" placeholder="如1.0 ， 1.1 ， 1.1.1等" ></el-input>
				</el-form-item> 
				<el-form-item label="需求名称" prop="menuName">
					<el-input v-model="editForm.menuName" placeholder="需求名称" ></el-input>
				</el-form-item>  
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" v-model="editForm.remark" placeholder="什么人？做什么事？，为什么？如： 作为招聘专员，我需要统计员工半年在职/离职人数，以便我能够制定招聘计划" ></el-input>
				</el-form-item> 
				<el-form-item> 
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { editXmMenuTemplate } from '@/api/xm/core/xmMenuTemplate';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmMenuTemplate','visible'],
		watch: {
	      'xmMenuTemplate':function( xmMenuTemplate ) {
	        this.editForm = xmMenuTemplate;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					menuId: [
						{ required: true, message: '需求编号不能为空', trigger: 'blur' }
					],
					menuName: [
						{ required: true, message: '需求编号不能为空', trigger: 'blur' }
					],
					productId: [
						{ required: true, message: '产品编号不能为空', trigger: 'blur' }
					],
					seqNo: [
						{ required: true, message: '序号不能为空', trigger: 'blur' }
					],
				},
				//编辑界面数据  XmMenuTemplate 项目需求表
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交XmMenuTemplate 项目需求表父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmMenuTemplate(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-menu-edit':XmMenuTemplateEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmMenuTemplate);  
		}
	}

</script>

<style scoped>

</style>