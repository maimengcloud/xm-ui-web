<template>
	<section>
		<el-row>
			<el-col :span="12"> 
				<el-form label-position="top" label-width="150">
					<el-form-item label="邀请方式"> 
						<el-row> 
								<div class="img-box" @click="setInviteType('email')">
									<img class="img-item"  v-if="inviteType!=='email'" src="@/assets/image/sys/invite/email-0.png" />
									<img class="img-item"  v-if="inviteType==='email'" src="@/assets/image/sys/invite/email-1.png" />
									<p class="img-text">邮箱邀请</p>
								</div> 
								<div class="img-box"  @click="setInviteType('phone')">
									<img class="img-item" v-if="inviteType!=='phone'" src="@/assets/image/sys/invite/phone-0.png"/> 
									<img class="img-item" v-else-if="inviteType==='phone'" src="@/assets/image/sys/invite/phone-1.png"/> 
									<p class="img-text">手机邀请</p>
								</div>
								<div class="img-box"  @click="setInviteType('ewCode')">
									<img class="img-item" v-if="inviteType!=='ewCode'" src="@/assets/image/sys/invite/ew-code-0.png"/> 
									<img class="img-item" v-else-if="inviteType==='ewCode'" src="@/assets/image/sys/invite/ew-code-1.png"/> 
									<p class="img-text">二维码邀请</p>
								</div>	 
						</el-row>
					</el-form-item>
				</el-form>
				
			</el-col>
			<el-col :span="12">
				<el-form v-model="addForm" :rules="addFormRules" label-position="top">
					<el-form-item label="邮箱" v-if="inviteType==='email'" prop="emails">
						<el-input type="textarea" :rows="6" v-model="addForm.emails" placeholder="支持多邮箱，邮箱之间用逗号,分割"> 
						</el-input>
					</el-form-item>
					<el-form-item label="手机号码" v-if="inviteType==='phone'" prop="phonenos">
						<el-input type="textarea" :rows="6" v-model="addForm.phonenos" placeholder="支持多号码，号码之间用逗号,分割"> 
						</el-input>
					</el-form-item>
					<el-form-item label="二维码" v-if="inviteType==='ewCode'">
						<div style="text-align:center;">
							<div class="ew-code">  
								<vue-qr
									class="ew-code-img"
									ref="qrcode"
									:logoSrc="logoSrc"
									:text="getEwCodeCallbackUri()"
									:size="200"
								:loadMake="true"/>
								<div class="ew-code-footer"></div>
							</div>
							<p>微信扫一扫 加入【{{userInfo.branchName}}】</p>
						</div>
					</el-form-item>
					<el-form-item>
						<el-col :span="24" > 
							<el-col :span="4"> 
								<el-button type="primary" @click.native="addSubmit" :loading="load.add" v-if="inviteType!=='ewCode'">提交</el-button>  
							</el-col>
						</el-col> 
					</el-form-item> 
				</el-form>
			</el-col>
		</el-row>
	</section>
</template>

