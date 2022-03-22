<template>
	<div class="m_container">
		<div class="m_content">
			<div class="m_msgcard">
				<el-avatar class="m_avater" :src="editForm.headimgurl || defaultImg">
				</el-avatar>
				<div class="m_msg">
					<span class="m_name">{{userInfo.username}}</span>
					<span class="m_dept">所在部门：{{userInfo.deptName}}</span>
					<el-button @click="showUploadHeadimg" class="m_btn">修改头像</el-button>
				</div>
			</div>
			<div class="m_opercard">
				<div class="m_base">
					<h3>基本信息</h3>
					<el-form class="m_f m_from1" :model="editForm"  label-width="120px" :rules="editFormRules"  ref="editForm">
						<el-form-item label="用户名称" prop="username" :rules="[{required:true,message:'用户名称不能为空'}]">
							<el-input style="width:400px;"  v-model="editForm.username" auto-complete="off"></el-input>
						</el-form-item> 
						<el-form-item label="登录账号" prop="displayUserid" :rules="[{required:true,message:'登录账号不能为空'}]">
							<el-input style="width:400px;" v-model="editForm.displayUserid" auto-complete="off"></el-input>
						</el-form-item>    
						<el-form-item label="邮箱" prop="email" :rules="[{required:true,message:'邮箱不能为空'},{validator:validateEmail}]">
							<el-input style="width:400px;" v-model="editForm.email" auto-complete="off"></el-input>
						</el-form-item>    
						<el-form-item> 
							<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>   
						</el-form-item> 
					</el-form>
				</div>
				<div class="m_setpwd">
					<h3>密码设置</h3>
					<el-form class="m_f m_from1" :model="editForm"  label-width="80px" ref="passwordForm">
						<el-form-item>
							<el-form-item label="原密码" prop="oldPassword" :rules="[{required:true,message:'原密码不能为空'}]">
								<el-input style="width:400px;" type="password" v-model="passwordForm.oldPassword" auto-complete="off"></el-input>
							</el-form-item>  
							<el-form-item label="新密码" prop="newPassword" :rules="[{required:true,message:'新密码不能为空'}]">
								<el-input style="width:400px;" type="password" v-model="passwordForm.newPassword" auto-complete="off"></el-input>
							</el-form-item> 
							<el-form-item>
								<el-button style="margin-left: 80px" type="primary" @click.native="doChangePassword" :loading="setLoading">保存</el-button>  
							</el-form-item> 
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>

		<single-shear-upload ref="uploadImg" v-show="false"	
			:img-width="100"
			:img-height="100"
			:show-title="true"
			v-model="editForm.headimgurl"
			:branch-id="userInfo.branchId"
			:deptid="userInfo.deptid"
			:remark="userInfo.username"
		>
			<span slot="title">商品高清大图</span>
		</single-shear-upload>
	</div>

	<!-- <section>
		<el-row class="padding" v-show="changePasswordVisible==true" >
			<el-form :model="passwordForm"  label-width="120px"   ref="passwordForm">
				<el-form-item label="" prop="headimgurl">
					<el-avatar :size="100" :src="editForm.headimgurl"></el-avatar> 
				</el-form-item>  
				<el-form-item label="原密码" prop="oldPassword" :rules="[{required:true,message:'原密码不能为空'}]">
					<el-input style="width:400px;" type="password" v-model="passwordForm.oldPassword" auto-complete="off"></el-input>
				</el-form-item>  
				<el-form-item label="新密码" prop="newPassword" :rules="[{required:true,message:'新密码不能为空'}]">
					<el-input style="width:400px;" type="password" v-model="passwordForm.newPassword" auto-complete="off"></el-input>
				</el-form-item>  
				<el-form-item> 
						<el-button type="primary" @click.native="doChangePassword" :loading="editLoading">保存</el-button>  
						<el-button  @click.native="changePasswordVisible=false" :loading="editLoading">返回</el-button>   
				</el-form-item> 
			</el-form>
			</el-row>
			<el-row class="padding" v-show="changePasswordVisible==false" >

			<el-form :model="editForm"  label-width="120px" :rules="editFormRules"  ref="editForm">
				<el-form-item  label="" prop="headimgurl">
					<el-avatar :size="100" :src="editForm.headimgurl"  @click="showUploadHeadimg"></el-avatar> 
					<br>
					<el-button type="text" @click="showUploadHeadimg">更换头像</el-button>
				</el-form-item> 
				
				<el-form-item label="" v-show="false" prop="headimgurl">
					<single-shear-upload ref="uploadImg"	
						:img-width="100"
						:img-height="100"
						:show-title="true"
						v-model="editForm.headimgurl"
						:branch-id="userInfo.branchId"
						:deptid="userInfo.deptid"
						:remark="userInfo.username"
					>
						<span slot="title">商品高清大图</span>
					</single-shear-upload>
				</el-form-item>  
				<el-form-item label="用户名称" prop="username" :rules="[{required:true,message:'用户名称不能为空'}]">
					<el-input style="width:400px;"  v-model="editForm.username" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="登录账号" prop="displayUserid" :rules="[{required:true,message:'登录账号不能为空'}]">
					<el-input style="width:400px;" v-model="editForm.displayUserid" auto-complete="off"></el-input>
				</el-form-item>    
				<el-form-item label="邮箱" prop="email" :rules="[{required:true,message:'邮箱不能为空'},{validator:validateEmail}]">
					<el-input style="width:400px;" v-model="editForm.email" auto-complete="off"></el-input>
				</el-form-item>    
				<el-form-item> 
						<el-button  @click.native="changePasswordVisible=true" :loading="editLoading">修改密码</el-button>   
						<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>   
				</el-form-item> 
			</el-form>
		</el-row>
	</section> -->



