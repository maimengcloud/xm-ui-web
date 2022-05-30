<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 UserLoginRecord 用户登录信息登记--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="用户编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="用户编号" :maxlength="64"></el-input>
				</el-form-item> 
				<el-form-item label="商户编号" prop="shopId">
					<el-input v-model="editForm.shopId" placeholder="商户编号" :maxlength="64"></el-input>
				</el-form-item> 
				<el-form-item label="门店编号" prop="locationId">
					<el-input v-model="editForm.locationId" placeholder="门店编号" :maxlength="64"></el-input>
				</el-form-item> 
				<el-form-item label="登录的商户编号" prop="loginShopid">
					<el-input v-model="editForm.loginShopid" placeholder="登录的商户编号" :maxlength="64"></el-input>
				</el-form-item> 
				<el-form-item label="登录的门店编号" prop="loginLocationid">
					<el-input v-model="editForm.loginLocationid" placeholder="登录的门店编号" :maxlength="64"></el-input>
				</el-form-item> 
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构编号" :maxlength="64"></el-input>
				</el-form-item> 
				<el-form-item label="登录方式" prop="loginType">
					<el-input v-model="editForm.loginType" placeholder="1-微信扫门店二维码，2-点击小程序登录，3-账户密码登录，4-手机号码登录" :maxlength="1"></el-input>
				</el-form-item> 
				<el-form-item label="登录时间" prop="loginTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.loginTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="登录机构号" prop="loginBranchId">
					<el-input v-model="editForm.loginBranchId" placeholder="登录机构号" :maxlength="64"></el-input>
				</el-form-item> 
				<el-form-item label="登录用户名" prop="username">
					<el-input v-model="editForm.username" placeholder="登录用户名" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="授权码" prop="authId">
					<el-input v-model="editForm.authId" placeholder="授权码" :maxlength="64"></el-input>
				</el-form-item> 
				<el-form-item label="mdp平台appid" prop="mdpAppid">
					<el-input v-model="editForm.mdpAppid" placeholder="mdp平台appid" :maxlength="64"></el-input>
				</el-form-item> 
				<el-form-item label="批处理编号" prop="lockNo">
					<el-input v-model="editForm.lockNo" placeholder="批处理编号" :maxlength="64"></el-input>
				</el-form-item>   
				<el-form-item label="登录手机号" prop="phoneno">
					<el-input v-model="editForm.phoneno" placeholder="登录手机号" :maxlength="64"></el-input>
				</el-form-item> 
				<el-form-item label="登录ip" prop="loginIp">
					<el-input v-model="editForm.loginIp" placeholder="登录ip" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="用户类型" prop="userType">
					<el-input v-model="editForm.userType" placeholder="mem-会员端用户，adm-管理端用户" :maxlength="10"></el-input>
				</el-form-item> 
				 
				<el-form-item label="请求特征码" prop="userAgent">
					<el-input v-model="editForm.userAgent" placeholder="请求特征码" :maxlength="800"></el-input>
				</el-form-item>    
				<el-form-item label="经度" prop="longitude">
					<el-input v-model="editForm.longitude" placeholder="经度" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="纬度" prop="latitude">
					<el-input v-model="editForm.latitude" placeholder="纬度" :maxlength="10"></el-input>
				</el-form-item>  
				<el-form-item label="用户类型" prop="memType">
					<el-input v-model="editForm.memType" placeholder="用户类型" :maxlength="1"></el-input>
				</el-form-item> 
				<el-form-item label="登录状态" prop="loginStatus">
					<el-input v-model="editForm.loginStatus" placeholder="1-登录成功，0-登录失败" :maxlength="1"></el-input>
				</el-form-item> 
				<el-form-item label="登录说明" prop="loginMsg">
					<el-input v-model="editForm.loginMsg" placeholder="登录成功或者失败的说明" :maxlength="255"></el-input>
				</el-form-item>  
			</el-form>
		</el-row>

		<el-row   class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, addUserLoginRecord,editUserLoginRecord } from '@/api/mdp/sys/userLoginRecord';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'userLoginRecordEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['userLoginRecord','visible','opType'],

		watch: {
	      'userLoginRecord':function( userLoginRecord ) {
	        if(userLoginRecord){
	            this.editForm = {...userLoginRecord};
	        }

	      },
	      'visible':function(visible) { 
	      	if(visible==true){
 	      		this.initData()
	      	}
	      } 
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					userid:'',shopId:'',locationId:'',loginShopid:'',loginLocationid:'',branchId:'',loginType:'',loginTime:'',loginBranchId:'',username:'',authId:'',mdpAppid:'',lockNo:'',lockStatus:'',lockTime:'',phoneno:'',loginIp:'',userType:'',loginDeviceId:'',loginDeviceSn:'',userAgent:'',reqNo:'',deviceType:'',os:'',osVersion:'',osName:'',renderingEngine:'',deviceManufacturer:'',browerGroup:'',borderName:'',borderVersion:'',id:'',longitude:'',latitude:'',regionId:'',regionName:'',formatAddress:'',districtId:'',memType:'',loginStatus:'',loginMsg:'',authType:'',grantType:''
				},
                maxTableHeight:300,
			}//end return
		},//end data
		methods: {

		    ...util,

			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交UserLoginRecord 用户登录信息登记父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addUserLoginRecord
							if(this.currOpType=='edit'){
							    func=editUserLoginRecord
							}
							func(params).then((res) => {
                                this.load.edit=false
                                var tips=res.data.tips;
                                if(tips.isOk){
                                    this.editForm=res.data.data
                                    this.initData()
                                    this.currOpType="edit";
                                    this.$emit('submit');//  @submit="afterAddSubmit"
                                }
                                this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                            }).catch( err =>this.load.edit=false);
						});
					}else{
					    this.$notify({ showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.userLoginRecord){
                    this.editForm = Object.assign({},this.userLoginRecord);
                }

                if(this.opType=='edit'){

                }else{

                }
            },

		},//end method
		mounted() {
		    this.$nextTick(() => {
                initDicts(this);
                this.initData()
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
            });
		}
	}

</script>

<style scoped>

</style>