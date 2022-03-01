<template>
	<section class="padding">
		<el-row v-show="batchEditVisible==false"> 
			<span  v-if="batchEditVisible!=true"   >
				<el-checkbox v-model="gstcVisible"  >甘特图</el-checkbox>
				<el-checkbox v-model="filters.milestone" true-label="1" false-label=""  >里程碑</el-checkbox>
				<el-checkbox v-model="filters.isKeyPath" true-label="1" false-label=""  >关键路径</el-checkbox>
				<el-select v-model="filters.phaseStatus" placeholder="计划状态" clearable style="width:100px;">
					<el-option :label="item.name" :value="item.id" v-for="(item,index) in options.xmPhaseStatus" :key="index"></el-option>
				</el-select>
				<el-input   v-model="filters.key" style="width:200px;" placeholder="模糊查询"> 
				</el-input> 
				<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectPhases" icon="el-icon-search">查询</el-button>
				<el-button  class="hidden-md-and-down" v-loading="load.edit" :disabled="load.edit==true" v-on:click="calcKeyPaths" icon="el-icon-s-help">计算关键路径</el-button>
				
				<el-button  class="hidden-md-and-down"  @click="loadTasksToXmProjectPhase(sels)" v-loading="load.edit" icon="el-icon-s-data">由任务汇总进度数据</el-button> 
				<el-button   @click="batchEditVisible=true" v-loading="load.edit" icon="el-icon-edit">批量修改</el-button> 
				<el-button   @click="batchDel" v-loading="load.del" icon="el-icon-delete">删除</el-button> 
			</span> 
			<el-popover
				placement="top-start"
				title="添加计划"
				width="200"
				trigger="hover"> 
				<el-row> 
					
					<el-col :span="24"  style="padding-top:5px;">
						<el-button type="primary"  @click="showMenu" v-loading="load.add" icon="el-icon-plus">由需求批量创建(推荐)</el-button> 
					</el-col>
					<el-col :span="24"  style="padding-top:5px;">
						<el-button   @click="showAdd" v-loading="load.add" icon="el-icon-plus">直接新建</el-button> 
					</el-col>
					<el-col :span="24"  style="padding-top:5px;">
						<el-button   @click="showPhaseTemplate" v-loading="load.add" icon="el-icon-plus">由模板导入计划</el-button> 
					</el-col>
				</el-row>
				<el-button slot="reference" type="primary" v-loading="load.add" icon="el-icon-plus"></el-button> 
			</el-popover>
			<el-popover
					placement="top-start"
					title="更多查询条件或操作"
					width="200"
					trigger="click" >
					<el-row> 
						<el-col  :span="24"  style="padding-top:5px;">
							<el-button  class="hidden-md-and-down" v-loading="load.edit" :disabled="load.edit==true" v-on:click="calcKeyPaths" icon="el-icon-s-help">计算关键路径</el-button>
						</el-col>
						<el-col  :span="24"  style="padding-top:5px;">
							<el-button  type="warning" @click="loadTasksToXmProjectPhase(sels)" v-loading="load.edit" icon="el-icon-s-data">由任务汇总进度数据</el-button> 
						</el-col>    
					</el-row>
					<el-button  slot="reference" icon="el-icon-more"></el-button>
				</el-popover>  
			
		</el-row>
		<el-row class="padding-top hidden-md-and-down"     v-if="batchEditVisible==false && !xmIteration && !xmProduct">  
 					<span style="margin-left:10px;font-size:14px;">项目总预算：</span><el-tag type='success'> {{toFixed(phaseBudgetData.planTotalCost/10000,2)}}万，剩{{toFixed(phaseBudgetData.surplusPlanCostAt/10000,2)}}万</el-tag> 
					<span style="margin-left:10px;font-size:14px;">非人力总预算：</span><el-tag :type="phaseBudgetData.surplusPlanNouserAt>0?'warning':'danger'">{{toFixed(phaseBudgetData.planNouserAt/10000,2)}}万，剩{{toFixed(phaseBudgetData.surplusPlanNouserAt/10000,2)}}万</el-tag>  
					<span style="margin-left:10px;font-size:14px;">内部人力总预算：</span><el-tag  :type="phaseBudgetData.surplusPlanInnerUserAt>0?'warning':'danger'">{{toFixed(phaseBudgetData.planInnerUserAt/10000,2)}}万，剩{{toFixed(phaseBudgetData.surplusPlanInnerUserAt/10000,2)}}万</el-tag>  
					<span style="margin-left:10px;font-size:14px;">外购人力总预算：</span><el-tag  :type="phaseBudgetData.surplusPlanOutUserAt>0?'warning':'danger'">{{toFixed(phaseBudgetData.planOutUserAt/10000,2)}}万，剩{{toFixed(phaseBudgetData.surplusPlanOutUserAt/10000,2)}}万</el-tag>  
					<el-button @click="selectTotalProjectAndPhaseBudgetCost">刷新统计数据</el-button>

 		</el-row> 
 		<el-row  class="padding-top" v-show="batchEditVisible==false"> 
			<!--列表 XmProjectPhase xm_project_phase-->
			<el-table lazy :load="loadXmProjectPhaseLazy" ref="table" :height="tableHeight" v-show="!gstcVisible "  default-expand-all :data="projectPhaseTreeData"  :summary-method="getSummariesForNoBatchEdit"  :show-summary="true"  row-key="id" :tree-props="{children: 'children', hasChildren: 'childrenCnt'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					
				<el-table-column  type="selection"  width="80"> 
				</el-table-column>
				  <el-table-column prop="phaseName" label="计划名称" min-width="150" show-overflow-tooltip> 
					 <template slot-scope="scope">   
						<span>
							<span v-show="scope.row.milestone=='1'">
								<i class="el-icon-star-on"></i>
							</span>
							<span v-show="scope.row.isKeyPath=='1'"> 
								<i class="el-icon-s-help"></i>
							</span>
							<el-link :icon="scope.row.ntype=='1'?'el-icon-folder-opened':''" type="primary" @click="showEdit(scope.row)">{{scope.row.seqNo}} &nbsp;&nbsp;  
							</el-link>
							{{scope.row.phaseName}}  
							<font v-for="item in [calcTaskStateByTime(scope.row.beginDate,scope.row.endDate,scope.row.actRate,scope.phaseStatus)]" :key="item.status"><el-tag :type="item.status">{{item.remark}}</el-tag></font> 
						</span>
					 </template>
				</el-table-column>   
				<el-table-column  prop="mngUsername" label="责任人" width="80" show-overflow-tooltip> 
					<template  slot-scope="scope">
						<el-button type="text" v-if="!scope.row.mngUserid"  v-model="scope.row.mngUsername" @click="groupUserSelectVisible=true" icon="el-icon-setting">去设置</el-button>  
						<el-link v-else type="primary"   @click="groupUserSelectVisible=true">{{scope.row.mngUsername}}</el-link>
					</template>
				</el-table-column>
				<el-table-column  prop="beginDate" label="起止时间" width="120" show-overflow-tooltip>
					<template slot-scope="scope">  
								<font class="hidden-md-and-down" >{{formatDate(scope.row.beginDate)}}&nbsp;~&nbsp;{{formatDate(scope.row.endDate)}}  </font> 
					</template>
				</el-table-column>
				<el-table-column prop="actRate" label="进度" width="100">
					<template slot-scope="scope"> 
							<el-tag :type="scope.row.actRate>=100?'success':'primary'"> {{ (scope.row.actRate!=null?scope.row.actRate:0)+'%'}} </el-tag>  
					</template>
				</el-table-column>
			
				<el-table-column  label="工作量(人时)" width="100"> 
					<el-table-column  prop="phaseBudgetWorkload" label="预计" width="100" >  
					</el-table-column>  
					<el-table-column  prop="phaseActWorkload" label="实际" width="100" >  
					</el-table-column> 
				</el-table-column>
				
				<el-table-column  label="成本(元)" width="100"> 
					<el-table-column  prop="phaseBudgetAt" label="预计" width="100" >  
					</el-table-column>  
					<el-table-column  prop="actCostAt" label="实际" width="100" >  
					</el-table-column> 
				</el-table-column> 
				<el-table-column  prop="phaseStatus" label="计划状态" width="100" >  
					<template slot-scope="scope">
						 <font v-if="options.xmPhaseStatus.some(i=>i.id==scope.row.phaseStatus)">{{options.xmPhaseStatus.find(i=>i.id==scope.row.phaseStatus).name}}</font>
					</template>
				</el-table-column>     
				<el-table-column  prop="bizFlowState" label="审批状态" width="100" >  
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
				<el-table-column    label="操作" width="200" >  
					<template slot-scope="scope">
						<el-popover style="padding-left:10px;" 
							placement="top-start"
							width="250"
							v-if="scope.row.ntype=='1'"
							trigger="click" > 
							<el-row> 
								<el-col :span="24" style="padding-top:5px;">
									<el-button   @click="showSubAdd( scope.row,scope.$index)" icon="el-icon-plus">直接创建子计划</el-button> 
								</el-col>  
								<el-col :span="24" style="padding-top:5px;">
									<el-button  @click="showPhaseTemplate(scope.row)" icon="el-icon-upload2">从模板批量导入子计划</el-button> 
								</el-col> 
								<el-col :span="24" style="padding-top:5px;">
									<el-button  @click="showMenu(scope.row)" icon="el-icon-upload2">由需求创建子计划</el-button> 
								</el-col> 
							</el-row>   
							<el-button type="text"  slot="reference" icon="el-icon-plus">子计划</el-button>
						</el-popover>   
						
						<el-button type="text"  @click="showEdit(scope.row)" icon="el-icon-edit">编辑</el-button> 
						<el-button type="text" :disabled="scope.row.childrenCnt>0"  @click="handleDel(scope.row)" icon="el-icon-delete">删除</el-button>   
							<span v-if="scope.row.ntype!='1'">
								<el-dropdown @command="handleCommand" :hide-on-click="false"> 
									<span class="el-dropdown-link">
										<i class="el-icon-more"></i>
									</span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item icon="el-icon-search"   :command="{type:'showLog',row:scope.row}">日志</el-dropdown-item> 										
  										<el-dropdown-item icon="el-icon-success"   :command="{type:'loadTasksToXmProjectPhase',row:scope.row}">从任务中汇总进度</el-dropdown-item> 
										<el-dropdown-item icon="el-icon-success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_start_approva'}">变更发审(审核通过后起效)</el-dropdown-item> 
										<el-dropdown-item icon="el-icon-success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_delete_approva'}">删除发审(审核通过后删除)</el-dropdown-item>  
									</el-dropdown-menu>
								</el-dropdown> 
							</span>
					</template>
				</el-table-column>  
				
			</el-table>
      		<xm-gantt v-if="gstcVisible && batchEditVisible==false" :tree-data="projectPhaseTreeData" :project-phase="selProject" :columns="ganrrColumns" :useRealTime="false"></xm-gantt>
			
			<el-row>
				<el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[1,2,10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
			</el-row>

			<!--编辑 XmProjectPhase xm_project_phase界面-->
			<el-drawer  title="编辑计划" :visible.sync="editFormVisible" :with-header="false" size="60%"  :close-on-click-modal="false" append-to-body>
				  <xm-project-phase-edit :xm-project-phase="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-phase-edit>
			</el-drawer >
	
			<!--新增 XmProjectPhase xm_project_phase界面-->
			<el-drawer title="新增计划" :visible.sync="addFormVisible" :with-header="false" size="60%"  :close-on-click-modal="false" append-to-body>
				<xm-project-phase-add :parent-project-phase="parentProjectPhase" :xm-project-phase="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit" ></xm-project-phase-add>
			</el-drawer> 
			<!--计划模板-->
			<el-drawer title="计划模板" :visible.sync="phaseTemplateVisible"  size="80%"  :close-on-click-modal="false" append-to-body>
				<xm-project-phase-template-mng  :is-select="true"  :visible="phaseTemplateVisible" @cancel="phaseTemplateVisible=false" @selected-confirm="afterPhaseTemplateSelected" ></xm-project-phase-template-mng>
			</el-drawer> 
			<el-drawer :title="editForm==null?'操作日志':editForm.phaseName+'操作日志'" center   :visible.sync="xmRecordVisible"  size="60%"  :close-on-click-modal="false" append-to-body>
				<xm-record :obj-type="'phase'"  :visible="xmRecordVisible" :project-id="selProject?selProject.id:null" :obj-id="editForm.id"   :simple="1"></xm-record>
			</el-drawer> 
			<el-drawer append-to-body title="选择负责人" :visible.sync="groupUserSelectVisible" size="60%"    :close-on-click-modal="false">
				<xm-project-group-select :visible="groupUserSelectVisible" :sel-project="selProject" :isSelectSingleUser="1" @user-confirm="groupUserSelectConfirm"></xm-project-group-select>
				 
			</el-drawer> 
			<el-drawer append-to-body title="需求选择" :visible.sync="menuVisible" size="60%"    :close-on-click-modal="false">
				<xm-menu-select :visible="menuVisible" :is-select-menu="true" :multi="true"    @menus-selected="onSelectedMenus" ></xm-menu-select>
			</el-drawer>
		</el-row>
		<el-row v-if="batchEditVisible==true">
			<xm-project-phase-batch :sel-project="selProject" @back="batchEditBack"></xm-project-phase-batch>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectPhase,calcKeyPaths, delXmProjectPhase, batchDelXmProjectPhase,batchImportFromTemplate,batchSaveBudget,loadTasksToXmProjectPhase,setPhaseMngUser,selectTotalProjectAndPhaseBudgetCost  } from '@/api/xm/core/xmProjectPhase';
	import  XmProjectPhaseAdd from './XmProjectPhaseAdd';//新增界面
	import  XmProjectPhaseEdit from './XmProjectPhaseEdit';//修改界面 
  import XmGantt from '../components/xm-gantt';
  import  XmProjectPhaseTemplateMng from '@/views/xm/core/xmProjectPhaseTemplate/XmProjectPhaseTemplateMng';//修改界面
	import xmMenuSelect from '../xmMenu/XmMenuSelect';

	import {sn} from '@/common/js/sequence'
	import { mapGetters } from 'vuex'
