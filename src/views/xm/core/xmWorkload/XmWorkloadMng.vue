<template>
	<section class="page-container border padding">
		<el-row>
      <xm-project-select style="display:inline;" ref="xmProjectSelect" :auto-select="false"  @row-click="onProjectConfirm" @clear="clearProject"></xm-project-select>
      <el-select v-if="wstatuses && wstatuses.toString()=='0,2'" v-model="filters.wstatus" clearable @change="searchXmWorkloads" placeholder="请选择工时单状态">
        <el-option label="全部状态" value=""></el-option>
        <el-option label="待确认" value="0"></el-option> 
      </el-select>

      <el-select v-if="sstatuses && sstatuses.toString()!='1'" v-model="filters.sstatus" clearable @change="searchXmWorkloads" placeholder="请选择工时单状态">
        <el-option label="全部结算状态" value=""></el-option>
        <el-option label="无需结算" value="0"></el-option>
        <el-option label="已提交" value="2"></el-option>
        <el-option label="已通过" value="3"></el-option>
        <el-option label="已结算" value="4"></el-option>
      </el-select>
			<el-input v-model="filters.key" style="width: 150px;" clearable placeholder="模糊查询员工名称"></el-input>
			<el-input v-model="filters.userid" style="width: 150px;" clearable placeholder="员工编号"></el-input>
			<el-input v-model="filters.taskId" style="width: 150px;" clearable placeholder="任务编号"></el-input>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" @click="searchXmWorkloads" icon="el-icon-search">查询</el-button>
      
      <span style="float:right;">
