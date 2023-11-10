<template>
  <section class="padding-right">
    <el-row>
      <el-col
        :span="24"
        class="padding-left"
        :class="{ 'flex-box': displayType == 'agil' }"
      >
        <el-row>
					<el-select style="width: 100px" v-model="filters.taskState" placeholder="状态" clearable>
									<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.taskState" :key="index"></el-option>
          </el-select>
          <el-select
            v-model="selkey"
            placeholder="场景"
            clearable
            @change="changeSelKey"
            style="width: 100px"
          >
            <el-option class="showall" value="" label="全部场景"
              >全部场景</el-option
            >
            <el-option value="work" label="未达到100%">未达到100%</el-option>
            <el-option value="finish" label="已达100%">已达100%</el-option>
            <el-option value="myFocus" label="我关注">我关注</el-option>
            <el-option value="myExecuserStatus0" label="我排队"
              >我排队</el-option
            >
            <el-option value="myCreate" label="我是责任人"
              >我是责任人</el-option
            >
            <el-option value="myExecuserStatus1" label="我执行"
              >我执行</el-option
            >
            <el-option value="myExecuserStatus7" label="我放弃的"
              >我放弃的</el-option
            >
          </el-select>
          <el-select
            class="hidden-md-and-down"
            v-model="filters.taskType"
            placeholder="类型"
            style="width: 100px"
            clearable
            @change="changeTaskType"
          >
            <el-option class="showall" value="" label="全部类型"
              >全部类型</el-option
            >
            <el-option
              v-for="(i, index) in dicts.taskType"
              :value="i.id"
              :label="i.name"
              :key="index"
              >{{ i.name }}</el-option
            >
          </el-select>
          <el-button
            class="hidden-md-and-down"
            v-if="!filters.skillTags || filters.skillTags.length == 0"
            icon="el-icon-search"
            @click="showSkillSelect"
            >技能</el-button
          >
          <el-tag
            class="hidden-md-and-down"
            closable
            v-for="(skill, index) in filters.skillTags"
            :key="index"
            @click="showSkillSelect"
            @close="skillTagClear(skill)"
            >{{ skill.skillName }}</el-tag
          >
          <el-button
            style="margin-top: 10px;"
            v-if="!filters.tags || filters.tags.length == 0"
            @click.native="$refs.tagDialog.open()"
            >标签</el-button
          >
          <el-tag
            v-else
            @click="$refs.tagDialog.open()"
            closable
            @close="clearFiltersTag(filters.tags[0])"
            >{{ filters.tags[0].tagName.substr(0, 5) }}等({{
              filters.tags.length
            }})个</el-tag
          >
          <el-input
            style="width: 10em"
            v-model="filters.key"
            placeholder="计划/任务名称"
          >
          </el-input>

        <el-input v-model="filters.projectId" style="width: 10em;" placeholder="项目编号" clearable></el-input>
        <el-input class="hidden-md-and-down" v-model="filters.cbranchId" style="width: 10em;" placeholder="项目公司编号" clearable></el-input>
          <el-button
            @click="searchXmTasks"
            type="primary"
            icon="el-icon-search"
            v-loading="load.list"
          ></el-button>

        <span>
          <el-popover
            placement="top-start"
            title=""
            width="500"
            trigger="click"
          >
            <el-row>
              <el-col :span="24" style="padding-top: 5px">
                <el-button
                  @click="setFiltersCreateUserAsMySelf"
                  >我是责任人</el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                 <el-button
                  @click="setFiltersExecutorAsMySelf"
                  >我是执行人</el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                <font class="more-label-font">创建时间:</font>
                <el-date-picker
                  v-model="dateRanger"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="完成日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                <font class="more-label-font">标签:</font>
                <el-button
                  v-if="!filters.skillTags || filters.skillTags.length == 0"
                  icon="el-icon-search"
                  @click="showSkillSelect"
                  >选择标签</el-button
                >
                <el-tag
                  v-else
                  closable
                  v-for="(skill, index) in filters.skillTags"
                  :key="index"
                  @click="showSkillSelect"
                  @close="skillTagClear(skill)"
                  >{{ skill.skillName }}</el-tag
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="searchXmTasks"
                  >查询</el-button
                >
              </el-col>
            </el-row>
            <el-button style="margin-top: 10px;" slot="reference">更多</el-button>
          </el-popover>

          <el-popover
            placement="top-start"
            title="选择展示方式"
            width="500"
            trigger="hover"
          >
            <el-row>
              <el-radio v-model="displayType" label="grant">甘特图</el-radio>
              <el-radio v-model="displayType" label="agile">敏捷看板</el-radio>
              <el-radio v-model="displayType" label="table">表格</el-radio>
            </el-row>
            <el-button slot="reference">视图</el-button>
          </el-popover>
          </span>
        </el-row>

        <el-row class="padding-top">
          <template v-if="displayType != 'grant'">
            <xm-task-agile-kanban
              :tableHeight="tableHeight"
              v-if="displayType == 'agile'"
              :xmTasks="xmTasks"
              @submit="afterEditSubmit"
            ></xm-task-agile-kanban>
            <el-table class="task-table"
              v-else
              :data="tasksTreeData"
              @sort-change="sortChange"
              v-loading="load.list"
              @row-click="rowClick"
              @selection-change="selsChange"
              highlight-current-row
              current-row-key="id"
              stripe
              fit
              border
              tooltip-effect="light"
              height="100px" v-adaptive="{bottomOffset:50}"
              :tree-props="{ children: 'children'  }"
              row-key="id"
              ref="table"

            >
              <el-table-column
                label="全选"
                type="selection"
                width="50"
                fixed="left"
              >
              </el-table-column>
              <el-table-column
                sortable
                prop="name"
                class-name="title"
                fixed="left"
                label="名称(点击详情)"
                min-width="250" show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <div    class="icon" :style="{backgroundColor:  scope.row.ntype==='1'?'#E6A23C':'#409EFF'}">
									<i :class="scope.row.ntype==='1'?'el-icon-time':'el-icon-s-operation'" ></i>
									</div>
                  <span class="vlink"   type="primary" @click.stop="showDrawer(scope.row)">
                    {{ scope.row.sortLevel }}&nbsp;  {{ scope.row.name }}
                    </span>

									<div class="tool-bar">
                    <span class="u-btn">
                      <el-tooltip  v-if="scope.row.ntype==='0'" :content=" '编辑任务'">
                          <el-button    @click="showDrawer( scope.row,scope.$index)" icon="el-icon-edit" title="编辑任务" circle plain > </el-button>
                      </el-tooltip>
                    </span>
									</div>
                </template>
              </el-table-column>

              <el-table-column
                label="状态"
                type="taskState"
                width="100"
              >
								<template slot-scope="scope"> 
                  <mdp-select show-style="tag" item-code="taskState" v-model="scope.row.taskState" @change="editXmTaskSomeFields(scope.row,'taskState',$event)"/>
								</template>
              </el-table-column>

              <el-table-column
                label="优先级"
                type="level"
                width="100"
              >
								<template slot-scope="scope"> 
                  <mdp-select show-style="tag" item-code="priority" v-model="scope.row.level" @change="editXmTaskSomeFields(scope.row,'level',$event)"/>
								</template>
              </el-table-column>
              <el-table-column
                sortable
                prop="budgetWorkload"
                label="工时"
                width="150"
              >

                <template slot-scope="scope">
                  	<span title="实际工时 / 预算工时 或者 (剩余工时+实际工时)">{{scope.row.actWorkload}} &nbsp;/ &nbsp;{{scope.row.rworkload?parseInt(scope.row.actWorkload)+parseInt(scope.row.rworkload):scope.row.budgetWorkload}}h </span>
                </template>
              </el-table-column>
              <el-table-column sortable prop="rate" label="进度" width="100">
                <template slot-scope="scope">
                  <el-link :disabled="scope.row.ntype=='1'"
                    style="border-radius: 30px"
                    :type="scope.row.rate >= 100 ? 'success' : 'warning'"
                    @click="showWorkload(scope.row)"
                  >
                    {{ (scope.row.rate != null ? scope.row.rate : 0) + "%" }}
                  </el-link>
                </template>
              </el-table-column>

              <el-table-column sortable prop="productId" label="产品" width="100" show-overflow-tooltip>
              </el-table-column>
              <el-table-column sortable prop="projectId" label="项目" width="100" show-overflow-tooltip>
              </el-table-column>

              <el-table-column sortable prop="tagNames" label="标签" width="100" show-overflow-tooltip>
								<template slot-scope="scope">
									<div class="cell-text">
										{{scope.row.tagNames}}
									</div>
									<span class="cell-bar">
										 <el-button @click="$refs.tagDialog.open({data:scope.row,action:'editTagIds'})">选标签</el-button>
									</span>
								</template>
              </el-table-column>
              <el-table-column
                sortable
                prop="createUsername"
                label="负责人"
                width="120"
                show-overflow-tooltip
              >
								<template slot-scope="scope">
									<div>
										{{scope.row.createUsername}}
									</div>
								</template>
              </el-table-column>
              <el-table-column
                sortable
                prop="exeUsernames"
                label="执行人"
                width="120"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <font>
                  <span
                    v-for="(item, index) in [formatExeUsernames(scope.row)]"
                    :key="index"
                  >
                    <el-link
                      :type="item.type"
                      @click.stop="showExecusers(scope.row)"
                      >{{ item.showMsg }}</el-link
                    >
                  </span>
                  </font>
                </template>
              </el-table-column>
              <el-table-column
                sortable
                prop="startTime"
                label="起止时间"
                width="120"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <el-link @click="timeVisible = true" :disabled="scope.row.ntype=='1'"
                    >{{ getDateString(scope.row.startTime) }}&nbsp;~&nbsp;{{
                      getDateString(scope.row.endTime)
                    }}
                  </el-link>
                  <!--
										<div v-for="(item,index) in [calcTaskStateByTime(scope.row.startTime,scope.row.endTime,scope.row)]" :key="index ">
											<el-tag :type="item.type">{{getDateString(scope.row.startTime)}}~{{getDateString(scope.row.endTime)}} {{item.desc}}</el-tag>
										</div>
									-->

                </template>
              </el-table-column>
              <el-table-column
                prop="menuId"
                label="需求"
                width="120"
                show-overflow-tooltip
              >
								<template slot-scope="scope">
									<div class="cell-text">
                    <el-link @click.stop="toMenu(scope.row)">{{ scope.row.menuName ? scope.row.menuName : ""  }}</el-link>
									</div>
								</template>
              </el-table-column>
            </el-table>
            <el-pagination
              ref="pagination"
              layout="total, sizes, prev, pager, next"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :page-sizes="[10, 20, 50, 100, 500]"
              :current-page="pageInfo.pageNum"
              :page-size="pageInfo.pageSize"
              :total="pageInfo.total"
              style="float: right; margin-top: 10px;"
            ></el-pagination>
          </template>
          <xm-gantt
            v-if="displayType == 'grant'"
            :tree-data="tasksTreeData"
            :useRealTime="true"
          ></xm-gantt>
        </el-row>
      </el-col>
    </el-row>
    <el-drawer
      v-if="timeVisible == true"
      :size="600"
      :visible.sync="timeVisible"
      append-to-body
    >
      <el-row class="padding">
        <el-row style="font-size: 12px; overflow-x: hidden">
          <div class="task-header extra">
            <div class="title">
              {{ editForm.name }}
              <el-tag style="border-radius: 30px">{{
                taskStateList[parseInt(editForm.taskState)]
              }}</el-tag>
              <el-link
                v-if="isTaskCenter == '1' && selkey == 'myFocus'"
                type="warning"
                @click.stop="focusOrUnfocus(editForm)"
                >去取关</el-link
              >
              <el-link
                v-if="isTaskCenter == '1' && selkey != 'myFocus'"
                type="success"
                @click.stop="focusOrUnfocus(editForm)"
                >去关注</el-link
              >
            </div>
            <div class="compact">
              <el-tag
                v-if="editForm.level != '' && editForm.level != null"
                style="border-radius: 30px"
                >{{ formateOption("priority", editForm.level) }}</el-tag
              >
              [{{ formateOption("taskType", editForm.taskType) }}]
              <span> {{ editForm.projectName }} </span>
              -
              <span> {{ editForm.createUsername }} </span>
              创建于 {{ editForm.createTime }}
            </div>
            <div class="remarks">
              {{ editForm.remarks }}
            </div>
          </div>

          <div class="exector extra">
            <div class="field-label">需求</div>
            <el-tag
              v-if="editForm.menuName"
              style="margin-left: 10px; border-radius: 30px"
              >{{ editForm.menuName }}</el-tag
            >
          </div>

          <div class="exector extra">
            <div class="field-label">计划时间</div>
            <el-date-picker
              v-model="budgetDateRanger"
              class="hidden-sm-and-down"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="计划开始日期"
              end-placeholder="计划完成日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions"
            ></el-date-picker>
            共{{ taskTime }}天
          </div>
          <div class="exector extra">
            <div class="field-label">实际时间</div>
            <el-date-picker
              v-model="actDateRanger"
              class="hidden-sm-and-down"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="实际开始日期"
              end-placeholder="实际完成日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <el-button @click="editTime(editForm)">保存时间</el-button>
          </div>
        </el-row>

        <div
          v-if="drawerkey == '1' && timeVisible == true"
          style="overflow-x: hidden"
        >
        </div>
      </el-row>
    </el-drawer>

    <!--编辑 XmTask xm_task界面-->
    <el-dialog
      :title="'【'+editForm.name+'】登记工时'"
      :visible.sync="taskWorkloadVisible"
      width="60%"
      top="20px"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-workload-edit
        :xm-task="editForm"
        :visible="taskWorkloadVisible"
        op-type="add"
        @cancel="taskWorkloadVisible=false"
        @submit="onTaskWorkloadSubmit"
      ></xm-workload-edit>
    </el-dialog>

 			<tag-dialog ref="tagDialog"   @select-confirm="onTagSelected">
			</tag-dialog>
    <!-- <el-drawer :title="'技能要求——'+currTaskName" :visible.sync="skillVisible"  size="80%" append-to-body  :close-on-click-modal="false">
			<xm-skill-mng :visible="skillVisible" :task-id="currTaskId" :task-name="currTaskName"></xm-skill-mng>
		</el-drawer> -->
    <el-dialog
      title="编辑任务"
      :visible.sync="editFormVisible"
      width="90%"
      top="20px"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-task-edit
        :xm-task="editForm"
        :visible="editFormVisible"
        @cancel="editFormVisible = false"
        @after-add-submit="afterExecEditSubmit"
        @after-edit-submit="afterExecEditSubmit"
        @submit="afterEditSubmit"
        @edit-fields="onEditSomeFields"
      ></xm-task-edit>
    </el-dialog>
    <el-drawer
      :title="'任务' + currTaskName + '的技能要求'"
      :visible.sync="skillVisible"
      :size="750"
      append-to-body
      :close-on-click-modal="false"
    >
      <skill-mng
        :task-skills="taskSkills"
        :jump="true"
        @select-confirm="onTaskSkillsSelected"
      ></skill-mng>
    </el-drawer>

    <el-drawer
      :title="'任务' + currTaskName + '的执行人'"
      :visible.sync="execUserVisible"
      :size="650"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-execuser-mng
        :visible="execUserVisible"
        :xm-task="editForm"
        :is-my="isMy"
        @after-add-submit="afterExecuserSubmit"
        @after-edit-submit="afterExecuserSubmit"
        @after-delete-submit="afterExecuserSubmit"
        ref="execuserMng"
      ></xm-execuser-mng>
    </el-drawer>
    <el-drawer
      :title="'技能条件'"
      :visible.sync="showSkillSearchVisible"
      :size="750"
      append-to-body
      :close-on-click-modal="false"
    >
      <skill-mng
        :task-skills="filters.skillTags"
        :jump="true"
        @select-confirm="onTaskSkillsSearchSelected"
      ></skill-mng>
    </el-drawer>
    <el-drawer
      append-to-body
      title="需求明细"
      :visible.sync="menuDetailVisible"
      :size="650"
      :close-on-click-modal="false"
    >
      <xm-menu-rich-detail
        :visible="menuDetailVisible"
        :reload="true"
        :xm-menu="{ menuId: editForm.menuId, menuName: editForm.menuName }"
      ></xm-menu-rich-detail>
    </el-drawer>
  </section>
