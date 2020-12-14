<template>
	<section>
		<el-row class="xm-task">
			<el-menu active-text-color="#00abfc" :default-active="selkey" @select="changeSelKey" class="el-menu-demo" mode="horizontal">
				<el-menu-item class="showall" index="all">全部</el-menu-item>
				<el-menu-item v-if="batchEditVisible==false" index="work">未完成</el-menu-item>
				<el-menu-item v-if="batchEditVisible==false" index="finish">已完成</el-menu-item>
				<el-menu-item v-if="batchEditVisible==false" index="myFocus">我关注</el-menu-item> 
				<el-menu-item v-if="batchEditVisible==false" index="myExecuserStatus0">我排队</el-menu-item>
				<el-menu-item v-if="batchEditVisible==false" index="myExecuserStatus1">我执行</el-menu-item>
				<el-menu-item v-if="batchEditVisible==false" index="myExecuserStatus2">我提交</el-menu-item>
				<el-menu-item v-if="batchEditVisible==false" index="myExecuserStatus3">我的验收成功</el-menu-item>
				<el-menu-item v-if="batchEditVisible==false" index="myExecuserStatus4">我的验收失败</el-menu-item>
				<el-menu-item v-if="batchEditVisible==false" index="myExecuserStatus5">我的付款中</el-menu-item>
				<el-menu-item v-if="batchEditVisible==false" index="myExecuserStatus6">我的付款成功</el-menu-item>
				<el-menu-item v-if="batchEditVisible==false" index="myExecuserStatus7">我放弃的</el-menu-item>

				<div  v-if="batchEditVisible!=true"  style="line-height:50px;float:right;margin-right:10px;">
					<el-button type="primary" v-if="  projectPhase!=null " @click="showBatchEdit" v-loading="load.edit">批量修改</el-button>
 					<el-button v-if=" isTaskCenter!='1'   && isMy!='1'"  @click="showTaskTemplate" type="success">导入任务</el-button>
					<el-button v-if=" isTaskCenter!='1'   && isMy!='1'"  @click="showMenu" type="success">由故事创建任务</el-button> 
					<el-button v-if=" isTaskCenter!='1'   && isMy!='1'"  @click="showAdd" type="primary" round>新建任务</el-button> 
				</div>
			</el-menu> 
      <el-row>
      </el-row>
			<el-menu v-if="batchEditVisible!=true"  active-text-color="#00abfc" :default-active="filters.taskType" @select="changeTaskType" class="el-menu-demo" mode="horizontal">
				<el-menu-item index="all">全部任务类型</el-menu-item> 
				<el-menu-item  v-for="(i,index) in options.taskType" :index="i.optionValue" :key="index">{{i.optionName}}</el-menu-item> 
				<div style="line-height:50px;float:right;margin-right:10px;">
					<el-checkbox v-model="gstcVisible"  >甘特图</el-checkbox>
					<el-tag v-if=" !selProject && filters.selProject" :closable="!selProject"  @click="showProjectList" @close="clearProject">项目:{{this.filters.selProject.name}}</el-tag>
					<el-tag v-if=" !selProject && !filters.selProject" @click="showProjectList" type="plian">未选项目，点我</el-tag>

					<el-input v-if="batchEditVisible==false"  style="width:200px;" v-model="searchTask" placeholder="任务名称"></el-input> 

					<el-button    @click="searchXmTasks" type="primary">查询</el-button> 

				</div>
			</el-menu>
				<!-- @selection-change="selsChange" -->
			<el-menu v-if="batchEditVisible==true" active-text-color="#00abfc" :default-active="filters.taskType" @select="changeTaskType" class="el-menu-demo" mode="horizontal">
				<el-menu-item index="all">全部任务类型</el-menu-item>  
				<div style="line-height:50px;float:right;margin-right:10px;"> 
					<el-button type="danger"   @click="batchDel" v-loading="load.edit">批量删除</el-button>   
 					<el-button type="warning"   @click="saveBatchEdit" v-loading="load.edit">批量保存</el-button>
					<el-button type="success"  @click="handlePopover(null,'add')" >+任务</el-button>
					<el-button type="primary"   @click="noBatchEdit" v-loading="load.edit">返回</el-button>  
				</div>
			</el-menu>	
			<el-row  v-if="batchEditVisible==true">  
				<span style="margin-left:10px;font-size:14px;">阶段总预算：</span><el-tag type='success'> {{((projectPhase.phaseBudgetNouserAt+projectPhase.phaseBudgetInnerUserAt+projectPhase.phaseBudgetOutUserAt)/10000).toFixed(2)}}万，剩{{(taskBudgetData.surplusPhaseBudgetCostAt/10000).toFixed(2)}}万</el-tag> 
				<span style="margin-left:10px;font-size:14px;">非人力总预算：</span><el-tag :type="taskBudgetData.surplusPhaseBudgetNouserAt>0?'warning':'danger'">{{(projectPhase.phaseBudgetNouserAt/10000).toFixed(2)}}万，剩{{(taskBudgetData.surplusPhaseBudgetNouserAt/10000).toFixed(2)}}万</el-tag>  
				<span style="margin-left:10px;font-size:14px;">内部人力总预算：</span><el-tag :type="taskBudgetData.surplusPhaseBudgetInnerUserAt>0?'warning':'danger'">{{(projectPhase.phaseBudgetInnerUserAt/10000).toFixed(2)}}万，剩{{(taskBudgetData.surplusPhaseBudgetInnerUserAt/10000).toFixed(2)}}万</el-tag>  
				<span style="margin-left:10px;font-size:14px;">外购人力总预算：</span><el-tag :type="taskBudgetData.surplusPhaseBudgetOutUserAt>0?'warning':'danger'">{{(projectPhase.phaseBudgetOutUserAt/10000).toFixed(2)}}万，剩{{(taskBudgetData.surplusPhaseBudgetOutUserAt/10000).toFixed(2)}}万</el-tag>   
			</el-row>
			<el-row v-show="batchEditVisible==false">
				<el-col :span="4">
					<xm-project-phase-mng v-if="isTaskCenter!='1' && currentProject " :sel-project="currentProject" :simple="true" @row-click="projectPhaseRowClick" @clear-select="clearSelectPhase"></xm-project-phase-mng>
				</el-col>
				<el-col :span="isTaskCenter=='1' ?24:20">
					<el-table v-if="!gstcVisible"
						show-summary
						:data="tasksTreeData"
						@sort-change="sortChange"
						v-loading="load.list"
						@row-click="rowClick"
						@selection-change="selsChange" 
						highlight-current-row
						stripe
						fit
						default-expand-all
						:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						row-key="id"
						> 
 						<el-table-column sortable prop="name" label="任务名称(点击详情)"  min-width="240"> 
							<template slot-scope="scope">
 								<el-link    @click.stop="showDrawer(scope.row)"  type="primary">{{scope.row.sortLevel}}&nbsp;{{scope.row.name}}</el-link> 
								
							</template>
						</el-table-column> 
						<el-table-column v-if="!filters.selProject" prop="projectName" label="项目"  min-width="120"> 
							
							<template slot="header" slot-scope="scope">
								项目<el-button @click="showProjectList"  icon="el-icon-search" circle size="mini"></el-button>
							</template>
							<template slot-scope="scope">
 								<el-link      @click.stop="toMenu(scope.row)">{{scope.row.projectName}}</el-link> 
							</template>
						</el-table-column> 
						<el-table-column sortable prop="menuId" label="故事"  min-width="120"> 
							<template slot-scope="scope">
 								<el-link      @click.stop="toMenu(scope.row)">{{scope.row.menuName?scope.row.menuName:'去关联故事'}}</el-link> 
							</template>
						</el-table-column> 
						<el-table-column sortable label="预算" prop="budgetCost" width="120" >
							<template slot-scope="scope">
								<el-tag  type= 'info' >{{parseFloat(scope.row.budgetCost/10000).toFixed(2)}}万,{{scope.row.budgetWorkload}}人时</el-tag>
							</template>
						</el-table-column>
						<el-table-column sortable label="执行人" prop="exeUserids" min-width="120" show-overflow-tooltip>
							<template slot-scope="scope"> 
								<el-link         v-if="scope.row.exeUsernames!=null && scope.row.exeUsernames !='' "  @click.stop="showExecusers(scope.row)">{{scope.row.exeUsernames}}</el-link>   
								<el-link    type="warning"     v-if="scope.row.exeUsernames==null || scope.row.exeUsernames ==''" @click.stop="showExecusers(scope.row)"  >去抢任务</el-link>  
							</template>
						</el-table-column>
						<el-table-column sortable prop="rate" label="进度" width="100">
							<template slot-scope="scope">
								 <div>
								 <el-tag style="border-radius:30px;"> {{ (scope.row.rate!=null?scope.row.rate:0)+'%'}} </el-tag>  
								</div>
							</template>
						</el-table-column>
						<el-table-column sortable  prop="startTime" label="任务起止时间" width="300">
							<template slot-scope="scope">
								 
								<div  style="display:flex;align-items:center;">
									<div>
										<div>{{getDateString(scope.row.startTime)}}~{{getDateString(scope.row.endTime)}}</div> 
									</div>
									<div style="margin-left: 5px;color: #d92b2f !important;color:#bb6f2a;">
										{{calcTaskStateByTime(scope.row.startTime,scope.row.endTime)}}
									</div>
								</div>

							</template>
						</el-table-column>
						<!--
						<el-table-column label="外购" prop="taskOut" width="80">
							<template slot-scope="scope">
								<el-checkbox  :disabled="true" v-model="scope.row.taskOut" :false-label="0" :true-label="1"  ></el-checkbox> 
							</template>
						</el-table-column>   
						<el-table-column label="结算方案" prop="settleSchemel" width="120" :formatter="formatterOption"> 
						</el-table-column>  
						-->
						<el-table-column label="任务技能需求" prop="taskSkillNames" min-width="120" show-overflow-tooltip >
							<template slot-scope="scope"> 
								<el-link         v-if="scope.row.taskSkillNames!=null && scope.row.taskSkillNames !='' "  @click.stop="showSkill(scope.row)">{{scope.row.taskSkillNames}}</el-link>
								<el-link         v-else @click.stop="showSkill(scope.row)" type="success" >去补充</el-link> 
							</template>
						</el-table-column>
						<!--
						<el-table-column prop="description" label="任务描述" min-width="160" > 
						</el-table-column>
						-->
						<el-table-column  v-if=" isTaskCenter!='1'"   header-align="center" fixed="right"  label="操作"  width="100">
							<template slot-scope="scope">
								<!--
								<el-button-group>
									<el-button     @click.stop="showSubAdd(scope.row)" type="primary">+子任务</el-button>
									<el-button      @click.stop="showEdit(scope.row,scope.$index)" type="primary">编辑</el-button>  
									<el-button    v-if="isEmpty(scope.row.children) " type="primary" @click.stop="handleDel(scope.row,scope.$index)">删除</el-button>
								</el-button-group>
								-->
							<el-dropdown @command="handleCommand">
								<span class="el-dropdown-link"> 
									更多<i class="el-icon-setting"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item :command="{type:'showSubAdd',data:scope.row}">+子任务</el-dropdown-item>
									<el-dropdown-item :command="{type:'showTaskTemplate',data:scope.row}">+从模板批量导入子任务</el-dropdown-item> 
									<el-dropdown-item :command="{type:'showMenu',data:scope.row}">+由故事创建子任务</el-dropdown-item> 

									<el-dropdown-item :command="{type:'showDrawer',data:scope.row}">明细</el-dropdown-item>   
									<el-dropdown-item :command="{type:'showEdit',data:scope.row}">编辑</el-dropdown-item>  
									<el-dropdown-item :command="{type:'showExecusers',data:scope.row}" >执行人管理</el-dropdown-item> 
									<el-dropdown-item :command="{type:'showSkill',data:scope.row}">技能管理</el-dropdown-item> 
									<el-dropdown-item v-if="  isTaskCenter=='1' && selkey=='myFocus'"    :command="{type:'focusOrUnfocus',data:scope.row}">取关</el-dropdown-item>
									<el-dropdown-item v-if="  isTaskCenter=='1' && selkey!='myFocus'"    :command="{type:'focusOrUnfocus',data:scope.row}">关注</el-dropdown-item>  
									<el-dropdown-item :command="{type:'showDrawer',data:scope.row}">讨论</el-dropdown-item>  
									<el-dropdown-item :command="{type:'showDrawer',data:scope.row}">日志</el-dropdown-item>  
									<el-dropdown-item :command="{type:'handleDel',data:scope.row}" >删除</el-dropdown-item>  
								</el-dropdown-menu>
							</el-dropdown>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination v-if="!gstcVisible" layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
          <xm-gantt v-if="gstcVisible" :tree-data="tasksTreeData" :project-phase="{startTime: currentProjectPhase.beginDate, endTime: currentProjectPhase.endDate}" :useRealTime="true"></xm-gantt>
				</el-col>
			</el-row>
			<el-row v-show="batchEditVisible==true"> 
				<el-col :span="24">
						<!-- show-summary -->
					<el-table
          show-summary
            class="drag-table2"
						:data="tasksTreeData"
						@sort-change="sortChange"
						v-loading="load.list"
						@row-click="rowClick"
						@selection-change="selsChange" 
						highlight-current-row
						stripe
						fit
						default-expand-all
						:tree-props="{children: 'children', hasChildren: 'hasChildren'}"
						row-key="id"
						>
						<el-table-column sortable type="selection" width="45"></el-table-column> 
  						<el-table-column sortable prop="sortLevel"  label="序号" width="150">
 							<template slot-scope="scope">
								<div style="display:flex;width:100%;">
									<el-popover
										placement="top"
										width="400"
										trigger="click">
										<div style="text-align: center; margin: 0">
                      <div :ref="'task_'+scope.$index" :data-task-id="scope.row.id"></div>
										  <el-button type="primary" size="mini"   @click="handlePopover(scope.row,'highestPmenuId')">成为顶级节点</el-button> 
											<el-button type="danger" size="mini"   @click="handlePopover(scope.row,'delete')">删除当前行</el-button> 
											<el-button type="success" size="mini"   @click="handlePopover(scope.row,'addSub')">增加子行</el-button> 
										</div>
										<el-button slot="reference" :type="scope.row.opType?'success':'plain'"  size="mini" icon="el-icon-edit" circle></el-button> 
									</el-popover>
									<el-input   style="width:100%;"   v-model="scope.row.sortLevel"  @change="fieldChange(scope.row,'sortLevel')"></el-input>
								</div> 								
							</template>
						</el-table-column>
						<!-- <el-table-column sortable width="40" type="selection"></el-table-column> -->
						<el-table-column prop="name" label="任务名称"  min-width="150"> 
							<template slot-scope="scope">
								<el-input   v-model="scope.row.name"  @change="fieldChange(scope.row,'name')"></el-input>  								
							</template>
						</el-table-column> 
						<el-table-column   prop="startTime" label="任务起止时间" width="160">
							<template slot-scope="scope">
								<div>
									<el-date-picker  style="width:100%;"
										v-model="scope.row.startTime"
										align="right"
										type="date"
										value-format="yyyy-MM-dd HH:mm:ss"
										format="yyyy-MM-dd"
										placeholder="选择日期"
										:picker-options="pickerOptions" @change="fieldChange(scope.row,'startTime')">
									</el-date-picker>  
									<el-date-picker  style="width:100%;"
										v-model="scope.row.endTime"
										align="right"
										type="date"
										value-format="yyyy-MM-dd HH:mm:ss"
										format="yyyy-MM-dd"
										placeholder="选择日期"
										:picker-options="pickerOptions" @change="fieldChange(scope.row,'endTime')">
									</el-date-picker>  
								</div> 

							</template>
						</el-table-column> 
						<el-table-column label="预计工作量" prop="budgetWorkload" width="140" >
							<template slot-scope="scope">
								<el-input   v-model="scope.row.budgetWorkload" type="number" ::precision="2"  @change="fieldChange(scope.row,'budgetWorkload')"></el-input>
 							</template>
						</el-table-column>
						<el-table-column label="预算金额.元" prop="budgetCost" width="140" >
							<template slot-scope="scope">
								<el-input   v-model="scope.row.budgetCost" type="number" ::precision="2"  @change="fieldChange(scope.row,'budgetCost')"></el-input>
 							</template>
						</el-table-column> 
						<el-table-column prop="rate" label="进度" width="100">
							<template slot-scope="scope">
								<el-input   type="number" :precision="0" v-model="scope.row.rate" min="0" max="100" @change="fieldChange(scope.row,'rate')"></el-input>
 
							</template>
						</el-table-column>
						<el-table-column label="外购" prop="taskOut" width="80">
							<template slot-scope="scope">
								<el-checkbox    v-model="scope.row.taskOut" false-label="0" true-label="1"  @change="fieldChange(scope.row,'taskOut')"></el-checkbox> 
							</template>
						</el-table-column>   
						<el-table-column label="结算方案" prop="settleSchemel" width="160">
							<template slot-scope="scope"> 
								<el-select v-model=" scope.row.settleSchemel" @change="fieldChange(scope.row,'settleSchemel')">
									<el-option v-for="i in options.xmTaskSettleSchemel" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
								</el-select>
							</template>
						</el-table-column>  
						<el-table-column prop="description" label="任务描述" min-width="150"> 
							<template slot-scope="scope">
								<el-input   type="textarea"   v-model="scope.row.description"  @change="fieldChange(scope.row,'description')"></el-input>
 
							</template>
						</el-table-column> 
					</el-table> 
					<el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
					
				</el-col>
			</el-row>
		</el-row>
		
		<el-dialog
			v-if="drawerVisible == true"
			width="70%"
			:visible.sync="drawerVisible"  append-to-body >
			<!-- <template slot="title">
				<div style="display:flex;">
					<div style="border-radius:30px;">任务状态</div>
				</div>
				<span>任务名称：{{editForm.name}}</span>
				<el-button v-if="progress_show"  @click="progress_show = !progress_show" type="text">查看任务明细</el-button>
				<el-button v-if="!progress_show"  @click="progress_show = !progress_show" type="text">查看进度</el-button>
			</template> -->
			<div style="font-size: 12px;overflow-x:hidden">
				<div class="task-header extra">
					<div class="title">
						{{editForm.name}} <el-tag style="border-radius:30px;">{{taskStateList[parseInt(editForm.taskState)] }}</el-tag> 
								<el-link v-if="  isTaskCenter=='1' && selkey=='myFocus'"  type="warning"  @click.stop="focusOrUnfocus(editForm)">去取关</el-link>
								<el-link v-if="  isTaskCenter=='1' && selkey!='myFocus'"  type="success"  @click.stop="focusOrUnfocus(editForm)">去关注</el-link>  
					</div>
					<div class="compact">
						<el-tag v-if="editForm.level!='' && editForm.level!=null"   style="border-radius:30px;">{{formateOption('urgencyLevel',editForm.level)}}</el-tag>
						[{{formateOption('taskType',editForm.taskType)}}] 
						<span> {{editForm.projectName}} </span>
							- 
							<span> {{editForm.createUsername}} </span>
							创建于 {{editForm.createTime}}
					</div>
					<div class="remarks">
						{{editForm.remarks}}
					</div>
				</div>
				
				<div class="exector extra">
					<div class="field-label">用户故事</div><el-tag  v-if="editForm.menuName" style="margin-left:10px;border-radius:30px;"  >{{editForm.menuName}}</el-tag>
				</div>
				<div class="progress extra" style="display:flex; flex-direction:row;">
					<div class="field-label">任务进度</div>
						<el-input v-model="editForm.rate" style="width:100px;" type="number" step="10" min="0" max="100"> </el-input>
						<el-button      style="font-size:12px;" @click="editProgress(editForm.rate)">更新进度</el-button>
						<el-button      style="font-size:12px;" @click="editProgress(20)">完成20%</el-button>
						<el-button      style="font-size:12px;" @click="editProgress(40)">完成40%</el-button>
						<el-button      style="font-size:12px;" @click="editProgress(60)">完成60%</el-button>
						<el-button      style="font-size:12px;" @click="editProgress(80)">完成80%</el-button>
						<el-button      style="font-size:12px;" @click="editProgress(99)">完成99%</el-button> 
						<el-button      style="font-size:12px;" @click="editProgress(100)">完成100%</el-button> 
					
				</div>
				<div class="exector extra">
					<div class="field-label">任务负责人</div>
					<el-tag  v-if="editForm.executorUserid" style="margin-left:10px;border-radius:30px;"  >{{editForm.executorUsername}}</el-tag>
					<el-tag  v-else style="margin-left:10px;border-radius:30px;"  >未设置</el-tag> 
					<el-button  @click="showExecusers(editForm)">设置负责人</el-button> 				</div>
				<div class="exector extra">
					<div class="field-label">任务执行人</div><el-tag   style="margin-left:10px;border-radius:30px;"  >{{editForm.exeUsernames}}</el-tag>
					<el-button  @click="showExecusers(editForm)">查看队员情况</el-button>

					<el-button type="primary" @click="toJoin">我要加入</el-button>
				</div>
				<div class="skill extra">
					<div class="field-label">技能要求</div><el-tag   style="margin-left:10px;border-radius:30px;">{{editForm.taskSkillNames?editForm.taskSkillNames:'无'}}</el-tag>
				</div>
				<div class="extra">
					<div class="field-label">任务周期</div>{{getDateString(editForm.startTime)+' ~ '+ getDateString(editForm.endTime)}} 共{{taskTime}}天
				</div> 
				<div v-if="editForm.children" class="extra">
					<div class="field-label">子任务</div><el-tag   style="margin-left:10px;border-radius:30px;" v-for="(item,i) in editForm.children" :key="i">{{item.sortLevel}}{{item.name}}</el-tag>
				</div>
				<div v-else class="extra">
					<div class="field-label">子任务</div>无子任务
				</div>
				<div class="extra">
					<div class="field-label">前置任务</div>{{(editForm.preTaskid==''||editForm.preTaskid == null)?'无前置任务':editForm.preTaskname}}
				</div>
				<div class="extra">
					<div class="field-label">里程碑</div>{{editForm.milestone == '0'? '否':'是'}}
				</div>
				<div class="extra">
					<div class="field-label">预算金额</div>{{editForm.budgetCost}} 元
				</div>
				<div class="extra">
					<div class="field-label">预算工作量</div>{{editForm.budgetWorkload}} 人时
				</div>
				
				<div class="extra">
					<div class="field-label">任务描述</div>{{editForm.description}}
				</div>
				<div class="extra">
					<div class="field-label"></div>
				</div>


				<el-menu :default-active="drawerkey" class="el-menu-demo" mode="horizontal" @select="handleSelect">
					<el-menu-item index="1">讨论 <el-tag   style="border-radius:30px;">10</el-tag></el-menu-item>
					<el-menu-item index="2">操作日志 <el-tag   style="border-radius:30px;">10</el-tag></el-menu-item>
				</el-menu>
			</div>

			<div v-if="drawerkey == '1' && drawerVisible==true" style="overflow-x:hidden">
				 <xm-exchange-mng :xm-task="editForm"></xm-exchange-mng>
			</div>		 
		</el-dialog> 
		<!--编辑 XmTask xm_task界面-->
		<el-dialog title="编辑任务" :visible.sync="editFormVisible" style="margin-top:3vh;" width="80%" append-to-body  :close-on-click-modal="false">
				<xm-task-edit :xm-project="currentProject" :xm-task="editForm" :project-phase="currentProjectPhase" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-task-edit>
		</el-dialog>

		<!-- 新增 XmTask xm_task界面-->
		<el-dialog class="xm-task-add" title="新增任务" :visible.sync="addFormVisible"  width="80%" append-to-body  :close-on-click-modal="false">
			<xm-task-add :xm-project="currentProject" :project-phase="currentProjectPhase"   :xm-task="addForm" :parent-task="parentTask" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-task-add>
		</el-dialog>

		<el-dialog :title="'任务：'+currTaskName+'——执行人'" :visible.sync="execUserVisible" fullscreen width="80%" append-to-body  :close-on-click-modal="false">
			<xm-execuser-mng :visible="execUserVisible" :xm-task="editForm"  :is-my="isMy"  @after-add-submit="afterExecuserSubmit" @after-edit-submit="afterExecuserSubmit" @after-delete-submit="afterExecuserSubmit" ref="execuserMng"></xm-execuser-mng>
		</el-dialog>

		<!-- <el-dialog :title="'技能要求——'+currTaskName" :visible.sync="skillVisible"  width="80%" append-to-body  :close-on-click-modal="false">
			<xm-skill-mng :visible="skillVisible" :task-id="currTaskId" :task-name="currTaskName"></xm-skill-mng>
		</el-dialog> -->

		<el-dialog  :title="'任务：'+currTaskName+'——技能要求'" :visible.sync="skillVisible" width="50%" append-to-body  :close-on-click-modal="false">
			<skill-mng :task-skills="taskSkills" :jump="true" @select-confirm="onTaskSkillsSelected"></skill-mng>
		</el-dialog>
		
		<el-dialog  title="任务模板" :visible.sync="taskTemplateVisible" width="80%" append-to-body  :close-on-click-modal="false">
			<xm-task-template-mng :is-select="true" @select-confirm="onTaskTemplatesSelected"></xm-task-template-mng>
		</el-dialog>
		
		<el-dialog   :title="currentProject==null?'项目明细':currentProject.name" center :fullscreen="true" :visible.sync="projectInfoVisible"  width="50%"  :close-on-click-modal="false" append-to-body>
			<xm-project-info :sel-project="currentProject" @changeShowInfo="changeShowInfo" @submit="changeShowInfo"></xm-project-info>
		</el-dialog>
		
		<el-dialog title="选中项目" :visible.sync="selectProjectVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
			<xm-project-list    @project-confirm="onPorjectConfirm"></xm-project-list>
		</el-dialog> 
		
		<el-dialog append-to-body title="故事选择" :visible.sync="menuVisible" width="80%"    :close-on-click-modal="false">
			<xm-menu-select :visible="menuVisible" :is-select-menu="true" :multi="true"    @menus-selected="onSelectedMenus" ></xm-menu-select>
		</el-dialog>
		
		<el-dialog append-to-body title="故事明细" :visible.sync="menuDetailVisible" width="80%"    :close-on-click-modal="false">
			<xm-menu-rich-detail :visible="menuDetailVisible"  :reload="true" :xm-menu="{menuId:editForm.menuId,menuName:editForm.menuName}" ></xm-menu-rich-detail>
		</el-dialog>
	</section>
