<template>
	<div class="set_container">
		<div class="set_content">
			<div class="m_msgcard">
				<el-avatar class="m_avater" :src="editForm.headimgurl || defaultImg">
				</el-avatar>
				<div class="m_msg">
					<span class="m_name">{{userInfo.username}}
					
				 	<el-tag v-if="editForm.memType==='0'" type="primary">个人账户</el-tag>
					 <el-tag type="warning" v-else-if="editForm.memType=='1'">企业管理员账户</el-tag>
					<el-tag type="warning" v-else-if="editForm.memType=='2'">企业员工账户</el-tag>
					 <el-button v-if="editForm.memType!=='0'" type="text">{{editForm.branchName}}</el-button>
					 <el-button v-if="editForm.memType==='0'" type="text"   icon="el-icon-top" @click="upgradeToBranchAccount">升级为企业账户</el-button>
					  <el-button  type="warning" @click="switchUser">切换账户</el-button>
					</span>
					<span class="m_dept">所在部门：{{userInfo.deptName}}</span>
					<el-button @click="showUploadHeadimg" class="m_btn">修改头像</el-button>
				</div>
			</div>
			<div class="m_opercard">
				<div class="m_base"  v-if="showPanel!='bindMainAccount'">
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
							<el-button type="text" @click="registerEmail" v-if="!userInfo.email">绑定邮箱</el-button>
							<el-button type="text" @click="changeEmail" v-if="userInfo.email">更换邮箱</el-button>
						</el-form-item>    
						<el-form-item> 
							<el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>   
							<el-button  @click.native="showPanel='bindMainAccount'" :loading="editLoading">绑定主账户</el-button>   
						</el-form-item> 
					</el-form>
				</div>
				<div class="m_base"  v-if="showPanel==='bindMainAccount'">
					<h3>绑定主账户</h3>
					<el-row class="padding"> 				
						<el-row  class="padding">
							<font color="blue">主账号指平台统一账户，一般同一个手机号、微信号、邮箱认为是同一个账户</font>
							<br>
							<font color="blue">绑定主账户后，可以实现微信、app、公众号、小程序等各个应用账户互通</font>
						</el-row>    
						<el-row  class="padding">
							<vue-qr
								ref="qrcode"
								:logoSrc="logoSrc"
								:text="' https://www.qingqinkj.com/miniapp?page=bindMainAccount&userid='+editForm.userid"
								:size="200"
							:loadMake="true"/>
							<br>
							<font color="blue">扫描绑定{{editForm.username}}主账号</font>
						</el-row>
						<el-row  class="padding">   
								<el-button  @click.native="showPanel='baseInfo'" :loading="editLoading">返回</el-button>   
						</el-row> 
					</el-row>
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
		
      <!--新增 Branch 管理端机构表（机构下面若干部门）界面-->
      <el-dialog
        title="新增机构"
        :visible.sync="branchAddVisible"
        width="50%"
		
		  top="20px"
        :close-on-click-modal="false"
      >
        <branch-add 
		  :branch="{id:userInfo.branchId,branchName:'',admUserid:userInfo.branchId,admUsername:userInfo.username,luserid:userInfo.userid,lusername:userInfo.username}"
		  op-type="add"
          :visible="branchAddVisible"
          @cancel="branchAddVisible=false"
          @submit="afterAddSubmit"
        ></branch-add>
      </el-dialog>
	  
        
        <el-dialog
          title="请选择一个账户进行登录"
          :visible.sync="phonenoUsersVisible"
          width="600" append-to-body> 
          <el-table :data="phonenoUsers"> 
            <el-table-column prop="displayUserid" label="登录账号">
            </el-table-column>
            <el-table-column prop="username" label="姓名">
            </el-table-column> 
            <el-table-column prop="branchName" label="企业">
            </el-table-column>
            <el-table-column  label="操作">
					<template slot-scope="scope"> 
						<el-button type="primary" @click="toLogin(scope.row)">登录</el-button> 
					</template>
            </el-table-column>
          </el-table>
        </el-dialog> 
	</div>  
</template>

