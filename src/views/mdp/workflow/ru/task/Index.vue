<template>
    	<section class="border padding">
		<el-row>
      <mdp-select-cate v-model="filters['categoryId']" width="8em" clearable filterable placeholder="选择归档" /> 
			<mdp-select v-model="filters['procCategory']" width="8em" clearable filterable placeholder="选择分类" :load-fun="listCategorys"/> 
 			<mdp-select v-model="filters['res.suspensionState']" width="5em" item-code="suspensionState" clearable filterable placeholder="状态" /> 
      <mdp-select-tag v-model="filters['tagIds']" width="8em" clearable filterable placeholder="标签" /> 

      <el-input v-model="filters['p.mainTitle']" style="width: 10em;" placeholder="流程名字查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
			<el-input v-model="filters['assignee']"  style="width: 10em;" placeholder="执行人名字查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

			<el-input v-model="filters['p.startUsername']" style="width: 10em;" placeholder="发起人查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
        <mdp-date-range v-model="filters" style="width: 14em;" start-key="fromStartTime" end-key="toStartTime" type="daterange" align="right" unlink-panels
          range-separator="-" start-placeholder="创建日期" end-placeholder="创建日期" value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00','23:59:59']">
        </mdp-date-range>
  			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			 
            <span style="float:right;" v-if="currOpType=='select' &&  this.multiple==true">
                <el-button :disabled="disabledJudge('selectBtn') || this.sels.length===0" type="primary" @click="selectListConfirm" icon="el-icon-check"/>
            </span>
		</el-row>
		<el-row>  
        <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
        <el-button type="text" icon="el-icon-zoom-out" @click="searchReset()">重置查询</el-button>&nbsp;&nbsp;&nbsp; 
        <el-popover placement="top" width="375" trigger="manual" v-model="weixinContentVisible">
          <p>{{weixinContent}}</p>
          <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="doCopyWeixinUrl">拷贝链接</el-button>
          <el-button type="text" size="mini" @click="doCopyWeixinContent">拷贝内容</el-button>
          </div>
          <el-button slot="reference" v-show="assigneeToMe!=true" type="text"
          v-on:click="showWeixin">微信催办</el-button>
        </el-popover>

        <el-button type="text" v-show="assigneeToMe!=true" v-on:click="showSendSms">短信催办</el-button>
		</el-row>
		<el-row v-if="showCalendar==false">
			<!--列表 Task act_ru_task-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
 				<el-table-column prop="mainTitle"  label="流程名称" min-width="300" show-overflow-tooltip col-type="String" v-if="showCol('mainTitle')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.mainTitle" :maxlength="255" @change="editSomeFields(scope.row,'mainTitle',$event)" :disabled="!editable || disabledJudge('mainTitle')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="name"  label="任务名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('name')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.name" :maxlength="255" @change="editSomeFields(scope.row,'name',$event)" :disabled="!editable || disabledJudge('name')"/>
				    </template>
				</el-table-column> 
				<el-table-column sortable prop="tagNames" label="标签" min-width="100" show-overflow-tooltip>
				<template slot-scope="scope">
          <mdp-select-tag show-style="tag" v-model="scope.row.tagIds" clearable filterable placeholder="标签" multiple split="," :disabled="true"/>     
				</template>
				</el-table-column>
				<el-table-column sortable prop="startDeptName" label="发起部门" min-width="120" show-overflow-tooltip>
				</el-table-column>
				<el-table-column sortable prop="startUsername" label="发起人" min-width="100" show-overflow-tooltip>
				</el-table-column>
				
				<el-table-column prop="assigneeName"  label="执行人名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('assigneeName')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.assigneeName" :maxlength="255" @change="editSomeFields(scope.row,'assigneeName',$event)" :disabled="!editable || disabledJudge('assigneeName')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="createTime" sortable  label="创建时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('createTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.createTime" @change="editSomeFields(scope.row,'createTime',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!editable || disabledJudge('createTime')"/>
				    </template>
				</el-table-column>
				<el-table-column sortable prop="planFinishTime" label="到期时间" min-width="120" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="suspensionState"  label="状态" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('suspensionState')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" item-code="suspensionState" v-model="scope.row.suspensionState" @change="editSomeFields(scope.row,'suspensionState',$event)" :precision="0" :disabled="!editable || disabledJudge('suspensionState')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="delegation"  label="代办" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('delegation')">
				    <template slot-scope="scope">
                            <mdp-select show-style="tag" no-match-text="否" placeholder="是否代办" item-code="delegationStatus" v-model="scope.row.delegation" :maxlength="64" @change="editSomeFields(scope.row,'delegation',$event)" :disabled="!editable || disabledJudge('delegation')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="claimTime"  label="委派时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('claimTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.claimTime" @change="editSomeFields(scope.row,'claimTime',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!editable || disabledJudge('claimTime')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="tenantId"  label="机构号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tenantId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.tenantId" :maxlength="64" @change="editSomeFields(scope.row,'tenantId',$event)" :disabled="!editable || disabledJudge('tenantId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="id" label="任务编号" min-width="120" show-overflow-tooltip  fixed="left" col-type="String" v-if="showCol('id')"></el-table-column>
				<el-table-column prop="rev"  label="版本" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('rev')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.rev" @change="editSomeFields(scope.row,'rev',$event)" :precision="0" :disabled="!editable || disabledJudge('rev')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="assignee"  label="执行人编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('assignee')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.assignee" :maxlength="255" @change="editSomeFields(scope.row,'assignee',$event)" :disabled="!editable || disabledJudge('assignee')"/>
				    </template>
				</el-table-column>
				
				
				<el-table-column prop="priority"  label="优先级" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('priority')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.priority" @change="editSomeFields(scope.row,'priority',$event)" :precision="0" :disabled="!editable || disabledJudge('priority')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="owner"  label="所有者" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('owner')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.owner" :maxlength="255" @change="editSomeFields(scope.row,'owner',$event)" :disabled="!editable || disabledJudge('owner')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="executionId"  label="执行编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('executionId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.executionId" :maxlength="64" @change="editSomeFields(scope.row,'executionId',$event)" :disabled="!editable || disabledJudge('executionId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="procInstId"  label="流程实例编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('procInstId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.procInstId" :maxlength="64" @change="editSomeFields(scope.row,'procInstId',$event)" :disabled="!editable || disabledJudge('procInstId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="procDefId"  label="流程定义编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('procDefId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.procDefId" :maxlength="64" @change="editSomeFields(scope.row,'procDefId',$event)" :disabled="!editable || disabledJudge('procDefId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="description"  label="流程描述" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('description')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.description" :maxlength="4000" @change="editSomeFields(scope.row,'description',$event)" :disabled="!editable || disabledJudge('description')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="taskDefId"  label="节点编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('taskDefId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.taskDefId" :maxlength="64" @change="editSomeFields(scope.row,'taskDefId',$event)" :disabled="!editable || disabledJudge('taskDefId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="scopeDefinitionId"  label="边界编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('scopeDefinitionId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.scopeDefinitionId" :maxlength="64" @change="editSomeFields(scope.row,'scopeDefinitionId',$event)" :disabled="!editable || disabledJudge('scopeDefinitionId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="parentTaskId"  label="上级任务编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('parentTaskId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.parentTaskId" :maxlength="64" @change="editSomeFields(scope.row,'parentTaskId',$event)" :disabled="!editable || disabledJudge('parentTaskId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="taskDefKey"  label="节点定义编码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('taskDefKey')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.taskDefKey" :maxlength="64" @change="editSomeFields(scope.row,'taskDefKey',$event)" :disabled="!editable || disabledJudge('taskDefKey')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="formKey"  label="表单编码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('formKey')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.formKey" :maxlength="64" @change="editSomeFields(scope.row,'formKey',$event)" :disabled="!editable || disabledJudge('formKey')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="isCountEnabled"  label="is_count_enabled_" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('isCountEnabled')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.isCountEnabled" :maxlength="3" @change="editSomeFields(scope.row,'isCountEnabled',$event)" :disabled="!editable || disabledJudge('isCountEnabled')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="dueDate"  label="过期时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('dueDate')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.dueDate" @change="editSomeFields(scope.row,'dueDate',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!editable || disabledJudge('dueDate')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="varCount"  label="var_count_" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('varCount')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.varCount" @change="editSomeFields(scope.row,'varCount',$event)" :precision="0" :disabled="!editable || disabledJudge('varCount')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="idLinkCount"  label="id_link_count_" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('idLinkCount')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.idLinkCount" @change="editSomeFields(scope.row,'idLinkCount',$event)" :precision="0" :disabled="!editable || disabledJudge('idLinkCount')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="subTaskCount"  label="sub_task_count_" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('subTaskCount')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.subTaskCount" @change="editSomeFields(scope.row,'subTaskCount',$event)" :precision="0" :disabled="!editable || disabledJudge('subTaskCount')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="scopeId"  label="scope_id_" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('scopeId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.scopeId" :maxlength="64" @change="editSomeFields(scope.row,'scopeId',$event)" :disabled="!editable || disabledJudge('scopeId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="subScopeId"  label="sub_scope_id_" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('subScopeId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.subScopeId" :maxlength="64" @change="editSomeFields(scope.row,'subScopeId',$event)" :disabled="!editable || disabledJudge('subScopeId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="category"  label="分类" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('category')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.category" :maxlength="255" @change="editSomeFields(scope.row,'category',$event)" :disabled="!editable || disabledJudge('category')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="scopeType"  label="scope_type_" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('scopeType')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.scopeType" :maxlength="64" @change="editSomeFields(scope.row,'scopeType',$event)" :disabled="!editable || disabledJudge('scopeType')"/>
				    </template>
				</el-table-column>
				<el-table-column label="操作" :width="currOpType=='mng'?200:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
				        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})" icon="el-icon-edit" title="修改一条数据"/>
 				    </template>

				    <template scope="scope" v-else-if="currOpType=='list'" >
				        <el-button   type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})" icon="el-icon-view"/>
 				    </template>

				    <template scope="scope" v-else-if="currOpType=='select' && this.multiple!=true" >
				        <el-button   type="primary" @click="selectConfirm(scope.row)" icon="el-icon-check"/>
 				    </template>
				</el-table-column>
			</el-table>
		</el-row>
    <el-calendar  v-if="showCalendar==true" v-loading="load.list" v-model="calendarDate">
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
                      <el-link type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row})">
                        {{scope.row.mainTitle}}【{{scope.row.name}}】
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
		<el-row>
			<el-pagination
				layout="slot,total, sizes, prev, next,pager,jumper"
				@current-change="handleCurrentChange"
				@size-change="handleSizeChange"
				:page-sizes="[10,20, 50, 100, 500]"
				:current-page="pageInfo.pageNum"
				:page-size="pageInfo.pageSize"
				:total="pageInfo.total"
				style="float:right;"
			> 
			</el-pagination> 
		</el-row>
		<el-row>
			<!--新增修改明细 Task act_ru_task界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                    <procinst-parames-execution-set v-if="visible"
                    :taskInfo="data.formData" :procDefId="data.formData.procDefId" :procInstId="data.formData.procInstId"
                    :visible="visible" @cancel="dialog.close()" @submit="afterEditSubmit">
                    </procinst-parames-execution-set>
                 </template>
            </mdp-dialog>
            <mdp-dialog ref="sendSmsDialog">
                <template v-slot="{visible,data,dialog}">
                  <send-sms :sms-body-params="data.smsBodyParams" :sms-user-list="data.smsUserList" :load-phoneno-by-userid="true"
                    :visible="visible" @cancel="dialog.close()"></send-sms>
                 </template>
            </mdp-dialog>
            
 	    </el-row>
	</section>
