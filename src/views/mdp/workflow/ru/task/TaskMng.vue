<template>
  <section>
    <el-row class="page-container page-height">  
        <el-row class="page-header"> 
          <el-select v-model="filters.procCategory" clearable filterable placeholder="选择分类">
            <el-option v-for="item in categorys" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-input v-model="filters.key" class="input-width"  placeholder="模糊查询"> 
          </el-input> 
          <el-button type="primary"  @click="searchAssigneeToMeTasks" icon="el-icon-search">查询</el-button>
          <el-popover placement="top" width="375" trigger="manual" v-model="weixinContentVisible">
            <p>{{weixinContent}}</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="doCopyWeixinUrl">拷贝链接</el-button>
              <el-button type="primary" size="mini" @click="doCopyWeixinContent">拷贝内容</el-button>
            </div>
            <el-button slot="reference" v-show="assigneeToMe===false"
              v-on:click="showWeixin" class="hidden-sm-and-down">微信催办</el-button>
          </el-popover>
          <el-button v-show="assigneeToMe===false" class="hidden-sm-and-down" v-on:click="showSendSms">短信催办</el-button>

          <el-button v-show="assigneeToMe===false" class="hidden-sm-and-down" v-on:click="showOaMsg">OAMSG催办</el-button>

          <el-button @click.native="showTagSelect(false)" icon="el-icon-plus">标签</el-button>
          <el-button @click="moreFilterVisible = true" circle icon="el-icon-more"></el-button>


          <el-drawer title="更多查询条件" :visible.sync="moreFilterVisible"   append-to-body :size="400">
            <el-row class="page-container more-filter"> 
              
              <el-divider content-position="left">查询条件</el-divider>
              <el-row>
                <font>
                  流程分类
                </font>
                <el-select size="small" v-model="filters.procCategory" clearable filterable placeholder="选择分类">
                  <el-option v-for="item in categorys" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-row>

              <el-row>
                <font >
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
              </el-row>
              <el-row>
                <font >
                  开始日期
                </font>
                <el-date-picker v-model="filters.startTimeRanger" type="daterange" align="right" unlink-panels
                  range-separator="-" start-placeholder="创建日期" end-placeholder="创建日期" value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00','23:59:59']" :picker-options="pickerOptions"></el-date-picker>
              </el-row>
              <el-row>
                <font >
                  计划完成日期
                </font>
                <el-date-picker v-model="filters.planFinishTimeRanger" type="daterange" align="right" unlink-panels
                  range-separator="-" start-placeholder="计划完成日期" end-placeholder="计划完成日期"
                  value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00','23:59:59']"
                  :picker-options="pickerOptions"></el-date-picker>
              </el-row> 
              <el-row> 
                <el-button type="primary" @click="searchAssigneeToMeTasks" icon="el-icon-search"
                  style="margin-top: 11px;">查询</el-button>
              </el-row> 
              <el-row>
                <el-divider content-position="left">其它操作</el-divider>
                 <el-checkbox v-model="showCalendar">按日历风格显示</el-checkbox>
                <el-button @click.native="showTagSelect(true)">添加标签</el-button>
                <el-button @click="handleDownload">导出数据</el-button>
              </el-row>
            </el-row>

          </el-drawer>
          <el-row class="page-tips"><span></span></el-row>
        </el-row>
        <el-row v-if="showCalendar==false" class="page-main">
          <!--列表 Task act_ru_task-->
          <el-table ref="table" :data="tasks" highlight-current-row v-loading="listLoading" border
            @selection-change="selsChange" @row-click="rowClick" style="width: 100%;" :height="tableHeight">
            <el-table-column type="selection" width="40" v-if="screenWidth>=500" :class="'hidden-sm-and-down'">
            </el-table-column>
            <el-table-column type="index" width="40" :class="'hidden-sm-and-down'"></el-table-column>
            <el-table-column sortable prop="mainTitle" label="流程(点击详情)" min-width="300" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-link type="primary" @click="showTaskDetail( scope.row,scope.$index)">{{scope.row.mainTitle}}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="taskName" label="当前节点" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="tagNames" label="标签" min-width="100">
              <template slot-scope="scope">
                <el-tag v-for="tagName in (scope.row.tagNames?scope.row.tagNames.split(','):[])" :key="tagName">
                  {{tagName}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column sortable prop="startDeptName" label="发起部门" min-width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column sortable prop="startUsername" label="发起人" min-width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column sortable v-if="assigneeToMe===false" prop="assigneeName" label="执行人" min-width="100"
              show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="createTime" label="创建时间" min-width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column sortable prop="planFinishTime" label="到期时间" min-width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column v-if="assigneeToMe===false" prop="suspensionState" label="状态" min-width="80"
              :formatter="formatterSuspensionState"></el-table-column>

            <el-table-column sortable prop="delegation" label="代办" min-width="80" :formatter="formatterDelegation"
              show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="claimTime" label="委办时间" min-width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column sortable prop="description" label="备注" min-width="80" show-overflow-tooltip>
            </el-table-column>
            <el-table-column sortable v-if="assigneeToMe===false" prop="dueDate" label="处理时长" min-width="80"
              show-overflow-tooltip></el-table-column>
              <!--
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" @click="showTaskDetail( scope.row,scope.$index)">详情</el-button>
              </template>
            </el-table-column>
            -->
          </el-table>
          <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
            @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
            :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>
          <!--编辑 Execution act_ru_execution界面-->
        </el-row>  
        <el-calendar  v-if="showCalendar==true" v-loading="listLoading" v-model="filters.calendarDate">
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <template slot="dateCell" scope="{date, data}">
            <div :class="data.isSelected ? 'is-selected' : ''">
              <div>
                {{ data.day.split('-')[2] }}{{ data.isSelected ? '✔️' : ''}}
                <div v-for=" (i,index)  in  showCalendarDataTips(date,data)" :key="index">
                  <el-popover placement="right" trigger="hover">
                    <el-row>
                      <el-col>
                        <el-tag v-for=" tag in i.tags" :key="tag.id">{{tag.tagName+'('+tag.count+')'}}</el-tag>
                      </el-col>
                    </el-row>
                    <el-table :data="i.allTasks" max-height="450px">
                      <el-table-column width="40" type="index"></el-table-column>
                      <el-table-column sortable min-width="300" property="mainTitle" label="流程【任务】(点击详情)">
                        <template slot-scope="scope">
                          <el-link type="primary" @click="showTaskDetail( scope.row,scope.$index)">
                            {{scope.row.mainTitle}}【{{scope.row.taskName}}】
                          </el-link>
                        </template>
                      </el-table-column>
                      <el-table-column sortable min-width="100" property="assigneeName" label="执行人"></el-table-column>
                      <el-table-column sortable min-width="80" property="calStatus" label="状态">
                        <template slot-scope="scope">
                          <el-tag effect="dark" type="info" v-if="scope.row.calStatus=='开始'">开始</el-tag>
                          <el-tag effect="dark" type="warning" v-if="scope.row.calStatus=='到期'">到期</el-tag>
                          <el-tag effect="dark" type="success" v-if="scope.row.calStatus=='执行中'">执行中</el-tag>
                          <el-tag effect="dark" type="danger" v-if="scope.row.calStatus=='延期'">延期</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column sortable min-width="120" property="tagNames" label="标签">
                        <template slot-scope="scope">
                          <div v-if="scope.row.tagNames">
                            <el-tag effect="light" type v-for="(tagName,index) in scope.row.tagNames.split(',')"
                              :key="index">{{tagName}}</el-tag>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column sortable min-width="120" property="planFinishTime" label="到期时间" show-overflow-tooltip>
                      </el-table-column>
                    </el-table>
                    <div slot="reference">
                      <el-tag effect="dark" type="info" v-if="i.startTasksCount>0">{{'开始:'+i.startTasksCount}}</el-tag>
                      <el-tag effect="dark" type="warning" v-if="i.planFinishTasksCount>0">
                        {{'到期:'+i.planFinishTasksCount}}
                      </el-tag>
                      <el-tag effect="dark" type="success" v-if="i.runningTasksCount>0">{{'执行中:'+i.runningTasksCount}}
                      </el-tag>
                      <el-tag effect="dark" type="danger" v-if="i.delayTasksCount>0">{{'延期:'+i.delayTasksCount}}
                      </el-tag>
                    </div>
                  </el-popover>
                </div>
              </div>
            </div>
          </template>
        </el-calendar> 

      <el-dialog title="短信催办" :visible.sync="sendSmsVisible" :width="dialogWidth()" :close-on-click-modal="false">
        <send-sms :sms-body-params="smsBodyParams" :sms-user-list="smsUserList" :load-phoneno-by-userid="true"
          :visible="sendSmsVisible" @cancel="sendSmsVisible=false"></send-sms>
      </el-dialog>
      <el-drawer fullscreen title="任务详情" :visible.sync="editFormVisible" :size="dialogWidth()" :withHeader="false"
        :close-on-click-modal="false">
        <procinst-parames-execution-set :companyEmployees="companyEmployees" :companyDepts="companyDepts"
          :taskInfo="editForm" :procDefId="editForm.procDefId" :procInstId="editForm.procInstId"
          :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit">
        </procinst-parames-execution-set>
      </el-drawer>
      <el-dialog append-to-body title="标签条件" :visible.sync="tagSelectVisible" class="dialog-body" width="60%">
        <tag-mng :tagIds="filters.tags?filters.tags.map(i=>i.tagId):[]" :jump="true" @select-confirm="onTagSelected">
        </tag-mng>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
  import util from "../../../../../common/js/util"; // 全局公共库
  import {
    listAssigneeToAnyTasks,
    listAssigneeToMeTasks,
    listMyCandidateUserTasks,
    listAnyCandidateUserTasks,
    listMyCandidateGroupTasks,
    listAnyCandidateGroupTasks,
    delTask,
    batchDelTask
  } from "../../../../../api/mdp/workflow/ru/task";
  import {
    listUser
  } from "@/api/mdp/sys/user"; // 下拉框数据查询
  import {
    createShortToken
  } from "@/api/login"; // 下拉框数据查询
  import {
    listDept
  } from "@/api/mdp/sys/dept"; // 下拉框数据查询
  import ProcinstParamesExecutionSet from "../procinstParames/ProcinstParamesExecutionSet"; // 流程参数加载
  import SendSms from "@/views/mdp/sms/SendSms"; // 流程参数加载
  import {
    listCategorys
  } from "@/api/mdp/workflow/re/procdef";
  import Sticky from "@/components/Sticky"; // 粘性header组件
  import {
    mapGetters
  } from "vuex";
  import VueClipboard from "vue-clipboard2";
  import Vue from "vue";
  import CategoryTree from "@/views/mdp/arc/category/CategoryTree"; // 修改界面
  import TagMng from "@/views/mdp/arc/tag/TagMng";
  import {
    batchInsertOrDeleteTags
  } from "@/api/mdp/workflow/ru/procinstTag";

  VueClipboard.config.autoSetContainer = true; // add this line
  Vue.use(VueClipboard);

  export default {
    name: "TaskMng",
    props: ["assigneeToMe", "defaultShowCalendar", "isClaim"], // 待我执行的任务
    computed: {
      ...mapGetters(["userInfo", "myDepts", "myPosts"]),
      screenWidth: function() {
        return screen.width;
      }
    },
    activated: function() {
      if (this.assigneeToMe !== false) {
        if (this.isClaim == undefined || this.isClaim === false) {
          this.filters.assignee = this.userInfo.userid;
          this.getTasks();
        } else {
          this.searchMyCandidateUserTasks();
        }
      }
    },
    data() {
      const fromStartTime = new Date();
      const toStartTime = new Date();
      fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
      return {
        filters: {
          key: "",
          taskType: "0", // 0已领取待执行的任务，1待领取的个人业务,2待领取的部门业务
          candidateUser: "", // 候选用户编号
          candidateGroups: [], // 候选部门
          assignee: "", // 任务执行人
          procCategory: "", // 流程分类
          categoryId: "", // 归档分类
          categoryTreeNodes: [],
          tags: [],
          startTimeRanger: [
            util.formatDate.format(fromStartTime, "yyyy-MM-dd"),
            util.formatDate.format(toStartTime, "yyyy-MM-dd")
          ],
          planFinishTimeRanger: [],
          calendarDate: util.formatDate.format(toStartTime, 'yyyy-MM-dd'),
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
        tasks: [], // 查询结果
        pageInfo: {
          // 分页数据
          total: 0, // 服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
          pageSize: 20, // 每页数据
          pageNum: 1, // 当前页码、从1开始计算
          orderFields: ["create_time_"], // 排序列 如 ['sex','student_id']，必须为数据库字段
          orderDirs: ["desc"], // 升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
          count: true
        },
        listLoading: false, // 查询中...
        sels: [], // 列表选中数据
        options: {}, // 下拉选择框的所有静态数据 options.sex,options.project
        smsBodyParams: [], // 需要发短信的短信内容参数[assigneeName,taskName,createTime,starter]
        smsUserList: [{
          userid: "",
          phoneno: "",
          username: ""
        }], // 接受短信的人
        sendSmsVisible: false, // 是否显示发短信对话框
        addFormVisible: false, // 新增task界面是否显示
        weixinContentVisible: false, // 微信内容面板是否显示
        weixinContent: "", // 微信消息体
        // 新增task界面初始化数据
        addForm: {
          id: "",
          rev: "",
          executionId: "",
          procInstId: "",
          procDefId: "",
          name: "",
          parentTaskId: "",
          description: "",
          taskDefKey: "",
          owner: "",
          assignee: "",
          delegation: "",
          priority: "",
          createTime: "",
          dueDate: "",
          category: "",
          suspensionState: "",
          tenantId: "",
          formKey: "",
          claimTime: "",
          mainTitle: "",
          sponsors: "",
          userid: "",
          deptid: ""
        },

        editFormVisible: false, // 编辑界面是否显示
        // 编辑task界面初始化数据
        editForm: {
          id: "",
          rev: "",
          executionId: "",
          procInstId: "",
          procDefId: "",
          name: "",
          parentTaskId: "",
          description: "",
          taskDefKey: "",
          owner: "",
          assignee: "",
          delegation: "",
          priority: "",
          createTime: "",
          dueDate: "",
          category: "",
          suspensionState: "",
          tenantId: "",
          formKey: "",
          claimTime: "",
          mainTitle: "",
          sponsors: "",
          userid: "",
          deptid: ""
        },
        /** begin 自定义属性请在下面加 请加备注**/
        companyEmployees: [],
        companyDepts: [],
        myBranchDepts: [],
        categorys: [],
        tagSelectVisible: false,
        moreFilterVisible: false,
        showCalendar: true,
        tableHeight: 300,
        /** end 自定义属性请在上面加 请加备注**/
      };
    }, // end data
    methods: {
      // 获取代码对应的名称 用于数据反显 如 getCodeName(options.sex,'1');
      getCodeName(options, codeValue) {
        if (!options) return codeValue;
        const code = options.filter(i => i.codeValue == codeValue);
        if (code.length > 0) {
          return code[0].codeName;
        } else {
          return codeValue;
        }
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.pageInfo.pageNum = 1;
        this.getTasks();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getTasks();
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
        this.getTasks();
      },
      dialogWidth: function() {
        if (screen.width > 600) {
          return "60%";
        } else {
          return "80%";
        }
      },

      searchAssigneeToMeTasks() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.filters.taskType = "0";
        this.filters.assignee = this.userInfo.userid;
        this.getTasks();
      },
      searchAssigneeToAnyTasks() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.filters.taskType = "0";
        this.getTasks();
      },
      searchMyCandidateUserTasks() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.filters.taskType = "1";
        this.filters.candidateUser = this.userInfo.userid;
        this.filters.candidateGroups = this.myDepts
          .map(i => "_dept_" + i.deptid)
          .concat(this.myPosts.map(i => "_post_" + i.postId));
        this.getTasks();
      },
      searchAnyCandidateUserTasks() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.filters.taskType = "1";
        if (this.filters.candidateUser == "") {
          this.$message({showClose: true,
            message: "请先选择用户",
            type: "error"
          });
        } else {
          this.getTasks();
        }
      },
      searchMyCandidateGroupTasks() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.filters.taskType = "2";
        if (this.filters.candidateGroups.length <= 0) {
          this.$message({showClose: true,
            message: "请先选择部门",
            type: "error"
          });
        } else {
          this.getTasks();
        }
      },
      searchAnyCandidateGroupTasks() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.filters.taskType = "2";
        if (this.filters.candidateGroups.length <= 0) {
          this.$message({showClose: true,
            message: "请先选择部门",
            type: "error"
          });
        } else {
          this.getTasks();
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
        } else if (paramsName == "calendar") {
          this.showCalendar = !tag;
        }
      },
      onTagSelected(tags) {
        this.tagSelectVisible = false;
        if (this.isBatchSetProcTags == true) {
          // TOD 批量更新后台数据标签
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
          // 选择了根节点，默认不按分类查询
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
      showSendSms: function() {
        if (this.sels.length > 1) {
          this.$message({showClose: true,
            message: "一次只能给一个人发短信",
            type: "error"
          });
        } else if (this.sels.length < 1) {
          this.$message({showClose: true,
            message: "请选择一条任务",
            type: "error"
          });
        } else {
          const task = this.sels[0];
          this.smsBodyParams = [
            task.assigneeName,
            task.mainTitle + "-" + task.taskName,
            task.createTime,
            task.userid
          ];
          this.smsUserList = [{
            userid: task.assignee
          }];
          this.sendSmsVisible = true;
        }
      },
      showWeixin: function() {
        if (this.sels.length > 1) {
          this.$message({showClose: true,
            message: "一次只能给一个人发信",
            type: "error"
          });
          this.weixinContentVisible = false;
          return false;
        } else if (this.sels.length < 1) {
          this.$message({showClose: true,
            message: "请选择一条任务",
            type: "error"
          });
          this.weixinContentVisible = false;
          return false;
        } else {
          const task = this.sels[0];
          // var url=window.location.href;
          const url =
            window.location.protocol +
            "//" +
            window.location.host +
            "/oa/" +
            process.env.VERSION +
            "/#/mdp/workflow/ru/task/TaskListAssigneeToMe";

          createShortToken({
            userid: task.assignee,
            branchId: this.userInfo.branchId
          }).then(res => {
            if (res.data.tips.isOk) {
              var userToken = res.data.userToken;
              this.weixinContentVisible = true;
              this.weixinContent =
                task.assigneeName +
                "您好，您有任务【" +
                task.mainTitle +
                "-" +
                task.taskName +
                "】待处理，请登陆OA系统或者点击以下链接处理。" +
                url +
                "?userToken=" +
                userToken;
            }
          });
        }
      },
      showOaMsg: function() {
        if (this.sels.length > 1) {
          this.$message({showClose: true,
            message: "一次只能给一个人发信",
            type: "error"
          });
          return false;
        } else if (this.sels.length < 1) {
          this.$message({showClose: true,
            message: "请选择一条任务",
            type: "error"
          });
          return false;
        } else {
          const task = this.sels[0];
          var msgBody =
            task.assigneeName +
            "您好，您有任务【" +
            task.mainTitle +
            "-" +
            task.taskName +
            "】待处理，请登陆OA系统处理";

          const href =
            window.location.protocol +
            "//" +
            window.location.host +
            "/im/" +
            process.env.VERSION +
            "/#/mdp/im/messages/messageChat?toUserid=" +
            task.assignee +
            "&msgBody=" +
            msgBody;
          window.open(href, "_blank");
        }
      },
      doCopyWeixinUrl: function() {
        this.weixinContentVisible = false;
        const href =
          window.location.protocol +
          "//" +
          window.location.host +
          "/oa/" +
          process.env.VERSION +
          "/#/mdp/workflow/ru/task/TaskListAssigneeToMe";

        this.$copyText(href).then(e => {});
      },
      doCopyWeixinContent: function() {
        this.weixinContentVisible = false;
        this.$copyText(this.weixinContent).then(e => {});
      },
      // 获取列表 Task act_ru_task
      getTasks() {
        const params = {
          pageSize: this.pageInfo.pageSize,
          pageNum: this.pageInfo.pageNum,
          total: this.pageInfo.total,
          count: this.pageInfo.count
        };
        if (
          this.pageInfo.orderFields != null &&
          this.pageInfo.orderFields.length > 0
        ) {
          const orderBys = [];
          for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
            orderBys.push(
              this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i]
            );
          }
          params.orderBy = orderBys.join(",");
        }
        if (this.filters.key !== "") {
          params.key = "%" + this.filters.key + "%";
        }
        if (this.filters.procCategory != "") {
          params.procCategory = this.filters.procCategory;
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
          this.filters.candidateGroups != null &&
          this.filters.candidateGroups.length > 0
        ) {
          params.candidateGroups = this.filters.candidateGroups;
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
        params.tenantId = this.userInfo.branchId;
        this.listLoading = true;
        if (this.assigneeToMe) {
          if (this.filters.taskType == "0") {
            params.assignee = this.filters.assignee;
            listAssigneeToMeTasks(params)
              .then(res => {
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.pageInfo.total = res.data.total;
                  this.pageInfo.count = false;
                  var taskList = res.data.data;
                  taskList.forEach(i => {
                    i.taskId = i.id;
                    i.actId = i.taskDefKey;
                    i.taskName = i.name;
                  });
                  this.tasks = taskList;
                } else {
                  this.$message({showClose: true,
                    message: tips.msg,
                    type: "error"
                  });
                }
                this.listLoading = false;
              })
              .catch(() => {
                this.listLoading = false;
              });
          }
          if (this.filters.taskType == "1") {
            params.candidateUser = this.filters.candidateUser;
            listMyCandidateUserTasks(params)
              .then(res => {
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.pageInfo.total = res.data.total;
                  this.pageInfo.count = false;
                  this.tasks = res.data.data;
                  var taskList = res.data.data;
                  taskList.forEach(i => {
                    i.taskId = i.id;
                    i.actId = i.taskDefKey;
                    i.taskName = i.name;
                  });
                  this.tasks = taskList;
                } else {
                  this.$message({showClose: true,
                    message: tips.msg,
                    type: "error"
                  });
                }
                this.listLoading = false;
              })
              .catch(() => {
                this.listLoading = false;
              });
          }
          if (this.filters.taskType == "2") {
            params.candidateGroups = this.myDepts.map(i => i.deptid);
            listMyCandidateGroupTasks(params)
              .then(res => {
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.pageInfo.total = res.data.total;
                  this.pageInfo.count = false;
                  var taskList = res.data.data;
                  taskList.forEach(i => {
                    i.taskId = i.id;
                    i.actId = i.taskDefKey;
                    i.taskName = i.name;
                  });
                  this.tasks = taskList;
                } else {
                  this.$message({showClose: true,
                    message: tips.msg,
                    type: "error"
                  });
                }
                this.listLoading = false;
              })
              .catch(() => {
                this.listLoading = false;
              });
          }
        } else {
          if (this.filters.taskType == "0") {
            params.assignee = this.filters.assignee;
            listAssigneeToAnyTasks(params)
              .then(res => {
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.pageInfo.total = res.data.total;
                  this.pageInfo.count = false;
                  var taskList = res.data.data;
                  taskList.forEach(i => {
                    i.taskId = i.id;
                    i.actId = i.taskDefKey;
                    i.taskName = i.name;
                  });
                  this.tasks = taskList;
                } else {
                  this.$message({showClose: true,
                    message: tips.msg,
                    type: "error"
                  });
                }
                this.listLoading = false;
              })
              .catch(() => {
                this.listLoading = false;
              });
          }
          if (this.filters.taskType == "1") {
            params.candidateUser = this.filters.candidateUser;
            listAnyCandidateUserTasks(params)
              .then(res => {
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.pageInfo.total = res.data.total;
                  this.pageInfo.count = false;
                  var taskList = res.data.data;
                  taskList.forEach(i => {
                    i.taskId = i.id;
                    i.actId = i.taskDefKey;
                    i.taskName = i.name;
                  });
                  this.tasks = taskList;
                } else {
                  this.$message({showClose: true,
                    message: tips.msg,
                    type: "error"
                  });
                }
                this.listLoading = false;
              })
              .catch(() => {
                this.listLoading = false;
              });
          }
          if (this.filters.taskType == "2") {
            params.candidateGroups = this.filters.candidateGroups;
            listAnyCandidateGroupTasks(params)
              .then(res => {
                var tips = res.data.tips;
                if (tips.isOk) {
                  this.pageInfo.total = res.data.total;
                  this.pageInfo.count = false;
                  var taskList = res.data.data;
                  taskList.forEach(i => {
                    i.taskId = i.id;
                    i.actId = i.taskDefKey;
                    i.taskName = i.name;
                  });
                  this.tasks = taskList;
                } else {
                  this.$message({showClose: true,
                    message: tips.msg,
                    type: "error"
                  });
                }
                this.listLoading = false;
              })
              .catch(() => {
                this.listLoading = false;
              });
          }
        }
      },

      // 显示编辑界面 Task act_ru_task
      showTaskDetail: function(row, index) {
        
        this.editForm = Object.assign({}, row);
        this.editFormVisible = true;
        /**
        this.$router.push({
          name: "ProcinstParamesExecutionSetRoute",
          params: {
            taskInfo: row
          }
        });
         */
      },
      // 显示新增界面 Task act_ru_task
      showAdd: function() {
        this.addFormVisible = true;
        // this.addForm=Object.assign({}, this.editForm);
      },
      afterAddSubmit() {
        this.addFormVisible = false;
        this.pageInfo.total = 0;
        this.getTasks();
      },
      afterEditSubmit() {
        this.editFormVisible = false;
        this.getTasks();
      },
      // 选择行task
      selsChange: function(sels) {
        this.sels = sels;
      },
      // 删除task
      handleDel: function(row, index) {
        this.$confirm("确认删除该记录吗?", "提示", {
            type: "warning"
          })
          .then(() => {
            this.listLoading = true;
            const params = {
              id: row.id
            };
            delTask(params).then(res => {
              this.listLoading = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.total = 0;
                this.getTasks();
              }
              this.$message({showClose: true,
                message: tips.msg,
                type: tips.isOk ? "success" : "error"
              });
            });
          })
          .catch(() => {
            this.listLoading = false;
          });
      },
      // 批量删除task
      batchDel: function() {
        var ids = this.sels.map(item => item.id);
        this.$confirm("确认删除选中记录吗？", "提示", {
            type: "warning"
          })
          .then(() => {
            this.listLoading = true;
            batchDelTask(ids).then(res => {
              this.listLoading = false;
              var tips = res.data.tips;
              if (tips.isOk) {
                this.pageInfo.total = 0;
                this.getTasks();
              }
              this.$message({showClose: true,
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
      /** begin 自定义函数请在下面加**/
      formatterDept(row, column, cellValue) {
        var newValue = cellValue;
        if (this.companyDepts == null) {
          return newValue;
        }
        this.companyDepts.forEach(dept => {
          if (dept.deptid == cellValue) {
            newValue = dept.deptName;
            return;
          }
        });
        return newValue;
      },
      formatterUserid(row, column, cellValue) {
        var newValue = cellValue;
        if (this.companyEmployees == null) {
          return newValue;
        }
        this.companyEmployees.forEach(item => {
          if (item.userid == cellValue) {
            newValue = item.username;
          }
        });
        return newValue;
      },
      formatterUserids(row, column, cellValue) {
        var newValue = cellValue;
        if (cellValue == "" || cellValue == null) {
          return newValue;
        }
        if (this.companyEmployees == null) {
          return newValue;
        }
        this.companyEmployees.forEach(item => {
          if (cellValue.indexOf(item.userid) >= 0) {
            newValue = newValue.replace(item.userid, item.username);
          }
        });
        return newValue;
      },
      formatterSuspensionState(row, column, cellValue) {
        return cellValue == 1 ? "激活的" : "挂起的";
      },
      formatterDelegation(row, column, cellValue) {
        return cellValue == "PENDING" ? "是" : "否";
      },
      showCalendarDataTips: function(date, data) {
        var datas = this.tasks;
        var startTasks = [];
        var planFinishTasks = [];
        var runningTasks = [];
        var delayTasks = [];
        var tags = [];

        var now = new Date();
        var dateStr = util.formatDate.format(now, "yyyy-MM-dd");
        if (dateStr == data.day) {
          data.isSelected = true;
        }
        datas.forEach(i => {
          var task = Object.assign({}, i);
          if (task.createTime.indexOf(data.day) >= 0) {
            task.calStatus = "开始";
            startTasks.push(task);
          }

          if (task.planFinishTime) {
            if (task.planFinishTime.indexOf(data.day) >= 0) {
              task.calStatus = "到期";
              planFinishTasks.push(task);
            } else if (
              task.planFinishTime > data.day &&
              task.createTime < data.day
            ) {
              task.calStatus = "执行中";
              runningTasks.push(task);
            } else if (
              task.planFinishTime > data.day &&
              task.createTime > data.day
            ) {
              // 未开始
            } else if (task.planFinishTime < data.day && dateStr >= data.day) {
              task.calStatus = "延期";
              delayTasks.push(task);
            }
          } else {
            if (task.createTime < data.day) {
              task.calStatus = "执行中";
              runningTasks.push(task);
            } else if (task.createTime > data.day) {
              // 未开始
            }
          }
        });

        var allTasks = startTasks
          .concat(planFinishTasks)
          .concat(runningTasks)
          .concat(delayTasks);
        allTasks.forEach(i => {
          var tagIds = i.tagIds ? i.tagIds.split(",") : [];
          var tagNames = i.tagNames ? i.tagNames.split(",") : [];
          tagIds.forEach((tagId, index) => {
            var tag = tags.find(t => t.tagId == tagId);
            if (tag) {
              tag.count = tag.count + 1;
            } else {
              tag = {
                tagId: tagId,
                tagName: tagNames[index],
                count: 1
              };
              tags.push(tag);
            }
          });
        });

        var msg = {
          startTasks: startTasks,
          planFinishTasks: planFinishTasks,
          runningTasks: runningTasks,
          startTasksCount: startTasks.length,
          planFinishTasksCount: planFinishTasks.length,
          runningTasksCount: runningTasks.length,
          delayTasksCount: delayTasks.length,
          delayTasks: delayTasks,
          allTasks: allTasks,
          tags: tags
        };
        return [msg];
      },
      handleDownload() {
        console.log(JSON.stringify(this.tasks));
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = [
            "状态",
            "处理时长",
            "实际完成时间",
            "创建人",
            "参数编号",
            "主办人",
            "主键",
            "任务定义编码",
            "表单编号",
            "版次---rev",
            "范围编号",
            "优先----priority",
            "流程定义编号",
            "委办时间",
            "执行编号",
            "范围定义编号",
            "子任务计数--subTaskCount",
            "任务名称",
            "是否启用计数",
            "指派人",
            "任务定义编号",
            "监控人",
            "备用字段5",
            "父任务编号",
            "标签编号",
            "编号链接总数----idLinkCount",
            "部门编号",
            "主要操作----mainQx",
            "备注",
            "备用字段4",
            "备用字段1",
            "智能表单展示方式",
            "备用字段",
            "标签名称",
            "计划完成时间",
            "作用域类型",
            "执行人",
            "变量计数",
            "备用字段2",
            "所有权人",
            "是否关联自定义表单",
            "表单编码",
            "发起人",
            "流程实例编号",
            "子范围编号---subScopeId",
            "创建时间",
            "流程标题",
            "发起部门",
            "工作编号---tenantId",
            "是否代办",
            "所属分类",
            "备用字段3",
            "所属分类编号",
            "任务编号",
            "节点编号",
            "任务名称"
          ];
          const filterVal = [
            "suspensionState",
            "dueDate",
            "realFinishTime",
            "userid",
            "paramsId",
            "sponsors",
            "id",
            "taskDefKey",
            "formId",
            "rev",
            "scopeId",
            "priority",
            "procDefId",
            "claimTime",
            "executionId",
            "scopeDefinitionId",
            "subTaskCount",
            "name",
            "isCountEnabled",
            "assignee",
            "taskDefId",
            "monitors",
            "fi",
            "parentTaskId",
            "tagIds",
            "idLinkCount",
            "deptid",
            "mainQx",
            "description",
            "fo",
            "fp",
            "formShowType",
            "pconfig",
            "tagNames",
            "planFinishTime",
            "scopeType",
            "assigneeName",
            "varCount",
            "sp",
            "owner",
            "isRefForm",
            "formKey",
            "startUsername",
            "procInstId",
            "subScopeId",
            "createTime",
            "mainTitle",
            "startDeptName",
            "tenantId",
            "delegation",
            "category",
            "tp",
            "categoryId",
            "taskId",
            "actId",
            "taskName"
          ];
          const list = this.tasks;
          const data = this.formatJson(filterVal, list);
          var filename = "我的任务";
          if (this.formDefSelected) {
            filename = this.formDefSelected.formName ?
              this.formDefSelected.formName :
              this.formDefSelected.id + "我的任务";
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
      /** end 自定义函数请在上面加**/
    }, // end methods
    components: {
      "procinst-parames-execution-set": ProcinstParamesExecutionSet,
      sticky: Sticky,
      "send-sms": SendSms,
      CategoryTree,
      TagMng
      // 在下面添加其它组件
    }, 
    mounted() {
      this.filters.candidateUser = this.userInfo.userid;
      listCategorys({
        tenantId: this.userInfo.branchId
      }).then(res => {
        this.categorys = res.data.data;
      });
      if (this.defaultShowCalendar) {
        this.showCalendar = true;
      } else {
        this.showCalendar = false;
      }
      this.$nextTick(() => {
        if (!this.showCalendar) {
          var clientRect = this.$refs.table.$el.getBoundingClientRect();
          var subHeight = 60 / 1000 * window.innerHeight;
          this.tableHeight = window.innerHeight - clientRect.y - this.$refs.table.$el.offsetTop - subHeight;
        } else {
          var subHeight = 60 / 1000 * window.innerHeight;
          this.tableHeight = window.innerHeight - subHeight;
        }
      })

      this.myBranchDepts = this.myDepts.filter(i => {
        if (i.branchId == this.userInfo.branchId) {
          return true;
        } else {
          return false;
        }
      });

      if (this.assigneeToMe !== false) {
        if (this.isClaim == undefined || this.isClaim === false) {
          this.filters.assignee = this.userInfo.userid;
          console.log(this.myBranchDepts);
          // this.filters.candidateGroups=this.myBranchDepts.map(i=>i.deptid)
          //this.getTasks();
        } else {
          //this.searchMyCandidateUserTasks()
        }
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped> 
   
</style>
 
