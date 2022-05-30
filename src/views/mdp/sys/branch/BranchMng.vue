<template>
  <section>
    <el-row  class="app-container">
      <el-input v-model="filters.key" style="width: 30%;" placeholder="模糊查询">
        <template slot="append">
           <el-button   v-loading="load.list" v-on:click="searchBranchs" icon="el-icon-search"></el-button>
        </template>
      </el-input>
      <el-button type="primary" @click="showAdd" icon="el-icon-plus">机构</el-button>
      <el-button   @click="handleDownload" icon="el-icon-download">导出数据</el-button>
      <el-button
        type="danger"
        v-loading="load.del"
        @click="batchDel"
        :disabled="this.sels.length===0"
        icon="el-icon-delete"
      > </el-button>
    </el-row>
    <el-row class="app-container">
      <!--列表 Branch 管理端机构表（机构下面若干部门）--> 
      <el-table
	  	ref="table"
        :data="branchs"
        highlight-current-row
        v-loading="load.list"
         style="width: 100%;margin-bottom: 20px;"
        border
        @selection-change="selsChange"
        @row-click="rowClick" 
      >
        <el-table-column   type="selection" width="40"></el-table-column>
        <el-table-column   type="index" width="40"></el-table-column> 
        <el-table-column
          sortable
          prop="branchName"
          label="机构名称"
          min-width="250"
        >
          
          <template slot-scope="scope">
            {{scope.row.id}}	- <el-link  @click.stop="showEdit(scope.row,scope.$index)"  type="primary">{{scope.row.branchName}}</el-link>  
            <el-tooltip  :content="showApprovaInfo(scope.row)" placement="bottom" effect="light">
              <el-tag v-if="scope.row.flowState=='0' || scope.row.flowState==null" type="warning">未发审</el-tag> 
              <el-tag v-else-if="scope.row.flowState=='1'"  type="primary">审核中</el-tag> 
              <el-tag v-else-if="scope.row.flowState=='2'"  type="success">已通过</el-tag>
              <el-tag v-else-if="scope.row.flowState=='3'" type="danger">未通过</el-tag>
              <el-tag v-else-if="scope.row.flowState=='4'" type="info">已取消</el-tag> 
          </el-tooltip> 
          </template>
        </el-table-column>
        <el-table-column
          sortable
          prop="industryCategory"
          label="行业分类"
          min-width="80"
          show-overflow-tooltip
        >
			<template slot-scope="scope">
				{{ formatDicts(dicts,'industryCategory',scope.row.industryCategory)}}  
			</template>
		</el-table-column>
        <el-table-column sortable prop="enabled" label="启用" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enabled=='1'" type="success">√</el-tag>
            <el-tag v-else type="danger">×</el-tag>
          </template>
        </el-table-column>  
        <el-table-column sortable prop="cdate" label="创建日期" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column
          sortable
          prop="cusername"
          label="创建人姓名"
          min-width="80"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column sortable prop="phoneNo" label="电话" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column sortable prop="emaill" label="邮件" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column  label="操作" width="200"   fixed="right">
          <template slot-scope="scope">
            <el-button    @click="showUserDept(scope.$index,scope.row)"  type="primary" icon="el-icon-user">用户</el-button>
            <el-dropdown @command="handleCommand" :hide-on-click="false">
              <span class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-success"  :command="{type:'sendToProcessApprova',row:scope.row}">新机构注册审核</el-dropdown-item> 
                <el-dropdown-item icon="el-icon-edit"  :command="{type:'showEdit',index:scope.$index,row:scope.row}">修改基本信息</el-dropdown-item>
                <el-dropdown-item icon="el-icon-user"   :command="{type:'showUserDept',index:scope.$index,row:scope.row}">机构用户管理</el-dropdown-item>
                <el-dropdown-item icon="el-icon-remove"   :command="{type:'handleDel',index:scope.$index,row:scope.row}">删除该机构</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> 
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        
        layout="total, sizes, prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10,20, 50, 100, 500]"
        :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        :total="pageInfo.total"
        style="float:right;"
      ></el-pagination> 
      <!--编辑 Branch 管理端机构表（机构下面若干部门）界面-->
      <el-dialog
        title="编辑机构"
        :visible.sync="editFormVisible"
        width="60%"
		  top="20px"
        :close-on-click-modal="false"
      >
        <branch-edit
          :branch="editForm"
		  op-type="edit" 
          :visible="editFormVisible"
          @cancel="editFormVisible=false"
          @submit="afterEditSubmit"
        ></branch-edit>
      </el-dialog>

      <!--新增 Branch 管理端机构表（机构下面若干部门）界面-->
      <el-dialog
        title="新增机构"
        :visible.sync="addFormVisible"
        width="60%"
		
		  top="20px"
        :close-on-click-modal="false"
      >
        <branch-add
          :branch="addForm"
		  op-type="add"
          :visible="addFormVisible"
          @cancel="addFormVisible=false"
          @submit="afterAddSubmit"
        ></branch-add>
      </el-dialog>

      <!--查看公司拥有的所有用户界面-->
      <el-dialog
        title="用户管理"
        top="5vh"
        :visible.sync="userDeptFormVisible"
        width="50%"
        :close-on-click-modal="false"
      >
        <user-dept-list
          
          :branch-id="editForm.id"
          :visible="userDeptFormVisible"
          @cancel="userDeptFormVisible=false"
        ></user-dept-list>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import util from "@/common/js/util"; //全局公共库
