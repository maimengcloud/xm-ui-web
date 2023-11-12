<template>
	<section>
				<el-row>
					<xm-product-select ref="xmProductSelect1" style="display:inline;" v-if="(!xmProduct||!xmProduct.id)&&(!xmIteration||!xmIteration.id)"   :auto-select="false" :link-project-id="selProject?selProject.id:null" @row-click="onProductSelected"  :iterationId="xmIteration?xmIteration.id:null"  @clear="onProductClearSelect"></xm-product-select>

					<mdp-select v-model="filters.priority" placeholder="优先级"  clearable style="width: 6em;" item-code="priority">
					</mdp-select>
					<mdp-select v-model="filters.status" placeholder="状态" clearable style="width: 6em;" item-code="menuStatus">
					</mdp-select>
					<el-input v-model="filters.key" style="max-width: 15em;" placeholder="需求名称查询" clearable>
					</el-input>
					<el-button   type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmMenus" icon="el-icon-search"></el-button>

					<el-popover
						placement="top-start"
						title="更多查询条件或者操作"
						width="800"
						v-model="moreVisible"
						trigger="manual" >

						<el-row  style="float:right;margin-top:-40px">
								<el-button
								icon="el-icon-close"
								@click="moreVisible=false"
								type="text"
								>关闭</el-button
								>
						</el-row>
						<el-descriptions class="margin-top" size="mini" :column="2" border>
							<template slot="extra">
									<el-button @click="showParentMenu" icon="el-icon-top" title="更换上级">更换上级</el-button>
									<el-button    @click="handleExport" icon="el-icon-download">导出</el-button>
									<el-button     @click="loadTasksToXmMenuState" icon="el-icon-s-marketing">汇总进度</el-button>
									<el-button  type="danger" @click="batchDel" icon="el-icon-delete" title="删除">删除</el-button>
 							</template>

							 <el-descriptions-item>
								<template slot="label">
									<i class="el-icon-s-grid"></i>
									显示方式
								</template>
								<el-radio v-model="displayType" label="agileUser">故事看板</el-radio>
								<el-radio v-model="displayType" label="table">列表</el-radio>
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-user"></i>
									责任人
								</template>
								<mdp-select-user style="max-width:180px;" label="选择责任人" v-model="filters.mmUserid" :clearable="true"></mdp-select-user>
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-key"></i>
									需求编号
								</template>
								<el-input v-model="filters.menuId" placeholder="需求编号查询" clearable></el-input>
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-document"></i>
									归属模块
								</template>
								<span v-if="filters.func">{{ filters.func.name }}&nbsp;</span><el-button type="text" v-if="filters.func" @click="filters.func=null" icon="el-icon-close"></el-button><el-button @click="funcVisible=true" type="text">选择模块</el-button>
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-connection"></i>
									归属迭代
								</template>
								<xm-iteration-select v-if="!xmIteration || !xmIteration.id" style="display:inline;" :auto-select="false"  :product-id="filters.product?filters.product.id:null" :link-project-id="selProject?selProject.id:null"   placeholder="迭代"  @row-click="onIterationSelected" @clear="onIterationClearSelect">
										</xm-iteration-select>
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-connection"></i>
									迭代情况
								</template>
								<el-select   v-model="filters.iterationFilterType" placeholder="加入过迭代？" clearable   >
											<el-option   value="not-join-any-iteration"  label="未加入过迭代"></el-option>
											<el-option   value="join-any-iteration"  label="已加入过迭代"></el-option>
											<el-option   value="not-join-curr-iteration"  :label="'未加入迭代【'+filters.iteration.iterationName+'】'"  v-if="filters.iteration && filters.iteration.id"></el-option>
											<el-option   value="join-curr-iteration"  :label="'已加入本迭代【'+filters.iteration.iterationName+'】'" v-if="filters.iteration && filters.iteration.id"></el-option>
										</el-select>
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-time"></i>
									任务情况
								</template>

								<el-select  v-model="filters.taskFilterType" placeholder="已分配任务的需求？" clearable >
											<el-option   value="not-join-any-project"  label="未分配过任务的需求"></el-option>
											<el-option   value="join-any-project"  label="已分配过任务的需求"></el-option>
											<el-option   value="not-join-curr-project"  :label="'未分配任务到项目【'+selProject.name+'】'" v-if="selProject && selProject.id"></el-option>
											<el-option   value="join-curr-project"  :label="'已分配任务到项目【'+selProject.name+'】'"  v-if="selProject && selProject.id"></el-option>
										</el-select>
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-document"></i>
									需求类型
								</template>
								<mdp-select item-code="demandType" v-model="filters.dtype" clearable placeholder="需求类型">
 								</mdp-select>
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-document"></i>
									需求来源
								</template>

								<mdp-select item-code="demandSource" v-model="filters.source" placeholder="需求来源"  clearable >
 										</mdp-select>
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-document"></i>
									需求层次
								</template>
										<mdp-select item-code="demandLvl" v-model="filters.dlvl" placeholder="需求层次"  clearable >
 										</mdp-select>
							</el-descriptions-item>
							<el-descriptions-item :span="2">
								<template slot="label">
									<i class="el-icon-watch"></i>
									开始时间
								</template>
								<mdp-date-range
									v-model="filters"
									type="daterange"
									start-key="planStartTimeStart"
									end-key="planStartTimeEnd"
									unlink-panels
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="完成日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									:default-time="['00:00:00', '23:59:59']"
									:auto-default="false"
									key="planStartTime"
								></mdp-date-range>
							</el-descriptions-item>
							<el-descriptions-item :span="2">
								<template slot="label">
									<i class="el-icon-watch-1"></i>
									结束时间
								</template>

								<mdp-date-range
										v-model="filters"
										type="daterange"
										start-key="planEndTimeStart"
										end-key="planEndTimeEnd"
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

							<el-descriptions-item :span="2">
								<el-button type="primary" style="float:right;" @click="searchXmMenus" icon="el-icon-search">查询</el-button>

							</el-descriptions-item>

						</el-descriptions>

							<el-button  slot="reference" icon="el-icon-more" @click="moreVisible=!moreVisible"></el-button>
					</el-popover>
					<span style="float:right;">
					<el-popover style="padding-left:10px;"
						placement="top-start"
						width="250"
						trigger="click" >
						<el-row>
							<!--
							<el-row>
								<div   class="icon" style="background-color:  rgb(255, 153, 51);">
									<i class="el-icon-s-promotion"></i>
								</div>
								<el-button   @click="showAdd('1')">新建史诗</el-button>
							</el-row>

							<el-row>
								<div  class="icon" style="background-color:  rgb(0, 153, 51);">
								<i class="el-icon-s-flag"></i>
								</div>
								<el-button   @click="showAdd('2')">新建特性</el-button>
							</el-row>
							-->
							<el-row>

								<div  class="icon" style="background-color:  rgb(79, 140, 255);">
								<i class="el-icon-document"></i>
								</div>
								<el-button   @click="showAdd('3')"  >新建用户故事</el-button>
							</el-row>


							<el-row>
								<el-button  @click="showImportFromMenuTemplate()" icon="el-icon-upload2">由模板快速导入需求</el-button>
							</el-row>
						</el-row>
						<el-button type="primary" v-if="!disabledMng"  round  slot="reference" icon="el-icon-plus"></el-button>
					</el-popover>

					<el-button class="hidden-md-and-down" @click="showParentMenu" icon="el-icon-top" title="更换上级"></el-button>
					<el-button class="hidden-md-and-down"  v-if="!disabledMng "  type="danger" @click="batchDel" icon="el-icon-delete" title="删除"></el-button>

					<xm-table-config class="hidden-lg-and-down" ref="tableConfig" style="display:inline;" :table="$refs.table"></xm-table-config>

					</span>
					</el-row>
					<el-row v-if="displayType=='table'" class="padding-top">
					<el-table  element-loading-text="努力加载中" element-loading-spinner="el-icon-loading" :cell-style="cellStyleCalc" :expand-row-keys="expandRowKeysCpd" :header-cell-style="cellStyleCalc"    stripe fit border ref="table" height="100px" v-adaptive="{bottomOffset:50}" :data="xmMenusTreeData" current-row-key="menuId" row-key="menuId"  @sort-change="sortChange" highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick">
						<el-table-column sortable type="selection" width="40"></el-table-column>

						<el-table-column prop="menuName" label="故事名称" min-width="350" fixed="left">
							<template slot-scope="scope">
							<div style="display:flex; flex-wrap:nowrap;">
								<div  v-if="scope.row.dclass=='1'" class="icon" style="background-color:  rgb(255, 153, 51);">
								<i class="el-icon-s-promotion" style="width:20px;"></i>
								</div>
								<div v-if="scope.row.dclass=='2'" class="icon" style="background-color:  rgb(0, 153, 51);">
								<i class="el-icon-s-flag"  style="width:20px;"></i>
								</div>
								<div v-if="scope.row.dclass=='3'" class="icon" style="background-color:  rgb(79, 140, 255);">
								<i class="el-icon-document"  style="width:20px;"></i>
								</div>
								<el-link  @click="showEdit( scope.row,scope.$index)">{{scope.row.seqNo}} &nbsp; {{scope.row.menuName}} </el-link>
								<div class="tool-bar">
                                      	<el-button @click="copyOne(scope.row,scope.$index)" icon="el-icon-document-copy" circle title="复制一行"></el-button>
 								</div>
							</div>
							</template>


						</el-table-column>
						<template>
						<el-table-column prop="mmUsername" label="跟进人"  min-width="100" show-overflow-tooltip  sortable>
							<template slot-scope="scope">
								<mdp-select-user show-style="tag" size="mini" @visible-change="selectVisible(scope.row,$event)" v-model="scope.row.mmUserid" :init-name="scope.row.mmUsername" @change2="editXmMenuSomeFields(scope.row,'mmUserid',$event)"></mdp-select-user>
							</template>
						</el-table-column>
						<el-table-column prop="productId" label="产品" width="100" show-overflow-tooltip sortable>
						</el-table-column>

						<el-table-column prop="finishRate" label="进度" width="100" show-overflow-tooltip sortable>
							<template slot-scope="scope">
								<span
									:style="{borderRadius: '30px',color:scope.row.finishRate >= 100 ? 'green' : 'blue'}"
								>
									{{ (scope.row.finishRate != null ? scope.row.finishRate : 0) + "%" }}
								</span>
							</template>
						</el-table-column>
						<el-table-column prop="status" label="状态"  min-width="80"  sortable>
							<template slot-scope="scope">
										<mdp-select show-style="tag"  size="mini"  @visible-change="selectVisible(scope.row,$event)" item-code="menuStatus" v-model="scope.row.status" label="需求状态"   @change="editXmMenuSomeFields(scope.row,'status',$event)">
										</mdp-select>
							</template>
						</el-table-column>
						<el-table-column prop="priority"  label="优先级" width="100" sortable>
							<template slot-scope="scope">
										<mdp-select show-style="tag"  size="mini" @visible-change="selectVisible(scope.row,$event)" item-code="priority" v-model="scope.row.priority" placeholder="优先级"  style="display:block;" @change="editXmMenuSomeFields(scope.row,'priority',$event)">
										</mdp-select>
							</template>
						</el-table-column>
						<el-table-column prop="dtype" label="类型" width="100"  sortable v-if="false">
							<template slot-scope="scope">
										<mdp-select show-style="tag"  size="mini" @visible-change="selectVisible(scope.row,$event)" item-code="demandType" v-model="scope.row.dtype" placeholder="类型"  style="display:block;"  @change="editXmMenuSomeFields(scope.row,'dtype',$event)">
										</mdp-select>
							</template>
						</el-table-column>
						<el-table-column prop="source"  label="来源" width="100"  :formatter="formaterByDicts"  show-overflow-tooltip sortable  v-if="false">
							<template slot-scope="scope">

										<mdp-select show-style="tag"  size="mini" @visible-change="selectVisible(scope.row,$event)" item-code="demandSource" v-model="scope.row.source" placeholder="来源"  style="display:block;" @change="editXmMenuSomeFields(scope.row,'source',$event)">
										</mdp-select>
							</template>
						</el-table-column>
						<el-table-column prop="dlvl"  label="层次" width="100" sortable>
							<template slot-scope="scope">
										<mdp-select show-style="tag"  size="mini" @visible-change="selectVisible(scope.row,$event)" item-code="demandLvl"  v-model="scope.row.dlvl" placeholder="层次"  style="display:block;" @change="editXmMenuSomeFields(scope.row,'dlvl',$event)">
										</mdp-select>
							</template>
						</el-table-column>
						<el-table-column prop="iterationName" label="迭代" width="150" show-overflow-tooltip sortable>
							<template slot-scope="scope">
								<div class="cell-text">
									{{scope.row.iterationName}}
								</div>
								<span class="cell-bar">
										<xm-iteration-select v-if="scope.row.dclass==='3'" style="display:inline;" :auto-select="false"  :product-id="scope.row.productId"    placeholder="迭代"  @row-click="editXmMenuSomeFields(scope.row,'iterationId',$event)"></xm-iteration-select>
								</span>
							</template>
						</el-table-column>

						<el-table-column prop="taskCnt" label="任务数"  min-width="100" show-overflow-tooltip sortable>
							<template slot="header">
								<el-tooltip   content="已完成 / 总数 注意：统计包括下级数据"><span>任务数</span></el-tooltip>
							</template>
							<template slot-scope="scope">
									<div>{{scope.row.taskFinishCnt}}/{{scope.row.taskCnt}}</div>
							</template>
						</el-table-column>

						<el-table-column prop="budgetWorkload" label="工时"  min-width="100" show-overflow-tooltip sortable>
							<template slot-scope="scope">
								<span title="实际工时 / 预算工时 或者 (剩余工时+实际工时)">{{scope.row.actWorkload}} &nbsp;/ &nbsp;{{scope.row.budgetWorkload}}h </span>
							</template>
						</el-table-column>
						<el-table-column prop="bugCnt" label="缺陷"  min-width="100" show-overflow-tooltip sortable>

							<template slot="header">
								<el-tooltip   content="已关闭缺陷数 / 总缺陷数 注意：统计包括下级数据"><span> 缺陷 </span></el-tooltip>
							</template>
							<template slot-scope="scope">
										{{scope.row.closedBugs}}/{{scope.row.bugCnt}}
							</template>
						</el-table-column>
						<el-table-column prop="tagNames" label="标签"  min-width="100" show-overflow-tooltip>
							<template slot-scope="scope">
								<div class="cell-text">

									{{scope.row.tagNames}}
								</div>
								<span class="cell-bar">
										<el-button @click="$refs.tagDialog.open({data:scope.row,action:'editTagIds'})">选标签</el-button>
								</span>
							</template>
						</el-table-column>
						</template>
					</el-table>
				</el-row>
				<el-row v-else-if="displayType=='agileUser'" class="padding-top">
					<xm-menu-agile-kanban-user :xm-menus="xmMenus" :xm-product="xmProduct" ref="table" :table-height="maxTableHeight"></xm-menu-agile-kanban-user>

				</el-row>
				<el-row>
					<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
				</el-row>
				<!--编辑 XmMenu xm_project_menu界面-->
				<el-dialog title="编辑故事" :visible.sync="editFormVisible" :with-header="false" fullscreen width="90%" top="20px"    append-to-body   :close-on-click-modal="false" >
					<xm-menu-edit :xm-menu="editForm" :sel-project="selProject" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit" @add-sub-menu="onAddSubMenu" @edit-fields="onEditSomeFields"></xm-menu-edit>
				</el-dialog>

				<!--新增 XmMenu xm_project_menu界面-->
				<el-dialog title="新增故事" :visible.sync="addFormVisible"  :with-header="false" width="80%" top="20px"    append-to-body   :close-on-click-modal="false">
					<xm-menu-add  :parent-menu="parentMenu"  :xm-menu="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-menu-add>
				</el-dialog>
				<el-drawer title="需求模板" :visible.sync="menuTemplateVisible"   size="80%"  append-to-body   :close-on-click-modal="false">
					<xm-menu-template-mng  :is-select-menu="true"  :visible="menuTemplateVisible" @cancel="menuTemplateVisible=false" @selected-menus="onSelectedMenuTemplates"></xm-menu-template-mng>
				</el-drawer>

				<el-drawer title="需求谈论" :visible.sync=" menuDetailVisible"   size="80%"  append-to-body   :close-on-click-modal="false">
					<xm-menu-rich-detail :visible="menuDetailVisible"  :reload="false" :xm-menu="editForm" ></xm-menu-rich-detail>
				</el-drawer>
				<el-drawer title="选中任务" :visible.sync="selectTaskVisible"   size="80%"  append-to-body   :close-on-click-modal="false">
					<xm-task-list :xm-product="filters.product" :sel-project="selProject" query-scope="planTask" check-scope="task"  :is-multi-select="true"  @tasks-selected="onSelectedTasks"></xm-task-list>
				</el-drawer>
				<el-drawer title="查看任务" :visible.sync="taskListForMenuVisible" :with-header="false"  size="80%"  append-to-body   :close-on-click-modal="false">
					<xm-task-list-for-menu  :xm-product="filters.product"  :is-multi-select="true" :menu-id="editForm.menuId"></xm-task-list-for-menu>
				</el-drawer>
				<el-drawer
					append-to-body
					title="任务"
					:visible.sync="taskMngVisible"
					:with-header="false"
					size="80%">
					<xm-task-mng :sel-project="selProject"   :menu-id="editForm.menuId" :menu-name="editForm.menuName"></xm-task-mng>
				</el-drawer>

 			<tag-dialog ref="tagDialog" :tagIds="filters.tags?filters.tags.map(i=>i.tagId):[]" :jump="true" @select-confirm="onTagSelected">
			</tag-dialog>
 			<xm-group-dialog ref="xmGroupDialog" :isSelectSingleUser="true" :sel-project="selProject" :xm-product="xmProductCpd" @user-confirm="onGroupUserSelect">
			</xm-group-dialog>
		<el-drawer
			append-to-body
			title="选择上级需求"
			:visible.sync="parentMenuVisible"
			size="60%"
			:close-on-click-modal="false"
			>
			<xm-epic-features-select
				@select="onParentMenuSelected"
				:xm-product="filters.product"
			></xm-epic-features-select>
		</el-drawer>

		<el-dialog append-to-body title="模块选择"  :visible.sync="funcVisible" size="40%" top="20px"  :close-on-click-modal="false">
			<xm-func-select :show-select="true" class="padding-left padding-right" v-if="funcVisible"  @select="onFuncSelected" :xm-product="xmProductCpd"></xm-func-select>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { listXmMenu, delXmMenu,addXmMenu,  batchDelXmMenu,batchAddXmMenu,batchEditXmMenu,listXmMenuWithState,listXmMenuWithPlan,batchChangeParentMenu,editXmMenuSomeFields } from '@/api/xm/core/xmMenu';
	import { batchRelTasksWithMenu } from '@/api/xm/core/xmTask';
	import { loadTasksToXmMenuState} from '@/api/xm/core/xmMenuState';

	import {   batchDelXmIterationMenu,batchAddXmIterationMenu } from '@/api/xm/core/xmIterationMenu';

	import  XmMenuAdd from './XmMenuAdd';//新增界面
	import  XmMenuEdit from './XmMenuEdit';//修改界面
	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//新增界面
	import  XmMenuTemplateMng from '../xmMenuTemplate/XmMenuTemplateMng';//新增界面
	import XmMenuRichDetail from './XmMenuRichDetail';
	import XmTaskList from '../xmTask/XmTaskList';
	import XmTaskMng from '../xmTask/XmTaskMng';
	import XmTaskListForMenu from '../xmTask/XmTaskListForMenu';
	import  XmIterationSelect from '@/views/xm/core/components/XmIterationSelect.vue';//修改界面
	import  XmMenuWorkload from '@/views/xm/core/components/XmMenuWorkload';//修改界面
	import  XmTableConfig from '@/views/xm/core/components/XmTableConfig';//修改界面
	import  XmGroupDialog from '@/views/xm/core/xmGroup/XmGroupDialog';//修改界面
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
	import XmFuncSelect from '../xmFunc/XmFuncSelect'

	import XmEpicFeaturesSelect from "../xmMenu/XmEpicFeaturesSelect";
	import XmMenuAgileKanbanUser from "../xmMenu/XmMenuAgileKanbanUser";
  	import TagDialog from "@/views/mdp/arc/tag/TagDialog";

	import {sn} from '@/common/js/sequence'

	import { mapGetters } from 'vuex'
	import MdpSelectUserXm from "@/views/xm/core/components/MdpSelectUserXm/index";

	export default {
		props:[ 'xmIteration','xmProduct','disabledMng','parentMenu','selProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),

      		xmMenusTreeData() {
				 return this.xmMenus;
			},
			toSearchCpd(){
				var key={iterationId:'',projectId:'',productId:'',pmenuId:''};
				if(this.xmIteration&&this.xmIteration.id){
					key.iterationId=this.xmIteration.id
					key.productId=this.xmIteration.productId
				}else{
					key.iterationId=''
				}
				if(this.xmProduct&&this.xmProduct.id){
					key.productId=this.xmProduct.id
				}else{
					key.productId=''
				}
				if(this.selProject&&this.selProject.id){
					key.projectId=this.selProject.id
				}else{
					key.projectId=''
				}
				if(this.parentMenu&&this.parentMenu.menuId){
					key.pmenuId=this.parentMenu.menuId
					key.productId=this.parentMenu.productId
				}else{
					key.pmenuId=''
				}
				return key.iterationId+key.projectId+key.productId+key.pmenuId
			},
			xmProductCpd(){
				if(this.filters.product && this.filters.product.id){
					return this.filters.product
				}
				if(this.xmIteration && this.xmIteration.id){
					return {id:this.xmIteration.productId,productName:this.xmIteration.productName}
				}
				if(this.parentMenu && this.parentMenu.menuId){
					return {id:this.parentMenu.productId,productName:this.parentMenu.productName}
				}
			}
		},
		watch:{
			xmIteration:function(){
				this.filters.iterationFilterType="join-curr-iteration"
				this.filters.iteration=this.xmIteration
			},
			xmProduct:function(){
					this.filters.product=this.xmProduct
			},
			toSearchCpd:function(){
				this.searchXmMenus();
			}
    	},
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 );
			return {
				columnsConfig:[/**{label:'',property:'',isShow:true} */],
				filters: {
					key: '',
					product:null,
					func:null,
					mmUser:{},
					iterationFilterType:'',//join、not-join、''
					taskFilterType:'',//join、not-join、''
					tags:[],
					status:'',
					iteration:null,
					dlvl:'',
					dtype:'',
					priority:'',
					source:'',
					dclasss:['3'],
					menuId:'',//需求编号
					productId:'',//产品编号
					planStartTimeStart:'',
					planStartTimeEnd:'',
					planEndTimeStart:'',
					planEndTimeEnd:'',
				},
				xmMenus: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:20,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['cast(seq_no as signed)'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['asc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
					menuStatus:[
					],
					dclass:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增xmMenu界面是否显示
				//新增xmMenu界面初始化数据
				addForm: {
					startTime:'',menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'0',online:'0',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',seqNo:'',mmUserid:'',mmUsername:'',ctime:'',ntype:'0',sinceVersion:'',childrenCnt:'0',ltime:'',tagIds:'',tagNames:'',pidPaths:'',lvl:'0',isTpl:'0',phaseId:'',iterationId:'',source:'1',proposerId:'',proposerName:'',dlvl:'0',dtype:'0',priority:'0',dclass:'',iterationName:'',endTime:'',funcId:'',funcName:'',comments:'',ups:'0',reads:'0'
				},
				addFormInit: {
					startTime:'',menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'0',online:'0',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',seqNo:'',mmUserid:'',mmUsername:'',ctime:'',ntype:'0',sinceVersion:'',childrenCnt:'0',ltime:'',tagIds:'',tagNames:'',pidPaths:'',lvl:'0',isTpl:'0',phaseId:'',iterationId:'',source:'1',proposerId:'',proposerName:'',dlvl:'0',dtype:'0',priority:'0',dclass:'',iterationName:'',endTime:'',funcId:'',funcName:'',comments:'',ups:'0',reads:'0'
				},
				editFormVisible: false,//编辑界面是否显示
				//编辑xmMenu界面初始化数据
				editForm: {
					startTime:'',menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'0',online:'0',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',seqNo:'',mmUserid:'',mmUsername:'',ctime:'',ntype:'0',sinceVersion:'',childrenCnt:'0',ltime:'',tagIds:'',tagNames:'',pidPaths:'',lvl:'0',isTpl:'0',phaseId:'',iterationId:'',source:'1',proposerId:'',proposerName:'',dlvl:'0',dtype:'0',priority:'0',dclass:'',iterationName:'',endTime:'',funcId:'',funcName:'',comments:'',ups:'0',reads:'0'
				},
				menuTemplateVisible:false,
				valueChangeRows:[],
				 menuDetailVisible:false,
				selectTaskVisible:false,
				taskMngVisible:false,
				taskListForMenuVisible:false,
				iterationVisible:false,
				userSelectVisible:false,
				selectFiltersMmUserVisible:false,
				maxTableHeight:300,
				dateRanger: [ ],
				pickerOptions:  util.getPickerOptions('datarange'),
				productVisible:false,
				tagSelectVisible:false,
				fieldTagVisible:false,
				parentMenuVisible:false,
				maps:new Map(),
				linkIterationPopoverVisible:false,
 				/**begin 自定义属性请在下面加 请加备注**/
				expandRowKeysCpd:[],
				moreVisible:false,
				displayType:'table',
				funcVisible:false,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			selectVisible(row,visible){
				if(visible){
					this.rowClick(row)
				}
			},
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmMenus();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmMenus();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){

				if (obj.order == null) {
					this.pageInfo.orderFields = [];
					this.pageInfo.orderDirs = [];
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
				this.getXmMenus();
			},
			searchXmMenus(){
				 this.pageInfo.count=true;
				 this.getXmMenus();
			},
			getParams(params){

				if( this.filters.key){
					params.key="%"+this.filters.key+"%"
				}
				if (this.filters.planStartTimeStart) {
					params.planStartTimeStart = this.filters.planStartTimeStart
				}

				if (this.filters.planStartTimeEnd) {
					params.planStartTimeEnd = this.filters.planStartTimeEnd
				}
				if (this.filters.planEndTimeStart) {
					params.planEndTimeStart = this.filters.planEndTimeStart
				}
				if (this.filters.planEndTimeEnd) {
					params.planEndTimeEnd = this.filters.planEndTimeEnd
				}

				if(this.filters.mmUser){
					params.mmUserid=this.filters.mmUser.userid;
				}
				if(this.filters.iterationFilterType){
					params.iterationFilterType=this.filters.iterationFilterType
					if(params.iterationFilterType==='not-join-any-iteration'){

					}else if(params.iterationFilterType==='join-any-iteration'){

					}else if(params.iterationFilterType==='not-join-curr-iteration'){
						params.filterIterationId=this.filters.iteration.id
					}else if(params.iterationFilterType==='join-curr-iteration'){
						params.filterIterationId=this.filters.iteration.id
					}
					params.ntype="0"
				}else{
					if(this.filters.iteration){
						params.iterationId=this.filters.iteration.id
					}
				}
				if(this.xmIteration && this.xmIteration.id){
					params.linkIterationId=this.xmIteration.id
				}
				if(this.filters.taskFilterType){
					params.taskFilterType=this.filters.taskFilterType

					if(params.taskFilterType==='not-join-curr-project'){
						params.projectId=this.selProject.id
					}
					if(params.taskFilterType==='join-curr-project'){
						params.projectId=this.selProject.id
					}
					params.ntype="0"
				}
				if(this.selProject && this.selProject.id){
					params.linkProjectId=this.selProject.id
				}
				if(this.filters.product){
					params.productId=this.filters.product.id
				}
				if(this.filters.func){
					params.funcId=this.filters.func.id
				}
				if(this.filters.status){
					params.status=this.filters.status
				}

				if(this.filters.dlvl){
					params.dlvl=this.filters.dlvl
				}

				if(this.filters.dtype){
					params.dtype=this.filters.dtype
				}

				if(this.filters.priority){
					params.priority=this.filters.priority
				}

				if(this.filters.source){
					params.source=this.filters.source
				}
				if( this.dateRanger && this.dateRanger.length==2){
					params.ctimeStart=this.dateRanger[0]
					params.ctimeEnd=this.dateRanger[1]
				}
				if(this.filters.tags && this.filters.tags.length>0){
					params.tagIdList=this.filters.tags.map(i=>i.tagId)
				}
				if(this.filters.dclasss){
					params.dclasss=this.filters.dclasss
				}
				if(this.filters.menuId){
					params.menuId=this.filters.menuId
				}
				if(this.filters.productId){
					params.productId=this.filters.productId
				}
				if(this.parentMenu && this.parentMenu.menuId){
					params.pidPathsLike=this.parentMenu.pidPaths
				}
				return params;
			},
			loadXmMenusLazy(tree, treeNode, resolve) {

      			this.maps.set(tree.menuId, { tree, treeNode, resolve }) //储存数据
					var params={pmenuId:tree.menuId}
					params=this.getParams(params);
					this.load.list = true;
					var func=listXmMenuWithState
					if(this.selProject&&this.selProject.id){
						func=listXmMenuWithPlan
					}
					func(params).then(res=>{
						this.load.list = false
						var tips = res.data.tips;
						if(tips.isOk){
							resolve(res.data.data)
						}else{
							resolve([])
						}
					}).catch( err => this.load.list = false );

			},
			//获取列表 XmMenu xm_project_menu
			getXmMenus() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				//this.xmMenus=[]
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}
				if( this.filters.product  && this.filters.product.id){
					params.productId=this.filters.product.id
				}
				params=this.getParams(params);
				let callback= (res)=>{
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmMenus = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}
				this.load.list = true;
				if(!this.selProject){
					listXmMenuWithState(params).then( callback ).catch( err => this.load.list = false );
				}else{
					listXmMenuWithPlan(params).then( callback ).catch( err => this.load.list = false );
				}
			},

			//显示编辑界面 XmMenu xm_project_menu
			showEdit: function ( row,index ) {
				this.editForm =row
				this.editFormVisible = true;
			},
			//显示新增界面 XmMenu xm_project_menu
			showAdd: function (dclass) {
				this.addForm={...this.addFormInit}
				if(this.filters.product && this.filters.product.id){
					this.addForm.productId=this.filters.product.id
					this.addForm.productName=this.filters.product.productName
					this.addForm.dclass=dclass
				}
				if(this.filters.iteration && this.filters.iteration.id){

					this.addForm.productId=this.filters.iteration.productId
					this.addForm.iterationId=this.filters.iteration.id
					this.addForm.iterationName=this.filters.iteration.iterationName
					this.addForm.dclass=dclass

				}
				if(!this.addForm.productId){
					this.$refs.xmProductSelect1.productVisible=true;
					this.$refs.xmProductSelect1.searchXmProducts();
					this.$notify({position:'bottom-left',showClose:true,message: "请先选择一个产品", type: 'warning'});
				}else{
					this.addFormVisible = true;
				}

				//this.addForm=Object.assign({}, this.editForm);
			},
			showSubAdd:function(row){

				this.addForm={...this.addFormInit}
				this.editForm=row
				this.expandRowKeysCpd.push(row.pmenuId);
				this.addForm.productId=row.productId
				if(this.filters.product && row.productId==this.filters.product.id){
					this.addForm.productName=this.filters.product.productName
				}else{
					this.addForm.productName=null;
				}
				if(this.filters.iteration && this.filters.iteration.id){
					this.addForm.productId=this.filters.iteration.productId
					this.addForm.iterationId=this.filters.iteration.id
					this.addForm.iterationName=this.filters.iteration.iterationName
					this.addFormVisible = true;
				}
				this.addFormVisible=true
			},
			showProdcutAdd:function(){
				this.$refs.xmProductMng.showAdd();
			},
			afterAddSubmit(row){
				this.pageInfo.count=true;
				this.xmMenus.push(row);
				if(this.parentMenu){
					this.parentMenu.childrenCnt=this.parentMenu.childrenCnt?this.parentMenu.childrenCnt+1:1;
				}
			},
			afterEditSubmit(row){
				this.editFormVisible=false;
			},
			//选择行xmMenu
			selsChange: function (sels) {
				this.sels = sels;
			},
			onProductSelected:function(product){
				this.filters.product=product
				this.productVisible=false;
				this.xmMenus=[]
				this.getXmMenus()
			},
			onProductClearSelect:function(){
				this.filters.product=null
				this.productVisible=false;
				this.xmMenus=[]
				this.getXmMenus()
			},
			onIterationSelected:function(iteration){
				this.filters.iteration=iteration
			},
			onIterationClearSelect:function(){
				this.filters.iteration=null
			},
			//删除xmMenu
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { menuId: row.menuId };
					delXmMenu(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
 							this.getXmMenus();

						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmMenu
			batchDel: function () {
				if(this.sels.length==0){
					this.$notify({position:'bottom-left',showClose:true,message: "请先选择要删除的需求", type: 'warning'});
					return;
				}
				this.$confirm('确认删除选中的'+this.sels.length+'条数据吗？删除后数据不可恢复', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmMenu(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmMenus();
 						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},

			rowClick: function(row, event, column){
				this.editForm=row
				this.editFormBak=Object.assign({},row)
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
      		},
      handleExport() {
        this.downloadLoading = true
        const pageNum = this.pageInfo.pageNum;
        const header = ['需求名称', '负责人', '总体进度', '描述'];
        const keyList = ['menuName', 'mmUsername', 'finishRate', 'remark'];
        const filename = `需求管理_${this.filters.product.productName}_第${pageNum}页`;
				const data = this.formatJson(keyList, this.xmMenusTreeData);
				import('@/vendor/Export2Excel').then(excel => {
					excel.export_json_to_excel({
						header,
						data,
						filename,
						// autoWidth: this.autoWidth,
						bookType: 'xlsx'
					})
					this.downloadLoading = false
				})
			},
			formatJson(filterVal, jsonData, dataList = []) {
        jsonData.forEach(v => {
          const row = filterVal.map(j => {
            let key = '';
            if (j === 'menuName') {
              return `${v.seqNo}  ${v[j]}`;
            } else if(j == 'finishRate') {
              return `${ (v[j] !== null ? v[j] : 0 )+'%' }`;
            } else {
              return v[j];
            }
          })
        dataList.push(row);
          if (v.children && v.children.length) {
            dataList = this.formatJson(filterVal, v.children, dataList);
          }
        })
        return dataList;
      },

			showImportFromMenuTemplate(row){
				if(!this.filters.product){
					this.$notify.error("请选择产品模板")
					return;
				}
				this.parentMenu=row
				this.menuTemplateVisible=true;
			},
			onSelectedMenuTemplates:function(menuTemplates){

				if(menuTemplates==null || menuTemplates.length==0){
					this.menuTemplateVisible=false;
					return;
				}
				var menuTemplates2=JSON.parse(JSON.stringify(menuTemplates))
				this.load.add=true
				let parents = menuTemplates2.filter(value =>{
					//如果我的上级为空，则我是最上级
					if(value.pmenuId == 'undefined' || value.pmenuId == null  || value.pmenuId == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(menuTemplates2.some(i=>value.pmenuId==i.menuId)){
						return false;
					}else {
						return true
					}

				})
				if(this.parentMenu!=null &&  this.parentMenu!=undefined){
					parents.forEach(i=>i.pmenuId=this.parentMenu.menuId);
				}else{
					parents.forEach(i=>i.pmenuId=null);
				}
				let children = menuTemplates2.filter(value =>{
					if(menuTemplates2.some(i=>value.pmenuId==i.menuId)){
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
							myChildren=children.filter(current=>current.pmenuId===parent.menuId);
						}
						myChildren.forEach((current, index) => {
							 current.pmenuId=newId;
							 var mySubChildren=children.filter(c=>c.pmenuId===current.menuId);
							 translator([current],mySubChildren)
						})
						parent.menuId=newId;
					})
				}

				translator(parents, children)
				menuTemplates2.forEach(i=>{
					i.productId=this.filters.product.id
					i.productName=this.filters.product.productName
				});
				batchAddXmMenu(menuTemplates2).then(res=>{
					this.menuTemplateVisible=false;
					this.load.add=false
					var tips =res.data.tips
					if(tips.isOk){
						this.getXmMenus()
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
				}).catch( err  => this.load.add=false );
			},



			showTaskList(row){
				this.editForm=row
				this.selectTaskVisible=true;
			},

			onSelectedTasks:function(xmTasks){


				if(xmTasks==null || xmTasks.length==0){
					this.$notify.error("请最少选择一个任务进行关联");
					return;
				}

				this.selectTaskVisible=false;
				var params={
					menuId:this.editForm.menuId,
					taskIds:xmTasks.map(i=>i.id)
				}
				batchRelTasksWithMenu(params).then(res=>{
					var tips = res.data.tips
					if(tips.isOk){
						//this.getXmMenus()
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
				});
			},

			showTaskListForMenu(row){
				this.editForm=row
				this.taskListForMenuVisible=true
			},

			loadTasksToXmMenuState: function () {

				if(!this.filters.product ){
					if(!this.filters.iteration){
						this.$notify.warning("请先选择产品或者迭代");
						return;
					}
				}
				this.load.edit=true;
				let params = { productId: ''};
				if(!this.filters.product){
					params.productId=this.filters.iteration.productId
				}else{
					params = { productId: this.filters.product.id };
				}

				loadTasksToXmMenuState(params).then((res) => {
					this.load.edit=false;
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.count=true;
						this.xmMenus=[];
						this.getXmMenus();
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err  => this.load.edit=false );
			},
			onGroupUserSelect(users,option){
				 this.editXmMenuSomeFields(option.data,"mmUserid",users);
			},
			toSelectProduct(){
				this.productVisible=true;
			},
			searchSubMenus(row,index){
				this.pageInfo.count=true;
				this.searchXmMenus();
			},
			clearFiltersTag(tag){
				var index=this.filters.tags.findIndex(i=>i.tagId==tag.tagId)
				this.filters.tags.splice(index,1);
				this.searchXmMenus();
			},
			onTagSelected(tags,option){
				if(option && option.action=='editTagIds'){
					this.editXmMenuSomeFields(option.data,"tagIds",tags)
				}else{
					if (!tags || tags.length == 0) {
						this.filters.tags=[]
					}else{
						this.filters.tags=tags
					}
					this.searchXmMenus();
				}

			},
			showParentMenu(){
				if(this.filters.product && this.filters.product.id){
					if(this.sels.length==0){
						this.$notify({position:'bottom-left',showClose:true,message:'请先选择一个或者多个需求',type:'warning'})
						return;
					}
					this.parentMenuVisible=true;
				}else{
					this.$notify({position:'bottom-left',showClose:true,message:'请先选择产品',type:'warning'})
					return;
				}

			},
			onParentMenuSelected(menu){

				if(!menu||!menu.menuId){
					this.$notify({position:'bottom-left',showClose:true,message:'请先选择一个上级需求',type:'warning'})
					return;
				}
				this.parentMenuVisible=false;
				var params={
					menuIds:this.sels.map(i=>i.menuId),
					pmenuId:menu.menuId
				}
				batchChangeParentMenu(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						this.searchXmMenus();
					}
					this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
				})
			},
			formaterByDicts(row,property,cellValue){
				var property=property
				var dict=null;
				if(property=='source'){
					dict=this.dicts['demandSource']
				}else if(property=='dlvl'){
					dict=this.dicts['demandLvl']
				}else if(property=='dtype'){
					dict=this.dicts['demandType']
				}else if(property=='priority'){
					dict=this.dicts['priority']
				}
				if(!dict){
					return cellValue;
				}else{
					var item=dict.find(i=>i.id==cellValue)
					return item?item.name:cellValue;
				}
			},
			doBatchDelXmIterationMenu(){

				if(!this.filters.iteration||!this.filters.iteration.id){
					this.$notify({position:'bottom-left',showClose:true,message:"请选择一个迭代进行操作",type:'warning'})
					return;
				}
				if(this.sels.length==0){
					this.$notify({position:'bottom-left',showClose:true,message:"请选择一个或者多个需求进行操作",type:'warning'})
					return;
				}
				var params={
					menuIds:this.sels.map(i=>i.menuId),
					iterationId:this.filters.iteration.id
				}
				batchDelXmIterationMenu(params).then(res=>{
					var tips =res.data.tips;
					if(tips.isOk){
						this.searchXmMenus();
					}
					this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
				})
			},
			doBatchAddXmIterationMenu(){
				if(!this.filters.iteration||!this.filters.iteration.id){
					this.$notify({position:'bottom-left',showClose:true,message:"请选择一个迭代进行操作",type:'warning'})
					return;
				}
				if(this.sels.length==0){
					this.$notify({position:'bottom-left',showClose:true,message:"请选择一个或者多个需求进行操作",type:'warning'})
					return;
				}
				var params={
					menuIds:this.sels.map(i=>i.menuId),
					iterationId:this.filters.iteration.id
				}
				batchAddXmIterationMenu(params).then(res=>{
					var tips =res.data.tips;
					if(tips.isOk){
						this.searchXmMenus();
					}
					this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})

				})
			},
			calcMenuLabel(dclass){
				var params={label:'工作项',icon:'',color:''};
				if(dclass==='1'){
					params={label:'史诗',icon:'el-icon-s-promotion',color:'rgb(255, 153, 51)'};
				}else if(dclass==='2'){
					params={label:'特性',icon:'el-icon-s-flag',color:'rgb(0, 153, 51)'};
				}else if(dclass==='3'){
					params={label:'用户故事',icon:'el-icon-document',color:' rgb(79, 140, 255)'};
				}
				return params;
			},
			showFieldTag(row){
				this.editForm=row;
				this.fieldTagVisible=true;
			},
			editXmMenuSomeFields(row,fieldName,$event){
				var params={menuIds:[row.menuId]};
				if(this.sels.length>0){
					if(!this.sels.some(k=>k.menuId==row.menuId)){
						this.$notify({position:'bottom-left',showClose:true,message:'请操作选中的行或者取消选中的行再操作其它行',type:'warning'})
						return;
					}
					params.menuIds=this.sels.map(i=>i.menuId)
				}
				if(fieldName==='iterationId'){
					if($event){
						params[fieldName]=$event.id;
						params.iterationName=$event.iterationName
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
				}else if(fieldName==='mmUserid'){
					params.mmUserid=$event.userid
					params.mmUsername=$event.username
				}else{
					params[fieldName]=$event
				}

				editXmMenuSomeFields(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						if(this.sels.length>0){
							this.getXmMenus();
						}else{
							  Object.assign(row,params)
						}
						Object.assign(this.editFormBak,row)
					}else{
						Object.assign(row,this.editFormBak)
						this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
					}
				})
			},
			cellStyleCalc({row, column, rowIndex, columnIndex}){
				if(this.$refs.tableConfig && this.$refs.tableConfig.columnsConfig.length>0){
					if(this.$refs.tableConfig.columnsConfig.some(i=>i.property==column.property&&i.isShow==false)){
						return "display:none;"
					}else{
						return "";
					}
				}else{
					return "";
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
			formatterMenuStatusDicts: function(cellValue){
				if(!cellValue && cellValue!=='0'){
					return []
				}
				var key="menuStatus";
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
			onEditSomeFields(params){
				Object.assign(this.editForm,params)
			},
			onAddSubMenu(row){
			},

			onFuncSelected(row){
				this.filters.func=row
				this.funcVisible=false;
			},


			copyOne(row,index){

				var params={...row}
				params.menuId=null;
				params.status="0"
				params.menuName=row.menuName+'V'
				addXmMenu(params).then(res=>{
					var tips = res.data.tips
					if(tips.isOk){
						var row2=res.data.data
						this.xmMenus.splice(index+1,0,row2)
						this.pageInfo.total=this.pageInfo.total+1
						this.$message.success("复制成功")
					}else{
						this.$message.error(tips.msg)
					}
				})
			}
		},//end methods
		components: {
		    'xm-menu-add':XmMenuAdd,
			'xm-menu-edit':XmMenuEdit,
			XmProductSelect,
			XmMenuTemplateMng,
			XmMenuRichDetail,
			XmTaskList,
			XmTaskMng,
			XmTaskListForMenu,
			UsersSelect,
		    TagDialog,
			XmEpicFeaturesSelect,
			XmMenuWorkload,
			XmTableConfig,
			XmGroupDialog,
			XmIterationSelect,
			MdpSelectUserXm,
			XmMenuAgileKanbanUser,
			XmFuncSelect,
		    //在下面添加其它组件
		},
		mounted() {
			this.filters.product=this.xmProduct
			if(this.xmProduct && this.xmProduct.id){
				this.productVisible=false;
			}

			if(this.xmIteration && this.xmIteration.id){
				this.filters.iterationFilterType='join-curr-iteration'
				this.filters.iteration=this.xmIteration
			}
			this.$nextTick(() => {
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);
				this.getXmMenus();
          });
		}
	}

</script>

<style lang="scss" scoped>

.align-right{
	float: right;
}
</style>

<style lang="scss">

</style>
