<template>
	<section class="padding">
		<el-row v-show="batchEditVisible==false"> 
			<span  v-if="batchEditVisible!=true"   >
				<el-checkbox v-model="gstcVisible"  >甘特图</el-checkbox>
				<el-checkbox v-model="filters.milestone" true-label="1" false-label=""  >里程碑</el-checkbox>
				<el-checkbox v-model="filters.isKeyPath" true-label="1" false-label=""  >关键路径</el-checkbox>
				<el-select v-model="filters.phaseStatus" placeholder="计划状态" clearable style="width:100px;">
					<el-option :label="item.name" :value="item.id" v-for="(item,index) in dicts.xmPhaseStatus" :key="index"></el-option>
				</el-select>
				<el-input   v-model="filters.key" style="width:200px;" placeholder="模糊查询"> 
				</el-input> 
				<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmPhases" icon="el-icon-search">查询</el-button>
				<el-button  class="hidden-md-and-down" v-loading="load.edit" :disabled="load.edit==true" v-on:click="calcKeyPaths" icon="el-icon-s-help">计算关键路径</el-button>
				
				<el-button  class="hidden-md-and-down"  @click="loadTasksToXmPhase(sels)" v-loading="load.edit" icon="el-icon-s-data">由任务汇总进度数据</el-button> 
				<el-button   @click="batchEditVisible=true" v-loading="load.edit" icon="el-icon-edit">批量修改</el-button> 
				<el-button type="danger"  @click="batchDel" v-loading="load.del" icon="el-icon-delete">删除</el-button> 
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
						
						<el-select  v-model="filters.taskFilterType" placeholder="是否分配任务" clearable style="width: 140px;">
							<el-option   value="not-join"  label="未分配任何任务的计划"></el-option>  
							<el-option   value="join"  label="已分配任务的计划"></el-option>  
						</el-select>  
						<el-col  :span="24"  style="padding-top:5px;">
							<el-button  class="hidden-md-and-down" v-loading="load.edit" :disabled="load.edit==true" v-on:click="calcKeyPaths" icon="el-icon-s-help">计算关键路径</el-button>
						</el-col>
						<el-col  :span="24"  style="padding-top:5px;">
							<el-button  type="warning" @click="loadTasksToXmPhase(sels)" v-loading="load.edit" icon="el-icon-s-data">由任务汇总进度数据</el-button> 
						</el-col>    
					</el-row>
					<el-button  slot="reference" icon="el-icon-more"></el-button>
				</el-popover>  
			
		</el-row>
		<el-row class="padding-top hidden-md-and-down"     v-if="batchEditVisible==false && !xmIteration && !xmProduct">  
 					<span style="margin-left:10px;font-size:14px;">项目总预算：</span><el-tag type='success'> {{toFixed(budgetData.planTotalCost/10000,2)}}万，剩{{toFixed(budgetData.surplusPlanCostAt/10000,2)}}万</el-tag> 
					<span style="margin-left:10px;font-size:14px;">非人力总预算：</span><el-tag :type="budgetData.surplusPlanNouserAt>0?'warning':'danger'">{{toFixed(budgetData.planNouserAt/10000,2)}}万，剩{{toFixed(budgetData.surplusPlanNouserAt/10000,2)}}万</el-tag>  
					<span style="margin-left:10px;font-size:14px;">内部人力总预算：</span><el-tag  :type="budgetData.surplusPlanIuserAt>0?'warning':'danger'">{{toFixed(budgetData.planIuserAt/10000,2)}}万，剩{{toFixed(budgetData.surplusPlanIuserAt/10000,2)}}万</el-tag>  
					<span style="margin-left:10px;font-size:14px;">外购人力总预算：</span><el-tag  :type="budgetData.surplusPlanOuserAt>0?'warning':'danger'">{{toFixed(budgetData.planOuserAt/10000,2)}}万，剩{{toFixed(budgetData.surplusPlanOuserAt/10000,2)}}万</el-tag>  
					<el-button @click="selectTotalProjectAndPhaseBudgetCost">刷新统计数据</el-button>

 		</el-row> 
 		<el-row  class="padding-top" v-show="batchEditVisible==false"> 
			<!--列表 XmPhase xm_project_phase-->
			<el-table lazy :load="loadXmPhaseLazy" ref="table" :height="tableHeight" v-show="!gstcVisible "  default-expand-all :data="projectPhaseTreeData"  :summary-method="getSummariesForNoBatchEdit"  :show-summary="true"  row-key="id" :tree-props="{children: 'children', hasChildren: 'childrenCnt'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					
				<el-table-column  type="selection"  width="50"> 
				</el-table-column>
				<el-table-column  type="index"  width="50"> 
				</el-table-column>
				  <el-table-column prop="name" label="计划名称" min-width="150" show-overflow-tooltip> 
					 <template slot-scope="scope">   
						<span class="vlink"    @click="showEdit(scope.row)">
							<span v-show="scope.row.milestone=='1'">
								<i class="el-icon-star-on"></i>
							</span>
							<span v-show="scope.row.isKeyPath=='1'"> 
								<i class="el-icon-s-help"></i>
							</span>
							{{scope.row.seqNo}} &nbsp;  
								{{scope.row.name}}  
								<font v-for="item in [calcTaskStateByTime(scope.row.beginDate,scope.row.endDate,scope.row.actRate,scope.phaseStatus)]" :key="item.status"><el-tag :type="item.status">{{item.remark}}</el-tag></font> 
						</span>
					 </template>
				</el-table-column>   
				<el-table-column  prop="mngUsername" label="责任人" width="80" show-overflow-tooltip> 
					<template  slot-scope="scope">
						<el-link type="primary" title="还没设置负责人，点击去设置" v-if="!scope.row.mngUserid"  v-model="scope.row.mngUsername" @click="groupUserSelectVisible=true" icon="el-icon-setting">去设置</el-link>  
						<el-link v-else    @click="groupUserSelectVisible=true">{{scope.row.mngUsername}}</el-link>
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
					<el-table-column  prop="budgetWorkload" label="预计" width="100" >  
					</el-table-column>  
					<el-table-column  prop="actWorkload" label="实际" width="100" >  
					</el-table-column> 
				</el-table-column>
				
				<el-table-column  label="成本(元)" width="100"> 
					<el-table-column  prop="budgetAt" label="预计" width="100" >  
					</el-table-column>  
					<el-table-column  prop="actCostAt" label="实际" width="100" >  
					</el-table-column> 
				</el-table-column> 
				<el-table-column  prop="phaseStatus" label="计划状态" width="100" >  
					<template slot-scope="scope">
						 <font v-if="dicts.xmPhaseStatus.some(i=>i.id==scope.row.phaseStatus)">{{dicts.xmPhaseStatus.find(i=>i.id==scope.row.phaseStatus).name}}</font>
					</template>
				</el-table-column>     
				<el-table-column    label="操作" width="200" >  
					<template slot-scope="scope">
						<el-popover style="padding-left:10px;" 
							placement="top-start"
							width="250" 
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
							<span v-if="scope.row.ntype!='1'">
								<el-dropdown @command="handleCommand" :hide-on-click="false">  
									<span class="el-dropdown-link">
										更多<i class="el-icon-arrow-down el-icon--right"></i>
									</span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item icon="el-icon-edit"   :command="{type:'showTaskForBatchRelTasksWithPhase',row:scope.row}">批量关联任务</el-dropdown-item>	
										<el-dropdown-item icon="el-icon-search"   :command="{type:'showLog',row:scope.row}">日志</el-dropdown-item> 									
  										<el-dropdown-item icon="el-icon-success"   :command="{type:'loadTasksToXmPhase',row:scope.row}">从任务中汇总进度</el-dropdown-item> 
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

			<!--编辑 XmPhase xm_project_phase界面-->
			<el-drawer  title="编辑计划" :visible.sync="editFormVisible"  size="60%"  :close-on-click-modal="false" append-to-body>
				  <xm-phase-edit :xm-phase="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-phase-edit>
			</el-drawer >
	
			<!--新增 XmPhase xm_project_phase界面-->
			<el-drawer title="新增计划" :visible.sync="addFormVisible"  size="60%"  :close-on-click-modal="false" append-to-body>
				<xm-phase-add :parent-project-phase="parentProjectPhase" :xm-phase="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit" ></xm-phase-add>
			</el-drawer> 
			<!--计划模板-->
			<el-drawer title="计划模板" :visible.sync="phaseTemplateVisible"  size="80%"  :close-on-click-modal="false" append-to-body>
				<xm-phase-template-mng  :is-select="true"  :visible="phaseTemplateVisible" @cancel="phaseTemplateVisible=false" @selected-confirm="afterPhaseTemplateSelected" ></xm-phase-template-mng>
			</el-drawer> 
			<el-drawer :title="editForm==null?'操作日志':editForm.name+'操作日志'" center   :visible.sync="xmRecordVisible"  size="60%"  :close-on-click-modal="false" append-to-body>
				<xm-record :obj-type="'phase'"  :visible="xmRecordVisible" :project-id="selProject?selProject.id:null" :obj-id="editForm.id"   :simple="1"></xm-record>
			</el-drawer> 
			<el-drawer append-to-body title="选择负责人" :visible.sync="groupUserSelectVisible" size="60%"    :close-on-click-modal="false">
				<xm-group-select :visible="groupUserSelectVisible" :sel-project="selProject" :isSelectSingleUser="1" @user-confirm="groupUserSelectConfirm"></xm-group-select>
				 
			</el-drawer> 
			<el-drawer append-to-body title="需求选择" :visible.sync="menuVisible" size="60%"    :close-on-click-modal="false">
				<xm-menu-select :visible="menuVisible" :is-select-menu="true" :multi="true"    @menus-selected="onSelectedMenus" ></xm-menu-select>
			</el-drawer>
			
			<el-drawer append-to-body title="任务选择" :visible.sync="taskVisible" size="80%"    :close-on-click-modal="false">
				<xm-task-list :visible="taskVisible"  :isMultiSelect="true" :sel-project="selProject"    @tasks-selected="onSelectedTasks" ></xm-task-list>
			</el-drawer>
		</el-row>
		<el-row v-if="batchEditVisible==true">
			<xm-phase-batch :sel-project="selProject" @back="batchEditBack"></xm-phase-batch>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { batchRelTasksWithPhase  } from '@/api/xm/core/xmTask';

	import { listXmPhase,calcKeyPaths, delXmPhase, batchDelXmPhase,batchImportFromTemplate,batchSaveBudget,loadTasksToXmPhase,setPhaseMngUser,selectTotalProjectAndPhaseBudgetCost  } from '@/api/xm/core/xmPhase';
	import  XmPhaseAdd from './XmPhaseAdd';//新增界面
	import  XmPhaseEdit from './XmPhaseEdit';//修改界面 
  import XmGantt from '../components/xm-gantt';
  import  XmPhaseTemplateMng from '@/views/xm/core/xmPhaseTemplate/XmPhaseTemplateMng';//修改界面
	import xmMenuSelect from '../xmMenu/XmMenuSelect';

	import {sn} from '@/common/js/sequence'
	import { mapGetters } from 'vuex'
