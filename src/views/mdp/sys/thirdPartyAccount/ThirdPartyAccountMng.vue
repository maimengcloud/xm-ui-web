<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.openid" placeholder="帐户加密后的编号，用于对第三方系统进行开放"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getThirdPartyAccounts" icon="el-icon-search"></el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :max-height="tableHeight" :data="thirdPartyAccounts" highlight-current-row v-loading="listLoading" border @selection-change="selsChange" style="width: 100%;">
			<el-table-column sortable type="selection" width="40"></el-table-column>
			<el-table-column sortable type="index" width="40"></el-table-column>
			<el-table-column sortable prop="unionid" label="全局唯一编号" width="80"></el-table-column>
			<el-table-column sortable prop="openid" label="帐户加密后的编号，用于对第三方系统进行开放" width="80"></el-table-column>
			<el-table-column sortable prop="userid" label="用户编号" width="80"></el-table-column>
			<el-table-column sortable prop="locked" label="是否被锁定" width="80"></el-table-column>
			<el-table-column sortable prop="startdate" label="启用日期" width="80"></el-table-column>
			<el-table-column sortable prop="nickname" label="昵称" width="80"></el-table-column>
			<el-table-column sortable prop="username" label="用户名称" width="80"></el-table-column>
			<el-table-column sortable prop="phoneno" label="移动电话号码" width="80"></el-table-column>
			<el-table-column sortable prop="country" label="国家" width="80"></el-table-column>
			<el-table-column sortable prop="city" label="城市" width="80"></el-table-column>
			<el-table-column sortable prop="headimgurl" label="头像地址" width="80"></el-table-column>
			<el-table-column sortable prop="province" label="省份" width="80"></el-table-column>
			<el-table-column sortable prop="userunionid" label="对应本系统user表的UNIONID" width="80"></el-table-column>
			<el-table-column sortable prop="frontApp" label="前端应用系统名称" width="80"></el-table-column>
			<el-table-column sortable label="操作" width="150" fixed="right">
				<template scope="scope">
					<el-button  @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
					<el-button type="danger"  @click="handleDel(scope.$index, scope.row)" icon="el-icon-delete"></el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchDel" :disabled="this.sels.length===0" icon="el-icon-delete"></el-button>
			<el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
					<el-form-item label="全局唯一编号" prop="unionid">
						<el-input v-model="editForm.unionid" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="帐户加密后的编号，用于对第三方系统进行开放" prop="openid">
						<el-input v-model="editForm.openid" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="用户编号" prop="userid">
						<el-input v-model="editForm.userid" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="是否被锁定" prop="locked">
						<el-input v-model="editForm.locked" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="启用日期" prop="startdate">
						<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startdate"></el-date-picker>
					</el-form-item> 
					<el-form-item label="昵称" prop="nickname">
						<el-input v-model="editForm.nickname" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="用户名称" prop="username">
						<el-input v-model="editForm.username" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="移动电话号码" prop="phoneno">
						<el-input v-model="editForm.phoneno" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="国家" prop="country">
						<el-input v-model="editForm.country" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="城市" prop="city">
						<el-input v-model="editForm.city" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="头像地址" prop="headimgurl">
						<el-input v-model="editForm.headimgurl" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="省份" prop="province">
						<el-input v-model="editForm.province" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="对应本系统user表的UNIONID" prop="userunionid">
						<el-input v-model="editForm.userunionid" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="前端应用系统名称" prop="frontApp">
						<el-input v-model="editForm.frontApp" auto-complete="off"></el-input>
					</el-form-item> 
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
					<el-form-item label="全局唯一编号" prop="unionid">
						<el-input v-model="addForm.unionid" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="帐户加密后的编号，用于对第三方系统进行开放" prop="openid">
						<el-input v-model="addForm.openid" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="用户编号" prop="userid">
						<el-input v-model="addForm.userid" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="是否被锁定" prop="locked">
						<el-input v-model="addForm.locked" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="启用日期" prop="startdate">
						<el-date-picker type="date" placeholder="选择日期" v-model="addForm.startdate"></el-date-picker>
					</el-form-item> 
					<el-form-item label="昵称" prop="nickname">
						<el-input v-model="addForm.nickname" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="用户名称" prop="username">
						<el-input v-model="addForm.username" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="移动电话号码" prop="phoneno">
						<el-input v-model="addForm.phoneno" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="国家" prop="country">
						<el-input v-model="addForm.country" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="城市" prop="city">
						<el-input v-model="addForm.city" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="头像地址" prop="headimgurl">
						<el-input v-model="addForm.headimgurl" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="省份" prop="province">
						<el-input v-model="addForm.province" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="对应本系统user表的UNIONID" prop="userunionid">
						<el-input v-model="addForm.userunionid" auto-complete="off"></el-input>
					</el-form-item> 
					<el-form-item label="前端应用系统名称" prop="frontApp">
						<el-input v-model="addForm.frontApp" auto-complete="off"></el-input>
					</el-form-item> 
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../../../common/js/util'
	import { listThirdPartyAccount } from '../../../../api/mdp/sys/thirdPartyAccount';
	import { mapGetters } from 'vuex' 
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			return {
				filters: {
					openid: ''
				},
				thirdPartyAccounts: [],
				pageInfo:{
					total:0,
					pageSize:10,
					pageNum:1
				},
				listLoading: false,
				sels: [],//列表选中列
				
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					openid: [
						//{ required: true, message: '帐户加密后的编号，用于对第三方系统进行开放', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					unionid:'',openid:'',userid:'',locked:'',startdate:'',nickname:'',username:'',phoneno:'',country:'',city:'',headimgurl:'',province:'',userunionid:'',frontApp:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					openid: [
						//{ required: true, message: '帐户加密后的编号，用于对第三方系统进行开放', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: Object.assign({}, this.addForm),
				tableHeight:500,
			}
		},
		methods: {
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.getThirdPartyAccounts();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getThirdPartyAccounts();
			},
			//获取列表
			getThirdPartyAccounts() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,count:this.pageInfo.count,
					openid: this.filters.openid
				};
				this.listLoading = true;
				listThirdPartyAccount(params).then((res) => {
					this.pageInfo.total = res.data.total;this.pageInfo.count=false;
					this.thirdPartyAccounts = res.data.data;
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = { openid: row.openid };
					delThirdPartyAccount(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){ this.getThirdPartyAccounts();}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.listLoading = false;
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true; 
							let params = Object.assign({}, this.editForm); 
							editThirdPartyAccount(params).then((res) => {
								this.editLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getThirdPartyAccounts();
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.editLoading = false;
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true; 
							let params = Object.assign({}, this.addForm); 
							addThirdPartyAccount(params).then((res) => {//1 begin
								this.addLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getThirdPartyAccounts();
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							});//1 end
						}).catch(() => {
							this.addLoading = false;
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchDel: function () { 
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {//1 begin
					this.listLoading = true;
					batchDelThirdPartyAccount(this.sels).then((res) => {//2 begin
						this.listLoading = false;
						var tips=res.data.tips;
						if( tips.isOk ){ this.getThirdPartyAccounts(); }
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					});//2 end
				}).catch(() => {//1 end
					this.listLoading = false;
				});
			}
		},
		mounted() {   
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 250;   
			}); 
			this.getThirdPartyAccounts();
		}
	}

</script>

<style scoped>

</style>