import XmProjectPhaseBatch from './XmProjectPhaseBatch'; 
import XmProjectGroupSelect from '../xmProjectGroup/XmProjectGroupSelect.vue';

  
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
			projectPhaseTreeData() { 
				return treeTool.translateDataToTree(this.xmProjectPhases,"parentPhaseId","id");
			},
			phaseBudgetData(){ 
				if( this.xmIteration || this.xmProduct){
					return {}
				} 
				var dbData=this.totalProjectAndPhaseBudgetCost;
				var projectPlanTotalCost = this.getFloatValue(dbData.planTotalCost)
				var phaseBudgetAt=this.getFloatValue(dbData.phaseBudgetAt) 
				const total={
					surplusPlanCostAt: projectPlanTotalCost-phaseBudgetAt, 
					surplusPlanInnerUserAt: dbData.planInnerUserAt-dbData.phaseBudgetInnerUserAt,
					surplusPlanOutUserAt: dbData.planOutUserAt-dbData.phaseBudgetOutUserAt,
					surplusPlanNouserAt: dbData.planNouserAt-dbData.phaseBudgetNouserAt, 

					phaseBudgetNouserAt:dbData.phaseBudgetNouserAt,
					phaseBudgetInnerUserAt:dbData.phaseBudgetInnerUserAt,
					phaseBudgetOutUserAt:dbData.phaseBudgetOutUserAt,
					phaseBudgetAt: phaseBudgetAt,
					
					planTotalCost: projectPlanTotalCost, 
					planInnerUserAt: dbData.planInnerUserAt,
					planOutUserAt: dbData.planOutUserAt,
					planNouserAt: dbData.planNouserAt, 

				}; 
				return total;

			}
		},
		props:['selProject','xmIteration','xmProduct'],
		watch:{
			selProject:function(selProject,old){ 
        
				if(!selProject){
					this.xmProjectPhases=[]
				}else{
					if( ( !old && selProject.id) || (old && selProject.id!=old.id)){
						
						this.searchXmProjectPhases();
					}
				}
			},
			xmIteration(){
				this.searchXmProjectPhases()
			},
			xmProduct(){
				this.searchXmProjectPhases()
			}
    },
		data() {
 
			return {
				filters: {
					key: '',
					milestone:'',
					isKeyPath:'',
					phaseStatus:'',
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
					xmPhaseStatus:[
						{id:'0',name:'初始'},
						{id:'1',name:'执行中'},
						{id:'2',name:'完工'},
						{id:'3',name:'关闭'},
						{id:'4',name:'删除中'},
						{id:'5',name:'已删除'},
						{id:'6',name:'暂停'}
					]
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
				menuVisible:false,//由需求自动创建计划
				tableHeight:200,
				pickerOptions: util.pickerOptions('date'),
				gstcVisible:false,
				groupUserSelectVisible:false,//选择负责人
				ganrrColumns: {
				children: 'children',
				name: 'phaseName',
				id: 'id',
				pid: 'parentPhaseId',
				startDate: 'beginDate',
				endDate: 'endDate',
				
				},
				maps:new Map(),
				totalProjectAndPhaseBudgetCost:{},
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
			
			getParams(params){

				if(this.filters.key){
					params.key='%'+this.filters.key+'%'
				}
				if(this.selProject!=null && this.selProject!=undefined){
					params.projectId=this.selProject.id

				}
				if(this.xmIteration){
					params.iterationId=this.xmIteration.id
				}
				if(this.xmProduct){
					params.productId=this.xmProduct.id
				}
				
				if(this.filters.milestone){
					params.milestone=this.filters.milestone
				}
				
				if(this.filters.isKeyPath){
					params.isKeyPath=this.filters.isKeyPath
				}

				if(this.filters.phaseStatus){
					params.phaseStatus=this.filters.phaseStatus
				}
				
				if(!(params.isKeyPath||params.milestone||params.productId||params.iterationId||params.phaseStatus)){
					params.isTop="1"
				}
				return params;
			},
			loadXmProjectPhaseLazy(tree, treeNode, resolve) {    
				this.maps.set(tree.id, { tree, treeNode, resolve }) //储存数据
					var params={parentPhaseId:tree.id}
					params=this.getParams(params);
					params.isTop=""
					this.load.list = true;
					var func=listXmProjectPhase 
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

				params=this.getParams(params) 
				params.withParents="1"
				this.load.list = true;
				listXmProjectPhase(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectPhases = res.data.data;
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectPhase xm_project_phase
			showEdit: function ( row,index ) { 
				this.editForm = row;
				this.editFormVisible = true;
			},
			//显示新增界面 XmProjectPhase xm_project_phase
			showAdd: function () {  
				this.parentProjectPhase=null;
				this.addForm.projectId=this.selProject.id;
				this.addForm.branchId=this.selProject.branchId;
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			
			showSubAdd: function (parentProjectPhase) {   
				var myrow=JSON.parse(JSON.stringify(parentProjectPhase))
				myrow.children=[];
				this.parentProjectPhase=myrow
				this.addForm.projectId=this.selProject.id;
				this.addForm.branchId=this.selProject.branchId;
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(row){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				if(!this.maps.get(row.parentPhaseId)){
					this.searchXmProjectPhases()
				}else{ 
					treeTool.reloadChildren(this.$refs.table,this.maps,row.parentPhaseId,'parentPhaseId',this.loadXmProjectPhaseLazy)
				} 
			},
			afterEditSubmit(row){
				this.editFormVisible=false;  
				if(!this.maps.get(row.parentPhaseId)){
					this.searchXmProjectPhases()
				}else{ 
					treeTool.reloadChildren(this.$refs.table,this.maps,row.parentPhaseId,'parentPhaseId',this.loadXmProjectPhaseLazy)
				} 
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
					i.phaseBudgetAt=0
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
						if( (this.parentProjectPhase && !this.maps.get(this.parentProjectPhase.id))|| !this.parentProjectPhase){
							this.searchXmProjectPhases()
						}else{ 
							treeTool.reloadChildren(this.$refs.table,this.maps,this.parentProjectPhase.id,'parentPhaseId',this.loadXmProjectPhaseLazy)
						} 
					}else{ 
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					} 
				}).catch( err  => this.load.add=false );
			},
			//选择行xmProjectPhase
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProjectPhase
			handleDel: function (row,index) {   
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
							if(   !this.maps.get(row.parentPhaseId)){
								this.searchXmProjectPhases()
							}else{ 
								treeTool.reloadChildren(this.$refs.table,this.maps,row.parentPhaseId,'parentPhaseId',this.loadXmProjectPhaseLazy)
							}  
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProjectPhase
			batchDel: function () { 
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
							var parents=phases.filter(i=>!phases.some(k=>k.id==i.parentPhaseId));
							var isLoadAll=parents.some(i=>i.lvl<=1||!this.maps.get(i.parentPhaseId));
							var needLoadChlidList=parents.filter(i=>i.lvl>1)
							if(isLoadAll){
								this.searchXmProjectPhases()
							}
							if(needLoadChlidList.length>0){
								needLoadChlidList.forEach(i=>{
									if( this.maps.get(i.parentPhaseId)){ 
										treeTool.reloadChildren(this.$refs.table,this.maps,i.parentPhaseId,'parentPhaseId',this.loadXmProjectPhaseLazy)
									} 
								})
							}
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			showPhaseTemplate: function(parentPhase){
				
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
				this.$router.push({path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}}); 
			},  
			handleCommand(command) { 
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
				var params={
					projectId:this.selProject.id,
 				}
				if(phases && phases.length>0){
					params.phaseIds=phases.map(i=>i.id);
				}
				 this.load.edit=true;
				loadTasksToXmProjectPhase(params).then(res=>{
					 this.load.edit=false;
					var tips = res.data.tips
					this.xmProjectPhases=[]
					if(tips.isOk){
						this.getXmProjectPhases()
					}
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'}); 
				})
			},
			calcKeyPaths(){
				var params={
					projectId:this.selProject.id,
 				}
				 this.load.edit=true;
				calcKeyPaths(params).then(res=>{
					 this.load.edit=false;
					var tips = res.data.tips
					if(tips.isOk){
						this.getXmProjectPhases()
					}
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'}); 
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
				var phaseBudgetAt=parseFloat(row.phaseBudgetNouserAt)+parseFloat(row.phaseBudgetInnerUserAt)+parseFloat(row.phaseBudgetOutUserAt)
				var actCostAt=parseFloat(row.actNouserAt)+parseFloat(row.actInnerUserAt)+parseFloat(row.actOutUserAt)

				return {phaseBudgetAt:phaseBudgetAt,actCostAt:actCostAt};
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
				if(this.valueChangeRows.length==0){
					this.$notify({showClose: true, message:"没有改变任何数据，无需保存", type: 'success'});
					return;
				}else {
					if(this.phaseBudgetData.surplusPlanInnerUserAt<0){
						this.$notify({showClose: true, message:"内部人力预算不足，请调整", type: 'error'});
						return;
					}
					if(this.phaseBudgetData.surplusPlanOutUserAt<0){
						this.$notify({showClose: true, message:"外购人力预算不足，请调整", type: 'error'});
						return;
					}
					if(this.phaseBudgetData.surplusPlanNouserAt<0){
						this.$notify({showClose: true, message:"非人力预算不足请调整",type: 'error'});
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
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'}); 
						
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
					if(actRate>=100){
						return {remark:"已完工"+( this.toFixed(this.getDaysBetween(curDate, end)) )+"天",status:'success'};
					}else{ 
						return {remark:"逾期"+( this.toFixed(this.getDaysBetween(curDate, end)) )+"天",status:'danger'};
					}
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
				sums[5]='计 '+budgetWorkload+',实 '+phaseActWorkload+'' 
				sums[6]='计 '+budgetCost.toFixed(0)+',实 '+actCost.toFixed(0)+''

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
				if('add'==opType){
					var subRow=JSON.parse(JSON.stringify(this.addForm));
					subRow.parentPhaseId=null
					subRow.id=sn();
					subRow.seqNo="1"
					subRow.opType=opType

					subRow.projectId=this.selProject.id
					subRow.projectName=this.selProject.name
					subRow.branchId=this.selProject.branchId
					subRow.phaseBudgetAt=0
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
							this.$notify.error("请先删除子元素");
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
						this.$notify.error("只能删除未保存的行");
						return;
					}
					 
				},
			batchEditBack:function(reload){
				if(reload){
					this.batchEditVisible=false;
					this.searchXmProjectPhases();
				}else{
					this.batchEditVisible=false;
				}
			},
			groupUserSelectConfirm:function(users){
				if( users==null || users.length==0 ){
					this.groupUserSelectVisible=false;
					return
				}
				this.editForm.mngUserid=users[0].userid
				this.editForm.mngUsername=users[0].username
				setPhaseMngUser(this.editForm).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){
						this.$notify.success("设置成功"); 
						this.groupUserSelectVisible=false;
					}else{
							this.$notify.error(tips.msg);
					}
				})
			},
			selectTotalProjectAndPhaseBudgetCost(){
				var params={  }
				if(this.selProject && this.selProject.id){
					params.projectId=this.selProject.id
				}
				if(this.xmProduct && this.xmProduct.id){
					params.productId=this.xmProduct.id
				} 
				selectTotalProjectAndPhaseBudgetCost(params ).then(res=>{ 
					var tips = res.data.tips;
					if(tips.isOk){ 
						this.totalProjectAndPhaseBudgetCost=res.data.data;
					}
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
				})
			}
		},//end methods
		components: { 
		    'xm-project-phase-add':XmProjectPhaseAdd,
		    'xm-project-phase-edit':XmProjectPhaseEdit,
			
      XmProjectPhaseTemplateMng,xmMenuSelect,XmGantt,XmProjectPhaseBatch,XmProjectGroupSelect
        //在下面添加其它组件
		},
		mounted() {  
			this.selectTotalProjectAndPhaseBudgetCost();
			this.$nextTick(() => { 
				this.tableHeight =  util.calcTableMaxHeight(this.$refs.table.$el); 
				if(this.selProject){
					this.getXmProjectPhases();
				} 
      });  
			
		}
	}

</script>

<style lang="scss" scoped> 
</style>