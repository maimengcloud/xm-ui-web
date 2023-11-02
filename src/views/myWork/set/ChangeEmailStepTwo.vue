<template>
	<section>
		<el-row class="padding" style="width:700px;">
			<el-form :model="editForm"  label-width="120px"   ref="editForm">
				<el-form-item label="更换常用邮箱">
					<el-steps :active="3" finish-status="success">
						<el-step title="1 验证原邮箱"></el-step>
						<el-step title="2 验证新邮箱"></el-step>
						<el-step title="3 更换成功"></el-step>
					</el-steps>
				</el-form-item>
				<el-form-item>
						<el-button type="primary" @click.native="doLogin" :loading="editLoading">登录</el-button>
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
			validEmailCode(){
				validEmailCode({valiCode:this.valiCode,userType:'staff'}).then(res=>{
					var tips = res.data.tips;
					this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
				})
			},
			doLogin(){
				this.$router.push({path: '/login' });
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
