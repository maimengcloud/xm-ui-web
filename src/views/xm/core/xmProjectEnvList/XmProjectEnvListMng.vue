<template>
	<section>
		<div class="navbar">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectEnvLists">查询</el-button>
			<el-button type="primary" @click="showAdd">添加项目环境清单</el-button>
			<el-button type="primary" @click="showImport">选择已有环境清单</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</div>
		<el-row class="page-main "> 
			<!--列表 XmProjectEnvList xm_project_env_list-->
			<el-table ref="table" :height="tableHeight" :data="xmProjectEnvLists" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column prop="ipAddress" label="ip地址" min-width="80" ></el-table-column>
				<el-table-column prop="port" label="访问端口" min-width="80" ></el-table-column>
				<el-table-column prop="projectName" label="归属项目组名称" min-width="80" ></el-table-column>
				<el-table-column prop="accessUserid" label="访问用户编号" min-width="80" ></el-table-column>
				<el-table-column prop="accessPassword" label="访问密码" min-width="80" ></el-table-column>
				<el-table-column prop="effect" label="作用说明" min-width="80" ></el-table-column>
				<el-table-column prop="accessUrl" label="访问链接" min-width="80" ></el-table-column>
				<el-table-column prop="webIpAddress" label="外网ip地址" min-width="80" ></el-table-column>
				<el-table-column prop="webPort" label="外网端口" min-width="80" ></el-table-column>
				<el-table-column prop="remark" label="备注说明" min-width="80" ></el-table-column>
				<el-table-column prop="otherRemark" label="其它说明" min-width="80" ></el-table-column>
				<el-table-column prop="createUsername" label="添加人员姓名" min-width="80" ></el-table-column>
				<el-table-column prop="createTime" label="添加时间" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="160" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmProjectEnvList xm_project_env_list界面-->
			<el-drawer title="编辑项目环境清单" :visible.sync="editFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-project-env-list-edit :xm-project-env-list="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-env-list-edit>
			</el-drawer>
	
			<!--新增 XmProjectEnvList xm_project_env_list界面-->
			<el-drawer title="新增项目环境清单" :visible.sync="addFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				<xm-project-env-list-add :curr-project="currProject" :xm-project-env-list="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-project-env-list-add>
			</el-drawer>

			<el-drawer title="环境清单" :visible.sync="importVisible" size="80%" append-to-body   :close-on-click-modal="false">
				<el-table :data="envList" highlight-current-row v-loading="load.list" border @current-change="handleCurrent" style="width: 100%;">
					<el-table-column prop="ipAddress" label="内网ip地址" min-width="80" ></el-table-column>
					<el-table-column prop="port" label="内网访问端口" min-width="80" ></el-table-column>
					<el-table-column prop="accessUserid" label="访问用户编号" min-width="80" ></el-table-column>
					<el-table-column prop="accessPassword" label="访问密码" min-width="80" ></el-table-column>
					<el-table-column prop="effect" label="作用说明" min-width="80" ></el-table-column>
					<el-table-column prop="accessUrl" label="访问链接" min-width="80" ></el-table-column>
					<el-table-column prop="supplier" label="供应商" min-width="80" ></el-table-column>
					<el-table-column prop="webIpAddress" label="外网ip地址" min-width="80" ></el-table-column>
					<el-table-column prop="webPort" label="外网端口" min-width="80" ></el-table-column>
					<el-table-column prop="envState" label="状态" min-width="80" >
						<template slot-scope="scope">
							{{envStateList[parseInt(scope.row.envState)]}}
						</template>
					</el-table-column>
					<el-table-column prop="startTime" label="有效日期开始" min-width="80" ></el-table-column>
					<el-table-column prop="endTime" label="有效日期结束" min-width="80" ></el-table-column>
					<el-table-column prop="feeAmount" label="费用" min-width="80" ></el-table-column>
					<el-table-column prop="feeRule" label="计费规则" min-width="80" ></el-table-column>
					<el-table-column prop="remark" label="备注说明" min-width="80" ></el-table-column>
					<el-table-column prop="otherRemark" label="其它说明" min-width="80" ></el-table-column>
					<el-table-column prop="createTime" label="添加时间" min-width="80" ></el-table-column>
					<el-table-column prop="createUsername" label="添加人姓名" min-width="80" ></el-table-column>
					<el-table-column label="操作" width="80" fixed="right"  >
						<template slot-scope="scope">
							<el-button @click="confirmAdd( scope.row,scope.$index)">选择</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-drawer>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectEnvList, addXmProjectEnvList, delXmProjectEnvList, batchDelXmProjectEnvList } from '@/api/xm/core/xmProjectEnvList';
	import { listXmEnvList } from '@/api/xm/core/xmEnvList';
	import  XmProjectEnvListAdd from './XmProjectEnvListAdd';//新增界面
	import  XmProjectEnvListEdit from './XmProjectEnvListEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		props: ["selProject"],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmProjectEnvLists: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProjectEnvList界面是否显示
				//新增xmProjectEnvList界面初始化数据
				addForm: {
					id:'',remark:'',ipAddress:'',port:'',projectId:'',projectName:'',accessUserid:'',accessPassword:'',effect:'',accessUrl:'',webIpAddress:'',webPort:'',otherRemark:'',createUserid:'',createUsername:'',createTime:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectEnvList界面初始化数据
				editForm: {
					id:'',remark:'',ipAddress:'',port:'',projectId:'',projectName:'',accessUserid:'',accessPassword:'',effect:'',accessUrl:'',webIpAddress:'',webPort:'',otherRemark:'',createUserid:'',createUsername:'',createTime:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				
				envList: [],
				envStateList:["不可用","已启用","已过期"],
				importVisible: false,
				currentRow: null,
				currProject: {
					id: this.selProject.id,
					name: this.selProject.name,
				},

				tableHeight:300,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjectEnvLists();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectEnvLists();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmProjectEnvLists();
			},
			searchXmProjectEnvLists(){
				 this.pageInfo.count=true; 
				 this.getXmProjectEnvLists();
			},
			//获取列表 XmProjectEnvList xm_project_env_list
			getXmProjectEnvLists() {
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
				if(this.filters.key!==""){
					params.fuzzy = '%' + this.filters.key + '%';
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.load.list = true;
				// params.projectId = this.selProject.id;
				listXmProjectEnvList(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectEnvLists = res.data.data;
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectEnvList xm_project_env_list
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProjectEnvList xm_project_env_list
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjectEnvLists();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProjectEnvList
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProjectEnvList
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmProjectEnvList(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProjectEnvLists();
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProjectEnvList
			batchDel: function () {
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProjectEnvList(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectEnvLists(); 
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/

			showImport(){
				this.importVisible = true;
				this.load.list=true;
				let params = {
					branchId: this.userInfo.branchId,
					projectId: this.selProject.id,
				};
				listXmEnvList(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.envList = res.data.data;
						// console.log(this.envList);
						// this.getXmProjectEnvLists();
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			handleCurrent(val) {
				this.currentRow = val;
				console.log(this.currentRow);
			},

			confirmAdd(row,index) {
				this.$confirm('确认选择这个吗？', '提示', {}).then(() => { 
					this.load.add=true;
					row.projectId = this.selProject.id;
					row.projectName = this.selProject.name;
					let params = Object.assign({}, row); 
					addXmProjectEnvList(params).then((res) => {
						this.load.add=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.importVisible = false;
							this.getXmProjectEnvLists();
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.add=false);
				});
			}
			
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-project-env-list-add':XmProjectEnvListAdd,
		    'xm-project-env-list-edit':XmProjectEnvListEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				
				
				
				this.tableHeight =  util.calcTableMaxHeight('el-table'); 
				console.log(this.currProject);
				this.getXmProjectEnvLists();
			});
		}
	}

</script>

<style scoped>
.navbar{
	background: #fafbfc;
	padding: 0 20px;
	height: 50px;
	overflow: auto hidden;
	line-height: 50px;
}
</style>