<template>
	<section class="padding">
				<el-row class="padding-left padding-right">
					<el-select   v-model="filters.queryScope"  style="width:120px;"  placeholder="产品查询范围" clear>
						<el-option :label="userInfo.branchName+'机构下所有的产品'" value="branchId"></el-option>
						<el-option label="我相关的产品" value="compete"></el-option>
						<el-option label="按产品编号精确查找" value="productId"></el-option>
					</el-select>
					<mdp-select placeholder="状态" item-code="xmProductPstatus" v-model="filters.pstatus"></mdp-select>
					<el-input v-if="filters.queryScope=='productId'" style="width:20%;"  v-model="filters.id"  placeholder="输入产品编号" @keyup.enter.native="searchXmProducts" clearable>
					</el-input>
					<el-input v-if="filters.queryScope!='productId'" v-model="filters.productName" style="width: 20%;" placeholder="名称查询" clearable>
					</el-input>
					<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProducts" icon="el-icon-search">查询</el-button>

					<el-popover
						placement="top-start"
						title="更多查询条件、操作"
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
											查询范围
										</template>
										<el-select  v-model="filters.queryScope" style="width:200px;"   placeholder="产品查询范围">
											<el-option :label="userInfo.branchName+'机构下的产品'" value="branchId"></el-option>
											<el-option label="我相关的产品" value="compete"></el-option>
											<el-option label="按产品编号精确查找" value="productId"></el-option>
										</el-select>
 									</el-descriptions-item>
									<el-descriptions-item v-if="selProject">
										<template slot="label">
											<i class="el-icon-document"></i>
											当前项目
										</template>
										<el-tag v-if="selProject">{{selProject?selProject.name:''}}</el-tag>
									</el-descriptions-item>
									<el-descriptions-item v-if="xmIteration">
										<template slot="label">
											<i class="el-icon-document"></i>
											当前迭代
										</template>
										<el-tag v-if="xmIteration">{{xmIteration.iterationName}}</el-tag>
									</el-descriptions-item>
									<el-descriptions-item>
										<template slot="label">
											<i class="el-icon-document"></i>
											产品经理
										</template>
										<el-tag v-if="filters.pmUser" closable @click="selectFiltersPmUser" @close="clearFiltersPmUser()">{{filters.pmUser.username}}</el-tag>
										<el-button   v-else @click="selectFiltersPmUser()">选责任人</el-button>
										<el-button    @click="setFiltersPmUserAsMySelf()">我的</el-button>
									</el-descriptions-item>
									<el-descriptions-item :span="2">
										<template slot="label">
											<i class="el-icon-watch-1"></i>
											创建时间
										</template>

										<mdp-date-range
												v-model="filters"
												type="daterange"
												start-key="ctimeStart"
												end-key="ctimeEnd"
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
											产品编号
										</template>
										<el-input v-model="filters.id" clearable style="width:100%;"></el-input>
									</el-descriptions-item>
									<el-descriptions-item>
										<template slot="label">
											<i class="el-icon-document"></i>
											产品名称
										</template>
										<el-input v-model="filters.productName" clearable style="width:100%;"></el-input>
									</el-descriptions-item>

									<el-descriptions-item>
										<el-button type="primary" style="float:right;" @click="searchXmProducts" icon="el-icon-search">查询</el-button>
									</el-descriptions-item>
								</el-descriptions>
						<el-button  slot="reference" icon="el-icon-more" id="guider-two"></el-button>
					</el-popover>
					<span style="float:right;">
					<el-popover
							placement="top-start"
							width="450"
							trigger="click" >
							<el-row>
								<el-row>
									<el-badge value="都适用">
									<el-button   @click="showAdd" icon="el-icon-plus">直接添加新产品</el-button>
									</el-badge>
								</el-row>
								<el-row>
									<el-badge value="进阶">
									<el-button type="primary" icon="el-icon-plus" >通过【产品-复制】一键创建新的产品</el-button>
									</el-badge>
								</el-row>
								<el-row>
									<el-badge value="新手">
									<el-button type="warning" @click="templateVisible=!templateVisible" icon="el-icon-plus">通过【模板-复制】一键创建新的产品</el-button>
									</el-badge>
								</el-row>
							</el-row>
 							<el-button type="primary" slot="reference"  icon="el-icon-plus" v-if="!xmIteration" id="guider-one" round>产品</el-button>
					</el-popover>
					</span>
				</el-row>
				<el-row ref="table1">
				<el-row v-show="showType" v-loading="load.list"  :style="{overflowX:'hidden',height:maxTableHeight+'px'}">
					<!--列表 XmProject xm_project-->
					<el-row  v-if="xmProducts.length>0">
						<el-col  v-cloak v-for="(p,i) in xmProducts" :key="i" :xl="6" :lg="8" :md="8" :sm="12" class="project-card">
							<el-card @click.native="intoInfo(p,i)"  shadow="always">
								<div   slot="header" style="display:flex;justify-content: space-between;">
									<div class="project-name">
 										<mdp-select  title="产品状态" item-code="xmProductPstatus" show-style="tag" v-model="p.pstatus" :disabled="true"/>
										{{p.productName}}
										
									</div>
									<el-popover
										placement="top-start"
										title="更多操作"
										width="200"
										trigger="hover">
										<div class="project-id">
											<el-link id="prj-copy-btn" type="primary"  title="通过复制快速创建新产品" @click.stop="onCopyToBtnClick(p)" v-loading="load.add">复制&nbsp;</el-link>
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
											<span class="nums">
												<span class="item-total finish-task">{{p.menuFinishCnt==null?0:p.menuFinishCnt}}</span>
												<span style="margin: 0 .25rem !important;">/</span>
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
												<span class="item-total finish-task">{{p.taskFinishCnt==null?0:p.taskFinishCnt}}</span>
												<span style="margin: 0 .25rem !important;">/</span>
												<span class="item-total total-task">{{p.taskCnt==null?0:p.taskCnt}}</span>
											</span>
											<span class="item-type">任务</span>
										</div>
										<div class="info-task"  title="已关闭 / 总缺陷数 ">
											<span>
												<span class="item-total finish-task">{{p.closedBugs==null?0:p.closedBugs}}</span>
												<span style="margin: 0 .25rem !important;">/</span>
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
									<div class="project-type" title="产品经理">
											<mdp-select-user show-style="tag" v-if="p.pmUserid" :value="p.pmUserid" :init-name="p.pmUsername"  :disabled="true"></mdp-select-user>
											<mdp-select-user show-style="tag" v-else-if="p.admUserid" :value="p.admUserid" :init-name="p.admUsername"  :disabled="true"></mdp-select-user>
										</div>
										<div class="project-period">{{p.startTime?p.startTime.substr(0,10):''}} ~{{p.endTime?p.endTime.substr(0,10):''}}</div>
									<!--<div class="project-period">{{p.startTime.substr(0,10)}} ~{{p.endTime.substr(0,10)}}</div>-->
								</div>
							</el-card>
						</el-col>
					</el-row>
					<el-row  v-if="!load.list && xmProducts.length<=0">
							<el-result icon="info" title="信息提示" subTitle="没有查到相关产品，有可能是您暂时还没有产品，有可能是您无权限查询产品。">
								<template slot="extra">
									<el-row>
										<el-row>
											您可以通过 &nbsp;<el-button   @click="showAdd" icon="el-icon-plus" type="primary" plain>产品</el-button>&nbsp;创建一个新产品
										</el-row>
										<el-row>
											通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain style="margin-bottom:5px;">公共模板</el-button>&nbsp;体验产品的过程。<br/>
										</el-row>
										<el-row>
											通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain style="margin-bottom:5px;">拷贝模板</el-button>&nbsp;快速创建新产品。<br/>
										</el-row>
									</el-row>
								</template>
							</el-result>
					</el-row>
				</el-row>
				<el-row v-show="!showType" class="padding-top">
					<!--列表 XmProduct 产品表-->
					<el-table ref="table"  height="100px" v-adaptive="{bottomOffset:50}" :data="xmProducts" @sort-change="sortChange" highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick" style="width: 100%;" border>
						<el-row slot="empty">
							<el-result icon="info" title="信息提示" subTitle="没有查到相关产品，有可能是您暂时还没有产品，有可能是您无权限查询产品。">
								<template slot="extra">
									<el-row>
										<el-row>
											您可以通过 &nbsp;<el-button   @click="showAdd" icon="el-icon-plus" type="primary" plain>产品</el-button>&nbsp;创建一个新产品
										</el-row>
										<el-row>
											通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain style="margin-bottom:5px;">公共模板</el-button>&nbsp;体验产品的过程。<br/>
										</el-row>
										<el-row>
											通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain style="margin-bottom:5px;">拷贝模板</el-button>&nbsp;快速创建新产品。<br/>
										</el-row>
									</el-row>
								</template>
							</el-result>
						</el-row>
						<el-table-column prop="productName" label="产品名称" min-width="250" sortable  fixed="left">
							<template slot-scope="scope" >
								<el-link id="guider-three" type="primary" @click="intoInfo(scope.row)">{{scope.row.productName}}</el-link>
							</template>
						</el-table-column>
						<el-table-column prop="id" label="产品编码" min-width="150" sortable fixed="left"  show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="pstatus" label="状态" width="100" sortable :formatter="formatPstatus"  fixed="left">
							<template slot-scope="scope">
								<mdp-select show-style="tag" placeholder="状态" item-code="xmProductPstatus" v-model="scope.row.pstatus" effect="dark"></mdp-select>
							</template>
						</el-table-column>
						<el-table-column prop="finishRate" label="进度" width="180" sortable>
							<template slot-scope="scope">
								<div style="display:flex;">
 									<div style="width:3em;">{{ getProgress(scope.row)  }}%</div>
									 <el-button plain circle id="guider-four" type="text" icon="el-icon-video-play" @click.stop="loadTasksToXmProductState( scope.row)"></el-button>

									<el-tag v-if="getPlanRealProgress(scope.row)>0" type="warning" effect="dark">超前{{ getPlanRealProgress(scope.row) }}%</el-tag>
									<el-tag v-else-if="getPlanRealProgress(scope.row)<0" type="danger" effect="dark">落后{{ 0-getPlanRealProgress(scope.row) }}%</el-tag>
									<el-tag v-else-if="getProgress(scope.row)>0" effect="dark" type="success" class="el-icon-check"> </el-tag>
									<el-tag v-else-if="getProgress(scope.row)==0" effect="dark" type="info">未开始 </el-tag>
								</div>

 							</template>
						</el-table-column>
						<el-table-column prop="pmUsername" label="产品经理" width="150" sortable show-overflow-tooltip>
							<template slot-scope="scope">
								<mdp-select-user show-style="tag" v-model="scope.row.pmUserid" :init-name="scope.row.pmUsername" :disabled="true"></mdp-select-user>
							</template>
						</el-table-column>

						<el-table-column prop="menuCnt" label="需求数" width="120" sortable show-overflow-tooltip>
							<template slot-scope="scope">
								<span title=" 已完成 / 总需求数">{{scope.row.menuCnt>0?scope.row.menuFinishCnt+'&nbsp;/&nbsp;'+scope.row.menuCnt:''}}</span>
							</template>
						</el-table-column>

						<el-table-column prop="projectCnt" label="项目数" width="120" sortable show-overflow-tooltip>
							<template slot-scope="scope">
								<span title="实际发生的关联项目数">{{scope.row.projectCnt>0? scope.row.projectCnt:''}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="iterationCnt" label="迭代数" width="120" sortable show-overflow-tooltip>
							<template slot-scope="scope">
								<span title="实际发生的关联迭代数">{{scope.row.iterationCnt>0? scope.row.iterationCnt:''}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="taskCnt" label="任务数" width="120" sortable show-overflow-tooltip>
							<template slot-scope="scope">
								<span title=" 已完成 / 总任务数">{{scope.row.taskCnt>0?scope.row.taskFinishCnt+'&nbsp;/&nbsp;'+scope.row.taskCnt:''}}</span>
							</template>
						</el-table-column>

						<el-table-column prop="bugCnt" label="缺陷数" width="120" sortable show-overflow-tooltip>
							<template slot-scope="scope">
								<span title=" 已关闭 / 总缺陷数 ">{{scope.row.bugCnt>0?scope.row.closedBugs+'&nbsp;/&nbsp;'+scope.row.bugCnt:''}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="budgetWorkload" label="预计工时" width="100"  show-overflow-tooltip sortable></el-table-column>
						<el-table-column prop="actWorkload" label="实际工时" width="100"  show-overflow-tooltip sortable></el-table-column>

						<el-table-column  label="操作" width="150" fixed="right">
							<template slot-scope="scope">
											<el-button v-if="menukey=='myFocus'"  type="primary" @click.stop="focusOrUnfocus(scope.row)" >取消关注</el-button>
											<el-button v-else  type="text" @click.stop="focusOrUnfocus(scope.row)" >关注</el-button>
											<el-button id="guider-five" type="text"  title="通过复制创建新的产品" @click="onCopyToBtnClick(scope.row)" :disabled="load.add" v-loading="load.add">复制</el-button>
 											<el-button  type="text" v-loading="load.del" @click="handleDel(scope.row)" :disabled="load.del==true" icon="el-icon-delete">删除</el-button>
							</template>
						</el-table-column>
					</el-table>

					</el-row>
					</el-row>
					<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[12,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

							<!--编辑 XmProduct 产品表界面-->
					<el-drawer title="编辑产品" :visible.sync="editFormVisible"  size="60%"   append-to-body   :close-on-click-modal="false">
						<xm-product-edit :xm-product="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-product-edit>
					</el-drawer>

					<!--新增 XmProduct 产品表界面-->
					<el-drawer title="新增产品" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
						<xm-product-add  op-type="add" :xm-product="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-product-add>
					</el-drawer>
					<el-drawer title="产品状态数据" :visible.sync="productStateVisible"  width="100%"  append-to-body  :close-on-click-modal="false">
						<xm-product-state-mng :xm-product="editForm" :visible="productStateVisible" @cancel="productStateVisible=false"></xm-product-state-mng>
					</el-drawer>
					<el-drawer
						append-to-body
						title="产品关联的迭代查询"
						:visible.sync="iterationVisible"
						>
							<xm-iteration-mng :simple="true" :visible="iterationVisible" :product-id="editForm.id" ></xm-iteration-mng>
					</el-drawer>

					<el-drawer title="选择员工" :visible.sync="selectFiltersPmUserVisible" size="60%" append-to-body>
						<users-select  @confirm="onFiltersPmUserSelected" ref="usersSelect"></users-select>
					</el-drawer>
					<el-drawer title="选择项目" :visible.sync="projectVisible" size="60%" append-to-body>
						<xm-project-list  @select="onProjectSelected"></xm-project-list>
					</el-drawer>
					<el-drawer title="迭代报告" :visible.sync="iterationSelectVisible" fullscreen  append-to-body  :close-on-click-modal="false">
						<xm-iteration-select show-style="tag" @change2="onXmIterationSelect"></xm-iteration-select>
					</el-drawer>
					<el-dialog
						title="通过复制创建新的模板或者新的产品"
						:visible.sync="copyToVisible"
						width="500" >
						<el-form>
						<el-form-item label="产品名称">
							<el-input v-model="xmProductCopy.productName" placeholder="新的产品名称"></el-input>
						</el-form-item>
						<el-form-item  label="产品代号">
							<el-input v-model="xmProductCopy.code"  placeholder="新的产品代号">
							<template slot="append">
								<el-button type="text" @click="createProductCode">自动生成</el-button>
							</template></el-input>
							<font color="blue" style="font-size:10px;">产品代号为合同上的产品代号，甲乙方共享；产品内部编号为&nbsp;代号-四位随机码</font>
						</el-form-item>
						<el-form-item  label="目标">
							<el-radio v-model="xmProductCopy.isTpl" label="1">复制为新的模板</el-radio>
							<el-radio v-model="xmProductCopy.isTpl" label="0">复制为新的产品</el-radio>
						</el-form-item>
						<el-form-item label="附加任务">
							<el-checkbox v-model="xmProductCopy.copyMenu" true-label="1" false-label="0">拷贝需求列表</el-checkbox>
							<el-checkbox v-model="xmProductCopy.copyPhase" true-label="1" false-label="0">拷贝计划</el-checkbox>
							<el-checkbox v-model="xmProductCopy.copyGroup" true-label="1" false-label="0">拷贝组织架构</el-checkbox>
							<el-checkbox v-model="xmProductCopy.copyGroupUser" true-label="1" false-label="0">拷贝产品组成员</el-checkbox>
						</el-form-item>
						</el-form>
						<span slot="footer" class="dialog-footer">
							<el-button @click="copyToVisible = false">取 消</el-button>
							<el-button type="primary" @click="onCopyToConfirm" :disabled="load.add" v-loading="load.add">确 定</el-button>
						</span>
					</el-dialog>

		<el-dialog :visible.sync="templateVisible" append-to-body width="60%" top="20px">
			<xm-product-tpl-mng @copy="searchXmProducts" :show-type="'simple'" ref="xmProductTplMngRef"></xm-product-tpl-mng>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { listXmProduct,listXmProductWithState, delXmProduct, batchDelXmProduct,copyTo,createProductCode } from '@/api/xm/core/xmProduct';
	import { addXmIterationLink,delXmIterationLink } from '@/api/xm/core/xmIterationLink';
	import { loadTasksToXmProductState } from '@/api/xm/core/xmProductState';
	import  XmProductAdd from './XmProductEdit';//新增界面
	import  XmProductEdit from './XmProductEdit';//修改界面
	import  XmProductTplMng from './XmProductTplMng';//修改界面
	import { mapGetters } from 'vuex'
	import  XmIterationMng from '@/views/xm/core/components/XmIterationSelect';//修改界面
	import  XmProductStateMng from '../xmProductState/XmProductStateMng';//修改界面

	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
	import XmIterationSelect from '@/views/xm/core/components/XmIterationSelect.vue';
	import XmProductSelect from '@/views/xm/core/components/XmProductSelect.vue';
	import { addUserFocus , delUserFocus } from '@/api/mdp/sys/userFocus';


	import Guider from '@/components/Guider/Index.js';
	import store from '@/store'

	export default {
		props:['selProject','xmIteration', 'source'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		watch:{
			selProject:function(){
				this.getXmProducts();
			},
			xmIteration:function(){
				this.getXmProducts();
			}
		},
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 );
			return {
				filters: {
					productName: '',
					queryScope:'compete',//compete/branchId/''/productId
					id:'',//产品编号
					pmUser:null,//产品经理
					pstatus:'',
				},
				xmProducts: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:12,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
					xmProductPstatus:[]
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增xmProduct界面是否显示
				//新增xmProduct界面初始化数据

				addForm: {
					id:'',productName:'',branchId:'',remark:'',version:'',pmUserid:'',pmUsername:'',ctime:'',deptid:'',pstatus:'',startTime:'',endTime:'',deptName:'',admUserid:'',admUsername:'',assUserid:'',assUsername:'',bizProcInstId:'',bizFlowState:'',isTpl:'',baselineId:'',baseTime:'',code:'',pbudgetWorkload:'',pbudgetAmount:'',pmenuBudgetWorkload:'',pmenuBudgetAmount:'',budgetCtrl:'',phaseBudgetCtrl:'',phaseActCtrl:'',locked:'',del:'',ltime:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmProduct界面初始化数据
				editForm: {
					id:'',productName:'',branchId:'',remark:'',version:'',pmUserid:'',pmUsername:'',ctime:'',deptid:'',pstatus:'',startTime:'',endTime:'',deptName:'',admUserid:'',admUsername:'',assUserid:'',assUsername:'',bizProcInstId:'',bizFlowState:'',isTpl:'',baselineId:'',baseTime:'',code:'',pbudgetWorkload:'',pbudgetAmount:'',pmenuBudgetWorkload:'',pmenuBudgetAmount:'',budgetCtrl:'',phaseBudgetCtrl:'',phaseActCtrl:'',locked:'',del:'',ltime:''
				},
				iterationVisible:false,
				iterationSelectVisible:false,
				productStateVisible:false,
				selectFiltersPmUserVisible:false,
				maxTableHeight:300,
				projectVisible:false,
				productSelectVisible:false,
				showType:true,
				xmProductCopy:{
					id:'',productName:'',code:'',isTpl:'',copyMenu:'1',copyPhase:'1',copyGroup:'1',copyGroupUser:'0'
				},
				copyToVisible:false,
				templateVisible:false,
				menukey:'',
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			...util,
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmProducts();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProducts();
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
				this.getXmProducts();
			},
			searchXmProducts(){
				 this.pageInfo.count=true;
				 this.getXmProducts();
			},
			showProductState(row){
				this.editForm=row
				this.productStateVisible=true;
			},
			loadTasksToXmProductState: function (row) {
				this.load.edit=true;

				let params = { productId: row.id };
				loadTasksToXmProductState(params).then((res) => {
					this.load.edit=false;
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.count=true;
						this.getXmProducts();
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err  => this.load.edit=false );
			},
			//获取列表 XmProduct 产品表
			getXmProducts(callBack) {
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
				params.queryScope=this.filters.queryScope
				if(this.filters.queryScope=='productId'){
					if(!this.filters.id){
						this.$notify({position:'bottom-left',showClose:true,message:"您选择了按产品编号精确查找模式，请输入产品编号", type: 'error' });
						return;
					}
					params.id=this.filters.id

				}
				if(this.filters.queryScope=="branchId"){
					params.branchId=this.userInfo.branchId
				}

				params.ctimeStart=this.filters.ctimeStart
				params.ctimeEnd=this.filters.ctimeEnd
				if(this.xmIteration){
					 params.iterationId=this.xmIteration.id
				}
				if(this.filters.productName!==""){
					params.productName=this.filters.productName
				}
				if(this.selProject){
					params.projectId=this.selProject.id
				}
				if(this.filters.pmUser){
					params.pmUserid=this.filters.pmUser.userid
				}
				if(this.filters.pstatus){
					params.pstatus=this.filters.pstatus
				}
				this.load.list = true;
				listXmProductWithState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProducts = res.data.data;
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

			//显示编辑界面 XmProduct 产品表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProduct 产品表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(xmProduct){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				if(this.xmIteration){//如果是迭代试图进入的迭代界面，创建了产品直接添加产品与迭代的关系
					this.onXmProductSelect(xmProduct);
				}else{
					this.getXmProducts();
				}
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getXmProducts()
			},

			//进入info界面
			intoInfo(row) {
				this.editForm = row;
				store.dispatch("setXmProduct",row).then(res=>{
					this.$router.push({ name:'productOverview', query: {productId:row.id} })
				})
				//this.showInfo = true;
			},
			//选择行xmProduct
			selsChange: function (sels) {
				this.sels = sels;
			},

			handleDel: function (row,index) {
				this.$prompt('将同步删除计划、组织、需求等，慎重起见，请输入产品代号:'+row.code, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					 if(value==row.code){
						this.load.del=true;
						let params = { id: row.id };
						delXmProduct(params).then((res) => {
							this.load.del=false;
							var tips=res.data.tips;
							if(tips.isOk){
								this.pageInfo.count=true;
								this.getXmProducts();
							}
							this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
						}).catch( err  => this.load.del=false );
					 }else{
						 this.$notify({position:'bottom-left',showClose:true,message: "产品代号不正确", type: 'error' });
					 }
				}).catch(() => {
					return;
				});
			},
			//批量删除xmProduct
			batchDel: function () {
				var mmSels=this.sels.filter(i=>i.pmUserid!=this.userInfo.userid)
				if(mmSels.length>0){
					this.$notify({position:'bottom-left',showClose:true,message: "只能删除你负责的产品", type: 'error'});
					return false;
				}
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmProduct(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmProducts();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			selectedProduct:function(row){
				this.$emit('selected',row);
			},
			toProjectList:function(product){
				this.$router.push({name:'xmProjectMng',params:{productId:product.id,productName:product.productName}})
			},
			toIterationList:function(product){
				 this.editForm=product
				 this.iterationVisible=true;

			},
			toTaskList:function(product){
				this.$router.push({name:'XmTaskCenterForProduct',params:{productId:product.id,productName:product.productName}})

			},
			/**begin 自定义函数请在下面加**/
			clearFiltersPmUser:function(){
				 this.filters.pmUser=null;
			},
			selectFiltersPmUser(){
				this.selectFiltersPmUserVisible=true;
			},
			onFiltersPmUserSelected(users){
				 if(users && users.length>0){
					 this.filters.pmUser=users[0]
				 }else{
					 this.filters.pmUser=null;
				 }
				 this.selectFiltersPmUserVisible=false;
			},
			setFiltersPmUserAsMySelf(){
				this.filters.pmUser=this.userInfo;
			},
			onProjectSelected(projects){

			},
			onXmIterationSelect(){

			},
			/**end 自定义函数请在上面加**/
			onXmProductSelect:function(row){
				var xmIteration=this.xmIteration;
				var xmProduct=row;
				this.$confirm('确认将产品【'+xmProduct.productName+'】加入迭代计划【'+xmIteration.iterationName+'】吗？', '提示', {
					type: 'warning'
				}).then(()=>{
					addXmIterationLink({iterationId:xmIteration.id,productId:xmProduct.id}).then(res=>{
						var tips =res.data.tips;
						if(tips.isOk){
							this.getXmProducts();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					})
				})
			},
			doDelXmIterationLink(row){
				var xmIteration=this.xmIteration;
				var xmProduct=row;
				this.$confirm('确认将产品【'+xmProduct.productName+'】与迭代【'+xmIteration.iterationName+'】进行脱钩吗？脱钩后，产品下的所有需求将从本迭代计划一并移出。', '提示', {
					type: 'warning'
				}).then(()=>{
					delXmIterationLink({iterationId:xmIteration.id,productId:xmProduct.id}).then(res=>{
						var tips =res.data.tips;
						if(tips.isOk){
							this.getXmProducts();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					})
				})
			},

			onCopyToBtnClick(row){
				this.xmProductCopy.id=row.id;
				this.xmProductCopy.productName=row.productName+"(复制)";
				this.xmProductCopy.isTpl=row.isTpl;
				this.copyToVisible=true;
			},
			onCopyToConfirm(){
				if(!this.xmProductCopy.code){
					this.$notify({position:'bottom-left',showClose:true,message: '产品代号不能为空', type: 'error' });
					return;
				}
				this.load.add=true;
				copyTo(this.xmProductCopy).then(res=>{
					this.load.add=false;
					var tips = res.data.tips;
					if(tips.isOk){
						this.copyToVisible=false;
						if(this.xmProductCopy.isTpl=='0'){
							this.searchXmProducts()
						}else{
							this.$refs.xmProductTplMngRef.searchXmProducts()
						}
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

				})
			},
			formatPstatus(row, column, cellValue, index){
				var item=this.dicts.xmProductPstatus.find(i=>i.id==cellValue)
				if(item){
					return item.name
				}else{
					return cellValue;
				}
			},
			createProductCode(){
				createProductCode({}).then(res=>{
					var tips=res.data.tips;
					if(tips.isOk){
						this.xmProductCopy.code=res.data.data
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
				})
			},
			/**end 自定义函数请在上面加**/
			guiderStart(forceDisplayWhileClosed) { // 初始化引导页
				Guider.startByName('xmProductMng',forceDisplayWhileClosed);
			},

			focusOrUnfocus:function(row){
				if(this.menukey=="myFocus"){
					delUserFocus({pbizId:row.id,bizId:row.id}).then(res=>{
						var tips=res.data.tips;
						if(tips.isOk){
							this.getXmProjects();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					})
				}else{
					addUserFocus({pbizId:row.id,focusType:'3',bizId:row.id,bizName:row.productName}).then(res=>{
						var tips=res.data.tips;
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					})
				}
			},

			getProgress(p){
				var planRate=0;
				if(!p.estimateWorkload||!p.budgetWorkload){
					planRate= 0;
					return planRate;
				}
				planRate= Math.round(p.estimateWorkload/p.budgetWorkload*100);
				return planRate
			},
			getPlanRealProgress(p){
				var planRate=0;
				if(!p.estimateWorkload||!p.budgetWorkload){
					planRate= 0;
					return planRate;
				}
				planRate=  p.estimateWorkload/p.budgetWorkload*100;
				return Math.round((p.finishRate||0)-planRate)
			}
		},//end methods
		components: {
		    'xm-product-add':XmProductAdd,
		    'xm-product-edit':XmProductEdit,
			XmIterationMng,
			XmProductStateMng,
			UsersSelect,
			XmIterationSelect,
			XmProductSelect,
			XmProductTplMng,
			
		    //在下面添加其它组件
		},
		mounted() {

			this.$nextTick(() => {
				this.maxTableHeight = this.source == 'GZT' ? this.maxTableHeight : util.calcTableMaxHeight(this.$refs.table1.$el);
				this.getXmProducts(this.guiderStart);
        	});
		},
	}

</script>

<style lang="scss" scoped>


.more-label-font{
	text-align:center;
	float:left;
	padding-top:5px;
}

.align-right{
	float: right;
}
</style>

<style scoped>

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
	justify-content: space-around;
	margin-top: 8px;
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
