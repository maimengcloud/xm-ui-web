<template>
	<section class="page-container border padding">
		<el-row>
 			<el-input v-model="filters.groupName" style="width:15%;" clearable placeholder="小组名称查询"></el-input>
			<el-input v-model="filters.leaderUsername" style="width:15%;" clearable placeholder="组长名称查询"></el-input>
			<el-input v-model="filters.assUsername" style="width:15%;" clearable placeholder="副组长名称查询"></el-input>
			<el-input v-model="filters.username" style="width:15%;" clearable placeholder="组员名称查询"></el-input>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" @click="searchXmGroupUsers" icon="el-icon-search">查询</el-button>
 			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmGroupUser xm_group_user-->
			<el-table ref="xmGroupUserTable" :data="xmGroupUsers" height="100px" v-adaptive="{bottomOffset:50}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55"></el-table-column>
				<el-table-column sortable type="index" width="55"></el-table-column>
				<el-table-column prop="pgClass" label="项目编号" min-width="150">
					<template slot-scope="scope">
						 {{ scope.row.projectId}}
					</template>
				</el-table-column>
				<el-table-column prop="groupName" label="组名" min-width="150" show-overflow-tooltip></el-table-column>
 				<el-table-column prop="username" label="成员姓名" min-width="150" show-overflow-tooltip ></el-table-column>
 				<el-table-column prop="userid" label="成员编号" min-width="150" show-overflow-tooltip></el-table-column>
				<el-table-column prop="obranchId" label="归属机构" min-width="150" show-overflow-tooltip></el-table-column>
				<el-table-column prop="joinTime" label="加入时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="outTime" label="离队时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="状态" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope">  {{scope.row.status=='0'?'已退出':'已加入'}}
					</template>
				</el-table-column>
 				<el-table-column prop="isPri" label="是否私人" min-width="80" show-overflow-tooltip>
					<template slot-scope="scope">  {{scope.row.isPri=='1'?'是':'否'}}
					</template>
				 </el-table-column>
				<el-table-column prop="seqNo" label="排序号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
					<template scope="scope">
						<el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 XmGroupUser xm_group_user界面-->
			<el-drawer title="编辑组员信息" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <xm-group-user-edit op-type="edit" :xm-group-user="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-group-user-edit>
			</el-drawer>

			<!--新增 XmGroupUser xm_group_user界面-->
			<el-drawer title="新增组员信息" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<xm-group-user-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-group-user-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库

	import { listXmGroupUser, delXmGroupUser, batchDelXmGroupUser } from '@/api/xm/core/xmGroupUser';
	import  XmGroupUserEdit from './XmGroupUserEdit';//新增修改界面
	import { mapGetters } from 'vuex'

	export default {
	    name:'xmGroupUserMng',
		components: {
		    XmGroupUserEdit,
		},
		props:['visible','xmGroup'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchXmGroupUsers()
                }
            }
		},
		data() {
			return {
				filters: {
					groupName: '',
					groupName:'',
					leaderUsername:'',
					assUsername:'',
					username:'',
				},
				xmGroupUsers: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmGroupUser界面是否显示
				addForm: {
					joinTime:'',groupId:'',userid:'',username:'',outTime:'',status:'',obranchId:'',isPri:'',seqNo:'',projectId:'',productId:'',pgClass:'',obranchName:''
				},

				editFormVisible: false,//编辑界面是否显示
				editForm: {
					joinTime:'',groupId:'',userid:'',username:'',outTime:'',status:'',obranchId:'',isPri:'',seqNo:'',projectId:'',productId:'',pgClass:'',obranchName:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmGroupUsers();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmGroupUsers();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				if(obj.order==null){
					this.pageInfo.orderFields=[];
					this.pageInfo.orderDirs=[];
				}else{
					var dir='asc';
					if(obj.order=='ascending'){
						dir='asc'
					}else{
						dir='desc';
					}

					this.pageInfo.orderFields=[util.toLine(obj.prop)];
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmGroupUsers();
			},
			searchXmGroupUsers(){
				 this.pageInfo.count=true;
				 this.getXmGroupUsers();
			},
			//获取列表 XmGroupUser xm_group_user
			getXmGroupUsers() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}

				if(this.filters.groupName){
					params.groupName=this.filters.groupName
				}
				if(this.filters.username){
					params.username=this.filters.username
				}
				if(this.filters.leaderUsername){
					params.leaderUsername=this.filters.leaderUsername
				}
				if(this.filters.assUsername){
					params.assUsername=this.filters.assUsername
				}
				if(this.xmGroup){
					params.groupId=this.xmGroup.id
				}

				this.load.list = true;
				listXmGroupUser(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmGroupUsers = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmGroupUser xm_group_user
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmGroupUser xm_group_user
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmGroupUsers();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmGroupUser
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除xmGroupUser
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { userid:row.userid,groupId: row.groupId };
					delXmGroupUser(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getXmGroupUsers();
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmGroupUser
			batchDel: function () {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmGroupUser(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmGroupUsers();
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },

		},//end methods
		mounted() {
			this.$nextTick(() => {

			    this.initData()
				this.searchXmGroupUsers();


                this.maxTableHeight = util.calcTableMaxHeight('.el-table');

        	});
		}
	}

</script>

<style scoped>
</style>
