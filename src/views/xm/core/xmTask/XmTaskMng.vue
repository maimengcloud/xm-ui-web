<template>
  <section class="padding-right">
    <el-row>
      <el-col
        :span="24"
        class="padding-left"
        :class="{ 'flex-box': displayType == 'agil' }"
      >
        <el-row> 
            <xm-project-select style="display:inline;" v-if="!selProject||!selProject.id" :auto-select="isTaskCenter?false:true"  :link-iteration-id="xmIteration?xmIteration.id:null" :link-product-id="xmProduct?xmProduct.id:null"  @row-click="onProjectRowClick" @clear="onProjectClear" ></xm-project-select>
              
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
            style="width: 150px"
            v-model="filters.key"
            placeholder="计划/任务名称"
          >
          </el-input>
          <el-button
            @click="searchXmTasks"
            type="primary"
            icon="el-icon-search"
            v-loading="load.list"
          ></el-button>
          <span style="float:right;"> 
          <el-popover
            placement="top-start"
            title="选择创建计划/任务的方式"
            width="300"
            trigger="hover"
          >
            <el-row>
              <el-col :span="24" style="padding-top: 5px">
                
                <div    class="icon" :style="{backgroundColor:   '#E6A23C'}">
                  <i :class=" 'el-icon-odometer' " ></i>
                </div>  
                <el-button
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="showMenu"
                  type="primary"
                  icon="el-icon-plus"
                  >由用户故事快速创建计划 (推荐)</el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                
                <div    class="icon" :style="{backgroundColor:   '#E6A23C'}">
                  <i :class=" 'el-icon-odometer' " ></i>
                </div>  
                <el-button
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="showTaskTemplate"
                  icon="el-icon-plus"
                  >从模板快速导入计划 </el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                
                <div    class="icon" :style="{backgroundColor:   '#E6A23C'}">
                  <i :class=" 'el-icon-odometer' " ></i>
                </div>  
                <el-button
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="showAdd('1')"
                  icon="el-icon-plus"
                  >直接创建计划</el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px"> 
                <div    class="icon" :style="{backgroundColor:   '#409EFF'}">
                  <i :class=" 'el-icon-s-operation' " ></i>
                </div>  
                <el-button
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="showMenu"
                  type="primary"
                  icon="el-icon-plus"
                  >由用户故事快速创建任务(推荐)</el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                
                <div    class="icon" :style="{backgroundColor:   '#409EFF'}">
                  <i :class=" 'el-icon-s-operation' " ></i>
                </div>  
                <el-button
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="showTaskTemplate"
                  icon="el-icon-plus"
                  >从模板快速导入任务</el-button
                >
              </el-col>
              <el-col :span="24" style="padding-top: 5px">
                
                <div    class="icon" :style="{backgroundColor:   '#409EFF'}">
                  <i :class=" 'el-icon-s-operation' " ></i>
                </div>  
                <el-button
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="showAdd('0')"
                  icon="el-icon-plus"
                  >直接创建任务</el-button
                >
              </el-col>
            </el-row>
            <el-button
              slot="reference"
              v-if="
                isTaskCenter != '1' && isMy != '1' && !xmIteration
              "
              type="primary"
              round
              icon="el-icon-plus"
              title="新建计划、任务"
            ></el-button>
          </el-popover>
          <el-button
            @click="showParentTaskList" 
            title="更换任务的上级，实现任务搬家功能"
            icon="el-icon-upload2"
            v-loading="load.edit"
          > </el-button> 
          <el-button type="danger"
            v-if="isTaskCenter != '1' && isMy != '1'"
            @click="batchDel"
            v-loading="load.del"
            icon="el-icon-delete"
            title="批量删除"
            ></el-button
          >

          <el-popover
            placement="top-start"
            title=""
            width="400"
            trigger="click"
          >
            <el-row>
              <el-col :span="24" style="padding-top: 5px">
                <font class="more-label-font">产品:</font
                > <xm-product-select :auto-select="false" :link-project-id="filters.selProject && filters.selProject.id?filters.selProject.id:null" @row-click="onProductSelected" @clear="onProductClearSelect"></xm-product-select>
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
                <el-button type="danger"
                  v-if="isTaskCenter != '1' && isMy != '1'"
                  @click="batchDel"
                  v-loading="load.edit"
                  icon="el-icon-edit"
                  >批量删除</el-button
                >
              </el-col>
            </el-row>
            <el-button style="margin-top: 10px;" slot="reference">更多</el-button>
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
              :height="tableHeight"
              :tree-props="{ children: 'children'  }"
              row-key="id"
              ref="table"
              :row-style="{height:'60px'}"
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
									<i :class="scope.row.ntype==='1'?'el-icon-odometer':'el-icon-s-operation'" ></i>
									</div>  
                  <span class="vlink"   type="primary" @click.stop="showDrawer(scope.row)">
                    {{ scope.row.sortLevel }}&nbsp;  {{ scope.row.name }}
                    </span>
                  
									<div class="tool-bar">
                    <span class="u-btn">
                      <el-tooltip  v-if="scope.row.ntype==='1'" :content=" '新建任务'">    
                          <el-button    @click="showSubAdd( scope.row,scope.$index,'0')" icon="el-icon-plus" title="新建任务" circle plain size="mini"> </el-button>     
                      </el-tooltip> 
                      <el-tooltip  v-if="scope.row.ntype==='1'" :content=" '新建计划'">    
                          <el-button :style="{backgroundColor:  '#E6A23C'}"  @click="showSubAdd( scope.row,scope.$index,'1')" icon="el-icon-plus" title="新建计划" circle plain size="mini"> </el-button>     
                      </el-tooltip> 
                      
                      <el-tooltip  v-if="scope.row.ntype==='0'" :content=" '编辑任务'">    
                          <el-button    @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit" title="编辑任务" circle plain size="mini"> </el-button>     
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
									<div class="cell-text">
										<el-button style="display:block;" :type="item.className" plain round v-for="(item,index) in formatterTaskStateDicts(scope.row.taskState)" :key="index">{{item.name}}</el-button>
									</div>
									<span class="cell-bar">
										 <el-select  v-model="scope.row.taskState" placeholder="任务状态"  style="display:block;"  @change="editXmTaskSomeFields(scope.row,'taskState',$event)">
												<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.taskState" :key="index"></el-option>
										 </el-select>
									</span>
								</template>
              </el-table-column>
              
              <el-table-column
                label="优先级"
                type="level"
                width="100"
              >  
								<template slot-scope="scope">
									<div class="cell-text">
										<el-button style="display:block;" :type="item.className" plain round v-for="(item,index) in formatterPriorityDicts(scope.row.level)" :key="index">{{item.name}}</el-button>
									</div>
									<span class="cell-bar">
										 <el-select  v-model="scope.row.level" placeholder="优先级"  style="display:block;"  @change="editXmTaskSomeFields(scope.row,'level',$event)">
												<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.priority" :key="index"></el-option>
										 </el-select>
									</span>
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
									<div class="cell-text">
										{{scope.row.createUsername}}
									</div>
									<span class="cell-bar">
										 <el-button @click="$refs.xmGroupDialog.open({data:scope.row,action:'createUserid'})">选负责人</el-button>
									</span>
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
									<span class="cell-bar">
										 <el-button @click="showBatchRelTasksWithMenuVisible">关联需求</el-button>
									</span>
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
      title="编辑任务"
      :visible.sync="editFormVisible"
      width="90%"
      top="20px"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-task-edit
        :xm-project="currentProject"
        :xm-task="editForm"
        :visible="editFormVisible"
        @cancel="editFormVisible = false"
        @after-add-submit="afterExecEditSubmit"
        @after-edit-submit="afterExecEditSubmit"
        @submit="afterEditSubmit"
        @edit-fields="onEditSomeFields"
      ></xm-task-edit>
    </el-dialog>
    
    <!--编辑 XmTask xm_task界面-->
    <el-dialog
      :title="'【'+editForm.name+'】登记工时'"
      :visible.sync="taskWorkloadVisible"
      width="60%"
      top="20px"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-task-workload-edit 
        :xm-task="editForm"
        :visible="taskWorkloadVisible" 
        op-type="add"
        @cancel="taskWorkloadVisible=false"
        @submit="onTaskWorkloadSubmit"
      ></xm-task-workload-edit>
    </el-dialog>

    <!-- 新增 XmTask xm_task界面-->
    <el-dialog
      class="xm-task-add"
      title="新增任务"
      :visible.sync="addFormVisible" 
      width="90%"
      top="20px"
      append-to-body
      :close-on-click-modal="false"
    >
      <xm-task-add
        :xm-project="currentProject"
        :xm-product="xmProduct"
        :xm-task="addForm"
        :parent-task="parentTask"
        :ptype="ptype"
        :visible="addFormVisible"
        @cancel="addFormVisible = false"
        @submit="afterAddSubmit"
      ></xm-task-add>
    </el-dialog>

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
 			<tag-dialog ref="tagDialog"   @select-confirm="onTagSelected">
			</tag-dialog>
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
      append-to-body
      title="需求选择"
      :visible.sync="batchRelTasksWithMenuVisible"
      size="60%"
      :close-on-click-modal="false"
    >
      <xm-menu-select
        :visible="batchRelTasksWithMenuVisible"
        :is-select-menu="true"
        checkScope="3"
         @selected="onBatchRelTasksWithMenu"
         :xm-product="filters.product"
        :sel-project="filters.selProject"
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
         :xm-product="filters.product"
         :sel-project="filters.selProject"
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
         :xm-product="filters.product"
         :sel-project="filters.selProject"
      ></xm-menu-select>
    </el-drawer>

 			<xm-group-dialog ref="xmGroupDialog" :isSelectSingleUser="true" :sel-project="selProject" :xm-product="filters.xmProduct" @user-confirm="selectCreateUserConfirm">
			</xm-group-dialog>  
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
		<el-drawer title="选中上级" :visible.sync="selectParentTaskVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
			<xm-task-list check-scope="plan" queryScope="plan" :sel-project="filters.selProject"   @task-selected="onSelectedParentTask"></xm-task-list>
		</el-drawer>
  </section>