import XmPhaseBatch from './XmPhaseBatch'; 
import XmGroupSelect from '../xmGroup/XmGroupSelect.vue';
import XmTaskList from '../xmTask/XmTaskList.vue';

  
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
			projectPhaseTreeData() { 
				return treeTool.translateDataToTree(this.xmPhases,"parentPhaseId","id");
			},
			budgetData(){ 
				if( this.xmIteration || this.xmProduct){
					return {}
				} 
				var dbData=this.totalProjectAndPhaseBudgetCost;
				var projectPlanTotalCost = this.getFloatValue(dbData.planTotalCost)
				var budgetAt=this.getFloatValue(dbData.budgetAt) 
				const total={
					surplusPlanCostAt: projectPlanTotalCost-budgetAt, 
					surplusPlanIuserAt: dbData.planIuserAt-dbData.budgetIuserAt,
					surplusPlanOuserAt: dbData.planOuserAt-dbData.budgetOuserAt,
					surplusPlanNouserAt: dbData.planNouserAt-dbData.budgetNouserAt, 

					budgetNouserAt:dbData.budgetNouserAt,
					budgetIuserAt:dbData.budgetIuserAt,
					budgetOuserAt:dbData.budgetOuserAt,
					budgetAt: budgetAt,
					
					planTotalCost: projectPlanTotalCost, 
					planIuserAt: dbData.planIuserAt,
					planOuserAt: dbData.planOuserAt,
					planNouserAt: dbData.planNouserAt, 

				}; 
				return total;

			}
		},
		props:['selProject','xmIteration','xmProduct'],
		watch:{
			selProject:function(selProject,old){ 
        
				if(!selProject){
					this.xmPhases=[]
				}else{
					if( ( !old && selProject.id) || (old && selProject.id!=old.id)){
						
						this.searchXmPhases();
					}
				}
			},
			xmIteration(){
				this.searchXmPhases()
			},
			xmProduct(){
				this.searchXmPhases()
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
				xmPhases: [],//查询结果
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
				dicts:{  
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
				
				addFormVisible: false,//新增xmPhase界面是否显示
				//新增xmPhase界面初始化数据
				addForm: {
					id:'',name:'',remark:'',parentPhaseId:'',branchId:'',taskType:'kf',planType:'m1',projectId:'',beginDate:'',endDate:'',budgetHours:'',budgetStaffNu:'',ctime:'',budgetNouserAt:'',budgetIuserAt:'',budgetOuserAt:'',baselineId:'',bizProcInstId:'',bizFlowState:'',budgetIuserCnt:'',budgetOuserCnt:'',seqNo:'',budgetIuserPrice:80,budgetOuserPrice:100,budgetIuserWorkload:0,budgetOuserWorkload:0
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmPhase界面初始化数据
				editForm: {
					id:'',name:'',remark:'',parentPhaseId:'',branchId:'',projectId:'',beginDate:'',endDate:'',budgetHours:'',budgetStaffNu:'',ctime:'',budgetNouserAt:'',budgetIuserAt:'',budgetOuserAt:'',baselineId:'',bizProcInstId:'',bizFlowState:'',budgetIuserCnt:'',budgetOuserCnt:'',seqNo:'',budgetIuserPrice:80,budgetOuserPrice:100,budgetIuserWorkload:0,budgetOuserWorkload:0
				},
				
				editFormInit: {
					id:'',name:'',remark:'',parentPhaseId:'',branchId:'',taskType:'kf',planType:'m1',projectId:'',beginDate:'',endDate:'',budgetHours:'',budgetStaffNu:'',ctime:'',budgetNouserAt:'',budgetIuserAt:'',budgetOuserAt:'',baselineId:'',bizProcInstId:'',bizFlowState:'',budgetIuserCnt:'',budgetOuserCnt:'',seqNo:'',budgetIuserPrice:80,budgetOuserPrice:100,budgetIuserWorkload:0,budgetOuserWorkload:0
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
				name: 'name',
				id: 'id',
				pid: 'parentPhaseId',
				startDate: 'beginDate',
				endDate: 'endDate',
				
				},
				maps:new Map(),
				totalProjectAndPhaseBudgetCost:{},
				taskVisible:false,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmPhases();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmPhases();
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
				this.getXmPhases();
			},
			searchXmPhases(){
				 this.pageInfo.count=true; 
				 this.getXmPhases();
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
				if(this.filters.taskFilterType){
					params.taskFilterType=this.filters.taskFilterType
				}
				
				if(!(params.isKeyPath||params.milestone||params.productId||params.iterationId||params.phaseStatus||params.taskFilterType)){
					params.isTop="1"
				}
				return params;
			},
			loadXmPhaseLazy(tree, treeNode, resolve) {    
				this.maps.set(tree.id, { tree, treeNode, resolve }) //储存数据
					var params={parentPhaseId:tree.id}
					params=this.getParams(params);
					params.isTop=""
					this.load.list = true;
					var func=listXmPhase 
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

			//获取列表 XmPhase xm_project_phase
			getXmPhases() {
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
				listXmPhase(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmPhases = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmPhase xm_project_phase
			showEdit: function ( row,index ) { 
				this.editForm = row;
				this.editFormVisible = true;
			},
			//显示新增界面 XmPhase xm_project_phase
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
				this.searchXmPhases() 
				treeTool.reloadChildren(this.$refs.table,this.maps,row.parentPhaseId,'parentPhaseId',this.loadXmPhaseLazy) 
			},
			afterEditSubmit(row){
				this.editFormVisible=false;   
				this.searchXmPhases() 
				treeTool.reloadChildren(this.$refs.table,this.maps,row.parentPhaseId,'parentPhaseId',this.loadXmPhaseLazy) 
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
					i.budgetAt=0
					i.budgetNouserAt=0
					i.budgetIuserAt=0
					i.budgetOuserAt=0 
					i.budgetWorkload=0
					i.budgetStaffNu=0
					i.budgetHours=160
					i.budgetIuserWorkload=0
					i.budgetOuserWorkload=0
					i.budgetIuserPrice=this.selProject.planIuserPrice
					i.budgetOuserPrice=this.selProject.planOuserPrice
					i.budgetOuserCnt=0;
					i.budgetIuserCnt=0;
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
						this.searchXmPhases() 
						if(this.parentProjectPhase&&this.this.parentProjectPhase.id){
							treeTool.reloadChildren(this.$refs.table,this.maps,this.parentProjectPhase.id,'parentPhaseId',this.loadXmPhaseLazy)
						} 
					}else{ 
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					} 
				}).catch( err  => this.load.add=false );
			},
			//选择行xmPhase
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmPhase
			handleDel: function (row,index) {   
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmPhase(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true; 
							this.searchXmPhases() 
							treeTool.reloadChildren(this.$refs.table,this.maps,row.parentPhaseId,'parentPhaseId',this.loadXmPhaseLazy) 
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmPhase
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
					batchDelXmPhase(phases).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){  
							this.pageInfo.count=true; 
							this.searchXmPhases() 
							treeTool.reloadAllChildren(this.$refs.table,this.maps,phases,'parentPhaseId',this.loadXmPhaseLazy)
								 
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
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
				}  else if(command.type=='loadTasksToXmPhase'){
					this.loadTasksToXmPhase([command.data]);
				} else if(command.type=='showTaskForBatchRelTasksWithPhase'){
					this.taskVisible=true
				}
			},
			//从任务中汇总进度/实际费用等数据
			loadTasksToXmPhase:function(phases){ 
				var params={
					projectId:this.selProject.id,
 				}
				if(phases && phases.length>0){
					params.phaseIds=phases.map(i=>i.id);
				}
				 this.load.edit=true;
				loadTasksToXmPhase(params).then(res=>{
					 this.load.edit=false;
					var tips = res.data.tips
					this.xmPhases=[]
					if(tips.isOk){
						this.getXmPhases()
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'}); 
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
						this.getXmPhases()
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'}); 
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
				if(row.budgetNouserAt==null ||  row.budgetNouserAt=='' || row.budgetNouserAt==undefined){
					row.budgetNouserAt=0;
				}
				
				if(row.budgetIuserAt==null ||  row.budgetIuserAt=='' || row.budgetIuserAt==undefined){
					row.budgetIuserAt=0;
				}
				
				if(row.budgetOuserAt==null ||  row.budgetOuserAt=='' || row.budgetOuserAt==undefined){
					row.budgetOuserAt=0;
				}
				if(row.actNouserAt==null ||  row.actNouserAt=='' || row.actNouserAt==undefined){
					row.actNouserAt=0;
				}
				
				if(row.actIuserAt==null ||  row.actIuserAt=='' || row.actIuserAt==undefined){
					row.actIuserAt=0;
				}
				
				if(row.actOuserAt==null ||  row.actOuserAt=='' || row.actOuserAt==undefined){
					row.actOuserAt=0;
				}
				var budgetAt=parseFloat(row.budgetNouserAt)+parseFloat(row.budgetIuserAt)+parseFloat(row.budgetOuserAt)
				var actCostAt=parseFloat(row.actNouserAt)+parseFloat(row.actIuserAt)+parseFloat(row.actOuserAt)

				return {budgetAt:budgetAt,actCostAt:actCostAt};
			},
			fieldChange:function(row,fieldName, nextReplace){
        if (nextReplace) {
          row.nextReplace = nextReplace;
        }
        console.log('fieldChange--row.opType==', row.opType);
        
        //{{formatDate(scope.row.beginDate)}}~{{formatDate(scope.row.endDate)}}  <br/> 
				if(!row.budgetIuserPrice){
					row.budgetIuserPrice=this.selProject.planIuserPrice
				} 
				if(!row.budgetOuserPrice){
					row.budgetOuserPrice=this.selProject.planOuserPrice
				}
				if(!row.budgetIuserCnt){
					row.budgetIuserCnt=0
				}
				
				if(!row.budgetOuserPrice){
					row.budgetOuserPrice=this.selProject.planOuserPrice
				} 
				if(!row.budgetOuserPrice){
					row.budgetOuserPrice=this.selProject.planOuserPrice
				}
				if(!row.budgetOuserCnt){
					row.budgetOuserCnt=0
				}
				if(fieldName=='beginDate' || fieldName=='endDate'){
					if(row.beginDate && row.endDate){
						
						var start=new Date(row.beginDate);
						var end=new Date(row.endDate);
						var days=this.getDaysBetween(end,start)
						row.budgetHours=this.getFloatValue(days*8).toFixed(2)
						row.budgetIuserWorkload=row.budgetHours  * row.budgetIuserCnt
						row.budgetIuserAt=row.budgetIuserWorkload * row.budgetIuserPrice  
						row.budgetOuserWorkload=row.budgetHours  * row.budgetOuserCnt
						row.budgetOuserAt=row.budgetOuserWorkload * row.budgetOuserPrice  
						row.budgetWorkload=row.budgetIuserWorkload+row.budgetOuserWorkload 
					}
				}else if(fieldName=='budgetHours'){ 
						row.budgetIuserWorkload=row.budgetHours  * row.budgetIuserCnt
						row.budgetIuserAt=row.budgetIuserWorkload * row.budgetIuserPrice  
						row.budgetOuserWorkload=row.budgetHours  * row.budgetOuserCnt
						row.budgetOuserAt=row.budgetOuserWorkload * row.budgetOuserPrice  
						row.budgetWorkload=row.budgetIuserWorkload+row.budgetOuserWorkload 
				}else if(fieldName=='budgetIuserPrice' || fieldName=='budgetIuserCnt'){
						row.budgetIuserWorkload=row.budgetHours  * row.budgetIuserCnt
						row.budgetIuserAt=row.budgetIuserWorkload * row.budgetIuserPrice  
						row.budgetWorkload=row.budgetIuserWorkload+row.budgetOuserWorkload 
				}else if(fieldName=='budgetOuserPrice'||fieldName=='budgetOuserCnt'){ 
						row.budgetOuserWorkload=row.budgetHours  * row.budgetOuserCnt
						row.budgetOuserAt=row.budgetOuserWorkload * row.budgetOuserPrice  
						row.budgetWorkload=row.budgetIuserWorkload+row.budgetOuserWorkload 
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
					this.$notify({position:'bottom-left',showClose:true,message:"没有改变任何数据，无需保存", type: 'success'});
					return;
				}else {
					if(this.budgetData.surplusPlanIuserAt<0){
						this.$notify({position:'bottom-left',showClose:true,message:"内部人力预算不足，请调整", type: 'error'});
						return;
					}
					if(this.budgetData.surplusPlanOuserAt<0){
						this.$notify({position:'bottom-left',showClose:true,message:"外购人力预算不足，请调整", type: 'error'});
						return;
					}
					if(this.budgetData.surplusPlanNouserAt<0){
						this.$notify({position:'bottom-left',showClose:true,message:"非人力预算不足请调整",type: 'error'});
						return;
					}
					
					this.load.edit=true;
					batchSaveBudget(this.valueChangeRows).then(res=>{ 
						this.load.edit=false;
						var tips =res.data.tips;
						if(tips.isOk){
							this.valueChangeRows=[]
							this.getXmPhases();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'}); 
						
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
					this.searchXmPhases();
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
 
				var workload=this.budgetData.budgetIuserWorkload+this.budgetData.budgetOuserWorkload
				var cost=this.budgetData.budgetNouserAt+this.budgetData.budgetIuserAt+this.budgetData.budgetOuserAt
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
				var budgetWorkload=this.budgetData.budgetIuserWorkload+this.budgetData.budgetOuserWorkload
				
				var actWorkload=this.budgetData.actWorkload 
				var budgetCost=this.budgetData.budgetNouserAt+this.budgetData.budgetIuserAt+this.budgetData.budgetOuserAt
				var actCost=this.budgetData.actIuserAt+this.budgetData.actNouserAt+this.budgetData.actOuserAt
				sums[5]='计 '+budgetWorkload+',实 '+actWorkload+'' 
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
        this.xmPhases.forEach(d => {
          dict[d.id] = d.parentPhaseId || '';
        });
        if (!dict[eId]) {
          this.xmPhases.find(d => {
            if (d.id === sId) {
              d.parentPhaseId = eId;
              console.log('更新关系1');
              this.fieldChange(d,'parentPhaseId',true);
            }
          })
        } else {
          const isSynezesis = this.judgePmenuId(dict, sId, dict[eId]);
          if (!isSynezesis) {
            this.xmPhases.find(d => {
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
				if(this.dicts[itemCode]){
					var dicts=this.dicts[itemCode].filter(i=>i.id==value);
					if(dicts && dicts.length > 0){
						return dicts[0].name
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
					i.name=i.menuName 
				})
				this.afterPhaseTemplateSelected(menus2);
				this.menuVisible=false;
				 
			},

			onSelectedTasks(tasks){
				if(tasks==null || tasks.length==0){
					return;
				}
				var params={
					phaseId:this.editForm.id,
					taskIds:tasks.map(i=>i.id)
				}
				batchRelTasksWithPhase(params).then(res=>{
					var tips = res.data.tips; 
					if(tips.isOk){
						this.taskVisible=false;
					}
					this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
				})
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
					subRow.budgetAt=0
					subRow.budgetNouserAt=0
					subRow.budgetIuserAt=0
					subRow.budgetOuserAt=0 
					subRow.budgetWorkload=0
					subRow.budgetStaffNu=0
					subRow.budgetHours=160
					subRow.budgetIuserWorkload=0
					subRow.budgetOuserWorkload=0
					subRow.budgetIuserPrice=this.selProject.planIuserPrice
					subRow.budgetOuserPrice=this.selProject.planOuserPrice
					subRow.budgetOuserCnt=0;
					subRow.budgetIuserCnt=0;
					const ctime = new Date();
					var beginDate=new Date();
					const endDate=new Date();
					endDate.setTime(ctime.getTime() + 3600 * 1000 * 24 * 7 *4);//两周后
					subRow.ctime=util.formatDate.format(ctime,'yyyy-MM-dd HH:mm:ss')
					subRow.beginDate=util.formatDate.format(beginDate,'yyyy-MM-dd HH:mm:ss')
					subRow.endDate=util.formatDate.format(endDate,'yyyy-MM-dd HH:mm:ss')

					this.fieldChange(subRow,'seqNo');
					this.xmPhases.unshift(subRow);
				}else if('addSub'==opType){
					var subRow=JSON.parse(JSON.stringify(row));
					subRow.children=[];
					subRow.parentPhaseId=row.id
					subRow.id=sn();
					subRow.seqNo=row.seqNo+".1"
					subRow.opType=opType
					this.fieldChange(subRow,'seqNo');
					this.xmPhases.unshift(subRow);
				}else if('delete'==opType){
					if(row.opType && (row.opType=='addSub' || row.opType=='add')){
						if(row.children && row.children.length>0){
							this.$notify.error("请先删除子元素");
							return;
						}else{ 

							var index=this.xmPhases.findIndex(i=>i.id==row.id)
							var indexValueChanges=this.valueChangeRows.findIndex(i=>i.id==row.id)
							this.valueChangeRows.splice(indexValueChanges,1);
							this.xmPhases.splice(index,1);
            }
            }
          }else if ('highestPmenuId' === opType) {  
            if (row.id) {
              this.xmPhases.find(d => {
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
					this.searchXmPhases();
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
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
				})
			}
		},//end methods
		components: { 
		    'xm-phase-add':XmPhaseAdd,
		    'xm-phase-edit':XmPhaseEdit,
			
      XmPhaseTemplateMng,xmMenuSelect,XmGantt,XmPhaseBatch,XmGroupSelect,
XmTaskList
        //在下面添加其它组件
		},
		mounted() {  
			this.selectTotalProjectAndPhaseBudgetCost();
			this.$nextTick(() => { 
				this.tableHeight =  util.calcTableMaxHeight(this.$refs.table.$el); 
				if(this.selProject){
					this.getXmPhases();
				} 
      });  
			
		}
	}

</script>

<style lang="scss" scoped> 
</style>