<!--			<el-button type="primary" @click="showAdd" icon="el-icon-plus"> </el-button>-->
      <el-button type="warning" v-loading="load.edit" @click="batchSetSbillIdNull" :disabled="this.sels.length===0 || load.edit==true" icon="el-icon-setting">移出结算单</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>
      <el-popover placement="top-start" title="更多查询条件" width="500" v-model="moreVisible" trigger="manual" >
        <el-row>
          <el-col :span="24"  style="padding-top:5px;">
            <span class="more-label-font">创建时间:</span>
            <el-date-picker v-model="dateRanger" type="daterange" align="right" unlink-panels range-separator="至"
                            start-placeholder="开始日期" end-placeholder="完成日期" value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['00:00:00','23:59:59']" :picker-options="pickerOptions"></el-date-picker>
          </el-col>
          <el-col  :span="24"  style="padding-top:10px;">
            <span class="more-label-font">创建人:</span>
            <el-tag v-if="filters.pmUser" closable @click="selectFiltersPmUser" @close="clearFiltersPmUser()">{{filters.pmUser.username}}</el-tag>
            <el-button   v-else @click="selectFiltersPmUser()">选择</el-button>
            <el-button    @click="setFiltersPmUserAsMySelf()">我的</el-button>
          </el-col>
          <el-col  :span="24"  style="padding-top:10px;">
            <el-button type="text"  @click="moreVisible=false" >关闭</el-button><el-button type="primary"  @click="searchXmWorkloads" >查询</el-button>
          </el-col>
        </el-row>
        <el-button slot="reference" @click="moreVisible=!moreVisible" icon="el-icon-more"></el-button>
      </el-popover>
      </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmWorkload 工时登记表-->
			<el-table ref="xmWorkloadTable" :data="xmWorkloads"  :height="maxTableHeight" @sort-change="sortChange" highlight-current-row
                v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;" :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip fixed="left"></el-table-column>
 				<el-table-column prop="username" label="姓名" min-width="120" show-overflow-tooltip  sortable  fixed="left"> 
            <template slot-scope="scope"> 
              <span class="cell-text">
                {{scope.row.username}}
              </span>
              <span class="cell-bar">
                {{scope.row.userid}}-{{scope.row.username}}
              </span>
            </template>
        </el-table-column>
				<el-table-column prop="bizName" label="业务" min-width="120" show-overflow-tooltip  sortable  fixed="left">
          <template slot-scope="scope">
            
            <span class="cell-text">
               {{scope.row.bizName}}
            </span>
            <span class="cell-bar">
              <el-popover>
                   <xm-workload-simple-list :visible="scope.row.id==editForm.id" :xm-task="{id:scope.row.taskId,name:scope.row.taskName,projectName:scope.row.projectName,projectId:scope.row.projectId,budgetWorkload:scope.row.budgetWorkload,actWorkload:scope.row.actWorkload}"  ref="xmWorkloadSimpleList"></xm-workload-simple-list>
                   <el-button slot="reference" icon="el-icon-search" style="display:inline;">所有工时</el-button>
              </el-popover>
               
						</span>
          </template>
          
        </el-table-column> 
				<el-table-column prop="bizDate" label="工时日期" width="120" show-overflow-tooltip sortable  fixed="left">
          <template slot-scope="scope">
            <span>{{scope.row.bizDate}}</span>
          </template>
        </el-table-column>  
         <el-table-column prop="projectId" label="归属项目" min-width="120" show-overflow-tooltip sortable> 
            <template slot-scope="scope"> 
              <span class="cell-text">
                {{scope.row.projectName}}
              </span>
              <span class="cell-bar">
                {{scope.row.projectId}}-{{scope.row.projectName}}
              </span>
            </template>
         </el-table-column>
        <el-table-column  prop="wstatus" label="工时状态" width="120" show-overflow-tooltip  sortable >
          <template slot-scope="scope">
            <div class="cell-text">
              <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'wstatus',scope.row.wstatus)" :key="index" :type="item.className">{{item.name}}</el-tag>
             </div>
            <span class="cell-bar">
              <el-select  v-model="scope.row.wstatus" placeholder="工时状态"  style="display:block;"  @change="editXmWorkloadSomeFields(scope.row,'wstatus',$event)">
                <el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.wstatus" :key="index"></el-option>
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column  prop="sstatus" label="结算状态" width="120" show-overflow-tooltip  sortable>
          <template slot-scope="scope">
            <div class="cell-text">
              <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'sstatus',scope.row.sstatus)" :key="index" :type="item.className">{{item.name}}</el-tag> 
             </div>
            <span class="cell-bar">
              <el-select  v-model="scope.row.sstatus" placeholder="结算状态"  style="display:block;"  @change="editXmWorkloadSomeFields(scope.row,'sstatus',$event)">
                <el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.sstatus" :key="index"></el-option>
              </el-select>
            </span>
          </template>
        </el-table-column>
				<el-table-column prop="workload" label="登记工时" width="120" show-overflow-tooltip  sortable>
          <template slot-scope="scope">
            {{scope.row.workload}}h
          </template>
        </el-table-column>
        <!--
				<el-table-column prop="sworkload" label="结算工时" width="120" show-overflow-tooltip  sortable>
          <template slot-scope="scope"> 
            <span class="cell-text">
               {{scope.row.sworkload}}h
            </span>
            <span class="cell-bar">
              <el-input type="number" style="display:inline;" v-model="scope.row.sworkload"   placeholder="结算"  @change="editXmWorkloadSomeFields(scope.row,'sworkload',$event)"></el-input>
						</span>
          </template>
        </el-table-column>
				<el-table-column prop="amt" label="标准金额" width="120" show-overflow-tooltip  sortable>
          <template slot-scope="scope"> 
            <span class="cell-text">
              <span v-if="scope.row.amt">¥{{ scope.row.amt}}</span>
              <span v-else>-</span>
            </span>
            <span class="cell-bar">
              <el-input type="number" style="display:inline;"  v-model="scope.row.amt"   placeholder="标准金额"  @change="editXmWorkloadSomeFields(scope.row,'amt',$event)"></el-input>
						</span>
          </template> 
        </el-table-column>
        -->
        <!--
				<el-table-column prop="samt" label="结算金额" width="120" show-overflow-tooltip  sortable>  
          <template slot-scope="scope"> 
            <span class="cell-text">
              <span v-if="scope.row.samt">¥{{ scope.row.samt}}</span>
              <span v-else>-</span>
            </span>
            <span class="cell-bar">
              <el-input type="number" style="display:inline;"  v-model="scope.row.samt"    placeholder="结算金额"  @change="editXmWorkloadSomeFields(scope.row,'samt',$event)"></el-input>
						</span>
          </template>
        </el-table-column>
        <el-table-column v-if="sstatuses && sstatuses=='1'" prop="sbillId" label="结算单" width="120" show-overflow-tooltip  sortable>
          <template slot-scope="scope"> 
            <span class="cell-text">
               {{scope.row.sbillId}}
            </span>
            <span class="cell-bar">
              <xm-task-sbill-select style="display:inline;" :auto-select="false"  :project-id="scope.row.projectId"    placeholder="结算"  @row-click="editXmWorkloadSomeFields(scope.row,'sbillId',$event)"></xm-task-sbill-select>
						</span>
          </template>
        </el-table-column>
        -->
