<template>
	<section>
		<el-row class="app-container"> 
			<el-col :span="16"> 
				<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
					<el-form-item label="序号" prop="seqNo" v-if="xmMenu.seqNo">
						 {{editForm.seqNo}}
					</el-form-item> 
					<el-form-item label="故事名称" prop="menuName">
						{{editForm.menuName}} 
					</el-form-item>  
					<el-form-item label="负责人" prop="menuName">
						{{editForm.mmUsername}} 
					</el-form-item>  
					<el-form-item label="备注" prop="remark">
						{{editForm.remark}}  
					</el-form-item>  
				</el-form>
			</el-col>
			<el-col :span="8">
				<xm-iteration-mng v-if="visible" :simple="true" :product-id="editForm.productId" :menu-id="editForm.menuId" ></xm-iteration-mng> 
			</el-col>
		</el-row>
		<el-row>
			<xm-menu-exchange-mng  v-if="visible" :visible="visible" :xm-menu="xmMenu" :simple="true"></xm-menu-exchange-mng>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editXmMenu,listXmMenu } from '@/api/xm/core/xmMenu';
	import { mapGetters } from 'vuex'
	import  XmIterationMng from '../xmIteration/XmIterationMng';//修改界面
	import  XmMenuExchangeMng from '../xmMenuExchange/XmMenuExchangeMng';//修改界面


	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['xmMenu','visible','reload'],
		watch: {
	      'xmMenu':function( xmMenu ) {
	      },
	      'visible':function(visible) { 
	      	if(this.visible==true){
				 this.editForm = Object.assign(this.editForm,this.xmMenu);

				  if(this.reload==true){
					  this.listXmMenu()
				  }
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					menuId: [
						{ required: true, message: '故事编号不能为空', trigger: 'blur' }
					],
					menuName: [
						{ required: true, message: '故事编号不能为空', trigger: 'blur' }
					],
					productId: [
						{ required: true, message: '产品编号不能为空', trigger: 'blur' }
					],
					seqNo: [
						{ required: true, message: '序号不能为空', trigger: 'blur' }
					],
				},
				//编辑界面数据  XmMenu 项目故事表
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',seqNo:'',mmUserid:'',mmUsername:''
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
			//编辑提交XmMenu 项目故事表父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmMenu(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			},
			listXmMenu:function(){
				listXmMenu({menuId:this.xmMenu.menuId}).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						var data= res.data.data;

						if(data && data.length>0){
							this.editForm=Object.assign(this.editForm,data[0])
						}
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
			//在下面添加其它组件 'xm-menu-edit':XmMenuEdit
			XmIterationMng,XmMenuExchangeMng
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmMenu);  
			if(this.reload==true){
				this.listXmMenu();
			}
		}
	}

</script>

<style scoped>

</style>