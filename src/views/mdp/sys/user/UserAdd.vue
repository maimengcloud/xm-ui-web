<template>
	<section>
		<el-row>
			<el-col :span="6" style=" overflow-x:auto; height:600px;"> 
				<dept-tree  :expand-on-click-node="false" show-checkbox ref="nodeTree"></dept-tree>     
			</el-col>
		 	<el-col :span="18">
		<!--新增界面 User sys_user--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="用户名称" prop="username">
					<el-input v-model="addForm.username" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="登录账号" prop="displayUserid">
					<el-input v-model="addForm.displayUserid" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="登录密码" prop="password">
					<el-input v-model="addForm.password" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex"> 
					<el-radio-group v-model="addForm.sex" >
				      <el-radio v-model="addForm.sex" label="0" border>男</el-radio>
				      <el-radio v-model="addForm.sex" label="1" border>女</el-radio>
				      <el-radio v-model="addForm.sex" label="2" border>其它</el-radio>
				    </el-radio-group>
				</el-form-item>  
				<el-form-item label="有效日期" prop="startdate">
					<el-date-picker type="date" placeholder="选择开始日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" v-model="addForm.startdate"></el-date-picker>到<el-date-picker  format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择结束日期" v-model="addForm.enddate"></el-date-picker>
				</el-form-item>  
				 
				<el-form-item label="手机号码" prop="phoneno">
					<el-input v-model="addForm.phoneno" auto-complete="off"></el-input>
				</el-form-item>  
				
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email" auto-complete="off"></el-input>
				</el-form-item>  
				<el-form-item>
					<el-col :span="24" >
						<el-col :span="4" :offset="16"> 
							<el-button @click.native="handleCancel">取消</el-button> 
						</el-col>
						<el-col :span="4"> 
							<el-button type="primary" @click.native="addSubmit" :loading="load.add">提交</el-button>  
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
	import { addUser } from '../../../../api/mdp/sys/user';
    import DeptTree from '../dept/DeptTree.vue';
	import { mapGetters } from 'vuex'   
	import md5 from 'js-md5';
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
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
			var validatePass = (rule, value, callback) => {
				if (!value) {
				callback(new Error('请输入密码'));
				} else {
				if (this.addForm.password !== '') {
					if(this.addForm.password.length<6){
						callback(new Error('密码必须6位以上'));
					}
				}
				callback();
				}
			};
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
			
			var validateIdCardNo = (rule, value, callback) => {
				if (!value) {
				//callback(nPhonenoew Error('请输入密码'));
					callback();
				} else {
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
				load:{add: false},
				addFormRules: { 
					displayUserid: [
						{ required: true, message: '账号必填', trigger: 'blur' }
					],
					username: [
						{ required: true, message: '用户名称必填', trigger: 'blur' }
					],
					nickname: [
						{ required: true, message: '昵称必填', trigger: 'blur' }
					] ,
					password: [
						{ required: true, message: '密码必填', trigger: 'blur' },
						{ validator:validatePass, trigger: 'blur' }
					]  ,
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
				//新增界面数据 sys_user
				addForm: {
					unionid:'',displayUserid:'',userid:'',locked:'',startdate:'',nickname:'',username:'',phoneno:'',password:'',salt:'',fingerpassword1:'',fingerpassword2:'',fingerpassword3:'',fingerpassword4:'',pwdtype:'',headimgurl:'',country:'',city:'',province:'',address:'',sex:'',enddate:'',districtId:'',userid:'',userAccount:'',userPwd:'',userName:'',userDesc:'',officePhoneno:'',idCardNo:''
				},
				/**begin 在下面加自定义变量**/
				deptTree:{//部门树相关参数设置
					expandOnClickNode:false, //单击是否展开/收缩
					indent:8,//缩进
					refreshTree:false//是否刷新
				},
				userDept:null,//{userid,deptid,branchId}
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
			/**begin 在下面加自定义方法**/
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'user-edit':UserEdit
		    'dept-tree': DeptTree
		},
		mounted() {
			this.addForm.deptid=this.userInfo.deptid;
			this.$refs.nodeTree.$refs.deptTree.setCheckedKeys([this.userInfo.deptid]);
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>