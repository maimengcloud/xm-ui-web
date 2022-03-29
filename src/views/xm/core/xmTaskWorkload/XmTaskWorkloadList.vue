<template>
	<section>
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTaskWorkloads" icon="el-icon-search">查询</el-button>
			<span style="float:right;">
			<el-button type="primary" @click="showAdd" icon="el-icon-plus"> </el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
			</span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmTaskWorkload 工时登记表-->
			<el-table ref="xmTaskWorkloadTable" :data="xmTaskWorkloads"  @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>
 				<el-table-column prop="username" label="姓名" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="bizDate" label="业务日期" min-width="80" show-overflow-tooltip></el-table-column> 
 				<el-table-column prop="wstatus" label="状态" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="remark" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="ttype" label="任务类型" min-width="80" show-overflow-tooltip :formatter="formatterOption"></el-table-column>
 				<el-table-column prop="workload" label="实际工时" min-width="80" show-overflow-tooltip></el-table-column>
 				<el-table-column prop="rworkload" label="剩余工时" min-width="80" show-overflow-tooltip></el-table-column> 
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row> 

			<!--新增 XmTaskWorkload 工时登记表界面-->
			<el-dialog :title="'任务【'+xmTask.name+'】新增工时'" :visible.sync="addFormVisible"  width="60%" top="20px"  append-to-body  :close-on-click-modal="false">
				<xm-task-workload-edit op-type="add" :xm-task="xmTask" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-task-workload-edit>
			</el-dialog>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { listXmTaskWorkload, delXmTaskWorkload, batchDelXmTaskWorkload } from '@/api/xm/core/xmTaskWorkload';
	import  XmTaskWorkloadEdit from './XmTaskWorkloadEdit';//新增修改界面
	import { mapGetters } from 'vuex'

	export default {
	    name:'xmTaskWorkloadMng',
		components: {
		    XmTaskWorkloadEdit,
		},
		props:['xmTask','visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchXmTaskWorkloads()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmTaskWorkloads: [],//查询结果
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
				dicts:{
					taskType:[],
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmTaskWorkload界面是否显示
				addForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:''
				},

				editFormVisible: false,//编辑界面是否显示
				editForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: {
			
			formatterOption: function (row, column, cellValue, index) {
				var columnName = column.property;
				var key = columnName; 
				if(columnName==='ttype'){
					key="taskType"
				} 
				if (
					this.dicts[key] == undefined ||
					this.dicts[key] == null ||
					this.dicts[key].length == 0
				) {
					return cellValue;
				}
				var list = this.dicts[key].filter((i) => i.id == cellValue);
				if (list.length > 0) {
					return list[0].name;
				} else {
					return cellValue;
				}
			},
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmTaskWorkloads();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmTaskWorkloads();
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
				this.getXmTaskWorkloads();
			},
			searchXmTaskWorkloads(){
				 this.pageInfo.count=true;
				 this.getXmTaskWorkloads();
			},
			//获取列表 XmTaskWorkload 工时登记表
			getXmTaskWorkloads() {
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
				if(this.filters.key){
					params.key=this.filters.key
				}
				if(!this.xmTask || !this.xmTask.id){
					return;
				}
				
				params.taskId=this.xmTask.id

				this.load.list = true;
				listXmTaskWorkload(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmTaskWorkloads = res.data.data;
					}else{
						this.$notify({ showClose:true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmTaskWorkload 工时登记表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmTaskWorkload 工时登记表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmTaskWorkloads();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmTaskWorkload
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除xmTaskWorkload
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = {  id:row.id };
					delXmTaskWorkload(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getXmTaskWorkloads();
						}
						this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmTaskWorkload
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { id:i.id}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmTaskWorkload(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmTaskWorkloads();
						}
						this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
			    this.editForm=row
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },

		},//end methods
		mounted() {
			this.$nextTick(() => {
			   
				initSimpleDicts('all',[ 'taskType' ]).then(res=>{
					this.dicts=res.data.data;
				})
			    this.initData()
				this.searchXmTaskWorkloads();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmTaskWorkloadTable.$el)

        	});
		}
	}

</script>

<style scoped>
</style>
