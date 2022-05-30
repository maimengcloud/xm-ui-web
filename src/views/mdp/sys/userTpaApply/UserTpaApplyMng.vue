<template>
	<section>
		<el-row>
		<div style="background: #d0d0d0;display:flex;align-items: center;text-align: left;padding-left: 20px;height: 50px;">
			<!-- <el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> -->
			<el-input style="width:10%;" disabled v-model="oneLocationName" placeholder="商户名字"></el-input>
			<el-input style="width:15%;" v-model="filters.locationId" placeholder="需要查询的门店编号"></el-input>
			<el-button @click="showSelectShopMethod" type="primary">选择门店</el-button>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="请输入需要查询用户编号或者用户名称"></el-input>
			<el-select v-model="filters.status" placeholder="请选择">
				<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-button type="primary"   v-on:click="searchSysUserTpaApplys" icon="el-icon-search"></el-button>
			<!-- <el-button type="primary" @click="showAdd">新增用户岗位申请记录</el-button> -->
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>
		</div>
		</el-row>
		<el-row class="app-container">
			<!--列表 SysUserTpaApply sys_user_tpa_apply-->
			<el-table :max-height="tableHeight" :data="sysUserTpaApplys"  highlight-current-row v-loading="load.list" border
			 @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<!-- <el-table-column sortable type="index" width="40"></el-table-column> -->
				<!-- <el-table-column sortable prop="id" label="申请编号" min-width="80" show-overflow-tooltip></el-table-column> -->
				<el-table-column sortable prop="userid" label="第三方用户编号" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="username" label="用户名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="phoneNo" label="电话" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="loginNo" label="后台登陆账号" min-width="120" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="postName" label="岗位名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="branchId" label="机构编号" min-width="100" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="deptid" label="部门编号" min-width="100" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="deptName" label="部门名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="shopId" label="商户编号" min-width="100" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="shopName" label="商户名称" min-width="100" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="locationId" label="门店编号" min-width="100" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="businessName" label="门店名称" min-width="100" show-overflow-tooltip></el-table-column>
				<el-table-column sortable label="状态" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-tag v-if="scope.row.isLocationAdminUser=='0'">申请中</el-tag>
						<el-tag type="success" v-if="scope.row.isLocationAdminUser=='1'">成功</el-tag>
						<!-- <el-tag type="danger" v-if="scope.row.status=='2'">拒绝</el-tag> -->
					</template>
				</el-table-column>
				<el-table-column sortable prop="remark" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="createDate" label="申请时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable label="操作" min-width="160" fixed="right" show-overflow-tooltip>
					<template slot-scope="scope">
						<!-- v-if="scope.row.status!='1'" -->
						<!-- <el-button @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button> -->
						<el-button type="primary" @click="userMngMethod()">设置</el-button>
						<!-- <el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
			 @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"
			 :total="pageInfo.total" style="float:right;"></el-pagination>

			<!--编辑 SysUserTpaApply sys_user_tpa_apply界面-->
			<el-dialog title="编辑用户岗位申请记录" :visible.sync="editFormVisible" width="50%" :close-on-click-modal="false">
				<user-tpa-apply-edit :user-tpa-apply="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></user-tpa-apply-edit>
			</el-dialog>

			<!--新增 SysUserTpaApply sys_user_tpa_apply界面-->
			<el-dialog title="新增用户岗位申请记录" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
				<user-tpa-apply-add :user-tpa-apply="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></user-tpa-apply-add>
			</el-dialog>

			<el-dialog title="选择商户和门店" :visible.sync="selectShopVisible" width="70%" append-to-body>
				<select-shop-location-by-sys-dept @sure="sureMethod"></select-shop-location-by-sys-dept>
			</el-dialog>
			
			<el-dialog title="部门用户管理" :visible.sync="userMngVisible" :before-close="userMngVisibleDialogBeforeCloseMethod" width="90%" >
				<user-mng></user-mng>
			</el-dialog>
			
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util'; //全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import {
		listSysUserTpaApply,
		delSysUserTpaApply,
		batchDelSysUserTpaApply
	} from '@/api/mdp/sys/userTpaApply';
	import UserTpaApplyAdd from './UserTpaApplyAdd'; //新增界面
	import UserTpaApplyEdit from './UserTpaApplyEdit'; //修改界面
	import {
		mapGetters
	} from 'vuex'
	import selectShopLocationBySysDept from '@/views/mdp/app/selectShopLocationBySysDept/selectShopLocationBySysDept';
	import UserMng from '@/views/mdp/sys/user/UserMng';
	export default {
		computed: {
			...mapGetters([
				'userInfo'
			])
		},
		data() {
			return {
				userMngVisible:false,
				statusOptions:[
					{
						value: '0',
						label: '申请中'
					},
					{
						value: '1',
						label: '申请成功'
					},
					{
						value: '2',
						label: '拒绝'
					},
					{
						value: '',
						label: '全部'
					},
				],
				oneLocationName: '',
				selectShopVisible: false,
				filters: {
					"status":'',
					"locationId": '',
					"branchId": "",
					"shopId": "",
					"key": ''
				},
				sysUserTpaApplys: [], //查询结果
				pageInfo: { //分页数据
					total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize: 10, //每页数据
					count: false, //是否需要重新计算总记录数
					pageNum: 1, //当前页码、从1开始计算
					orderFields: ['create_date'], //排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs: ['desc'] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load: {
					list: false,
					edit: false,
					del: false,
					add: false
				}, //查询中...
				sels: [], //列表选中数据
				options: {}, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 

				addFormVisible: false, //新增sysUserTpaApply界面是否显示
				//新增sysUserTpaApply界面初始化数据
				addForm: {
					id: '',
					userid: '',
					applyPostName: '',
					applyBranchId: '',
					applyShopId: '',
					applyLocationId: '',
					source: '',
					status: '',
					remark: '',
					createDate: '',
					updateDate: '',
					cuserid: '',
					lopuserid: ''
				},

				editFormVisible: false, //编辑界面是否显示
				//编辑sysUserTpaApply界面初始化数据
				editForm: {
					id: '',
					userid: '',
					applyPostName: '',
					applyBranchId: '',
					applyShopId: '',
					applyLocationId: '',
					source: '',
					status: '',
					remark: '',
					createDate: '',
					updateDate: '',
					cuserid: '',
					lopuserid: ''
				},
				tableHeight:500,
				/**begin 自定义属性请在下面加 请加备注**/

				/**end 自定义属性请在上面加 请加备注**/
			}
		}, //end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize = pageSize;
				this.getSysUserTpaApplys();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getSysUserTpaApplys();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange(obj) {
				var dir = 'asc';
				if (obj.order == 'ascending') {
					dir = 'asc'
				} else {
					dir = 'desc';
				}
				if (obj.prop == 'xxx') {
					this.pageInfo.orderFields = ['xxx'];
					this.pageInfo.orderDirs = [dir];
				}
				this.getSysUserTpaApplys();
			},
			searchSysUserTpaApplys() {
				this.pageInfo.count = true;
				this.getSysUserTpaApplys();
			},
			//获取列表 SysUserTpaApply sys_user_tpa_apply
			getSysUserTpaApplys() {
				let params = {
					"pageSize": this.pageInfo.pageSize,
					"pageNum": this.pageInfo.pageNum,
					"total": this.pageInfo.total,
					"count": this.pageInfo.count,
					"branchId": this.filters.branchId,
					"ashopId": this.filters.shopId,
					"locationId": this.filters.locationId,
					"status":this.filters.status
				};
				if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) {
					let orderBys = [];
					for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
						orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
					}
					params.orderBy = orderBys.join(",")
				}
				if (this.filters.key !== "") {
					//params.xxx=this.filters.key
				} else {
					//params.xxx=xxxxx
				}
				this.load.list = true;
				listSysUserTpaApply(params).then((res) => {
					var tips = res.data.tips;
					if (tips.isOk) {
						this.pageInfo.total = res.data.total;
						this.pageInfo.count = false;
						this.sysUserTpaApplys = res.data.data;
					} else {
						this.$notify({
							message: tips.msg,
							type: 'error'
						});
					}
					this.load.list = false;
				}).catch(err => this.load.list = false);
			},

			//显示编辑界面 SysUserTpaApply sys_user_tpa_apply
			showEdit: function(row, index) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 SysUserTpaApply sys_user_tpa_apply
			showAdd: function() {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit() {
				this.addFormVisible = false;
				this.pageInfo.count = true;
				this.getSysUserTpaApplys();
			},
			afterEditSubmit() {
				this.editFormVisible = false;
				this.pageInfo.count = true;
				this.getSysUserTpaApplys();
			},
			//选择行sysUserTpaApply
			selsChange: function(sels) {
				this.sels = sels;
			},
			//删除sysUserTpaApply
			handleDel: function(row, index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del = true;
					let params = {
						id: row.id
					};
					delSysUserTpaApply(params).then((res) => {
						this.load.del = false;
						var tips = res.data.tips;
						if (tips.isOk) {
							this.pageInfo.count = true;
							this.getSysUserTpaApplys();
						}
						this.$notify({
							message: tips.msg,
							type: tips.isOk ? 'success' : 'error'
						});
					}).catch(err => this.load.del = false);
				});
			},
			//批量删除sysUserTpaApply
			batchDel: function() {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del = true;
					batchDelSysUserTpaApply(this.sels).then((res) => {
						this.load.del = false;
						var tips = res.data.tips;
						if (tips.isOk) {
							this.pageInfo.count = true;
							this.getSysUserTpaApplys();
						}
						this.$notify({
							message: tips.msg,
							type: tips.isOk ? 'success' : 'error'
						});
					}).catch(err => this.load.del = false);
				});
			},
			rowClick: function(row, event, column) {
				this.$emit('row-click', row, event, column); //  @row-click="rowClick"
			},
			showSelectShopMethod() {
				this.selectShopVisible = true;
			},
			sureMethod(row) {
				this.selectShopVisible = false;
				this.oneLocationName = row.businessName;
				this.filters.shopId = row.shopId;
				this.filters.branchId = row.branchId;
				this.filters.locationId = row.id;
				this.getSysUserTpaApplys();
			},
			userMngMethod(){
				this.userMngVisible=true;
			},
			userMngVisibleDialogBeforeCloseMethod(){
				this.userMngVisible=false;
			}
			

		}, //end methods
		components: {
			'user-mng':UserMng,
			'select-shop-location-by-sys-dept': selectShopLocationBySysDept,
			'user-tpa-apply-add': UserTpaApplyAdd,
			'user-tpa-apply-edit': UserTpaApplyEdit,
			 
			//在下面添加其它组件
		},
		mounted() {   
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 250;   
			}); 
			this.$nextTick(() => {
				this.filters.branchId = this.userInfo.branchId;
				this.filters.shopId = this.userInfo.shopId;
				this.oneLocationName = '';
				this.filters.locationId = ''
				this.getSysUserTpaApplys();
			});
		}
	}
</script>

<style scoped>

</style>
