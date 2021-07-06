<template>
  <section>
    <el-row class="app-container">
      <!-- <el-col :xs="4" :sm="4" :md="3" :lg="3" :xl="3" class="hidden-md-and-down">
        <category-tree ref="categoryTree" multiple :expandOnClickNode="false" :defaultExpandAll="true" show-checkbox
          :current-key="addForm.categoryId" v-on:check-change="handleCategoryCheckChange"></category-tree>
      </el-col> -->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <!--列表 Procinst act_hi_procinst-->
        <el-row>
          <el-select v-model="filters.filterType" clearable placeholder="查询范围" class="hidden-lg-and-down">
            <el-option value="" label="全部"> </el-option>
            <el-option value="startUserId" label="我发起"> </el-option>
            <el-option value="partake" label="我参与"> </el-option>
            <el-option value="sponsors" label="我主办"> </el-option>
            <el-option value="monitors" label="我监控"> </el-option>
          </el-select>
          <el-select v-model="filters.procCategory" clearable filterable placeholder="选择分类" class="hidden-sm-and-down">
            <el-option v-for="item in categorys" :key="item" :label="item" :value="item"></el-option>
          </el-select>

          <el-date-picker v-model="filters.startTimeRanger" class="hidden-sm-and-down" type="daterange" align="right"
            unlink-panels range-separator="-" start-placeholder="创建日期" end-placeholder="创建日期" value-format="yyyy-MM-dd"
            :default-time="['00:00:00','23:59:59']" :picker-options="pickerOptions">
          </el-date-picker>
          <el-input v-model="filters.key" style="width:270px;" placeholder="模糊查询">
            <template slot="append">
              <el-button v-on:click="searchProcinsts" icon="el-icon-search">查询</el-button>
            </template>
          </el-input>
          <el-popover title="更多查询条件" placement="top-start" width="400" trigger="click">
            <el-row class="more-filter-item">
              <el-col :span="24">
                <font class="more-label-font">
                  查询范围
                </font>
                <el-select size="mini" v-model="filters.filterType" placeholder="查询范围">
                  <el-option value="" label="全部"> </el-option>
                  <el-option value="startUserId" label="我发起"> </el-option>
                  <el-option value="partake" label="我参与"> </el-option>
                  <el-option value="sponsors" label="我主办"> </el-option>
                  <el-option value="monitors" label="我监控"> </el-option>
                </el-select>
              </el-col>
              <el-col :span="24">
                <font class="more-label-font">
                  分类
                </font>
                <el-select size="mini"  v-model="filters.procCategory" clearable filterable placeholder="选择分类" >
                  <el-option v-for="item in categorys" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-col>
              <el-col :span="24">
                <font class="more-label-font">
                  标签查找
                </font>
                <el-row v-show="filters.tags && filters.tags.length>0">
                  <el-tag :key="tag.tagId" v-for="tag in filters.tags" :type="''" closable :disable-transitions="false"
                    @click="showTagSelect(false)" @close="handleFiltersTagClose(tag,'tags')">
                    {{tag.tagName}}
                  </el-tag>
                </el-row>
                <el-button v-if="filters.tags==null || filters.tags.length==0" size="mini"
                  @click.native="showTagSelect(false)">选择标签</el-button>
              </el-col>
              <el-col :span="24">
                <font class="more-label-font">
                  任务执行
                </font>
                <el-tag v-if="filters.assignee" :type="'success'" closable :disable-transitions="false"
                  @click="userSelectVisible=true" @close="handleFiltersTagClose('','assignee')">
                  {{filters.assignee.username}}
                </el-tag>
                <el-button v-else size="mini" @click.native="userSelectVisible=true">选择执行人</el-button>
              </el-col>
              <el-col :span="24">
                <font class="more-label-font">
                  开始日期：
                </font>
                <el-date-picker v-model="filters.startTimeRanger" type="daterange" align="right" unlink-panels
                  range-separator="-" start-placeholder="创建日期" end-placeholder="创建日期" value-format="yyyy-MM-dd"
                  :default-time="['00:00:00','23:59:59']" :picker-options="pickerOptions">
                </el-date-picker>
              </el-col>
              <el-col :span="24">

                <font class="more-label-font">
                  计划完成日期：
                </font>
                <el-date-picker v-model="filters.planFinishTimeRanger" type="daterange" align="right" unlink-panels
                  range-separator="-" start-placeholder="计划完成日期" end-placeholder="计划完成日期" value-format="yyyy-MM-dd"
                  :default-time="['00:00:00','23:59:59']" :picker-options="pickerOptions">
                </el-date-picker>
              </el-col>
              <!-- <el-col :span="24">
                <category-tree class="hidden-lg-and-up" ref="categoryTree" multiple :expandOnClickNode="false"
                  :defaultExpandAll="true" show-checkbox :current-key="addForm.categoryId"
                  v-on:check-change="handleCategoryCheckChange"></category-tree>
              </el-col> -->

              <el-col :span="24" style="margin-top: 11px;">
                <el-button size="mini" type="primary" v-on:click="searchProcinsts" icon="el-icon-search">查询</el-button>
              </el-col>

              <el-col :span="24">
                <el-divider content-position="left">其它操作</el-divider>
                <el-button size="mini" @click.native="showTagSelect(true)">给任务打标签</el-button>
                <el-button size="mini" @click="handleDownload">导出数据</el-button>
              </el-col>
            </el-row>
            <el-button slot="reference" icon="el-icon-more" style="margin-left: 13px;" circle></el-button>
          </el-popover>
        </el-row>
        <el-row style="padding-top:20px;">
          <el-table ref="table" :max-height="tableHeight" :data="procinsts" highlight-current-row
            v-loading="listLoading" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column type="index" width="40"></el-table-column>
            <el-table-column sortable prop="mainTitle" label="流程(点击详情)" min-width="300" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-link type="primary" @click="showEdit( scope.row,scope.$index)">{{scope.row.mainTitle}}</el-link>
              </template>
            </el-table-column>
            <el-table-column sortable prop="startDeptName" label="发起部门" min-width="180" show-overflow-tooltip>
            </el-table-column>
            <el-table-column sortable prop="startUsername" label="发起人" min-width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column sortable prop="tagNames" label="标签" min-width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag v-for="tagName in (scope.row.tagNames?scope.row.tagNames.split(','):[])" :key="tagName">
                  {{tagName}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column sortable prop="startTime" label="发起时间" min-width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column sortable prop="planFinishTime" label="到期时间" min-width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column sortable prop="endTime" label="结束时间" min-width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column sortable prop="duration" label="执行时长" min-width="120" show-overflow-tooltip
              :formatter="formatterDuration"></el-table-column>

            <el-table-column sortable prop="sponsors" label="主办" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="monitors" label="监控" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="deleteReason" label="删除原因" min-width="120" show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
            @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
            :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>
          <!--编辑 Execution act_ru_execution界面-->
          <el-dialog title="任务详情" fullscreen :visible.sync="editFormVisible" :width="dialogWidth()"
            :close-on-click-modal="false">
            <procinst-parames-execution-set :companyEmployees="companyEmployees" :companyDepts="companyDepts"
              :taskInfo="editForm" :procDefId="editForm.procDefId" :procInstId="editForm.procInstId"
              :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit">
            </procinst-parames-execution-set>
          </el-dialog>
        </el-row>
      </el-col>

      <el-dialog append-to-body title="选择员工" :visible.sync="userSelectVisible" width="60%">
        <users-select :select-userids="filters.assignee?[filters.assignee.userid]:[]" @confirm="onUserSelected">
        </users-select>
      </el-dialog>

      <el-dialog append-to-body title="标签条件" :visible.sync="tagSelectVisible" width="60%">
        <tag-mng :tagIds="filters.tags?filters.tags.map(i=>i.tagId):[]" :jump="true" @select-confirm="onTagSelected">
        </tag-mng>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
  import util from "@/common/js/util"; //全局公共库
  //import { getCompanyEmployees,getCompanyDepts,selectCacheOptions,getDefaultValue,getCodeName } from '../../../../../api/common/code';//下拉框数据查询
  import {
    listProcinst,
    delProcinst,
    batchDelProcinst
  } from "@/api/mdp/workflow/hi/procinst";
  import ProcinstParamesExecutionSet from "../../ru/procinstParames/ProcinstParamesExecutionSet"; //流程参数加载
  import {
    listCategorys
  } from "@/api/mdp/workflow/re/procdef";
  import Sticky from "@/components/Sticky"; // 粘性header组件
  import {
    mapGetters
  } from "vuex";
  import {
    listUser
  } from "@/api/mdp/sys/user"; //下拉框数据查询
  import {
    listDept
  } from "@/api/mdp/sys/dept"; //下拉框数据查询

  import CategoryTree from "@/views/mdp/arc/category/CategoryTree"; //修改界面
  import TagMng from "@/views/mdp/arc/tag/TagMng";
  import {
    batchInsertOrDeleteTags
  } from "@/api/mdp/workflow/ru/procinstTag";
  import UsersSelect from "@/views/mdp/sys/user/UsersSelect";

  export default {
    name: "ProcinstMng",
    computed: {
      ...mapGetters(["userInfo"]),
      screenWidth: function() {
        return screen.width;
      }
    },
    props: ["isMyMonitors", "isMyStart", "isMySponsors", "isMyPartake", "isAll"],
    data() {
      const fromStartTime = new Date();
      const toStartTime = new Date();
      fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7);
      return {
        filters: {
          key: "",
          otherParames: {},
          allBtn: false,
          procCategory: "",
          categoryId: "", //流程归档分类编号
          categoryTreeNodes: [],
          tags: [],
          startTimeRanger: [
            util.formatDate.format(fromStartTime, "yyyy-MM-dd"),
            util.formatDate.format(toStartTime, "yyyy-MM-dd")
          ],
          planFinishTimeRanger: [],
          endTimeRanger: [],
          assignee: null,
          filterType: '',
        },
        pickerOptions: {
          shortcuts: [{
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近两周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 * 2);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 * 3);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近四周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 * 4);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
        procinsts: [], //查询结果
        pageInfo: {
          //分页数据
          total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
          pageSize: 20, //每页数据
          pageNum: 1, //当前页码、从1开始计算
          orderFields: ["end_time_", "start_time_"], //排序列 如 ['sex','student_id']，必须为数据库字段
          orderDirs: ["desc", "desc"], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
          count: true
        },
        listLoading: false, //查询中...
        sels: [], //列表选中数据
        options: {}, //下拉选择框的所有静态数据 options.sex,options.project
        drawer: false,
        addFormVisible: false, //新增procinst界面是否显示
        //新增procinst界面初始化数据
        addForm: {
          id: "",
          procInstId: "",
          businessKey: "",
          procDefId: "",
          startTime: "",
          endTime: "",
          duration: "",
          startUserId: "",
          startActId: "",
          endActId: "",
          superProcessInstanceId: "",
          deleteReason: "",
          tenantId: "",
          name: ""
        },

        editFormVisible: false, //编辑界面是否显示
        //编辑procinst界面初始化数据
        editForm: {
          id: "",
          procInstId: "",
          businessKey: "",
          procDefId: "",
          startTime: "",
          endTime: "",
          duration: "",
          startUserId: "",
          startActId: "",
          endActId: "",
          superProcessInstanceId: "",
          deleteReason: "",
          tenantId: "",
          name: ""
        },
        /**begin 自定义属性请在下面加 请加备注**/
        companyEmployees: [],
        companyDepts: [],
        categorys: [],
        tagSelectVisible: false,
        isBatchSetProcTags: false,
        userSelectVisible: false,
        tableHeight: 300,
        /**end 自定义属性请在上面加 请加备注**/
      };
    }, //end data
    methods: {
      //获取代码对应的名称 用于数据反显 如 getCodeName(options.sex,'1');
      getCodeName(options, codeValue) {
        if (!options) return codeValue;
        let code = options.filter(i => i.codeValue == codeValue);
        if (code.length > 0) {
          return code[0].codeName;
        } else {
          return codeValue;
        }
      },

      dialogWidth: function() {
        if (screen.width > 500) {
          return "80%";
        } else {
          return "100%";
        }
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.pageInfo.pageNum = 1;
        this.getProcinsts();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getProcinsts();
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
        this.getProcinsts();
      },
      searchProcinsts() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.getProcinsts();
      },
      //获取列表 Procinst act_hi_procinst
      getProcinsts() {
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
        if (this.filters.key != "" && this.filters.key != null) {
          params.key = "%" + this.filters.key + "%";
        }
        if (this.filters.categoryId != "") {
          params.categoryId = this.filters.categoryId;
        }

        if (
          this.filters.categoryTreeNodes != null &&
          this.filters.categoryTreeNodes.length > 0
        ) {
          params.categoryIds = this.filters.categoryTreeNodes.map(i => i.id);
        }

        if (this.filters.tags != null && this.filters.tags.length > 0) {
          params.tagIds = this.filters.tags.map(i => i.tagId);
        }

        if (
          this.filters.startTimeRanger != null &&
          this.filters.startTimeRanger.length == 2
        ) {
          params.fromStartTime = this.filters.startTimeRanger[0] + " 00:00:00";
          params.toStartTime = this.filters.startTimeRanger[1] + " 23:59:59";
        }
        if (
          this.filters.planFinishTimeRanger != null &&
          this.filters.planFinishTimeRanger.length == 2
        ) {
          params.fromPlanFinishTime =
            this.filters.planFinishTimeRanger[0] + " 00:00:00";
          params.toPlanFinishTime =
            this.filters.planFinishTimeRanger[1] + " 23:59:59";
        }

        if (
          this.filters.endTimeRanger != null &&
          this.filters.endTimeRanger.length == 2
        ) {
          params.fromEndTime = this.filters.endTimeRanger[0] + " 00:00:00";
          params.toEndTime = this.filters.endTimeRanger[1] + " 23:59:59";
        }

        if (this.filters.assignee != null) {
          params.assignee = this.filters.assignee.userid;
        }

        if (this.filters.filterType == 'startUserId') {
          params.startUserId = this.userInfo.userid
        }
        if (this.filters.filterType == 'partake') {
          params.partake = this.userInfo.userid
        }
        if (this.filters.filterType == 'sponsors') {
          params.sponsors = '%' + this.userInfo.userid + '%'
        }
        if (this.filters.filterType == 'monitors') {
          params.monitors = '%' + this.userInfo.userid + '%'
        }
        if (this.filters.procCategory != "") {
          params.category = this.filters.procCategory;
        }
        params.tenantId = this.userInfo.branchId;
        this.listLoading = true;
        listProcinst(params)
          .then(res => {
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = res.data.total;
              this.pageInfo.count = false;
              this.procinsts = res.data.data;
            } else {
              this.$message({
                message: tips.msg,
                type: "error"
              });
            }
            this.listLoading = false;
          })
          .catch(() => {
            this.listLoading = false;
          });
      },

      //显示编辑界面 Procinst act_hi_procinst
      showEdit: function(row, index) {
        this.editFormVisible = true;
        var task = Object.assign({}, row);
        this.editForm = task;
      },
      //显示新增界面 Procinst act_hi_procinst
      showAdd: function() {
        this.addFormVisible = true;
        //this.addForm=Object.assign({}, this.editForm);
      },
      afterAddSubmit() {
        this.addFormVisible = false;
        this.pageInfo.count = true;
        this.pageInfo.total = 0;
        this.getProcinsts();
      },
      afterEditSubmit() {
        this.editFormVisible = false;
      },
      //选择行procinst
      selsChange: function(sels) {
        this.sels = sels;
      },
      //删除procinst
      handleDel: function(row, index) {
        this.$confirm("确认删除该记录吗?", "提示", {
            type: "warning"
          })
          .then(() => {
            this.listLoading = true;
            let params = {
              id: row.id
            };
            delProcinst(params).then(res => {
              this.listLoading = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.total = 0;
                this.pageInfo.count = true;
                this.getProcinsts();
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            });
          })
          .catch(() => {
            this.listLoading = false;
          });
      },
      //批量删除procinst
      batchDel: function() {
        var ids = this.sels.map(item => item.id);
        this.$confirm("确认删除选中记录吗？", "提示", {
            type: "warning"
          })
          .then(() => {
            this.listLoading = true;
            batchDelProcinst(ids).then(res => {
              this.listLoading = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.total = 0;
                this.getProcinsts();
              }
              this.$message({
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            });
          })
          .catch(() => {
            this.listLoading = false;
          });
      },
      rowClick: function(row, event, column) {
        this.$emit("row-click", row, event, column); //  @row-click="rowClick"
      },
      /**begin 自定义函数请在下面加**/

      searchMyPartake() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.filters.allBtn = false;
        this.filters.otherParames = {
          partake: this.userInfo.userid
        };
        this.getProcinsts();
      },
      searchMyStart() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.filters.allBtn = false;
        this.filters.otherParames = {
          startUserId: this.userInfo.userid
        };
        this.getProcinsts();
      },
      searchMySponsors() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.filters.allBtn = false;
        this.filters.otherParames = {
          sponsors: "%" + this.userInfo.userid + "%"
        };
        this.getProcinsts();
      },
      searchMyMonitors() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.filters.allBtn = false;
        this.filters.otherParames = {
          monitors: "%" + this.userInfo.userid + "%"
        };
        this.getProcinsts();
      },
      searchEnd() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.filters.allBtn = false;
        this.filters.otherParames = Object.assign(this.filters.otherParames, {
          isEnd: 1
        });
        this.getProcinsts();
      },
      searchNotEnd() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.filters.allBtn = false;
        this.filters.otherParames = Object.assign(this.filters.otherParames, {
          isEnd: 0
        });
        this.getProcinsts();
      },
      searchAll() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.filters.allBtn = true;
        if (
          this.isMyStart ||
          this.isMyMonitors ||
          this.isMySponsors ||
          this.isMyPartake
        ) {
          this.filters.otherParames = Object.assign(this.filters.otherParames, {
            isEnd: null
          });
        } else {
          this.filters.otherParames = {};
        }

        this.searchProcinsts();
      },
      formatterSuspensionState(row, column, cellValue) {
        return cellValue == 1 ? "激活的" : "挂起的";
      },
      formatterDuration(row, column, cellValue) {
        if (cellValue != null && cellValue != "") {
          if (cellValue < 1000 * 60) {
            return (cellValue / 1000).toFixed(0) + "秒";
          } else if (cellValue < 1000 * 60 * 60) {
            return (cellValue / 1000 / 60).toFixed(2) + "分";
          } else if (cellValue < 1000 * 60 * 60 * 24) {
            return (cellValue / 1000 / 60 / 60).toFixed(2) + "小时";
          } else if (cellValue < 1000 * 60 * 60 * 24 * 30) {
            return (cellValue / 1000 / 60 / 60 / 24).toFixed(2) + "天";
          } else {
            return (cellValue / 1000 / 60 / 60 / 24 / 30).toFixed(2) + "月";
          }
        } else {
          return cellValue;
        }
      },

      handleFiltersTagClose: function(tag, paramsName) {
        if (paramsName == "key") {
          this.filters.key = null;
        } else if (paramsName == "categoryTreeNodes") {
          this.filters.categoryTreeNodes = this.filters.categoryTreeNodes.filter(
            i => i.id != tag.id
          );
          this.$refs.categoryTree.$refs.nodeTree.setChecked(tag.id, false, false);
        } else if (paramsName == "procCategory") {
          this.filters.procCategory = null;
        } else if (paramsName == "tags") {
          this.filters.tags = this.filters.tags.filter(i => i.tagId != tag.tagId);
        } else if (paramsName == "assignee") {
          this.filters.assignee = null;
        }
      },

      onTagSelected(tags) {
        this.tagSelectVisible = false;
        if (this.isBatchSetProcTags == true) {
          //TOD 批量更新后台数据标签
          if (!tags || tags.length == 0) {
            this.$message.error("最少选中一个标签");
            this.isBatchSetProcTags = false;
            return;
          }
          var procinstTagsVos = [];
          this.sels.forEach(row => {
            var procinstTags = {
              procDefId: row.procDefId,
              procInstId: row.procInstId,
              branchId: row.branchId,
              userid: this.userInfo.userid,
              tags: tags.map(i => {
                return {
                  tagId: i.tagId,
                  tagName: i.tagName
                };
              })
            };
            procinstTagsVos.push(procinstTags);
          });
          var params = procinstTagsVos;

          batchInsertOrDeleteTags(params)
            .then(res => {
              this.isBatchSetProcTags = false;
              if (res.data.tips.isOk) {
                var tagIds = tags.map(i => i.tagId).join(",");
                var tagNames = tags.map(i => i.tagName).join(",");
                this.sels.forEach(row => {
                  row.tagIds = tagIds;
                  row.tagNames = tagNames;
                });
                this.$message.success("打标签成功");
              } else {
                this.$message.error(res.data.tips.msg);
              }
            })
            .catch(e => (this.isBatchSetProcTags = false));
        } else {
          if (tags == null) {
            this.filters.tags = null;
          } else {
            this.filters.tags = tags;
          }
        }
      },
      handleCategoryCheckChange(data, checked, indeterminate) {
        if (data.id == "C0") {
          //选择了根节点，默认不按分类查询
          this.filters.categoryTreeNodes = null;
          return;
        }
        var node = this.$refs.categoryTree.$refs.nodeTree.getCheckedNodes();
        console.log("node-------------" + JSON.stringify(node));
        this.filters.categoryTreeNodes = node;
      },
      showTagSelect: function(isBatchSetProcTags) {
        if (isBatchSetProcTags == true) {
          if (this.sels.length == 0) {
            this.$message.error("请选中流程任务");
            return false;
          }
          this.tagSelectVisible = true;
        } else {
          this.tagSelectVisible = true;
        }
        this.isBatchSetProcTags = isBatchSetProcTags;
      },

      onUserSelected: function(users) {
        this.userSelectVisible = false;
        this.filters.assignee = users[0];
      },
      handleDownload() {
        console.log(JSON.stringify(this.procinsts));
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = [
            "备用字段5",
            "开始节点编号",
            "标签编号",
            "部门编号",
            "主要操作---mainQx",
            "备用字段4",
            "备用字段1",
            "智能表单展示方式",
            "备用字段",
            "实际完成时间",
            "用户编号",
            "标签名称",
            "持续时间",
            "计划完成时间",
            "发起人编号",
            "参数编号",
            "主办人",
            "结束节点编号",
            "开始时间",
            "主键",
            "备用字段2",
            "流程实例编号 == superProcessInstanceId",
            "表单编号",
            "版次 --- rev",
            "是否关联自定义表单",
            "发起人名称",
            "流程实例编号",
            "流程定义编号",
            "删除原因",
            "回滚编号",
            "流程标题",
            "发起部门",
            "业务编码",
            "工作编号----tenantId",
            "流程名称",
            "结束时间",
            "备用字段3",
            "所属分类编号",
            "回滚类型",
            "监控人"
          ];
          const filterVal = [
            "fi",
            "startActId",
            "tagIds",
            "deptid",
            "mainQx",
            "fo",
            "fp",
            "formShowType",
            "pconfig",
            "realFinishTime",
            "userid",
            "tagNames",
            "duration",
            "planFinishTime",
            "startUserId",
            "paramsId",
            "sponsors",
            "endActId",
            "startTime",
            "id",
            "sp",
            "superProcessInstanceId",
            "formId",
            "rev",
            "isRefForm",
            "startUsername",
            "procInstId",
            "procDefId",
            "deleteReason",
            "callbackId",
            "mainTitle",
            "startDeptName",
            "businessKey",
            "tenantId",
            "name",
            "endTime",
            "tp",
            "categoryId",
            "callbackType",
            "monitors"
          ];
          const list = this.procinsts;
          const data = this.formatJson(filterVal, list);
          var filename = "历史流程";
          if (this.formDefSelected) {
            filename = this.formDefSelected.formName ?
              this.formDefSelected.formName :
              this.formDefSelected.id + "历史流程";
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
      }
      /**end 自定义函数请在上面加**/
    }, //end methods
    components: {
      //在下面添加其它组件
      "procinst-parames-execution-set": ProcinstParamesExecutionSet,
      sticky: Sticky,
      CategoryTree,
      TagMng,
      UsersSelect
    },
    mounted() {
      listCategorys({
        tenantId: this.userInfo.branchId
      }).then(res => {
        this.categorys = res.data.data;
      });
      this.$nextTick(() => {
        var clientRect = this.$refs.table.$el.getBoundingClientRect();
        var subHeight = 70 / 1000 * window.innerHeight;
        this.tableHeight = window.innerHeight - clientRect.y - this.$refs.table.$el.offsetTop - subHeight;
        if (this.isMyStart) {
          this.filters.filterType = "startUserId"
        } else if (this.isMyMonitors) {
          this.filters.filterType = "monitors"
        } else if (this.isMySponsors) {
          this.filters.filterType = "sponsors"
        } else if (this.isMyPartake) {
          this.filters.filterType = "partake"
        } else if (this.isAll) {

        }
        this.getProcinsts();
      });
    }
  };
</script>

<style scoped>
  .filters-show {
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 0px;
  }

  .filters-label {
    font-size: 14px;
    color: black;
    font-weight: bold;
  }

  .more-filter-item {
    margin: 20px 0px;
  }

  .more-filter-item .el-col {
    margin: 2px 2px;
  }

  .more-filter-item button {
    margin: 2px 2px;
  }

  .more-label-font {
    text-align: center;
    float: left;
    height: 28px;
    line-height: 28px;
    margin-right: 10px;
  }

  .el-popover__title {
    color: #303133;
    font-size: 18px;
    line-height: 1;
    margin-bottom: 12px;
    margin-top: 11px;
  }
</style>
