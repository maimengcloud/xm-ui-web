<template>
	<section>
	
		<!--工具条1-->  
		<!--如果有更多工具条,放开此注释
		<el-col :span="24" class="toolbar"  style="padding-bottom: 0px;">
			<el-col :span="4">
			</el-col>
		</el-col>
		-->
		 
		<!--调整用户角色界面 UserRole 用户角色表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item  label="用户" prop="username">
					<el-tag type="gray">{{user.username}} ({{user.displayUserid}})</el-tag>   
				</el-form-item>  
				<el-form-item v-if="userInfo.isSuperAdmin" label="机构" prop="branchId" >
					 <el-tag>{{branch_.branchName}}</el-tag><el-button v-if="userInfo.isSuperAdmin==true||userInfo.isPlatformAdmin==true" @click.native="showBranchSelect">点击切换机构</el-button>
				</el-form-item> 
				<el-form-item label="角色" prop="userrole"> 
					<el-transfer  filterable   v-loading="load.list" :titles="['未选中','已选中']"  :props="{ key: 'roleid',  label: 'rolename' }"  v-model="userRoleids" :data="roles">
					 </el-transfer> 
				 </el-form-item>  
				<el-form-item>
					<el-col :span="24" >
						<el-col :span="4" :offset="8"> 
							<el-button @click.native="handleCancel">取消</el-button> 
						</el-col>
						<el-col :span="4"> 
							<el-button type="primary" @click.native="editSubmit" :loading="load.edit">提交</el-button>  
						</el-col>
					</el-col> 
				</el-form-item> 
			</el-form>
		<el-dialog title="机构选择" :visible.sync="branchVisible"  width="50%"  :close-on-click-modal="false" append-to-body>
			<branch-select :visible="branchVisible"  @cancel="branchVisible=false" @row-click="branchRowClick"></branch-select>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库 
	import { listUserRole,  batchEditUserRole } from '../../../../api/mdp/sys/userRole';
	import { listRole} from '../../../../api/mdp/sys/role';

	import { listBranch } from '@/api/mdp/sys/branch';
	import { mapGetters } from 'vuex' 
	import  BranchSelect from '../branch/BranchSelect';//机构选择
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['userRole','user','visible','branch'],
		watch: {
	      'userRole':function(userRole) {
	        this.editForm=userRole;
	      },
	      'branch':function(branch) {
		        this.branch_=branch;
		        this.getRoles();
		      },
	      'visible':function(visible) {
	      	if(visible==true){ 
				this.getUserRoleids();
	      	}
	         
	      }
	    },	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '主键ID', trigger: 'blur' }
					]
				},
				//新增界面数据 用户角色表
				editForm: {
					id:'',roleid:'',userid:'',remark:'',userroleBeg:'',userroleEnd:'',createDate:'',roleSort:'',enabled:'',deptid:'',branchId:''
				},
				/**begin 在下面加自定义变量**/
				userRoleids:[],//用户拥有的所有角色编号
				roles:[],//所有的角色
				userRoles:[],//用户拥有的角色关系 
				branchs: [],//机构 
				branchVisible: false,
				branch_: {}
				/**end 在上面加自定义变量**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交UserRole 用户角色表 父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit = true; 
							let userid=this.user.userid;
							let delRoleids=[];
							this.userRoles.forEach(ur=>{
								if(!this.userRoleids.some(roleid=>roleid==ur.roleid)){
									delRoleids.push(ur.roleid)
								}
							});
							let params = {userid:userid,roleids:this.userRoleids,delRoleids:delRoleids,branchId:this.branch_.id};
							 
							console.log(params);
							batchEditUserRole(params).then((res) => {
								this.load.edit = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.load.edit = false;
							});
						});
					}
				});
			},
			/**begin 在下面加自定义方法**/
			//获取用户拥有的角色编号			
			getUserRoleids(){
				this.load.list=true;
				let params={userid:this.user.userid};
				listUserRole(params).then(res=>{
					this.load.list=false;
					let urs=res.data.data;
					this.userRoles=urs;
					this.userRoleids=urs.map(item=>item.roleid); 
				}).catch(()=>this.load.list=false);
			},
			getRoles(){  
				this.load.list=true;
				let params={}; 
				params.branchId=this.branch_.id; 
		        listRole(params).then(res=>{
		        	this.load.list=false;
					this.roles=res.data.data;
				}).catch(()=>this.load.list=false); 
		    },

			branchChange: function(branchId){
				this.getRoles()
			},
			showBranchSelect: function(){
				this.branchVisible=true
			},
			branchRowClick: function(row,e,column){
				this.branchVisible=false
				this.branch_=row
				this.getRoles()
			}
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'user-role-edit':UserRoleEdit
			 'branch-select':BranchSelect
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.dataObj); 
			console.log(this.branch)
			this.branch_=this.branch    
			this.getRoles();
			this.getUserRoleids();
			
		}//end mounted
	}

</script>

<style scoped>

</style>