</template>

<script>
import { editUser,changePassword } from '@/api/mdp/sys/user';
import { mapGetters } from 'vuex' 
import SingleShearUpload from "@/components/Image/Single/Index";
	
import md5 from "js-md5";
	export default {
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['user'],
		watch: {
	      'user':function(data) {
	        this.editForm=data;
	      } 
	    },
		data() {
			var validatePhoneno = (rule, value, callback) => {
				if (!value) {
					callback();
				} else {
				if (value) {
					if(value.length<11 || value.length>11){
						callback(new Error('手机号码必须11位'));
					}
					if(!(/^1[3456789]\d{9}$/.test(value))){ 
						callback(new Error('手机号码格式不正确'));
					}

				}
				callback();
				}
			};
			
			var validateEmail = (rule, value, callback) => {
				if (value=='') {
					callback();
				} else {
				if (value !== '') {
					var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
					if(!reg.test(value)){
						 callback(new Error('邮箱格式不正确'));
					}  
				}
				callback();
				}
			};
			
			var validateIdCardNo = (rule, value, callback) => {
				if (value === ''|| value==null) {
				//callback(nPhonenoew Error('请输入密码'));
					callback();
				}else {
					if (value !== '' && value.length>15) {
						var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
						if(!reg.test(value)){
							callback(new Error('身份证号码格式不正确'));
						}else{
							callback();
						}
					}else if(value !== '' && value.length<15){
						callback(new Error('请输入15位或者18位长度身份证号码'));
					}else{
						callback();
					}
				
				}
			}; 
			return {
				validateEmail:validateEmail,
				uploadHeadimgVisible:false,
				changePasswordVisible:false,
				options:{},//下拉选择框的所有静态数据
				editLoading: false,
				setLoading: false,
				defaultImg: 'https://www.qingqinkj.com/api/m1/arc/arc/image/qqkj_001/IM1632611467940176/IM1633550409547158.png',
				editFormRules: {
					displayUserid: [
						{ required: true, message: '账号必填', trigger: 'blur' }
					],
					username: [
						{ required: true, message: '用户名称必填', trigger: 'blur' }
					],  
					email: [ 
						{ validator:validateEmail, trigger: 'blur' }
					] 
				},
				//编辑界面数据  User sys_user
				editForm: {
					unionid:'',displayUserid:'',userid:'',locked:'',startdate:'',nickname:'',username:'',phoneno:'',password:'',salt:'',fingerpassword1:'',fingerpassword2:'',fingerpassword3:'',fingerpassword4:'',pwdtype:'',headimgurl:'',country:'',city:'',province:'',address:'',sex:'',enddate:'',districtId:'',userid:'',userAccount:'',userPwd:'',userName:'',userDesc:'',officePhoneno:'',idCardNo:'',email:''
				},
				passwordForm:{
					newPassword:'',oldPassword:''
				}
			}
		},
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//编辑提交User sys_user父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true; 
							let params = Object.assign({}, this.editForm); 
							editUser(params).then((res) => {
								this.editLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){ 
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.editLoading = false;
							});
						});
					}
				});
			},

			doChangePassword(){
				console.log("修改密码");
				this.$refs.passwordForm.validate((valid) => {
					if (valid) {
						this.setLoading = true
						changePassword({oldPassword:md5(this.passwordForm.oldPassword),newPassword:md5(this.passwordForm.newPassword)}).then(res=>{
							var tips = res.data.tips;
							this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
						}).finally(r => this.setLoading = false)
					}
				})
			},

			showUploadHeadimg(){
				this.$refs.uploadImg.showAdd();
			}
		},
		components: {  
			SingleShearUpload
		},
		mounted() {
			console.log(this.userInfo, "this.userInfo");
			this.editForm=Object.assign(this.editForm, this.userInfo);
		}
	}

</script>

<style lang="scss" scoped>
@import './index.scss';
@import '../common.scss';
</style>