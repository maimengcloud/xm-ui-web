<template>
	<div>
		<el-row v-loading="elRowLoading">
			<el-col :span="6" style=" overflow-x:auto; height:400px;">
				<span style="font-weight:bold;">请选择机构与部门</span>
				<dept-tree show-root default-expand-all :expand-on-click-node="false" @node-click="handleLeftDeptNodeClick"
				 @branch-row-click="branchRowClick"></dept-tree>
			</el-col>
			<el-col :span="15">
				<el-col :span="5" style="margin-left:70px;"><el-input v-model="filters.key"  placeholder="模糊查询"></el-input></el-col>
				<el-col :span="8"><el-button type="danger" @click="selectshopLocationBySysDeptIdMethodLike">模糊搜索</el-button>
				<el-button type="primary" @click="checkSureMethod" v-if="isSupportCheck">确定</el-button>
				</el-col>
				<el-table    ref="multipleTable" :data="shopLocationTable" style="width: 100%;margin-left:70px;"   @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55" v-if="isSupportCheck">
					</el-table-column>
					<!-- <el-table-column prop="shopId" label="商户编号" width="180" align="center">
					</el-table-column> -->
					<el-table-column prop="deptid" label="部门编号" width="180" align="center">
					</el-table-column>
					<el-table-column prop="deptName" label="部门名称" align="center">
					</el-table-column>
					<el-table-column label="操作" align="center" v-if="!isSupportCheck">
						<template slot-scope="scope">
							<el-button type="primary" @click="sureMethod(scope.row,scope.$index)">确定</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination style="float:right" layout="total, sizes, prev, pager, next,jumper" @current-change="handleCurrentChange" @size-change="handleSizeChange"
					 :page-sizes="[10,20, 50, 100, 500]" :current-page.sync="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total"></el-pagination>

			</el-col>
		</el-row>
	</div>
</template>

<script>
	import util from '@/common/js/util'; //全局公共库
	import Sticky from '@/components/Sticky' // 粘性header组件
	import DeptTree from './DeptTree.vue';
	import {
		listDept
	} from './shopLocation';
	import {
		mapGetters
	} from 'vuex'
	export default {
		computed: {
			...mapGetters([
				'workSpace'
			])
		},
		props: ['isSupportCheck'],
		watch: {},
		data() {
			return {
        filters: {
        	key: ''
        },
				multipleSelection: [],
				filterBusinessName:'',//搜索名字过滤
				currentSelectDeptObject:{},//当前选择的部门对象
				elRowLoading: false,
				shopLocationTable: [],
				pageInfo: { //分页数据
					total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。  计算出有多少条记录
					pageSize: 10, //每页数据		每页现实的数据的大小
					count: false, //是否需要重新计算总记录数
					pageNum: 1, //当前页码、从1开始计算
					orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				}
			}
		}, //end data
		methods: {
			selectshopLocationBySysDeptIdMethodLike(){
				if(this.currentSelectDeptObject.branchId==null||this.currentSelectDeptObject.branchId==''){
					this.$message({
						 message: "请选择机构和部门",
						 type: "error"
					});
					return
				}
				this.selectshopLocationBySysDeptIdMethod();
			},
			handleCurrentChange(pageNum) { //分页组件的修改当前页数
				this.pageInfo.pageNum = pageNum;
				this.selectshopLocationBySysDeptIdMethod();
			},
			handleSizeChange(pageSize) { //分页组建的修改每页显示的大小
				this.pageInfo.pageSize = pageSize;
				this.selectshopLocationBySysDeptIdMethod();
			},
			//点击创建商户对话框左边的树触发的事件
			handleLeftDeptNodeClick(data, node, comp) {
				if (!data.isBranch) { //选择的不是机构节点
					let branchId = data.branchId;
					let deptid = data.deptid;
					this.pageInfo.count=true;
					this.currentSelectDeptObject=data;
					this.selectshopLocationBySysDeptIdMethod();
				}
			},
			//点击切换机构按钮的时候触发的事件
			branchRowClick: function(row, event, column) {

			},

			selectshopLocationBySysDeptIdMethod() {
				let that = this;
				let params = {
					"branchId": this.currentSelectDeptObject.branchId,
					"pdeptid": this.currentSelectDeptObject.deptid,
					"pageSize":this.pageInfo.pageSize,
					"pageNum":this.pageInfo.pageNum,
					"count":this.pageInfo.count
				};
				if(this.filters.key!==""){
					params.key='%'+this.filters.key+'%';
				}

        if(this.branch!=null){
        	params.branchId=this.branch.id
        }
				if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) { //获取排序的字段的内容 以及排序的方式 按时间倒叙排序
					let orderBys = [];
					for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
						orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
					}
					params.orderBy = orderBys.join(",") //多个排序字段直接进行拼接的处理
				};
				this.elRowLoading = true;
				listDept(params).then(res => {
					this.elRowLoading = false;
					let tips = res.data.tips;
					if (tips.isOk) {
						this.pageInfo.total=res.data.total;
						this.pageInfo.count=false;
						that.shopLocationTable = res.data.data;
					}
					// this.$message({
					// 	message: tips.msg,
					// 	type: tips.isOk ? 'success' : 'error'
					// });
				}).catch(() => {
					this.elRowLoading = false
				});
			},

			 handleSelectionChange(val) {
				this.multipleSelection = val;
			 },
			sureMethod(row,index){
				this.$emit('sure',row);
			},
			checkSureMethod(){
				if(this.multipleSelection.length<1){
					this.$message({
						 message: "必须选择某个门店",
						 type: "error"
					});
					return;
				}
				this.$emit('checkSureMethod',this.multipleSelection);
			},
			clearSelectionMethod(){
				this.$refs.multipleTable.clearSelection();
			}

		}, //end methods
		components: {
			'dept-tree': DeptTree,
			'sticky': Sticky
			//在下面添加其它组件
		},
		mounted() {

		}
	}
</script>

<style scoped>

</style>
