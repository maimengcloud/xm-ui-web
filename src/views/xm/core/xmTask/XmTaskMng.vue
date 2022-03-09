<template>
  <section class="padding">
    <el-row v-show="batchEditVisible == false"> 
      <el-col
        :span="24"
        class="padding-left"
        :class="{ 'flex-box': displayType == 'agil' }"
      >
        <el-row>  
					<el-select style="width: 100px" v-model="filters.taskState" placeholder="任务状态">
									<el-option value="0" label="待领取"></el-option>
									<el-option value="1" label="已领取执行中"></el-option>
									<el-option value="2" label="已完工"></el-option>
									<el-option value="3" label="已结算"></el-option> 
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
            <el-option value="myExecuserStatus2" label="我提交"
              >我提交</el-option
            >
            <el-option value="myExecuserStatus3" label="我的验收成功"
              >我的验收成功</el-option
            >
            <el-option value="myExecuserStatus4" label="我的验收失败"
              >我的验收失败</el-option
            >
            <el-option value="myExecuserStatus5" label="我的付款中"
              >我的付款中</el-option
            >
            <el-option value="myExecuserStatus6" label="我的付款成功"
              >我的付款成功</el-option
            >
            <el-option value="myExecuserStatus7" label="我放弃的"
              >我放弃的</el-option
            >
          </el-select>
          <el-select
            class="hidden-md-and-down"
            v-model="filters.taskType"
            placeholder="任务类型"
            style="width: 100px"
            clearable
            @change="changeTaskType"
          >
            <el-option class="showall" value="" label="全部类型"
              >全部类型</el-option
            >
            <el-option
              v-for="(i, index) in options.taskType"
              :value="i.optionValue"
              :label="i.optionName"
              :key="index"
              >{{ i.optionName }}</el-option
            >
          </el-select>
          <el-checkbox
            class="hidden-md-and-down"
            v-model="filters.taskOut"
            true-label="1"
            false-label=""
            >众包</el-checkbox
          >
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
            v-if="!filters.tags || filters.tags.length == 0"
            @click.native="tagSelectVisible = true"
            >标签</el-button
          >
          <el-tag
            v-else
            @click="tagSelectVisible = true"
            closable
            @close="clearFiltersTag(filters.tags[0])"
            >{{ filters.tags[0].tagName.substr(0, 5) }}等({{
              filters.tags.length
            }})个</el-tag
          >

          <font v-if="!selProject">
            <el-tag
              class="hidden-md-and-down"
              v-if="filters.selProject"
              closable
              @click="showProjectList"
              @close="clearProject"
              >{{ this.filters.selProject.name }}</el-tag
            >
            <el-button
              class="hidden-md-and-down"
              v-else
              @click="showProjectList"
              type="plian"
              >选项目</el-button
            >
          </font>
          <el-input
            style="width: 200px"
            v-model="filters.key"
            placeholder="任务名称"
          >
          </el-input>
          <el-button
            @click="searchXmTasks"
            type="primary"
            icon="el-icon-search"
            v-loading="load.list"
          ></el-button>
          <el-button  
            v-if="isTaskCenter != '1' && isMy != '1'"
            @click="showBatchEdit"
            v-loading="load.edit"
            icon="el-icon-edit"
            >修改</el-button
          >
          <el-button type="danger"
            v-if="isTaskCenter != '1' && isMy != '1'"
            @click="batchDel"
            v-loading="load.del"
            icon="el-icon-del"
            >删除</el-button
          >
          <el-popover
            placement="top-start"
            title="选择创建任务的方式"
            width="300"
            trigger="hover"
          >
            <el-row>
              <el-col :span="24" style="padding-top: 5px">
                <el-button
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="showMenu"
                  icon="el-icon-plus"
                  >由需求快速创建任务(推荐)</el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                <el-button
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="showTaskTemplate"
                  icon="el-icon-plus"
                  >从模板快速导入任务</el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                <el-button
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="showAdd"
                  icon="el-icon-plus"
                  >直接创建</el-button
                >
              </el-col>
            </el-row>
            <el-button
              slot="reference"
              v-if="
                isTaskCenter != '1' && isMy != '1' && !xmProduct && !xmIteration
              "
              type="primary"
              icon="el-icon-plus"
            ></el-button>
          </el-popover>

          <el-popover
            placement="top-start"
            title=""
            width="400"
            trigger="click"
          >
            <el-row>
              <el-col :span="24" style="padding-top: 5px">
                <font class="more-label-font">产品:</font
                ><el-tag
                  v-if="filters.product"
                  :closable="!xmProduct"
                  @close="clearProduct"
                  >{{ this.filters.product.productName }}</el-tag
                >
                <el-button v-else @click="showProductVisible" type="plian"
                  >选产品</el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px" v-if="!selProject">
                <font class="more-label-font">项目:</font
                ><el-tag
                  v-if="filters.selProject"
                  closable
                  @click="showProjectList"
                  @close="clearProject"
                  >{{ this.filters.selProject.name }}</el-tag
                >
                <el-button v-else @click="showProjectList" type="plian"
                  >选项目</el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                <font class="more-label-font">需求:</font>
                <font v-if="filters.menus && filters.menus.length > 0">
                  <el-tag
                    v-for="(item, index) in filters.menus"
                    :key="index"
                    closable
                    @close="clearFiltersMenu(item)"
                    >{{ item.menuName.substr(0, 10) }}</el-tag
                  >
                </font>
                <el-button v-else @click="showMenuStory" type="plian"
                  >选需求</el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                <font class="more-label-font">责任人:</font>
                <el-tag
                  v-if="filters.createUser"
                  closable
                  @close="clearFiltersCreateUser"
                  >{{ this.filters.createUser.username }}</el-tag
                >
                <el-button v-else @click="showMenuGroupUser" type="plian"
                  >选责任人</el-button
                >
                <el-button
                  v-if="
                    !filters.createUser ||
                    filters.createUser.userid != userInfo.userid
                  "
                  @click="setFiltersCreateUserAsMySelf"
                  >我的</el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                <font class="more-label-font">执行人:</font>
                <el-tag
                  v-if="filters.executor"
                  closable
                  @close="clearFiltersExecutor"
                  >{{ this.filters.executor.username }}</el-tag
                >
                <el-button v-else @click="showMenuExecutor" type="plian"
                  >选执行人</el-button
                >
                <el-button
                  v-if="
                    !filters.executor ||
                    filters.executor.userid != userInfo.userid
                  "
                  @click="setFiltersExecutorAsMySelf"
                  >我的</el-button
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
            <el-row>
              <el-col :span="24" style="padding-top: 5px">
                <el-button
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="showBatchEdit"
                  v-loading="load.edit"
                  icon="el-icon-edit"
                  >批量修改任务</el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                <el-button type="danger"
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="batchDel"
                  v-loading="load.edit"
                  icon="el-icon-edit"
                  >批量删除</el-button
                >
              </el-col>
            </el-row>
            <el-button slot="reference">更多</el-button>
          </el-popover>

          <el-popover
            placement="top-start"
            title="选择展示方式"
            width="400"
            trigger="hover"
          >
            <el-row>
              <el-radio v-model="displayType" label="grant">甘特图</el-radio>
              <el-radio v-model="displayType" label="agile">敏捷看板</el-radio>
              <el-radio v-model="displayType" label="table">表格</el-radio>
            </el-row>
            <el-button slot="reference">视图</el-button>
          </el-popover>
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
              lazy
              :load="loadXmTaskLazy"
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
              :height="tableHeight"
              :tree-props="{ children: 'children', hasChildren: 'childrenCnt' }"
              row-key="id"
              ref="table"
            >
              <el-table-column  
                label="全选"
                type="selection"
                width="50"
              > 
              </el-table-column>
              <el-table-column  
                label="序号"
                type="index"
                width="50"
              > 
              </el-table-column>
              <el-table-column
                sortable
                prop="name"
                label="任务名称(点击详情)"
                min-width="250"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span class="vlink" type="primary" @click.stop="showDrawer(scope.row)">
                    {{ scope.row.sortLevel }}&nbsp;
                    <el-tag v-if="scope.row.level <= '2'" type="info"
                      >轻微</el-tag
                    >
                    <el-tag v-else-if="scope.row.level == '3'" type="warning"
                      >一般</el-tag
                    >
                    <el-tag v-else-if="scope.row.level == '4'" type="danger"
                      >紧急</el-tag
                    >
                    <el-tag v-else type="danger">特急</el-tag>
                     {{ scope.row.name }}
                    </span>
                   
                </template>
              </el-table-column>
              
              <el-table-column
                sortable
                prop="name"
                label="预算及工时"
                width="150"
              >
                <template slot-scope="scope"> 
                  {{ "￥" + getAmountDesc(scope.row.budgetCost) }},{{
                    scope.row.budgetWorkload
                  }}人时 
                </template>
              </el-table-column>
              <el-table-column sortable prop="rate" label="进度" width="100">
                <template slot-scope="scope"> 
                  <el-link :disabled="scope.row.ntype=='1'"
                    style="border-radius: 30px"
                    :type="scope.row.rate >= 100 ? 'success' : 'warning'"
                    @click="drawerVisible = true"
                  >
                    {{ (scope.row.rate != null ? scope.row.rate : 0) + "%" }}
                  </el-link> 
                </template>
              </el-table-column>
              
              <el-table-column sortable prop="tagNames" label="标签" width="100">
              </el-table-column>
              <el-table-column
                sortable
                prop="createUsername"
                label="负责人"
                width="120"
                show-overflow-tooltip
              > 
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
                  <el-link @click="drawerVisible = true" :disabled="scope.row.ntype=='1'" 
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
                <template slot="header">  <el-button type="text" icon="el-icon-link" title="批量关联需求" @click="showBatchRelTasksWithMenuVisible">关联需求</el-button> </template>
                <template slot-scope="scope">
                   <font>
                  <el-link @click.stop="toMenu(scope.row)">{{
                    scope.row.menuName ? scope.row.menuName : ""
                  }}</el-link>
                   </font>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-dropdown
                    @command="handleCommand"
                    v-if="isTaskCenter != '1' && isMy != '1' && scope.row.ntype=='1'"
                    :disabled="scope.row.ntype!='1'"
                  >
                    <span class="el-dropdown-link">
                      <el-button><i class="el-icon-plus"></i></el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        :command="{ type: 'showMenu', data: scope.row }"
                        >+由需求创建子任务(推荐)</el-dropdown-item
                      >
                      <el-dropdown-item
                        :command="{ type: 'showSubAdd', data: scope.row }"
                        >+子任务</el-dropdown-item
                      >
                      <el-dropdown-item
                        :command="{ type: 'showTaskTemplate', data: scope.row }"
                        >+从模板批量导入子任务</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-button
                    type="text"
                    @click="handleDel(scope.row)"
                    icon="el-icon-delete"
                  ></el-button>
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
              style="float: right"
            ></el-pagination>
          </template>
          <xm-gantt
            v-if="displayType == 'grant'"
            :tree-data="tasksTreeData"
            :project-phase="{
              startTime: currentProjectPhase.beginDate,
              endTime: currentProjectPhase.endDate,
            }"
            :useRealTime="true"
          ></xm-gantt>
        </el-row>
      </el-col>
    </el-row>
    <el-row v-if="batchEditVisible">
      <xm-task-mng-batch
        :sel-project="selProject"
        :sel-project-phase="currentProjectPhase"
        :visible="batchEditVisible"
        @back="batchEditBack"
      ></xm-task-mng-batch>
    </el-row>
    <el-drawer
      v-if="drawerVisible == true"
      :size="600"
      :visible.sync="drawerVisible"
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
                >{{ formateOption("urgencyLevel", editForm.level) }}</el-tag
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
          <div class="progress extra">
            <div class="field-label"></div>
            <el-row>
              <el-slider v-model="editForm.rate" show-input> </el-slider>
            </el-row>
            <el-row>
              <el-button @click="editProgress(editForm.rate)"
                >完成{{ editForm.rate }}%</el-button
              >
              <el-button style="font-size: 12px" @click="editProgress(40)"
                >完成40%</el-button
              >
              <el-button style="font-size: 12px" @click="editProgress(80)"
                >完成80%</el-button
              >
              <el-button style="font-size: 12px" @click="editProgress(100)"
                >完成100%</el-button
              >
            </el-row>
          </div>
          <div class="exector extra">
            <div class="field-label">任务负责人</div>
            <el-tag
              v-if="editForm.createUserid"
              style="margin-left: 10px; border-radius: 30px"
              >{{ editForm.createUsername }}</el-tag
            >
            <el-tag
              v-else
              style="margin-left: 10px; border-radius: 30px"
              icon="el-icon-right"
              >未设置</el-tag
            >
            <el-button
              @click="showGroupUserSelect(editForm)"
              icon="el-icon-setting"
              >设置负责人</el-button
            >
          </div>
          <div class="exector extra">
            <div class="field-label">任务执行人</div>
            <el-tag style="margin-left: 10px; border-radius: 30px">{{
              editForm.exeUsernames
            }}</el-tag>
            <el-button @click="showExecusers(editForm)" icon="el-icon-s-data"
              >查看队员情况</el-button
            >

            <el-button type="primary" @click="toJoin" icon="el-icon-plus"
              >我要加入</el-button
            >
          </div>
          <div class="skill extra">
            <div class="field-label">技能要求</div>
            <el-tag style="margin-left: 10px; border-radius: 30px">{{
              editForm.taskSkillNames ? editForm.taskSkillNames : "无"
            }}</el-tag>
          </div>
        </el-row>

        <div
          v-if="drawerkey == '1' && drawerVisible == true"
          style="overflow-x: hidden"
        >
          <xm-exchange-mng :xm-task="editForm"></xm-exchange-mng>
        </div>
      </el-row>
    </el-drawer>
    <!--编辑 XmTask xm_task界面-->
    <el-drawer
      title="编辑任务"
      :visible.sync="editFormVisible"
      :with-header="false"
      :size="850"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-task-edit
        :xm-project="currentProject"
        :xm-task="editForm"
        :project-phase="currentProjectPhase"
        :visible="editFormVisible"
        @cancel="editFormVisible = false"
        @after-add-submit="afterExecEditSubmit"
        @after-edit-submit="afterExecEditSubmit"
        @submit="afterEditSubmit"
      ></xm-task-edit>
    </el-drawer>

    <!-- 新增 XmTask xm_task界面-->
    <el-drawer
      class="xm-task-add"
      title="新增任务"
      :visible.sync="addFormVisible"
      :with-header="false"
      :size="850"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-task-add
        :xm-project="currentProject"
        :project-phase="currentProjectPhase"
        :xm-task="addForm"
        :parent-task="parentTask"
        :visible="addFormVisible"
        @cancel="addFormVisible = false"
        @submit="afterAddSubmit"
      ></xm-task-add>
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

    <!-- <el-drawer :title="'技能要求——'+currTaskName" :visible.sync="skillVisible"  size="80%" append-to-body  :close-on-click-modal="false">
			<xm-skill-mng :visible="skillVisible" :task-id="currTaskId" :task-name="currTaskName"></xm-skill-mng>
		</el-drawer> -->

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
      title="任务模板" 
      :with-header="false"
      :visible.sync="taskTemplateVisible"
      size="80%"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-task-template-mng
        :is-select="true"
        @select-confirm="onTaskTemplatesSelected"
      ></xm-task-template-mng>
    </el-drawer>

    <el-drawer
      :title="currentProject == null ? '项目明细' : currentProject.name"
      center
      :fullscreen="true"
      :visible.sync="projectInfoVisible"
      size="50%"
      :close-on-click-modal="false"
      append-to-body
    >
      <xm-project-info
        :sel-project="currentProject"
        @changeShowInfo="changeShowInfo"
        @submit="changeShowInfo"
      ></xm-project-info>
    </el-drawer>

    <el-drawer
      title="选中项目"
      :visible.sync="selectProjectVisible"
      :size="750"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-project-list
        class="padding-left"
        @project-confirm="onPorjectConfirm"
      ></xm-project-list>
    </el-drawer>

    <el-drawer
      append-to-body
      title="需求选择"
      :visible.sync="batchRelTasksWithMenuVisible"
      size="70%"
      :close-on-click-modal="false"
    >
      <xm-menu-select
        :visible="batchRelTasksWithMenuVisible"
        :is-select-menu="true" 
         @selected="onBatchRelTasksWithMenu" 
      ></xm-menu-select>
    </el-drawer> 
    <el-drawer
      append-to-body
      title="需求选择"
      :visible.sync="menuVisible"
      size="70%"
      :close-on-click-modal="false"
    >
      <xm-menu-select
        :visible="menuVisible"
        :is-select-menu="true"
        :multi="true"
        @menus-selected="onSelectedMenus"
      ></xm-menu-select>
    </el-drawer>
    <el-drawer
      append-to-body
      title="需求选择"
      :visible.sync="menuStory"
      size="70%"
      :close-on-click-modal="false"
    >
      <xm-menu-select
        :visible="menuStory"
        :is-select-menu="true"
        :multi="true"
        @menus-selected="onSelectedStory"
      ></xm-menu-select>
    </el-drawer>

    <el-drawer
      append-to-body
      title="选择负责人"
      :visible.sync="menuGroupUser"
      :size="650"
      :close-on-click-modal="false"
    >
      <xm-group-select
        :visible="menuGroupUser"
        :sel-project="selProject"
        :isSelectSingleUser="1"
        @user-confirm="seleConfirm"
      ></xm-group-select>
    </el-drawer>
    <el-drawer
      append-to-body
      title="选择执行人"
      :visible.sync="menuExecutor"
      :size="650"
      :close-on-click-modal="false"
    >
      <xm-group-select
        :visible="menuExecutor"
        :sel-project="selProject"
        :isSelectSingleUser="1"
        @user-confirm="seleExecutor"
      ></xm-group-select>
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
    <el-drawer
      append-to-body
      title="选择负责人"
      :visible.sync="groupUserSelectVisible"
      size="60%"
      :close-on-click-modal="false"
    >
      <xm-group-select
        :visible="groupUserSelectVisible"
        :sel-project="selProject"
        :isSelectSingleUser="1"
        @user-confirm="groupUserSelectConfirm"
      ></xm-group-select>
    </el-drawer>

    <el-drawer
      title="选择产品"
      :visible.sync="productSelectVisible"
      :size="650"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-product-select
        :isSelectProduct="true"
        :selProject="filters.selProject"
        :visible="productSelectVisible"
        @cancel="productSelectVisible = false"
        @selected="onProductSelected"
      ></xm-product-select>
    </el-drawer>
    <el-drawer
      :title="'标签条件'"
      :visible.sync="tagSelectVisible"
      :size="750"
      append-to-body
      :close-on-click-modal="false"
    >
      <tag-mng
        :tagIds="filters.tags ? filters.tags.map((i) => i.tagId) : []"
        :jump="true"
        @select-confirm="onTagSelected"
      >
      </tag-mng>
    </el-drawer>
  </section>
