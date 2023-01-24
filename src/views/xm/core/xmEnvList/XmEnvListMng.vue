<template>
	<section class="page-container  padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询" clearable></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmEnvLists">查询</el-button>
			<span style="float:right;">
			<el-button type="primary" @click="showAdd" icon="el-icon-plus">添加环境清单</el-button>
			</span>
		</el-row>
		<el-row class="page-main "> 
			<!--列表 XmEnvList xm_env_list-->
			<el-table ref="table" :height="maxTableHeight" :data="xmEnvLists" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column prop="name" label="名称" min-width="80" ></el-table-column>
				<el-table-column prop="ipAddress" label="内网ip" min-width="80" ></el-table-column>
				<el-table-column prop="port" label="内网端口" min-width="80" ></el-table-column>
				<el-table-column prop="accessUserid" label="用户编号" min-width="80" ></el-table-column>
				<el-table-column prop="accessUrl" label="访问链接" min-width="80" >
					<template slot-scope="scope">
						<el-link @click="toAccessUrl(scope.row)">{{scope.row.accessUrl}}</el-link>
					</template> 
				</el-table-column>
				<el-table-column prop="webIpAddress" label="外网ip" min-width="80" ></el-table-column>
				<el-table-column prop="webPort" label="外网端口" min-width="80" ></el-table-column>
				<el-table-column prop="envState" label="状态" min-width="80" >
					<template slot-scope="scope">
						{{envStateList[parseInt(scope.row.envState)]}}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="160" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmEnvList xm_env_list界面-->
			<el-dialog title="编辑环境清单" :visible.sync="editFormVisible"  width="80%" top="20px" append-to-body   :close-on-click-modal="false">
				  <xm-env-list-edit :xm-env-list="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-env-list-edit>
			</el-dialog>
	
			<!--新增 XmEnvList xm_env_list界面-->
			<el-dialog title="新增环境清单" :visible.sync="addFormVisible" width="80%"  top="20px"   append-to-body   :close-on-click-modal="false">
				<xm-env-list-add :xm-project="projectInfo" :xm-product="xmProduct" :xm-env-list="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-env-list-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmEnvList, delXmEnvList, batchDelXmEnvList } from '@/api/xm/core/xmEnvList';
	import  XmEnvListAdd from './XmEnvListAdd';//新增界面
	import  XmEnvListEdit from './XmEnvListEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles','projectInfo','xmProduct'
		    ])
		}, 
		data() {
			return {
				filters: {
					key: ''
				},
				xmEnvLists: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['end_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmEnvList界面是否显示
				//新增xmEnvList界面初始化数据
				addForm: {
					id:'',name:'',remark:'',ipAddress:'',port:'',branchId:'',accessUserid:'',accessPassword:'',effect:'',accessUrl:'',supplier:'',webIpAddress:'',webPort:'',otherRemark:'',createUserid:'',createUsername:'',createTime:'',envState:'1',startTime:'',endTime:'',feeAmount:'',feeRule:'',readQx:'2',writeQx:'3',projectId:'',projectName:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmEnvList界面初始化数据
				editForm: {
					id:'',name:'',remark:'',ipAddress:'',port:'',branchId:'',accessUserid:'',accessPassword:'',effect:'',accessUrl:'',supplier:'',webIpAddress:'',webPort:'',otherRemark:'',createUserid:'',createUsername:'',createTime:'',envState:'',startTime:'',endTime:'',feeAmount:'',feeRule:'',readQx:'2',writeQx:'3',projectId:'',projectName:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				
				envStateList:["不可用","已启用","已过期"],
				maxTableHeight:300,
				// 	{
				// 		value: "0",
				// 		label: "不可用",
				// 	},
				// 	{
				// 		value: "1",
				// 		label: "已启用",
				// 	},
				// 	{
				// 		value: "2",
				// 		label: "已过期",
				// 	},

				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmEnvLists();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmEnvLists();
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
				this.getXmEnvLists();
			},
			searchXmEnvLists(){
				 this.pageInfo.count=true; 
				 this.getXmEnvLists();
			},
			//获取列表 XmEnvList xm_env_list
			getXmEnvLists() {
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
					params.fuzzy = '%'+this.filters.key+'%';
					//params.xxx=this.filters.key
				} 
				if(this.projectInfo && this.projectInfo.id){
					params.projectId=this.projectInfo.id
				}
				
				if(this.xmProduct && this.xmProduct.id){
					params.linkProductId=this.xmProduct.id
				}
				this.load.list = true;
				params.branchId = this.userInfo.branchId;
				listXmEnvList(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmEnvLists = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmEnvList xm_env_list
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmEnvList xm_env_list
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmEnvLists();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getXmEnvLists();
			},
			//选择行xmEnvList
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmEnvList
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmEnvList(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmEnvLists();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmEnvList
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmEnvList(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmEnvLists(); 
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			toAccessUrl(row){
				window.open(row.accessUrl,row.name,null,true)
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-env-list-add':XmEnvListAdd,
		    'xm-env-list-edit':XmEnvListEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => { 
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el); 
				this.getXmEnvLists();
        	}); 
		}
	}

</script>

<style scoped>

</style>