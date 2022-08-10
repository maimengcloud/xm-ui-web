<template>
	<section class="page-container border padding">
		<el-row>
      <xm-project-select style="display:inline;" ref="xmProjectSelect" :auto-select="false"  @row-click="onProjectConfirm" @clear="clearProject"></xm-project-select>
      <el-select v-model="filters.status" clearable @change="searchXmTaskSbills" placeholder="请选择结算单状态">
        <el-option label="全部状态" value=""></el-option>
        <el-option label="结算待提交" value="0"></el-option>
        <el-option label="结算已提交" value="1"></el-option>
        <el-option label="结算已通过" value="2"></el-option>
        <el-option label="结算已付款" value="3"></el-option>
        <el-option label="结算已完成" value="4"></el-option>
      </el-select>

      <el-select v-model="filters.bizFlowState" clearable @change="searchXmTaskSbills" placeholder="请选择审批状态">
        <el-option label="全部审批" value=""></el-option>
        <el-option label="审批待提交" value="0"></el-option>
        <el-option label="审批进行中" value="1"></el-option>
        <el-option label="审批已通过" value="2"></el-option>
        <el-option label="审批不通过" value="3"></el-option>
        <el-option label="流程取消" value="4"></el-option>
      </el-select>

			<el-input v-model="filters.key" clearable style="width: 20%;" placeholder="模糊查询:编号/标题/项目名称"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmTaskSbills" icon="el-icon-search">查询</el-button>
<!--			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete"></el-button>-->
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
            <el-button type="text"  @click="moreVisible=false" >关闭</el-button><el-button type="primary"  @click="searchXmTaskSbills" >查询</el-button>
          </el-col>
        </el-row>
        <el-button slot="reference" @click="moreVisible=!moreVisible" icon="el-icon-more"></el-button>
      </el-popover>

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
				<el-table-column label="序号" type="index" min-width="55"  fixed="left"></el-table-column>
				<el-table-column prop="id" label="结算单编号" width="120" show-overflow-tooltip fixed="left"> 
        </el-table-column>
				<el-table-column prop="title" label="结算单标题" width="180" show-overflow-tooltip fixed="left">
          <template slot-scope="scope">
            <el-link type="primary"  @click="showEdit( scope.row,scope.$index)">
              {{scope.row.title}}
            </el-link>
          </template>
        </el-table-column>
         <el-table-column prop="projectName" label="项目名称" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="amt" label="金额" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            ¥{{scope.row.amt}}
          </template>
        </el-table-column>
<!--				<el-table-column prop="branchId" label="机构编号" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="deptid" label="部门编号" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="cpId" label="相对方编号(机构写机构号，个人写个人编号)" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="cpName" label="相对方名称（机构写机构名称，个人写个人名称）" width="120" show-overflow-tooltip></el-table-column>-->
				<el-table-column prop="workload" label="结算工时" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.workload}}h
          </template>
        </el-table-column>
<!--				<el-table-column prop="bizMonth" label="业务月份yyyy-MM" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="bizDate" label="业务日期yyyy-MM-dd" width="120" show-overflow-tooltip></el-table-column>-->
				<el-table-column prop="bizFlowState" label="审批状态" width="120" show-overflow-tooltip>
          <template scope="scope">
            <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'bizFlowState',scope.row.bizFlowState)" :key="index" :type="item.className">{{item.name}}</el-tag>
          </template>
        </el-table-column>
<!--				<el-table-column prop="bizProcInstId" label="审批编号" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="ltime" label="更新时间" width="120" show-overflow-tooltip></el-table-column>-->
				<el-table-column prop="status" label="结算单状态" width="120" show-overflow-tooltip>
          <template scope="scope">
            <el-tag v-if="scope.row.status=='0'">待提交</el-tag>
            <el-tag type="warning" v-else-if="scope.row.status=='1'">已提交</el-tag>
            <el-tag type="success" v-else-if="scope.row.status=='2'">已通过</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status=='3'">已付款</el-tag>
            <el-tag type="info" v-else-if="scope.row.status=='4'">已完成</el-tag>
          </template>
        </el-table-column> 
				<el-table-column prop="ctime" label="提交时间" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.ctime.substr(0, 10) }}
          </template>
        </el-table-column>
