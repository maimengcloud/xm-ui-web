<template>
	<section>
		<el-row class="padding" style="width:700px;">
			<el-form :model="editForm"  label-width="120px"   ref="editForm">
				<el-form-item label="更换步骤">
					<el-steps :active="2" finish-status="success">
						<el-step title="1 验证原邮箱"></el-step>
						<el-step title="2 验证新邮箱"></el-step>
						<el-step title="3 更换成功"></el-step>
					</el-steps>
				</el-form-item>
				<el-form-item label="新邮箱" prop="email" :rules="[{required:true,message:'新邮箱不能为空'}]">
					<el-input style="width:400px;" v-model="editForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
						<el-button type="text" @click.native="doLogin" :loading="editLoading">登录</el-button>     <el-button type="primary" @click.native="doChangeEmail" :loading="editLoading">提交</el-button>
				</el-form-item>
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import { sendEmail,validEmailCode } from '@/api/login';
	import { mapGetters } from 'vuex'
	import logo1 from "@/assets/image/logo1.png"
	import VueQr from 'vue-qr'
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
	      },

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
  				options:{},//下拉选择框的所有静态数据
				editLoading: false,
				editFormRules: {
					email: [
						{ validator:validateEmail, trigger: 'blur' }
					]
				},
				editForm:{
					email:''
				},
				valiCode:'',//验证码
			}
		},
		methods: {

			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			doChangeEmail(){
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						 this.changeEmail();
					}
				})

			},

			changeEmail(){
				if(this.editForm.email){
					var curlDomain=window.location.protocol+"//"+window.location.host+"/"+process.env.CONTEXT+"/"+process.env.VERSION;
					sendEmail({codeScene:'3',codeEmail:this.editForm.email,userType:'staff',callbackUri:curlDomain+'/#/changeEmailStepTwo'}).then(res=>{
						var tips = res.data.tips;
						if(tips.isOk){
							this.$notify({ message: "邮件已发送，请到收件箱收取邮件，并点击其链接进行验证新邮箱。", type: 'success' });
						}else{
							this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
						}
					})
				}
			},
			validEmailCode(){
				validEmailCode({valiCode:this.valiCode,userType:'staff'}).then(res=>{
					var tips = res.data.tips;
					this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
				})
			},
			doLogin(){
				this.$router.push({path: '/login' })
			}
		},
		components: {
			VueQr
		},
		mounted() {
			var valiCode=this.$route.query.valiCode;
			//var valiCode=util.getQueryStringByName('valiCode');
			if(valiCode){
				this.valiCode=valiCode;
				this.validEmailCode();
			}
		}
	}

</script>

<style scoped>
</style>