</template>

<script>
	import Vue from 'vue'
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { getTask ,listXmTask,editXmTask,editRate, delXmTask, batchDelXmTask,batchImportTaskFromTemplate,batchSaveBudget } from '@/api/xm/core/xmTask'; 
	import  XmTaskAdd from './XmTaskAdd';//新增界面
	import  XmTaskEdit from './XmTaskEdit';//修改界面
	import { mapGetters } from 'vuex';
	import headEditor from '../components/headEditor';
	import xmExecuserMng from '../xmTaskExecuser/XmTaskExecuserMng';
	import xmSkillMng from '../xmTaskSkill/XmTaskSkillMng';
	import skillMng from "@/views/xm/core/skill/skillMng";
	import {batchAddSkill } from '@/api/xm/core/xmTaskSkill';
	import xmProjectPhaseMng from '../xmProjectPhase/XmProjectPhaseMng';
	import {sn} from '@/common/js/sequence' 
	import xmTaskTemplateMng from '../xmTaskTemplate/XmTaskTemplateMng'; 
	import xmExchangeMng from '../xmExchange/XmExchangeMng'; 
	import xmMenuSelect from '../xmMenu/XmMenuSelect';

	import { addXmMyFocus , delXmMyFocus } from '@/api/xm/core/xmMyFocus';
	
	import XmProjectList from '../xmProject/XmProjectList';

	import XmMenuRichDetail from '../xmMenu/XmMenuRichDetail';

  import XmGantt from '../components/xm-gantt';

	export default { 
		computed: {
			...mapGetters([
				'userInfo'
			]),
			currentProject(){
				if(this.filters.selProject){
					return this.filters.selProject;
				}else{
					var currentProject={};
					if(this.editForm && this.editForm.id){
						currentProject.id=this.editForm.projectId
						currentProject.taskType=this.editForm.taskType
						currentProject.name=this.editForm.projectName
						return currentProject
					}else{
						return null;
					} 
				}
			},
			currentProjectPhase(){
				if(this.projectPhase!=null && this.projectPhase!=undefined){
					return this.projectPhase;
				}else{
					var projectPhase={};
					if(this.editForm && this.editForm.id!==null && this.editForm.id!=null){
						projectPhase.id=this.editForm.projectPhaseId
						projectPhase.phaseName=this.editForm.projectPhaseName
						projectPhase.taskType=this.editForm.taskType
						projectPhase.projectId=this.editForm.projectId
						projectPhase.projectName=this.editForm.projectName
						return projectPhase
					}else{
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
				if((this.isEmpty(this.editForm.preTaskid) || this.editForm.prerate == "100") && this.isEmpty(this.editForm.children)) {
					return false;
				}
				else {
					return true;
				}
			},
			taskTime() {
				const s = new Date(this.editForm.startTime);
				const sy = s.getFullYear();
				const sm = s.getMonth();
				const sd = s.getDate();
				const e = new Date(this.editForm.endTime);
				const ey = e.getFullYear();
				const em = e.getMonth();
				const ed = e.getDate();
				let len = (new Date(ey,em,ed) - new Date(sy,sm,sd))/(24*3600*1000) + 1;
				return len;
			},
			tasksTreeData() {
        let xmTasks = JSON.parse(JSON.stringify(this.xmTasks || []));
        if (this.valueChangeRows && this.valueChangeRows.length) {
          this.valueChangeRows.forEach(c => {
            var index = xmTasks.findIndex(i=>i.id==c.id);
            const oldRow = JSON.parse(JSON.stringify(xmTasks[index]));
            xmTasks.splice(index,1);
            c.parentTaskid = oldRow.parentTaskid;
            xmTasks.push(c);
          })
        }
        
        const tasksTreeData = this.translateDataToTree(xmTasks);
        if (this.batchEditVisible) {
          this.rowDrop();
        }
        
				 return tasksTreeData;
			},
			
			taskBudgetData(){ 
				var rows=this.xmTasks
				var surplusPhaseBudgetCostAt = this.getFloatValue(this.projectPhase.phaseBudgetInnerUserAt)+ this.getFloatValue(this.projectPhase.phaseBudgetOutUserAt)+ this.getFloatValue(this.projectPhase.phaseBudgetNouserAt)
				var surplusPhaseBudgetInnerUserAt=this.getFloatValue(this.projectPhase.phaseBudgetInnerUserAt)
				var surplusPhaseBudgetOutUserAt=this.getFloatValue(this.projectPhase.phaseBudgetOutUserAt)
				var surplusPhaseBudgetNouserAt=this.getFloatValue(this.projectPhase.phaseBudgetNouserAt) 
				var surplusPhaseBudgetUserAt=this.getFloatValue(this.projectPhase.phaseBudgetInnerUserAt)+this.getFloatValue(this.projectPhase.phaseBudgetOutUserAt)

				var total={
					surplusPhaseBudgetCostAt: surplusPhaseBudgetCostAt, 
					surplusPhaseBudgetInnerUserAt: surplusPhaseBudgetInnerUserAt,
					surplusPhaseBudgetOutUserAt: surplusPhaseBudgetOutUserAt,
					surplusPhaseBudgetNouserAt: surplusPhaseBudgetNouserAt,
					surplusPhaseBudgetUserAt: surplusPhaseBudgetUserAt,

					taskBudgetNouserAt:0,
					taskBudgetInnerUserAt:0,
					taskBudgetOutUserAt:0,
					taskBudgetUserAt: 0,


				}; 
				//phaseBudgetHours:'',phaseBudgetStaffNu:'',ctime:'',phaseBudgetNouserAt:'',phaseBudgetInnerUserAt:'',phaseBudgetOutUserAt
				rows.forEach((row2)=>{
					var row=row2;
					if(this.valueChangeRows.length!=0){
						var changeRows=this.valueChangeRows.filter(i=>i.id==row2.id);
						if(changeRows && changeRows.length>0){
							row=changeRows[0]
						}
					}

					var budgetCost=this.getFloatValue(row.budgetCost);
					if(row.taskOut=='1'){
						row.taskBudgetOutUserAt=budgetCost
						row.taskBudgetInnerUserAt=0
						row.taskBudgetNouserAt=0;
					}else{
						row.taskBudgetOutUserAt=0
						row.taskBudgetInnerUserAt=budgetCost
						row.taskBudgetNouserAt=0;
					}  
					total.taskBudgetNouserAt=total.taskBudgetNouserAt+row.taskBudgetNouserAt
					total.taskBudgetInnerUserAt=total.taskBudgetInnerUserAt+ row.taskBudgetInnerUserAt
					total.taskBudgetOutUserAt=total.taskBudgetOutUserAt+ row.taskBudgetOutUserAt
				})
				total.taskBudgetUserAt=total.taskBudgetInnerUserAt+total.taskBudgetOutUserAt  
				total.surplusPhaseBudgetCostAt=total.surplusPhaseBudgetCostAt-total.taskBudgetNouserAt-total.taskBudgetUserAt 
				total.surplusPhaseBudgetInnerUserAt=total.surplusPhaseBudgetInnerUserAt-total.taskBudgetInnerUserAt
				total.surplusPhaseBudgetOutUserAt=total.surplusPhaseBudgetOutUserAt-total.taskBudgetOutUserAt
				total.surplusPhaseBudgetNouserAt=total.surplusPhaseBudgetNouserAt-total.taskBudgetNouserAt 
				total.surplusPhaseBudgetUserAt=total.surplusPhaseBudgetUserAt-total.taskBudgetUserAt
				return total;

			}
		},
		props: ["selProject","isTaskCenter","isMy",'menuId','menuName'],
		watch: { 
			"selProject": function(oval,val) { 
				this.filters.selProject=this.selProject;
				 this.changeSelKey("all");
			}, 
			'menuId':function(menuId){
				this.getXmTasks()
			},
			drawerVisible:function(drawerVisible){
				if(drawerVisible==false){
					this.drawerkey=""
				}
			}
		},
		data() {
			return {
				filters: {
					key: '',
					isMyTask: '0',//0不区分我的，1 时我的任务
					selProject:null,
				},
				xmTasks: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{
					urgencyLevel:[],
					taskType:[],
					planType:[],
					priority:[],
					xmTaskSettleSchemel:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmTask界面是否显示
				//新增xmTask界面初始化数据
				addForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',executorUserid:'',executorUsername:'',
					preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',
					rate:'',budgetCost:'',budgetWorkload:'',actCost:'',actWorkload:'',taskState:'',taskType:'',taskClass:'',toTaskCenter:'',actStartTime:'',actEndTime:'',
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmTask界面初始化数据
				editForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',executorUserid:'',executorUsername:'',
					preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',
					rate:'',budgetCost:'',budgetWorkload:'',actCost:'',actWorkload:'',taskState:'',taskType:'',taskClass:'',toTaskCenter:'',actStartTime:'',actEndTime:'',
				},
				searchTask: '',
				/**begin 自定义属性请在下面加 请加备注**/
				taskStateList: ["待领取","已领取执行中","已完工","已结算"],   

				selkey: "all",
				drawerVisible: false, 
				progress_show: true,
				isChild: false,
				oldrate: "",
				drawerkey: '',

				execUserVisible: false,
				currTaskId: '',
				currTaskName: '',

				skillVisible: false,
				skillIds: [],
				taskSkills:[],
				projectPhase: null,
				taskTemplateVisible:false,
				parentTask:null,
				projectInfoVisible:false,
				batchEditVisible:false,
				valueChangeRows:[],//批量修改时，存储修改过的行
				selectProjectVisible:false,
				menuVisible:false,
				menuDetailVisible:false,
				pickerOptions:  util.pickerOptions(),
				gstcVisible:false,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			 
			changeSelKey(index){
				this.selkey = index;
				this.getXmTasks();
			},
			changeTaskType(index){
				this.filters.taskType = index;
				this.getXmTasks();
			},
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmTasks();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmTasks();
			},
			showProjectInfo(row){
				this.editForm=row
				this.projectInfoVisible=true;
			},
			changeShowInfo(){
				this.projectInfoVisible=false;
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				if(obj.order==null){
					this.pageInfo.orderFields=['create_time'];
					this.pageInfo.orderDirs=['desc'];
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
				

				this.getXmTasks();
			},
			searchXmTasks(){
				 this.pageInfo.count=true; 
				 this.getXmTasks();
			},
			//获取列表 XmTask xm_task
			getXmTasks() {
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
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				} 
				if(this.filters.taskType!="all" && this.filters.taskType!="" && this.filters.taskType!=null){
					params.taskType=this.filters.taskType
				}
				if(this.selkey == "work"){
					params.work = "work";
				}
				else if(this.selkey == "finish"){
					params.rate = 100;
				} else if(this.selkey=="myFocus"){
					params.myFocus="1"
					params.userid=this.userInfo.userid
				}else if(this.selkey.indexOf("myExecuserStatus")>=0){
					params.userid=this.userInfo.userid
					params.myExecuserStatus=this.selkey.substring("myExecuserStatus".length)
				} 
				this.load.list = true;
				if(this.filters.selProject){
					params.projectId = this.filters.selProject.id;
				} 
				params.workexec="true";
				if(this.projectPhase){{
					params.projectPhaseId=this.projectPhase.id
				}}
				if(this.isMy=='1'){
					params.userid=this.userInfo.userid
					params.isMy="1"
				}
				if(this.menuId){
					params.menuId=this.menuId
				}
				getTask(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						var xmTasks=res.data.data;
						this.xmTasks=xmTasks;  
						if(this.editForm!=null){
							var index=this.xmTasks.findIndex(i=>i.id==this.editForm.id);
							if(index>=0){
								this.editForm=this.xmTasks[index]
							}
						}
						
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
			calcTaskStateByTime(startTime,endTime){
				if(startTime==null || startTime=="" || endTime==null || endTime ==""){
					return "未配置日期"
				}
				var curDate=new Date();
				var start=new Date(startTime);
				var end=new Date(endTime);
				if(this.getDaysBetween(curDate, start)<=0){
					return this.toFixed(this.getDaysBetween(start,curDate))+"天后开始";
				}else if( this.getDaysBetween(curDate, start) > 0 &&  this.getDaysBetween(curDate, end) <= 0 ){
					return this.toFixed(this.getDaysBetween(end, curDate))+"天后结束";
				}else if( this.getDaysBetween(curDate, end) > 0 ){
					return "逾期"+( this.toFixed(this.getDaysBetween(curDate, end)) )+"天";
				}
			},
			/**
			 * 计算两个日期之间的天数
			 * @param dateString1  开始日期 yyyy-MM-dd
			 * @param dateString2  结束日期 yyyy-MM-dd 
			 */
			  getDaysBetween(startDate,endDate){  
				if (startDate==endDate){
					return 0;
				}
				var days=(startDate - endDate )/(1*24*60*60*1000);
				return  days;
			},

			editProgress(rate) {
				if(this.userInfo.userid!=this.editForm.executorUserid){
					this.$message({ message: "你不是该任务的主负责人，不能更新进度", type: 'error' }); 
					return;
				}
				if(rate){
					this.editForm.rate=rate
				}
				let params = {
					id: this.editForm.id,
					rate: this.editForm.rate,
					parentTaskid: this.editForm.parentTaskid,
				}
				if(this.editForm.rate==0){
						this.$message({ message: "不允许更新为0", type: 'error' }); 
						return;
				}
				this.load.edit = true;
				editRate(params).then((res) => {
					var tips=res.data.tips;
					this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
					this.getXmTasks();
					this.load.edit = false;
				}).catch( err =>{
					this.load.edit = false;
					this.editForm.rate = this.oldrate;
					this.drawerVisible = false;
				});
			},
			//显示编辑界面 XmTask xm_task
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
				console.log("editForm",this.editForm);
			},
			showTaskTemplate:function(){
				
				if( !this.userInfo.isProjectAdmin && !this.userInfo.isTeamAdmin){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return;
				}
				if(this.currentProjectPhase==null){
					this.$message({ message: "请先选择项目阶段计划", type: 'error' }); 
					return false;
				}
				this.taskTemplateVisible=true;
			},
			showSubAdd(row) { 
				
				if( !this.userInfo.isProjectAdmin && !this.userInfo.isTeamAdmin){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return;
				}
				this.parentTask=row; 
				this.editForm=row;
				this.showAdd();
			},
			//显示新增界面 XmTask xm_task
			showAdd: function () {
				
				if( !this.userInfo.isProjectAdmin && !this.userInfo.isTeamAdmin){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return;
				}
				if(!this.currentProjectPhase){
					this.$message({ message: "请先选择项目阶段计划", type: 'error' }); 
					return;
				}
				this.addFormVisible = true;
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmTasks();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getXmTasks();
			},
			//选择行xmTask
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmTask
			handleDel: function (row,index) { 
				
				if( !this.userInfo.isProjectAdmin && !this.userInfo.isTeamAdmin){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return;
				}
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = Object.assign({},row);
					delXmTask(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmTasks();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmTask
			batchDel: function () {
				
				if( !this.userInfo.isProjectAdmin && !this.userInfo.isTeamAdmin){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return;
				}
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmTask(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmTasks(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row){
				this.editForm=row;
				// this.$emit('row-click',row,);//  @row-click="rowClick"
			},
			
			showDrawer: function(row){
				this.editForm=row;
				this.drawerVisible = !this.drawerVisible;
				// this.$emit('row-click',row,);//  @row-click="rowClick"
			},
			 
			isEmpty(str) {
				return str == null || "" == str;
			},

			showExecusers(row) {
				this.editForm=row;
				this.execUserVisible = true;
			},

			showSkill(row){ 
				this.editForm=row;
				this.skillVisible = true;
			},
			showMenu:function(parentTask){
				
				if( !this.userInfo.isProjectAdmin && !this.userInfo.isTeamAdmin){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return;
				}
				this.parentTask=parentTask; 
				this.menuVisible=true;

			}, 
			onSelectedMenus(menus){
				if(menus==null || menus.length==0){
					this.menuVisible=false;
					return;
				}
				var menus2=JSON.parse(JSON.stringify(menus))
				menus2.forEach(i=>{
					i.id=i.menuId
					i.parentTaskid=i.pmenuId
					i.name=i.menuName 
				})
				this.onTaskTemplatesSelected(menus2);
				this.menuVisible=false;
				 
			},
			onTaskTemplatesSelected(taskTemplates) {
				   
				 ///////////////////
				if(taskTemplates==null || taskTemplates.length==0){
					this.taskTemplateVisible=false;
					this.parentTask=null
					return;
				}
				var taskTemplates2=JSON.parse(JSON.stringify(taskTemplates))
				this.load.add=true
				let parents = taskTemplates2.filter(value =>{
					//如果我的上级为空，则我是最上级
					if(value.parentTaskid == 'undefined' || value.parentTaskid == null  || value.parentTaskid == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(taskTemplates2.some(i=>value.parentTaskid==i.id)){
						return false;
					}else {
						return true
					}
				 
				})
				if(this.parentTask!=null &&  this.parentTask!=undefined){
					parents.forEach(i=>i.parentTaskid=this.parentTask.id);
				}else{
					parents.forEach(i=>i.parentTaskid=null);
				}
				let children = taskTemplates2.filter(value =>{
					if(taskTemplates2.some(i=>value.parentTaskid==i.id)){
						return true;
					}else{
						return false;
					} 
				}) 
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						var newId=sn();
						var myChildren=[];
						if(children!=null && children.length>0){
							myChildren=children.filter(current=>current.parentTaskid===parent.id);
						}  
						myChildren.forEach((current, index) => {
							 current.parentTaskid=newId;
							 var mySubChildren=children.filter(c=>c.parentTaskid===current.id);
							 translator([current],mySubChildren)
						})
						parent.id=newId;
					})
				}

				translator(parents, children)
				taskTemplates2.forEach(i=>{
					i.branchId=this.selProject.branchId
					i.projectId=this.selProject.id
					i.projectName=this.selProject.name
					if(this.projectPhase==null){

						i.projectPhaseId=this.parentTask.projectPhaseId
						i.projectPhaseName=this.parentTask.projectPhaseName 
						i.sortLevel=i.sortLevel?i.sortLevel:this.parentTask.sortLevel
						i.taskType=i.taskType?i.taskType:this.parentTask.taskType
						i.taskClass=i.taskClass?i.taskClass:this.parentTask.taskClass

						
					}else{
						i.projectPhaseId=this.projectPhase.id
						i.projectPhaseName=this.projectPhase.phaseName 
						i.sortLevel=i.sortLevel?i.sortLevel:this.projectPhase.seqNo
						i.taskType=i.taskType?i.taskType:this.projectPhase.taskType
					} 
					i.budgetCost=0
					i.budgetWorkload=80;
					i.level=i.level?i.level:'3'
					i.planType=i.planType?i.planType:"w2"
					i.actCost=0
					i.actWorkload=0
					i.taskState='0'
					i.rate=0
					i.taskOut=i.taskOut?i.taskOut:"0"
					i.taskClass=i.taskClass?i.taskClass:"1"
					i.toTaskCenter=i.toTaskCenter?i.toTaskCenter:"1"
					i.settleSchemel=i.settleSchemel?i.settleSchemel:"quotePrice"
					i.createUserid=this.userInfo.userid
					i.createUsername=this.userInfo.username 
					const createTime = new Date();
					var startTime=new Date();
					const endTime=new Date();
					endTime.setTime(startTime.getTime() + 3600 * 1000 * 24 * 7 *2);//两周后
					i.createTime=util.formatDate.format(createTime,'yyyy-MM-dd HH:mm:ss')
					i.startTime=util.formatDate.format(startTime,'yyyy-MM-dd HH:mm:ss')
					i.endTime=util.formatDate.format(endTime,'yyyy-MM-dd HH:mm:ss')

				});
				 //////////////////
				 batchImportTaskFromTemplate(taskTemplates2).then(res=>{
					 var tips=res.data.tips;
					 if(tips.isOk){
						 this.getXmTasks();

					 }
					 this.taskTemplateVisible=false;
					 this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
				 }).catch(e=>{this.taskTemplateVisible=false;});
			},
			onTaskSkillsSelected(skills) {
				skills.forEach(i=>{
					i.taskId=this.editForm.id
					i.taskName=this.editForm.name 
					i.taskSkillId=i.skillId
					i.taskSkillName=i.skillName
					i.skillRemarks=i.skillRemarks
				})
				batchAddSkill(skills).then((res) => {
					this.load.add=false
					var tips=res.data.tips;
					if(tips.isOk){
						this.skillVisible = false;
						this.getXmTasks();
					}
					this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch( err  => this.load.add=false);
			},

			handleSelect(key, keyPath) {
				this.drawerkey = key;
			},
			translateDataToTree(data2) { 
				var data=JSON.parse(JSON.stringify(data2));

				let parents = data.filter(value =>{
					value.startDate=value.startTime?value.startTime.substr(0,10):null
					value.endDate=value.endTime?value.endTime.substr(0,10):null
					value.realStartDate=value.actStartTime?value.actStartTime.substr(0,10):null
					value.realEndDate=value.actEndTime?value.actEndTime.substr(0,10):null
					value.taskBudgetCostAt=this.getRowSum(value);
					//如果我的上级为空，则我是最上级
					if(value.parentTaskid == 'undefined' || value.parentTaskid == null  || value.parentTaskid == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.parentTaskid==i.id)){
						return false;
					}else {
						return true
					}
				 
				}) 
				let children = data.filter(value =>{
					if(data.some(i=>value.parentTaskid==i.id)){
						return true;
					}else{
						return false;
					} 
				})  
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.parentTaskid === parent.id) {
								let temp = JSON.parse(JSON.stringify(children))
								temp.splice(index, 1)
								translator([current], temp)
								typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
							}
						}
						)
					}
					)
				}

				translator(parents, children)

				return parents
			},
			projectPhaseRowClick:function(projectPhase){
				this.projectPhase=projectPhase
				this.getXmTasks();
			},
			clearSelectPhase:function(){
				this.projectPhase=null;
				this.getXmTasks();
			},
			getDateString(dateStr){
				if(dateStr==null || dateStr=="" || dateStr==undefined){
					return ""
				}else{
					return dateStr.substr(0,10);
				}
			},
			formateOption:function(itemCode,value){
				if(this.options[itemCode]){
					var options=this.options[itemCode].filter(i=>i.optionValue==value);
					if(options && options.length > 0){
						return options[0].optionName
					}else{
						return value;
					}
				}else{
					return value
				} 
			},
			
			formatterOption: function(row,column,cellValue, index){ 
				var columnName=column.property;
				var key="";
				if(columnName=='settleSchemel'){
					key="xmTaskSettleSchemel"
				}else{
					return cellValue
				}
				if(this.options[key]==undefined || this.options[key]==null || this.options[key].length==0   ){
					return cellValue;
				}
				var list=this.options[key].filter(i=>i.optionValue==cellValue)
				if(list.length>0){
					return list[0].optionName
				}else{
					return cellValue;
				}

			},
			toFixed(floatValue,xsd){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					if(xsd){
						return parseFloat(floatValue).toFixed(xsd);
					}else{
						return parseFloat(floatValue).toFixed(0);
					}
					
				}
			},
			decrease:function(){
				if(parseFloat(this.editForm.rate)-20 <0){
					this.editForm.rate=0;
				}else{
					this.editForm.rate=parseFloat(this.editForm.rate)-20
				}
				
			},
			increase:function(){
				if(parseFloat(this.editForm.rate)+20 >100){
					this.editForm.rate=100;
				}else{
					this.editForm.rate=parseFloat(this.editForm.rate)+20
				} 
			},
			
			focusOrUnfocus:function(row){
				if(this.selkey=="myFocus"){
					delXmMyFocus({projectId:row.projectId,focusType:'task',taskId:row.id,taskName:row.name,userid:this.userInfo.userid,username:this.userInfo.username}).then(res=>{
						var tips=res.data.tips;
						if(tips.isOk){
							this.getXmTasks(); 
						} 
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					})
				}else{
					addXmMyFocus({projectId:row.projectId,projectName:row.projectName,focusType:'task',taskId:row.id,taskName:row.name,userid:this.userInfo.userid,username:this.userInfo.username}).then(res=>{
						var tips=res.data.tips;
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					})
				}
			},
			showBatchEdit:function(){
				
				if( !this.userInfo.isProjectAdmin && !this.userInfo.isTeamAdmin){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return; 
				}
				if(this.projectPhase==null ){
					this.$message({ message:"请选择阶段计划再编辑", type: 'error'});
					return ;
				}
				this.batchEditVisible=true
			},
			saveBatchEdit:function(){
				if( !this.userInfo.isProjectAdmin && !this.userInfo.isTeamAdmin){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return;
				}
				console.log(JSON.stringify(this.taskBudgetData))
				if(this.valueChangeRows.length==0){
					this.$message({ message:"没有改变任何数据，无需保存", type: 'success'});
					return;
				}else {
					if(this.taskBudgetData.surplusPhaseBudgetInnerUserAt<0){
						this.$message({ message:"内部人力预算不足，请调整", type: 'error'});
						return;
					}
					if(this.taskBudgetData.surplusPhaseBudgetOutUserAt<0){
						this.$message({ message:"外购人力预算不足，请调整", type: 'error'});
						return;
					}
					if(this.taskBudgetData.surplusPhaseBudgetNouserAt<0){
						this.$message({ message:"非人力预算不足请调整",type: 'error'});
						return;
					}
					
					this.load.edit=true;
					batchSaveBudget(this.valueChangeRows).then(res=>{ 
						this.load.edit=false;
						var tips =res.data.tips;
						if(tips.isOk){
							this.valueChangeRows=[]
							this.getXmTasks();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'}); 
						
					}).catch(e=>this.load.edit=false);
				}
				
			},
			noBatchEdit(){
				this.batchEditVisible=false;
				if(this.valueChangeRows.length>0){
					this.valueChangeRows=[];
					this.getXmTasks()
				}
				
			},
			fieldChange:function(row,fieldName, nextReplace){
        if(nextReplace) {
          row.nextReplace = nextReplace;
        }
        console.log('fieldChange--row.opType==', row.opType);
				if(fieldName=='startTime' || fieldName=='endTime'){
					if(row.startTime && row.endTime){
						
						var start=new Date(row.startTime);
						var end=new Date(row.endTime);
						var days=this.getDaysBetween(end,start)
						if(row.taskOut=='1' && this.projectPhase.phaseBudgetOutUserPrice && !row.budgetWorkload ){
							row.budgetWorkload=parseFloat((days*8).toFixed(2))
							row.budgetCost=row.budgetWorkload*this.projectPhase.phaseBudgetOutUserPrice 
						}else if( row.taskOut!='1' && this.projectPhase.phaseBudgetInnerUserPrice && !row.budgetWorkload){ 
							row.budgetWorkload=parseFloat((days*8).toFixed(2))
							row.budgetCost=row.budgetWorkload*this.projectPhase.phaseBudgetInnerUserPrice 
						}
					}
				}
				if(fieldName=='budgetWorkload' || fieldName=='taskOut'){
					if(row.taskOut=='1' && this.projectPhase.phaseBudgetOutUserPrice ){
						row.budgetCost=row.budgetWorkload*this.projectPhase.phaseBudgetOutUserPrice 
					}else if( row.taskOut!='1' && this.projectPhase.phaseBudgetInnerUserPrice){
						row.budgetCost=row.budgetWorkload*this.projectPhase.phaseBudgetInnerUserPrice  
					}
				}
				if(row.opType){
					var index=this.valueChangeRows.findIndex(i=>i.id==row.id);
					
					if(index>=0){
						this.valueChangeRows.splice(index,1);
						this.valueChangeRows.push(row)
					}else{
						this.valueChangeRows.push(row)
					}
				}else{

					var oneRow=this.valueChangeRows.find(i=>i.id==row.id);
					if( oneRow  ){
						if(oneRow.nextReplace){ 
							var index=this.valueChangeRows.findIndex(i=>i.id==row.id);
							this.valueChangeRows.splice(index,1);
							this.valueChangeRows.push(row)
						}else{
							return;
						}
					}else{
						this.valueChangeRows.push(row)
					}
				} 
			},
			getRowSum(row){
				var budgetCost=this.getFloatValue(row.budgetCost);
				if(row.taskOut=='1'){
					 row.taskBudgetOutUserAt=budgetCost
					 row.taskBudgetInnerUserAt=0
					 row.taskBudgetNouserAt=0;
				}else{
					 row.taskBudgetOutUserAt=0
					 row.taskBudgetInnerUserAt=budgetCost
					 row.taskBudgetNouserAt=0;
				} 
				return budgetCost;
			},
			getFloatValue(value,digit){
				
				if(isNaN(value)){
					return 0;
				}
				if(value==null ||  value=='' || value==undefined ){
					return 0;
				}
				return parseFloat(value);
			},
			showProjectList:function(){
				this.selectProjectVisible=true;
			},
			onPorjectConfirm:function(project){
				this.filters.selProject=project
				this.selectProjectVisible=false;
				this.getXmTasks();
			},  
			handleCommand(command) { 
				if(command.type=='showSubAdd'){
					this.showSubAdd(command.data);
				}else if(command.type=='showTaskTemplate'){
					this.parentTask=command.data
					this.showTaskTemplate(command.data);
				}else if(command.type=='showMenu'){
					this.parentTask=command.data
					this.showMenu(command.data);
				}else if(command.type=='showDrawer'){
					this.showDrawer(command.data);
				}else if(command.type=='showEdit'){
					this.showEdit(command.data);
				}else if(command.type=='showExecusers'){
					this.showExecusers(command.data);
				}else if(command.type=='showSkill'){
					this.showSkill(command.data);
				}else if(command.type=='focusOrUnfocus'){
					this.focusOrUnfocus(command.data);
				}else if(command.type=='handleDel'){
					this.handleDel(command.data);
				}
			},
			toMenu(task){
				this.editForm=task
				if(task.menuId){ 
					this.menuDetailVisible=true 
				}else{
					this.showEdit(task);
				}
			},
			handlePopover:function(row,opType){
				
				if( !this.userInfo.isProjectAdmin && !this.userInfo.isTeamAdmin){
					this.$message.error("只有项目经理、小组长可以操作"); 
					return; 
				}
				if('add'==opType){
					var subRow=JSON.parse(JSON.stringify(this.addForm));
					subRow.parentTaskid=null
					subRow.id=sn();
					subRow.sortLevel="1"
					subRow.opType=opType
					subRow.branchId=this.selProject.branchId
					subRow.projectId=this.selProject.id
					subRow.projectName=this.selProject.name
					if(this.projectPhase==null){

						subRow.projectPhaseId=this.parentTask.projectPhaseId
						subRow.projectPhaseName=this.parentTask.projectPhaseName 
						subRow.sortLevel=subRow.sortLevel?subRow.sortLevel:this.parentTask.sortLevel
						subRow.taskType=subRow.taskType?subRow.taskType:this.parentTask.taskType
						subRow.taskClass=subRow.taskClass?subRow.taskClass:this.parentTask.taskClass

						
					}else{
						subRow.projectPhaseId=this.projectPhase.id
						subRow.projectPhaseName=this.projectPhase.phaseName 
						subRow.sortLevel=subRow.sortLevel?subRow.sortLevel:this.projectPhase.seqNo
						subRow.taskType=subRow.taskType?subRow.taskType:this.projectPhase.taskType
					} 
					subRow.budgetCost=0
					subRow.budgetWorkload=80;
					subRow.level=subRow.level?subRow.level:'3'
					subRow.planType=subRow.planType?subRow.planType:"w2"
					subRow.actCost=0
					subRow.actWorkload=0
					subRow.taskState='0'
					subRow.rate=0
					subRow.taskOut=subRow.taskOut?subRow.taskOut:"0"
					subRow.taskClass=subRow.taskClass?subRow.taskClass:"1"
					subRow.toTaskCenter=subRow.toTaskCenter?subRow.toTaskCenter:"1"
					subRow.settleSchemel=subRow.settleSchemel?subRow.settleSchemel:"quotePrice"
					subRow.createUserid=this.userInfo.userid
					subRow.createUsername=this.userInfo.username 
					const createTime = new Date();
					var startTime=new Date();
					const endTime=new Date();
					endTime.setTime(startTime.getTime() + 3600 * 1000 * 24 * 7 *2);//两周后
					subRow.createTime=util.formatDate.format(createTime,'yyyy-MM-dd HH:mm:ss')
					subRow.startTime=util.formatDate.format(startTime,'yyyy-MM-dd HH:mm:ss')
					subRow.endTime=util.formatDate.format(endTime,'yyyy-MM-dd HH:mm:ss')

					this.fieldChange(subRow,'sortLevel');
					this.xmTasks.unshift(subRow);
				}else if('addSub'==opType){
					var subRow=JSON.parse(JSON.stringify(row));
					subRow.children=[];
					subRow.parentTaskid=row.id
					subRow.id=sn();
					subRow.sortLevel=row.sortLevel+".1"
					subRow.opType=opType
					this.fieldChange(subRow,'sortLevel');
					this.xmTasks.unshift(subRow);
				}else if('delete'==opType){
					if(row.opType && (row.opType=='addSub' || row.opType=='add')){
						if(row.children && row.children.length>0){
							this.$message.error("请先删除子元素");
							return;
						}else{ 

							var index=this.xmTasks.findIndex(i=>i.id==row.id)
							var indexValueChanges=this.valueChangeRows.findIndex(i=>i.id==row.id)
							this.valueChangeRows.splice(indexValueChanges,1);
							this.xmTasks.splice(index,1);
						}
					}else{
						this.$message.error("只能删除未保存的行");
						return;
					}
					 
				} else if ('highestPmenuId' === opType) {  
					if (row.id) {
						this.xmTasks.find(d => {
							
							if (d.id === row.id) { 
								d.parentTaskid = '';
								this.fieldChange(d,'seqNo'); 
							}
						});
					}
				} 
			},
			afterExecuserSubmit(){ 

				this.getXmTasks(); 
			},
			toJoin(){
				if(this.editForm.exeUserids && this.editForm.exeUserids.indexOf(this.userInfo.userid)>=0){
					this.$message.success("你已经加入该任务了");
					return;
				}
				this.execUserVisible=true;
				this.$nextTick(()=>{
					this.$refs.execuserMng.toJoin();

				})
			},
			clearProject(){
				this.filters.selProject=null;
				this.getXmTasks()
      }, 
      // 行拖拽
      rowDrop() {
        console.log('rowDrop===');
        
        const _this = this
        // 被拖动的元素的索引
        let dragged = null;
        // 被拖动的元素的索引
        let draggedIndex = -1;

        // 目标元素
        let target = document.querySelector('.drag-table2 .el-table__body-wrapper .el-table__body tbody');
          console.log('rowDrop--target==', target);

        let rows = 0;//行数
        setTimeout(function () {
          rows = target.childElementCount
          console.log('rowDrop--rows==', rows);
          
          for (let i = 0; i < target.childElementCount; i++) {
            const child = target.children[i]
            child.draggable = true
            // child.style.cursor = 'copy'
            child.ondragstart = function(e){
              console.log('开始--ondragstart--e==', e);
              
              dragged = e.path[0]
              draggedIndex = e.path[0].rowIndex
              console.log('child'+i+'开始拖拽'+draggedIndex);
              _this.cellMouseIndex = -1
              dragged.style.cursor = 'grabbing'
            }
            child.ondragend = function(){
              console.log('child'+i+'拖拽结束');
            }
          }
        },0)

        // 被拖动的元素正在那个容器里
        let dragIndex = -1

        target.ondragenter = function(e){
          clearTimeout(loop)

          // 由于被拖动的元素 经过tbody中的每一元素都会触发该事件, 但是我们只需要它正在那一行上就行了
          if(e.path[0].nodeName === 'TD'){
            // throughRow 表示被拖动的元素正在哪一行上
            const throughRow = e.path.find(path => {
              if(path.className.split(' ').includes('el-table__row')){
                return path
              }
            })
            if(dragIndex !== throughRow.rowIndex){
              if(dragIndex > -1){
                // 清除上次进入的容器的状态
                const last = target.children[dragIndex];
                clearClass(last)
              }
              // console.log('拖动进入目标元素'+selectRow.rowIndex);
              // 不是自己或未文件夹时才改变状态
              if(draggedIndex !== throughRow.rowIndex ){
                // 改变本次进入的容器的状态
                dragged.style.cursor = 'copy'
                throughRow.style.height = 60+'px'
                throughRow.style.backgroundColor = '#e9fdcf'
              }
              dragIndex = throughRow.rowIndex
            }
          }
          leaveIndex = -1
        }
        target.ondragover = function(e){
          // console.log('目标元素中拖拽...');
          e.preventDefault();
          leaveIndex = -1
        }

        let loop = null
        let leaveIndex = -1 // 是否拖出了整个table, -1表示还在table内

        target.ondragleave = function(e){
          console.log('ondragleave--e==', e);

          clearTimeout(loop)

          if(e.path[0].nodeName){
            const throughRow = e.path.find(path => {
              if(path.className.split(' ').includes('el-table__row')){
                return path;
              }
            })
            if(throughRow && dragIndex !== throughRow.rowIndex){
              // console.log('拖动离开目标元素'+selectRow.rowIndex);
              // selectRow.style.height = 'unset'
              // selectRow.style.backgroundColor = '#fff'
              // dragIndex = selectRow.rowIndex
            }
            if(throughRow.rowIndex === 0 || throughRow.rowIndex === rows-1){
              // 离开第一行或最后一行
              leaveIndex = throughRow.rowIndex
              loop = setTimeout(function () {
                if(leaveIndex > -1){
                  console.log("离开了",leaveIndex)
                  const leave = target.children[leaveIndex];
                  clearClass(leave)
                  dragIndex = -1
                }
              },100)
            }``
          }
        }
        target.ondrop = function(){
          console.log('ondrop--放下了'+draggedIndex);
          // 清除上次进入的容器的状态
          const last = target.children[dragIndex];
          clearClass(last)
          dragged.style.cursor = 'default'

          console.log('ondrop--draggedIndex==', draggedIndex);
          console.log('ondrop--dragIndex==', dragIndex);
          
          const startId = _this.$refs['task_'+draggedIndex].dataset.taskId;
          const endId = _this.$refs['task_'+dragIndex].dataset.taskId;

          if (startId !== endId) {
            _this.changePmenuId(startId, endId)
          }
        }

        let clearClass = function (node) {
          if(node){
            node.style.height = 'unset'
            node.style.backgroundColor = '#fff'
          }
          dragged.style.cursor = 'grabbing'
        }
        // if(last && form.menuId !== to.menuId && to.isFolder){
        //   // 移动文件/文件夹
        //   _this.copyOrMoveApi('move', form.menuId, to.menuId)
        // }
      },
      // 判断前后两个数据是否存在同一回路里面
      // dict 为字典；sId拖拽到menuId; ePmeuId 是放置位置的祖先 menuId;
      judgePmenuId(dict, sId, ePmeuId) {
        if (sId === ePmeuId) {
          return true;
        } else if (dict[ePmeuId]) {
          return this.judgePmenuId(dict, sId, dict[ePmeuId]);
        } else {
          return false;
        }
      },
      changePmenuId(sId, eId) {
        let dict = {};
        this.xmTasks.forEach(d => {
          dict[d.id] = d.parentTaskid || '';
        });
        if (!dict[eId]) {
          this.xmTasks.find(d => {
            if (d.id === sId) {
              d.parentTaskid = eId;
              console.log('更新关系1');
              this.fieldChange(d,'pmenuId',true);
            }
          })
        } else {
          const isSynezesis = this.judgePmenuId(dict, sId, dict[eId]);
          if (!isSynezesis) {
            this.xmTasks.find(d => {
              if (d.id === sId) {
                d.parentTaskid = eId;
                console.log('更新关系2');
                this.fieldChange(d,'pmenuId',true);
              }
            })
          } else {
            console.log('形成闭合回路--拖拽不更新');
            
          }
        }
			}, 
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-task-add':XmTaskAdd,
		    'xm-task-edit':XmTaskEdit, 
			xmExecuserMng,
			xmSkillMng,
			skillMng,
			xmProjectPhaseMng,
			xmTaskTemplateMng, XmProjectList,xmExchangeMng,xmMenuSelect,XmMenuRichDetail,XmGantt
		    //在下面添加其它组件
		},
		mounted() {
			
			if(this.selProject){
				this.filters.selProject=this.selProject
			}
			this.$nextTick(()=>{
				
				this.getXmTasks();

				listOption([{categoryId:'all',itemCode:'planType'}
				,{categoryId:'all',itemCode:'taskType'}
				,{categoryId:'all',itemCode:'urgencyLevel'}
				,{categoryId:'all',itemCode:'xmTaskSettleSchemel'}
				,{categoryId:'all',itemCode:'priority'}]).then(res=>{
					this.options=res.data.data;
				})		
      });
      // 阻止默认行为
      document.body.ondrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
      };
      this.rowDrop();
		}
	}

