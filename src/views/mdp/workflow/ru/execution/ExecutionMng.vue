<template>
  <section>
    <el-row class="app-container"> 
      <el-col v-if="showCalendar==false">
        <el-row>
          <el-select v-model="filters.filterType" clearable placeholder="查询范围" class="hidden-md-and-down">
            <el-option value="" label="全部"> </el-option>
            <el-option value="startUserId" label="我发起"> </el-option>
            <el-option value="partake" label="我参与"> </el-option>
            <el-option value="sponsors" label="我主办"> </el-option>
            <el-option value="monitors" label="我监控"> </el-option>
          </el-select>
          <el-select v-model="filters.procCategory" clearable filterable placeholder="选择分类" >
            <el-option v-for="item in categorys" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-date-picker v-model="filters.startTimeRanger" class="" type="daterange" align="right"
            unlink-panels range-separator="-" start-placeholder="创建日期" end-placeholder="创建日期" value-format="yyyy-MM-dd"
            :default-time="['00:00:00','23:59:59']" :picker-options="pickerOptions">
          </el-date-picker>
          <el-input v-model="filters.key" style="width:270px;" placeholder="模糊查询">
            <template slot="append">

              <el-button v-on:click="searchExecutions" icon="el-icon-search">查询</el-button>
            </template>
          </el-input>
          <el-popover placement="top" width="375" trigger="manual" v-model="weixinContentVisible">
            <p>{{weixinContent}}</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="doCopyWeixinUrl">拷贝链接</el-button>
              <el-button type="primary" size="mini" @click="doCopyWeixinContent">拷贝内容</el-button>
            </div>
            <el-button slot="reference" style="margin-left: 13px;" class="hidden-lg-and-down" icon="el-icon-alarm-clock " v-on:click="showWeixin">
              微信催办</el-button>
          </el-popover>

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
                  流程分类
                </font>
                <el-select v-model="filters.procCategory" clearable filterable placeholder="选择分类">
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
                  流程状态
                </font>
                <el-button size="mini" :type="filters.suspensionState=='2'?'success':''"
                  v-on:click="filters.suspensionState='2'">挂起的</el-button>
                <el-button size="mini" :type="filters.suspensionState=='1'?'success':''"
                  v-on:click="filters.suspensionState='1'">活动的</el-button>


              </el-col>
              <el-col :span="24">
                <font class="more-label-font">
                  开始日期
                </font>
                <el-date-picker v-model="filters.startTimeRanger" type="daterange" align="right" unlink-panels
                  range-separator="-" start-placeholder="创建日期" end-placeholder="创建日期" value-format="yyyy-MM-dd"
                  :default-time="['00:00:00','23:59:59']" :picker-options="pickerOptions">
                </el-date-picker>
              </el-col>
              <el-col :span="24">

                <font class="more-label-font">
                  计划完成日期
                </font>
                <el-date-picker v-model="filters.planFinishTimeRanger" type="daterange" align="right" unlink-panels
                  range-separator="-" start-placeholder="计划完成日期" end-placeholder="计划完成日期" value-format="yyyy-MM-dd"
                  :default-time="['00:00:00','23:59:59']" :picker-options="pickerOptions">
                </el-date-picker>
              </el-col> 
              <el-col :span="24">
                <el-checkbox size="mini" v-model="showCalendar">按日历风格显示</el-checkbox>
              </el-col>



              <el-col :span="24" style="margin-top: 11px;">
                <el-button size="mini" type="primary" v-on:click="searchExecutions" icon="el-icon-search">查询</el-button>
              </el-col>

              <el-col :span="24">
                <el-divider content-position="left">其它操作</el-divider>
                <el-button size="mini" @click.native="showTagSelect(true)">添加标签</el-button>
                <el-button size="mini" @click="handleDownload">导出数据</el-button>
                <el-button size="mini" v-on:click="showWeixinTask">微信催办</el-button>
                <el-button size="mini" v-on:click="showSendSms">短信催办</el-button>
                <el-button size="mini" v-on:click="showOaMsg">OAMSG催办</el-button>
              </el-col>
            </el-row>
            <el-button slot="reference" icon="el-icon-more" style="margin-left: 13px;" circle></el-button>
          </el-popover>
        </el-row>
        <!--列表 Execution act_ru_execution-->
        <el-row style="padding-top:20px;">
          <el-table ref="table" :max-height="tableHeight" :data="executions" highlight-current-row
            v-loading="listLoading" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column type="index" width="40"></el-table-column>
            <el-table-column sortable prop="mainTitle" label="流程(点击详情)" min-width="300" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-link type="primary" @click="showTasksInfo( scope.row,scope.$index)">{{scope.row.mainTitle}}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="taskName" label="当前节点" min-width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column sortable prop="tagNames" label="标签" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag v-for="tagName in (scope.row.tagNames?scope.row.tagNames.split(','):[])" :key="tagName">
                  {{tagName}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column sortable prop="assigneeName" label="执行人" width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column sortable prop="startUsername" label="发起人" width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column sortable prop="startTime" label="发起时间" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column sortable prop="planFinishTime" label="到期时间" width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column sortable prop="startDeptName" label="发起部门" width="150" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="suspensionState" label="状态" min-width="80" :formatter="formatterSuspensionState">
            </el-table-column>
            <el-table-column label="操作" :width="screenWidth<500?80:160" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" @click="showTasksInfo( scope.row,scope.$index)">详情</el-button>
                <el-dropdown @command="handleCommand" class="hidden-sm-and-down">
                  <span class="el-dropdown-link">
                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-setting" v-if="scope.row.suspensionState=='1'"
                      :command="{type:'handleSuspend',row:scope.row}">挂起流程</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-success" v-if="scope.row.suspensionState=='2'"
                      :command="{type:'handleActivite',index:scope.$index,row:scope.row}">激活流程</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-remove"
                      :command="{type:'handleDel',index:scope.$index,row:scope.row}">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
            @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum"
            :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;"></el-pagination>
        </el-row>
      </el-col>

      <el-col v-if="showCalendar==true">

        <el-calendar v-loading="listLoading" v-model="filters.calendarDate">
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <template slot="dateCell" slot-scope="{date, data}">
            <div :class="data.isSelected ? 'is-selected' : ''">
              <div class="calendar-cell-data"> {{ data.day.split('-')[2] }}{{ data.isSelected ? '✔️' : ''}}
                <div v-for=" (i,index)  in  showCalendarDataTips(date,data)" :key="index">
                  <el-popover placement="right" trigger="hover">
                    <el-row>
                      <el-col>
                        <el-tag v-for=" tag in i.tags" :key="tag.id">{{tag.tagName+'('+tag.count+')'}}</el-tag>
                      </el-col>
                    </el-row>
                    <el-table :data="i.allTasks" max-height="450px" max-width="450px">
                      <el-table-column width="40" type="index"></el-table-column>
                      <el-table-column sortable min-width="250" property="mainTitle" label="流程【任务】(点击详情)">
                        <template slot-scope="scope">
                          <el-link type="primary" @click.stop="showTasksInfo( scope.row,scope.$index)">
                            {{scope.row.mainTitle}}【{{scope.row.taskName}}】
                          </el-link>
                        </template>
                      </el-table-column>
                      <el-table-column sortable prop="assigneeName" label="执行人" min-width="100"></el-table-column>
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
                            <el-tag effect="light" type="" v-for="(tagName,index) in scope.row.tagNames.split(',')"
                              :key="index">{{tagName}}</el-tag>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column sortable min-width="100" property="planFinishTime" label="到期时间">
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
      </el-col>
      <el-dialog append-to-body title="选择员工" :visible.sync="userSelectVisible" width="60%">
        <users-select :select-userids="filters.assignee?[filters.assignee.userid]:[]" @confirm="onUserSelected">
        </users-select>
      </el-dialog>

      <el-dialog append-to-body title="标签条件" :visible.sync="tagSelectVisible" width="60%">
        <tag-mng :tagIds="filters.tags?filters.tags.map(i=>i.tagId):[]" :jump="true" @select-confirm="onTagSelected">
        </tag-mng>
      </el-dialog>


      <el-dialog title="短信催办" :visible.sync="sendSmsVisible" :width="dialogWidth()" :close-on-click-modal="false">
        <send-sms :sms-body-params="smsBodyParams" :sms-user-list="smsUserList" :load-phoneno-by-userid='true'
          :visible="sendSmsVisible" @cancel="sendSmsVisible=false"></send-sms>
      </el-dialog>
      <!--编辑 Execution act_ru_execution界面-->
      <el-dialog title="任务详情" :visible.sync="editFormVisible" fullscreen :width="dialogWidth()"
        :close-on-click-modal="false">
        <procinst-parames-execution-set :companyEmployees="companyEmployees" :companyDepts="companyDepts"
          :taskInfo='editForm' :isArchive="isArchive" :procDefId="editForm.procDefId" :procInstId="editForm.procInstId"
          :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit">
        </procinst-parames-execution-set>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
  import util from '@/common/js/util'; //全局公共库
  //import { getCompanyEmployees,getCompanyDepts,selectCacheOptions,getDefaultValue,getCodeName } from '../../../../../api/common/code';//下拉框数据查询
  import {
    listExecution,
    activiteExecution,
    suspendExecution,
    delExecution
  } from '@/api/mdp/workflow/ru/execution';
  import ProcinstParamesExecutionSet from '../procinstParames/ProcinstParamesExecutionSet'; //流程参数加载
  import {
    listCategorys
  } from '@/api/mdp/workflow/re/procdef';
  import {
    batchInsertOrDeleteTags
  } from '@/api/mdp/workflow/ru/procinstTag';
  import Sticky from '@/components/Sticky' // 粘性header组件
  import {
    listUser
  } from '@/api/mdp/sys/user'; //下拉框数据查询
  import {
    listDept
  } from '@/api/mdp/sys/dept'; //下拉框数据查询
  import {
    mapGetters
  } from 'vuex'
  import {
    createShortToken
  } from '@/api/login'; //下拉框数据查询
  import SendSms from '@/views/mdp/sms/SendSms'; //流程参数加载
  import VueClipboard from 'vue-clipboard2'
  import Vue from 'vue'
  import TagMng from '@/views/mdp/arc/tag/TagMng';

  import CategoryTree from '@/views/mdp/arc/category/CategoryTree'; //修改界面
  import UsersSelect from '@/views/mdp/sys/user/UsersSelect';

  VueClipboard.config.autoSetContainer = true // add this line
  Vue.use(VueClipboard)

  export default {
    name: 'ExecutionMng',
    computed: {
      ...mapGetters([
        'userInfo'
      ]),
      screenWidth: function() {
        return screen.width;
      },
    },
    props: ['isMyMonitors', 'isMyStart', 'isMySponsors', 'isArchive', 'isMyPartake', 'isAll', 'defaultShowCalendar'],
    data() {

      const fromStartTime = new Date();
      const toStartTime = new Date();
      fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
      return {
        filters: {
          key: '',
          procCategory: '',
          categoryTreeNodes: [],
          tags: [],
          startTimeRanger: [util.formatDate.format(fromStartTime, 'yyyy-MM-dd'), util.formatDate.format(toStartTime,
            'yyyy-MM-dd')],
          planFinishTimeRanger: [],
          assignee: null, //已选中人员
          calendarDate: util.formatDate.format(toStartTime, 'yyyy-MM-dd'),
          filterType: '',
          suspensionState: '', //1/2 激活、挂起
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近两周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 * 2);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 * 3);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近四周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 * 4);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        executions: [], //查询结果
        pageInfo: { //分页数据
          total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
          pageSize: 20, //每页数据
          pageNum: 1, //当前页码、从1开始计算
          orderFields: ['start_time_'], //排序列 如 ['sex','student_id']，必须为数据库字段
          orderDirs: ['desc'], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
          count: true
        },
        listLoading: false, //查询中...
        sels: [], //列表选中数据
        options: {}, //下拉选择框的所有静态数据 options.sex,options.project

        smsBodyParams: [], //需要发短信的短信内容参数[assigneeName,taskName,createTime,starter]
        smsUserList: [{
          userid: '',
          phoneno: '',
          username: ''
        }], //接受短信的人
        sendSmsVisible: false, //是否显示发短信对话框
        weixinContentVisible: false, //微信内容面板是否显示
        weixinContent: '', //微信消息体
        addFormVisible: false, //新增execution界面是否显示
        drawer: false,
        //新增execution界面初始化数据
        addForm: {
          id: '',
          rev: '',
          procInstId: '',
          businessKey: '',
          parentId: '',
          procDefId: '',
          superExec: '',
          actId: '',
          isActive: '',
          isConcurrent: '',
          isScope: '',
          isEventScope: '',
          suspensionState: '',
          cachedEntState: '',
          tenantId: '',
          name: '',
          lockTime: '',
          rootProcInstId: '',
          isMiRoot: '',
          startTime: '',
          startUserId: '',
          deptid: '',
          isCountEnabled: '',
          evtSubscrCount: '',
          taskCount: '',
          jobCount: '',
          timerJobCount: '',
          suspJobCount: '',
          deadletterJobCount: '',
          varCount: '',
          idLinkCount: ''
        },

        editFormVisible: false, //编辑界面是否显示
        //编辑execution界面初始化数据
        editForm: {
          id: '',
          rev: '',
          procInstId: '',
          businessKey: '',
          parentId: '',
          procDefId: '',
          superExec: '',
          actId: '',
          isActive: '',
          isConcurrent: '',
          isScope: '',
          isEventScope: '',
          suspensionState: '',
          cachedEntState: '',
          tenantId: '',
          name: '',
          lockTime: '',
          rootProcInstId: '',
          isMiRoot: '',
          startTime: '',
          startUserId: '',
          deptid: '',
          isCountEnabled: '',
          evtSubscrCount: '',
          taskCount: '',
          jobCount: '',
          timerJobCount: '',
          suspJobCount: '',
          deadletterJobCount: '',
          varCount: '',
          idLinkCount: ''
        },
        /**begin 自定义属性请在下面加 请加备注**/
        companyEmployees: [],
        companyDepts: [],
        categorys: [],
        tagSelectVisible: false,
        isBatchSetProcTags: false,
        userSelectVisible: false,
        showCalendar: true,
        tableHeight: 300,
        /**end 自定义属性请在上面加 请加备注**/
      }
    }, //end data
    methods: {
      //获取代码对应的名称 用于数据反显 如 getCodeName(options.sex,'1');
      getCodeName(options, codeValue) {
        if (!options) return codeValue;
        let code = options.filter(i => i.codeValue == codeValue);
        if (code.length > 0) {
          return code[0].codeName
        } else {
          return codeValue
        }
      },
      handleSizeChange(pageSize) {
        this.pageInfo.pageSize = pageSize;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.pageInfo.pageNum = 1;
        this.getExecutions();
      },
      handleCurrentChange(pageNum) {
        this.pageInfo.pageNum = pageNum;
        this.getExecutions();
      },
      // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
      sortChange(obj) {
        var dir = 'asc';
        if (obj.order == 'ascending') {
          dir = 'asc'
        } else {
          dir = 'desc';
        }
        if (obj.prop == 'xxx') {
          this.pageInfo.orderFields = ['xxx'];
          this.pageInfo.orderDirs = [dir];
        }
        this.getExecutions();
      },
      searchExecutions() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        //this.filters.otherParames={};
        this.getExecutions();

      },
      //获取列表 Execution act_ru_execution
      getExecutions() {
        let params = {
          pageSize: this.pageInfo.pageSize,
          pageNum: this.pageInfo.pageNum,
          total: this.pageInfo.total,
          count: this.pageInfo.count
        };
        if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) {
          let orderBys = [];
          for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
            orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
          }
          params.orderBy = orderBys.join(",")
        }
        if (this.filters.key != "" && this.filters.key != null) {
          params.key = '%' + this.filters.key + '%'
        }
        if (this.filters.procCategory != '' && this.filters.procCategory != null) {
          params.category = this.filters.procCategory
        }

        if (this.filters.categoryTreeNodes != null && this.filters.categoryTreeNodes.length > 0) {
          params.categoryIds = this.filters.categoryTreeNodes.map(i => i.id)
        }

        if (this.filters.tags != null && this.filters.tags.length > 0) {
          params.tagIds = this.filters.tags.map(i => i.tagId)
        }

        if (this.filters.startTimeRanger != null && this.filters.startTimeRanger.length == 2) {
          params.fromStartTime = this.filters.startTimeRanger[0] + " 00:00:00"
          params.toStartTime = this.filters.startTimeRanger[1] + " 23:59:59"
        }
        if (this.filters.planFinishTimeRanger != null && this.filters.planFinishTimeRanger.length == 2) {
          params.fromPlanFinishTime = this.filters.planFinishTimeRanger[0] + " 00:00:00"
          params.toPlanFinishTime = this.filters.planFinishTimeRanger[1] + " 23:59:59"
        }

        if (this.filters.assignee != null && this.filters.assignee.userid) {
          params.assignee = this.filters.assignee.userid
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
        if (this.filters.suspensionState) {
          params.suspensionState = this.filters.suspensionState
        }
        params.tenantId = this.userInfo.branchId
        this.listLoading = true;
        listExecution(params).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total
            this.pageInfo.count = false;
            this.executions = res.data.data;
          } else {
            this.$message({
              message: tips.msg,
              type: 'error'
            });
          }
          this.listLoading = false;
        }).catch(() => {
          this.listLoading = false;

        });
      },
      //显示编辑界面 Execution act_ru_execution
      showTasksInfo: function(row, index) {
        //this.editFormVisible = true;
        console.log("xxxxxxxxxxxxxx进来了");
        var task = Object.assign({}, row);
        this.editForm = task;

        this.editForm = Object.assign({}, row);
        this.$router.push({
          name: 'ProcinstParamesExecutionSetRoute',
          params: {
            taskInfo: task
          }
        });
      },
      //显示新增界面 Execution act_ru_execution
      showAdd: function() {
        this.addFormVisible = true;
        //this.addForm=Object.assign({}, this.editForm);
      },
      afterAddSubmit() {
        this.addFormVisible = false;
        this.pageInfo.total = 0;
        this.pageInfo.count = true;
        this.getExecutions();
      },
      afterEditSubmit() {
        this.editFormVisible = false;
      },
      //删除流程实例
      handleDel: function(row, index) {
        this.$confirm('确认删除该流程实例吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let params = {
            procInstId: row.procInstId,
            tenantId: row.tenantId,
            startUserid: row.userid
          };
          delExecution(params).then((res) => {
            this.listLoading = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = 0;
              this.getExecutions();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });

          });
        }).catch(() => {
          this.listLoading = false;

        });
      },

      dialogWidth: function() {
        if (screen.width > 500) {
          return "80%";
        } else {
          return "100%";
        }
      },
      //选择行execution
      selsChange: function(sels) {
        this.sels = sels;
      },
      //激活流程
      handleActivite: function(row, index) {
        this.$confirm('确认要激活该流程吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let params = {
            procInstId: row.procInstId
          };
          activiteExecution(params).then((res) => {
            this.listLoading = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = 0;
              this.getExecutions();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });

          });
        }).catch(() => {
          this.listLoading = false;

        });
      },
      //挂起流程
      handleSuspend: function(row, index) {
        this.$confirm('确认要挂起该流程吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let params = {
            procInstId: row.procInstId
          };
          suspendExecution(params).then((res) => {
            this.listLoading = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = 0;
              this.getExecutions();
            }
            this.$message({
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });

          });
        }).catch(() => {
          this.listLoading = false;

        });
      },
      rowClick: function(row, event, column) {
        this.$emit('row-click', row, event, column); //  @row-click="rowClick"
      },
      /**begin 自定义函数请在下面加**/

      handleFiltersTagClose: function(tag, paramsName) {
        if (paramsName == 'key') {
          this.filters.key = null;
        } else if (paramsName == 'categoryTreeNodes') {
          this.filters.categoryTreeNodes = this.filters.categoryTreeNodes.filter(i => i.id != tag.id);
          this.$refs.categoryTree.$refs.nodeTree.setChecked(tag.id, false, false);
        } else if (paramsName == 'procCategory') {
          this.filters.procCategory = null;
        } else if (paramsName == 'tags') {
          this.filters.tags = this.filters.tags.filter(i => i.tagId != tag.tagId);
        } else if (paramsName == 'assignee') {
          this.filters.assignee = null;
        } else if (paramsName == 'calendar') {
          this.showCalendar = !this.showCalendar
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
                }
              })
            }
            procinstTagsVos.push(procinstTags);
          })
          var params = procinstTagsVos

          batchInsertOrDeleteTags(params).then(res => {
            this.isBatchSetProcTags = false;
            if (res.data.tips.isOk) {
              var tagIds = tags.map(i => i.tagId).join(",");
              var tagNames = tags.map(i => i.tagName).join(",");
              this.sels.forEach(row => {
                row.tagIds = tagIds
                row.tagNames = tagNames
              })
              this.$message.success("打标签成功");
            } else {
              this.$message.error(res.data.tips.msg);
            }
          }).catch(e => this.isBatchSetProcTags = false);
        } else {
          if (tags == null) {
            this.filters.tags = null
          } else {
            this.filters.tags = tags
          }
        }


      },
      handleCategoryCheckChange(data, checked, indeterminate) {
        if (data.id == 'C0') { //选择了根节点，默认不按分类查询
          this.filters.categoryTreeNodes = null
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
        this.filters.assignee = users[0]
      },
      formatterSuspensionState(row, column, cellValue) {
        return cellValue == 1 ? "激活的" : "挂起的"
      },

      showSendSms: function() {
        if (this.sels.length > 1) {
          this.$message({
            message: '一次只能给一个人发短信',
            type: 'error'
          });
        } else if (this.sels.length < 1) {
          this.$message({
            message: '请选择一条任务',
            type: 'error'
          });
        } else {
          let task = this.sels[0];
          this.smsBodyParams = [task.assigneeName, task.mainTitle + "-" + task.taskName, task.createTime, task.userid]
          this.smsUserList = [{
            userid: task.assignee
          }];
          this.sendSmsVisible = true;
        }

      },
      showWeixinTask: function() {
        if (this.sels.length > 1) {
          this.$message({
            message: '一次只能给一个人发信',
            type: 'error'
          });
          this.weixinContentVisible = false;
          return false;
        } else if (this.sels.length < 1) {
          this.$message({
            message: '请选择一条任务',
            type: 'error'
          });
          this.weixinContentVisible = false;
          return false;
        } else {
          let task = this.sels[0];
          //var url=window.location.href;
          let url = window.location.protocol + "//" + window.location.host + "/oa/" + process.env.VERSION +
            "/#/mdp/workflow/ru/task/TaskListAssigneeToMe";

          createShortToken({
            userid: task.assignee,
            branchId: this.userInfo.branchId
          }).then(res => {
            if (res.data.tips.isOk) {
              var userToken = res.data.userToken;
              this.weixinContent = task.assigneeName + "您好，您有任务【" + task.mainTitle + "-" + task.taskName +
                "】待处理，请登陆OA系统或者点击以下链接处理。" + url + "?userToken=" + userToken;
              this.$copyText(this.weixinContent).then(e => {
                this.$message({
                  message: '已拷贝内容，您可黏贴到微信中',
                  type: 'success'
                });
              });
            }
          });

        }
      },
      showWeixin: function() {
        if (this.sels.length > 1) {
          this.$message({
            message: '一次只能给一个人发信',
            type: 'error'
          });
          this.weixinContentVisible = false;
          return false;
        } else if (this.sels.length < 1) {
          this.$message({
            message: '请选择一条任务',
            type: 'error'
          });
          this.weixinContentVisible = false;
          return false;
        } else {
          let task = this.sels[0];
          //var url=window.location.href;
          let url = window.location.protocol + "//" + window.location.host + "/oa/" + process.env.VERSION +
            "/#/mdp/workflow/ru/task/TaskListAssigneeToMe";

          createShortToken({
            userid: task.assignee,
            branchId: this.userInfo.branchId
          }).then(res => {
            if (res.data.tips.isOk) {
              var userToken = res.data.userToken;
              this.weixinContentVisible = true;
              this.weixinContent = task.assigneeName + "您好，您有任务【" + task.mainTitle + "-" + task.taskName +
                "】待处理，请登陆OA系统或者点击以下链接处理。" + url + "?userToken=" + userToken;

            }
          });

        }

      },
      showOaMsg: function() {
        if (this.sels.length > 1) {
          this.$message({
            message: '一次只能给一个人发信',
            type: 'error'
          });
          return false;
        } else if (this.sels.length < 1) {
          this.$message({
            message: '请选择一条任务',
            type: 'error'
          });
          return false;
        } else {
          let task = this.sels[0];
          var msgBody = task.assigneeName + "您好，您有任务【" + task.mainTitle + "-" + task.taskName + "】待处理，请登陆OA系统处理";

          let href = window.location.protocol + "//" + window.location.host + "/im/" + process.env.VERSION +
            "/#/mdp/im/messages/messageChat?toUserid=" + task.assignee + "&msgBody=" + msgBody
          window.open(href, '_blank');
        }
      },
      doCopyWeixinUrl: function() {
        this.weixinContentVisible = false;
        let href = window.location.protocol + "//" + window.location.host + "/oa/" + process.env.VERSION +
          "/#/mdp/workflow/ru/task/TaskListAssigneeToMe";

        this.$copyText(href).then(e => {

        });
      },
      doCopyWeixinContent: function() {
        this.weixinContentVisible = false;
        this.$copyText(this.weixinContent).then(e => {

        });
      },
      showCalendarDataTips: function(date, data) {
        var datas = this.executions;
        var startTasks = [];
        var planFinishTasks = [];
        var runningTasks = [];
        var delayTasks = [];
        var tags = [];
        var now = new Date();
        var dateStr = util.formatDate.format(now, 'yyyy-MM-dd');

        if (dateStr == data.day) {
          data.isSelected = true;
        }
        datas.forEach(i => {
          var task = Object.assign({}, i);
          if (task.startTime.indexOf(data.day) >= 0) {
            task.calStatus = '开始'
            startTasks.push(task);
          }

          if (task.planFinishTime) {
            if ((task.planFinishTime.indexOf(data.day) >= 0)) {
              task.calStatus = "到期"
              planFinishTasks.push(task)
            } else if ((task.planFinishTime > data.day) && task.startTime < data.day) {
              task.calStatus = "执行中"
              runningTasks.push(task)
            } else if ((task.planFinishTime > data.day) && task.startTime > data.day) {
              //未开始
            } else if ((task.planFinishTime < data.day) && dateStr >= data.day) {
              task.calStatus = "延期"
              delayTasks.push(task)
            }
          } else {
            if (task.startTime < data.day) {
              task.calStatus = "执行中"
              runningTasks.push(task)
            } else if (task.startTime > data.day) {
              //未开始
            }
          }

        });

        var allTasks = startTasks.concat(planFinishTasks).concat(runningTasks).concat(delayTasks);
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
              }
              tags.push(tag)
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
        }
        return [msg];
      },
      handleDownload() {
        console.log(JSON.stringify(this.executions));
        import("@/vendor/Export2Excel").then(excel => {
          const tHeader = [
            "状态",
            "流程定义名称",
            "实际完成时间",
            "是否活跃",
            "用户编号",
            "超级执行官---superExec",
            "参数编号",
            "主办人",
            "部署编号",
            "主键",
            "流程实例名称",
            "表单编号",
            "isScope",
            "流程定义编号",
            "版次",
            "流程定义编号",
            "任务名称",
            "缓存状态",
            "指派人",
            "流程定义版本",
            "监控人",
            "isEventScope",
            "备用字段5",
            "标签编号",
            "节点编号",
            "部门编号",
            "主要操作----mainQx",
            "备用字段4",
            "备用字段1",
            "智能表单展示方式",
            "备用字段",
            "标签名称",
            "流程定义编码",
            "根流程实例编号",
            "计划完成时间",
            "发起人编号",
            "锁定时间",
            "执行人",
            "开始时间",
            "备用字段2",
            "是否关联自定义表单",
            "发起人",
            "流程实例编号",
            "是否同时发生---isConcurrent",
            "父编号",
            "isMiRoot",
            "流程标题",
            "发起部门",
            "业务编码",
            "工作编号---tenantId",
            "备用字段3",
            "任务编号",
            "所属分类编号"
          ];
          const filterVal = [
            "suspensionState",
            "processDefinitionName",
            "realFinishTime",
            "isActive",
            "userid",
            "superExec",
            "paramsId",
            "sponsors",
            "deploymentId",
            "id",
            "procInstName",
            "formId",
            "isScope",
            "processDefinitionId",
            "rev",
            "procDefId",
            "taskName",
            "cachedEntState",
            "assignee",
            "processDefinitionVersion",
            "monitors",
            "isEventScope",
            "fi",
            "tagIds",
            "actId",
            "deptid",
            "mainQx",
            "fo",
            "fp",
            "formShowType",
            "pconfig",
            "tagNames",
            "processDefinitionKey",
            "rootProcInstId",
            "planFinishTime",
            "startUserId",
            "lockTime",
            "assigneeName",
            "startTime",
            "sp",
            "isRefForm",
            "startUsername",
            "procInstId",
            "isConcurrent",
            "parentId",
            "isMiRoot",
            "mainTitle",
            "startDeptName",
            "businessKey",
            "tenantId",
            "tp",
            "taskId",
            "categoryId"
          ];
          const list = this.executions;
          const data = this.formatJson(filterVal, list);
          var filename = "流程中心";
          if (this.formDefSelected) {
            filename = this.formDefSelected.formName ?
              this.formDefSelected.formName :
              this.formDefSelected.id + "流程中心";
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
      handleCommand(command) {
        if (command.type == 'handleSuspend') {
          this.handleSuspend(command.row, command.index);
        } else if (command.type == 'handleActivite') {
          this.handleActivite(command.row, command.index);
        } else if (command.type == 'handleDel') {
          this.handleDel(command.row, command.index);
        }
      }
      /**end 自定义函数请在上面加**/

    }, //end methods
    components: {
      'procinst-parames-execution-set': ProcinstParamesExecutionSet,
      'sticky': Sticky,
      'send-sms': SendSms,
      CategoryTree,
      TagMng,
      UsersSelect
      //在下面添加其它组件
    },
    activated(){
      this.searchExecutions();
    },
    mounted() {
      listCategorys({
        tenantId: this.userInfo.branchId
      }).then(res => {
        this.categorys = res.data.data
      })

      if (this.defaultShowCalendar) {
        this.showCalendar = true;
      } else {
        this.showCalendar = false;
      }
      this.$nextTick(() => {
        if (!this.showCalendar) {
          var clientRect = this.$refs.table.$el.getBoundingClientRect();
          var subHeight = 70 / 1000 * window.innerHeight;
          this.tableHeight = window.innerHeight - clientRect.y - this.$refs.table.$el.offsetTop - subHeight;
        } else {
          var subHeight = 70 / 1000 * window.innerHeight;
          this.tableHeight = window.innerHeight - subHeight;
        } 
      });
      
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
      //加载下拉列表 如有需要去年注释


      /**在下面写其它函数***/
    }
  }
</script>

<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

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
    margin: 2px 0px;
  }

  .more-label-font {
    text-align: center;
    float: left;
    height: 28px;
    line-height: 28px;
    margin-right: 10px;
  }

  .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 24px 0;
    padding-top: 20px;
    margin-left: 0px;
    background: #fff;
  }

  .el-divider__text.is-left {
    left: 0px;
  }

  .el-divider__text {
    padding: 0px 0px;
  }
</style>

<style>
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: #409EFF !important;
    color: #ffffff !important;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: 1px solid #409EFF !important;
    padding: 0 20px;
    width: 1px;
    white-space: nowrap;
  }
  .el-calendar__header {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      padding: 20px 0px;
      padding-top: 0px;
      border: none;
  }
  .el-calendar__body {
      padding: 12px 20px 35px;
      border: 1px solid #EBEEF5;
  }
</style>
