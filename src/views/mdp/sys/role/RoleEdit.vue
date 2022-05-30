<template>
	<section>
		<el-row class="app-container"> 
		<!--编辑界面 Role 角色管理--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="角色编码" prop="roleid">
					<el-tag>{{editForm.roleid}}</el-tag>
				</el-form-item> 
				<el-form-item label="角色名" prop="rolename">
					<el-input v-model="editForm.rolename" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="角色类型" prop="rolename">
					<el-switch v-model="editForm.roletype" active-text="公共角色" inactive-text="自定义角色" active-value="1"  inactive-value="0"> </el-switch>
					<el-tooltip class="item" effect="light" content="公共角色为全平台共享，不区分机构，自定义角色按机构划分，本机构只能查询本机构的角色" placement="top-start">
				       <i class="el-icon-question"></i>
				    </el-tooltip>
				</el-form-item>  
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" auto-complete="off"></el-input>
				</el-form-item> 
				
				<el-form-item label="开始时间" prop="rolebeg">
					<el-date-picker type="date" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" placeholder="选择日期" v-model="editForm.rolebeg"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束时间" prop="roleend">
					<el-date-picker type="date" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" placeholder="选择日期" v-model="editForm.roleend"></el-date-picker>
				</el-form-item> 
				<el-form-item label="是否启用" prop="enabled">
					<el-radio-group v-model="editForm.enabled" >
				      <el-radio v-model="editForm.enabled" label="1" border>启用</el-radio>
				       <el-radio v-model="editForm.enabled" label="0" border>停用</el-radio>
				    </el-radio-group>
				</el-form-item> 
				<el-form-item> 
					<el-col :span="4" :offset="16"> 
						<el-button @click.native="handleCancel">取消</el-button> 
					</el-col>
					<el-col :span="4"> 
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editRole } from '@/api/mdp/sys/role';
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
	        this.editForm = role;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
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
				//编辑界面数据  Role 角色管理
				editForm: {
					roleid:'',rolename:'',remark:'',roletype:'',rolebeg:'',roleend:'',crdate:'',enabled:'',deptid:'',sortOrder:'',branchId:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//编辑提交Role 角色管理父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editRole(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['editForm'].resetFields();
									this.$emit('submit',params);//  @submit="afterEditSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() =>this.load.edit=false);
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
			this.editForm=Object.assign(this.editForm, this.role);  
		}
	}

</script>

<style scoped>

</style>