</template>

<script>
import Vue from "vue";
import util from "@/common/js/util"; //全局公共库
import treeTool from "@/common/js/treeTool"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
import { listOption } from "@/api/mdp/meta/itemOption"; //下拉框数据查询
import {
  getTask,
  listXmTask,
  editXmTask,
  editRate,
  editTime,
  delXmTask,
  batchDelXmTask,
  batchImportTaskFromTemplate,
  batchSaveBudget,
  setTaskCreateUser,
  batchRelTasksWithMenu,
} from "@/api/xm/core/xmTask";
import XmTaskAdd from "./XmTaskAdd"; //新增界面
import XmTaskEdit from "./XmTaskEdit"; //修改界面
import XmTaskMngBatch from "./XmTaskMngBatch"; //修改界面
import XmTaskAgileKanban from "./XmTaskAgileKanban"; //敏捷看板
import { mapGetters } from "vuex";
import xmExecuserMng from "../xmTaskExecuser/XmTaskExecuserMng";
import xmSkillMng from "../xmTaskSkill/XmTaskSkillMng";
import skillMng from "@/views/xm/core/skill/skillMng";
import { batchAddSkill } from "@/api/xm/core/xmTaskSkill";
import xmProjectPhaseMng from "../xmProjectPhase/XmProjectPhaseSelect";
import { sn } from "@/common/js/sequence";
import xmTaskTemplateMng from "../xmTaskTemplate/XmTaskTemplateMng";
import xmExchangeMng from "../xmExchange/XmExchangeMng";
import xmMenuSelect from "../xmMenu/XmMenuSelect";

