<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 MenuRole 菜单角色分配--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="用户组编号" prop="roleid">
					<el-input v-model="addForm.roleid" placeholder="用户组编号" ></el-input>
				</el-form-item> 
				<el-form-item label="菜单编号" prop="mid">
					<el-input v-model="addForm.mid" placeholder="菜单编号" ></el-input>
				</el-form-item> 
				<el-form-item label="编号" prop="id">
					<el-input v-model="addForm.id" placeholder="编号" ></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="4" :offset="16"> 
						<el-button @click.native="handleCancel">取消</el-button> 
					</el-col>
					<el-col :span="4"> 
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" >提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addMenuRole } from '@/api/mdp/menu/menuRole';
	import { mapGetters } from 'vuex'; 
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['menuRole','visible'],
		watch: {
	      'menuRole':function( menuRole ) {
	        this.addForm = menuRole;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '编号不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 菜单角色分配
				addForm: {
					roleid:'',mid:'',id:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交MenuRole 菜单角色分配 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addMenuRole(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => this.load.add=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'menu-role-edit':MenuRoleEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.menuRole);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>