import config from "@/common/config"; //全局公共库 
import { initDicts,listBranch, delBranch, batchDelBranch } from "@/api/mdp/sys/branch"; 
import BranchEdit from "./BranchEdit"; //修改界面
import UserDeptList from "../userDept/UserDeptList"; //用户部门关系维护
import { mapGetters } from "vuex";

export default {
  name:"BranchMng",
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      filters: {
        key: ""
      },
      branchs: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        pageNum: 1, //当前页码、从1开始计算
        orderFields: [], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: [] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      dicts: {
		  industryCategory:[],
	  }, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false, //新增branch界面是否显示
      //新增branch界面初始化数据
      addForm: {
        id:'',branchName:'',enabled:'',industryCategory:'',cuserid:'',cdate:'',cusername:'',lphoneNo:'',emaill:'',bizProcInstId:'',bizFlowState:'',pbranchId:'',admUserid:'',admUsername:'',lusername:'',luserid:'',address:''
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑branch界面初始化数据
      editForm: {
        id:'',branchName:'',enabled:'',industryCategory:'',cuserid:'',cdate:'',cusername:'',lphoneNo:'',emaill:'',bizProcInstId:'',bizFlowState:'',pbranchId:'',admUserid:'',admUsername:'',lusername:'',luserid:'',address:''
      },
      /**begin 自定义属性请在下面加 请加备注**/
      userDeptFormVisible: false,
			tableHeight:500,
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
	  ...util,
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.pageInfo.count = true;

      this.getBranchs();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getBranchs();
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange(obj) {
      var dir = "asc";
      if (obj.order == "ascending") {
        dir = "asc";
      } else {
        dir = "desc";
      }
      if (obj.prop == "xxx") {
        this.pageInfo.orderFields = ["xxx"];
        this.pageInfo.orderDirs = [dir];
      }
      this.getBranchs();
    },
    searchBranchs() {
      this.pageInfo.count = true;
      this.getBranchs();
    },
    //获取列表 Branch 管理端机构表（机构下面若干部门）
    getBranchs() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count
      };
      if (
        this.pageInfo.orderFields != null &&
        this.pageInfo.orderFields.length > 0
      ) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(
            this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i]
          );
        }
        params.orderBy = orderBys.join(",");
      }
      if (this.filters.key !== "") {
        params.key = "%" + this.filters.key + "%";
      } else {
        //params.xxx=xxxxx
      }
      if (!this.userInfo.isSuperAdmin) {
        params.id = this.userInfo.branchId;
      }
      this.load.list = true;
      listBranch(params)
        .then(res => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            this.branchs = res.data.data;
          } else {
            this.$notify({ message: tips.msg, type: "error" });
          }
          this.load.list = false;
        })
        .catch(() => {
          this.load.list = false;
          //this.$notify({ message: '通讯错误', type: 'error' });
        });
    },

    //显示编辑界面 Branch 管理端机构表（机构下面若干部门）
    showEdit: function(row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 Branch 管理端机构表（机构下面若干部门）
    showAdd: function() {
      this.addFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    //显示新增界面 Dept sys_dept
    showUserDept: function(index, row) {
      this.editForm = Object.assign({}, row);
      this.userDeptFormVisible = true;
      //this.addForm=Object.assign({}, this.editForm);
    },
    afterAddSubmit() {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.getBranchs();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },
    //选择行branch
    selsChange: function(sels) {
      this.sels = sels;
    },
    //删除branch
    handleDel: function(row, index) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.load.del = true;
          let params = row;
          delBranch(params).then(res => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getBranchs();
            }
            this.$notify({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          });
        })
        .catch(() => (this.load.del = false));
    },
    //批量删除branch
    batchDel: function() {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.load.del = true;
          batchDelBranch(this.sels).then(res => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              this.getBranchs();
            }
            this.$notify({
              message: tips.msg,
              type: tips.isOk ? "success" : "error"
            });
          });
        })
        .catch(() => (this.load.del = false));
    },
    rowClick: function(row, event, column) {
      this.$emit("row-click", row, event, column); //  @row-click="rowClick"
    },
    /**begin 自定义函数请在下面加**/
    handleDownload() {
      console.log(JSON.stringify(this.branchs));
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "行业分类",
          "机构名称",
          "流程审批机构号",
          "流程实例编号",
          "审批状态",
          "是否启用",
          "联系电话",
          "创建时间",
          "审批意见",
          "流程标题",
          "邮件",
          "创建人姓名",
          "最后更新时间",
          "审批环节",
          "机构编号",
          "审批人",
          "创建人编号"
        ];
        const filterVal = [
          "industryCategory",
          "branchName",
          "flowBranchId",
          "procInstId",
          "agree",
          "enabled",
          "phoneNo",
          "cdate",
          "commentMsg",
          "mainTitle",
          "emaill",
          "cusername",
          "flowLastTime",
          "taskName",
          "id",
          "assignee",
          "cuserid"
        ];
        const list = this.branchs;
        const data = this.formatJson(filterVal, list);
        var filename = "公司管理导出";
        if (this.formDefSelected) {
          filename = this.formDefSelected.formName
            ? this.formDefSelected.formName
            : this.formDefSelected.id + "公司管理导出";
        }
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: filename,
          autoWidth: true,
          bookType: "xlsx"
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    showApprovaInfo:function(row){
      var msgFields=[];
      if(row.mainTitle!=null && row.mainTitle!=""){
        msgFields.push("流程【"+row.mainTitle+"】");
      }
      
      if(row.taskName!=null && row.taskName!=""){
        msgFields.push("当前环节【"+row.taskName+"】");
      }
      
      if(row.assigneeName!=null && row.assigneeName!=""){
        msgFields.push("执行人【"+row.assigneeName+"】");
      }
      
      if(row.commentMsg!=null && row.commentMsg!=""){
        msgFields.push("审批意见【"+row.commentMsg+"】");
      }
      var msg=msgFields.join(",");
      return msg;
    },
    sendToProcessApprova:function(row){ 
        // 传过来的参数格式
        if(row.flowState=='1'){
          this.$notify.error("审核中，不允许重复发审");
          return;
        }
				let extVars={branchId:row.id}
        let jsonExtVars=JSON.stringify(extVars); 

        var currDomain=window.location.protocol+"//"+window.location.host;
        var fullPath=this.$route.fullPath; 
        var bizUrl=currDomain+'/#'+fullPath+'?extVars='+jsonExtVars

				let params={ 
						mainContext:'关于【'+row.branchName+"】的机构入驻审批",
            mainTitle:'关于【'+row.branchName+"】的机构入驻审批",
            bizKey:'company_register',
						bizUrl:bizUrl,
						restUrl:config.getSysBasePath()+"/sys/branch/processApprova",
						extVars:extVars,
						flowVars:{
              subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
              branchId:row.id
            },
				}
				let jsonParmas=encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
				this.$router.push({path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}}); 
    },
			handleCommand(command) { 
        if(command.type=='sendToProcessApprova'){
          this.sendToProcessApprova(command.row);
        }else if(command.type=='showEdit'){
          this.showEdit(command.row,command.index);
        }else if(command.type=='showUserDept'){
          this.showUserDept(command.index,command.row);
        }else if(command.type=='handleDel'){
          this.handleDel(command.row,command.index);
        } 
			}

    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    "branch-add": BranchEdit,
    "branch-edit": BranchEdit,
     
    "user-dept-list": UserDeptList
    //在下面添加其它组件
  },
  mounted() { 
	  initDicts(this);
    this.$nextTick(() => {
		this.tableHeight = util.calcTableMaxHeight(this.$refs.table.$el) 
      this.getBranchs();
    }); 
  }
};
</script>

<style scoped>
</style>