<template>
	<div class="container" v-loading="loading">
		<div class="context">
			<el-button round class="btn" @click="changeWithoutOrganVisiableMethod">第一步：创建机构</el-button><br />
			<el-button round class="btn" @click="changeShopVisiableMethod">第二步：创建商户</el-button><br />
			<el-button round class="btn" @click="shopAppShopConfigVisible">第三步：配置费率</el-button><br />
			<!-- <el-button round style="font-size:26px;color:#ffa81e;border-color:#ffa81e;margin-top:40px;" @click="setOrganPayMessageMethod">第二步：设置机构支付信息</el-button><br /> -->
			<!-- <el-button round style="font-size:26px;color:#ffa81e;border-color:#ffa81e" @click="changeWithoutOrganVisiableMethod">尚未创建机构</el-button><br />
			<el-button round style="font-size:26px;margin-top:40px;color:#ffa81e;border-color:#ffa81e" @click="changeAlreadyOrganVisiableMethod">已经创建机构</el-button>
		 -->
		</div>

		<el-drawer title="创建机构" :with-header="false" :visible.sync="withoutOrganVisiable" size="50%">
			<div style="color:#f40;text-align:center;font-size:25px;">成功创建机构之后，登陆的账号为<span v-if="userInputBranchId!=''">{{userInputBranchId}}</span>,登陆密码为888888</div>
			<branch-add :branch="addForm" opType="add" :visible="addFormVisible" @submit="afterAddSubmit" :fromPage="fromPage" @cancel="withoutOrganVisiable=false"
			 @getUserInputBranchId="getUserInputBranchIdMethod"></branch-add>
		</el-drawer>
		<el-drawer title="创建成功" :visible.sync="createSuccessDialogVisiable" width="70%">
			<div style="margin:0 auto;text-align:center;line-height:45px;color: #67c23a;font-size:30px">
				创建成功：<br />
				登录账号为：{{branchId}}<br />
				登录密码为：888888
			</div>
		</el-drawer>
		<!-- -->

		<el-drawer title="创建商户" :with-header="false" :visible.sync="createShopVisiable" size="70%" v-loading="createShopDialogLoading" @close="createShopDialogHandleCancelMethod">
			<el-row class="page-container padding">
				<el-col :span="6" class="page-height-85 border">
					<span style="font-weight:bold;">请选择机构与部门</span>
					<dept-tree show-root default-expand-all :expand-on-click-node="false" @node-click="handleLeftDeptNodeClick"
					 @branch-row-click="branchRowClick"></dept-tree>
				</el-col>
				<el-col :span="18" class="page-height-85 border">
					<el-form :model="createShopForm" label-width="200px">
						<el-form-item label="您选择的机构为">
							<font color="blue" v-if="createShopSelectBranch.branchName">{{createShopSelectBranch.branchName}}</font>
							<font v-else color="red">未选机构，请在左边选中一个机构</font>
						</el-form-item>
						<el-form-item label="您选择的部门为"> 
							<font color="blue" v-if="createShopSelectDept.deptName">{{createShopSelectDept.deptName}}</font>
							<font v-else color="red">未选部门，请在左边选中一个部门</font>
						</el-form-item>
						<el-form-item label="商户编号" prop="shopBrand">
							<el-input v-model="createShopForm.shopId" placeholder="请输入商户编号(数字与英文组合),不填商户编号则会自动生成"></el-input>
							<font color="blue">默认取部门编号作为商户编号，请按实际商户编号修改</font>
						</el-form-item>
						<el-form-item label="商户名称" prop="shopBrand">
							<el-input v-model="createShopForm.shopBrand" placeholder="请输入商户名称"></el-input>
							<font color="blue">默认取部门名称作为商户名称，请按实际商户名称修改</font>
						</el-form-item>
						<el-form-item label="商户介绍" prop="shopRemark">
							<el-input type="textarea" v-model="createShopForm.shopRemark" placeholder="商户介绍"></el-input>
						</el-form-item>
						<el-form-item label="商户LOGO">
							<single-shear-upload :img-width="200" :img-height="120" :show-title="true" v-model="createShopForm.shopLogo"
							 :deptid="userInfo.deptid" :branch-id="userInfo.branchId">
								<span slot="title">选择商户LOGO</span>
							</single-shear-upload>
						</el-form-item> 
					</el-form>
				</el-col>
			</el-row>
				
			<el-row class="bottom-fixed padding">
				<el-button @click.native="createShopDialogHandleCancelMethod">取消</el-button> 
				<el-button type="primary" @click.native="createShopDialogSubmitMethod">提交</el-button> 
			</el-row>
		</el-drawer>
		<!-- -->

		<el-drawer title="配置商户费率" :with-header="false" :visible.sync="appShopConfigVisible" size="70%"   @close="appShopConfigVisible=false">
			 <app-shop-config-set @submit="appShopConfigVisible=false" @cancel="appShopConfigVisible=false"></app-shop-config-set>
		</el-drawer> 
	</div>
