<template>
	<section>
		<el-row>
		<!--编辑界面 XmProductProjectLink 产品与项目的关联关系表，一般由产品经理挂接项目到产品上--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="项目表中的主键" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="项目表中的主键"></el-input>
				</el-form-item> 
				<el-form-item label="产品表中的主键" prop="productId">
					<el-input v-model="editForm.productId" placeholder="产品表中的主键"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="创建人编号" prop="cuserid">
					<el-input v-model="editForm.cuserid" placeholder="创建人编号"></el-input>
				</el-form-item> 
				<el-form-item label="创建人姓名" prop="cusername">
					<el-input v-model="editForm.cusername" placeholder="创建人姓名"></el-input>
				</el-form-item> 
				<el-form-item label="关联状态1关联0取消关联" prop="linkStatus">
					<el-input v-model="editForm.linkStatus" placeholder="关联状态1关联0取消关联"></el-input>
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
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { editXmProductProjectLink } from '@/api/xm/core/xmProductProjectLink';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['xmProductProjectLink','visible'],
		watch: {
	      'xmProductProjectLink':function( xmProductProjectLink ) {
	        this.editForm = xmProductProjectLink;
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
					projectId: [
						//{ required: true, message: '项目表中的主键不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  XmProductProjectLink 产品与项目的关联关系表，一般由产品经理挂接项目到产品上
				editForm: {
					projectId:'',productId:'',ctime:'',cuserid:'',cusername:'',linkStatus:''
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
			//编辑提交XmProductProjectLink 产品与项目的关联关系表，一般由产品经理挂接项目到产品上父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmProductProjectLink(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-product-project-link-edit':XmProductProjectLinkEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmProductProjectLink);  
		}
	}

</script>

<style scoped>

</style>