</template>

<script>
import Vue from "vue";
import util from "@/common/js/util"; //全局公共库
import treeTool from "@/common/js/treeTool"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件

import {
  getOutTask,
  editXmTaskSomeFields,
} from "@/api/xm/core/xmTask";
 import XmTaskEdit from "../xmTask/XmTaskEdit"; //修改界面
 import XmTaskAgileKanban from "../xmTask/XmTaskAgileKanban"; //敏捷看板
import { mapGetters } from "vuex";
import xmExecuserMng from "../xmTaskExecuser/XmTaskExecuserForTask";
import xmSkillMng from "../xmTaskSkill/XmTaskSkillMng";
import skillMng from "@/views/xm/core/skill/skillMng";
import { batchAddSkill } from "@/api/xm/core/xmTaskSkill";
import xmTaskTemplateMng from "../xmTaskTemplate/XmTaskTemplateMng";

import { addUserFocus, delUserFocus } from "@/api/mdp/sys/userFocus";

import XmMenuRichDetail from "../xmMenu/XmMenuRichDetail";
import TagMng from "@/views/mdp/arc/tag/TagMng";

import XmGantt from "../components/xm-gantt";

	import  XmTableConfig from '@/views/xm/core/components/XmTableConfig';//修改界面

  	import TagDialog from "@/views/mdp/arc/tag/TagDialog";
  	import XmWorkloadEdit from "@/views/xm/core/xmWorkload/XmWorkloadEdit";

