<template>
	<div>
		<el-row v-loading="elRowLoading">
			<el-col :span="6" style=" overflow-x:auto; height:400px;">
				<span style="font-weight:bold;">请选择机构与部门</span>
				<dept-tree show-root default-expand-all :expand-on-click-node="false" @node-click="handleLeftDeptNodeClick"
				 @branch-row-click="branchRowClick"></dept-tree>
			</el-col>
			<el-col :span="15">
				<el-row v-loading="elRowLoading">
					<el-col :span="5" style="margin-left:70px;">
						<el-input v-model="filterBusinessName" placeholder="模糊查询"></el-input>
					</el-col>
					<el-col :span="4">
						<el-button type="danger" @click="selectshopLocationBySysDeptIdMethodLike">模糊搜索</el-button>
					</el-col>
				</el-row>
				<el-row v-loading="elRowLoading">
					<el-col :span="19" style="margin-left:70px;">
						<el-select v-model="myLocationIds" filterable clearable placeholder="请选择门店" multiple style="width:100%">
							<el-option v-for="item in locationIds" :key="item.id" :label="item.branchName" :value="item.id"></el-option>
						</el-select>
					</el-col>
					<el-col :span="2">
						<el-button type="danger" @click="sureMethod">确定</el-button>
					</el-col>
				</el-row>
				<el-table :data="shopLocationTable" style="width: 100%;margin-left:70px;">
					
					<el-table-column prop="shopId" label="商户编号" width="180" align="center"></el-table-column>
					<el-table-column prop="id" label="门店编号" width="180" align="center"></el-table-column>
					<el-table-column prop="businessName" label="门店名称" align="center"></el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="primary" @click="addTomyLocationIds(scope.row,scope.$index)">加入</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination style="float:right" layout="total, sizes, prev, pager, next,jumper" @current-change="handleCurrentChange"
				 @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page.sync="pageInfo.pageNum"
				 :page-size="pageInfo.pageSize" :total="pageInfo.total"></el-pagination>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import util from "@/common/js/util"; //全局公共库
	import Sticky from "@/components/Sticky"; // 粘性header组件
	import DeptTree from "./DeptTree.vue";
	import {
		selectshopLocationBySysDeptIdApi
	} from "./shopLocation";
	import {
		mapGetters
	} from "vuex";
	export default {
		computed: {
			...mapGetters(["userInfo"])
		},
		props: [],
		watch: {},
		data() {
			return {
				filterBusinessName: "", //搜索名字过滤
				locationIds: [], //选中的LocationIds数组
				myLocationIds: [], //选中的LocationIds数组
				currentSelectDeptObject: {}, //当前选择的部门对象
				elRowLoading: false,
				shopLocationTable: [],
				pageInfo: {
					//分页数据
					total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。  计算出有多少条记录
					pageSize: 10, //每页数据		每页现实的数据的大小
					count: false, //是否需要重新计算总记录数
					pageNum: 1, //当前页码、从1开始计算
					orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				}
			};
		}, //end data
		methods: {
			selectshopLocationBySysDeptIdMethodLike() {
				if (
					this.currentSelectDeptObject.branchId == null ||
					this.currentSelectDeptObject.branchId == ""
				) {
					this.$message({showClose: true,
						message: "请选择机构和部门",
						type: "error"
					});
					return;
				}
				this.selectshopLocationBySysDeptIdMethod();
			},
			handleCurrentChange(pageNum) {
				//分页组件的修改当前页数
				this.pageInfo.pageNum = pageNum;
				this.selectshopLocationBySysDeptIdMethod();
			},
			handleSizeChange(pageSize) {
				//分页组建的修改每页显示的大小
				this.pageInfo.pageSize = pageSize;
				this.selectshopLocationBySysDeptIdMethod();
			},
			//点击创建商户对话框左边的树触发的事件
			handleLeftDeptNodeClick(data, node, comp) {
				if (!data.isBranch) {
					//选择的不是机构节点
					let branchId = data.branchId;
					let deptid = data.deptid;
					console.log(data);
					this.pageInfo.count = true;
					this.currentSelectDeptObject = data;
					this.selectshopLocationBySysDeptIdMethod();
				}
			},
			//点击切换机构按钮的时候触发的事件
			branchRowClick: function(row, event, column) {},

			selectshopLocationBySysDeptIdMethod() {
				let that = this;
				let params = {
					branchId: this.currentSelectDeptObject.branchId,
					deptid: this.currentSelectDeptObject.deptid,
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					count: this.pageInfo.count
				};
				if (
					this.pageInfo.orderFields != null &&
					this.pageInfo.orderFields.length > 0
				) {
					//获取排序的字段的内容 以及排序的方式 按时间倒叙排序
					let orderBys = [];
					for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
						orderBys.push(
							this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i]
						);
					}
					params.orderBy = orderBys.join(","); //多个排序字段直接进行拼接的处理
				}
				if (this.filterBusinessName != null && this.filterBusinessName != "") {
					//店名模糊搜索
					params.filterBusinessName = "%" + this.filterBusinessName + "%";
				}
				this.elRowLoading = true;
				selectshopLocationBySysDeptIdApi(params)
					.then(res => {
						this.elRowLoading = false;
						let tips = res.data.tips;
						if (tips.isOk) {
							this.pageInfo.total = res.data.total;
							this.pageInfo.count = false;
							that.shopLocationTable = res.data.data;
						}
						// this.$message({showClose: true,
						//   message: tips.msg,
						//   type: tips.isOk ? "success" : "error"
						// });
					})
					.catch(() => {
						this.elRowLoading = false;
					});
			},

			sureMethod(row, index) {
				this.$emit("sure", this.locationIds, this.myLocationIds);
			},
			addTomyLocationIds(row, index) {
				let isHavingMyLocationIds = this.myLocationIds.some(s => s == row.id);
				if (isHavingMyLocationIds) {
					return;
				}
				this.myLocationIds.push(row.id);

				let isHaving = this.locationIds.some(s => s.id == row.id);
				if (isHaving) {
					return;
				}
				this.locationIds.push(row);

				console.log(this.myLocationIds);
			}
		}, //end methods
		components: {
			"dept-tree": DeptTree,
			sticky: Sticky
			//在下面添加其它组件
		},
		mounted() {}
	};
</script>

<style scoped>
</style>