<script>
import util from '../../../../common/js/util';//全局公共库
import { addUser,inviteUsersByEmails,inviteUsersByPhonenos } from '../../../../api/mdp/sys/user';
import { mapGetters } from 'vuex'   
import md5 from 'js-md5';  
import VueQr from 'vue-qr'	
import logoSrc from "@/assets/image/logo_cicle.png"

	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ]),

		},
		props:['user','dept'],
		watch: {
	      'user':function(data) {
			  if(data){
				   Object.assign(this.editForm,data)
			  }
	       
	      },
	    },	
		data() { 
			var validatePhoneno = (rule, value, callback) => {
				if (!value) {
				//callback(new Error('请输入密码'));
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
				//callback(nPhonenoew Error('请输入密码'));
					callback();
				} else {
				if (value) {
					var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
					if(!reg.test(value)){
						 callback(new Error('邮箱格式不正确'));
					}  
				}
				callback();
				}
			}; 
			return {
				options:{},//下拉选择框的所有静态数据
				load:{add: false},
				addFormRules: { 
					 
				},
				//新增界面数据 sys_user
				addForm: {
					phonenos:'',emails:''
				},
				/**begin 在下面加自定义变量**/
				deptTree:{//部门树相关参数设置
					expandOnClickNode:false, //单击是否展开/收缩
					indent:8,//缩进
					refreshTree:false//是否刷新
				},
				userDept:null,//{userid,deptid,branchId}
				inviteType:'email',//email|phone|ewCode
				logoSrc:logoSrc,
				/**end 在上面加自定义变量**/
			}//end return
		},//end data
		methods: {
			getEwCodeCallbackUri(){ 
				//var ewCodeCallbackUri=window.location.protocol+"//"+window.location.host; 
				var ewCodeCallbackUri=window.location.protocol+"//"+window.location.host;
				ewCodeCallbackUri=ewCodeCallbackUri+"/xm/"+process.env.VERSION+"/#/login?branchId="+this.userInfo.branchId 
				return ewCodeCallbackUri;
			},
			setInviteType(inviteType){
				this.inviteType=inviteType
			},
			clear(){

			},
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交User sys_user 父组件监听@submit="afterAddSubmit"
			addSubmit: function () { 
				var func=inviteUsersByEmails
				var params={}
				if(this.inviteType==='phone'){
					if(!this.addForm.phonenos){
						this.$notify({ message:"请输入手机号码列表", type: 'error' }); 
						return;
					}
					this.addForm.phonenos=this.addForm.phonenos.replace("，",",");
					func = inviteUsersByPhonenos
					params.phonenos=this.addForm.phonenos.split(",")
				}
				
				if(this.inviteType==='email'){
					if(!this.addForm.emails){
						this.$notify({ message:"请输入邮箱号码列表", type: 'error' }); 
						return;
					} 
					params.emails=this.addForm.emails.split(",")
					var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
					params.callbackUri=curlDomain+"/xm/"+process.env.VERSION+"/"
				}
				this.load.add=true;
				func(params).then(res=>{
					this.load.add=false;
					var tips = res.data.tips;
					if(tips.isOk){
						this.$notify({ message:tips.msg, type: 'success' }); 
					}else{
						this.$notify({ message:tips.msg, type: 'error' }); 
					}
				}).catch(e=>this.load.add=false)

			},
			/**begin 在下面加自定义方法**/
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {   
			VueQr
		},
		mounted() {
			this.addForm.deptid=this.userInfo.deptid; 
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>
	.img-box{  
		margin: 2px;
		float:left;
		width: 164px;
		height: 180px;
		background-color: aliceblue;
		text-align: center; 
		cursor: pointer;
		padding: 40px;
	}
	.img-text{
		text-align: center;
	}
	.img-item{
		object-fit:scale-down;
		height: 50px;
		max-width: 80px;
		background-position: 50%;
	}


.ew-code {
  position: relative; 
  display: inline-block;
  height: 200px;
  width: 200px; 
  padding: 20px;
  border: 1px solid rgba(19, 16, 229, 0.17);  
}
.ew-code::before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  width: 40px;
  height: 40px;
  border-top: 7px solid rgba(71, 121, 246, 1);
  border-left: 7px solid rgba(71, 121, 246, 1);
}
.ew-code-img{  
	object-fit: scale-down;
	height: 100%;
	background-position: 50%;
}
.ew-code::after {
  position: absolute;
  top: 0;
  right: 0;
  content: "";
  width: 40px;
  height: 40px;
  border-top: 7px solid rgba(71, 121, 246, 1);
  border-right: 7px solid rgba(71, 121, 246, 1);
}
.ew-code .ew-code-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
.ew-code .ew-code-footer::before {
  position: absolute;
  bottom: 0;
  left: 0;
  content: "";
  width: 40px;
  height: 40px;
  border-bottom: 7px solid rgba(71, 121, 246, 1);
  border-left: 7px solid rgba(71, 121, 246, 1);
}
.ew-code .ew-code-footer::after {
  position: absolute;
  bottom: 0;
  right: 0;
  content: "";
  width: 40px;
  height: 40px;
  border-bottom: 7px solid rgba(71, 121, 246, 1);
  border-right: 7px solid rgba(71, 121, 246, 1);
  }
</style>