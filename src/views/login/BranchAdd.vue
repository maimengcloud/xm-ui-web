<template>
	<section>
		<el-row  class="app-container">
				<el-row class="app-container">
					<el-tag type="warning">您不在任何一个公司或者部门中，您可以 创建新公司 或者 申请加入已有公司</el-tag>
				</el-row>
			 	<el-row class="app-container">
					<el-radio v-model="addOrJoinBranch" label="add" >创建新公司</el-radio><el-radio v-model="addOrJoinBranch" label="join" >申请加入已有公司</el-radio>
				</el-row>
			<!--新增界面 Branch 管理端机构表（机构下面若干部门）-->
			<el-form :model="addForm" v-show="addOrJoinBranch=='add'" label-width="100px" :rules="addFormRules" ref="addForm">
				<el-form-item label="公司名称" prop="branchName">
					<el-input v-model="addForm.branchName" auto-complete="off">
						<el-button slot="append" round type="primary" plain @click="checkBranchExists">查询机构是否存在</el-button>
					</el-input>
				</el-form-item>
				<el-form-item label="行业分类" prop="industryCategory">
					  <el-select
					    v-model="addForm.industryCategory"
					    filterable
					    allow-create
					    default-first-option
					    placeholder="请选择行业，如果没有合适的可以自己添加">
					    <el-option
					      v-for="item in options.industryCategory"
					      :key="item.optionValue"
					      :label="item.optionName"
					      :value="item.optionValue">
					    </el-option>
					  </el-select>
				</el-form-item>
				<el-form-item label="联系人姓名" prop="cusername">
					<el-input v-model="addForm.cusername" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="phoneNo">
					<el-input v-model="addForm.phoneNo" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮件" prop="emaill">
					<el-input v-model="addForm.emaill" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
						<el-button @click.native="handleCancel">取消</el-button>
						<el-button v-loading="load.add" type="primary" round @click.native="addSubmit" >创建新公司</el-button>
				</el-form-item>
			</el-form>
			 <!--新增界面 Branch 管理端机构表（机构下面若干部门）-->
			<el-form :model="joinForm" v-show="addOrJoinBranch=='join'" label-width="100px" :rules="joinFormRules" ref="joinForm">

				<el-form-item label="公司查询" prop="joinBranchId">
					<el-select
						v-model="joinForm.joinBranchId"
						filterable
						remote
						clearable
						placeholder="请输入2个关键词查询"
						:remote-method="searchBranchs"
						value-key="id"
						:loading="load.list">
						<el-option
						v-for="item in branchs"
						:key="item.id"
						:label="item.branchName"
						:value="item.id">
						</el-option>
					</el-select>
					<el-tag>选择已有公司-申请加入</el-tag>
				</el-form-item>
				<el-form-item label="加入理由" prop="joinReason">
					<el-input type="textarea" rows="4" v-model="joinForm.joinReason" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系人姓名" prop="joinUsername" >
					<el-input v-model="joinForm.joinUsername" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="joinUserPhoneno" >
					<el-input v-model="joinForm.joinUserPhoneno" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item>
						<el-button @click.native="handleCancel">取消</el-button>
						<el-button v-loading="load.add" type="warning"  round  @click.native="joinBranch" >加入公司</el-button>
				</el-form-item>
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/itemOption';//下拉框数据查询
	import { addBranchNoAuth,listBranchNoAuth,addUserJoinBranchRequire } from '@/api/branch';
	import { mapGetters } from 'vuex'

	export default {
		props:['branch','visible'],
		watch: {
	      'branch':function( branch ) {
	        this.addForm = branch;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      }
	    },
		data() {

			const validateBranchName = (rule, value, callback) => {
				if( !value || value.length<=6){
				callback(new Error('请输入6位以上公司名称'))
				}else{
				callback()
				}
			}
			const validatePhoneNo = (rule, value, callback) => {
				if( !value || value.length !=11 ){
					callback(new Error('手机号码必须为11位号码'))
				}else{
					callback()
				}
			}
			const validateCusername = (rule, value, callback) => {
				if( !value || value.length <2 ){
					callback(new Error('请输入联系人名称'))
				}else{
					callback()
				}
			}
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					branchName: [{ required: true, trigger: 'blur', validator: validateBranchName }],
					cusername: [{ required: true, trigger: 'blur', validator: validateCusername }],
					phoneNo: [{ required: true, trigger: 'blur', validator: validatePhoneNo }],
				},
				//新增界面数据 管理端机构表（机构下面若干部门）
				addForm: {
					id:'',branchName:'',enabled:'',industryCategory:'',cuserid:'',cdate:'',cusername:'',phoneNo:'',emaill:''
				},
				joinFormRules: {
					//branchName: [{ required: true, trigger: 'blur', validator: validateBranchName }],
					joinUsername: [{ required: true, trigger: 'blur', validator: validateCusername }],
					joinUserPhoneno: [{ required: true, trigger: 'blur', validator: validatePhoneNo }],
					joinBranchId:[{ required: true, message: '要加入的公司不能为空', trigger: 'blur' }],
					joinReason:[{ required: true, message: '加入理由不能为空', trigger: 'blur' }],
				},
				//新增界面数据 管理端机构表（机构下面若干部门）
				joinForm: {
					id:'',joinBranchId:'',joinUserPhoneno:'',joinUserid:'',joinUsername:'',joinDeptid:'',joinReason:''
				},
  				branchs:[],
				addOrJoinBranch:'join'
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交Branch 管理端机构表（机构下面若干部门） 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {

				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							if(this.addForm.branchName.length>=6){
								var params={
									key:"%"+this.addForm.branchName+"%"
								}
								listBranchNoAuth(params).then(res=>{
									if(res.data.tips.isOk){
										if(res.data.data.length<=0){
											this.load.add=true
											let params = Object.assign({}, this.addForm);
 											params.cuserid=this.userInfo.userid
											addBranchNoAuth(params).then((res) => {
												this.load.add=false
												var tips=res.data.tips;
												if(tips.isOk){
													this.$emit('submit',res.data.data );//  @submit="afterAddSubmit"
												}
												this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
											}).catch(() => this.load.add=false);
										}else{
											this.$notify({position:'bottom-left',showClose:true,message: "该公司名已注册，不可以使用", type: 'error' });
											return;
										}
									}
								})
							}else{
								this.$notify({position:'bottom-left',showClose:true,message: "公司名必须6个字以上", type: 'error' });
								return;
							}

						});
					}
				});
			},

			searchBranchs:function(query){
				this.load.list=true;
				if(query.length>=2){
					var params={
						key:"%"+query+"%"
					}
					listBranchNoAuth(params).then(res=>{
						this.load.list=false;
						if(res.data.tips.isOk){
							if(res.data.data.length>=0){
								this.branchs=res.data.data;
								return;
							}else{
								this.branchs=[]
								return;
							}
						}
					})
				}else{
					this.load.list=false;
					this.$notify({position:'bottom-left',showClose:true,message: "最少输入两个字", type: 'info' });
					return;
				}
			},
			joinBranch:function(){
				this.$refs.joinForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							 var params= this.joinForm
							addUserJoinBranchRequire(params).then(res=>{
								var tips = res.data.tips;
								if(tips.isOk){
									this.$notify({position:'bottom-left',showClose:true,message:tips.msg, type: 'success' });
									//this.$emit('submit',res.data.data );//  @submit="afterAddSubmit"
									return;
								}else{
									this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
									return;
								}
							})
						});
					}
				});
			},
			checkBranchExists:function(){
				if(this.addForm.branchName.length>=2){
					var params={
						key:"%"+this.addForm.branchName+"%"
					}
					listBranchNoAuth(params).then(res=>{
						if(res.data.tips.isOk){
							if(res.data.data.length<=0){
								this.$notify({position:'bottom-left',showClose:true,message: "该公司名未注册，可以使用", type: 'success' });
								return;
							}else{
								this.$notify({position:'bottom-left',showClose:true,message: "该公司名已注册，不可以使用", type: 'error' });
								return;
							}
						}
					})
				}else{
					this.$notify({position:'bottom-left',showClose:true,message: "最少输入两个字", type: 'error' });
					return;
				}
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/

			/**end 在上面加自定义方法**/

		},//end method
		components: {
		    //在下面添加其它组件 'branch-edit':BranchEdit
		},
	  computed: {
		    ...mapGetters([
		      'myBranchs','myDepts','userInfo'
		    ])
		  },
		mounted() {
			this.addForm=Object.assign(this.addForm, this.branch);
			this.addForm.cusername=this.userInfo.username
			this.addForm.phoneNo=this.userInfo.phoneno;
			this.addForm.cuserid=this.userInfo.userid;
			this.addForm.emaill=this.userInfo.email;
			this.joinForm.joinUsername=this.userInfo.username
			this.joinForm.joinReason="员工申请加入公司";
			this.joinForm.joinUserid=this.userInfo.userid;
			this.joinForm.joinUserPhoneno=this.userInfo.phoneno;
			this.load.list=true
			listOption([{categoryId:'all',itemCode:'industryCategory'}]).then(res=>{
				this.load.list=false
				this.options=res.data.data
			}).catch(()=>this.load.list=false);
		}//end mounted
	}

</script>

<style scoped>

</style>
