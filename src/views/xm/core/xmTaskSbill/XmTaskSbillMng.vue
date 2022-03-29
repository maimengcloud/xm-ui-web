<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" clearable style="width: 20%;" placeholder="模糊查询:编号/标题/项目名称"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTaskSbills" icon="el-icon-search">查询</el-button>
<!--			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>-->
      <span style="float:right;">
				<el-button type="primary" icon="el-icon-plus" @click="showAdd" round></el-button>
      </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmTaskSbill 任务结算表-->
			<el-table ref="xmTaskSbillTable" :data="xmTaskSbills" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list"
                border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;" :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}">
<!--				<el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>-->
				<el-table-column label="序号" type="index" min-width="55" show-overflow-tooltip></el-table-column>
				<el-table-column prop="id" label="结算单编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="title" label="结算单标题" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectId" label="项目编号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectName" label="项目名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="amt" label="金额" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="ctime" label="创建时间" min-width="60" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.ctime.substr(0, 10) }}
          </template>
        </el-table-column>
<!--				<el-table-column prop="cuserid" label="创建人编号" min-width="80" show-overflow-tooltip></el-table-column>-->
				<el-table-column prop="cusername" label="创建人姓名" min-width="60" show-overflow-tooltip></el-table-column>
				<el-table-column prop="remark" label="备注" min-width="80" show-overflow-tooltip>
          <template scope="scope">
            <span v-if="scope.row.remark">{{scope.row.remark}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
<!--				<el-table-column prop="branchId" label="机构编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="deptid" label="部门编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="cpId" label="相对方编号(机构写机构号，个人写个人编号)" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="cpName" label="相对方名称（机构写机构名称，个人写个人名称）" min-width="80" show-overflow-tooltip></el-table-column>-->
				<el-table-column prop="workload" label="结算工时" min-width="80" show-overflow-tooltip></el-table-column>
<!--				<el-table-column prop="bizMonth" label="业务月份yyyy-MM" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="bizDate" label="业务日期yyyy-MM-dd" min-width="80" show-overflow-tooltip></el-table-column>-->
				<el-table-column prop="bizFlowState" label="审批状态" min-width="60" show-overflow-tooltip>
          <template scope="scope">
            <el-tag v-if="scope.row.bizFlowState=='0'">未发审</el-tag>
            <el-tag type="warning" v-else-if="scope.row.bizFlowState=='1'">审批中</el-tag>
            <el-tag type="success" v-else-if="scope.row.bizFlowState=='2'">已通过</el-tag>
            <el-tag type="danger" v-else-if="scope.row.bizFlowState=='3'">未通过</el-tag>
            <el-tag type="info" v-else-if="scope.row.bizFlowState=='4'">已取消</el-tag>
            <el-tag v-else>未发审</el-tag>
          </template>
        </el-table-column>
<!--				<el-table-column prop="bizProcInstId" label="审批编号" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column prop="ltime" label="更新时间" min-width="80" show-overflow-tooltip></el-table-column>-->
				<el-table-column prop="status" label="结算单状态" min-width="60" show-overflow-tooltip>
          <template scope="scope">
            <span v-if="scope.row.status=='0'">待提交</span>
            <span v-else-if="scope.row.status=='1'">已提交</span>
            <span v-else-if="scope.row.status=='2'">已通过</span>
            <span v-else-if="scope.row.status=='3'">已付款</span>
            <span v-else-if="scope.row.status=='4'">已完成</span>
          </template>
        </el-table-column>
				<el-table-column prop="fmsg" label="最后审核意见" min-width="80" show-overflow-tooltip>
          <template scope="scope">
            <span v-if="scope.row.fmsg">{{scope.row.fmsg}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
				<el-table-column label="操作" width="145" fixed="right">
					<template scope="scope">
            <el-button type="text">发审</el-button>
						<el-button type="text" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button type="text" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
            <el-button type="text" @click="addWorkload(scope.row,scope.$index)" icon="el-icon-plus"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 XmTaskSbill 任务结算表界面-->
			<el-drawer title="编辑任务结算单" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <xm-task-sbill-edit op-type="edit" :xm-task-sbill="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-task-sbill-edit>
			</el-drawer>
			<!--新增 XmTaskSbill 任务结算表界面-->
			<el-drawer title="新增任务结算单" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<xm-task-sbill-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-task-sbill-edit>
			</el-drawer>
      <!--添加登记工时界面-->
      <el-drawer title="添加工时登记单" :visible.sync="taskWorkloadVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
        <select-task-workload :xm-task-sbill="thisBillRow" :visible="taskWorkloadVisible" @cancel="taskWorkloadVisible=false" @submit="afterWorkloadSubmit"></select-task-workload>
      </el-drawer>
    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { listXmTaskSbill, delXmTaskSbill, batchDelXmTaskSbill } from '@/api/xm/core/xmTaskSbill';
	import  XmTaskSbillEdit from './XmTaskSbillEdit';//新增修改界面
	import { mapGetters } from 'vuex'
  import SelectTaskWorkload from "./SelectTaskWorkload";
  import {editXmTaskSbill} from "../../../../api/xm/core/xmTaskSbill";
  import dateUtil from "../../../../common/js/dateUtil";
  import {editXmTaskWorkload} from "../../../../api/xm/core/xmTaskWorkload";

	export default {
		components: {
      XmTaskSbillEdit,
      SelectTaskWorkload,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchXmTaskSbills()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmTaskSbills: [],//查询结果
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
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmTaskSbill界面是否显示
				//新增xmTaskSbill界面初始化数据
				addForm: {
					id:'',title:'',amt:'',ctime:'',cuserid:'',cusername:'',remark:'',branchId:'',deptid:'',cpId:'',cpName:'',workload:'',bizMonth:'',bizDate:'',bizFlowState:'',bizProcInstId:'',ltime:'',status:'',fmsg:'',projectId:'',projectName:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmTaskSbill界面初始化数据
				editForm: {
					id:'',title:'',amt:'',ctime:'',cuserid:'',cusername:'',remark:'',branchId:'',deptid:'',cpId:'',cpName:'',workload:'',bizMonth:'',bizDate:'',bizFlowState:'',bizProcInstId:'',ltime:'',status:'',fmsg:'',projectId:'',projectName:''
				},
				maxTableHeight:300,
        taskWorkloadVisible:false,
        thisBillRow:{},//添加工时的结算单
        projectId:'',//添加工时的项目编号
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmTaskSbills();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmTaskSbills();
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
				this.getXmTaskSbills();
			},
			searchXmTaskSbills(){
				 this.pageInfo.count=true;
				 this.getXmTaskSbills();
			},
			//获取列表 XmTaskSbill 任务结算表
			getXmTaskSbills() {
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
					params.key= "%"+ this.filters.key + "%"
				}

				this.load.list = true;
				listXmTaskSbill(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmTaskSbills = res.data.data;
					}else{
						this.$notify({ showClose:true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmTaskSbill 任务结算表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmTaskSbill 任务结算表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmTaskSbills();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmTaskSbill
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除xmTaskSbill
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
          let params = Object.assign({}, row);
					delXmTaskSbill(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getXmTaskSbills();
						}
						this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmTaskSbill
			batchDel: function () {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmTaskSbill(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmTaskSbills();
						}
						this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
      initData: function(){

      },
			/**begin 自定义函数请在下面加**/
      addWorkload(row,index){
        if(row.status!='0'){
          this.$notify({ showClose:true, message: "只能修改待提交的数据", type: 'error'});
          return;
        }
        if(!(row.bizFlowState=='0' || row.bizFlowState=='3')){
          this.$notify({ showClose:true, message: "只能修改未发审、未通过的数据", type: 'error'});
          return;
        }
        this.thisBillRow = Object.assign({},row);
        this.taskWorkloadVisible = true;
      },
      afterWorkloadSubmit(row){
        this.taskWorkloadVisible = false;
        this.thisBillRow.workload = this.thisBillRow.workload + row.workload;
        this.thisBillRow.amt = this.thisBillRow.amt + row.samt;
        //修改xmTaskSbill
        this.changeXmTaskSbill(this.thisBillRow);
        //更新xmTaskWokload现状
        this.changeXmTaskWorkload(row,this.thisBillRow);
      },
      changeXmTaskSbill(data){
        let params = Object.assign({}, data);
        editXmTaskSbill(params).then((res) => {
          let tips=res.data.tips;
          if(tips.isOk){
            this.getXmTaskSbills();
          }
          this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
        }).catch( err =>{});
      },
      changeXmTaskWorkload(data,sbill){
        let params={
          id:data.id,
          sstatus:'2',//2为已提交结算
          stime:this.formatDate("YYYY-mm-dd HH:MM",new Date()),
          sbillId:sbill.id
        }
        editXmTaskWorkload(params).then((res) => {
          let tips=res.data.tips;
          if(tips.isOk){
          }
          this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
        }).catch( err =>{});
      },
      dateFormat(fmt, date) {
        let ret;
        const opt = {
          "Y+": date.getFullYear().toString(),        // 年
          "m+": (date.getMonth() + 1).toString(),     // 月
          "d+": date.getDate().toString(),            // 日
          "H+": date.getHours().toString(),           // 时
          "M+": date.getMinutes().toString(),         // 分
          "S+": date.getSeconds().toString()          // 秒
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
          ret = new RegExp("(" + k + ")").exec(fmt);
          if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
          };
        };
        return fmt;
  }
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
			    this.initData()
				this.searchXmTaskSbills();
				if(this.$refs.xmTaskSbillTable){
				    var clientRect=this.$refs.xmTaskSbillTable.$el.getBoundingClientRect();
                    var subHeight=70/1000 * window.innerHeight;
                    this.maxTableHeight =  window.innerHeight -clientRect.y - this.$refs.xmTaskSbillTable.$el.offsetTop-subHeight;
				}

        	});
		}
	}

</script>

<style scoped>
</style>