import { addXmMyFocus, delXmMyFocus } from "@/api/xm/core/xmMyFocus";

import XmProjectList from "../xmProject/XmProjectList";

import XmMenuRichDetail from "../xmMenu/XmMenuRichDetail";
import XmProductSelect from "../xmProduct/XmProductSelect"; //修改界面
import TagMng from "@/views/mdp/arc/tag/TagMng";

import XmGantt from "../components/xm-gantt";
import XmGroupSelect from "../xmGroup/XmGroupSelect.vue";

export default {
  computed: {
    ...mapGetters(["userInfo", "roles"]),
    currentProject() {
      if (this.filters.selProject) {
        return this.filters.selProject;
      } else {
        return null;
      }
    },
    currentProjectPhase() {
      if (this.projectPhase != null && this.projectPhase != undefined) {
        return this.projectPhase;
      } else {
        var projectPhase = {};
        if (
          this.editForm && this.editForm.id
        ) {
          projectPhase.id = this.editForm.projectPhaseId;
          projectPhase.phaseName = this.editForm.projectPhaseName;
          projectPhase.taskType = this.editForm.taskType;
          projectPhase.projectId = this.editForm.projectId;
          projectPhase.projectName = this.editForm.projectName;
          projectPhase.ntype="0"
          return projectPhase;
        } else {
          return null;
        }
      }
    },
    curUser() {
      return {
        id: this.userInfo.userid,
        name: this.userInfo.username,
      };
    },
    progress_disable() {
      if (
        (this.isEmpty(this.editForm.preTaskid) ||
          this.editForm.prerate == "100") &&
        this.isEmpty(this.editForm.children)
      ) {
        return false;
      } else {
        return true;
      }
    },
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
    "selProject",
    "isTaskCenter",
    "isMy",
    "menuId",
    "menuName",
    "xmProduct",
    "xmIteration",
  ],
  watch: {
    selProject: function (oval, val) {
      this.filters.selProject = this.selProject;
      this.changeSelKey("all");
    },
    menuId: function (menuId) {
      this.getXmTasks();
    },
    drawerVisible: function (drawerVisible) {
      if (drawerVisible == false) {
        this.drawerkey = "";
      }
    },
    xmProduct: function () {
      this.filters.product = this.xmProduct;
      this.getXmTasks();
    },
    xmIteration: function () {
      this.getXmTasks();
    },
  },
  data() {
    const beginDate = new Date();
    const endDate = new Date();
    beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12);
    return {
      filters: {
        key: "",
        isMyTask: "0", //0不区分我的，1 时我的任务
        selProject: null,
        skillTags: [],
        taskOut: "", //1只查众包任务，0//只查本机构任务
        menus: [],
        createUser: null, //负责人
        executor: null, //执行人
        taskType: "",
        tags: [],
        taskState:'',//任务状态
      },
      xmTasks: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 20, //每页数据
        count: false, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: ["create_time"], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ["desc"], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      options: {
        urgencyLevel: [],
        taskType: [],
        planType: [],
        priority: [],
        xmTaskSettleSchemel: [],
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
        budgetCost: "",
        budgetWorkload: "",
        actCost: "",
        actWorkload: "",
        taskState: "",
        taskType: "",
        taskClass: "",
        toTaskCenter: "",
        actStartTime: "",
        actEndTime: "",
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
        budgetCost: "",
        budgetWorkload: "",
        actCost: "",
        actWorkload: "",
        taskState: "",
        taskType: "",
        taskClass: "",
        toTaskCenter: "",
        actStartTime: "",
        actEndTime: "",
      },
      /**begin 自定义属性请在下面加 请加备注**/
      taskStateList: ["待领取", "已领取执行中", "已完工", "已结算"],

      selkey: "",
      drawerVisible: false,
      progress_show: true,
      isChild: false,
      oldrate: "",
      drawerkey: "",

      execUserVisible: false,
      currTaskId: "",
      currTaskName: "",

      skillVisible: false,
      skillIds: [],
      taskSkills: [],
      projectPhase: null,
      taskTemplateVisible: false,
      parentTask: null,
      projectInfoVisible: false,
      batchEditVisible: false,
      valueChangeRows: [], //批量修改时，存储修改过的行
      selectProjectVisible: false,
      menuVisible: false,
      menuDetailVisible: false,
      pickerOptions: util.pickerOptions(),
      displayType: "table",
      menuStory: false, //需求查询
      menuGroupUser: false, //负责人查询
      menuExecutor: false, //执行人查询
      groupUserSelectVisible: false, //选择负责人
      showSkillSearchVisible: false, //按技能查询
      tableHeight: 300,
      productSelectVisible: false,
      dateRanger: [],
      pickerOptions: util.pickerOptions("datarange"),

      budgetDateRanger: [],
      actDateRanger: [],
      tagSelectVisible: false,
      batchRelTasksWithMenuVisible:false,
      maps:new Map(),
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
    showProjectInfo(row) {
      this.editForm = row;
      this.projectInfoVisible = true;
    },
    changeShowInfo() {
      this.projectInfoVisible = false;
    },
    clearFiltersCreateUser() {
      this.filters.createUser = null;
      this.searchXmTasks();
    },
    clearFiltersExecutor() {
      this.filters.executor = null;
      this.searchXmTasks();
    },
    clearFiltersMenu(menu) {
      this.filters.menus = this.filters.menus.filter(
        (i) => i.menuId != menu.menuId
      );
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
      params.isTop="1"
      
			params.withParents="1"
      getTask(params)
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
    showBatchRelTasksWithMenuVisible(){
      if(this.sels.length==0){
        this.$notify.error("请先选中一条或者多条数据")
        return;
      }
      this.batchRelTasksWithMenuVisible=true;
    },
    onBatchRelTasksWithMenu(menu){
      var params={
        menuId:menu.menuId,
        taskIds:this.sels.map(i=>i.id)
      }
      this.load.edit=true;
      this.batchRelTasksWithMenuVisible=false;
      batchRelTasksWithMenu(params).then(res=>{
        this.load.edit=false;
        var tips=res.data.tips;
        if(tips.isOk){ 
          this.getXmTasks();  
          treeTool.reloadAllChildren(this.$refs.table,this.maps,this.sels,'parentTaskid',this.loadXmTaskLazy) 
        }
        this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          }); 
      })
    },
    calcTaskStateByTime(startTime, endTime, row) {
      var obj = {
        type: "",
        desc: "",
      };
      if (
        startTime == null ||
        startTime == "" ||
        endTime == null ||
        endTime == ""
      ) {
        obj = {
          type: "info",
          desc: "未配置日期",
        };
        return obj;
      }
      var curDate = new Date();
      var start = new Date(startTime);
      var end = new Date(endTime);
      var rate = row.rate;
      var isOver = row.rate >= 100;
      var days = this.getDaysBetween(curDate, start);
      if (days <= 0) {
        obj = {
          type: "info",
          desc: this.toFixed(this.getDaysBetween(start, curDate)) + "天后开始",
        };
        return obj;
      } else if (
        this.getDaysBetween(curDate, start) > 0 &&
        this.getDaysBetween(curDate, end) <= 0
      ) {
        obj = {
          type: "primary",
          desc: this.toFixed(this.getDaysBetween(end, curDate)) + "天后结束",
        };
        return obj;
      } else if (this.getDaysBetween(curDate, end) > 0) {
        if (!isOver) {
          obj = {
            type: "danger",
            desc:
              "逾期" + this.toFixed(this.getDaysBetween(curDate, end)) + "天",
          };
        } else {
          obj = {
            type: "success",
            desc:
              "完工" + this.toFixed(this.getDaysBetween(curDate, end)) + "天",
          };
        }

        return obj;
      }
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

    editProgress(rate) {
       
      let params = {
        id: this.editForm.id,
        rate: rate,
        projectId: this.editForm.projectId,
        parentTaskid: this.editForm.parentTaskid,
      };
      if (rate == 0) {
        this.$notify({
          showClose: true,
          message: "不允许更新为0",
          type: "error",
        });
        return;
      }
      this.load.edit = true;
      editRate(params)
        .then((res) => {
          var tips = res.data.tips;
          if(tips.isOk){
            var row=this.editForm  
              this.getXmTasks()
              treeTool.reloadChildren(this.$refs.table,this.maps,row.parentTaskid,'parentTaskid',this.loadXmTaskLazy) 
          }
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          }); 
          this.load.edit = false;
        })
        .catch((err) => {
          this.load.edit = false;
          this.editForm.rate = this.oldrate;
          this.drawerVisible = false;
        });
    },
    //显示编辑界面 XmTask xm_task
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      console.log("editForm", this.editForm);
    },
    showTaskTemplate: function (row) {
      if(!this.checkCanAdd(row)){
        return;
      }
      this.taskTemplateVisible = true;
    },
    checkCanAdd( parentTask){ 

      if(parentTask && parentTask.id){
        if(parentTask.ntype=='0'){
           this.$notify({
              showClose: true,
              message: "当前为任务节点，任务节点下不能再创建新的子项",
              type: "error",
            });
            return false;
        }
        return true;
      }
      return true;
       
        
    },
    showSubAdd(row) { 
      if(!this.checkCanAdd(row)){
        return;
      }
      this.parentTask = row;
      this.editForm = row;
      this.addFormVisible = true;
    },
    //显示新增界面 XmTask xm_task
    showAdd: function () { 
      if(!this.checkCanAdd()){
        return;
      }
      this.addFormVisible = true;
    },
    afterAddSubmit(row) {
      this.addFormVisible = false;
      this.pageInfo.count = true; 
        this.getXmTasks()
        treeTool.reloadChildren(this.$refs.table,this.maps,row.parentTaskid,'parentTaskid',this.loadXmTaskLazy) 
    },
    afterEditSubmit() {
      this.editFormVisible = false;
      var row=this.editForm
      this.getXmTasks()
      treeTool.reloadChildren(this.$refs.table,this.maps,row.parentTaskid,'parentTaskid',this.loadXmTaskLazy) 
    },
    
    afterExecEditSubmit() { 
      var row=this.editForm
      this.getXmTasks()
      treeTool.reloadChildren(this.$refs.table,this.maps,row.parentTaskid,'parentTaskid',this.loadXmTaskLazy) 
    },
    //选择行xmTask
    selsChange: function (sels) {
      this.sels = sels;
    },
    //删除xmTask
    handleDel: function (row, index) { 
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        let params = Object.assign({}, row);
        delXmTask(params)
          .then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;  
              this.getXmTasks()
              treeTool.reloadChildren(this.$refs.table,this.maps,row.parentTaskid,'parentTaskid',this.loadXmTaskLazy) 
            }
            this.$notify({
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.del = false));
      });
    },
    //批量删除xmTask
    batchDel: function () { 
      if(this.sels.length==0){
        this.$notify.error("请先选中要删除的记录")
        return;
      }
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        this.load.del = true;
        batchDelXmTask(this.sels)
          .then((res) => {
            this.load.del = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.count = true;
              var parents=this.sels.filter(i=>!this.sels.some(k=>k.id==i.parentTaskid)); 
							var needLoadChlidList=parents.filter(i=>i.lvl>1) 
							this.searchXmTasks()  
							treeTool.reloadAllChildren(this.$refs.table,this.maps,this.sles,'parentTaskid',this.loadXmTaskLazy)  
            }
            this.$notify({
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          })
          .catch((err) => (this.load.del = false));
      });
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
      ;
      this.editForm = row;

      // this.$emit('row-click',row,);//  @row-click="rowClick"
    },

    isEmpty(str) {
      return str == null || "" == str;
    },

    showExecusers(row) {
      this.editForm = row;
      this.execUserVisible = true;
    },

    showSkill(row) {
      this.editForm = row;
      this.skillVisible = true;
    },
    showSkillSelect() {
      this.showSkillSearchVisible = true;
    },
    showMenuStory() {
      this.menuStory = true;
    },
    showMenuGroupUser() {
      this.menuGroupUser = true;
    },
    showMenuExecutor() {
      this.menuExecutor = true;
    },
    skillTagClear(skill) {
      this.filters.skillTags = this.filters.skillTags.filter(
        (i) => i.skillId != skill.skillId
      );
      this.searchXmTasks();
    },
    showMenu: function (parentTask) { 
      if(!this.checkCanAdd(parentTask)){
        return;
      }
      this.parentTask = parentTask;
      this.menuVisible = true;
    },
    onSelectedMenus(menus) {
      if (menus == null || menus.length == 0) {
        this.menuVisible = false;
        return;
      }
      var menus2 = JSON.parse(JSON.stringify(menus));
      menus2.forEach((i) => {
        i.id = i.menuId;
        i.parentTaskid = i.pmenuId;
        i.name = i.menuName;
      });
      this.onTaskTemplatesSelected(menus2);
      this.menuVisible = false;
    },
    onSelectedStory(menus) {
      //根据需求查询

      if (menus == null || menus.length == 0) {
        this.menuStory = false;
        return;
      }
      this.filters.menus = menus; 
      this.getXmTasks();
      this.menuStory = false;
    },
    
    onSelectedStoryForRel(menus) {
      //根据需求查询

      if (menus == null || menus.length == 0) {
        this.menuStory = false;
        return;
      }
      this.filters.menus = menus; 
      this.getXmTasks();
      this.menuStory = false;
    },
    onTaskTemplatesSelected(taskTemplates) {
      if (taskTemplates == null || taskTemplates.length == 0) {
        this.taskTemplateVisible = false;
        this.parentTask = null;
        return;
      }
      var taskTemplates2 = JSON.parse(JSON.stringify(taskTemplates));
      this.load.add = true;
      let parents = taskTemplates2.filter((value) => {
        //如果我的上级为空，则我是最上级
        if (
          value.parentTaskid == "undefined" ||
          value.parentTaskid == null ||
          value.parentTaskid == ""
        ) {
          return true;

          //如果我的上级不在列表中，我作为最上级
        } else if (taskTemplates2.some((i) => value.parentTaskid == i.id)) {
          return false;
        } else {
          return true;
        }
      });
      if (this.parentTask != null && this.parentTask != undefined) {
        parents.forEach((i) => (i.parentTaskid = this.parentTask.id));
      } else {
        parents.forEach((i) => (i.parentTaskid = null));
      }
      let children = taskTemplates2.filter((value) => {
        if (taskTemplates2.some((i) => value.parentTaskid == i.id)) {
          return true;
        } else {
          return false;
        }
      });
      let translator = (parents, children) => {
        parents.forEach((parent) => {
          var newId = sn();
          var myChildren = [];
          if (children != null && children.length > 0) {
            myChildren = children.filter(
              (current) => current.parentTaskid === parent.id
            );
          }
          myChildren.forEach((current, index) => {
            current.parentTaskid = newId;
            var mySubChildren = children.filter(
              (c) => c.parentTaskid === current.id
            );
            translator([current], mySubChildren);
          });
          parent.id = newId;
        });
      };

      translator(parents, children);
      taskTemplates2.forEach((i) => {
        i.branchId = this.selProject.branchId;
        i.projectId = this.selProject.id;
        i.projectName = this.selProject.name;
        if (this.projectPhase == null) {
          i.projectPhaseId = this.parentTask.projectPhaseId;
          i.projectPhaseName = this.parentTask.projectPhaseName;
          i.sortLevel = i.sortLevel ? i.sortLevel : this.parentTask.sortLevel;
          i.taskType = i.taskType ? i.taskType : this.parentTask.taskType;
          i.taskClass = i.taskClass ? i.taskClass : this.parentTask.taskClass;
        } else {
          i.projectPhaseId = this.projectPhase.id;
          i.projectPhaseName = this.projectPhase.phaseName;
          i.sortLevel = i.sortLevel ? i.sortLevel : this.projectPhase.seqNo;
          i.taskType = i.taskType ? i.taskType : this.projectPhase.taskType;
        }
        i.budgetCost = 0;
        i.budgetWorkload = 80;
        i.level = i.level ? i.level : "3";
        i.planType = i.planType ? i.planType : "w2";
        i.actCost = 0;
        i.actWorkload = 0;
        i.taskState = "0";
        i.rate = 0;
        i.taskOut = i.taskOut ? i.taskOut : "0";
        i.taskClass = i.taskClass ? i.taskClass : "1";
        i.toTaskCenter = i.toTaskCenter ? i.toTaskCenter : "1";
        i.settleSchemel = i.settleSchemel ? i.settleSchemel : "quotePrice";
        i.createUserid = this.userInfo.userid;
        i.createUsername = this.userInfo.username;
        const createTime = new Date();
        var startTime = new Date();
        const endTime = new Date();
        endTime.setTime(startTime.getTime() + 3600 * 1000 * 24 * 7 * 2); //两周后
        i.createTime = util.formatDate.format(
          createTime,
          "yyyy-MM-dd HH:mm:ss"
        );
        i.startTime = util.formatDate.format(startTime, "yyyy-MM-dd HH:mm:ss");
        i.endTime = util.formatDate.format(endTime, "yyyy-MM-dd HH:mm:ss");
      });
      //////////////////
      batchImportTaskFromTemplate(taskTemplates2)
        .then((res) => {
          var tips = res.data.tips;
          if (tips.isOk) {
            this.getXmTasks(); 
            if(this.parentTask && this.parentTask.id){
              treeTool.reloadChildren(this.$refs.table,this.maps,this.parentTask.id,'parentTaskid',this.loadXmTaskLazy) 
            }
            
          }
          this.taskTemplateVisible = false;
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        })
        .catch((e) => {
          this.taskTemplateVisible = false;
        });
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

    handleSelect(key, keyPath) {
      this.drawerkey = key;
    },
    
    projectPhaseRowClick: function (projectPhase) {
       this.projectPhase = projectPhase;
      if(projectPhase.ntype=='1'){
        this.pageInfo.total=0;
        this.xmTasks=[];
        return;
      } 
      this.getXmTasks();
    },
    clearSelectPhase: function () {
      this.projectPhase = null;
      this.getXmTasks();
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
      if (this.options[itemCode]) {
        var options = this.options[itemCode].filter(
          (i) => i.optionValue == value
        );
        if (options && options.length > 0) {
          return options[0].optionName;
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
        this.options[key] == undefined ||
        this.options[key] == null ||
        this.options[key].length == 0
      ) {
        return cellValue;
      }
      var list = this.options[key].filter((i) => i.optionValue == cellValue);
      if (list.length > 0) {
        return list[0].optionName;
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
    decrease: function () {
      if (parseFloat(this.editForm.rate) - 20 < 0) {
        this.editForm.rate = 0;
      } else {
        this.editForm.rate = parseFloat(this.editForm.rate) - 20;
      }
    },
    increase: function () {
      if (parseFloat(this.editForm.rate) + 20 > 100) {
        this.editForm.rate = 100;
      } else {
        this.editForm.rate = parseFloat(this.editForm.rate) + 20;
      }
    },

    focusOrUnfocus: function (row) {
      if (this.selkey == "myFocus") {
        delXmMyFocus({
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
        addXmMyFocus({
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
    showBatchEdit: function () {  
      this.batchEditVisible = true;
    }, 
    getRowSum(row) {
      var budgetCost = this.getFloatValue(row.budgetCost);
      if (row.taskOut == "1") {
        row.taskBudgetOutUserAt = budgetCost;
        row.taskBudgetInnerUserAt = 0;
        row.taskBudgetNouserAt = 0;
      } else {
        row.taskBudgetOutUserAt = 0;
        row.taskBudgetInnerUserAt = budgetCost;
        row.taskBudgetNouserAt = 0;
      }
      return budgetCost;
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
      this.filters.product = null;
      this.searchXmTasks();
    },
    showProductVisible() {
      this.productSelectVisible = true;
    },
    onProductSelected(product) {
      this.filters.product = product;
      this.productSelectVisible = false;
      this.searchXmTasks();
    },
    showProjectList: function () {
      this.selectProjectVisible = true;
    },
    onPorjectConfirm: function (project) {
      this.filters.selProject = project;
      this.selectProjectVisible = false;
      this.searchXmTasks();
    },
    handleCommand(command) {
      if (command.type == "showSubAdd") {
        this.showSubAdd(command.data);
      } else if (command.type == "showTaskTemplate") {
        this.parentTask = command.data;
        this.showTaskTemplate(command.data);
      } else if (command.type == "showMenu") {
        this.parentTask = command.data;
        this.showMenu(command.data);
      } else if (command.type == "showDrawer") {
        this.showDrawer(command.data);
      } else if (command.type == "showEdit") {
        this.showEdit(command.data);
      } else if (command.type == "showExecusers") {
        this.showExecusers(command.data);
      } else if (command.type == "showSkill") {
        this.showSkill(command.data);
      } else if (command.type == "focusOrUnfocus") {
        this.focusOrUnfocus(command.data);
      } else if (command.type == "handleDel") {
        this.handleDel(command.data);
      }
    },
    toMenu(task) {
      this.editForm = task;
      if (task.menuId) {
        this.menuDetailVisible = true;
      } else {
        this.showEdit(task);
      }
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
    clearProject() {
      this.filters.selProject = null;
      this.getXmTasks();
    },
    showGroupUserSelect: function (task) {
      this.editForm = task;
      this.groupUserSelectVisible = true;
    },
    groupUserSelectConfirm: function (users) {
      if (users == null || users.length == 0) {
        this.groupUserSelectVisible = false;
        return;
      }
      this.editForm.createUserid = users[0].userid;
      this.editForm.createUsername = users[0].username;
      setTaskCreateUser(this.editForm).then((res) => {
        var tips = res.data.tips;
        if (tips.isOk) {
          this.$notify.success("设置成功");
          this.groupUserSelectVisible = false;
        } else {
          this.$notify.error(tips.msg);
        }
      });
    },
    //查询时选择责任人
    seleConfirm(groupUsers) {
      if (groupUsers && groupUsers.length > 0) {
        this.filters.createUser = groupUsers[0];
      } else {
        this.filters.createUser = null;
      }
      this.searchXmTasks();
      this.menuGroupUser = false;
    },
    seleExecutor(executors) {
      if (executors && executors.length > 0) {
        this.filters.executor = executors[0];
      } else {
        this.filters.executor = null;
      }
      this.searchXmTasks();
      this.menuExecutor = false;
    }, 
     
    batchEditBack: function (needReload) {
      if (needReload == true) {
        this.searchXmTasks();
      }
      this.batchEditVisible = false;
    },
    setFiltersCreateUserAsMySelf() {
      this.filters.createUser = this.userInfo;
      this.searchXmTasks();
    },
    setFiltersExecutorAsMySelf() {
      this.filters.executor = this.userInfo;
      this.searchXmTasks();
    },
    formatExeUsernames(row) {
      ;
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
    editTime(row) {
      var params = {
        id: row.id,
        projectId: row.projectId,
        startTime: this.budgetDateRanger[0],
        endTime: this.budgetDateRanger[1],
        actStartTime: this.actDateRanger[0],
        actEndTime: this.actDateRanger[1],
      };
      this.load.edit = true;
      editTime(params)
        .then((res) => {
          var tips = res.data.tips;
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
          this.getXmTasks();
          this.load.edit = false;
        })
        .catch((err) => {
          this.load.edit = false;
          this.editForm.rate = this.oldrate;
          this.drawerVisible = false;
        });
    }, 
    clearFiltersTag(tag){
      var index=this.filters.tags.findIndex(i=>i.tagId==tag.tagId)
      this.filters.tags.splice(index,1);
      this.searchXmTasks();
    },
    onTagSelected(tags){
      
      this.tagSelectVisible = false; 
      if (!tags || tags.length == 0) { 
        this.filters.tags=[]
      }else{
        this.filters.tags=tags
      }
      this.searchXmTasks();
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
      if (this.filters.selProject) {
        params.projectId = this.filters.selProject.id;
      }
      params.workexec = "true";
      if (this.projectPhase) {
        {
          params.projectPhaseId = this.projectPhase.id;
        }
      }
      if (this.isMy == "1") {
        params.userid = this.userInfo.userid;
        params.isMy = "1";
      }
      if (this.menuId) {
        params.menuId = this.menuId;
      }
      if (this.filters.menus && this.filters.menus.length == 1) {
        params.menuId = this.filters.menus[0].menuId;
      } else if (this.filters.menus && this.filters.menus.length > 1) {
        params.menuIds = this.filters.menus.map((i) => i.menuId);
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
      if (this.filters.createUser) {
        params.createUserid = this.filters.createUser.userid;
      }
      if (this.filters.executor) {
        params.executorUserid = this.filters.executor.userid;
      }
      if (this.filters.product) {
        params.productId = this.filters.product.id;
      }
      if (this.xmIteration) {
        params.iterationId = this.xmIteration.id;
      }
      if (this.filters.tags && this.filters.tags.length>0) {
        params.tagIdList = this.filters.tags.map(i=>i.tagId);
      }
      return params;
    }, 
    loadXmTaskLazy(tree, treeNode, resolve) {    
      this.maps.set(tree.id, { tree, treeNode, resolve }) //储存数据
        var params={parentTaskid:tree.id}
        params=this.getParams(params);
        params.isTop=""
        this.load.list = true;
        var func=listXmTask 
        func(params).then(res=>{
          this.load.list = false
          var tips = res.data.tips;
          if(tips.isOk){
            var xmTasks=this.xmTasks.filter(i=>i.parentTaskid!=tree.id)
            xmTasks.push(...res.data.data)
            this.xmTasks=xmTasks;
            resolve(res.data.data) 
          }else{
            resolve([])
          }
        }).catch( err => this.load.list = false );   
      
    },
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    "xm-task-add": XmTaskAdd,
    "xm-task-edit": XmTaskEdit,
    XmTaskAgileKanban,
    xmExecuserMng,
    xmSkillMng,
    skillMng,
    xmProjectPhaseMng,
    xmTaskTemplateMng,
    XmProjectList,
    xmExchangeMng,
    xmMenuSelect,
    XmMenuRichDetail,
    XmGantt,
    XmTaskMngBatch,
    XmGroupSelect,
    XmProductSelect,
    XmTaskAgileKanban,
    TagMng,
    //在下面添加其它组件
  },
  mounted() {
    if (this.selProject) {
      this.filters.selProject = this.selProject;
    }
    if (this.xmProduct) {
      this.filters.product = this.xmProduct;
    }
    this.$nextTick(() => {
      this.getXmTasks(); 
      this.tableHeight = util.calcTableMaxHeight(this.$refs.table.$el);  
      listOption([
        { categoryId: "all", itemCode: "planType" },
        { categoryId: "all", itemCode: "taskType" },
        { categoryId: "all", itemCode: "urgencyLevel" },
        { categoryId: "all", itemCode: "xmTaskSettleSchemel" },
        { categoryId: "all", itemCode: "priority" },
      ]).then((res) => {
        this.options = res.data.data;
      });
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