</script>

<style scoped>
.xm-task{
	width: 100%;
}
.xm-task>.el-menu-demo{
	height: 50px;
	background: #fafbfc;
}
.xm-task>.el-menu-demo>li{
	height: 100%;
	line-height: 50px;
	color: #303133;
}
.xm-task>.el-menu-demo>li:hover{
	background: transparent;
}
.xm-task>.el-menu-demo>.is-active{
	background: transparent;
}

.xm-task-add >>> .el-dialog__body{
	padding: 0 20px;
}
.xm-task >>> .el-drawer__close-btn{
	display: none !important;
}
.xm-task >>> .el-drawer__header{
	background-color: #fafbfc;
	border-bottom: 1px solid #efefef;
	padding: 8px 16px;
}
/* .xm-task .progress-form >>> .el-form-item__label{ */
	/* line-height: 1.15; */
/* } */
.xm-task >>> .el-drawer__body{
	overflow: auto;
	padding: 0 20px;
}
.xm-task .el-progress--without-text{
	display: flex;
	align-items: center;
}
.xm-task >>> .el-progress-bar__inner{
	transition: none !important;
}
.xm-task .progress-bar{
	padding: 10px 0;
}
.xm-task .progress-btn{
	line-height:0;
	position:absolute;
	top:7px;
}
.xm-task .progress-disable >>> .el-progress-bar__inner{
	background-color: #ccc !important;
}
 

small{
	font-size: 12px;
	/* float:right; */
	color: #6c757d!important;
	margin-left:20px;
}

.extra{
	border-bottom: 1px solid #dedede;
	padding: 8px;
}
.field-label{
	display: inline-block;
	width: 60px;
	font-size: 12px;
	font-weight: bold;
}
.task-header{
	border-top: 1px solid #dedede;
}
.title{
	font-size: 18px;
	font-weight: bold;
	line-height: 36px;
}
.compact{
	font-size:12px;
	color:#8c92a4;
}
.compact>span{
	color: #00b2f3;
}
.remarks{
	margin-top: 10px;
	font-size: 16px;
	overflow-x: auto;
	overflow-y: hidden;
}



.clearfix::after {
	clear: both;
	content: "";
}
</style>
<style lang="scss" scoped>
 .el-table{ 
	 box-sizing: border-box; 
	/deep/ .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    padding-right: 10px;
	display: flex;
	 }
}
</style>