export default {
  computed: {
    ...mapGetters(["userInfo", "roles"]),
    taskTime() {
      if (this.budgetDateRanger.length > 1) {
        const s = new Date(this.budgetDateRanger[0]);
        const sy = s.getFullYear();
        const sm = s.getMonth();
        const sd = s.getDate();
        const e = new Date(this.budgetDateRanger[1]);
        const ey = e.getFullYear();
        const em = e.getMonth();
        const ed = e.getDate();
        let len =
          (new Date(ey, em, ed) - new Date(sy, sm, sd)) / (24 * 3600 * 1000) +
          1;
        return len;
      } else {
        return 0;
      }
    },
    tasksTreeData() {
      let xmTasks = JSON.parse(JSON.stringify(this.xmTasks || []));
      const tasksTreeData = treeTool.translateDataToTree(xmTasks,"parentTaskid","id");
      return tasksTreeData;
    },

  },
  props: [
    "isMy",
     "source" //来源 "GZT:工作台"
  ],
  watch: {
  },
  data() {
    const beginDate = new Date();
    const endDate = new Date();
    beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12);
    return {
      filters: {
        key: "",
        isMyTask: "0", //0不区分我的，1 时我的任务
        projectId: "",
        productId: "",
        skillTags: [],
        taskOut: "", //1只查众包任务，0//只查本机构任务
        menus: [],
        createUserid: "", //负责人
        executorUserid: "", //执行人
        taskType: "",
        tags: [],
        taskState:'',//任务状态
        cbranchId:'',//项目归属公司编号
      },
      xmTasks: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: this.queryScope==='plan' || this.queryScope==='planTask'?50:20, //每页数据
        count:true, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: ["create_time"], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ["desc"], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      dicts: {
        priority: [],
        taskType: [],
        planType: [],
        priority: [],
        xmTaskSettleSchemel: [],
        taskState:[],
      }, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false, //新增xmTask界面是否显示
      //新增xmTask界面初始化数据
      addForm: {
        id: "",
        name: "",
        parentTaskid: "",
        parentTaskname: "",
        projectId: "",
        projectName: "",
        level: "",
        sortLevel: "",
        executorUserid: "",
        executorUsername: "",
        preTaskid: "",
        preTaskname: "",
        startTime: "",
        endTime: "",
        milestone: "",
        description: "",
        remarks: "",
        createUserid: "",
        createUsername: "",
        createTime: "",
        rate: "",
        budgetAt: "",
        budgetWorkload: "",
        actAt: "",
        actWorkload: "",
        taskState: "",
        taskType: "",
        taskClass: "",
        toTaskCenter: "",
        actStartTime: "",
        actEndTime: "",
        uniInnerPrice:80,uniOutPrice:100,
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑xmTask界面初始化数据
      editForm: {
        id: "",
        name: "",
        parentTaskid: "",
        parentTaskname: "",
        projectId: "",
        projectName: "",
        level: "",
        sortLevel: "",
        executorUserid: "",
        executorUsername: "",
        preTaskid: "",
        preTaskname: "",
        startTime: "",
        endTime: "",
        milestone: "",
        description: "",
        remarks: "",
        createUserid: "",
        createUsername: "",
        createTime: "",
        rate: "",
        budgetAt: "",
        budgetWorkload: "",
        actAt: "",
        actWorkload: "",
        taskState: "",
        taskType: "",
        taskClass: "",
        toTaskCenter: "",
        actStartTime: "",
        actEndTime: "",
        uniInnerPrice:80,uniOutPrice:100,
      },
      /**begin 自定义属性请在下面加 请加备注**/
      taskStateList: ["待领取", "已领取执行中", "已完工", "已结算"],

      selkey: "",
      timeVisible: false,
      isChild: false,
      oldrate: "",
      drawerkey: "",

      currTaskId: "",
      currTaskName: "",

      skillVisible: false,
      skillIds: [],
      taskSkills: [],
      menuDetailVisible: false,
      displayType: "table",
      showSkillSearchVisible: false, //按技能查询
      tableHeight: 300,
      dateRanger: [],
      pickerOptions: util.getPickerOptions("datarange"),

      budgetDateRanger: [],
      actDateRanger: [],
      taskWorkloadVisible:false,
      execUserVisible:false,
    };
  }, //end data
  methods: {
    changeSelKey(index) {
      this.selkey = index;
      this.searchXmTasks();
    },
    changeTaskType(index) {
      this.filters.taskType = index;
      this.getXmTasks();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getXmTasks();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getXmTasks();
    },
    clearFiltersCreateUser() {
      this.filters.createUserid = null;
      this.searchXmTasks();
    },
    clearFiltersExecutor() {
      this.filters.executorUserid = null;
      this.searchXmTasks();
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange(obj) {
      if (obj.order == null) {
        this.pageInfo.orderFields = ["create_time"];
        this.pageInfo.orderDirs = ["desc"];
      } else {
        var dir = "asc";
        if (obj.order == "ascending") {
          dir = "asc";
        } else {
          dir = "desc";
        }

        this.pageInfo.orderFields = [util.toLine(obj.prop)];
        this.pageInfo.orderDirs = [dir];
      }

      this.getXmTasks();
    },
    searchXmTasks() {
      this.pageInfo.count = true;
      this.getXmTasks();
    },
    //获取列表 XmTask xm_task
    getXmTasks() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
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
      params=this.getParams(params)
      //params.ptype=this.ptype

        getOutTask(params)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.pageInfo.total = res.data.total;
            this.pageInfo.count = false;
            var xmTasks = res.data.data;
            this.xmTasks = xmTasks;
            if (this.editForm != null) {
              var index = this.xmTasks.findIndex(
                (i) => i.id == this.editForm.id
              );
              if (index >= 0) {
                this.editForm = this.xmTasks[index];
              }
            }
          } else {
            this.$notify({
              showClose: true,
              message: tips.msg,
              type: "error",
            });
          }
          this.load.list = false;
        })
        .catch((err) => (this.load.list = false));
    },
    /**
     * 计算两个日期之间的天数
     * @param dateString1  开始日期 yyyy-MM-dd
     * @param dateString2  结束日期 yyyy-MM-dd
     */
    getDaysBetween(startDate, endDate) {
      if (startDate == endDate) {
        return 0;
      }
      var days = (startDate - endDate) / (1 * 24 * 60 * 60 * 1000);
      return days;
    },


    afterExecEditSubmit() {
      var row=this.editForm
      this.getXmTasks()
      treeTool.reloadChildren(this.$refs.table,this.maps,row.parentTaskid,'parentTaskid',this.loadXmTaskLazy)
    },
    onEditSomeFields(params){
      Object.assign(this.editForm,params )
    },
    //选择行xmTask
    selsChange: function (sels) {
      this.sels = sels;
    },
    rowClick: function (row) {
      this.editForm = row;
      if (row.startTime && row.endTime) {
        this.budgetDateRanger = [row.startTime, row.endTime];
      } else {
        this.budgetDateRanger = [];
      }
      if (row.actStartTime && row.actEndTime) {
        this.actDateRanger = [row.actStartTime, row.actEndTime];
      } else {
        this.actDateRanger = [];
      }
      // this.$emit('row-click',row,);//  @row-click="rowClick"
    },

    showDrawer: function (row) {
      this.editFormVisible = true;

      this.editForm = row;

      // this.$emit('row-click',row,);//  @row-click="rowClick"
    },

    isEmpty(str) {
      return str == null || "" == str;
    },

    showSkill(row) {
      this.editForm = row;
      this.skillVisible = true;
    },
    showSkillSelect() {
      this.showSkillSearchVisible = true;
    },
    skillTagClear(skill) {
      this.filters.skillTags = this.filters.skillTags.filter(
        (i) => i.skillId != skill.skillId
      );
      this.searchXmTasks();
    },
    onTaskSkillsSearchSelected(skills) {
      this.showSkillSearchVisible = false;
      this.filters.skillTags = skills;
      this.searchXmTasks();
    },
    onTaskSkillsSelected(skills) {
      skills.forEach((i) => {
        i.taskId = this.editForm.id;
        i.taskName = this.editForm.name;
        i.taskSkillId = i.skillId;
        i.taskSkillName = i.skillName;
        i.skillRemarks = i.skillRemarks;
      });
      batchAddSkill(skills)
        .then((res) => {
          this.load.add = false;
          var tips = res.data.tips;
          if (tips.isOk) {
            this.skillVisible = false;
            this.getXmTasks();
          }
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        })
        .catch((err) => (this.load.add = false));
    },
    getDateString(dateStr) {
      if (dateStr == null || dateStr == "" || dateStr == undefined) {
        return "";
      } else {
        var now = new Date();
        var years = now.getFullYear();
        if (dateStr.indexOf(years) == 0) {
          return dateStr.substr(5, 5);
        }
        return dateStr.substr(0, 10);
      }
    },
    formateOption: function (itemCode, value) {
      if (this.dicts[itemCode]) {
        var dicts = this.dicts[itemCode].filter(
          (i) => i.id == value
        );
        if (dicts && dicts.length > 0) {
          return dicts[0].name;
        } else {
          return value;
        }
      } else {
        return value;
      }
    },

    formatterOption: function (row, column, cellValue, index) {
      var columnName = column.property;
      var key = "";
      if (columnName == "settleSchemel") {
        key = "xmTaskSettleSchemel";
      } else {
        return cellValue;
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
    toFixed(floatValue, xsd) {
      if (floatValue == null || floatValue == "" || floatValue == undefined) {
        return 0;
      } else {
        if (xsd) {
          return parseFloat(floatValue).toFixed(xsd);
        } else {
          return parseFloat(floatValue).toFixed(0);
        }
      }
    },

    focusOrUnfocus: function (row) {
      if (this.selkey == "myFocus") {
        delUserFocus({
          projectId: row.projectId,
          focusType: "task",
          taskId: row.id,
          taskName: row.name,
          userid: this.userInfo.userid,
          username: this.userInfo.username,
        }).then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.getXmTasks();
          }
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        });
      } else {
        addUserFocus({
          projectId: row.projectId,
          projectName: row.projectName,
          focusType: "task",
          taskId: row.id,
          taskName: row.name,
          userid: this.userInfo.userid,
          username: this.userInfo.username,
        }).then((res) => {
          var tips = res.data.tips;
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        });
      }
    },
    getFloatValue(value, digit) {
      if (isNaN(value)) {
        return 0;
      }
      if (value == null || value == "" || value == undefined) {
        return 0;
      }
      return parseFloat(value);
    },

    clearProduct() {
      this.filters.productId = "";
      this.searchXmTasks();
    },
    onProjectClear(){
      this.filters.projectId="";
      this.xmTasks=[]
      this.searchXmTasks();
    },
    afterExecuserSubmit() {

      var row=this.editForm
        this.getXmTasks()
        treeTool.reloadChildren(this.$refs.table,this.maps,row.parentTaskid,'parentTaskid',this.loadXmTaskLazy)
    },
    toJoin() {
      if (
        this.editForm.exeUserids &&
        this.editForm.exeUserids.indexOf(this.userInfo.userid) >= 0
      ) {
        this.$notify.success("你已经加入该任务了");
        return;
      }
      this.execUserVisible = true;
      this.$nextTick(() => {
        this.$refs.execuserMng.toJoin();
      });
    },
    setFiltersCreateUserAsMySelf() {
      this.filters.createUserid = this.userInfo.id;
      this.searchXmTasks();
    },
    setFiltersExecutorAsMySelf() {
      this.filters.executorUserid = this.userInfo.id;
      this.searchXmTasks();
    },
    formatExeUsernames(row) {

      var exeUsernames = row.exeUsernames;
      var respons = {
        type: "info",
        executorUsername: row.executorUsername,
        showMsg: "",
        exeUsernames: exeUsernames,
        executorUserid: row.executorUserid,
      };
      if (!row.executorUserid && exeUsernames) {
        var exeStatuss = exeUsernames.split(",");
        respons.showMsg = exeStatuss.length + "人候选中";
        return respons;
      } else if (!row.executorUserid && !exeUsernames) {
        respons.showMsg = "候选中";
        return respons;
      }
      if (row.executorUserid && exeUsernames && exeUsernames.length > 0) {
        var exeStatuss = exeUsernames.split(",").filter((i) => {
          return i.indexOf(row.executorUsername) >= 0;
        });
        if (exeStatuss.length <= 0) {
          respons.showMsg = "去设置";
          return respons;
        }
        respons.showMsg = exeStatuss.join(",");
        if (respons.showMsg.indexOf("验收不过") >= 0) {
          respons.type = "danger";
        } else if (respons.showMsg.indexOf("已验收") >= 0) {
          respons.type = "success";
        }
      } else {
        respons.showMsg = "去设置";
      }
      return respons;
    },
    getAmountDesc(amount) {
      if (!amount) {
        return 0 + "元";
      } else {
        if (amount > 10000) {
          return parseFloat(amount / 10000).toFixed(0) + "万元";
        } else {
          return amount + "元";
        }
      }
    },
    clearFiltersTag(tag){
      var index=this.filters.tags.findIndex(i=>i.tagId==tag.tagId)
      this.filters.tags.splice(index,1);
      this.searchXmTasks();
    },
    onTagSelected(tags,option){
				if(option && option.action=='editTagIds'){
					this.editXmTaskSomeFields(option.data,"tagIds",tags)
				}else{
					if (!tags || tags.length == 0) {
						this.filters.tags=[]
					}else{
						this.filters.tags=tags
					}
					this.searchXmTasks();
				}

			},
    getParams(params) {

      if (this.dateRanger && this.dateRanger.length == 2) {
        params.createTimeStart = this.dateRanger[0];
        params.createTimeEnd = this.dateRanger[1];
      }
      if (
        this.filters.taskType != "all" &&
        this.filters.taskType != "" &&
        this.filters.taskType != null
      ) {
        params.taskType = this.filters.taskType;
      }
      if (this.selkey == "work") {
        params.work = "work";
      } else if (this.selkey == "finish") {
        params.rate = 100;
      } else if (this.selkey == "myFocus") {
        params.myFocus = "1";
        params.userid = this.userInfo.userid;
      } else if (this.selkey == "myCreate") {
        params.createUserid = this.userInfo.userid;
        params.userid = this.userInfo.userid;
      } else if (this.selkey.indexOf("myExecuserStatus") >= 0) {
        params.userid = this.userInfo.userid;
        params.myExecuserStatus = this.selkey.substring(
          "myExecuserStatus".length
        );
      }
      if(this.filters.taskState){
        params.taskState=this.filters.taskState
      }
      if (this.filters.projectId) {
        params.projectId = this.filters.projectId;
      }
      params.workexec = "true";
      if (this.isMy == "1") {
        params.userid = this.userInfo.userid;
        params.isMy = "1";
      }
      if (this.filters.menuId) {
        params.menuId = this.filters.menuId;
      }
      if (this.filters.skillTags && this.filters.skillTags.length > 0) {
        params.skillIds = this.filters.skillTags.map((i) => i.skillId);
      }
      if (this.filters.key) {
        params.key = "%" + this.filters.key + "%";
      }
      if (this.filters.taskOut) {
        params.taskOut = this.filters.taskOut;
      }
      if (this.filters.createUserid) {
        params.createUserid = this.filters.createUserid;
      }
      if (this.filters.executorUserid) {
        params.executorUserid = this.filters.executorUserid;
      }
      if (this.filters.tags && this.filters.tags.length>0) {
        params.tagIdList = this.filters.tags.map(i=>i.tagId);
      }

      if (this.filters.cbranchId) {
        params.cbranchId = this.filters.cbranchId;
      }
      params.taskOut="1"
      params.crowd="1"
      params.ntype="0"
      return params;
    },

			editXmTaskSomeFields(row,fieldName,$event){
				var params={ids:[row.id]};
				if(this.sels.length>0){
					if(!this.sels.some(k=>k.id==row.id)){
						this.$notify({position:'bottom-left',showClose:true,message:'请操作选中的行或者取消选中的行再操作其它行',type:'warning'})
						return;
					}
					params.ids=this.sels.map(i=>i.id)
				}
				if(fieldName==='menuId'){
					if($event){
						params[fieldName]=$event.menuId;
						params.menuName=$event.menuName
            params.productId=$event.productId
					}else{
						return;
					}
				}else if(fieldName==='tagIds'){
					if($event){
						params[fieldName]=$event.map(i=>i.tagId).join(",");
						params.tagNames=$event.map(i=>i.tagName).join(",");
					}else{
						return;
					}
				}else if(fieldName==='workload'){
					params={...params,...$event}
				}else if(fieldName==='executorUserid'){
					params.executorUserid=$event.userid
					params.executorUsername=$event.username
				}else if(fieldName==='createUserid'){
					params.createUserid=$event.userid
					params.createUsername=$event.username
				}else{
					params[fieldName]=$event
				}

				editXmTaskSomeFields(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						if(this.sels.length>0){
							 this.sels.forEach(i=>{
								 this.fieldTagVisible=false;
								Object.assign(i,params)
							 })
						}else{
							  Object.assign(row,params)
						}
					}else{
						this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
					}
				})
			},

    initData(){

    },

			formatterPriorityDicts(cellValue){
				if(!cellValue && cellValue!=='0'){
					return []
				}
				var key="priority";
				if(this.dicts[key]==undefined || this.dicts[key]==null || this.dicts[key].length==0   ){
					return [{id:cellValue,name:cellValue,className:'primary'}];
				}
				var list=this.dicts[key].filter(i=>i.id==cellValue)
				if(list.length>0){
					var data= {...list[0],className:'primary'}
					if(data.id=='0'){
						data.className='danger'
					}else if(data.id=='1'){
						data.className='warning'
					}else if(data.id=='2'){
						data.className='success'
					}else if(data.id=='3'){
						data.className='primary'
					}else if(data.id=='4'){
						data.className='info'
					}else{
						data.className='primary'
					}
					return [data];
				}else{
					return [{id:cellValue,name:cellValue,className:'primary'}]
				}

			},
			formatterTaskStateDicts: function(cellValue){
				if(!cellValue && cellValue!=='0'){
					return []
				}
				var key="taskState";
				if(this.dicts[key]==undefined || this.dicts[key]==null || this.dicts[key].length==0   ){
					return [{id:cellValue,name:cellValue,className:'primary'}];
				}
				var list=this.dicts[key].filter(i=>i.id==cellValue)
				if(list.length>0){
					var data= {...list[0],className:'primary'}
					if(data.id=='0'){
						data.className='primary'
					}else if(data.id=='1'){
						data.className='warning'
					}else if(data.id=='2'){
						data.className='success'
					}else if(data.id=='3'){
						data.className='info'
					} else{
						data.className='danger'
					}
					return [data];
				}else{
					return [{id:cellValue,name:cellValue,className:'primary'}]
				}

			},
      showExecusers(row) {
        this.editForm = row;
        this.execUserVisible = true;
      },
      onTaskWorkloadSubmit(){
        this.taskWorkloadVisible=false;
        this.searchXmTasks();
       },
      showWorkload(row){
        this.editForm=row
        this.taskWorkloadVisible=true;
      },
      afterEditSubmit() {
        this.editFormVisible = false;
        var row=this.editForm
        this.getXmTasks()
       },

      afterExecEditSubmit() {
        var row=this.editForm
        this.getXmTasks()
       },
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    xmExecuserMng,
    xmSkillMng,
    XmTaskEdit,
    skillMng,
    XmMenuRichDetail,
    XmGantt,
    XmTaskAgileKanban,
    TagMng,
    TagDialog,
    XmTableConfig,
    XmWorkloadEdit,
    //在下面添加其它组件
  },
  mounted() {
    this.initData();
    this.$nextTick(() => {
      this.getXmTasks();
      this.tableHeight = this.source == 'GZT' ? this.tableHeight : util.calcTableMaxHeight(this.$refs.table.$el);

    });
  },
};
</script>

<style scoped>
.more-label-font {
  text-align: center;
  float: left;
  padding-top: 5px;
}
.align-right {
  float: right;
}
</style>
<style lang="scss" scoped>
.extra {
  border-bottom: 1px solid #dedede;
  padding: 8px;
}
.field-label {
  display: inline-block;
  width: 60px;
  font-size: 12px;
  font-weight: bold;
}
.task-header {
  border-top: 1px solid #dedede;
}
.title {
  font-size: 18px;
  font-weight: bold;
  line-height: 36px;
}
.compact {
  font-size: 12px;
  color: #8c92a4;
}
.compact > span {
  color: #00b2f3;
}
.remarks {
  margin-top: 10px;
  font-size: 16px;
  overflow-x: auto;
  overflow-y: hidden;
}

</style>