</template>

<script>
import Vue from "vue";
import util from "@/common/js/util"; //全局公共库
import treeTool from "@/common/js/treeTool"; //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件
import { initSimpleDicts } from '@/api/mdp/meta/item'; //下拉框数据查询
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
  batchChangeParentTask,
  editXmTaskSomeFields,
} from "@/api/xm/core/xmTask";
import XmTaskAdd from "./XmTaskAdd"; //新增界面
import XmTaskEdit from "./XmTaskEdit"; //修改界面
 import XmTaskAgileKanban from "./XmTaskAgileKanban"; //敏捷看板
import { mapGetters } from "vuex";
import xmExecuserMng from "../xmTaskExecuser/XmTaskExecuserForTask";
import xmSkillMng from "../xmTaskSkill/XmTaskSkillMng";
import skillMng from "@/views/xm/core/skill/skillMng";
import { batchAddSkill } from "@/api/xm/core/xmTaskSkill";
import xmPhaseMng from "../xmPhase/XmPhaseSelect";
import { sn } from "@/common/js/sequence";
import xmTaskTemplateMng from "../xmTaskTemplate/XmTaskTemplateMng";
import xmExchangeMng from "../xmExchange/XmExchangeMng";
import xmMenuSelect from "../xmMenu/XmMenuSelect";

