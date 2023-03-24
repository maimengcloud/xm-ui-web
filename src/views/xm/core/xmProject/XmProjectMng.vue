<template>
	<section class="padding"> 
		<el-row class="padding-left padding-right"> 
			<xm-product-select class="hidden-md-and-down" :auto-select="false" @row-click="onProductSelected" @clear="onProductClose"></xm-product-select> 
			<el-select v-model="menukey" @change="handleSelect" clearable style="width:10em;">
				<el-option value="all" label="全部"></el-option>
				<el-option value="compete"  label="我参与"></el-option>
				<el-option value="leader"  label="我管理"></el-option> 
				<el-option value="approver"  label="我审核"></el-option>
				<el-option value="create"  label="我创建"></el-option>
				<el-option  value="myFocus"  label="我关注"></el-option>
				<el-option  value="myExecuserStatus0"  label="我排队"></el-option>
				<el-option  value="myExecuserStatus1"  label="我执行"></el-option> 
				<el-option  value="myExecuserStatus7"  label="我放弃"></el-option> 
			</el-select> 
			<mdp-select-dict label="项目状态" placeholder="状态" style="width:10em;" :dict="dicts['projectStatus']" v-model="filters.status"></mdp-select-dict> 
			
			<el-input v-model="filters.key" style="width:10em;" placeholder="名称查询" clearable >
			</el-input>
			<el-button  type="primary" icon="el-icon-search" @click="searchXmProjects">查询</el-button> 
				<el-popover
					placement="top-start"
					title="更多条件、操作"
					width="600"
					trigger="click" > 
					<el-descriptions class="margin-top" size="mini" :column="1" border>
							<template slot="extra">  
								<el-button type="text" @click="templateVisible=!templateVisible">{{templateVisible?'隐藏模板':'显示模板'}}</el-button>
								<el-button type="text"  @click="guiderStart(true)" icon="el-icon-help">新手导航</el-button>
 							</template> 
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-time"></i>
									显示方式
								</template> 										
								<el-radio  v-model="showType" :label="false">表格</el-radio>
								<el-radio  v-model="showType" :label="true">卡片</el-radio> 
							</el-descriptions-item> 
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-document"></i>
									选择产品
								</template>
								<xm-product-select style="display:inline;"  :auto-select="false" @row-click="onProductSelected" @clear="onProductClose"></xm-product-select> 

							</el-descriptions-item>    
							<el-descriptions-item :span="2">
								<template slot="label">
									<i class="el-icon-watch-1"></i>
									创建时间
								</template>
								
								<mdp-date-range
										v-model="filters"
										type="daterange" 
										start-key="createTimeStart"
										end-key="createTimeEnd"
										unlink-panels
										range-separator="至"
										start-placeholder="开始日期"
										end-placeholder="完成日期"
										value-format="yyyy-MM-dd HH:mm:ss" 
										:default-time="['00:00:00', '23:59:59']" 
										:auto-default="false" 
										key="planEndTime"
										></mdp-date-range>
							</el-descriptions-item> 
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-document"></i>
									项目编号
								</template> 										
								<el-input v-model="filters.id" clearable style="width:100%;"></el-input> 
							</el-descriptions-item>
							
							<el-descriptions-item>
								<el-button type="primary" style="float:right;" @click="searchXmProjects" icon="el-icon-search">查询</el-button> 
							</el-descriptions-item>
						</el-descriptions>
					<el-button  slot="reference" icon="el-icon-more" id="prj-more-btn"></el-button>
				</el-popover>
				<span style="float:right;">
				<el-popover style="padding-left:10px;"  
					placement="top-start"
					width="450" 
					trigger="click" > 
					<el-row> 
						<el-row>
							<el-badge value="都适用">
							<el-button   @click="showAdd" icon="el-icon-plus">直接添加新项目</el-button> 
							</el-badge>
						</el-row>  
						<el-row>
							<el-badge value="进阶">
							<el-button type="primary" icon="el-icon-plus">通过【项目-复制】一键创建新的项目</el-button> 
							</el-badge>
						</el-row> 
						<el-row>
							<el-badge value="新手">
							<el-button type="warning" @click="templateVisible=!templateVisible" icon="el-icon-plus">通过【模板-复制】一键创建新的项目</el-button> 
							</el-badge>
						</el-row> 
					</el-row>   
					<el-button id="prj-plus-btn" type="primary" slot="reference"  icon="el-icon-plus" round>项目</el-button>
					</el-popover>  
				</span>
		</el-row> 
		<el-row ref="table1"> 
			<!--列表 XmProject xm_project-->
			<el-row v-show="showType" v-loading="load.list" :style="{overflowX:'hidden',height:maxTableHeight+'px'}" >
				<el-row>
					<el-col  v-cloak v-for="(p,i) in ScreenData" :key="i" :xl="6" :lg="8" :md="8" :sm="12" :xs="24" class="project-card">
						
						<el-card @click.native="intoInfo(p,i)"  shadow="always" id="prj-view-box">
							<div   slot="header" style="display:flex;justify-content: space-between;">
								<div class="project-name">
									<el-tag title="项目状态" v-for="(item,index) in formatDictsWithClass(dicts,'projectStatus',p.status)" :key="index" :type="item.className">{{item.name}}</el-tag>
									{{p.name}}
								</div> 
								<el-popover
									placement="top-start"
									title="更多操作"
									width="200"
									trigger="hover">
									<div class="project-id"> 
										<el-link id="prj-copy-btn" type="primary"  title="通过复制快速创建新项目" @click.stop="onCopyToBtnClick(p)" v-loading="load.add">复制&nbsp;</el-link> 
										<el-link v-if="menukey=='myFocus'"  type="primary"  @click.stop="focusOrUnfocus(p)" >取消关注</el-link> 
										<el-link v-else  type="primary"   @click.stop="focusOrUnfocus(p)" >关注</el-link>  
										<el-link   type="danger" title="删除项目" @click.stop="handleDel(p)" v-loading="load.del">删除</el-link>

										<!--<el-link id="prj-calc-btn" type="warning" style="font-size:14px;float:right;margin-left:2px;"  title="统计项目的工作量、进度、需求、bugs等数据" @click.stop="loadTasksToXmProjectState(p)" v-loading="load.add">统计</el-link>-->
									</div>

									<el-button size="mini" slot="reference" icon="el-icon-setting" circle plain></el-button>
								</el-popover>
							</div>
							
							<div class="project-info"> 
								
								<div class="info-task"  title="已完成需求数 / 总需求数 ">
									<span>
										<span class="item-total finish-task">{{menuFinishCntCalc(p)}}</span>
										<span style="margin: 0.2rem 0.25rem !important;">/</span>
										<span class="item-total total-task">{{p.menuCnt==null?0:p.menuCnt}}</span>
									</span>
									<span class="item-type">需求</span>
								</div>
								<!--
								<div class="info-task" title="已完成 / 预算工作量 ，单位人天 ">
									<span>
										<span class="item-total finish-task">{{p.actWorkload==null?0:parseInt(p.actWorkload/8)}}</span>
										<span style="margin: 0 .25rem !important;">/</span>
										<span class="item-type total-task">{{p.budgetWorkload==null?0:parseInt(p.budgetWorkload/8)}}</span>
									</span>
									<span class="item-type">工作量</span>
								</div>
								-->
								<div class="info-task"   title="已完成 / 总任务数 ">
									<span>
										<span class="item-total finish-task">{{((p.taskFinishCnt||0)+(p.taskSetCnt||0)+(p.taskCloseCnt||0))}}</span>
										<span style="margin: 0.2rem 0.25rem !important;">/</span>
										<span class="item-total total-task">{{p.taskCnt==null?0:p.taskCnt}}</span>
									</span>
									<span class="item-type">任务</span>
								</div>
								<div class="info-task"  title="已关闭 / 总缺陷数 ">
									<span>
										<span class="item-total finish-task">{{p.closedBugs==null?0:p.closedBugs}}</span>
										<span style="margin: 0.2rem 0.25rem !important;">/</span>
										<span class="item-total total-task">{{p.bugCnt==null?0:p.bugCnt}}</span>
									</span>
									<span class="item-type">缺陷</span>
								</div>
							</div>
							<div class="project-rate">
								<el-progress :percentage="(p.finishRate==null?0:p.finishRate)"></el-progress>
								
								<el-tag v-if="getPlanRealProgress(p)>0" type="warning" effect="dark">超前{{ getPlanRealProgress(p) }}%</el-tag>
								<el-tag v-else-if="getPlanRealProgress(p)<0" type="danger" effect="dark">落后{{ 0-getPlanRealProgress(p) }}%</el-tag>
								<el-tag v-else-if="getProgress(p)>0" effect="dark" type="success" class="el-icon-check"> </el-tag>
								<el-tag v-else-if="getProgress(p)==0" effect="dark" type="info">未开始 </el-tag>
							</div>
							<div class="project-footer">
								<div class="project-type" title="项目经理">
									<mdp-select-user-xm v-if="p.pmUserid" :value="p" userid-key="pmUserid" username-key="pmUsername" :disabled="true"></mdp-select-user-xm> 
									<mdp-select-user-xm v-else-if="p.createUserid" :value="p" userid-key="createUserid" username-key="createUsername" :disabled="true"></mdp-select-user-xm> 

								</div> 
								<div class="project-period">{{p.startTime?p.startTime.substr(0,10):''}} ~{{p.endTime?p.endTime.substr(0,10):''}}</div>
							</div>
						</el-card>
					</el-col>
 
				</el-row>
				<el-row  v-if="!load.list && xmProjects.length<=0">
						<el-result icon="info" title="信息提示" subTitle="没有查到相关项目，有可能是您暂时还没有项目，有可能是您无权限查询项目。">
							<template slot="extra">
								<el-row>
									<el-row>
										您可以通过 &nbsp;<el-button   @click="showAdd" icon="el-icon-plus" type="primary" plain>项目</el-button>&nbsp;创建一个新项目
									</el-row>
									<el-row> 
										通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain style="margin-bottom:5px;">公共模板</el-button>&nbsp;体验项目的过程。<br/>
									</el-row>
									<el-row> 
										通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain style="margin-bottom:5px;">拷贝模板</el-button>&nbsp;快速创建新项目。<br/>
									</el-row>
								</el-row>
							</template>
						</el-result>
				</el-row>
			</el-row> 
			<el-row class="padding-top">
				<el-table  ref="table" :height="maxTableHeight" v-cloak v-show="!showType" fit stripe :data="ScreenData" @sort-change="sortChange" highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick" style="width: 100%;" :border="true">
					<el-row slot="empty">
							<el-result icon="info" title="信息提示" subTitle="没有查到相关项目，有可能是您暂时还没有项目，有可能是您无权限查询项目。">
								<template slot="extra">
									<el-row>
										<el-row>
											您可以通过 &nbsp;<el-button   @click="showAdd" icon="el-icon-plus" type="primary" plain>项目</el-button>&nbsp;创建一个新项目
										</el-row>
										<el-row> 
											通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain style="margin-bottom:5px;">公共模板</el-button>&nbsp;体验项目的过程。<br/>
										</el-row>
										<el-row> 
											通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain style="margin-bottom:5px;">拷贝模板</el-button>&nbsp;快速创建新项目。<br/>
										</el-row>
									</el-row>
								</template>
							</el-result>
					</el-row>
 					<el-table-column prop="name" label="项目名称" sortable min-width="250"  fixed="left">
						<template slot-scope="scope">
							<el-link type="primary" @click.stop="intoInfo(scope.row)">{{scope.row.name}}</el-link>
						</template>
					</el-table-column>  
					<el-table-column prop="id" label="项目编码" sortable min-width="180"  fixed="left" show-overflow-tooltip> 
					</el-table-column> 
					<el-table-column prop="status" label="状态" width="100" sortable  fixed="left"> 
						<template slot-scope="scope"> 
							<mdp-select-dict-tag :dict="dicts['projectStatus']" :disabled="true" v-model="scope.row.status"></mdp-select-dict-tag>		
 						</template>
					</el-table-column>   
					<el-table-column prop="bizFlowState" label="审批状态" min-width="120" >
						<template slot-scope="scope">
							<mdp-select-dict-tag :dict="dicts['bizFlowState']" :disabled="true" v-model="scope.row.bizFlowState"></mdp-select-dict-tag>		
						</template>
					</el-table-column>
					<el-table-column prop="finishRate" label="进度" width="180" sortable>
						<template slot-scope="scope"> 
							
							<div style="display:flex;"> 
								<div style="width:3em;">
									{{getProgress(scope.row)}} %
								</div>
								<el-button  id="guider-four" type="text" circle plain icon="el-icon-video-play"  title="统计项目的工作量、进度、需求、bugs等数据"  @click.stop="loadTasksToXmProjectState( scope.row)"></el-button> 
								
								<el-tag v-if="getPlanRealProgress(scope.row)>0" type="warning" effect="dark">超前{{ getPlanRealProgress(scope.row) }}%</el-tag>
								<el-tag v-else-if="getPlanRealProgress(scope.row)<0" type="danger" effect="dark">落后{{ 0-getPlanRealProgress(scope.row) }}%</el-tag>
								<el-tag v-else-if="getProgress(scope.row)>0" effect="dark" type="success" class="el-icon-check"> </el-tag>
								<el-tag v-else-if="getProgress(scope.row)==0" effect="dark" type="info">未开始 </el-tag>  
							</div>
							
 						</template>
					</el-table-column> 
					<el-table-column prop="productCnt" label="项目数" sortable min-width="120" >  
					</el-table-column> 
					<el-table-column prop="iterationCnt" label="迭代数" sortable min-width="120" >  
					</el-table-column> 
					<el-table-column prop="menuCnt" label="需求数" sortable min-width="120" > 
						<template slot-scope="scope">
							<span title="完成的需求数 / 需求总数 ">{{scope.row.menuCnt>0?scope.row.menuFinishCnt+'&nbsp;/&nbsp;'+scope.row.menuCnt:''}}</span>
						</template>
					</el-table-column> 
					<el-table-column prop="taskCnt" label="任务数" sortable min-width="120" > 
						<template slot-scope="scope">
							<span title="完成的任务数 / 任务总数 ">{{ ((scope.row.taskFinishCnt||0)+(scope.row.taskSetCnt||0)+(scope.row.taskCloseCnt||0))+'&nbsp;/&nbsp;'+(scope.row.taskCnt||0)}}</span>
						</template>
					</el-table-column>  
					<el-table-column prop="bugCnt" label="缺陷" sortable min-width="120" >
						<template slot-scope="scope">
							<span title="关闭的缺陷数 / 缺陷总数 ">{{scope.row.bugCnt>0?scope.row.closedBugs+'&nbsp;/&nbsp;'+scope.row.bugCnt:''}}</span>
						</template> 
						</el-table-column>
					<el-table-column prop="startTime" label="起止时间" sortable min-width="150" show-overflow-tooltip>
						<template slot-scope="scope">
							{{scope.row.startTime? scope.row.startTime.substr(0,10) : ""}}~{{scope.row.endTime? scope.row.endTime.substr(0,10) : ""}}
						</template>
					</el-table-column>
					<el-table-column label="操作" width="150" fixed="right">
						<template slot-scope="scope">
							<!-- <el-popover
								placement="left"
								trigger="hover"> -->
									
									<el-button v-if="menukey=='myFocus'"  type="text" @click.stop="focusOrUnfocus(scope.row)" >取消关注</el-button> 
									<el-button v-else  type="text" @click.stop="focusOrUnfocus(scope.row)" >关注</el-button>  
 									<el-button   type="text" title="通过复制快速创建新项目" @click.stop="onCopyToBtnClick(scope.row)" v-loading="load.add">复制</el-button>
									<el-button   type="text" title="删除项目" @click.stop="handleDel(scope.row)" v-loading="load.del">删除</el-button>
										
									<!-- 
									<el-button  type="primary" @click.stop="statusChange(scope,'1')" v-if="scope.row.status==0 || scope.row.status == 2">提交审核</el-button>
									<el-button  type="primary" @click.stop="statusChange(scope,'3')" v-if="scope.row.status==1">批准</el-button>
									<el-button  type="primary" @click.stop="statusChange(scope,'2')" v-if="scope.row.status==1">退回</el-button>
									<el-button  type="primary" @click.stop="statusChange(scope,'4')" v-if="scope.row.status==3">结束</el-button>
									<el-button  type="primary" @click.stop="statusChange(scope,'3')" v-if="scope.row.status==4">重新启动</el-button>
									<el-button  type="primary" @click.stop="handleDel(scope.row,scope.$index)" v-if="isLeader(scope.row.leader)">删除</el-button>
									
								
								<el-dropdown @command="handleCommand" :hide-on-click="false">
									<span class="el-dropdown-link">
										更多<i class="el-icon-arrow-down el-icon--right"></i>
									</span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item icon="el-icon-success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_start_approva'}">立项发审(审核通过后起效)</el-dropdown-item> 
										<el-dropdown-item icon="el-icon-success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_delete_approva'}">删除发审(审核通过后删除)</el-dropdown-item> 
										<el-dropdown-item icon="el-icon-success"   :command="{type:'showEdit',row:scope.row,bizKey:'xm_project_baseinfo_change_approva'}">基础信息变更发审(审核通过后生效)</el-dropdown-item> 
										<el-dropdown-item icon="el-icon-success"   :command="{type:'showEdit',row:scope.row,bizKey:'xm_project_budget_change_approva'}">预算变更发审(审核通过后生效)</el-dropdown-item> 
										<el-dropdown-item icon="el-icon-success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_over_approva'}">项目结项发审(审核通过后生效)</el-dropdown-item> 
										<el-dropdown-item icon="el-icon-success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_suspension_approva'}">项目暂停发审(审核通过后生效)</el-dropdown-item> 
										<el-dropdown-item icon="el-icon-success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_restart_approva'}">项目重新启动发审(审核通过后生效)</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown> 
								--> 
								<!-- <el-button style="width:100%;" slot="reference" class="see-more" type="text" icon="el-icon-more"></el-button>
							</el-popover> -->
						</template>
					</el-table-column>
				</el-table>
			</el-row>
		</el-row> 
		<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[12,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 

		<el-dialog title="项目新增" :visible.sync="addFormVisible" :with-header="false" width="80%" top="20px" :close-on-click-modal="false" append-to-body>
			<xm-project-add :sel-project="addForm" op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-project-add>
		</el-dialog>
		<el-dialog title="项目编辑" :visible.sync="editFormVisible" :with-header="false"  width="80%" top="20px"  :close-on-click-modal="false" append-to-body>
			<xm-project-edit :sel-project="editForm" op-type="edit" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-edit>
		</el-dialog>
		<el-drawer :title="selectProject==null?'项目明细':selectProject.name" center :fullscreen="true" :visible.sync="showInfo"  size="50%"  :close-on-click-modal="false" append-to-body>
			<xm-project-info :sel-project="selectProject" :visible="showInfo" @changeShowInfo="changeShowInfo" @submit="changeShowInfo"></xm-project-info>
		</el-drawer>
		
		<el-drawer v-if="selectProject" :title="selectProject==null?'操作日志':selectProject.name+'操作日志'" center   :visible.sync="xmRecordVisible"  size="50%"  :close-on-click-modal="false" append-to-body>
			<xm-record :obj-type="'project'" :project-id="selectProject.id"  :visible="xmRecordVisible" :simple="1"></xm-record>
		</el-drawer>
		
		<el-dialog
			title="通过复制创建新的模板或者新的项目"
			:visible.sync="copyToVisible"
			width="500" > 
			<el-form>
			<el-form-item label="项目名称">
				<el-input v-model="xmProjectCopy.name" placeholder="新的项目名称"></el-input> 
			</el-form-item>
			<el-form-item  label="项目代号"> 
				<el-input v-model="xmProjectCopy.code"  placeholder="新的项目代号">
					<template slot="append">
						<el-button type="text" @click="createProjectCode">自动生成</el-button>
					</template>
				</el-input>
				
							 <font color="blue" style="font-size:10px;">项目代号为合同上的项目代号，甲乙方共享;项目内部编号为 &nbsp;代号-四位随机码</font>
			</el-form-item>
			<el-form-item  label="目标">
				<el-radio v-model="xmProjectCopy.isTpl" label="1">复制为新的模板</el-radio>
				<el-radio v-model="xmProjectCopy.isTpl" label="0">复制为新的项目</el-radio>
			</el-form-item> 
			<el-form-item  label="公开范围" v-if="xmProjectCopy.isTpl=='1'">
				<el-radio v-model="xmProjectCopy.tplType" label="1">向全网公开</el-radio>
				<el-radio v-model="xmProjectCopy.tplType" label="2">只向本企业公开</el-radio>
			</el-form-item>
			<el-form-item label="附加任务">
				<el-checkbox v-model="xmProjectCopy.copyPhase" true-label="1" false-label="0">拷贝计划</el-checkbox> 
				<el-checkbox v-model="xmProjectCopy.copyTask" true-label="1" false-label="0">拷贝任务</el-checkbox>  
				<el-checkbox v-model="xmProjectCopy.copyGroup" true-label="1" false-label="0">拷贝项目组织架构</el-checkbox>  
				<el-checkbox v-model="xmProjectCopy.copyGroupUser" true-label="1" false-label="0">拷贝项目组成员</el-checkbox>  
				<el-checkbox v-model="xmProjectCopy.copyProduct" true-label="1" false-label="0">拷贝关联产品及需求明细</el-checkbox>  
			</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="copyToVisible = false;load.add=false">取 消</el-button>
				<el-button type="primary" @click="onCopyToConfirm" :disabled="load.add" v-loading="load.add">确 定</el-button>
			</span>
		</el-dialog> 
		<el-dialog :visible.sync="templateVisible" append-to-body width="60%" top="20px">
			<xm-project-tpl-mng @copy="searchXmProjects" :show-type="'simple'" ref="xmProjectTplMngRef"></xm-project-tpl-mng>
		</el-dialog>
	</section> 

</template>

<script>
	import Vue from 'vue'
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import config from "@/common/config"; //全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmProject, editStatus, delXmProject, batchDelXmProject,copyTo,createProjectCode ,getDefOptions} from '@/api/xm/core/xmProject'; 
	import {  loadTasksToXmProjectState , loadTasksSettleToXmProjectState} from '@/api/xm/core/xmProjectState';

	import { addUserFocus , delUserFocus } from '@/api/mdp/sys/userFocus';
	import  XmProjectAdd from './XmProjectEdit';//新增界面
	import  XmProjectEdit from './XmProjectEdit';//修改界面
	import { mapGetters } from 'vuex'
	import xmTaskMng from '../xmTask/XmTaskMng';  
	import XmProjectTplMng from './XmProjectTplMng'; 
	import XmProductSelect from '@/views/xm/core/components/XmProductSelect';
	import MdpSelectUserXm from "@/views/xm/core/components/MdpSelectUserXm/index";
	
		import store from '@/store' 

	import Guider from '@/components/Guider/Index.js';

	export default { 
		props:['dataScope', 'source'],
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),
			ScreenData() {
				const key = this.menukey;
				const userid = this.userInfo.userid;
				return this.xmProjects;
				 
			},
		},
		watch: {
			"showType": function(val){
				console.log("shotType_change");
				//this.xmProjects = [];
				//this.getXmProjects();
			},
			"finishFlag":function(val){
				this.searchXmProjects();
			}
		},
		data() { 
			return {
				filters: {
					key: '',
					productId:'',
					productName:'',
					id:'',//项目编号
					createTimeStart:'',
					createTimeEnd:'',
				},
				xmProjects: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:12,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts: getDefOptions(),//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProject界面是否显示
				//新增xmProject界面初始化数据
				addForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planIuserAt:'',planOuserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'0',totalReceivables:'0',budgetMarginRate:13,contractAmt:0,planIuserPrice:85,planOuserPrice:100,planOuserCnt:0,planIuserCnt:0,planWorkingHours:0,taxRate:3,planIuserWorkload:0,planOuserWorkload:0,fromTplId:'',budgetCtrl:'0',deptid:'',showOut:'0',isTpl:'0',pmUserid:'',pmUsername:'',assUserid:'',assUsername:'',admUserid:'',admUsername:'',budgetEarly:'',phaseActCtrl:'',del:'0',ltime:'',ostatus:'0',workType:'',wtype:'',earlyAmt:0,maxTaskAmt:0,menuLink:'0',phaseLink:'0',tplType:'',qxCode:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProject界面初始化数据
				editForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planIuserAt:'',planOuserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'0',totalReceivables:'0',budgetMarginRate:13,contractAmt:0,planIuserPrice:85,planOuserPrice:100,planOuserCnt:0,planIuserCnt:0,planWorkingHours:0,taxRate:3,planIuserWorkload:0,planOuserWorkload:0,fromTplId:'',budgetCtrl:'0',deptid:'',showOut:'0',isTpl:'0',pmUserid:'',pmUsername:'',assUserid:'',assUsername:'',admUserid:'',admUsername:'',budgetEarly:'',phaseActCtrl:'',del:'0',ltime:'',ostatus:'0',workType:'',wtype:'',earlyAmt:0,maxTaskAmt:0,menuLink:'0',phaseLink:'0',tplType:'',qxCode:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				menukey: "all",
				showType: true,
				showInfo: false,
				selectProject: null,
				finishFlag: false,
				xmRecordVisible: false,
				productSelectVisible:false,
				maxTableHeight:300, 
 				xmProjectCopy:{
					id:'',name:'',code:'',isTpl:'',copyPhase:'1',copyTask:'1',copyGroup:'1',copyGroupUser:'0',copyProduct:'1',tplType:'2',
				},
				copyToVisible:false,
				templateVisible:false,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			...util,
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjects();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjects();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmProjects();
			},
			searchXmProjects(){
				 this.pageInfo.count=true; 
				 this.getXmProjects();
			},
			//获取列表 XmProject xm_project
			getXmProjects(callBack) {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
				};
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				} 
				this.load.list = true; 
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.finishFlag){
					params.status  = '4';
				}

				params = this.menuFilter(params);
				if(this.filters.productId){
					params.linkProductId  = this.filters.productId
				} 
				if(this.filters.status){
					params.status  = this.filters.status
				} 
				params.createTimeStart=this.filters.createTimeStart
				params.createTimeEnd=this.filters.createTimeEnd
				listXmProject(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						console.log(res.data);
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false; 
						this.xmProjects = res.data.data; 
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					} 
					if(callBack){
						this.$nextTick(()=>{
							callBack(); 
						})
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			menuFilter(params) {
				const key = this.menukey;
				const userid = this.userInfo.userid;
				if( this.dataScope=='all' && key == "compete"){ 
						params.compete = userid;  
				}else if( this.dataScope!='all' && (key == "compete" || key=="all")){
						params.compete = userid; 
				} else if(key == "leader"){ //负责人
					params.pgTypeIds=['nbxmjl']
					params.userid=userid
				}
				else if(key == "moniter"){ //监控人
					params.pgTypeIds=['yyz','xmzl']
					params.userid=userid
				}
				else if(key == "approver"){ //审批人
					params.pgTypeIds=['nbxmjl','xmzk','nbldz']
					params.userid=userid
				}
				else if(key == "create"){
					params.createUserid = userid;
				}else if(key=="myFocus"){
					params.myFocus="1"
					params.userid=userid
				}else if(key.indexOf("myExecuserStatus")>=0){
					params.userid=userid
					params.myExecuserStatus=key.substring("myExecuserStatus".length)
				}
				if(this.filters.id){
					params.id=this.filters.id
				}
				if(this.filters.key){
					params.key=this.filters.key
				}
				return params;
			},

			//"隐藏结束的项目"按下触发
			setSearch() {
				this.getXmProjects();
			},

			//显示编辑界面 XmProject xm_project
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProject xm_project
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjects();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProject
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProject
			handleDel: function (row,index) {  
				this.$prompt('将同步删除计划、组织、任务等，慎重起见，请输入项目代号:'+row.code, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					 if(value==row.code){
						 this.load.del=true;
						let params = { id: row.id };
						delXmProject(params).then((res) => {
							this.load.del=false;
							var tips=res.data.tips;
							if(tips.isOk){ 
								this.pageInfo.count=true;
								this.getXmProjects();
							}
							this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
						}).catch( err  => this.load.del=false ); 
					 }else{
						 this.$notify({position:'bottom-left',showClose:true,message: "项目代号不正确", type: 'error' }); 
					 }
				}).catch(() => { 
					return;    
				});
 
					
			},
			//批量删除xmProject
			batchDel: function () {
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProject(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjects(); 
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				const that = this; 
				this.selectProject=row;
				this.editform=row;
			},
			/**begin 自定义函数请在下面加**/
			//是否负责人 是则true，否则false
			isLeader(leader) {
				return leader.some(i=>i.leadType=='负责人' && i.userid == this.userInfo.userid);
			},

			//进入info界面
			intoInfo(row) {
				this.selectProject = row;
				store.dispatch("setProjectInfo",row).then(res=>{
					this.$router.push({ name:'projectOverview', query: {projectId:row.id} })
				}) 
			},

			//筛选项目
			handleSelect(key, keyPath) {
				this.menukey = key;
				this.getXmProjects();
			},
			//修改项目状态
			statusChange(scope,val) {
				this.load.edit = true;
				let params = {
					id: scope.row.id,
					status: val,
				};
				editStatus(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.ScreenData[scope.$index].status = val;
						this.status = val;
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
					this.load.edit = false;
				}).catch( err => this.load.edut = false );
			},
			changeShowInfo(project) {
				this.editForm=project
				this.xmProjects = [];
				this.getXmProjects();
				this.showInfo = false;
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
			
			sendToProcessApprova:function(row,bizKey){   
				if(row.bizFlowState=='1'){
					this.$notify.error("审核中，不允许重新发起");
					return;
				}
				
				let extVars={projectId:row.id}
				let jsonExtVars=JSON.stringify(extVars); 

				var currDomain=window.location.protocol+"//"+window.location.host;
				var fullPath=this.$route.fullPath;  
				var bizUrl=currDomain+'/'+process.env.CONTEXT+'/'+process.env.VERSION+'/#'+fullPath+'?extVars='+jsonExtVars
					
				var titleNames=row.name
				var mainTitle=''
				var mainContext=''


				if(bizKey=='xm_project_delete_approva'){
					if(row.status!='0'){
						this.$notify.error("只有状态为初始化的项目可以删除");
						return;
					}
					mainTitle='关于删除项目【'+titleNames+"】的审批"
					mainContext=mainTitle+',删除原因：';
				} else if(bizKey=='xm_project_over_approva'){
					if(row.status!='1'){
						this.$notify.error("只有状态为执行中的项目可以进行结项操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】结项的审批"
					mainContext=mainTitle;
					
				} else if(bizKey=='xm_project_restart_approva'){
					if(row.status!='3'){
						this.$notify.error("只有状态为暂停的项目可以进行重新启动操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】重新启动的审批"
					mainContext=mainTitle;
				} else if(bizKey=='xm_project_start_approva'){
					if(row.status!='0'){
						this.$notify.error("只有状态为初始化的项目可以进行立项审批操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】的立项审批"
					mainContext=mainTitle
				}  else if(bizKey=='xm_project_suspension_approva'){
					if(row.status!='1'){
						this.$notify.error("只有状态为执行中的项目可以进行挂起操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】暂停的审批"
					mainContext=mainTitle+'';
				} else if(bizKey=='xm_project_budget_change_approva'){
					if(row.status!='1'){
						this.$notify.error("只有状态为执行中的项目可以进行预算变更操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】的预算变更审批"
					mainContext=mainTitle+'';
				} else{
					this.$notify.error("暂不支持的业务审批");
					return;
				} 

				let params={ 
					mainContext:mainContext,
					mainTitle:mainTitle,
					bizKey:bizKey,
					bizUrl:bizUrl,
					restUrl:config.getXmBasePath()+"/xm/core/xmProject/processApprova",
					extVars:extVars,
					flowVars:{
						subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
						branchId:row.branchId,
						projectId:row.id
					},
				}
				let jsonParmas=encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
				this.$router.push({name:'ProcdefListForBizStart',params:jsonParmas}); 
			}, 
			handleCommand(command) { 
				if(command.type=='sendToProcessApprova'){
					this.sendToProcessApprova(command.row,command.bizKey);
				} else if(command.type=='showEdit'){
					this.showEdit(command.row,null);
				}
			},
			focusOrUnfocus:function(row){
				if(this.menukey=="myFocus"){
					delUserFocus({pbizId:row.id,focusType:'1',bizId:row.id,bizName:row.name}).then(res=>{
						var tips=res.data.tips;
						if(tips.isOk){
							this.getXmProjects(); 
						} 
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
					})
				}else{
					addUserFocus({pbizId:row.id,focusType:'1',bizId:row.id,bizName:row.name}).then(res=>{
						var tips=res.data.tips;
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
					})
				}
			},
			
			onProductSelected:function(product){
				this.filters.productId=product.id
				this.filters.productName=product.productName   
				this.productSelectVisible=false;
			},
			onProductClose:function(){
				this.filters.productId=''
				this.filters.productName='' 
			},
			
			onCopyToBtnClick(row){
				this.xmProjectCopy.id=row.id;
				this.xmProjectCopy.name=row.name+"(复制)";
				this.xmProjectCopy.isTpl=row.isTpl; 
				this.copyToVisible=true;
			},
			onCopyToConfirm(){
				
				if(!this.xmProjectCopy.code){
					this.$notify({position:'bottom-left',showClose:true,message: '项目代号不能为空', type: 'error' });
					return;
				}  
				copyTo(this.xmProjectCopy);
				this.$notify({position:'bottom-left',showClose:true,message: "已提交拷贝任务，执行需要1-5分钟，请稍后刷新项目列表", type:  'success' });
			}, 
			createProjectCode(){
				createProjectCode({}).then(res=>{
					var tips=res.data.tips;
					if(tips.isOk){
						this.xmProjectCopy.code=res.data.data
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
				})
			},
			formatProjectStatus(status){
				if(this.dicts['projectStatus'] && this.dicts['projectStatus'].length>0 ){
					var sts=this.dicts['projectStatus'].find(i=>i.id==status)
					if(sts){
						return sts.name
					}else{
						return status;
					}
				}else{
					return status;
				}
			},
			formatterByDicts(row,column,cellValue){ 
				if(column.property=='status'){
					return this.formatProjectStatus(cellValue);
				} 
			},
			loadTasksToXmProjectState(row){
				
					var params={projectId:row.id}
				loadTasksToXmProjectState(params).then((res) => {
						this.load.edit=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.searchXmProjects(); 
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.edit=false ); 
			},
			
			guiderStart(forceDisplayWhileClosed) { // 初始化引导页
				Guider.startByName('xmProjectMng',forceDisplayWhileClosed); 
			},
			menuFinishCntCalc(project){
				var allFinishCnt= (project.menuFinishCnt||0 )+ (project.menuCloseCnt||0)
				 return allFinishCnt;
			},
			getProgress(project){
				var planRate=0;
				if(!project.estimateWorkload||!project.budgetWorkload){
					planRate= 0;
					return planRate;
				}
				planRate= Math.round(project.estimateWorkload/project.budgetWorkload*100);
				return planRate
			},
			getPlanRealProgress(project){
				var planRate=0;
				if(!project.estimateWorkload||!project.budgetWorkload){
					planRate= 0;
					return planRate;
				}
				planRate=project.estimateWorkload/project.budgetWorkload*100;
				return  Math.round((project.finishRate||0)-planRate)
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-project-add':XmProjectAdd,
		    'xm-project-edit':XmProjectEdit, 
			XmProductSelect,
			xmTaskMng,
			XmProjectTplMng,MdpSelectUserXm
		    //在下面添加其它组件
		},
		mounted() { 
			if(this.$route.params){
				this.filters.productId=this.$route.params.productId;
				this.filters.productName=this.$route.params.productName;
			}
			this.$nextTick(() => {    
				initSimpleDicts('all',['projectType','priority','projectStatus','bizFlowState']).then(res=>{
					this.dicts=res.data.data;
				})
                this.maxTableHeight = this.source == 'GZT' ?  this.maxTableHeight : util.calcTableMaxHeight(this.$refs.table1.$el);
				this.showInfo = false;
				this.getXmProjects(this.guiderStart);
			}); 
		}, 
	}

</script>

<style lang="scss" scoped> 
 
.changebtn{
	float: right;
	padding: 2px 10px;
	display: flex;
	align-items: center;
	line-height: 0;
	height: 100%;
}
.changebtn > button{
	padding: 0;
	border: 0;
	color: #333;
}
.changebtn >>> i::before{
	font-size:20px;
}
.changebtn-active{
	color: #409EFF !important;
}
.app-container{
	padding: 10px;
}
.el-menu-demo{
	border: 0 !important;
	height: 50px;
	padding-left: 10px;
	background-color: #fafbfc;
}
.el-menu-demo>.el-menu-item,
.el-menu-demo>.el-submenu >>> .el-submenu__title{
	height: 100%;
	line-height: 50px;
	color: #909399;
}
.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal>.el-submenu .el-submenu__title:hover{
	background-color: transparent;
}
.project-card{ 
	cursor: pointer;
	font-size: 12px;
	color: #999;
	padding: 10px; 
}
.project-card:hover{
	border-color: #00abfc;
}
.project-card >>> .el-card__body{
	padding: 20px 15px 10px;
}
.project-name{
	font-size: 16px;
	font-weight: 700;
	color: #333;
	height: 24px;
}
.project-id{
	margin-top: 4px;
	height: 18px;
}
.project-info{
	display: flex;
	margin-top: 8px;
	justify-content: space-around;
}
.project-info>div{
	display: flex;
	flex-direction: column;
}
.info-item{
	width: 15%;
	text-align: center;
}
.info-item >>> span{
	display: block;
}
.item-total{
	font-size: 18px;
	color: #666;
}

.info-task{  
	span{
		display: flex;
		justify-content:center;
	}
	.item-type{
		align-content: center;
		text-align: center;
	}
}
.finish-task{
	color: #00abfc !important;
}
.project-rate{
	margin: 15px 0;
}
.project-rate>.el-progress{
	display: flex;
	align-items: center;
}
.project-rate >>> .el-progress-bar{
	padding-right: 0;
	margin-right: 0;
}
.project-rate >>> .el-progress__text{
	margin-left: 5px;
}
.project-footer{
	display: flex;
}
.project-footer>div{
	width: 50%;
}
.project-footer>div:not(:first-child){
	width: 50%;
}
.project-period{
	line-height: 40px;
	text-align: right;
}
.see-more > i{
	background:#000;
}
/* 超过宽度则用...代替 */
.truncate{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
[v-cloak]{
	display: none;
}
.hidden-btn{
	margin-top: 5px;
	margin-bottom: 5px;
}
.right-btn{
	margin-top: 12px;
} 
@media only screen and (max-height: 2400px) {
	.project-box{
		max-height: 1600x;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 1200px) {
	.project-box{
		max-height: 800px;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 980px) {
	.project-box{
		max-height: 600px;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 640px) {
	.project-box{
		max-height: 300px;
		overflow-y: auto;
	}
}
 
</style>