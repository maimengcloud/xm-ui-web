<template>
	<section>
		<el-row class="app-container"> 
		<!--编辑界面 UserTpa 第三方系统向我方开放的用户列表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="全局唯一编号" prop="unionid">
					<el-input v-model="editForm.unionid" placeholder="全局唯一编号"></el-input>
				</el-form-item> 
				<el-form-item label="帐户加密后的编号，用于对第三方系统进行开放" prop="openid">
					<el-input v-model="editForm.openid" placeholder="帐户加密后的编号，用于对第三方系统进行开放"></el-input>
				</el-form-item> 
				<el-form-item label="MDP用户编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="MDP用户编号"></el-input>
				</el-form-item> 
				<el-form-item label="是否被锁定" prop="locked">
					<el-input v-model="editForm.locked" placeholder="是否被锁定"></el-input>
				</el-form-item> 
				<el-form-item label="启用日期" prop="startdate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="editForm.nickname" placeholder="昵称"></el-input>
				</el-form-item> 
				<el-form-item label="用户名称" prop="username">
					<el-input v-model="editForm.username" placeholder="用户名称"></el-input>
				</el-form-item> 
				<el-form-item label="移动电话号码" prop="phoneno">
					<el-input v-model="editForm.phoneno" placeholder="移动电话号码"></el-input>
				</el-form-item> 
				<el-form-item label="国家" prop="country">
					<el-input v-model="editForm.country" placeholder="国家"></el-input>
				</el-form-item> 
				<el-form-item label="城市" prop="city">
					<el-input v-model="editForm.city" placeholder="城市"></el-input>
				</el-form-item> 
				<el-form-item label="头像地址" prop="headimgurl">
					<el-input v-model="editForm.headimgurl" placeholder="头像地址"></el-input>
				</el-form-item> 
				<el-form-item label="省份" prop="province">
					<el-input v-model="editForm.province" placeholder="省份"></el-input>
				</el-form-item> 
				<el-form-item label="对应本系统user表的UNIONID" prop="userunionid">
					<el-input v-model="editForm.userunionid" placeholder="对应本系统user表的UNIONID"></el-input>
				</el-form-item> 
				<el-form-item label="前端应用系统编号" prop="mdpAppid">
					<el-input v-model="editForm.mdpAppid" placeholder="前端应用系统编号"></el-input>
				</el-form-item> 
				<el-form-item label="机构编号" prop="deptid">
					<el-input v-model="editForm.deptid" placeholder="机构编号"></el-input>
				</el-form-item> 
				<el-form-item label="云用户机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="云用户机构编号"></el-input>
				</el-form-item> 
				<el-form-item label="第三方登录应用系统编号" prop="appid">
					<el-input v-model="editForm.appid" placeholder="第三方登录应用系统编号"></el-input>
				</el-form-item> 
				<el-form-item label="授权编号" prop="authId">
					<el-input v-model="editForm.authId" placeholder="授权编号"></el-input>
				</el-form-item> 
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键"></el-input>
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
	import { editUserTpa } from '@/api/mdp/sys/userTpa';
	import { mapGetters } from 'vuex'
	
	export default {
		props:['userTpa','visible'],
		watch: {
	      'userTpa':function( userTpa ) {
	        this.editForm = userTpa;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  UserTpa 第三方系统向我方开放的用户列表
				editForm: {
					unionid:'',openid:'',userid:'',locked:'',startdate:'',nickname:'',username:'',phoneno:'',country:'',city:'',headimgurl:'',province:'',userunionid:'',mdpAppid:'',deptid:'',branchId:'',appid:'',authId:'',id:''
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
			//编辑提交UserTpa 第三方系统向我方开放的用户列表父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editUserTpa(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
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
		    //在下面添加其它组件 'user-tpa-edit':UserTpaEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.userTpa);  
		}
	}

</script>

<style scoped>

</style>