<template>
	<section>
	
		<!--工具条1-->  
		<!--如果有更多工具条,放开此注释
		<el-col :span="24" class="toolbar"  style="padding-bottom: 0px;">
			<el-col :span="4">
			</el-col>
		</el-col>
		-->
		 
		<!--编辑界面 User sys_user--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="用户名称" prop="username">
					<el-input v-model="editForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="editForm.nickname" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="登录账号" prop="displayUserid">
					<el-input v-model="editForm.displayUserid" auto-complete="off"></el-input>
				</el-form-item>  
				
				<el-form-item label="性别" prop="sex"> 
					<el-radio-group v-model="editForm.sex" >
				      <el-radio v-model="editForm.sex" label="0" border>男</el-radio>
				      <el-radio v-model="editForm.sex" label="1" border>女</el-radio>
				      <el-radio v-model="editForm.sex" label="2" border>其它</el-radio>
				    </el-radio-group>
				</el-form-item> 
				<el-form-item label="锁定" prop="locked"> 
					<el-radio-group v-model="editForm.locked" >
				     <el-radio v-model="editForm.locked" label="0" border>正常</el-radio>
				      <el-radio v-model="editForm.locked" label="1" border>已锁定</el-radio>
				    </el-radio-group>
				</el-form-item> 
				<el-form-item label="有效日期" prop="startdate">
					<el-date-picker type="date" placeholder="选择开始日期" v-model="editForm.startdate" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>到<el-date-picker type="date" placeholder="选择结束日期" v-model="editForm.enddate" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item> 
				 
				<el-form-item label="身份证号码" prop="idCardNo">
					<el-input v-model="editForm.idCardNo" auto-complete="off"></el-input>
				</el-form-item> 
				 
				<el-form-item label="手机号码" prop="phoneno">
					<el-input v-model="editForm.phoneno" auto-complete="off"></el-input>
				</el-form-item> 
				
				<el-form-item label="办公号码" prop="officePhoneno">
					<el-input v-model="editForm.officePhoneno" auto-complete="off"></el-input>
				</el-form-item> 
				
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="" prop="country">
					<el-breadcrumb separator="/">
					  <el-breadcrumb-item>国家</el-breadcrumb-item>
					  <el-breadcrumb-item>省</el-breadcrumb-item>
					  <el-breadcrumb-item>市</el-breadcrumb-item>
					  <el-breadcrumb-item>区县</el-breadcrumb-item> 
					</el-breadcrumb>
				</el-form-item>   
				<el-form-item label="详细地址" prop="country">
					 <el-input v-model="editForm.address" auto-complete="off"></el-input> 
				</el-form-item>
				<el-form-item>
					<el-col :span="24" >
						<el-col :span="4" :offset="16"> 
							<el-button @click.native="handleCancel">取消</el-button> 
						</el-col>
						<el-col :span="4"> 
							<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>  
						</el-col>
					</el-col> 
				</el-form-item> 
			</el-form>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	import { editUser } from '../../../../api/mdp/sys/user';
	import { mapGetters } from 'vuex' 
	
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
				if (!value) {
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
				if (!value) {
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
				options:{},//下拉选择框的所有静态数据
				editLoading: false,
				editFormRules: {
					displayUserid: [
						{ required: true, message: '账号必填', trigger: 'blur' }
					],
					username: [
						{ required: true, message: '用户名称必填', trigger: 'blur' }
					],
					nickname: [
						{ required: true, message: '昵称必填', trigger: 'blur' }
					],
					phoneno: [ 
						{ validator:validatePhoneno, trigger: 'blur' }
					]  , 
					email: [ 
						{ validator:validateEmail, trigger: 'blur' }
					] ,
					idCardNo: [ 
						{ validator:validateIdCardNo, trigger: 'blur' }
					] 
				},
				//编辑界面数据  User sys_user
				editForm: {
					unionid:'',displayUserid:'',userid:'',locked:'',startdate:'',nickname:'',username:'',phoneno:'',password:'',salt:'',fingerpassword1:'',fingerpassword2:'',fingerpassword3:'',fingerpassword4:'',pwdtype:'',headimgurl:'',country:'',city:'',province:'',address:'',sex:'',enddate:'',districtId:'',userid:'',userAccount:'',userPwd:'',userName:'',userDesc:'',officePhoneno:'',idCardNo:'',email:''
				},
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
									this.$refs['editForm'].resetFields();
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
		},
		components: {  
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.user);
		}
	}

</script>

<style scoped>

</style>