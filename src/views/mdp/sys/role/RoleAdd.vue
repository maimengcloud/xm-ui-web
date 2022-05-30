<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 Role 角色管理--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色编码" prop="roleid">
					<el-input v-model="addForm.roleid" auto-complete="off" placeholder="如果为空则后台自动生成"></el-input>
				</el-form-item> 
				<el-form-item label="角色名" prop="rolename">
					<el-input v-model="addForm.rolename" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="角色类型" prop="roletype">
					<el-switch
					  v-model="addForm.roletype"
					  active-text="公共角色"
					  inactive-text="自定义角色"
					  active-value="1"
					  inactive-value="0">
					</el-switch>
					<el-tooltip class="item" effect="light" content="全平台共享，不区分机构" placement="top-start">
				       <i class="el-icon-question"></i>
				    </el-tooltip>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="是否启用" prop="enabled"> 
					<el-radio-group v-model="addForm.enabled" >
				      <el-radio v-model="addForm.enabled" label="1" border>启用</el-radio>
				       <el-radio v-model="addForm.enabled" label="0" border>停用</el-radio>
				    </el-radio-group>
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
	import { addRole } from '@/api/mdp/sys/role';
	import { mapGetters } from 'vuex' 
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['role','visible'],
		watch: {
	      'role':function( role ) {
	        this.addForm = role;
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
					rolename: [
						{ required: true, message: '角色名必输', trigger: 'blur' }
					],
					roletype: [
						{ required: true, message: '角色类型必输', trigger: 'blur' }
					],
					enabled: [
						{ required: true, message: '是否启用必输', trigger: 'blur' }
					]
				},
				//新增界面数据 角色管理
				addForm: {
					roleid:'',rolename:'',remark:'',roletype:'0',rolebeg:'',roleend:'',crdate:'',enabled:'1',deptid:'',sortOrder:'',branchId:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交Role 角色管理 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							params.deptid=this.userInfo.deptid;
							params.branchId=this.userInfo.branchId;
							addRole(params).then((res) => {
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
		    //在下面添加其它组件 'role-edit':RoleEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.role);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>