<!--				<el-table-column prop="cuserid" label="创建人编号" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="bizDate" label="业务日期yyyy-MM-dd" width="120" show-overflow-tooltip></el-table-column>-->
				
				<el-table-column prop="bizType" label="报工类型" width="120" show-overflow-tooltip>
					<template slot-scope="scope">
						<mdp-select-tag :disabled="true" v-model="scope.row.bizType" :dict="dicts['wlBizType']"></mdp-select-tag>
					</template> 
				</el-table-column> 
				<el-table-column prop="bizName" label="报工业务" width="120" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-link @click="openDialog(scope.row)">{{scope.row.bizName}}</el-link>
					</template>
				</el-table-column> 
				<el-table-column prop="remark" label="报工备注" width="120" show-overflow-tooltip></el-table-column>  
          <template slot-scope="scope"> 
            <span class="cell-text">
              <span v-if="scope.row.remark">{{ scope.row.remark}}</span>
              <span v-else>-</span>
            </span>
            <span class="cell-bar">
              <el-input  style="display:inline;"  v-model="scope.row.remark"    placeholder="备注"  @change="editXmWorkloadSomeFields(scope.row,'remark',$event)"></el-input>
						</span>
          </template>
        </el-table-column>
<!--				<el-table-column prop="ttype" label="任务类型-关联字典taskType" width="120" show-overflow-tooltip></el-table-column>-->
<!--				<el-table-column prop="sbillId" label="结算单据编号" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="stime" label="结算提交时间" width="120" show-overflow-tooltip></el-table-column>-->
<!--				<el-table-column prop="rworkload" label="剩余工时（同一天取最后日期更新到task表rworkload中）" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="cusername" label="创建人姓名" width="120" show-overflow-tooltip></el-table-column>-->

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
			<!--编辑 XmWorkload 工时登记表界面-->
			<el-drawer title="编辑工时登记表" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <xm-workload-edit op-type="edit" :xm-workload="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-workload-edit>
			</el-drawer>

			<!--新增 XmWorkload 工时登记表界面-->
			<el-drawer title="新增工时登记表" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<xm-workload-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-workload-edit>
			</el-drawer>
      <el-drawer title="选择员工" :visible.sync="selectFiltersPmUserVisible" size="60%" append-to-body>
        <users-select  @confirm="onFiltersPmUserSelected" ref="usersSelect"></users-select>
      </el-drawer> 


			
		<el-dialog title="任务明细" :visible.sync="taskDetailVisible" width="90%" top="20px" append-to-body>
			<xm-task-detail :visible="taskDetailVisible" :xm-task="{id:editForm.taskId,name:editForm.bizName}" :reload="true"></xm-task-detail>
		</el-dialog>
		
		<el-dialog title="缺陷明细" :visible.sync="bugDetailVisible" width="90%" top="20px" append-to-body>
			<xm-question-detail :visible="bugDetailVisible" :xm-question="{id:editForm.bugId,name:editForm.bizName}" :reload="true"></xm-question-detail>
		</el-dialog>
		
		<el-dialog title="测试用例明细" :visible.sync="caseDetailVisible" width="90%" top="20px" append-to-body>
			<xm-test-case-detail :visible="caseDetailVisible" :xm-test-case="{id:editForm.caseId,name:editForm.bizName}" :reload="true"></xm-test-case-detail>
		</el-dialog>
		
		<el-dialog title="执行用例明细" :visible.sync="planCaseDetailVisible" width="90%" top="20px" append-to-body>
			<xm-test-plan-case-detail :visible="planCaseDetailVisible" :xm-plan-test-case="{planId:editForm.planId,caseId:editForm.caseId,name:editForm.bizName}" :reload="true"></xm-test-plan-case-detail>
		</el-dialog>
		
		<el-dialog title="需求明细" :visible.sync="menuDetailVisible" width="90%" top="20px" append-to-body>
			<xm-menu-detail :visible="menuDetailVisible" :xm-menu="{id:editForm.menuId,name:editForm.bizName}" :reload="true"></xm-menu-detail>
		</el-dialog>

	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { listXmWorkload, delXmWorkload, batchDelXmWorkload,batchSetSbillIdNull } from '@/api/xm/core/xmWorkload';
	import  XmWorkloadEdit from './XmWorkloadEdit';//新增修改界面
	import { mapGetters } from 'vuex'
  import XmProjectSelect from "../components/XmProjectSelect";
  import XmTaskSbillSelect from "./XmTaskSbillSelect";
  import {editWorkloadToSbill} from "@/api/xm/core/xmWorkload";
  import {editXmWorkloadSomeFields} from "../../../../api/xm/core/xmWorkload";
  import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
  import XmWorkloadSimpleList from './XmWorkloadSimpleList';
	import { listXmTaskExecuser  } from '@/api/xm/core/xmTaskExecuser';
	import { listXmTask  } from '@/api/xm/core/xmTask';

	export default {
	    name:'xmWorkloadMng',
		components: {
		    XmWorkloadEdit,
      XmProjectSelect,
      XmTaskSbillSelect,
      UsersSelect,
      XmWorkloadSimpleList,
       
			"xm-task-detail":()=>import("../xmTask/XmTaskDetail"),
			"xm-question-detail":()=>import("../xmQuestion/XmQuestionDetail"),
			"xm-test-case-detail":()=>import("../xmTestCase/XmTestCaseDetail"),
			"xm-test-plan-case-detail":()=>import("../xmTestPlanCase/XmTestPlanCaseDetail"),
			"xm-menu-detail":()=>import("../xmMenu/XmMenuDetail"),
		},
		props:['visible','wstatuses','sstatuses','queryScope'/**my/all */,'sbillId','bizType'/*报工类型1-任务，2-缺陷，3-测试用例设计，4-测试执行 */,
		'xmMenu','xmTestCase','xmQuestion','xmTestPlanCase'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
      visible:{
        handler:function(o,n){
          if(n==true){
            this.initData();
            this.searchXmWorkloads()
          }
        },
        immediate: true
      },
      sbillId(){
        this.searchXmWorkloads();
      }
		},
		data() {
      const beginDate = new Date();
      const endDate = new Date();
      beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 );
			return {
				filters: {
					key: '',
          wstatus:'',
          sstatus:'',
          pmUser:'',
          taskId:'',
          userid:''
				},
				xmWorkloads: [],//查询结果
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
          wstatus:[{id:'0',name:'待确认'},{id:'1',name: '已确认'}],
          sstatus:[{id:'0',name:'无需结算'},{id:'1',name: '待结算'},{id:'2',name:'已提交'},{id:'3',name:'已通过'},{id:'4',name:'已结算'}]
          /**0-无需结算，1-待结算2-已提交3-已通过4-已结算 */
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmWorkload界面是否显示
				addForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:'',rworkload:'',cusername:'',projectId:''
				},

				editFormVisible: false,//编辑界面是否显示
				editForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:'',rworkload:'',cusername:'',projectId:''
				},
				maxTableHeight:300,
        selProject:'',
        moreVisible:false,
        pickerOptions:  util.getPickerOptions('datarange'),
        dateRanger: [],
        selectFiltersPmUserVisible:false,
        xmWorkloadSimpleListVisible:false,
			}
		},//end data
		methods: {
      ...util,
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmWorkloads();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmWorkloads();
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
				this.getXmWorkloads();
			},
			searchXmWorkloads(){
				 this.pageInfo.count=true;
				 this.getXmWorkloads();
			},
			//获取列表 XmWorkload 工时登记表
			getXmWorkloads() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
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
        if(this.sstatuses){
          params.sstatuses=this.sstatuses.join();
        }
        if(this.wstatuses){
          params.wstatuses=this.wstatuses.join();
        }
        if(this.filters.wstatus){
          params.wstatuses = this.filters.wstatus;
        }
        if(this.filters.sstatus){
          params.sstatuses = this.filters.sstatus;
        }
        
        if(this.filters.userid){
          params.userid = this.filters.userid;
        }
        if(this.filters.taskId){
          params.taskId = this.filters.taskId;
        }
        if(this.filters.pmUser){
          params.cuserid = this.filters.pmUser.userid;
        }
        if(this.dateRanger){
          params.startBidDate = this.dateRanger[0];
          params.endBizDate = this.dateRanger[1];
        }
        if(this.queryScope){
          params.queryScope=this.queryScope
        }else{
          params.queryScope="my"
        }
        if(this.sbillId){
          params.sbillId=this.sbillId
        }

				this.load.list = true;
				listXmWorkload(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmWorkloads = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmWorkload 工时登记表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmWorkload 工时登记表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmWorkloads();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmWorkload
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除xmWorkload
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = {  id:row.id };
					delXmWorkload(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getXmWorkloads();
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmWorkload
			batchSetSbillIdNull: function () {
				if(this.sels.length<=0){
				    return;
				}
        if(this.sels.some(i=>!i.sbillId)){
          this.$notify({position:'bottom-left',showClose:true, message:"请选中已加入结算单的工时", type: 'error'});
          return;
        }
				var params=this.sels.map(i=>{
				    return { id:i.id}
				})
				this.$confirm('确认移出结算单吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.edit=true;
					batchSetSbillIdNull(params).then((res) => {
						this.load.edit=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmWorkloads();
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.edit=false );
				});
			},
      
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
					batchDelXmWorkload(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmWorkloads();
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
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
			  this.getXmWorkloads();
      },
      clearProject(){
			  this.selProject = null;
        this.getXmWorkloads();
      },
      editXmWorkloadSomeFields(row,fieldName,$event){  
        let params={
          ids:[row.id],
        };
        if(this.sels.length>0){
          if(this.sels.some(k=>k.projectId!=row.projectId)){
            this.$notify({position:'bottom-left',showClose:true,message:'存在不同项目的工时单，请重新选择',type:'warning'})
            return;
          }
          params.ids=this.sels.map(i=>i.id); 
        }else{
          params.ids = [row.id]; 
          params[fieldName]=$event
        }
        var func = editXmWorkloadSomeFields
        if(fieldName==='sbillId'){
          func = editWorkloadToSbill
          params.sbillId=$event.id
        }else{ 
          params[fieldName]=$event
        }
        func(params).then(res=>{
          let tips = res.data.tips; 
          this.getXmWorkloads();
          if(tips.isOk){
          }else{
            this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
          }
        })
      }, 
      clearFiltersPmUser:function(){
        this.filters.pmUser=null;
        this.searchXmWorkloads();
      },
      selectFiltersPmUser(){
        this.selectFiltersPmUserVisible=true;
      },
      onFiltersPmUserSelected(users){
        if(users && users.length>0){
          this.filters.pmUser=users[0]
        }else{
          this.filters.pmUser=null;
        }
        this.selectFiltersPmUserVisible=false;
        this.searchXmWorkloads();
      },
      setFiltersPmUserAsMySelf(){
        this.filters.pmUser=this.userInfo;
        this.searchXmWorkloads();
      },
			openDialog(row){
				this.editForm=row
				if(row.bizType=='1'){
					this.taskDetailVisible=true
				}else if(row.bizType=='2'){
					this.bugDetailVisible=true
				}else if(this.bizType=='3'){
					this.caseDetailVisible=true
				}else if(this.bizType=='4'){
					this.planCaseDetailVisible=true
				}else if(this.bizType=='5'){
					this.menuDetailVisible=true
				}
			}

    },//end methods
		mounted() {
			this.$nextTick(() => {
			    //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
			    this.initData()
				  this.searchXmWorkloads();
          this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmWorkloadTable.$el)

      });
		},
    activated(){
      this.initData();
      this.searchXmWorkloads();
    }
	}

</script>

<style scoped>
</style>
