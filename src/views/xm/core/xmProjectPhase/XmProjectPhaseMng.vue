<template>
	<section>
		<el-row  class="app-container" v-if="simple!==true">

			<el-button v-if="batchEditVisible==false" type="success" @click="showAdd" v-loading="load.add">添加计划</el-button>
			<el-button v-if="batchEditVisible==false" type="success" @click="showPhaseTemplate" v-loading="load.add">由模板导入计划</el-button>
			<el-button v-if="batchEditVisible==false" type="success" @click="showMenu" v-loading="load.add">由故事批量创建</el-button>

			<el-button v-if="batchEditVisible==false" type="warning" @click="loadTasksToXmProjectPhase(sels)" v-loading="load.edit">由任务汇总实际数据</el-button> 
			<el-button type="success" v-if="batchEditVisible==false" @click="batchEditVisible=true" v-loading="load.edit">批量修改</el-button>
			<el-button v-if="batchEditVisible==true" type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button>  
			<el-button type="warning" v-if="batchEditVisible==true" @click="saveBatchEdit" v-loading="load.edit">批量保存</el-button>
			
			<el-button  v-if=" batchEditVisible==true" type="success"  @click="handlePopover(null,'add')" >+计划</el-button>
			<el-button type="primary" v-if="batchEditVisible==true" @click="noBatchEdit" v-loading="load.edit">返回</el-button>
			
		</el-row>
		<el-row class="app-container"  v-if="simple!==true">  
 					<span style="margin-left:10px;font-size:14px;">项目总预算：</span><el-tag type='success'> {{toFixed(selProject.planTotalCost/10000,2)}}万，剩{{toFixed(phaseBudgetData.surplusPlanCostAt/10000,2)}}万</el-tag> 
					<span style="margin-left:10px;font-size:14px;">非人力总预算：</span><el-tag :type="phaseBudgetData.surplusPlanNouserAt>0?'warning':'danger'">{{toFixed(selProject.planNouserAt/10000,2)}}万，剩{{toFixed(phaseBudgetData.surplusPlanNouserAt/10000,2)}}万</el-tag>  
					<span style="margin-left:10px;font-size:14px;">内部人力总预算：</span><el-tag  :type="phaseBudgetData.surplusPlanInnerUserAt>0?'warning':'danger'">{{toFixed(selProject.planInnerUserAt/10000,2)}}万，剩{{toFixed(phaseBudgetData.surplusPlanInnerUserAt/10000,2)}}万</el-tag>  
					<span style="margin-left:10px;font-size:14px;">外购人力总预算：</span><el-tag  :type="phaseBudgetData.surplusPlanOutUserAt>0?'warning':'danger'">{{toFixed(selProject.planOutUserAt/10000,2)}}万，剩{{toFixed(phaseBudgetData.surplusPlanOutUserAt/10000,2)}}万</el-tag>  
					<div  v-if="batchEditVisible!=true" style=" float:right;margin-right:10px;" >
					  <el-checkbox v-model="gstcVisible"  >甘特图</el-checkbox>
						<el-input   v-model="filters.key" style="width:200px;" placeholder="模糊查询"></el-input> 
						<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectPhases">查询</el-button>
					</div> 
 		</el-row>
		<el-table ref="selectPhaseTable" v-show="simple==true" :data="projectPhaseTreeData"    :show-summary="false"  row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 			<el-table-column prop="phaseName" label="阶段名称" min-width="160" > 
				 <template slot="header" slot-scope="scope">
					<div>阶段名称 <el-tag size="mini" v-if="editForm.id" closable @close="clearSelectPhase()">{{editForm.seqNo}}&nbsp;{{editForm.phaseName}}</el-tag></div>
				</template>
				<template slot-scope="scope">  
					{{scope.row.seqNo}} &nbsp;&nbsp;{{scope.row.phaseName}}
				</template>
			</el-table-column>   
		</el-table>
		<el-pagination v-show="simple==true"  layout="total,  prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		<el-row class="app-container" v-show="simple!=true"> 
			<!--列表 XmProjectPhase xm_project_phase-->
			<el-table v-show="!gstcVisible && batchEditVisible==false && simple!==true"  default-expand-all :data="projectPhaseTreeData"  :summary-method="getSummariesForNoBatchEdit"  :show-summary="true"  row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column   sortable type="selection" width="40"></el-table-column>
 				<el-table-column prop="phaseName" label="阶段名称" min-width="160" > 
					 <template slot-scope="scope">  
						<el-link @click="showEdit(scope.row)"> {{scope.row.seqNo}} &nbsp;&nbsp;{{scope.row.phaseName}}</el-link>
					 </template>
				</el-table-column>  
				<el-table-column  prop="beginDate" label="起止时间" min-width="150" >
					<template slot-scope="scope">  
								{{formatDate(scope.row.beginDate)}}~{{formatDate(scope.row.endDate)}}  <br/> 
								<div v-for="item in [calcTaskStateByTime(scope.row.beginDate,scope.row.endDate,scope.row.actRate,scope.phaseStatus)]" :key="item.status"><el-tag :type="item.status">{{item.remark}}</el-tag></div> 
					</template>
				</el-table-column>
				<el-table-column prop="actRate" label="进度.状态" width="100">
					<template slot-scope="scope"> 
							<el-tag > {{ (scope.row.actRate!=null?scope.row.actRate:0)+'%'}} </el-tag>  <br/> 
							<el-tag > {{ formateOption('xmPhaseStatus',scope.row.phaseStatus)}} </el-tag>  
					</template>
				</el-table-column>
				<el-table-column  prop="phaseBudgetHours" label="工时.人时" min-width="200" > 
					<template slot-scope="scope">  
						计划：{{getFloatValue(scope.row.phaseBudgetOutUserCnt)+getFloatValue(scope.row.phaseBudgetInnerUserCnt)}}人,{{scope.row.phaseBudgetHours}}小时,{{scope.row.phaseBudgetWorkload}}人时 <br/> 
						实际：{{scope.row.actStaffNu}}人,{{scope.row.actHours}}小时,{{scope.row.phaseActWorkload}}人时
					</template>
				</el-table-column> 
				<el-table-column  prop="phaseBudgetNouserAt" label="成本.元" min-width="300" > 
					<template slot-scope="scope">  
						计划：非人力:{{scope.row.phaseBudgetNouserAt}},内购人力:{{scope.row.phaseBudgetInnerUserAt}},外购人力:{{scope.row.phaseBudgetOutUserAt}} <br/> 
						实际：非人力:{{scope.row.actNouserAt}},内购人力:{{scope.row.actInnerUserAt}},外购人力:{{scope.row.actOutUserAt}}
					</template>
				</el-table-column> 
				<el-table-column  prop="phaseBudgetCostAt" label="成本合计.元" min-width="120" > 
					<template slot-scope="scope">  
						计划：{{scope.row.phaseBudgetCostAt}} <br/> 
						实际：{{scope.row.actCostAt}}
					</template> 
				</el-table-column>     
				<el-table-column  prop="bizFlowState" label="审批状态" min-width="80" >  
					<template slot-scope="scope">
						<el-tooltip  :content="showApprovaInfo(scope.row)" placement="bottom" effect="light">
						<el-tag v-if="scope.row.flowState=='0'|| !scope.row.flowState">未发审</el-tag> 
						<el-tag v-else-if="scope.row.flowState=='1'">审核中</el-tag> 
						<el-tag v-else-if="scope.row.flowState=='2'">已通过</el-tag>
						<el-tag v-else-if="scope.row.flowState=='3'">未通过</el-tag>
						<el-tag v-else-if="scope.row.flowState=='4'">已取消</el-tag> 
						</el-tooltip> 
					</template>
				</el-table-column>
				<el-table-column  prop="remark" label="备注" min-width="80" >  </el-table-column> 
				<el-table-column  label="操作" width="100" fixed="right">
					<template slot-scope="scope"> 
						<el-dropdown @command="handleCommand" :hide-on-click="false">
							<span class="el-dropdown-link">
								更多<i class="el-icon-setting"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item :command="{type:'showSubAdd',data:scope.row}">+子阶段</el-dropdown-item>
								<el-dropdown-item :command="{type:'showPhaseTemplate',data:scope.row}">+从模板批量导入子阶段</el-dropdown-item> 
								<el-dropdown-item :command="{type:'showMenu',data:scope.row}">+由故事创建子阶段</el-dropdown-item> 

								<el-dropdown-item :command="{type:'showEdit',data:scope.row}">编辑</el-dropdown-item>  
								<el-dropdown-item :command="{type:'loadTasksToXmProjectPhase',data:scope.row}" >从任务汇总实际数据</el-dropdown-item>  
								<el-dropdown-item :command="{type:'showLog',data:scope.row}">日志</el-dropdown-item>  
								<el-dropdown-item :command="{type:'handleDel',data:scope.row}" >删除</el-dropdown-item>  
								<el-dropdown-item icon="el-icon-success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_start_approva'}">变更发审(审核通过后起效)</el-dropdown-item> 
								<el-dropdown-item icon="el-icon-success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_delete_approva'}">删除发审(审核通过后删除)</el-dropdown-item>  
							</el-dropdown-menu>
						</el-dropdown> 
							
					</template>
				</el-table-column> 
				
			</el-table>
      <xm-gantt v-if="gstcVisible && batchEditVisible==false" :tree-data="projectPhaseTreeData" :project-phase="selProject" :columns="ganrrColumns" :useRealTime="false"></xm-gantt>

			<!--列表 XmProjectPhase xm_project_phase-->
			<el-table v-show="batchEditVisible==true" class="drag-table" default-expand-all :summary-method="getSummariesForBatchEdit" :data="projectPhaseTreeData"    :show-summary="true"  row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column    type="selection" width="50"></el-table-column>
				<el-table-column  prop="seqNo" label="序号" width="150">
					<template  slot-scope="scope">
						<div style="display:flex;width:100%;"> 
							<el-popover
								placement="top"
								width="400"
								trigger="click">
								<div style="text-align: center; margin: 0">
                  <div :ref="'phase_'+scope.$index" :data-phase-id="scope.row.id"></div>
                  <el-button type="primary" size="mini"   @click="handlePopover(scope.row,'highestPmenuId')">成为顶级节点</el-button> 
									<el-button type="danger" size="mini"   @click="handlePopover(scope.row,'delete')">删除当前行</el-button> 
									<el-button type="success" size="mini"   @click="handlePopover(scope.row,'addSub')">增加子行</el-button> 
								</div>
								<el-button slot="reference" :type="scope.row.opType?'success':'plain'"  size="mini" icon="el-icon-edit" circle></el-button> 
							</el-popover>
							<el-input   style="width:100%;"   v-model="scope.row.seqNo"  @change="fieldChange(scope.row,'seqNo')"></el-input>
						</div>					
					</template>
				</el-table-column>
				<el-table-column prop="phaseName" label="阶段名称"  width="200" >
					<template  slot-scope="scope">
						<el-input    v-model="scope.row.phaseName"    @change="fieldChange(scope.row,'phaseName')"></el-input>  
					</template>
				</el-table-column> 
				<el-table-column  prop="beginDate" label="起始时间"  width="200" >
					<template slot-scope="scope">  
						<div>
							<el-date-picker  style="width:100%;"
								v-model="scope.row.beginDate"
								align="right"
								type="date"
								value-format="yyyy-MM-dd HH:mm:ss"
								format="yyyy-MM-dd"
								placeholder="选择日期"
								:picker-options="pickerOptions" @change="fieldChange(scope.row,'beginDate')">
							</el-date-picker>  
							<br/>
							<el-date-picker  style="width:100%;"
								v-model="scope.row.endDate"
								align="right"
								type="date"
								value-format="yyyy-MM-dd HH:mm:ss"
								format="yyyy-MM-dd"
								placeholder="选择日期"
								:picker-options="pickerOptions" @change="fieldChange(scope.row,'endDate')">
							</el-date-picker>   
						</div>
					</template>
				</el-table-column>
				<el-table-column  prop="phaseBudgetHours" label="预计工作量及成本" min-width="300" >
					<template slot-scope="scope"> 
						<el-row>
							<el-col :span="4">
								工期.小时：<br/>
								<el-input style="width:90%;" v-model="scope.row.phaseBudgetHours" :precision="2" step="8" type="number" @change="fieldChange(scope.row,'phaseBudgetHours')"></el-input>
							</el-col>
							<el-col :span="20">
								<el-row>
									<el-col :span="12">
										内购
										<el-input style="width:80px;"  v-model="scope.row.phaseBudgetInnerUserCnt" :precision="2" step="1" type="number" @change="fieldChange(scope.row,'phaseBudgetInnerUserCnt')"></el-input>人，
 
										共{{(scope.row.phaseBudgetInnerUserCnt*scope.row.phaseBudgetHours).toFixed(0)}}人时，
									</el-col>
									<el-col :span="12">  
										<el-input style="width:80px;"  v-model="scope.row.phaseBudgetInnerUserPrice" :precision="2" step="10" type="number" @change="fieldChange(scope.row,'phaseBudgetInnerUserPrice')"></el-input>元/人时，
 
										共{{(scope.row.phaseBudgetInnerUserCnt*scope.row.phaseBudgetHours*scope.row.phaseBudgetInnerUserPrice).toFixed(0)}}元
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										外购
										<el-input style="width:80px;"  v-model="scope.row.phaseBudgetOutUserCnt" :precision="2" step="1" type="number" @change="fieldChange(scope.row,'phaseBudgetOutUserCnt')"></el-input>人，
 										共{{(scope.row.phaseBudgetOutUserCnt*scope.row.phaseBudgetHours).toFixed(0)}}人时，
									</el-col>
									<el-col :span="12"> 
										<el-input style="width:80px"  v-model="scope.row.phaseBudgetOutUserPrice" :precision="2" step="10" type="number" @change="fieldChange(scope.row,'phaseBudgetOutUserPrice')"></el-input>元/人时，
 
										共{{(scope.row.phaseBudgetOutUserCnt*scope.row.phaseBudgetHours*scope.row.phaseBudgetOutUserPrice).toFixed(0)}}元
									</el-col>
								</el-row>
							</el-col> 
						</el-row>
						
 					</template>
				</el-table-column>  
				 <el-table-column     label="预算合计" width="120" >  
					<template slot-scope="scope">
						{{(scope.row.phaseBudgetInnerUserAt+scope.row.phaseBudgetOutUserAt+scope.row.phaseBudgetNouserAt).toFixed(0)}}元
 					</template>
				 </el-table-column>     
				<el-table-column   prop="remark" label="备注" min-width="100" >  
					<template slot-scope="scope">
						<el-input  v-model="scope.row.remark"  type="textarea"  @change="fieldChange(scope.row,'remark')"></el-input>
 					</template>
				 </el-table-column>  
			</el-table>
      <el-row v-if="gstcVisible">
        <el-pagination v-if="simple!=true"  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[1,2,10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
        <el-pagination v-else  layout="total,  prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
      </el-row>

			<!--编辑 XmProjectPhase xm_project_phase界面-->
			<el-dialog title="编辑计划" :visible.sync="editFormVisible"  width="60%"  :close-on-click-modal="false" append-to-body>
				  <xm-project-phase-edit :xm-project-phase="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-phase-edit>
			</el-dialog>
	
			<!--新增 XmProjectPhase xm_project_phase界面-->
			<el-dialog title="新增计划" :visible.sync="addFormVisible"  width="60%"  :close-on-click-modal="false" append-to-body>
				<xm-project-phase-add :parent-project-phase="parentProjectPhase" :xm-project-phase="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit" ></xm-project-phase-add>
			</el-dialog> 
			<!--阶段模板-->
			<el-dialog title="阶段模板" :visible.sync="phaseTemplateVisible"  width="80%"  :close-on-click-modal="false" append-to-body>
				<xm-project-phase-template-mng  :is-select="true"  :visible="phaseTemplateVisible" @cancel="phaseTemplateVisible=false" @selected-confirm="afterPhaseTemplateSelected" ></xm-project-phase-template-mng>
			</el-dialog> 
			<el-dialog :title="editForm==null?'操作日志':editForm.phaseName+'操作日志'" center   :visible.sync="xmRecordVisible"  width="50%"  :close-on-click-modal="false" append-to-body>
				<xm-record :obj-type="'phase'"  :visible="xmRecordVisible" :project-id="selProject.id" :obj-id="editForm.id"   :simple="1"></xm-record>
			</el-dialog>
			
			<el-dialog append-to-body title="故事选择" :visible.sync="menuVisible" width="80%"    :close-on-click-modal="false">
				<xm-menu-select :visible="menuVisible" :is-select-menu="true" :multi="true"    @menus-selected="onSelectedMenus" ></xm-menu-select>
			</el-dialog>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectPhase, delXmProjectPhase, batchDelXmProjectPhase,batchImportFromTemplate,batchSaveBudget,loadTasksToXmProjectPhase  } from '@/api/xm/core/xmProjectPhase';
	import  XmProjectPhaseAdd from './XmProjectPhaseAdd';//新增界面
	import  XmProjectPhaseEdit from './XmProjectPhaseEdit';//修改界面
  import XmGantt from '../components/xm-gantt';
  import  XmProjectPhaseTemplateMng from '@/views/xm/core/xmProjectPhaseTemplate/XmProjectPhaseTemplateMng';//修改界面
	import xmMenuSelect from '../xmMenu/XmMenuSelect';

	import {sn} from '@/common/js/sequence'
	import { mapGetters } from 'vuex'
  
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
      projectPhaseTreeData() {
        let xmProjectPhases = JSON.parse(JSON.stringify(this.xmProjectPhases || []));
        if (this.valueChangeRows && this.valueChangeRows.length) {
          this.valueChangeRows.forEach(c => {
            var index = xmProjectPhases.findIndex(i=>i.id==c.id);
            const oldRow = JSON.parse(JSON.stringify(xmProjectPhases[index]));
            xmProjectPhases.splice(index,1);
            c.parentPhaseId = oldRow.parentPhaseId;
            xmProjectPhases.push(c);
          })
        }
        
        const projectPhaseTreeData = this.translateDataToTree(xmProjectPhases);
        if (this.batchEditVisible) {
          this.rowDrop();
        }

				 return projectPhaseTreeData;
      },
			phaseBudgetData(){ 
				var rows=this.xmProjectPhases
				var surplusPlanCostAt = this.getFloatValue(this.selProject.planInnerUserAt)+ this.getFloatValue(this.selProject.planOutUserAt)+ this.getFloatValue(this.selProject.planNouserAt)
				var surplusPlanInnerUserAt=this.getFloatValue(this.selProject.planInnerUserAt)
				var surplusPlanOutUserAt=this.getFloatValue(this.selProject.planOutUserAt)
				var surplusPlanNouserAt=this.getFloatValue(this.selProject.planNouserAt) 
				var surplusPlanUserAt=this.getFloatValue(this.selProject.planInnerUserAt)+this.getFloatValue(this.selProject.planOutUserAt)

				const total={
					surplusPlanCostAt: surplusPlanCostAt, 
					surplusPlanInnerUserAt: surplusPlanInnerUserAt,
					surplusPlanOutUserAt: surplusPlanOutUserAt,
					surplusPlanNouserAt: surplusPlanNouserAt,
					surplusPlanUserAt: surplusPlanUserAt,

					phaseBudgetNouserAt:0,
					phaseBudgetInnerUserAt:0,
					phaseBudgetOutUserAt:0,
					phaseBudgetUserAt: 0,

					phaseBudgetInnerUserWorkload:0,
					phaseBudgetOutUserWorkload:0,

					phaseActWorkload:0,
					actInnerUserAt:0,
					actNouserAt:0,
					actOutUserAt:0,



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
					
					total.phaseBudgetNouserAt=total.phaseBudgetNouserAt+this.getFloatValue(row.phaseBudgetNouserAt)
					total.phaseBudgetInnerUserAt=total.phaseBudgetInnerUserAt+this.getFloatValue(row.phaseBudgetInnerUserAt)
					total.phaseBudgetOutUserAt=total.phaseBudgetOutUserAt+this.getFloatValue(row.phaseBudgetOutUserAt)  
 					total.phaseBudgetInnerUserWorkload=total.phaseBudgetInnerUserWorkload+this.getFloatValue(row.phaseBudgetInnerUserWorkload)
					total.phaseBudgetOutUserWorkload=total.phaseBudgetOutUserWorkload+this.getFloatValue(row.phaseBudgetOutUserWorkload)  

					
					total.phaseActWorkload=total.phaseActWorkload+this.getFloatValue(row.phaseActWorkload)   
					total.actInnerUserAt=total.actInnerUserAt+this.getFloatValue(row.actInnerUserAt)   
					total.actNouserAt=total.actNouserAt+this.getFloatValue(row.actNouserAt)   
					total.actOutUserAt=total.actOutUserAt+this.getFloatValue(row.actOutUserAt)  
				})
					total.phaseBudgetUserAt=total.phaseBudgetInnerUserAt+total.phaseBudgetOutUserAt  
					total.surplusPlanCostAt=this.getFloatValue(total.surplusPlanCostAt-total.phaseBudgetNouserAt-total.phaseBudgetUserAt )
					total.surplusPlanInnerUserAt=total.surplusPlanInnerUserAt-total.phaseBudgetInnerUserAt
					total.surplusPlanOutUserAt=total.surplusPlanOutUserAt-total.phaseBudgetOutUserAt
					total.surplusPlanNouserAt=total.surplusPlanNouserAt-total.phaseBudgetNouserAt 
					total.surplusPlanUserAt=total.surplusPlanUserAt-total.phaseBudgetUserAt
				return total;

			}
		},
		props:['selProject','simple'],
		watch:{
			selProject:function(selProject,old){
        console.log('this.selProject==', selProject);
        
				if(!selProject){
					this.xmProjectPhases=[]
				}else{
					if( ( !old && selProject.id) || (old && selProject.id!=old.id)){
						
						this.searchXmProjectPhases();
					}
				}
			}
    },
		data() {
 
			return {
				filters: {
					key: ''
				},
				xmProjectPhases: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:500,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{
					xmPhaseStatus:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProjectPhase界面是否显示
				//新增xmProjectPhase界面初始化数据
				addForm: {
					id:'',phaseName:'',remark:'',parentPhaseId:'',branchId:'',taskType:'kf',planType:'m1',projectId:'',beginDate:'',endDate:'',phaseBudgetHours:'',phaseBudgetStaffNu:'',ctime:'',phaseBudgetNouserAt:'',phaseBudgetInnerUserAt:'',phaseBudgetOutUserAt:'',projectBaselineId:'',bizProcInstId:'',bizFlowState:'',phaseBudgetInnerUserCnt:'',phaseBudgetOutUserCnt:'',seqNo:'',phaseBudgetInnerUserPrice:80,phaseBudgetOutUserPrice:100,phaseBudgetInnerUserWorkload:0,phaseBudgetOutUserWorkload:0
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectPhase界面初始化数据
				editForm: {
					id:'',phaseName:'',remark:'',parentPhaseId:'',branchId:'',projectId:'',beginDate:'',endDate:'',phaseBudgetHours:'',phaseBudgetStaffNu:'',ctime:'',phaseBudgetNouserAt:'',phaseBudgetInnerUserAt:'',phaseBudgetOutUserAt:'',projectBaselineId:'',bizProcInstId:'',bizFlowState:'',phaseBudgetInnerUserCnt:'',phaseBudgetOutUserCnt:'',seqNo:'',phaseBudgetInnerUserPrice:80,phaseBudgetOutUserPrice:100,phaseBudgetInnerUserWorkload:0,phaseBudgetOutUserWorkload:0
				},
				
				editFormInit: {
					id:'',phaseName:'',remark:'',parentPhaseId:'',branchId:'',taskType:'kf',planType:'m1',projectId:'',beginDate:'',endDate:'',phaseBudgetHours:'',phaseBudgetStaffNu:'',ctime:'',phaseBudgetNouserAt:'',phaseBudgetInnerUserAt:'',phaseBudgetOutUserAt:'',projectBaselineId:'',bizProcInstId:'',bizFlowState:'',phaseBudgetInnerUserCnt:'',phaseBudgetOutUserCnt:'',seqNo:'',phaseBudgetInnerUserPrice:80,phaseBudgetOutUserPrice:100,phaseBudgetInnerUserWorkload:0,phaseBudgetOutUserWorkload:0
				},
				parentProjectPhase:null,
				/**begin 自定义属性请在下面加 请加备注**/
				phaseTemplateVisible:false,	
				xmRecordVisible:false,
				valueChangeRows:[],
				batchEditVisible:false,
				menuVisible:false,//由故事自动创建阶段计划
        pickerOptions: util.pickerOptions('date'),
        gstcVisible:false,
        ganrrColumns: {
          children: 'children',
          name: 'phaseName',
          id: 'id',
          pid: 'parentPhaseId',
          startDate: 'beginDate',
          endDate: 'endDate',
        },
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjectPhases();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectPhases();
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
				this.getXmProjectPhases();
			},
			searchXmProjectPhases(){
				 this.pageInfo.count=true; 
				 this.getXmProjectPhases();
			},
			//获取列表 XmProjectPhase xm_project_phase
			getXmProjectPhases() {
				this.valueChangeRows=[]
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
				}else{
					//params.xxx=xxxxx
				}
				if(this.selProject!=null && this.selProject!=undefined){
					params.projectId=this.selProject.id

				}
				this.load.list = true;
				listXmProjectPhase(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectPhases = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectPhase xm_project_phase
			showEdit: function ( row,index ) {
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin') ){
					this.$message({ message: "只有项目经理、小组组长可以操作阶段计划", type: 'error' });
					return; 
				}
				this.editForm = Object.assign({}, row);
				this.editFormVisible = true;
			},
			//显示新增界面 XmProjectPhase xm_project_phase
			showAdd: function () { 
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin') ){
					this.$message({ message: "只有项目经理、小组组长可以操作阶段计划", type: 'error' });
					return; 
				}
				this.parentProjectPhase=null;
				this.addForm.projectId=this.selProject.id;
				this.addForm.branchId=this.selProject.branchId;
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			
			showSubAdd: function (parentProjectPhase) {  
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin') ){
					this.$message({ message: "只有项目经理、小组组长可以操作阶段计划", type: 'error' });
					return; 
				}
				var myrow=JSON.parse(JSON.stringify(parentProjectPhase))
				myrow.children=[];
				this.parentProjectPhase=myrow
				this.addForm.projectId=this.selProject.id;
				this.addForm.branchId=this.selProject.branchId;
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjectPhases();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			afterPhaseTemplateSelected(phaseTemplates){
				if(phaseTemplates==null || phaseTemplates.length==0){
					this.phaseTemplateVisible=false;
					return;
				}
				var phaseTemplates2=JSON.parse(JSON.stringify(phaseTemplates))
				this.load.add=true
				let parents = phaseTemplates2.filter(value =>{
					//如果我的上级为空，则我是最上级
					if(value.parentPhaseId == 'undefined' || value.parentPhaseId == null  || value.parentPhaseId == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(phaseTemplates2.some(i=>value.parentPhaseId==i.id)){
						return false;
					}else {
						return true
					}
				 
				})
				if(this.parentProjectPhase!=null &&  this.parentProjectPhase!=undefined){
					parents.forEach(i=>i.parentPhaseId=this.parentProjectPhase.id);
				}else{
					parents.forEach(i=>i.parentPhaseId=null);
				}
				let children = phaseTemplates2.filter(value =>{
					if(phaseTemplates2.some(i=>value.parentPhaseId==i.id)){
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
							myChildren=children.filter(current=>current.parentPhaseId===parent.id);
						}  
						myChildren.forEach((current, index) => {
							 current.parentPhaseId=newId;
							 var mySubChildren=children.filter(c=>c.parentPhaseId===current.id);
							 translator([current],mySubChildren)
						})
						parent.id=newId;
					})
				}

				translator(parents, children)
				phaseTemplates2.forEach(i=>{
					i.projectId=this.selProject.id
					i.projectName=this.selProject.name
					i.branchId=this.selProject.branchId
					i.phaseBudgetCostAt=0
					i.phaseBudgetNouserAt=0
					i.phaseBudgetInnerUserAt=0
					i.phaseBudgetOutUserAt=0 
					i.phaseBudgetWorkload=0
					i.phaseBudgetStaffNu=0
					i.phaseBudgetHours=160
					i.phaseBudgetInnerUserWorkload=0
					i.phaseBudgetOutUserWorkload=0
					i.phaseBudgetInnerUserPrice=this.selProject.planInnerUserPrice
					i.phaseBudgetOutUserPrice=this.selProject.planOutUserPrice
					i.phaseBudgetOutUserCnt=0;
					i.phaseBudgetInnerUserCnt=0;
					const ctime = new Date();
					var beginDate=new Date();
					const endDate=new Date();
					endDate.setTime(ctime.getTime() + 3600 * 1000 * 24 * 7 *4);//两周后
					i.ctime=util.formatDate.format(ctime,'yyyy-MM-dd HH:mm:ss')
					i.beginDate=util.formatDate.format(beginDate,'yyyy-MM-dd HH:mm:ss')
					i.endDate=util.formatDate.format(endDate,'yyyy-MM-dd HH:mm:ss')
				});
				batchImportFromTemplate(phaseTemplates2).then(res=>{ 
					this.phaseTemplateVisible=false;
					this.load.add=false
					var tips =res.data.tips
					if(tips.isOk){ 
						this.getXmProjectPhases()
					}else{ 
						this.$message({ message: tips.msg, type: 'error' });
					}
				}).catch( err  => this.load.add=false );
			},
			//选择行xmProjectPhase
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProjectPhase
			handleDel: function (row,index) { 
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin') ){
					this.$message({ message: "只有项目经理、小组组长可以操作阶段计划", type: 'error' });
					return; 
				}
				if(!!row.bizFlowState ){
						this.$message({ message:"初始状态的计划可以直接删除，其它状态请发起审核流程进行删除", type: 'error' });
						return;
				}
				
				if(command.data.children && command.data.length>0){
					this.$message({ message: "该计划存在子计划，不允许删除", type: 'error'}); 
					return;
				}
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmProjectPhase(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProjectPhases();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProjectPhase
			batchDel: function () {
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin') ){
					this.$message({ message: "只有项目经理、小组组长可以操作阶段计划", type: 'error' });
					return; 
				}
				var phases=this.sels.filter(i=>{
					if( i.bizFlowState==''|| i.bizFlowState==null || i.bizFlowState==undefined){
						return true;
					}
					if(i.bizFlowState=='0'  || i.bizFlowState=='3' || i.bizFlowState=='3' ){
						return true;
					}
					return false;
				}); 
				var phases=JSON.parse(JSON.stringify(phases))
				phases.forEach(i=>i.children=null)
				this.$confirm('将删除未审核的数据，审批中的数据将保留,确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProjectPhase(phases).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectPhases(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			showPhaseTemplate: function(parentPhase){
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin') ){
					this.$message({ message: "只有项目经理、小组组长可以操作阶段计划", type: 'error' });
					return; 
				}
				this.parentProjectPhase=parentPhase
				this.phaseTemplateVisible=true;
			},
			clearSelectPhase(){ 
				this.editForm=this.editFormInit
				this.$emit('clear-select',null );//  @row-click="rowClick"
			},
			rowClick: function(row, event, column){
				var myrow=JSON.parse(JSON.stringify(row))
				myrow.children=[];
				this.parentProjectPhase=myrow
				this.editForm=myrow;
				this.$emit('row-click',myrow, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			translateDataToTree(data2) { 
				var data=JSON.parse(JSON.stringify(data2));
				let parents = data.filter(value =>{
					//如果我的上级为空，则我是最上级 
					var calcData=this.getRowSum(value);
					value.phaseBudgetCostAt=calcData.phaseBudgetCostAt
					value.actCostAt=calcData.actCostAt
					if(value.parentPhaseId == 'undefined' || value.parentPhaseId == null  || value.parentPhaseId == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.parentPhaseId==i.id)){
						return false;
					}else {
						return true
					}
				 
				}) 
				let children = data.filter(value =>{
					if(data.some(i=>value.parentPhaseId==i.id)){
						return true;
					}else{
						return false;
					} 
				})  
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.parentPhaseId === parent.id) {
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
      getGanttTreeData(treeData, keys) { 
				return this.handleGanttData(treeData, keys)
      },
      handleGanttData(list, keys) {
        let row = [];
        list.forEach(d => {
          let link = {};
          Object.keys(keys).forEach(k => {
            link[k] = d[keys[k]] || null;
          });
          if (d.children && d.children.length) {
            const children = this.handleGanttData(d.children, keys);
            link.children = children;
          }
          row.push(link);
        })
        return row;
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
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin') ){
					this.$message({ message: "只有项目经理、小组组长可以操作阶段计划", type: 'error' });
					return; 
				}
				if(row.bizFlowState=='1'){
					this.$message.error("审核中，不允许重新发起");
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
						this.$message.error("只有状态为初始化的项目可以删除");
						return;
					}
					mainTitle='关于删除项目【'+titleNames+"】的审批"
					mainContext=mainTitle+',删除原因：';
				} else if(bizKey=='xm_project_over_approva'){
					if(row.status!='1'){
						this.$message.error("只有状态为执行中的项目可以进行结项操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】结项的审批"
					mainContext=mainTitle;
					
				} else if(bizKey=='xm_project_restart_approva'){
					if(row.status!='3'){
						this.$message.error("只有状态为暂停的项目可以进行重新启动操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】重新启动的审批"
					mainContext=mainTitle;
				} else if(bizKey=='xm_project_start_approva'){
					if(row.status!='0'){
						this.$message.error("只有状态为初始化的项目可以进行立项审批操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】的立项审批"
					mainContext=mainTitle
				}  else if(bizKey=='xm_project_suspension_approva'){
					if(row.status!='1'){
						this.$message.error("只有状态为执行中的项目可以进行挂起操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】暂停的审批"
					mainContext=mainTitle+'';
				} else if(bizKey=='xm_project_budget_change_approva'){
					if(row.status!='1'){
						this.$message.error("只有状态为执行中的项目可以进行预算变更操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】的预算变更审批"
					mainContext=mainTitle+'';
				} else{
					this.$message.error("暂不支持的业务审批");
					return;
				} 

				let params={ 
					mainContext:mainContext,
					mainTitle:mainTitle,
					bizKey:bizKey,
					bizUrl:bizUrl,
					restUrl:config.getOaBasePath()+"/xm/xmProject/processApprova",
					extVars:extVars,
					flowVars:{
						subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
						branchId:row.branchId,
						projectId:row.id
					},
				}
				let jsonParmas=encodeURIComponent(JSON.stringify(params));//对方要 decodeURIComponent
				this.$router.push({path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}}); 
			},  
			handleCommand(command) { 
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin') ){
					this.$message({ message: "只有项目经理、小组组长可以操作阶段计划", type: 'error' });
					return; 
				}
 				if(command.type=='sendToProcessApprova'){
					this.sendToProcessApprova(command.data,command.bizKey);
				}else if(command.type=='showEdit'){
					this.showEdit(command.data);
				}else if(command.type=='showSubAdd'){
					this.showSubAdd(command.data);
				} else if(command.type=='showPhaseTemplate'){
					this.parentProjectPhase=command.data
					this.showPhaseTemplate(command.data);
				}else if(command.type=='showMenu'){
					this.parentProjectPhase=command.data
					this.showMenu(command.data);
				} else if(command.type=='showLog'){
					this.showLog(command.data);
				} else if(command.type=='handleDel'){
					this.handleDel(command.data);
				}  else if(command.type=='loadTasksToXmProjectPhase'){
					this.loadTasksToXmProjectPhase([command.data]);
				}  
			},
			//从任务中汇总进度/实际费用等数据
			loadTasksToXmProjectPhase:function(phases){

				var phaseIds=phases.map(i=>i.id)
				var params={
					projectId:this.selProject.id,
 				}
				if(phases && phases.length>0){
					params.phaseIds=phases.map(i=>i.id);
				}
				loadTasksToXmProjectPhase(params).then(res=>{
					var tips = res.data.tips
					if(tips.isOk){
						this.getXmProjectPhases()
					}
					this.$message({ message: tips.msg, type: tips.isOk?'success':'error'}); 
				})
			},
			getFloatValue(value,digit){
				if(value==null ||  value=='' || value==undefined){
					value=0;
					return value;
				}
				if(!digit){
					digit=2
				}
				if(typeof( value )=='string'){
					return parseFloat(value);
				}else{
					return value
				}
				
			},
			getRowSum(row){
				if(row.phaseBudgetNouserAt==null ||  row.phaseBudgetNouserAt=='' || row.phaseBudgetNouserAt==undefined){
					row.phaseBudgetNouserAt=0;
				}
				
				if(row.phaseBudgetInnerUserAt==null ||  row.phaseBudgetInnerUserAt=='' || row.phaseBudgetInnerUserAt==undefined){
					row.phaseBudgetInnerUserAt=0;
				}
				
				if(row.phaseBudgetOutUserAt==null ||  row.phaseBudgetOutUserAt=='' || row.phaseBudgetOutUserAt==undefined){
					row.phaseBudgetOutUserAt=0;
				}
				if(row.actNouserAt==null ||  row.actNouserAt=='' || row.actNouserAt==undefined){
					row.actNouserAt=0;
				}
				
				if(row.actInnerUserAt==null ||  row.actInnerUserAt=='' || row.actInnerUserAt==undefined){
					row.actInnerUserAt=0;
				}
				
				if(row.actOutUserAt==null ||  row.actOutUserAt=='' || row.actOutUserAt==undefined){
					row.actOutUserAt=0;
				}
				var phaseBudgetCostAt=parseFloat(row.phaseBudgetNouserAt)+parseFloat(row.phaseBudgetInnerUserAt)+parseFloat(row.phaseBudgetOutUserAt)
				var actCostAt=parseFloat(row.actNouserAt)+parseFloat(row.actInnerUserAt)+parseFloat(row.actOutUserAt)

				return {phaseBudgetCostAt:phaseBudgetCostAt,actCostAt:actCostAt};
			},
			fieldChange:function(row,fieldName, nextReplace){
        if (nextReplace) {
          row.nextReplace = nextReplace;
        }
        console.log('fieldChange--row.opType==', row.opType);
        
        //{{formatDate(scope.row.beginDate)}}~{{formatDate(scope.row.endDate)}}  <br/> 
				if(!row.phaseBudgetInnerUserPrice){
					row.phaseBudgetInnerUserPrice=this.selProject.planInnerUserPrice
				} 
				if(!row.phaseBudgetOutUserPrice){
					row.phaseBudgetOutUserPrice=this.selProject.planOutUserPrice
				}
				if(!row.phaseBudgetInnerUserCnt){
					row.phaseBudgetInnerUserCnt=0
				}
				
				if(!row.phaseBudgetOutUserPrice){
					row.phaseBudgetOutUserPrice=this.selProject.planOutUserPrice
				} 
				if(!row.phaseBudgetOutUserPrice){
					row.phaseBudgetOutUserPrice=this.selProject.planOutUserPrice
				}
				if(!row.phaseBudgetOutUserCnt){
					row.phaseBudgetOutUserCnt=0
				}
				if(fieldName=='beginDate' || fieldName=='endDate'){
					if(row.beginDate && row.endDate){
						
						var start=new Date(row.beginDate);
						var end=new Date(row.endDate);
						var days=this.getDaysBetween(end,start)
						row.phaseBudgetHours=this.getFloatValue(days*8).toFixed(2)
						row.phaseBudgetInnerUserWorkload=row.phaseBudgetHours  * row.phaseBudgetInnerUserCnt
						row.phaseBudgetInnerUserAt=row.phaseBudgetInnerUserWorkload * row.phaseBudgetInnerUserPrice  
						row.phaseBudgetOutUserWorkload=row.phaseBudgetHours  * row.phaseBudgetOutUserCnt
						row.phaseBudgetOutUserAt=row.phaseBudgetOutUserWorkload * row.phaseBudgetOutUserPrice  
						row.phaseBudgetWorkload=row.phaseBudgetInnerUserWorkload+row.phaseBudgetOutUserWorkload 
					}
				}else if(fieldName=='phaseBudgetHours'){ 
						row.phaseBudgetInnerUserWorkload=row.phaseBudgetHours  * row.phaseBudgetInnerUserCnt
						row.phaseBudgetInnerUserAt=row.phaseBudgetInnerUserWorkload * row.phaseBudgetInnerUserPrice  
						row.phaseBudgetOutUserWorkload=row.phaseBudgetHours  * row.phaseBudgetOutUserCnt
						row.phaseBudgetOutUserAt=row.phaseBudgetOutUserWorkload * row.phaseBudgetOutUserPrice  
						row.phaseBudgetWorkload=row.phaseBudgetInnerUserWorkload+row.phaseBudgetOutUserWorkload 
				}else if(fieldName=='phaseBudgetInnerUserPrice' || fieldName=='phaseBudgetInnerUserCnt'){
						row.phaseBudgetInnerUserWorkload=row.phaseBudgetHours  * row.phaseBudgetInnerUserCnt
						row.phaseBudgetInnerUserAt=row.phaseBudgetInnerUserWorkload * row.phaseBudgetInnerUserPrice  
						row.phaseBudgetWorkload=row.phaseBudgetInnerUserWorkload+row.phaseBudgetOutUserWorkload 
				}else if(fieldName=='phaseBudgetOutUserPrice'||fieldName=='phaseBudgetOutUserCnt'){ 
						row.phaseBudgetOutUserWorkload=row.phaseBudgetHours  * row.phaseBudgetOutUserCnt
						row.phaseBudgetOutUserAt=row.phaseBudgetOutUserWorkload * row.phaseBudgetOutUserPrice  
						row.phaseBudgetWorkload=row.phaseBudgetInnerUserWorkload+row.phaseBudgetOutUserWorkload 
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
			saveBatchEdit:function(){
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin') ){
					this.$message({ message: "只有项目经理、小组组长可以操作阶段计划", type: 'error' });
					return; 
				}
				if(this.valueChangeRows.length==0){
					this.$message({ message:"没有改变任何数据，无需保存", type: 'success'});
					return;
				}else {
					if(this.phaseBudgetData.surplusPlanInnerUserAt<0){
						this.$message({ message:"内部人力预算不足，请调整", type: 'error'});
						return;
					}
					if(this.phaseBudgetData.surplusPlanOutUserAt<0){
						this.$message({ message:"外购人力预算不足，请调整", type: 'error'});
						return;
					}
					if(this.phaseBudgetData.surplusPlanNouserAt<0){
						this.$message({ message:"非人力预算不足请调整",type: 'error'});
						return;
					}
					
					this.load.edit=true;
					batchSaveBudget(this.valueChangeRows).then(res=>{ 
						this.load.edit=false;
						var tips =res.data.tips;
						if(tips.isOk){
							this.valueChangeRows=[]
							this.getXmProjectPhases();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'}); 
						
					}).catch(e=>this.load.edit=false);
				}
				
			},
			formatDate(dateStr){
				if(dateStr==null || dateStr==""){
					return "";
				}else{
					return dateStr.substr(0,10);
				}
			},
			noBatchEdit(){
				this.batchEditVisible=false;
				if(this.valueChangeRows.length>0){
					this.valueChangeRows=[];
					this.searchXmProjectPhases();
				}
				
			},
			calcTaskStateByTime(startTime,endTime,actRate,phaseStatus){
				if(startTime==null || startTime=="" || endTime==null || endTime ==""){
					return  {remark:"未配置日期",status:'warning'}
				}
				var curDate=new Date();
				var start=new Date(startTime);
				var end=new Date(endTime);
				if(this.getDaysBetween(curDate, start)<=0){
					return {remark:this.toFixed(this.getDaysBetween(start,curDate))+"天后开始",status:'primary'};
				}else if( this.getDaysBetween(curDate, start) > 0 &&  this.getDaysBetween(curDate, end) <= 0 ){
					return {remark: this.toFixed(this.getDaysBetween(end, curDate))+"天后结束",status:'primary'};
				}else if( this.getDaysBetween(curDate, end) > 0 ){
					return {remark:"逾期"+( this.toFixed(this.getDaysBetween(curDate, end)) )+"天",status:'danger'};
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
			getSummariesForBatchEdit:function(params){
				const { columns, data } = params;
				const sums = [];
				sums[0]=''
				sums[1]='总计'//名字
				sums[2]=''//进度
				sums[3]=''//开始结束时间
				sums[4]=''// 工期 工作量 成本金额
 
				var workload=this.phaseBudgetData.phaseBudgetInnerUserWorkload+this.phaseBudgetData.phaseBudgetOutUserWorkload
				var cost=this.phaseBudgetData.phaseBudgetNouserAt+this.phaseBudgetData.phaseBudgetInnerUserAt+this.phaseBudgetData.phaseBudgetOutUserAt
				sums[4]='工作量:'+workload.toFixed(0)+'人时,预算金额:'+cost.toFixed(0)+'元,'+(cost/10000).toFixed(2)+'万元'
				return sums;
			},
			getSummariesForNoBatchEdit:function(params){
				const { columns, data } = params;
				const sums = [];
				sums[0]=''
				sums[1]=''//
				sums[2]='总计'//名字
				sums[3]=''//时间
				sums[4]=''//进度
				sums[5]=''//工作量 计划、实际
				sums[6]=''// 成本 计划、实际 
				var budgetWorkload=this.phaseBudgetData.phaseBudgetInnerUserWorkload+this.phaseBudgetData.phaseBudgetOutUserWorkload
				
				var phaseActWorkload=this.phaseBudgetData.phaseActWorkload 
				var budgetCost=this.phaseBudgetData.phaseBudgetNouserAt+this.phaseBudgetData.phaseBudgetInnerUserAt+this.phaseBudgetData.phaseBudgetOutUserAt
				var actCost=this.phaseBudgetData.actInnerUserAt+this.phaseBudgetData.actNouserAt+this.phaseBudgetData.actOutUserAt
				sums[5]='预算工作量:'+budgetWorkload+'人时,实际:'+phaseActWorkload+'人时' 
				sums[6]='预算金额:'+budgetCost.toFixed(0)+'元,'+(budgetCost/10000).toFixed(2)+'万元,实际:'+actCost.toFixed(0)+'元,'+(actCost/10000).toFixed(2)+'万元'

				return sums;
			},
			toFixed(floatValue,xsd){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					if(xsd){
						if(typeof(floatValue)=='number'){
							return floatValue.toFixed(xsd)
						}else{
							
							return parseFloat(floatValue).toFixed(xsd);
						}
					}else{
						if(typeof(floatValue)=='number'){
							return floatValue.toFixed(0)
						}else{
							
							return parseFloat(floatValue).toFixed(0);
						}
					}
					
				}
			},
			showLog(row){
				this.editForm=row
				this.xmRecordVisible=true
      },
      // 行拖拽
      rowDrop() {
        const _this = this
        // 被拖动的元素的索引
        let dragged = null;
        // 被拖动的元素的索引
        let draggedIndex = -1;

        // 目标元素
        let target = document.querySelector('.drag-table .el-table__body-wrapper .el-table__body tbody');

        let rows = 0;//行数
        setTimeout(function () {
          rows = target.childElementCount
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
          

          const form = _this.projectPhaseTreeData[draggedIndex];
          const to = _this.projectPhaseTreeData[dragIndex];

          const startId = _this.$refs['phase_'+draggedIndex].dataset.phaseId;
          const endId = _this.$refs['phase_'+dragIndex].dataset.phaseId;
          console.log(`startId:${startId}--endId:${endId}`);

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
        this.xmProjectPhases.forEach(d => {
          dict[d.id] = d.parentPhaseId || '';
        });
        if (!dict[eId]) {
          this.xmProjectPhases.find(d => {
            if (d.id === sId) {
              d.parentPhaseId = eId;
              console.log('更新关系1');
              this.fieldChange(d,'parentPhaseId',true);
            }
          })
        } else {
          const isSynezesis = this.judgePmenuId(dict, sId, dict[eId]);
          if (!isSynezesis) {
            this.xmProjectPhases.find(d => {
              if (d.id === sId) {
                d.parentPhaseId = eId;
                console.log('更新关系2');
                this.fieldChange(d,'parentPhaseId',true);
              }
            })
          } else {
            console.log('形成闭合回路--拖拽不更新');
            
          }
        }
			}, 
			/**end 自定义函数请在上面加**/ 
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
			showMenu:function(parentPhase){
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin') ){
					this.$message({ message: "只有项目经理、小组组长可以操作阶段计划", type: 'error' });
					return; 
				}
				this.parentProjectPhase=parentPhase
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
					i.parentPhaseId=i.pmenuId
					i.phaseName=i.menuName 
				})
				this.afterPhaseTemplateSelected(menus2);
				this.menuVisible=false;
				 
			},
			handlePopover:function(row,opType){
				
				if( !this.roles.some(i=>i.roleid=='projectAdmin') && !this.roles.some(i=>i.roleid=='teamAdmin') ){
					this.$message({ message: "只有项目经理、小组组长可以操作阶段计划", type: 'error' });
					return; 
				}
				if('add'==opType){
					var subRow=JSON.parse(JSON.stringify(this.addForm));
					subRow.parentPhaseId=null
					subRow.id=sn();
					subRow.seqNo="1"
					subRow.opType=opType

					subRow.projectId=this.selProject.id
					subRow.projectName=this.selProject.name
					subRow.branchId=this.selProject.branchId
					subRow.phaseBudgetCostAt=0
					subRow.phaseBudgetNouserAt=0
					subRow.phaseBudgetInnerUserAt=0
					subRow.phaseBudgetOutUserAt=0 
					subRow.phaseBudgetWorkload=0
					subRow.phaseBudgetStaffNu=0
					subRow.phaseBudgetHours=160
					subRow.phaseBudgetInnerUserWorkload=0
					subRow.phaseBudgetOutUserWorkload=0
					subRow.phaseBudgetInnerUserPrice=this.selProject.planInnerUserPrice
					subRow.phaseBudgetOutUserPrice=this.selProject.planOutUserPrice
					subRow.phaseBudgetOutUserCnt=0;
					subRow.phaseBudgetInnerUserCnt=0;
					const ctime = new Date();
					var beginDate=new Date();
					const endDate=new Date();
					endDate.setTime(ctime.getTime() + 3600 * 1000 * 24 * 7 *4);//两周后
					subRow.ctime=util.formatDate.format(ctime,'yyyy-MM-dd HH:mm:ss')
					subRow.beginDate=util.formatDate.format(beginDate,'yyyy-MM-dd HH:mm:ss')
					subRow.endDate=util.formatDate.format(endDate,'yyyy-MM-dd HH:mm:ss')

					this.fieldChange(subRow,'seqNo');
					this.xmProjectPhases.unshift(subRow);
				}else if('addSub'==opType){
					var subRow=JSON.parse(JSON.stringify(row));
					subRow.children=[];
					subRow.parentPhaseId=row.id
					subRow.id=sn();
					subRow.seqNo=row.seqNo+".1"
					subRow.opType=opType
					this.fieldChange(subRow,'seqNo');
					this.xmProjectPhases.unshift(subRow);
				}else if('delete'==opType){
					if(row.opType && (row.opType=='addSub' || row.opType=='add')){
						if(row.children && row.children.length>0){
							this.$message.error("请先删除子元素");
							return;
						}else{ 

							var index=this.xmProjectPhases.findIndex(i=>i.id==row.id)
							var indexValueChanges=this.valueChangeRows.findIndex(i=>i.id==row.id)
							this.valueChangeRows.splice(indexValueChanges,1);
							this.xmProjectPhases.splice(index,1);
            }
            }
          }else if ('highestPmenuId' === opType) {  
            if (row.id) {
              this.xmProjectPhases.find(d => {
                if (d.id === row.id) { 
                  d.parentPhaseId = '';
                  this.fieldChange(d,'seqNo', true); 
                }
              });
            }
					}else{
						this.$message.error("只能删除未保存的行");
						return;
					}
					 
				}
		},//end methods
		components: { 
		    'xm-project-phase-add':XmProjectPhaseAdd,
		    'xm-project-phase-edit':XmProjectPhaseEdit,
			
      XmProjectPhaseTemplateMng,xmMenuSelect,XmGantt
        //在下面添加其它组件
		},
		mounted() { 
      console.log('mounted--his.selProject==', this.selProject);
      
			this.$nextTick(() => {
				if(this.selProject){
					this.getXmProjectPhases();
				}
				
				listOption([
					{categoryId:'all',itemCode:'xmPhaseStatus'} 
				]).then(res=>{
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