import { addXmMyFocus, delXmMyFocus } from "@/api/xm/core/xmMyFocus";

import XmProjectSelect from "@/views/xm/core/components/XmProjectSelect";
import XmProductSelect from "@/views/xm/core/components/XmProductSelect";

import XmMenuRichDetail from "../xmMenu/XmMenuRichDetail"; 
import TagMng from "@/views/mdp/arc/tag/TagMng";

import XmGantt from "../components/xm-gantt";
import XmGroupSelect from "../xmGroup/XmGroupSelect.vue";
	import XmTaskList from '../xmTask/XmTaskList';
 
	import  XmTableConfig from '@/views/xm/core/components/XmTableConfig';//修改界面
	import  XmGroupDialog from '@/views/xm/core/xmGroup/XmGroupDialog';//修改界面
  
  	import TagDialog from "@/views/mdp/arc/tag/TagDialog";
  	import XmTaskWorkloadEdit from "@/views/xm/core/xmTaskWorkload/XmTaskWorkloadEdit";

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
    "ptype",//0-项目，1-产品，all/空为不区分
    "queryScope",//planTask,task,plan,分别为计划及任务，纯任务,纯计划
    "source" //来源 "GZT:工作台"
  ],
  watch: {
    selProject: function (oval, val) {
      this.filters.selProject = this.selProject;
      this.changeSelKey("all");
    },
    menuId: function (menuId) {
      this.getXmTasks();
    },
    timeVisible: function (timeVisible) {
      if (timeVisible == false) {
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
        pageSize: this.queryScope==='plan' || this.queryScope==='planTask'?50:20, //每页数据
        count: false, //是否需要重新计算总记录数
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
      progress_show: true,
      isChild: false,
      oldrate: "",
      drawerkey: "",
 
      currTaskId: "",
      currTaskName: "",

      skillVisible: false,
      skillIds: [],
      taskSkills: [],
      taskTemplateVisible: false,
      parentTask: null,
      projectInfoVisible: false, 
      menuVisible: false,
      menuDetailVisible: false,
      pickerOptions: util.getPickerOptions(),
      displayType: "table",
      menuStory: false, //需求查询  
      showSkillSearchVisible: false, //按技能查询
      tableHeight: 300,
      productSelectVisible: false,
      dateRanger: [],
      pickerOptions: util.getPickerOptions("datarange"),

      budgetDateRanger: [],
      actDateRanger: [], 
      batchRelTasksWithMenuVisible:false,
      selectParentTaskVisible:false, 
      execUserVisible:false,
      taskWorkloadVisible:false,
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
      if(this.queryScope==='planTask'){ 
			  params.withParents="1"
      }else if(this.queryScope==='plan'){ 
			  params.withParents="1"
        params.ntype="1"
      }else if(this.queryScope==='task'){
        params.ntype="0"
      }
      
      if(this.ptype==='1' && !this.isTaskCenter){
        if(!params.productId){
          this.$notify.warning("请先选中产品")
          return;
        }
      }else if(this.ptype==='0' && !this.isTaskCenter){
        if(!params.projectId){
          this.$notify.warning("请先选中项目")
          return;
        }
      } 
      //params.ptype=this.ptype

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
      this.batchRelTasksWithMenuVisible=true;
    },
    onBatchRelTasksWithMenu(menu){
      var params={
        menuId:menu.menuId, 
      }
      if(this.sels.length==0){
        if(!this.editForm||!this.editForm.id){
           this.$notify({
              showClose: true,
              message: "请先选中一个或者多个任务",
              type: "warning",
            });
            return;
        }
        params.taskIds=[this.editForm.id]
      }else{
        params.taskIds=this.sels.map(i=>i.id)
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
          this.timeVisible = false;
        });
    },
    //显示编辑界面 XmTask xm_task
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm=row 
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
              type: "warning",
            });
            return false;
        }
        return true;
      }else{
        if(this.ptype==='0'){
          if(!this.filters.selProject || !this.filters.selProject.id){
            this.$notify({
                showClose: true,
                message: "请先选择项目",
                type: "warning",
              });
              this.projectVisible=true;
              return false;
          }else if(this.ptype==='1'){
            if( !this.filters.product && this.filters.product.id){
               this.$notify({
                showClose: true,
                message: "请先选择产品",
                type: "warning",
              });

              this.productSelectVisible=true;
              return false;
            }
          }
        }

      }
      return true;


    },
    showSubAdd(row,index,ntype) {
      if(!this.checkCanAdd(row)){
        return;
      }
      this.parentTask = row;
      this.editForm = row;
      this.addForm.ntype=ntype;
      this.addFormVisible = true;
    },
    //显示新增界面 XmTask xm_task
    showAdd: function (ntype) {
      if(!this.checkCanAdd()){
        return;
      } 
      this.addForm.ntype=ntype;
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
    onEditSomeFields(params){
      Object.assign(this.editForm,params )
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
        this.$notify.warning("请先选中要删除的记录")
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
							this.searchXmTasks()
							treeTool.reloadAllChildren(this.$refs.table,this.maps,this.sels,'parentTaskid',this.loadXmTaskLazy)
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
      taskTemplates2.forEach(i=>{
        if(!i.parentTaskid){
          i.parentTaskid=this.parentTask?this.parentTask.id:null;
          i.parentTaskname=this.parentTask?this.parentTask.name:null;
        } else if(!taskTemplates2.some(k=>k.id==i.parentTaskid)){
          i.parentTaskid=this.parentTask?this.parentTask.id:null;
          i.parentTaskname=this.parentTask?this.parentTask.name:null;
        }
      })
      this.load.add = true;
      var projectId=null;
      var productId=null;
      if(this.ptype==='0'){
        if(this.parentTask && this.parentTask.id){
          projectId=this.parentTask.projectId
        }else{
          projectId=this.filters.selProject.id
        } 
      }else{
         if(this.parentTask && this.parentTask.id){
          productId=this.parentTask.productId
        }else{
          productId=this.filters.product.id
        }
      }
      taskTemplates2.forEach((i) => {
        if(this.ptype==='1'){
          i.ptype="1"
          i.projectId=null;
          i.projectName=null;
          if(productId!=i.productId){
            i.menuId=null;
            i.menuName=null;
          }
          i.productId=productId
        }else if(this.ptype==='0'){
          i.ptype="0"
          if(i.isTpl=='1'){
            i.productId=null;
            i.menuId=null;
            i.menuName=null;
          }
          i.projectId=projectId
        }
        i.budgetAt = 0;
        i.budgetWorkload = 80;
        i.level = i.level ? i.level : "3";
        i.planType = i.planType ? i.planType : "w2";
        i.actAt = 0;
        i.actWorkload = 0;
        i.taskState = "0";
        i.rate = 0;
        i.taskOut = i.taskOut ? i.taskOut : "0";
        i.taskClass = i.taskClass ? i.taskClass : "1";
        i.toTaskCenter = i.toTaskCenter ? i.toTaskCenter : "1";
        i.settleSchemel = i.settleSchemel ? i.settleSchemel : "1";
        i.createUserid = this.userInfo.userid;
        i.createUsername = this.userInfo.username;
        const createTime = new Date();
        var startTime = new Date();
        const endTime = new Date();
        endTime.setTime(startTime.getTime() + 3600 * 1000 * 24 * 7 * 2); //两周后
        i.createTime = util.formatDate(
          createTime,
          "yyyy-MM-dd HH:mm:ss"
        );
        i.startTime = util.formatDate(startTime, "yyyy-MM-dd HH:mm:ss");
        i.endTime = util.formatDate(endTime, "yyyy-MM-dd HH:mm:ss");
      });
      var params={
        xmTasks:taskTemplates2,
        ptype:this.ptype
      }
      if(this.ptype==='0'){
        params.projectId=projectId
      }else{
        params.productId=productId
      }
      if(this.parentTask && this.parentTask.id){
        params.parentTaskid=this.parentTask.id
      }
      //////////////////
      batchImportTaskFromTemplate(params)
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
    getRowSum(row) {
      var budgetAt = this.getFloatValue(row.budgetAt);
      if (row.taskOut == "1") {
        row.taskBudgetOuserAt = budgetAt;
        row.taskBudgetIuserAt = 0;
        row.taskBudgetNouserAt = 0;
      } else {
        row.taskBudgetOuserAt = 0;
        row.taskBudgetIuserAt = budgetAt;
        row.taskBudgetNouserAt = 0;
      }
      return budgetAt;
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
    onProductSelected(product) {
      this.filters.product = product;
      this.productSelectVisible = false;
      this.searchXmTasks();
    },
    onProjectRowClick: function (project) {
      this.filters.selProject = project;
      this.projectVisible=false;
      this.searchXmTasks();
    },
    onProjectClear(){
      this.filters.selProject=null;
      this.projectVisible=false;
      this.xmTasks=[]
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
    selectCreateUserConfirm(groupUsers,option) {
      if(option && option.action==='createUserid'){
        if (groupUsers && groupUsers.length > 0) {
          var user= groupUsers[0];
          this.editXmTaskSomeFields(option.data,option.action,user)
        }  
      }else{
        if (groupUsers && groupUsers.length > 0) {
          this.filters.createUser = groupUsers[0];
        } else {
          this.filters.createUser = null;
        }
        this.searchXmTasks(); 
      }
      
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
    setFiltersCreateUserAsMySelf() {
      this.filters.createUser = this.userInfo;
      this.searchXmTasks();
    },
    setFiltersExecutorAsMySelf() {
      this.filters.executor = this.userInfo;
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
          this.timeVisible = false;
        });
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
      if (this.filters.selProject) {
        params.projectId = this.filters.selProject.id;
      }
      params.workexec = "true";
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
        if(params.projectId && params.productId){
          params.ptype=""
        }
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
    showParentTaskList(){
      if(this.sels.length==0){
        this.$notify({position:'bottom-left',showClose:true,message:"请先选择一个或者多个需要更换上级的计划/任务",type:'warning'})
        return;
      }
      if(this.ptype==='0'){
        if( !this.filters.selProject|| !this.filters.selProject.id){
           this.$notify({position:'bottom-left',showClose:true,message:"请先选择项目",type:'warning'})
           return;
        }
      }else if(this.ptype==='1'){
        if( !this.filters.product|| !this.filters.product.id){
           this.$notify({position:'bottom-left',showClose:true,message:"请先选择产品",type:'warning'})
           return;
        }
      }
      this.selectParentTaskVisible=true

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
					params.executorUserid=$event[0].userid
					params.executorUsername=$event[0].username
				}else if(fieldName==='createUserid'){
					params.createUserid=$event[0].userid
					params.createUsername=$event[0].username
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
    onSelectedParentTask(task){
      if(this.sels.length==0){
         this.$notify({position:'bottom-left',showClose:true,message:"请先选择一个或者多个需要更换上级的计划/任务",type:'warning'})
         this.selectParentTaskVisible=true
        return;
      }else if(task==null || !task.id){
         this.$notify({position:'bottom-left',showClose:true,message:"请选择上级计划/任务",type:'warning'})
        return;
      }

      var params={taskIds:this.sels.map(i=>i.id),parentTaskid:task.id}
      this.$confirm("确认批量更新以下"+this.sels.length+"个任务的上级为【"+task.name+"】吗?", "提示", {
        type: "warning",
      }).then(() => {
        batchChangeParentTask(params).then(res=>{
          var tips = res.data.tips;
          if(tips.isOk){
            this.searchXmTasks();
            
            var rows=[...this.sels,{id:'xxxxx',parentTaskid:task.id}]
            treeTool.reloadAllChildren(this.$refs.table,this.maps,rows,'parentTaskid',this.loadXmTaskLazy)
          }
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        });
      })
    },
    initData(){
      if (this.selProject) {
        this.filters.selProject = this.selProject;
      }
      if (this.xmProduct) {
        this.filters.product = this.xmProduct;
      }
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
      onProductClearSelect(){
        this.filters.xmProduct=null;
        this.searchXmTasks();
      },
      onTaskWorkloadSubmit(){
        this.taskWorkloadVisible=false;
        this.searchXmTasks();
        treeTool.reloadAllChildren(this.$refs.table,this.maps,[this.editForm],'parentTaskid',this.loadXmTaskLazy)
      },
      showWorkload(row){
        this.editForm=row
        this.taskWorkloadVisible=true;
      }
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {
    "xm-task-add": XmTaskAdd,
    "xm-task-edit": XmTaskEdit,
    XmTaskAgileKanban,
    xmExecuserMng,
    xmSkillMng,
    skillMng,
    xmPhaseMng,
    xmTaskTemplateMng,
    XmProjectSelect,
    xmExchangeMng,
    xmMenuSelect,
    XmMenuRichDetail,
    XmGantt, 
    XmGroupSelect,
    XmProductSelect,
    XmTaskAgileKanban,
    TagMng,
    XmTaskList,
    TagDialog,
    XmGroupDialog,
    XmTableConfig,
    XmTaskWorkloadEdit,
    //在下面添加其它组件
  },
  mounted() {
    this.initData();
    this.$nextTick(() => {
      if(this.isTaskCenter ||(this.selProject && this.selProject.id)){
        this.getXmTasks();
      } 
      this.tableHeight = this.source == 'GZT' ? this.tableHeight : util.calcTableMaxHeight(this.$refs.table.$el);
      initSimpleDicts( "all", ["planType","taskType","priority","xmTaskSettleSchemel","priority","taskState" ]).then((res) => {
        this.dicts = res.data.data;
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