</template>

<script>
	import util from '@/common/js/util'; //全局公共库
	import SingleShearUpload from '@/components/Image/Single/Index';
	import BranchAdd from '@/views/mdp/sys/branch/BranchEdit'; //新增界面
	
	import AppShopConfigSet from '@/views/mdp/app/appShopConfig/AppShopConfigSet'; //新增界面
	import DeptTree from '../../sys/dept/DeptTree.vue';
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import {
		mapGetters
	} from 'vuex';

	import {
		addAppBizType
	} from '@/api/mdp/app/appBizType';

	import {
		listBranch,
		delBranch,
		batchDelBranch
	} from '@/api/mdp/sys/branch';

	import {
		listDept
	} from '@/api/mdp/sys/dept';

	import {
		addUser,
		resetPasswordByAdmin
	} from '@/api/mdp/sys/user';

	import md5 from 'js-md5';

	import {
		batchAddDeptPost
	} from '@/api/mdp/sys/post/deptPost';

	import {
		addDept
	} from '@/api/mdp/sys/dept';

	import {
		batchAddPostRole
	} from '@/api/mdp/sys/post/postRole';

	import {
		addPost
	} from '@/api/mdp/sys/post/post';

	import {
		batchEditUserDept
	} from '@/api/mdp/sys/userDept';

	import {
		createShopApi
	} from '@/api/mdp/mallm/shop/shop';
	export default {
		name:'openAccountMng',
		watch: {},
		computed: {
			...mapGetters([
				'userInfo'
			])
		},
		data() {
			return {
				createShopDialogLoading:false,
				createShopSelectDept: {},
				createShopSelectBranch: {},
				createShopForm: {
					shopBrand: '',
					shopRemark: '',
					shopId: '',
					shopLogo: ''
				},
				createShopVisiable: false,
				createPostNumber: 0,
				userInputBranchId: '',
				fromPage: 'openAccountMng',
				branchId: '',
				createSuccessDialogVisiable: false,
				addForm: {
					id: '',
					branchName: '',
					enabled: '',
					industryCategory: '',
					cuserid: '',
					cdate: '',
					cusername: '',
					phoneNo: '',
					emaill: ''
				},
				needSearchOrganId: '', //需要查询的机构编号id
				loading: false,
				addFormVisible: false,
				withoutOrganVisiable: false,
				alreadyOrganVisiable: false,
				appShopConfigVisible:false,
			} //end return
		}, //end data
		components: {
			'branch-add': BranchAdd,
			'single-shear-upload': SingleShearUpload,
			'dept-tree': DeptTree,
			AppShopConfigSet,
		},
		methods: {
			//初始化方法
			initDate() {
				this.createShopSelectDept = {};
				this.createShopSelectBranch = {};
				this.createShopForm = {};
				this.createShopForm.shopBrand = '';
				this.createShopForm.shopRemark = '';
				this.createShopForm.shopLogo = '';
				this.createShopForm.shopId = '';
			},
			//点击创建商户对话框左边的树触发的事件
			handleLeftDeptNodeClick(data, node, comp) {
				if (!data.isBranch) { //选择的不是机构节点
					this.createShopSelectDept = data; 
						this.createShopForm.shopBrand=data.deptName; 
						this.createShopForm.shopId=data.deptid;  
				} else {
					this.createShopSelectBranch = {
						branchName: data.deptName,
						branchId: data.branchId
					}
				} 
			},
			//点击创建商户对话框左边的点击切换机构按钮触发的事件
			branchRowClick: function(row, event, column) { //点击切换机构按钮的时候触发的事件
				this.createShopSelectBranch = row;
				this.createShopSelectBranch.branchId = row.id;
				this.createShopSelectDept = {};
			},
			//创建商户对话框的提交事件
			createShopDialogSubmitMethod() {
				console.log("创建商户对话框的提交事件");
				console.log(this.createShopForm);
				if (!this.createShopSelectBranch.branchId) {
					this.$notify({
						message: '请选择机构',
						type: 'error'
					});
					return;
				};
				if (!this.createShopSelectDept.deptid) {
					this.$notify({
						message: '请选择部门',
						type: 'error'
					});
					return;
				};
				if (this.createShopSelectDept.isBranch) {
					this.$notify({
						message: '请选择部门',
						type: 'error'
					});
					return;
				};
				if (!this.createShopForm.shopBrand) {
					this.$notify({
						message: '请输入商户名称',
						type: 'error'
					});
					return;
				};
				if (this.createShopForm.shopId) {
					var re = /^[0-9a-zA-Z_-]*$/g;
					if (!re.test(this.createShopForm.shopId)) {
						this.$notify({
							message: '商户编号只能是数字与字母的组合',
							type: 'error'
						});
						return;
					} 
				}
				let params = {};
				params.branchId = this.createShopSelectBranch.branchId;
				params.shopBrand = this.createShopForm.shopBrand;
				params.shopRemark = this.createShopForm.shopRemark;
				params.shopLogo = this.createShopForm.shopLogo;
				params.deptid = this.createShopSelectDept.deptid;
				params.shopId = this.createShopForm.shopId;
				this.createShopDialogLoading=true;
				createShopApi(params).then((res) => {
					this.createShopDialogLoading=false;
					let tips = res.data.tips;
					if(tips.isOk){
						this.createShopVisiable=false;
						this.initDate();
					}
					this.$notify({
						message: tips.msg,
						type: tips.isOk ? 'success' : 'error'
					});
				});
			},
			//创建商户对话框的取消事件
			createShopDialogHandleCancelMethod() {
				this.createShopVisiable = false;
				this.initDate();
			},
			//显示创建商户窗口
			changeShopVisiableMethod() {
				this.createShopVisiable = true;
			},
			//改变没有机构编号的方法
			changeWithoutOrganVisiableMethod() {
				this.withoutOrganVisiable = true;
				this.addFormVisible = true;
			},
			////改变已有机构编号的方法
			changeAlreadyOrganVisiableMethod() {
				this.alreadyOrganVisiable = true;
			},
			//跳转到创建机构的方法
			toCreateOrganMethod() {
				/* this.$router.push({
					path: "/mdp/sys/branch/BranchAdd",
					params:{ userid: 123 }
				}) */
			},
			//查询是否已有机构了
			searchBranchMethod() {
				if (this.needSearchOrganId.replace(/(\s*$)/g, "").replace(/(^\s*)/g, "") == '') {
					this.$notify({
						message: '机构编号不能为空',
						type: 'error'
					});
					return;
				};
				let params = {
					id: this.needSearchOrganId
				};
				listBranch(params).then((res) => {
					var tips = res.data.tips;
					if (tips.isOk) {
						if (res.data.data instanceof Array) {
							if (res.data.data.length > 0) {
								this.$notify({
									message: '查找到对应的机构',
									type: 'success'
								});
							} else {
								this.$notify({
									message: '查找不到对应的机构',
									type: 'error'
								});
							}
						}
					} else {
						this.$notify({
							message: tips.msg,
							type: 'error'
						});
					}
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$notify({ message: '通讯错误', type: 'error' });
				});
			},
			shopAppShopConfigVisible:function(){
				this.appShopConfigVisible=true;
			},
			//创建机构完之后的方法
			afterAddSubmit(data) {
				 
			},
			createPost(postName, branchId, branchName, roleid, deptId, deptName, userid) {
				let addPostParams = {
					//branchId:this.userInfo.branchId,
					branchId: branchId,
					postLvl: '1',
					postName: branchName + postName,
					postType: 'guanli'
				};
				//添加岗位
				addPost(addPostParams).then((res) => {
					var tips = res.data.tips;
					if (tips.isOk) {
						let postId = res.data.data.id;
						let postName = res.data.data.postName;
						//为这个岗位添加一个公共角色
						let addPostRoleParams = [
							/* {
															"postId": postId,
															"roleid": "branchAdmin"
														}, */
							{
								"postId": postId,
								//"roleid": "shopAdmin"
								"roleid": roleid
							},
						];
						//添加岗位角色
						batchAddPostRole(addPostRoleParams).then(res => {
							//添加部门岗位
							if (res.data.tips.isOk) {
								let addPostDeptParams = [{
									"deptid": deptId,
									"postId": postId
								}];
								batchAddDeptPost(addPostDeptParams).then(res => {
									//为岗位设置用户
									let editUserDeptParams = {
										addDeptPostUsers: [{
											checked: '1',
											deptName: deptName,
											deptid: deptId,
											postId: postId,
											postName: postName,
											userid: userid
										}],
										branchId: branchId,
										delDeptPostUserIds: [],
										delUserDeptIds: [],
										deptids: [deptId],
										userid: userid
									}
									batchEditUserDept(editUserDeptParams).then((res) => {
										this.loading = false;
										this.$notify({
											message: "完成",
											type: 'success'
										});
										this.createPostNumber++;
										if (this.createPostNumber > 2) {
											this.createSuccessDialogVisiable = true;
											this.userInputBranchId = '';
										}
									}).catch((e) => {
										this.loading = false;
									});
								});
							}
						});
					}
				}).catch(err => {
					this.loading = false;
				});
			},
			//设置机构支付信息
			setOrganPayMessageMethod() {
				this.$router.push({
					path: "/mdp/app/appTpAuth/AppTpAuthMng",
					params: {
						userid: 123
					}
				})
			},
			getUserInputBranchIdMethod(data) {
				this.userInputBranchId = data;
			}
		}
	}
</script>

<style scoped>
	.container {
		/*background-color: #e9efff;*/
		height: 100%;
		padding-top: 50px;
		padding-bottom: 50px;
	}

	.container .context {
		width: 200px;
		height: 200px;
		margin: 0 auto;
	}

	.container .context .btn {
		font-size: 26px;
		color: #ffa81e;
		border-color: #ffa81e;
		margin-bottom: 20px;
	}
</style>
