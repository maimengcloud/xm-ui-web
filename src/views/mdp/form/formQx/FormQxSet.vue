<template>
	<section>
		 <el-row class="page-container border padding"> 
			<el-form :model="editForm"  label-width="140px" :rules="editFormRules" ref="editForm">
				<el-form-item label="表单" prop="formId">
					 {{editForm.formId}}-{{formDef?formDef.formName:''}} 
				</el-form-item> 
				<el-form-item label="是否允许其它人" prop="allowOtherQuery">
					<el-checkbox v-model="editForm.allowOtherQuery" true-label="1" false-label="0">可查询</el-checkbox>
					<el-checkbox v-model="editForm.allowOtherEdit" true-label="1" false-label="0">可修改</el-checkbox>
					<el-checkbox v-model="editForm.allowOtherDel" true-label="1" false-label="0">可删除</el-checkbox> 
				</el-form-item> 
				<el-form-item label="允许哪些角色查询" prop="allowQueryRoleids" v-if="editForm.allowOtherQuery=='1'">
					<el-select      multiple v-model="editForm.allowQueryRoleids"   placeholder="请选择">
		  				<el-option
					      v-for="item in roles"
					      :key="item.roleid"
					      :label="item.rolename"
					      :value="item.roleid">
					      <span style="float: left">{{ item.rolename }}</span>
		   					  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.remark }}</span>
					    </el-option>
					</el-select>
				</el-form-item> 
				<el-form-item label="禁止哪些角色查询" prop="notQueryRoleids" v-if="editForm.allowOtherQuery=='1'">
					
					<el-select      multiple v-model="editForm.notQueryRoleids"   placeholder="请选择">
		  				<el-option
					      v-for="item in roles"
					      :key="item.roleid"
					      :label="item.rolename"
					      :value="item.roleid">
					      <span style="float: left">{{ item.rolename }}</span>
		   					  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.remark }}</span>
					    </el-option>
					</el-select>
				</el-form-item> 
				<el-form-item label="允许哪些部门查询" prop="allowQueryDeptids" v-show="editForm.allowOtherQuery=='1'"> 
					 <dept-tree   :branch-id="userInfo.branchId" default-expand-all show-checkbox multiple :expand-on-click-node="false" ref="allowQueryDeptids"></dept-tree>
				</el-form-item> 
				<el-form-item label="禁止哪些部门查询" prop="notQueryDeptids" v-show="editForm.allowOtherQuery=='1'">
					<dept-tree   :branch-id="userInfo.branchId" default-expand-all show-checkbox multiple :expand-on-click-node="false" ref="notQueryDeptids"></dept-tree>
				</el-form-item> 
				<el-form-item label="允许哪些人查询" prop="allowQueryUserids" v-if="editForm.allowOtherQuery=='1'">
					 
					<el-select    multiple v-model="editForm.allowQueryUserids"   placeholder="请选择">
		  				<el-option
					      v-for="item in companyEmployees"
					      :key="item.userid"
					      :label="item.username"
					      :value="item.userid">
					      <span style="float: left">{{ item.username }}</span>
		   					  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
					    </el-option>
					</el-select>
				</el-form-item> 
				<el-form-item label="禁止哪些人查询" prop="notQueryUserids"  v-if="editForm.allowOtherQuery=='1'">
					 
					<el-select    multiple v-model="editForm.notQueryUserids"   placeholder="请选择">
		  				<el-option
					      v-for="item in companyEmployees"
					      :key="item.userid"
					      :label="item.username"
					      :value="item.userid">
					      <span style="float: left">{{ item.username }}</span>
		   					  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shortName }}</span>
					    </el-option>
					</el-select>
				</el-form-item>  


 
				<el-form-item>  
				<el-col :span="24"  :offset="8"> 
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
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listFormQx,editFormQx,addFormQx } from '@/api/mdp/form/formQx';
	import { listRole } from '@/api/mdp/sys/role';
	import { mapGetters } from 'vuex'

	import DeptTree from '@/views/mdp/sys/dept/DeptTree';//下拉框数据查询
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['formQx','visible','formDef','companyEmployees'],
		watch: {
			'formDef': function(formDef){
				this.editForm.formId=formDef.id;
				if(!this.formQx){
					 console.log("formQDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
					this.getFormQx()
				}
				
			},
	      'formQx':function( formQx ) { 
	    	  if(formQx){
	    		  console.log("formQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
	    		this.editForm=Object.assign(this.editForm, formQx);   
	    		  this.isAdd=false
	  			this.formQxStringTransferArray(this.editForm) 
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
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					formId: [
						//{ required: true, message: '表单编号不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  FormQx 表单权限
				editForm: {
					formId:'',allowQueryRoleids:[],allowQueryDeptids:[],allowQueryUserids:[],notQueryRoleids:[],notQueryDeptids:[],notQueryUserids:[],allowOtherQuery:'1',allowOtherEdit:'0',allowOtherDel:'0',doDeptLvlCheck:'0',deptLvlQx:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				roles: [],
				isAdd: false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				//this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交FormQx 表单权限父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let formQx=Object.assign({},this.editForm) 
					        formQx.allowQueryRoleids=formQx.allowQueryRoleids.join(',') 
					        formQx.allowQueryDeptids=this.$refs['allowQueryDeptids'].$refs.deptTree.getCheckedKeys().join(",")
					        formQx.allowQueryUserids=formQx.allowQueryUserids.join(',')
					        formQx.notQueryRoleids=formQx.notQueryRoleids.join(',')
					        formQx.notQueryDeptids=this.$refs['notQueryDeptids'].$refs.deptTree.getCheckedKeys().join(",")
					        formQx.notQueryUserids=formQx.notQueryUserids.join(',')
							let params = Object.assign({}, formQx); 
							if(this.isAdd==true){
								addFormQx(params).then((res) => {
									this.load.edit=false
									var tips=res.data.tips;
									if(tips.isOk){
										this.$refs['editForm'].resetFields();
										this.$emit('submit');//  @submit="afterAddSubmit"
									}
									this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
								}).catch( err  => this.load.add=false);
							}else{
								editFormQx(params).then((res) => {
									this.load.edit=false
									var tips=res.data.tips;
									if(tips.isOk){
										this.$refs['editForm'].resetFields();
										this.$emit('submit');//  @submit="afterEditSubmit"
									}
									this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
								}).catch( err =>this.load.edit=false);
							}
							
						});
					}
				});
			},
			formQxStringTransferArray: function(formQx){
				if(formQx.allowQueryRoleids!='' && formQx.allowQueryRoleids!=null){
					formQx.allowQueryRoleids=formQx.allowQueryRoleids.split(',')
				}else{
					formQx.allowQueryRoleids=[]
				} 
				if(formQx.allowQueryUserids!='' && formQx.allowQueryUserids!=null){
					formQx.allowQueryUserids=formQx.allowQueryUserids.split(',')
				}else{
					formQx.allowQueryUserids=[]
				}
				if(formQx.allowQueryDeptids!='' && formQx.allowQueryDeptids!=null){
					formQx.allowQueryDeptids=formQx.allowQueryDeptids.split(',')
					
				}else{
					formQx.allowQueryDeptids=[]
				}
				this.$refs['allowQueryDeptids'].$refs.deptTree.setCheckedKeys(formQx.allowQueryDeptids); 
				if(formQx.notQueryRoleids!='' && formQx.notQueryRoleids!=null){
					formQx.notQueryRoleids=formQx.notQueryRoleids.split(',')
				}else{
					formQx.notQueryRoleids=[]
				}
				if(formQx.notQueryDeptids!='' && formQx.notQueryDeptids!=null){
					formQx.notQueryDeptids=formQx.notQueryDeptids.split(',')
				}else{
					formQx.notQueryDeptids=[]
				}
				this.$refs['notQueryDeptids'].$refs.deptTree.setCheckedKeys(formQx.notQueryDeptids); 
				if(formQx.notQueryUserids!='' && formQx.notQueryUserids!=null){
					formQx.notQueryUserids=formQx.notQueryUserids.split(',')
				}else{
					formQx.notQueryUserids=[]
				} 
				return formQx
			},
			getFormQx: function(){
				let params={formId:this.editForm.formId}
				this.load.list = true;
				listFormQx(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){  
						if(res.data.data.length>0){
							this.isAdd=false
							let tempFormQx=Object.assign({}, res.data.data[0]);   
							this.editForm=this.formQxStringTransferArray(tempFormQx)
						}else{
							this.isAdd=true
						}
						
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'form-qx-edit':FormQxEdit
			'dept-tree': DeptTree,
		},
		mounted() {
			if(this.formQx){
				this.isAdd=false
				let tempFormQx=Object.assign({}, this.formQx);   
				this.editForm=this.formQxStringTransferArray(tempFormQx)
			}else{
				this.editForm.formId=this.formDef.id
				this.getFormQx()
			}
			listRole({branchId:this.userInfo.branchId}).then(res=>this.roles=res.data.data)
			
		}
	}

</script>

<style scoped>

</style>