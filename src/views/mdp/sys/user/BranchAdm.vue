<template>
	<section>
		<el-row>
			 <el-card class="box-card">
				<el-row slot="header" class="clearfix"> 
					<el-col :span="18"><strong>机构管理员</strong>  </el-col>   
					<el-col :span="6">
						<el-button style="float:right;" type="primary" icon="el-icon-plus" @click="usersSelectVisible=true">添加更多机构管理员</el-button>
					</el-col>   
					<el-col :span="24" class="padding-top"> 权限说明：机构管理员具有本机构最高权限</el-col>    
				</el-row>  
				<el-row class="avatar-container">   
						<div :span="4" class="avatar-wrapper" v-for="(item,index) in branchAdms" :key="index">
							<img v-if=" item.headimgurl " class="user-avatar" :src="item.headimgurl">
							<img v-else class="user-avatar" src="../../../../assets/image/user_img.gif">
							<span class="username">  <el-tag :closable="item.userid!=item.branchId" @close="setUsersUnBranchAdm(item)"> {{item.username?item.username:item.userid}}({{item.userid}})</el-tag></span> 
						</div>     
				</el-row>
			</el-card>
		</el-row>
		
		<el-dialog append-to-body title="人员选择" width="70%" top="5vh" :visible.sync="usersSelectVisible">
			<users-select @confirm="onUsersSelect" ></users-select>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库import {
import {	listUser,setUsersToBranchAdm,setUsersUnBranchAdm,
	delUser,
	batchDelUser,
	resetPasswordByAdmin
	} from "../../../../api/mdp/sys/user"; 
	import { mapGetters } from 'vuex'   
	import UsersSelect from './UsersSelect.vue';
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:[ ],
		watch: { 
	    },	
		data() { 
			return {
				dicts:{},//下拉选择框的所有静态数据
				load:{add: false}, 
				//新增界面数据 sys_user
				addForm: {
					unionid:'',displayUserid:'',userid:'',locked:'',startdate:'',nickname:'',username:'',phoneno:'',password:'',salt:'',fingerpassword1:'',fingerpassword2:'',fingerpassword3:'',fingerpassword4:'',pwdtype:'',headimgurl:'',country:'',city:'',province:'',address:'',sex:'',enddate:'',districtId:'',userid:'',userAccount:'',userPwd:'',userName:'',userDesc:'',officePhoneno:'',idCardNo:''
				}, 
				branchAdms:[],//机构管理员列表
				usersSelectVisible:false,
				/**end 在上面加自定义变量**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交User sys_user 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				let checkedNodes=this.$refs.nodeTree.$refs.deptTree.getCheckedNodes(false);
				if(checkedNodes==null || checkedNodes.length==0){
					this.$notify.error("请选择机构部门");
					return 
				}
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add = true; 
							let params = {user:Object.assign({}, this.addForm),userDept:{userid:'',deptid:checkedNodes[0].deptid,branchId:checkedNodes[0].branchId}}; 
							params.user.password=md5(this.addForm.password);
							addUser(params).then((res) => {
								this.load.add = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									//this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.load.add = false;
							});
						});
					}
				});
			}, 
			getUsers(){ 
				var params={branchId:this.userInfo.branchId,memType:'1'}
				listUser(params).then(res => {
					var tips = res.data.tips;
					if (tips.isOk) { 
						this.branchAdms = res.data.data;
					} else {
						this.$notify({ message: tips.msg, type: "error" });
					}
					this.load.list = false;
				})
				.catch(() => {
					this.load.list = false; 
				});
			},
			setUsersUnBranchAdm(user){
				setUsersUnBranchAdm([user.userid]).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){ 
						this.getUsers();
					}
					this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				});
			},
			onUsersSelect(users){
				setUsersToBranchAdm(users.map(i=>i.userid)).then(res=>{
					var tips = res.data.tips; 
					if(tips.isOk){
						users.forEach(i=>i.memType="1")
						this.getUsers();
					}
					this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				});
			}

		},//end method
		components: {   
			UsersSelect
		},
		mounted() { 
			this.getUsers();
			
		}//end mounted
	}

</script>

<style lang="scss" scoped>
.box-card{
	height: 800px;
	overflow: auto;
}
.avatar-container {
    height: 50px;
    display: flex;
    align-items: center;
    .avatar-wrapper {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        .user-avatar {
            height: 34px;
            width: 34px;
            border-radius: 50%;
            margin-right: 12px;
        }
        .username{
            color: #7D7D7D;
            font-size: 18px;
            margin-right: 2px;
        }
        .el-icon-caret-bottom {
            font-size: 22px;
        }
    }
}
</style>