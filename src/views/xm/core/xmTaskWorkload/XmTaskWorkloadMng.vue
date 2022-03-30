<template>
	<section class="page-container border padding">
		<el-row>
      <xm-project-select style="display:inline;" ref="xmProjectSelect" :auto-select="false"  @row-click="onProjectConfirm" @clear-select="clearProject"></xm-project-select>
			<el-input v-model="filters.key" style="width: 30%;" clearable placeholder="模糊查询:员工ID/员工名称/项目ID/任务编号"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTaskWorkloads" icon="el-icon-search">查询</el-button>
<!--			<el-button type="primary" @click="showAdd" icon="el-icon-plus"> </el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>-->
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmTaskWorkload 工时登记表-->
			<el-table ref="xmTaskWorkloadTable" :data="xmTaskWorkloads" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row
                v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;" :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}">
				<el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip></el-table-column>
        <el-table-column prop="id" label="编号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectId" label="归属项目" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="userid" label="员工编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="username" label="姓名" min-width="80" show-overflow-tooltip></el-table-column>
<!--				<el-table-column prop="ctime" label="创建日期" min-width="80" show-overflow-tooltip></el-table-column>-->
				<el-table-column prop="taskId" label="任务编号" min-width="80" show-overflow-tooltip></el-table-column>
<!--				<el-table-column prop="cuserid" label="创建人编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="bizDate" label="业务日期yyyy-MM-dd" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="wstatus" label="状态0-待确认，1-已确认，2-无效" min-width="80" show-overflow-tooltip></el-table-column>-->
				<el-table-column prop="remark" label="备注" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.remark">{{scope.row.remark}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
<!--				<el-table-column prop="ttype" label="任务类型-关联字典taskType" min-width="80" show-overflow-tooltip></el-table-column>-->
<!--				<el-table-column prop="sbillId" label="结算单据编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="stime" label="结算提交时间" min-width="80" show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="toSbill" label="结算" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="cell-bar">
              <xm-task-sbill-select style="display:inline;" :auto-select="false"  :project-id="scope.row.projectId"    placeholder="结算"  @row-click="editXmWorkloadSomeFields(scope.row,$event)"></xm-task-sbill-select>
						</span>
          </template>
        </el-table-column>
				<el-table-column prop="sstatus" label="结算状态" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sstatus=='0'">无需结算</span>
            <span v-else-if="scope.row.sstatus=='1'">待结算</span>
            <span v-else-if="scope.row.sstatus=='2'">已提交</span>
            <span v-else-if="scope.row.sstatus=='3'">已通过</span>
            <span v-else-if="scope.row.sstatus=='4'">已结算</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
				<el-table-column prop="amt" label="工时金额" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.amt">{{scope.row.amt}}</span>
            <span v-else>0</span>
          </template>
        </el-table-column>
				<el-table-column prop="samt" label="结算金额" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.samt">{{scope.row.samt}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
				<el-table-column prop="workload" label="工时" min-width="80" show-overflow-tooltip></el-table-column>
<!--				<el-table-column prop="rworkload" label="剩余工时（同一天取最后日期更新到task表rworkload中）" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="cusername" label="创建人姓名" min-width="80" show-overflow-tooltip></el-table-column>-->

<!--				<el-table-column label="操作" width="180" fixed="right">
					<template scope="scope">
						<el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>-->
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 XmTaskWorkload 工时登记表界面-->
			<el-drawer title="编辑工时登记表" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <xm-task-workload-edit op-type="edit" :xm-task-workload="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-task-workload-edit>
			</el-drawer>

			<!--新增 XmTaskWorkload 工时登记表界面-->
			<el-drawer title="新增工时登记表" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<xm-task-workload-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-task-workload-edit>
			</el-drawer>
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
  import XmProjectSelect from "../components/XmProjectSelect";
  import XmTaskSbillSelect from "./XmTaskSbillSelect";
  import {editWorkloadToSbill} from "../../../../api/xm/core/xmTaskWorkload";

	export default {
	    name:'xmTaskWorkloadMng',
		components: {
		    XmTaskWorkloadEdit,
      XmProjectSelect,
      XmTaskSbillSelect,
		},
		props:['visible'],
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
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmTaskWorkload界面是否显示
				addForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:'',rworkload:'',cusername:'',projectId:''
				},

				editFormVisible: false,//编辑界面是否显示
				editForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:'',rworkload:'',cusername:'',projectId:''
				},
				maxTableHeight:300,
        selProject:'',
			}
		},//end data
		methods: {
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
					count:this.pageInfo.count,
          toSbill:true
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key){
					params.key= "%" + this.filters.key + "%"
				}
        if(this.selProject){
          params.projectId= this.selProject;
        }

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
      onProjectConfirm(obj){
			  this.selProject = obj.projectId;
			  this.getXmTaskWorkloads();
      },
      clearProject(){
			  this.selProject = null;
        this.getXmTaskWorkloads();
      },
      editXmWorkloadSomeFields(workload,row,fieldName,$event){
        let params={
          projectId:row.projectId
        };
        if(this.sels.length>0){
          if(!this.sels.some(k=>k.projectId==row.projectId)){
            this.$notify({showClose:true,message:'存在不同项目的工时单，请重新选择',type:'warning'})
            return;
          }
          params.ids=this.sels.map(i=>i.id);
        }else{
          params.ids = [workload.id];
        }
        params.sbillId = row.id;

        editWorkloadToSbill(params).then(res=>{
          let tips = res.data.tips;
          if(tips.isOk){
            this.getXmTaskWorkloads();
          }else{
            this.$notify({showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
          }
        })
      },
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
			    this.initData()
				this.searchXmTaskWorkloads();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmTaskWorkloadTable.$el)

        	});
		}
	}

</script>

<style scoped>
</style>