</template>

<script>

import util from "@/components/mdp-ui/js/util"; // 全局公共库
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as TaskApi from '@/api/mdp/workflow/ru/task';
 import { mapGetters } from 'vuex' 
import ProcinstParamesExecutionSet from "../procinstParames/ProcinstParamesExecutionSet"; // 流程参数加载
import {    listCategorys  } from "@/api/mdp/workflow/re/procdef"; 
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
VueClipboard.config.autoSetContainer = true; // add this line
Vue.use(VueClipboard);
import SendSms from "@/views/mdp/sms/SendSms"; // 流程参数加载
export default {
    name:'taskMng',
    mixins:[MdpTableMixin],
    components: {
        ProcinstParamesExecutionSet,SendSms
    },
    computed: {
    },
    watch:{
    },
	props: ["assigneeToMe", "isClaim","bizParentPkid","bizPkid","procInstIds", "source","defaultShowCalendar"], // 待我执行的任务 
    data() {
      const fromStartTime = new Date();
      const toStartTime = new Date();
      fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'act_ru_task',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'task',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            editable:false,//是否可编辑模式

            //增删改查(含批量)接口
            apis:{
                list: TaskApi.listAssigneeToAnyTasks,
                add: TaskApi.addTask,
                del: TaskApi.delTask,
                edit: TaskApi.editTask,
                editSomeFields: TaskApi.editSomeFieldsTask,
                batchAdd: TaskApi.batchAddTask,
                batchDel: TaskApi.batchDelTask,
                batchEdit: TaskApi.batchEditTask,
            },
			      weixinContentVisible:false,
            weixinContent:'',
            showCalendar:false, 
            calendarDate: util.formatDate(toStartTime, 'yyyy-MM-dd'),
        }
    },
    methods: {
		listCategorys,
         //页面初始化需要配置的特殊逻辑写这里
          initCurrData(){
            if(this.defaultShowCalendar){
              this.showCalendar=true
            }else{
              this.showCalendar=false
            }
            
            this.pageInfo.orderFields=['create_time_']
            this.pageInfo.orderDirs=['desc']
            this.searchTableDatas();
          },

          /**
           * 检查参数是否满足调用后台接口的条件
           *
           * @param params 提交给后台的参数池,map类型
           * @returns true / false
           */
          preQueryParamCheck(params){
            if(this.bizParentPkid){
              params.bizParentPkid=this.bizParentPkid
            }
            if(this.bizPkid){
              params.bizPkid=this.bizPkid
            }
            if(this.procInstIds){
              params.procInstId="$IN"+this.procInstIds
            }
            if(this.assigneeToMe){
              params.assignee=this.userInfo.userid
            } 
            if(this.isClaim){
              this.apis.list=TaskApi.listMyCandidateUserTasks
            }else {
              this.apis.list=TaskApi.listAssigneeToAnyTasks
            }
            return true;
          },

          //页面数据加载完后需要对数据进行加工处理的
          afterList(res,isOk,apiName){

          },

          /**
           * 对修改的字段进行判断，返回false ,将取消更新数据库
           * @param {*} row 当前选中的行
           * @param {*} fieldName 修改的字段名
           * @param {*} $event 修改后的值
           * @param {*} params 将要提交服务器的参数
           * @returns true/false 返回false ,将取消更新数据库
           */
          editSomeFieldsCheck(row,fieldName,$event,params){
              if(this.currOpType=='add'||this.currOpType=='detail'){
                  return false;
              }
              params[fieldName]=$event
              return true;
          },
           /**
           * 设置某个关键词、按钮、输入框禁用 disabledRules['addBtn']=false
           * 判断某个对象是否可编辑 this.disabledJudge('addBtn')==false
           */
          disabledRulesInit(disabledRules){

          },
         /**
          * 打开某个子页面
          */
        openForm(res){
            let {parentOpType,formRefId,subOpType,formData} = res
            if(!formRefId){
                formRefId=this.getRefId()+"FormDialog"
            }
            if(!parentOpType){
                parentOpType=this.currOpType
            }
            var form=this.$refs[formRefId]
            if(form){
                res.parentOpType=parentOpType
                res.formRefId=formRefId
                form.open(res);
            }else{

            }

        },
		
		showSendSms: function() {
        if (this.sels.length > 1) {
          this.$notify({position:'bottom-left',showClose: true,
            message: "一次只能给一个人发短信",
            type: "error"
          });
        } else if (this.sels.length < 1) {
          this.$notify({position:'bottom-left',showClose: true,
            message: "请选择一条任务",
            type: "error"
          });
        } else {
          const task = this.sels[0];
          var smsBodyParams = [
            task.assigneeName,
            task.mainTitle + "-" + task.taskName,
            task.createTime,
            task.userid
          ];
          var smsUserList = [{
            userid: task.assignee
          }]; 
          this.$refs['sendSmsDialog'].open({smsBodyParams:smsBodyParams,smsUserList:smsUserList})
        }
      },
      showWeixin: function() {
         if (this.sels.length < 1) {
          this.$notify({position:'bottom-left',showClose: true,
            message: "请选择任务",
            type: "error"
          });
          this.weixinContentVisible = false;
          return false;
        } else if(this.sels.length==1){
          const task = this.sels[0];
          // var url=window.location.href;
          const url =
            window.location.protocol +
            "//" +
            window.location.host +
            "/"+process.env.CONTEXT+"/" +
            process.env.VERSION +
            "/#/mdp/workflow/ru/task/me";  
              this.weixinContentVisible = true;
              this.weixinContent =
                task.assigneeName +
                "您好，您有任务【" +
                task.mainTitle +
                "-" +
                task.name +
                "】待处理，请登陆OA系统或者点击以下链接处理。" +
                url  
          
              this.$copyText(this.weixinContent).then(e => {
                this.$notify({position:'bottom-left',showClose: true,
                  message: "已拷贝内容，请黏贴到微信中",
                  type: "success"
                });
              });
        }else{ 
          // var url=window.location.href;
          const url =
            window.location.protocol +
            "//" +
            window.location.host +
            "/"+process.env.CONTEXT+"/" +
            process.env.VERSION +
            "/#/mdp/workflow/ru/task/me";  
              this.weixinContentVisible = true;
              this.weixinContent =
                this.sels.map(k=>k.assigneeName).join(",") +
                "您好，您有任务待处理，请登陆OA系统或者点击以下链接处理。" +
                url   
              this.$copyText(this.weixinContent).then(e => {
                this.$notify({position:'bottom-left',showClose: true,
                  message: "已拷贝内容，请黏贴到微信中",
                  type: "success"
                });
              });
        }
      },
      showOaMsg: function() {
        if (this.sels.length > 1) {
          this.$notify({position:'bottom-left',showClose: true,
            message: "一次只能给一个人发信",
            type: "error"
          });
          return false;
        } else if (this.sels.length < 1) {
          this.$notify({position:'bottom-left',showClose: true,
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
          "/"+process.env.CONTEXT+"/" +
          process.env.VERSION +
          "/#/mdp/workflow/ru/task/me";

        this.$copyText(href).then(e => {});
      },
      doCopyWeixinContent: function() {
        this.weixinContentVisible = false;
        this.$copyText(this.weixinContent).then(e => {});
      },
      showCalendarDataTips: function(date, data) {
        var datas = this.tableDatas;
        var startTasks = [];
        var planFinishTasks = [];
        var runningTasks = [];
        var delayTasks = [];
        var tags = [];

        var now = new Date();
        var dateStr = util.formatDate(now, "yyyy-MM-dd");
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
                 var fieldName=util.toLine(obj.prop)
                 if(fieldName=='create_time'){
                  fieldName=fieldName+"_"
                 }
                this.pageInfo.orderFields=[fieldName]; 
                this.pageInfo.orderDirs=[dir];
            }
            this.loadTableDatas();
        },
    },
    mounted() {
      
    }
}

</script>

<style scoped>
</style>