<script>
import { editUser,changePassword } from '@/api/mdp/sys/user';
import { mapGetters } from 'vuex' 
import { sendEmail,validEmailCode,queryMyUsers } from '@/api/login';
import SingleShearUpload from "@/components/Image/Single/Index";
import VueQr from 'vue-qr'	
import BranchAdd from "@/views/mdp/sys/branch/BranchEdit";
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
				},
				
				branchAddVisible:false,
				valiCode:'',//验证码
				showPanel:'',//bindMainAccount
				phonenoUsers:[],
				phonenoUsersVisible:false,
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
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
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
							this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
						}).finally(r => this.setLoading = false)
					}
				})
			},

			showUploadHeadimg(){
				this.$refs.uploadImg.showAdd();
			},
			upgradeToBranchAccount(){
				//跳转到购买模块页面
				this.branchAddVisible=true;
			},
			toBranchDetail(){
				//跳转到机构明细页面
			},
			registerEmail(){
				if(this.editForm.email){
					var curlDomain=window.location.protocol+"//"+window.location.host+"/"+process.env.CONTEXT+"/"+process.env.VERSION;  
					sendEmail({codeScene:'1',codeEmail:this.editForm.email,userType:'staff',callbackUri:curlDomain+'/#/updateUserInfo'}).then(res=>{
						var tips = res.data.tips;
						if(tips.isOk){
							this.$message({ message: "邮件已发送，请到收件箱收取邮件，并点击其链接进行自动验证。", type: 'success' }); 
						}else{
							this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
						}
						
					})
				}
			},
			changeEmail(){
				if(this.editForm.email){
					
					var curlDomain=window.location.protocol+"//"+window.location.host+"/"+process.env.CONTEXT+"/"+process.env.VERSION;  
					sendEmail({codeScene:'2',codeEmail:this.editForm.email,userType:'staff',callbackUri:curlDomain+'/#/changeEmailStepOne'}).then(res=>{
						var tips = res.data.tips;
						if(tips.isOk){
							this.$message({ message: "邮件已发送，请到收件箱收取邮件，并点击其链接进行验证原邮箱。", type: 'success' }); 
						}else{
							this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
						}
					})
				}
			},
			validEmailCode(){ 
				validEmailCode({valiCode:this.valiCode,userType:'staff'}).then(res=>{
					var tips = res.data.tips;
					this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				}) 
			},
			switchUser(){   
				queryMyUsers().then(res0=>{  
					if(res0.data.tips.isOk){
						this.phonenoUsers=res0.data.data; 
						if(res0.data.data.length<=1){
							this.$message.warning("当前没有关联的账户，无须切换");
						}else{
							this.phonenoUsersVisible=true;
						}
					}else{
						this.$message.error(res0.data.tips.msg);
					}
				})
			},
			toLogin(user) {
				 this.$prompt('请输入密码', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',  
					}).then(({ value }) => {
						 let params={ 
							password:md5(value),  
							userloginid:user.userid,
							authType:'password_display_userid' ,
							grantType:"password"
						} 
						this.$store.dispatch("LoginByUserloginid",params).then(res => {
							this.phonenoUsersVisible=false;
							if(res.data.tips.isOk==true){ 
								this.$store.dispatch('GetUserInfo').then((res2)=>{  
									this.$router.push({ path: '/' });
								}).catch(err=>{
 									 
								}); 
							}else{
								this.$message.error(res.data.tips.msg);
							} 
						}).catch((e) => {
							 
						})
					}).catch(() => {
						  this.phonenoUsersVisible=false;
					});  	 
			},
		},
		components: {  
			SingleShearUpload,VueQr,BranchAdd
		},
		mounted() { 
			this.editForm=Object.assign(this.editForm, this.userInfo); 
			var valiCode=this.$route.query.valiCode;
			//var valiCode=util.getQueryStringByName('valiCode'); 
			if(valiCode){
				this.valiCode=valiCode;
				this.validEmailCode();
			}
		}
	}

</script>

<style lang="scss" scoped>
@import './index.scss';
@import '../common.scss';
</style>