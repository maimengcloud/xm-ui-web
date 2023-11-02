<template>
    	<section class="border padding">
		<el-row>
      <mdp-select-cate v-model="filters['categoryId']" width="8em" clearable filterable placeholder="选择归档" />  
 			<mdp-select v-model="filters['category']" width="8em" clearable filterable placeholder="选择分类" :load-fun="listCategorys"/> 
 			<mdp-select v-model="filters['res.suspensionState']"  width="5em" item-code="suspensionState" clearable filterable placeholder="状态" /> 
       <mdp-select-tag v-model="filters['tagIds']"  width="8em" clearable filterable placeholder="标签" /> 

			 <el-input v-model="filters['pa.mainTitle']" style="width: 10em;" placeholder="名字查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
  			
			<el-input v-model="filters['pa.startUsername']" style="width: 10em;" placeholder="发起人查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

			<el-input v-model="filters['pa.startDeptName']" style="width: 10em;" placeholder="发起部门查询 输入 *字符* >10 <9 等" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <mdp-date-range v-model="filters" start-key="fromStartTime" style="width: 14em;" end-key="toStartTime" type="daterange" align="right" unlink-panels
                range-separator="-" start-placeholder="创建日期" end-placeholder="创建日期" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00','23:59:59']">
            </mdp-date-range>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="el-icon-search" type="primary">查询</el-button>
			<span style="float:right;" v-if="currOpType=='mng'">
                 <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="el-icon-delete"/>
            </span>
            <span style="float:right;" v-else-if="currOpType=='select' &&  this.multiple==true">
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
						<el-button slot="reference" type="text"
						v-on:click="showWeixin">微信催办</el-button>
					</el-popover>

					<el-button v-on:click="showSendSms" type="text">短信催办</el-button>
		</el-row>
		<el-row v-show="showCalendar==false">
			<!--列表 Execution act_ru_execution-->
			<el-table :ref="refId+'Table'" :height="100" v-adaptive="{bottomOffset: bottomOffset}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>  
				<el-table-column sortable prop="mainTitle" label="流程" min-width="300">
				</el-table-column>
				<el-table-column prop="taskName" label="当前节点" min-width="100" show-overflow-tooltip>
				</el-table-column>
				<el-table-column sortable prop="tagNames" label="标签" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <mdp-select-tag show-style="tag" v-model="scope.row.tagIds" clearable filterable placeholder="标签" multiple split="," :disabled="true"/>    
          </template>
				</el-table-column> 
				<el-table-column prop="suspensionState" label="状态" min-width="80">
					<template slot-scope="scope"> 
						<mdp-select show-style="tag" item-code="suspensionState" v-model="scope.row.suspensionState" :maxlength="64" @change="editSomeFields(scope.row,'suspensionState',$event)" :disabled="disabledJudge('suspensionState')||true"/>
					</template>
				</el-table-column>
				<el-table-column sortable prop="assigneeName" label="执行人" width="100" show-overflow-tooltip>
				</el-table-column>
				<el-table-column sortable prop="startUsername" label="发起人" width="100" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="tenantId"  label="机构号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tenantId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.tenantId" :maxlength="64" @change="editSomeFields(scope.row,'tenantId',$event)" :disabled="!editable || disabledJudge('tenantId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="startTime" sortable label="发起时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('startTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.startTime" @change="editSomeFields(scope.row,'startTime',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!editable || disabledJudge('startTime')"/>
				    </template>
				</el-table-column>
				<el-table-column sortable prop="planFinishTime" label="到期时间" width="120" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="startUserId"  label="发起人编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('startUserId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.startUserId" :maxlength="64" @change="editSomeFields(scope.row,'startUserId',$event)" :disabled="!editable || disabledJudge('startUserId')"/>
				    </template>
				</el-table-column>
				<el-table-column sortable prop="startDeptName" label="发起部门" width="150" show-overflow-tooltip>
				</el-table-column>           
				<el-table-column prop="lockTime"  label="锁定时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('lockTime')">
				    <template slot-scope="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.lockTime" @change="editSomeFields(scope.row,'lockTime',$event)"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" :disabled="!editable || disabledJudge('lockTime')"/>
				    </template>
				</el-table-column>
				
				<el-table-column prop="procInstId"  label="实例编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('procInstId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.procInstId" :maxlength="64" @change="editSomeFields(scope.row,'procInstId',$event)" :disabled="!editable || disabledJudge('procInstId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="procDefId"  label="定义编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('procDefId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.procDefId" :maxlength="64" @change="editSomeFields(scope.row,'procDefId',$event)" :disabled="!editable || disabledJudge('procDefId')"/>
				    </template>
				</el-table-column>
				
				<el-table-column prop="actId"  label="节点编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('actId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.actId" :maxlength="64" @change="editSomeFields(scope.row,'actId',$event)" :disabled="!editable || disabledJudge('actId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="isActive"  label="活动的" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('isActive')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.isActive" :maxlength="3" @change="editSomeFields(scope.row,'isActive',$event)" :disabled="!editable || disabledJudge('isActive')"/>
				    </template>
				</el-table-column> 
				<el-table-column prop="startActId"  label="启动节点编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('startActId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.startActId" :maxlength="64" @change="editSomeFields(scope.row,'startActId',$event)" :disabled="!editable || disabledJudge('startActId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="isCountEnabled"  label="是否可统计" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('isCountEnabled')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.isCountEnabled" :maxlength="3" @change="editSomeFields(scope.row,'isCountEnabled',$event)" :disabled="!editable || disabledJudge('isCountEnabled')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="businessKey"  label="编码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('businessKey')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.businessKey" :maxlength="64" @change="editSomeFields(scope.row,'businessKey',$event)" :disabled="!editable || disabledJudge('businessKey')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="parentId"  label="上级编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('parentId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.parentId" :maxlength="64" @change="editSomeFields(scope.row,'parentId',$event)" :disabled="!editable || disabledJudge('parentId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="taskCount"  label="任务数统计" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('taskCount')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.taskCount" @change="editSomeFields(scope.row,'taskCount',$event)" :precision="0" :disabled="!editable || disabledJudge('taskCount')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="cachedEntState"  label="缓存状态" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('cachedEntState')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.cachedEntState" @change="editSomeFields(scope.row,'cachedEntState',$event)" :precision="0" :disabled="!editable || disabledJudge('cachedEntState')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="isMiRoot"  label="是否根" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('isMiRoot')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.isMiRoot" :maxlength="3" @change="editSomeFields(scope.row,'isMiRoot',$event)" :disabled="!editable || disabledJudge('isMiRoot')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="isScope"  label="是否边界" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('isScope')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.isScope" :maxlength="3" @change="editSomeFields(scope.row,'isScope',$event)" :disabled="!editable || disabledJudge('isScope')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="isEventScope"  label="是否事件边界" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('isEventScope')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.isEventScope" :maxlength="3" @change="editSomeFields(scope.row,'isEventScope',$event)" :disabled="!editable || disabledJudge('isEventScope')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="isConcurrent"  label="是否当前节点" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('isConcurrent')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.isConcurrent" :maxlength="3" @change="editSomeFields(scope.row,'isConcurrent',$event)" :disabled="!editable || disabledJudge('isConcurrent')"/>
				    </template>
				</el-table-column> 
				<el-table-column prop="rev"  label="版本号" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('rev')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.rev" @change="editSomeFields(scope.row,'rev',$event)" :precision="0" :disabled="!editable || disabledJudge('rev')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="rootProcInstId"  label="根实例编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('rootProcInstId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.rootProcInstId" :maxlength="64" @change="editSomeFields(scope.row,'rootProcInstId',$event)" :disabled="!editable || disabledJudge('rootProcInstId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="superExec"  label="super_exec_" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('superExec')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.superExec" :maxlength="64" @change="editSomeFields(scope.row,'superExec',$event)" :disabled="!editable || disabledJudge('superExec')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="evtSubscrCount"  label="evt_subscr_count_" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('evtSubscrCount')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.evtSubscrCount" @change="editSomeFields(scope.row,'evtSubscrCount',$event)" :precision="0" :disabled="!editable || disabledJudge('evtSubscrCount')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="jobCount"  label="job_count_" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('jobCount')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.jobCount" @change="editSomeFields(scope.row,'jobCount',$event)" :precision="0" :disabled="!editable || disabledJudge('jobCount')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="timerJobCount"  label="timer_job_count_" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('timerJobCount')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.timerJobCount" @change="editSomeFields(scope.row,'timerJobCount',$event)" :precision="0" :disabled="!editable || disabledJudge('timerJobCount')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="suspJobCount"  label="susp_job_count_" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('suspJobCount')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.suspJobCount" @change="editSomeFields(scope.row,'suspJobCount',$event)" :precision="0" :disabled="!editable || disabledJudge('suspJobCount')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="deadletterJobCount"  label="deadletter_job_count_" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('deadletterJobCount')">
				    <template slot-scope="scope">
                            <mdp-number show-style="tag" v-model="scope.row.deadletterJobCount" @change="editSomeFields(scope.row,'deadletterJobCount',$event)" :precision="0" :disabled="!editable || disabledJudge('deadletterJobCount')"/>
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
				<el-table-column prop="callbackId"  label="callback_id_" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('callbackId')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.callbackId" :maxlength="64" @change="editSomeFields(scope.row,'callbackId',$event)" :disabled="!editable || disabledJudge('callbackId')"/>
				    </template>
				</el-table-column>
				<el-table-column prop="callbackType"  label="callback_type_" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('callbackType')">
				    <template slot-scope="scope">
                            <mdp-input show-style="tag" v-model="scope.row.callbackType" :maxlength="255" @change="editSomeFields(scope.row,'callbackType',$event)" :disabled="!editable || disabledJudge('callbackType')"/>
				    </template>
				</el-table-column>				
				<el-table-column prop="id" label="编号" min-width="120" show-overflow-tooltip  col-type="String" v-if="showCol('id')"></el-table-column>

				<el-table-column label="操作" :width="currOpType=='mng'?200:180" fixed="right">
				    <template slot="header" slot-scope="scope">
                        <el-button icon="el-icon-download" @click="export2Excel()">导出</el-button>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
                    </template>
				    <template scope="scope" v-if="currOpType=='mng'"  >
						 
				  		
				        <el-button :disabled="disabledJudge('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'详情'})" icon="el-icon-edit" title="修改一条数据"/>
 				        <el-button :disabled="disabledJudge('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  title="删除一条数据"/>
						 <el-button  type="primary" v-if="scope.row.suspensionState=='1'" @click="handleSuspend({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'挂起流程'})"  title="挂起流程">挂起</el-button>
				  		<el-button  type="primary" v-if="scope.row.suspensionState=='2'" @click="handleActivite({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'挂起流程'})"  title="激活流程">激活</el-button>

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
        <el-calendar v-if="showCalendar==true" v-loading="load.list" v-model="calendarDate">
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
			<!--新增修改明细 Execution act_ru_execution界面-->  
            <mdp-dialog :ref="refId+'FormDialog'">
                <template v-slot="{visible,data,dialog}">
                    <procinst-parames-execution-set v-if="data.formData"
                        :taskInfo="data.formData" :procDefId="data.formData.procDefId" :procInstId="data.formData.procInstId"
                        :visible="visible" @cancel="dialog.close()" @submit="afterEditSubmit"/> 
                </template>
            </mdp-dialog>

			

			<mdp-dialog>
                <template v-slot="{visible,data,dialog}">
				<tag-mng  :jump="true" @select-confirm="onTagSelected">
				</tag-mng>
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
import * as ExecutionApi from '@/api/mdp/workflow/ru/execution';
import {  listCategorys  } from "@/api/mdp/workflow/re/procdef";
 import { mapGetters } from 'vuex'
import ProcinstParamesExecutionSet from '../procinstParames/ProcinstParamesExecutionSet'; //流程参数加载
import {createShortToken} from '@/api/login'; //下拉框数据查询 

import Vue from "vue";
import VueClipboard from "vue-clipboard2";
VueClipboard.config.autoSetContainer = true; // add this line
Vue.use(VueClipboard);
import SendSms from "@/views/mdp/sms/SendSms"; // 流程参数加载

export default {
    name:'executionMng',
    mixins:[MdpTableMixin],
    components: {
        ProcinstParamesExecutionSet,SendSms,
    }, 
    props: ['isMyMonitors', 'isMyStart', 'isMySponsors', 'isArchive', 'isMyPartake', 'isAll', 'defaultShowCalendar'],
    computed: {
    },
    watch:{
    },
    data() {
      const fromStartTime = new Date();
      const toStartTime = new Date();
      fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'act_ru_execution',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'execution',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },
            editable:false,
            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: ExecutionApi.listExecution,
                add: ExecutionApi.addExecution,
                del: ExecutionApi.delExecution,
                edit: ExecutionApi.editExecution,
                editSomeFields: ExecutionApi.editSomeFieldsExecution,
                batchAdd: ExecutionApi.batchAddExecution,
                batchDel: ExecutionApi.batchDelExecution,
                batchEdit: ExecutionApi.batchEditExecution,
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
                this.showCalendar=false;
            }
            
            this.pageInfo.orderFields=['start_time_']
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
			      if ( this.isMyStart ) {
                params['pa.userid'] = this.userInfo.userid
            }
            if (this.isMyPartake) {
                params.partake = this.userInfo.userid
            }
            if (this.isMySponsors) {
                params.sponsors = '*' + this.userInfo.userid + '*'
            }
            if (this.isMyMonitors ) {
                params.monitors = '*' + this.userInfo.userid + '*'
            } 
            
            if(this.bizParentPkid){
                params.bizParentPkid=this.bizParentPkid
            }
            if(this.bizPkid){
                params.bizPkid=this.bizPkid
            } 
            if(this.procInstIds){
                params.procInstId="$IN"+this.procInstIds
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
		onTagSelected(tags){

		},
		formatterSuspensionState(row, column, cellValue) {
			return cellValue == 1 ? "激活的" : "挂起的"
		},
		
      //激活流程
      handleActivite: function(row, index) {
        this.$confirm('确认要激活该流程吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.list = true;
          let params = {
            procInstId: row.procInstId
          };
          ExecutionApi.activiteExecution(params).then((res) => {
            this.load.list = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = 0;
              this.searchTableDatas();
            }
            this.$notify({position:'bottom-left',showClose: true,
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });

          });
        }).catch(() => {
          this.load.list = false;

        });
      },
      //挂起流程
      handleSuspend: function(row, index) {
        this.$confirm('确认要挂起该流程吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.load.list = true;
          let params = {
            procInstId: row.procInstId
          };
          ExecutionApi.suspendExecution(params).then((res) => {
            this.load.list = false;
            var tips = res.data.tips;
            if (tips.isOk) {
              this.pageInfo.total = 0;
              this.searchTableDatas();
            }
            this.$notify({position:'bottom-left',showClose: true,
              message: tips.msg,
              type: tips.isOk ? 'success' : 'error'
            });

          });
        }).catch(() => {
          this.load.list = false;

        });
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
                task.mainTitle +"】待处理，请登陆OA系统或者点击以下链接处理。" +
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
          if (task.startTime.indexOf(data.day) >= 0) {
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
              task.startTime > data.day
            ) {
              // 未开始
            } else if (task.planFinishTime < data.day && dateStr >= data.day) {
              task.calStatus = "延期";
              delayTasks.push(task);
            }
          } else {
            if (task.startTime < data.day) {
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
                 if(fieldName=='start_time'){
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