<!--				<el-table-column prop="cuserid" label="创建人编号" width="120" show-overflow-tooltip></el-table-column>-->
				<el-table-column prop="cusername" label="提交人" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="remark" label="备注" width="120" show-overflow-tooltip>
          <template scope="scope">
            <span v-if="scope.row.remark">{{scope.row.remark}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
				<el-table-column label="操作" width="145" fixed="right">
					<template scope="scope">
            <el-button :disabled="scope.row.workload===0 && scope.row.amt===0" type="text" @click="sendToProcessApprova(scope.row)">发审</el-button>
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
			<el-dialog title="编辑任务结算单" :visible.sync="editFormVisible"  width="90%" top="20px" append-to-body   :close-on-click-modal="false">
				  <xm-task-sbill-edit op-type="edit" :xm-task-sbill="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-task-sbill-edit>
			</el-dialog>
			<!--新增 XmTaskSbill 任务结算表界面-->
			<el-drawer title="新增任务结算单" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<xm-task-sbill-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-task-sbill-edit>
			</el-drawer> 
      <el-drawer title="选择员工" :visible.sync="selectFiltersPmUserVisible" size="60%" append-to-body>
        <users-select  @confirm="onFiltersPmUserSelected" ref="usersSelect"></users-select>
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
  import {editXmTaskSbill} from "../../../../api/xm/core/xmTaskSbill";
  import dateUtil from "../../../../common/js/dateUtil";
  import {editXmWorkload} from "../../../../api/xm/core/xmWorkload";
  import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
  import XmProjectSelect from "../components/XmProjectSelect";

	export default {
		components: {
      XmTaskSbillEdit, 
      UsersSelect,
      XmProjectSelect,
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
      const beginDate = new Date();
      const endDate = new Date();
      beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 );
			return {
				filters: {
					key: '',
          status:'',
          bizFlowState:'',
          pmUser:null,//创建人
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
        moreVisible:false,
        pickerOptions:  util.getPickerOptions('datarange'),
        dateRanger: [],
        selectFiltersPmUserVisible:false,
        selProjectId:'',
      }
		},//end data
		methods: {
      ...util,
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
				if(this.filters.status){
				  params.status = this.filters.status
        }
				if(this.filters.bizFlowState){
				  params.bizFlowState = this.filters.bizFlowState;
        }

        if(this.filters.pmUser){
          params.cuserid = this.filters.pmUser.userid;
        }
        if(this.dateRanger){
          params.startTime = this.dateRanger[0];
          params.endTime = this.dateRanger[1];
        }
        if(this.selProjectId){
          params.projectId = this.selProjectId
        }


				this.load.list = true;
				listXmTaskSbill(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmTaskSbills = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
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
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
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
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
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
          this.$notify({position:'bottom-left',showClose:true, message: "只能修改待提交的数据", type: 'error'});
          return;
        }
        if(!(row.bizFlowState=='0' || row.bizFlowState=='3' || row.bizFlowState=='4')){
          this.$notify({position:'bottom-left',showClose:true, message: "只能修改未发审、未通过、已取消的数据", type: 'error'});
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
        this.changeXmWorkload(row,this.thisBillRow);
        this.getXmTaskSbills();
      },
      changeXmTaskSbill(data){
        let params = Object.assign({}, data);
        editXmTaskSbill(params).then((res) => {
          let tips=res.data.tips;
          if(tips.isOk){
            this.getXmTaskSbills();
          }
          this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
        }).catch( err =>{});
      },
      //添加到结算的要修改工时登记的状态
      changeXmWorkload(data,sbill){
        let params={
          id:data.id,
          sstatus:'2',//2为已提交结算
          stime:this.dateFormat("YYYY-mm-dd HH:MM:SS",new Date()),
          sbillId:sbill.id
        }
        editXmWorkload(params).then((res) => {
          let tips=res.data.tips;
          if(tips.isOk){
          }
          this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
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
      },
      clearFiltersPmUser:function(){
        this.filters.pmUser=null;
        this.searchXmTaskSbills();
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
        this.searchXmTaskSbills();
      },
      setFiltersPmUserAsMySelf(){
        this.filters.pmUser=this.userInfo;
        this.searchXmTaskSbills();
      },
      onProjectConfirm(obj){
        this.selProjectId = obj.projectId;
        this.searchXmTaskSbills();
      },
      clearProject(){
        this.selProjectId = null;
        this.searchXmTaskSbills();
      },


      sendToProcessApprova:function(row){
        if(row.workload===0 && row.amt===0){
          this.$notify.error("结算工时和金额同时为空")
          return;
        }

        var bizKey="xm_task_sbill";
        if( row.bizFlowState=='1' ){
          this.$notify.error("审批中，不允许重复发审");
          return;
        }
        if(row.bizFlowState =='2'){
          this.$notify.error("已审核通过，请勿重复发审");
          return;
        }

        let extVars={
          shopId:this.userInfo.shopId,
          branchId:this.userInfo.branchId,
          sbillId:row.id
        }
        let jsonExtVars=JSON.stringify(extVars);

        let currDomain=window.location.protocol+"//"+window.location.host;
        let fullPath=this.$route.fullPath;
        let bizUrl=currDomain+'/#'+fullPath+'?extVars='+jsonExtVars

        let mainTitle=''
        if(bizKey=='xm_task_sbill'){
          mainTitle='关于工时结算单【'+row.title+"】的审批"
        }else{
          this.$notify.error("暂不支持的业务审批");
          return;
        }
        let mainContext=mainTitle;

        let params={
          mainContext:mainContext,
          mainTitle:mainTitle,
          bizKey:bizKey,
          bizUrl:bizUrl,
          bizPkid:row.id,
          bizParentPkid:row.projectId,
          restUrl:config.getCoreBasePath()+"/xm/core/xmTaskSbill/processApprova",
          //restUrl:"http://localhost:8067/api/m1/xm/xm/xm/core/xmTaskSbill/processApprova",
          extVars:extVars,
          flowVars:{
            subscribeTaskEvent:'PROCESS_STARTED,PROCESS_COMPLETED,PROCESS_CANCELLED', 
            branchId:this.userInfo.branchId,
            sbillId:row.id
          },
        }
        let jsonParmas=encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
        this.$router.push({path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}});
      },
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    initSimpleDicts('all',['bizFlowState']).then(res=>this.dicts=res.data.data);
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
.click-style{
  cursor: pointer;
  color: #409EFF
}
</style>
