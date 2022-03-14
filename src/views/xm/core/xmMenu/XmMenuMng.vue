<template>
	<section class="padding">
		<el-row v-if=" !batchEditVisible">  
			<el-col :span="24" class="padding-left">
					<el-row>   
						
						<el-select v-model="filters.dtype" clearable placeholder="需求类型">
							<el-option v-for="i in this.dicts.demandType" :label="i.name" :key="i.id" :value="i.id"></el-option>
						</el-select>    
						<el-select v-model="filters.source" placeholder="需求来源"  clearable>
							<el-option v-for="i in this.dicts.demandSource" :label="i.name" :key="i.id" :value="i.id"></el-option>
						</el-select>     
						<el-select v-model="filters.dlvl" placeholder="需求层次"  clearable class="hidden-md-and-down">
							<el-option v-for="i in this.dicts.demandLvl" :label="i.name" :key="i.id" :value="i.id"></el-option>
						</el-select>    
						<el-select v-model="filters.priority" placeholder="优先级"  clearable>
								<el-option v-for="i in dicts.priority" :label="i.name" :key="i.id" :value="i.id"></el-option> 
						</el-select>  
						<el-select  v-model="filters.taskFilterType" placeholder="已关联任务的需求？" clearable style="width: 160px;">
							<el-option   value="not-join-any-project"  label="未关联任务"></el-option>  
							<el-option   value="join-any-project"  label="已关联任务"></el-option>  
							<el-option   value="not-join-curr-project"  label="未有本项目任务关联"></el-option>  
							<el-option   value="join-curr-project"  label="有本项目任务关联"></el-option>  
						</el-select>   
						<el-select   v-model="filters.iterationFilterType" placeholder="加入过迭代？" clearable  style="width: 160px;">
							<el-option   value="not-join-any-iteration"  label="未加入过迭代"></el-option>  
							<el-option   value="join-any-iteration"  label="已加入过迭代"></el-option>  
							<el-option   value="not-join-curr-iteration"  label="未加入本迭代"></el-option>  
							<el-option   value="join-curr-iteration"  label="已加入本迭代"></el-option>  
						</el-select>    
					</el-row>
					<el-row>   
						<el-popover
							placement="right"
							width="400"
							trigger="click"> 
							<xm-product-select v-if="!xmProduct" :auto-select="true" :sel-project="selProject" @row-click="onProductSelected" ref="xmProductMng" :xm-iteration="xmIteration" :simple="true" @clear-select="filters.product=null"></xm-product-select>
								<el-link type="warning" slot="reference" v-if="!xmProduct" icon="el-icon-search"><font style="font-size:14px;">{{filters.product?filters.product.productName:'选择产品'}}</font></el-link> 
						</el-popover>   
						
						<el-select  v-model="filters.status" placeholder="需求状态" clearable style="width: 100px;">
							<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.menuStatus" :key="index"></el-option> 
						</el-select> 
						<el-input v-model="filters.key" style="width: 15%;" placeholder="需求名称查询" clearable> 
						</el-input> 
						<el-button   type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmMenus" icon="el-icon-search">查询</el-button>
						<el-button class="hidden-md-and-down" v-if="!filters.tags||filters.tags.length==0" @click.native="tagSelectVisible=true">标签</el-button>
						<el-tag class="hidden-md-and-down" v-else @click="tagSelectVisible=true"   closable @close="clearFiltersTag(filters.tags[0])">{{filters.tags[0].tagName.substr(0,5)}}等({{filters.tags.length}})个</el-tag>
						<el-popover style="padding-left:10px;"  
							placement="top-start"
							width="250" 
							trigger="click" > 
							<el-row> 
								<el-col :span="24" style="padding-top:5px;">
									<el-button   @click="showAdd" icon="el-icon-plus">直接添加子需求</el-button> 
								</el-col>  
								<el-col :span="24" style="padding-top:5px;">
									<el-button  @click="showImportFromMenuTemplate()" icon="el-icon-upload2">由模板快速导入子需求</el-button> 
								</el-col> 
							</el-row>   
							<el-button type="primary"    slot="reference" icon="el-icon-plus">需求</el-button>
						</el-popover>
						
						<el-button  @click="batchEditVisible=true">批量修改</el-button>
						<el-button  @click="showParentMenu">更换上级</el-button>
 						<el-button  v-if="!selProject&&!xmIteration&&disabledMng!=false"  type="danger" @click="batchDel" icon="el-icon-delete">删除</el-button> 

						<el-button class="hidden-md-and-down"  v-if=" batchEditVisible==false&&disabledMng!=false "       @click="loadTasksToXmMenuState" icon="el-icon-s-marketing">汇总进度</el-button>  
						<el-popover
							placement="top-start"
							title=""
							width="400"
							trigger="click" >
							<el-row>  
								<el-col  :span="24"  style="padding-top:5px;" >
									<font class="more-label-font">标签条件:</font>  
									<el-button type="text" v-if="!filters.tags||filters.tags.length==0" @click.native="tagSelectVisible=true">标签</el-button>
									<el-tag v-else @click="tagSelectVisible=true"   closable @close="clearFiltersTag(filters.tags[0])">{{filters.tags[0].tagName.substr(0,5)}}等({{filters.tags.length}})个</el-tag>
 
								</el-col> 
								<el-col :span="24"  style="padding-top:5px;">
									<font class="more-label-font">创建日期:</font>  
									<el-date-picker
										v-model="dateRanger" 
										type="daterange"
										align="right"
										unlink-panels
										range-separator="至"
										start-placeholder="创建日期"
										end-placeholder="创建日期"
										value-format="yyyy-MM-dd HH:mm:ss"
										:default-time="['00:00:00','23:59:59']"
										:picker-options="pickerOptions"
									></el-date-picker>   
								</el-col>   
								<el-col  :span="24"  style="padding-top:5px;">
									<font class="more-label-font">
										责任人:
									</font>  
									<el-tag v-if="filters.mmUser" closable @close="clearFiltersMmUser()">{{filters.mmUser.username}}</el-tag> 
									<el-button   v-else @click="selectFiltersMmUser()">选责任人</el-button>
									<el-button    @click="setFiltersMmUserAsMySelf()">我的</el-button>
								</el-col>
								<el-col  :span="24"  style="padding-top:5px;" class="hidden-log-and-up">
									<font class="more-label-font">
										需求层次:
									</font>  
									<el-select v-model="filters.dlvl" placeholder="需求层次"  clearable>
										<el-option v-for="i in this.dicts.demandLvl" :label="i.name" :key="i.id" :value="i.id"></el-option>
									</el-select>  
								</el-col>
								<el-col  :span="24"  style="padding-top:5px;">
									<el-button type="primary"  @click="searchXmMenus" icon="el-icon-search">查询</el-button>
 								</el-col> 
								<el-col  :span="24"  style="padding-top:5px;"> 
									<el-button  v-if=" batchEditVisible==false "  @click="handleExport" icon="el-icon-download">导出</el-button>  
									<el-button   v-if=" batchEditVisible==false&&disabledMng!=false "       @click="loadTasksToXmMenuState" icon="el-icon-s-marketing">汇总进度</el-button>   
								</el-col> 
							</el-row> 
							<el-button  slot="reference" icon="el-icon-more"></el-button>
						</el-popover>  
					 </el-row>  
					<el-row class="padding-top">  
						<el-table lazy :load="loadXmMenusLazy" stripe fit border ref="table" :height="maxTableHeight" :data="xmMenusTreeData" current-row-key="menuId" row-key="menuId" :tree-props="{children: 'children', hasChildren: 'childrenCnt'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick">
							<el-table-column sortable type="selection" width="40"></el-table-column> 
							<el-table-column prop="menuName" label="需求名称" min-width="260" show-overflow-tooltip> 
								<template slot-scope="scope"> 
									<span class="vlink" @click="showEdit(scope.row)">{{scope.row.seqNo}} &nbsp; {{scope.row.menuName}} </span>
								</template>
							</el-table-column>  
							<el-table-column prop="status" label="状态"  min-width="80" show-overflow-tooltip> 
								<template slot-scope="scope"> 
									{{dicts.menuStatus.some(i=>i.id==scope.row.status)?dicts.menuStatus.find(i=>scope.row.status==i.id).name:''}}
								</template>
							</el-table-column>  
							<el-table-column prop="iterationName" label="迭代"  min-width="80" show-overflow-tooltip>  
							</el-table-column>  
							
							<el-table-column prop="taskCnt" label="任务数"  min-width="80" show-overflow-tooltip>   
								<template slot="header"> 
									<el-tooltip   content="已完成 / 总数 注意：统计包括下级数据"><div>任务数<i class="el-icon-bangzhu"></i></div></el-tooltip>
								</template>
								<template slot-scope="scope"> 
										<div>{{scope.row.finishTaskCnt}}/{{scope.row.taskCnt}}</div>
								</template>
							</el-table-column>  
							<el-table-column prop="finishRate" label="进度"  min-width="80" show-overflow-tooltip> 
								<template slot-scope="scope"> 
										<span v-if="scope.row.finishRate"><el-tag :type="scope.row.finishRate>=100?'success':'warning'">{{scope.row.finishRate}}%</el-tag></span>
								</template>
							</el-table-column>   
							<el-table-column prop="bugs" label="缺陷"  min-width="100" show-overflow-tooltip>   
								
								<template slot="header"> 
									<el-tooltip   content="已关闭缺陷数 / 总缺陷数 注意：统计包括下级数据"><div>缺陷<i class="el-icon-bangzhu"></i></div></el-tooltip>
								</template>
								<template slot-scope="scope"> 
										 {{scope.row.closedBugs}}/{{scope.row.bugCnt}} 
								</template>
							</el-table-column>  
							<el-table-column prop="tagNames" label="标签"  min-width="100" show-overflow-tooltip> 
							</el-table-column> 
							<el-table-column prop="ctime" label="创建日期"  min-width="100" show-overflow-tooltip> 
								<template slot-scope="scope"> 
										 <span>{{scope.row.ctime}} </span>  
								</template>
							</el-table-column> 
							<el-table-column prop="menuName" label="跟进人"  min-width="100" show-overflow-tooltip> 
								<template slot-scope="scope"> 
										 <span>{{scope.row.mmUsername}} </span>  
								</template>
							</el-table-column> 
							<el-table-column   label="操作"  width="200" fixed="right"> 
								<template slot-scope="scope">   
									<el-row v-if="disabledMng!=false">
										<el-popover style="padding-left:10px;"  
											placement="top-start"
											width="250"
											trigger="click" > 
											<el-row> 
												<el-col :span="24" style="padding-top:5px;">
													<el-button   @click="showSubAdd( scope.row,scope.$index)" icon="el-icon-plus">直接添加子需求</el-button> 
												</el-col>  
												<el-col :span="24" style="padding-top:5px;">
													<el-button  @click="showImportFromMenuTemplate(scope.row)" icon="el-icon-upload2">由模板快速导入子需求</el-button> 
												</el-col> 
											</el-row>   
											<el-button type="text"    slot="reference" icon="el-icon-plus">{{scope.row.ntype=='1'?'子需求':''}}</el-button>
										</el-popover>   
										<font>
											<el-button  v-if="scope.row.ntype!='1'"  type="text"  @click="showTaskListForMenu(scope.row,scope.$index)"  icon="el-icon-s-operation">查任务</el-button>
											<el-button  v-if="scope.row.ntype!='1'"  type="text"  @click="showTaskList(scope.row,scope.$index)"  icon="el-icon-s-operation">关联任务</el-button> 
										</font>
									</el-row>
								</template>
							</el-table-column>   
							
						</el-table>
						
							
					</el-row> 
				<!--编辑 XmMenu xm_project_menu界面-->
				<el-drawer title="编辑需求" :visible.sync="editFormVisible" :with-header="false"  size="50%"  append-to-body   :close-on-click-modal="false">
					<xm-menu-edit :xm-menu="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-menu-edit>
				</el-drawer>
		
				<!--新增 XmMenu xm_project_menu界面-->
				<el-drawer title="新增需求" :visible.sync="addFormVisible"  :with-header="false" size="50%"  append-to-body   :close-on-click-modal="false">
					<xm-menu-add  :product="filters.product"   :parent-menu="parentMenu"  :xm-menu="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-menu-add>
				</el-drawer> 
				<el-drawer title="需求模板" :visible.sync="menuTemplateVisible"   size="80%"  append-to-body   :close-on-click-modal="false">
					<xm-menu-template-mng  :is-select-menu="true"  :visible="menuTemplateVisible" @cancel="menuTemplateVisible=false" @selected-menus="onSelectedMenuTemplates"></xm-menu-template-mng>
				</el-drawer> 
				
				<el-drawer title="需求谈论" :visible.sync=" menuDetailVisible"   size="80%"  append-to-body   :close-on-click-modal="false">
					<xm-menu-rich-detail :visible="menuDetailVisible"  :reload="false" :xm-menu="editForm" ></xm-menu-rich-detail>
				</el-drawer> 
				
				<el-drawer  title="选择产品" :visible.sync="productVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
					<xm-product-select :sel-project="selProject" @row-click="onProductSelected" ref="xmProductMng" :simple="true"></xm-product-select>
				</el-drawer> 
				<el-drawer title="选中任务" :visible.sync="selectTaskVisible"   size="80%"  append-to-body   :close-on-click-modal="false">
					<xm-task-list :xm-product="filters.product" :sel-project="selProject" :is-multi-select="true"  @tasks-selected="onSelectedTasks"></xm-task-list>
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
				<el-drawer
					append-to-body
					title="需求关联的迭代查询" 
					:with-header="false"
					size="80%"
					:visible.sync="iterationVisible" 
					>
						<xm-iteration-mng :visible="iterationVisible" :product-id="editForm.productId" :menu-id="editForm.menuId" ></xm-iteration-mng>
				</el-drawer>

				<el-drawer title="选择员工" :visible.sync="selectFiltersMmUserVisible" size="60%" append-to-body>
					<users-select  @confirm="onFiltersMmUserSelected" ref="selectFiltersMmUser"></users-select>
				</el-drawer>	
			</el-col> 	 
		</el-row>
		
		<el-row v-if="batchEditVisible">
			<xm-menu-mng-batch :xm-menus="xmMenus" :options="options"  @no-batch-edit="noBatchEdit" :product="filters.product"></xm-menu-mng-batch>
		</el-row>
		<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
		<el-drawer append-to-body title="标签条件" :visible.sync="tagSelectVisible"  size="60%">
			<tag-mng :tagIds="filters.tags?filters.tags.map(i=>i.tagId):[]" :jump="true" @select-confirm="onTagSelected">
			</tag-mng>
		</el-drawer>
		

		<el-drawer
		append-to-body
		title="需求选择"
		:visible.sync="parentMenuVisible"
		size="70%"
		:close-on-click-modal="false"
		>
		<xm-menu-select
			:visible="parentMenuVisible"
			:is-select-menu="true" 
			@selected="onParentMenuSelected" 
			:xm-product="filters.product"
		></xm-menu-select>
		</el-drawer> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmMenu, delXmMenu, batchDelXmMenu,batchAddXmMenu,batchEditXmMenu,listXmMenuWithState,listXmMenuWithPlan,batchChangeParentMenu } from '@/api/xm/core/xmMenu';
	import { batchRelTasksWithMenu } from '@/api/xm/core/xmTask';
	import { loadTasksToXmMenuState} from '@/api/xm/core/xmMenuState';

	
	import  XmMenuAdd from './XmMenuAdd';//新增界面
	import  XmMenuEdit from './XmMenuEdit';//修改界面
	import  XmMenuMngBatch from './XmMenuMngBatch';//修改界面
	import  XmProductSelect from '../xmProduct/XmProductSelect';//新增界面
	import  XmMenuTemplateMng from '../xmMenuTemplate/XmMenuTemplateMng';//新增界面
	import XmMenuRichDetail from './XmMenuRichDetail';
	import XmTaskList from '../xmTask/XmTaskList';
	import XmTaskMng from '../xmTask/XmTaskMng'; 
	import XmTaskListForMenu from '../xmTask/XmTaskListForMenu';
	import  XmIterationMng from '../xmIteration/XmIterationSelect';//修改界面
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; 
	
	import XmMenuSelect from "../xmMenu/XmMenuSelect";
  	import TagMng from "@/views/mdp/arc/tag/TagMng";

	import {sn} from '@/common/js/sequence'

	import { mapGetters } from 'vuex' 
	
	export default { 
		props:['selProject','xmIteration','xmProduct','disabledMng'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
			
      xmMenusTreeData() {  
				let xmMenus = JSON.parse(JSON.stringify(this.xmMenus || []));  
				let xmMenusTreeData = treeTool.translateDataToTree(xmMenus,"pmenuId","menuId");  
				 return xmMenusTreeData;
			},
			isPmUser(){
				if(this.filters.product){
					if(this.userInfo.userid==this.filters.product.pmUserid){
						return true;
					}
				}
				return false;
			}
		},
		watch:{  
			xmIteration:function(){
				this.filters.iterationFilterType="join-curr-iteration"
				this.getXmMenus()
			},
			xmProduct:function(){  
					this.filters.product=this.xmProduct
					this.getXmMenus() 
			},
			selProject:function(){
				this.filters.taskFilterType='join-curr-project'
				this.getXmMenus();
			}
    	},
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 );
			return {
				filters: {
					key: '',
					product:null,
					mmUser:null,
					iterationFilterType:'',//join、not-join、''
					taskFilterType:'',//join、not-join、''
					tags:[],
					parentMenu:null,
					parentMenuList:[],
					status:'',
				},
				dicts:{
					menuStatus:[
						
							{id:"0", name:"初始"},
							{id:"1", name:"待评审"},
							{id:"2", name:"待设计"},
							{id:"3", name:"待开发"},
							{id:"4", name:"待SIT"},
							{id:"5", name:"待UAT"},
							{id:"6", name:"待上线"},
							{id:"7", name:"运行中"},
							{id:"8", name:"已下线"},
							{id:"9", name:"已删除"}, 
					]
				},
				xmMenus: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:50,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
					menuStatus:[
						
							{id:"0", name:"初始"},
							{id:"1", name:"待评审"},
							{id:"2", name:"待设计"},
							{id:"3", name:"待开发"},
							{id:"4", name:"待SIT"},
							{id:"5", name:"待UAT"},
							{id:"6", name:"待上线"},
							{id:"7", name:"运行中"},
							{id:"8", name:"已下线"},
							{id:"9", name:"已删除"}, 
					]
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmMenu界面是否显示
				//新增xmMenu界面初始化数据
				addForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',ntype:'0',childrenCnt:0,sinceVersion:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmMenu界面初始化数据
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',ntype:'0',childrenCnt:0,sinceVersion:''
				},
				parentMenu:null,
				menuTemplateVisible:false,
				batchEditVisible:false,
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
				pickerOptions:  util.pickerOptions('datarange'),
				productVisible:false,
				tagSelectVisible:false,
				parentMenuVisible:false,
				maps:new Map(),
 				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
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
				this.getXmMenus();
			},
			searchXmMenus(){
				 this.pageInfo.count=true; 
				 this.getXmMenus();
			},
			getParams(params){

				if(!params.productId){
					params.branchId=this.userInfo.branchId
				}
				
				if( this.filters.key){
					params.key="%"+this.filters.key+"%"
				}
				 
				if(this.filters.mmUser){
					params.mmUserid=this.filters.mmUser.userid;
				}  
				if(this.filters.iterationFilterType){
					params.iterationFilterType=this.filters.iterationFilterType
				} 
				if(this.xmIteration){ 
					params.filterIterationId=this.xmIteration.id
				}
				if(this.filters.taskFilterType){
					params.taskFilterType=this.filters.taskFilterType
				} 
				if(this.selProject){
					params.projectId=this.selProject.id
				}
				 
				if(this.filters.product){
					params.productId=this.filters.product.id
				}
				if(this.filters.parentMenu){
					params.pmenuId=this.filters.parentMenu.menuId
				}
				
				if(this.filters.status){
					params.status=this.filters.status
				}
				if( this.dateRanger && this.dateRanger.length==2){
					params.ctimeStart=this.dateRanger[0] 
					params.ctimeEnd=this.dateRanger[1] 
				} 
				if(this.filters.tags && this.filters.tags.length>0){
					params.tagIdList=this.filters.tags.map(i=>i.tagId)
				}
				if(!(params.ctimeStart||params.pmenuId||params.projectId||params.filterIterationId||params.iterationFilterType||params.mmUserid||params.key||params.taskFilterType||params.tagIdList||params.status)){
					params.isTop="1"
				}
				return params;
			},
			loadXmMenusLazy(tree, treeNode, resolve) {   
				
      			this.maps.set(tree.menuId, { tree, treeNode, resolve }) //储存数据
					var params={pmenuId:tree.menuId}
					params=this.getParams(params);
					params.isTop=""
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
				}else {
					//this.$notify({showClose: true, message: "请先选择产品", type: 'warning'});
					return;
				} 
					
				params=this.getParams(params);
				params.withParents="1"
				//params.isTop="1" 
				let callback= (res)=>{
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmMenus = res.data.data;
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
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
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmMenu xm_project_menu
			showAdd: function () {  
				this.parentMenu=null;
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			showSubAdd:function(row){ 
				this.editForm=row
				this.parentMenu=row
				this.addFormVisible=true
			},
			showProdcutAdd:function(){
				this.$refs.xmProductMng.showAdd();
			},
			afterAddSubmit(row){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.parentMenu=null;
				this.getXmMenus();
				treeTool.reloadChildren(this.$refs.table,this.maps,row.pmenuId,'pmenuId',this.loadXmMenusLazy) 
			},
			afterEditSubmit(row){
				this.editFormVisible=false;
				this.getXmMenus(); 
				treeTool.reloadChildren(this.$refs.table,this.maps,row.pmenuId,'pmenuId',this.loadXmMenusLazy) 
			},
			//选择行xmMenu
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			onProductSelected:function(product){
				this.filters.product=product
				this.filters.parentMenu=null;
				this.filters.parentMenuList=[];
				this.productVisible=false;
				this.xmMenus=[]
				this.getXmMenus()
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
							
							treeTool.reloadChildren(this.$refs.table,this.maps,row.pmenuId,'pmenuId',this.loadXmMenusLazy) 
							this.getXmMenus(); 
							
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmMenu
			batchDel: function () { 
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmMenu(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmMenus();     
							treeTool.reloadAllChildren(this.$refs.table,this.maps,this.sels,'pmenuId',this.loadXmMenusLazy)  
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			
			rowClick: function(row, event, column){
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
        
			/**begin 自定义函数请在下面加**/
			selectedMenu:function(row){
				this.$emit("selected",row)
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
						if(this.parentMenu && this.parentMenu.menuId){
							treeTool.reloadAllChildren(this.$refs.table,this.maps,this.parentMenu.menuId,'pmenuId',this.loadXmMenusLazy)  
						}
					}else{ 
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					}
				}).catch( err  => this.load.add=false );
			},
			toBatchEdit(){
				this.batchEditVisible=true;

			},
			noBatchEdit(){
				this.batchEditVisible=false; 
				this.getXmMenus();
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
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
				});
			},
			showMenuExchange:function(row){
				this.editForm=row
				this. menuDetailVisible=true;
			},
			toProjectList:function(product){
				this.$router.push({name:'xmProjectMng',params:{productId:product.id,productName:product.productName}})
			},
			toIterationList:function(row){
				 this.editForm=row
				 this.iterationVisible=true;

			},
			showTasks(row){
				this.editForm=row
				this.taskMngVisible=true
			}, 

			showTaskListForMenu(row){
				this.editForm=row
				this.taskListForMenuVisible=true
			}, 
			 
			loadTasksToXmMenuState: function () {  
				this.load.edit=true;
				if(!this.filters.product){
					this.$notify.error("请先选择产品");
				}
				let params = { productId: this.filters.product.id };
				loadTasksToXmMenuState(params).then((res) => {
					this.load.edit=false;
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.count=true;
						this.getXmMenus();
					}
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch( err  => this.load.edit=false ); 
			},
			selectUser(row){
				this.editForm=row
				this.userSelectVisible=true;
			}, 
			clearFiltersMmUser:function(){
				 this.filters.mmUser=null;
				  this.searchXmMenus();
			},			
			selectFiltersMmUser(){
				this.selectFiltersMmUserVisible=true;
			},
			onFiltersMmUserSelected(users){
				
				 if(users && users.length>0){
					 this.filters.mmUser=users[0]
				 }else{
					 this.filters.mmUser=null;
				 }
				 this.selectFiltersMmUserVisible=false;
				 this.searchXmMenus();
			},
			setFiltersMmUserAsMySelf(){
				this.filters.mmUser=this.userInfo;
				this.searchXmMenus();
			},								 
			toSelectProduct(){ 
				this.productVisible=true;
			},
			searchSubMenus(row,index){
				
				this.filters.parentMenu=row
				this.filters.parentMenuList.push(row);
				this.pageInfo.count=true;
				this.searchXmMenus();
			},
			clearParentMenu(menu,index){
				if(index==0){
					this.filters.parentMenu=null;
					this.filters.parentMenuList=[];
				}else{
					this.filters.parentMenu=this.filters.parentMenuList[index-1];
					this.filters.parentMenuList.splice(index,this.filters.parentMenuList.length-index)
				} 
				this.pageInfo.count=true
				this.searchXmMenus();
			},
			onParentMenuClick(menu,index){
				this.filters.parentMenu=this.filters.parentMenuList[index];
				this.filters.parentMenuList.splice(index+1,this.filters.parentMenuList.length-index)
				this.pageInfo.count=true
				this.searchXmMenus();
			}, 
			clearFiltersTag(tag){
				var index=this.filters.tags.findIndex(i=>i.tagId==tag.tagId)
				this.filters.tags.splice(index,1);
				this.searchXmMenus();
			},
			onTagSelected(tags){
				
				this.tagSelectVisible = false; 
				if (!tags || tags.length == 0) { 
					this.filters.tags=[]
				}else{
					this.filters.tags=tags
				}
				this.searchXmMenus();
			},
			showParentMenu(){
				if(this.filters.product && this.filters.product.id){
					if(this.sels.length==0){
						this.$notify({showClose:true,message:'请先选择一个或者多个需求',type:'warning'})
						return;
					}
					this.parentMenuVisible=true;
				}else{
					this.$notify({showClose:true,message:'请先选择产品',type:'warning'})
					return;
				}
				
			},
			onParentMenuSelected(menu){

				if(!menu||!menu.menuId){
					this.$notify({showClose:true,message:'请先选择一个上级需求',type:'warning'})
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
						var rows=[...this.sels,{menuId:'',pmenuId:menu.menuId}]
						treeTool.reloadAllChildren(this.$refs.table,this.maps,rows,'pmenuId',this.loadXmMenusLazy)  
					}
					this.$notify({showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
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
			XmIterationMng,
			UsersSelect,
			XmMenuMngBatch,
		    TagMng,
			XmMenuSelect,
		    //在下面添加其它组件
		},
		mounted() {   
  			initSimpleDicts("all",['menuStatus','demandSource','demandLvl','demandType','priority']).then(res=>{
				this.dicts=res.data.data;
			})
			this.filters.product=this.xmProduct
			if(this.xmProduct && this.xmProduct.id){
				this.productVisible=false;
			} 
			if(this.selProject && this.selProject.id){ 
				this.filters.taskFilterType='join-curr-project'
			}
			
			if(this.xmIteration && this.xmIteration.id){ 
				this.filters.iterationFilterType='join-curr-iteration'
			}
			this.$nextTick(() => {  
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el); 
				this.getXmMenus();
          });  
		}
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