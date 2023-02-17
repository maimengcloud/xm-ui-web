<template>
	<section>
			<el-row>
				<xm-product-select v-if="!xmProduct&&!xmIteration" style="display:inline;" :auto-select="false" :link-project-id="selProject?selProject.id:null" @row-click="onProductSelected" @clear="clearProduct"></xm-product-select>
			  	<xm-project-select v-if="!selProject" style="display:inline;" ref="xmProjectSelect" :auto-select="false" :link-product-id="xmProduct?xmProduct.id:null" @row-click="onProjectConfirm" @clear="clearProject"></xm-project-select>

				<mdp-select-dict v-model="filters.bugStatus" placeholder="状态" style="width:120px;"  clearable :dict="dicts['bugStatus']"/> 
 
				<mdp-select-dict class="hidden-md-and-down" v-model="filters.priority" placeholder="优先级"  style="width:120px;"  clearable  :dict="dicts['priority']"/>
 
				<mdp-select-dict class="hidden-md-and-down" v-model="filters.bugSeverity" placeholder="严重程度"  style="width:120px;" clearable  :dict="dicts['bugSeverity']"/>
 
				
				<el-button v-if="!filters.tags||filters.tags.length==0" @click.native="$refs.tagDialog.open()">标签</el-button>
				<el-tag v-else @click="$refs.tagDialog.open()"   closable @close="clearFiltersTag(filters.tags[0])">{{filters.tags[0].tagName.substr(0,5)}}等({{filters.tags.length}})个</el-tag>
				
				<el-input style="width:200px;" v-model="filters.key" placeholder="缺陷名称" clearable> 
				</el-input>

				<el-button @click="searchXmQuestions" type="primary" icon="el-icon-search"></el-button> 
				<el-popover
					placement="top-start"
					title="更多条件、操作"
					width="800"
					v-model="moreVisible"
					trigger="manual" > 
						<el-descriptions class="margin-top"  :column="2" border>
							<template slot="extra">
								<el-button @click="moreVisible=false" type="text" style="float:right;margin-top:-40px;"  icon="el-icon-close">关闭</el-button>
								<el-button @click="handleExport"   icon="el-icon-download">导出</el-button>
								<el-button   type="primary" style="float:right;" icon="el-icon-search" @click="searchXmQuestions">查询</el-button> 							</template>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-user"></i>
									创建者
								</template>
								<mdp-select-user-xm label="选择创建者" v-model="filters.createUser" :clearable="true"></mdp-select-user-xm>  
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-user"></i>
									指派给
								</template>
								<mdp-select-user-xm label="选择负责人" v-model="filters.handlerUser" :clearable="true"></mdp-select-user-xm>   
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-document"></i>
									需求
								</template>
								<font  v-if="  filters.menus && filters.menus.length>0">
									<el-tag  v-for="(item,index) in filters.menus" :key="index"  closable  @close="clearFiltersMenu(item)">{{item.menuName.substr(0,10)}}</el-tag>
								</font>
								<el-button v-else    @click="showMenu" type="plian" icon="el-icon-search">选需求</el-button>
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-question"></i>
									缺陷编号
								</template> 
								<el-input v-model="filters.id" style="width:200px;" clearable></el-input>
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-top"></i>
									优先级
								</template>								
								<mdp-select-dict   v-model="filters.priority" placeholder="请选择优先级" clearable style="width:200px;" :dict="dicts['priority']"/> 

							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-document-checked"></i>
									解决方案
								</template>
								<mdp-select-dict  v-model="filters.solution" placeholder="请选择解决方案" clearable style="width:200px;" :dict="dicts['bugSolution']"/> 
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-watch"></i>
									创建时间
								</template>
								<el-date-picker
									v-model="dateRanger"
									type="daterange"
									align="right"
									unlink-panels
									range-separator="至"
									start-placeholder="开始日期"
									end-placeholder="完成日期"
									value-format="yyyy-MM-dd HH:mm:ss"
									:default-time="['00:00:00','23:59:59']"
									:picker-options="pickerOptions"
								></el-date-picker>
							</el-descriptions-item>
							<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-watch-1"></i>
									更新时间
								</template>
								<el-date-picker
									v-model="ltimeRanger"
									type="daterange"
									align="right"
									unlink-panels
									range-separator="至"
									start-placeholder="更新时间"
									end-placeholder="更新时间"
									value-format="yyyy-MM-dd HH:mm:ss"
									:default-time="['00:00:00','23:59:59']"
									:picker-options="pickerOptions"
								></el-date-picker>
							</el-descriptions-item>
						</el-descriptions>

					<el-button  slot="reference" icon="el-icon-more" @click="moreVisible=!moreVisible"></el-button>
				</el-popover> 
				<span style="float:right;"> 
   					<el-button v-if="filters.selProject && filters.selProject.id"  type="primary" icon="el-icon-plus"  @click="showAdd"  round> </el-button> 
					<xm-project-select v-else style="display:inline;"  :auto-select="false" :link-product-id="xmProduct?xmProduct.id:null" @row-click="showAddAfterProjectSelect" >
						  <el-button slot="reference"  type="primary" icon="el-icon-plus"    round> </el-button>  
					</xm-project-select>
					<el-button @click="batchDel" type="danger" icon="el-icon-delete"></el-button>
				</span>
			 </el-row> 
			 <el-row class="padding-top">
				<!--列表 XmQuestion xm_question-->
				<el-table  element-loading-text="努力加载中" element-loading-spinner="el-icon-loading"  ref="table" :height="maxTableHeight" :data="xmQuestions" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 					<el-table-column  label="全选" type="selection" min-width="50"  fixed="left"></el-table-column>
					  <el-table-column prop="id" label="缺陷编号" width="120" show-overflow-tooltip fixed="left">
						<template slot-scope="scope">  
							{{scope.row.id}} 
						</template>
					  </el-table-column>
					 <el-table-column prop="name" label="缺陷名称"  min-width="400" fixed="left">
						<template slot-scope="scope">   
									 <el-link @click="showEdit(scope.row)"> {{scope.row.name}}</el-link>  
									 <span class="tool-bar">
                                     	<el-button @click="copyOne(scope.row,scope.$index)" icon="el-icon-document-copy" circle title="复制一行"></el-button> 
 									</span>
						</template>
					</el-table-column>
					<el-table-column prop="bugStatus" label="状态"  width="100">
						<template slot-scope="scope">    
										 <mdp-select-dict-tag  @visible-change="selectVisible(scope.row,$event)" v-model="scope.row.bugStatus" placeholder="类型" :dict="dicts['bugStatus']" style="display:block;"  @change="editXmQuestionSomeFields(scope.row,'bugStatus',$event)">
 										 </mdp-select-dict-tag>   
						</template>
					</el-table-column>
					<el-table-column prop="priority" label="优先级"  width="100">
						<template slot-scope="scope">    
										 <mdp-select-dict-tag @visible-change="selectVisible(scope.row,$event)" v-model="scope.row.priority" placeholder="优先级" :dict="dicts['priority']"   style="display:block;"  @change="editXmQuestionSomeFields(scope.row,'priority',$event)">
 										 </mdp-select-dict-tag>  
 						</template>
					</el-table-column> 
					<el-table-column prop="solution" label="解决方案"  width="100">
						<template slot-scope="scope">    
										 <mdp-select-dict-tag @visible-change="selectVisible(scope.row,$event)" v-model="scope.row.solution" placeholder="类型" :dict="dicts['bugSolution']"  style="display:block;"  @change="editXmQuestionSomeFields(scope.row,'solution',$event)">
 										 </mdp-select-dict-tag>   
						</template>
					</el-table-column>
					<el-table-column prop="bugSeverity" label="严重程度"  width="100">
						<template slot-scope="scope">    
										 <mdp-select-dict-tag @visible-change="selectVisible(scope.row,$event)" v-model="scope.row.bugSeverity" placeholder="类型" :dict="dicts['bugSeverity']"  style="display:block;"  @change="editXmQuestionSomeFields(scope.row,'bugSeverity',$event)">
 										 </mdp-select-dict-tag>   
						</template>
					</el-table-column>
					<!--
					<el-table-column prop="projectId" label="项目"  width="100" show-overflow-tooltip> 
						<template slot-scope="scope">   
									<div class="cell-text">
										{{scope.row.projectId}}
									</div>
									<span class="cell-bar">   
										<xm-project-select  style="display:inline;"  :auto-select="false" :link-product-id="xmProduct?xmProduct.id:null" @row-click="editXmQuestionSomeFields(scope.row,'projectId',$event)" ></xm-project-select>
									</span> 
						</template>
					</el-table-column>
					<el-table-column prop="productId" label="产品"  width="100" show-overflow-tooltip>  
						<template slot-scope="scope">   
									<div class="cell-text">
										{{scope.row.productId}}
									</div>
									<span class="cell-bar">   
										<xm-product-select  style="display:inline;"  :auto-select="false" :link-project-id="selProject?selProject.id:null" @row-click="editXmQuestionSomeFields(scope.row,'productId',$event)" ></xm-product-select>
									</span> 
						</template>
					</el-table-column>
					<el-table-column prop="askUsername" label="创建人"  width="100" show-overflow-tooltip> 
					</el-table-column>
					
					<el-table-column prop="createTime" label="创建时间" sortable width="100" show-overflow-tooltip> 
					</el-table-column>
					
					<el-table-column prop="ltime" label="更新时间" sortable  width="100" show-overflow-tooltip> 
					</el-table-column>
					-->
					<el-table-column prop="handlerUsername" label="负责人"  width="100" show-overflow-tooltip> 
						<template slot-scope="scope">    
							<mdp-select-user-xm @visible-change="selectVisible(scope.row,$event)" :key="scope.row.id" v-model="scope.row" userid-key="handlerUserid" username-key="handlerUsername" :project-id="scope.row.projectId" @change="editXmQuestionSomeFields(scope.row,'handlerUserid',$event)"></mdp-select-user-xm>
						</template>
					</el-table-column>
					<el-table-column prop="tagNames" label="标签"  width="100" show-overflow-tooltip> 
						<template slot-scope="scope">   
									<div class="cell-text">
										{{ scope.row.tagNames}}
									</div>
									<span class="cell-bar">   
										 <el-button @click="$refs.tagDialog.open({data:scope.row,action:'editTagIds'})">标签</el-button>
									</span> 
						</template>
					</el-table-column>
					<el-table-column prop="menuName" label="需求" width="100" show-overflow-tooltip></el-table-column> 
				</el-table>
			 </el-row>
			 <el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

			<!--编辑 XmQuestion xm_question界面-->
			<el-dialog  title="编辑缺陷"   :visible.sync="editFormVisible"   fullscreen  top="10px"  :close-on-click-modal="false" append-to-body>
					<xm-question-edit :sel-project=" {id:editForm.projectId,name:editForm.projectName} " :xm-product="filters.product" :xm-iteration="xmIteration" :xm-question="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit" @edit-fields="onEditFields"></xm-question-edit>
			</el-dialog>

			<!--新增 XmQuestion xm_question界面-->
			<el-dialog title="新增缺陷"  :visible.sync="addFormVisible" fullscreen  width="90%" top="10px"  append-to-body   :close-on-click-modal="false">
				<xm-question-add  :xm-menu="xmMenu" op-type="add" :xm-test-plan-case="xmTestPlanCase" :xm-test-plan="xmTestPlan" :xm-product="filters.product" :xm-iteration="xmIteration" :xm-test-case="xmTestCase" :qtype="qtype" :sel-project=" filters.selProject " :xm-question="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-question-add>
			</el-dialog>
 			<xm-group-dialog ref="xmGroupDialog" :sel-project=" filters.selProject " :is-select-single-user="1" @user-confirm="onUserConfirm"></xm-group-dialog> 
			<el-drawer append-to-body title="需求选择" :visible.sync="menuVisible"    size="60%"   :close-on-click-modal="false">
				<xm-menu-select :visible="menuVisible" :is-select-menu="true" :multi="true"  :xm-product="filters.product"  @menus-selected="onSelectedMenus" ></xm-menu-select>
			</el-drawer> 
			
 			<tag-dialog ref="tagDialog" :tagIds="filters.tags?filters.tags.map(i=>i.tagId):[]" :jump="true" @select-confirm="onTagSelected"></tag-dialog>
 	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库

	import config from '@/common/config';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmQuestion,addXmQuestion,delXmQuestion, batchDelXmQuestion, editStatus ,editXmQuestionSomeFields} from '@/api/xm/core/xmQuestion';
	import  XmQuestionAdd from './XmQuestionEdit';//新增界面
	import  XmQuestionEdit from './XmQuestionEdit';//修改界面
	import { mapGetters } from 'vuex'

	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import XmGroupDialog from '../xmGroup/XmGroupDialog';
	import XmProjectSelect from '@/views/xm/core/components/XmProjectSelect';
	import MdpSelectUserXm from "@/views/xm/core/components/MdpSelectUserXm/index";

	import  XmProductSelect from '@/views/xm/core/components/XmProductSelect';//修改界面
 	import TagDialog from '@/views/mdp/arc/tag/TagDialog.vue';
 
	export default {
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),
		},
		props: ["selProject",'qtype','xmTestPlanCase','xmTestCase','xmTestPlan','xmIteration','xmProduct','queryScene','xmMenu'],
		watch:{
			selProject:function(selProject){
				this.filters.selProject=this.selProject
				this.getXmQuestions();
			}, 
			qtype:function(){
				this.getXmQuestions()
			},
			xmIteration:function(){
				this.getXmQuestions()
			}, 
			xmProduct:function(){
				this.filters.product=this.xmProduct
				this.getXmQuestions()
			}
		},
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12 );
			return {
				filters: {
					key: '',
					bugStatus:'',
					priority:'',
					solution:'',
					bugSeverity:'', 
					handlerUser:{},
					selProject:null,
					menus:[],
					product:null,
					createUser:{},
					hisHandler:{},
					hisHandleStatus:null,
					tags:[],
					id:'',

				},
				xmQuestions: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['ltime'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
					priority:[],
					bugSeverity:[],
					bugSolution:[],
					bugStatus:[],
					bugType:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增xmQuestion界面是否显示
				//新增xmQuestion界面初始化数据
				addForm: {
					id:'',name:'',projectId:'',projectName:'',caseId:'',caseName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'',solution:'',description:'',createUserid:'',createUsername:'',createTime:'',bugStatus:'',bizProcInstId:'',bizFlowState:'',menuId:'',menuName:'',budgetWorkload:'',budgetAt:'',actWorkload:'',actAt:'',expectResult:'',opStep:'',currResult:'',refRequire:'',bugSeverity:'',bugType:'',tagIds:'',tagNames:'',urls:'',ltime:'',qtype:'',caseExecId:'',remarks:'',productId:'',repRate:'',verNum:'',vpath:'',pverNum:'',bugReason:'',rate:'',initWorkload:'',taskOut:'',taskId:'',funcId:'',funcName:'',funcPnames:'',planId:'',casedbId:'',
					attachment: [],  
					productName:''
				},
				editFormBak:{},
				editFormVisible: false,//编辑界面是否显示
				//编辑xmQuestion界面初始化数据
				editForm: {
					id:'',name:'',projectId:'',projectName:'',caseId:'',caseName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'',solution:'',description:'',createUserid:'',createUsername:'',createTime:'',bugStatus:'',bizProcInstId:'',bizFlowState:'',menuId:'',menuName:'',budgetWorkload:'',budgetAt:'',actWorkload:'',actAt:'',expectResult:'',opStep:'',currResult:'',refRequire:'',bugSeverity:'',bugType:'',tagIds:'',tagNames:'',urls:'',ltime:'',qtype:'',caseExecId:'',remarks:'',productId:'',repRate:'',verNum:'',vpath:'',pverNum:'',bugReason:'',rate:'',initWorkload:'',taskOut:'',taskId:'',funcId:'',funcName:'',funcPnames:'',planId:'',casedbId:'',
					attachment: [],  
					productName:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				selectUserVisible:false,
				selectProjectVisible:false,
				productSelectVisible:false,
				nextAction:'',
				maxTableHeight:300,
				cloumns: [
					{
						key: 'name',
						type: 'text',
						name: '缺陷名称'
					},
					{
						key: 'bugStatus',
						type: 'dict',
						name: '状态'
					},
					{
						key: 'bugSeverity',
						type: 'dict',
						name: '严重程度'
					},
					{
						key: 'priority',
						type: 'dict',
						name: '优先级'
					},
					{
						key: 'solution',
						type: 'dict',
						name: '解决方案'
					},
					{
						key: 'handlerUsername',
						type: 'text',
						name: '指派给'
					},
					{
						key: 'endTime',
						type: 'time',
						name: '到期时间'
					}
				],
				menuVisible:false,
				dateRanger: [ ],
				ltimeRanger:[
				],
				pickerOptions:  util.getPickerOptions('datarange'),
				userType:'',//createUser、handlerUser
				tagSelectVisible:false,
				moreVisible:false,
				/**end 自定义属性请在上面加 请加备注**/

			}

		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmQuestions();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmQuestions();
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
				this.getXmQuestions();
			},
			searchXmQuestions(){
				 this.pageInfo.count=true;
				 this.getXmQuestions();
			},
			//获取列表 XmQuestion xm_question
			getXmQuestions() {
				
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


				if(this.dateRanger&&this.dateRanger.length==2){ 
					params.createTimeStart=this.dateRanger[0]
					params.createTimeEnd=this.dateRanger[1]
				}
				if( this.filters.bugStatus!=null && this.filters.bugStatus!="" ){
					params.bugStatus=this.filters.bugStatus
				}
				if( this.filters.solution!=null && this.filters.solution!=""){
					params.solution=this.filters.solution
				}
				if( this.filters.priority!=null && this.filters.priority!=""){
					params.priority=this.filters.priority
				}
				if( this.filters.bugSeverity!=null && this.filters.bugSeverity!=""){
					params.bugSeverity=this.filters.bugSeverity
				}
				if( this.filters.handlerUser!=null && this.filters.handlerUser.userid){
					params.handlerUserid=this.filters.handlerUser.userid
				}
				if(this.filters.menus && this.filters.menus.length==1){
					params.menuId=this.filters.menus[0].menuId
 				}else if(this.filters.menus && this.filters.menus.length>1){
					params.menuIds=this.filters.menus.map(i=>i.menuId)
 				}

				if(this.filters.product){
					params.productId=this.filters.product.id
				}
				if(this.filters.createUser){
					params.createUserid=this.filters.createUser.userid;
				}
				if(this.filters.hisHandler && this.filters.hisHandler.userid){
					if(this.filters.hisHandleStatus){
						params.hisHandlerUserid=this.filters.hisHandler.userid;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: "请选择曾经的缺陷状态", type: 'error' });
						return;
					}

				}
				if(this.filters.id){
					params.id=this.filters.id
				}
				if(this.filters.hisHandleStatus){
					if(this.filters.hisHandler&& this.filters.hisHandler.userid){
						params.hisHandleStatus=this.filters.hisHandleStatus
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: "请选择曾经的执行人", type: 'error' });
						return;
					}

				}

				if(this.ltimeRanger && this.ltimeRanger.length>=2){
					params.ltimeStart=this.ltimeRanger[0]
					params.ltimeEnd=this.ltimeRanger[1]
				}

				this.load.list = true;
				if(this.filters.selProject){
					params.projectId = this.filters.selProject.id;
				}
				if(this.xmTestPlanCase){
					params.planId=this.xmTestPlanCase.planId 
					params.caseId=this.xmTestPlanCase.caseId
				}
				
				if(this.xmTestPlan){
					params.planId=this.xmTestPlan.id  
					params.projectId=this.xmTestPlan.projectId
				}
				if(this.xmTestCase){
					params.caseId=this.xmTestCase.id
				}
				if(this.xmIteration){
					params.linkIterationId=this.xmIteration.id
				}

				if(this.xmMenu){
					params.menuId=this.xmMenu.menuId
				}

				if(this.filters.key){
					params.key='%'+this.filters.key+'%'
				}
				if(this.filters.tags && this.filters.tags.length>0){
					params.tagIdList=this.filters.tags.map(i=>i.tagId)
				}
				//params.qtype=this.qtype
				listXmQuestion(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmQuestions = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
			selectVisible(row,visible){
				if(visible){
					this.rowClick(row)
				}
			},
			clearProduct(){
				this.filters.product=null;
				this.searchXmQuestions();
			},
			showProductVisible(){
				this.productSelectVisible=true;
			},
			onProductSelected(product){
				this.filters.product=product;
				this.productSelectVisible=false;
				this.searchXmQuestions();
			},
			showMenu(){
				this.menuVisible=true;
			},

			onSelectedMenus(menus){
				if(!menus || menus.length==0){
					this.menuVisible=false
					return;
				}
				this.menuVisible=false

				this.filters.menus=menus;
				this.searchXmQuestions();
			},
			clearFiltersMenu(menu){
				var index=this.filters.menus.findIndex(i=>i.menuId==menu.menuId)
				this.filters.menus.splice(index,1); 
			},
			clearFiltersTag(tag){
				var index=this.filters.tags.findIndex(i=>i.tagId==tag.tagId)
				this.filters.tags.splice(index,1);
				this.searchXmQuestions();
			},
			//显示编辑界面 XmQuestion xm_question
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmQuestion xm_question
			showAdd: function () { 
				if(!this.filters.selProject){ 
					this.$notify({position:'bottom-left',showClose:true,message: "请先选中项目", type: 'warning' });
					this.$refs.xmProjectSelect.projectVisible=true;
					this.nextAction="showAdd" 
					return;
				}
				this.addFormVisible = true;
			},
			showAddAfterProjectSelect(project){ 
				this.filters.selProject=project;
				this.addFormVisible = true;
				this.searchXmQuestions();
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmQuestions();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getXmQuestions();
			},
			//选择行xmQuestion
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除xmQuestion
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { id: row.id };
					delXmQuestion(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getXmQuestions();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmQuestion
			batchDel: function () {
				if(this.sels.length<=0){
					this.$notify({position:'bottom-left',showClose:true,message:"请选择要删除的缺陷", type: "error"});
					return ;
				}
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmQuestion(this.sels.map(k=>{return {id:k.id}})).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmQuestions();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.editForm=row;
				this.editFormBak={...row}
			},



			isEmpty(str) {
				return str == null || str == "";
			},
			formatDate(time,isDate) {
				const date = new Date(time);
				const m = date.getMonth()+1;
				const d = date.getDate();
				const h = date.getHours()<10 ? "0"+date.getHours() : date.getHours();
				const min = date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
				const s = date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
				return date.getFullYear()+"-"+(m < 10 ? "0"+m : m)+"-"+ (d < 10 ? "0"+d : d) + " " + h+":"+min+":"+s;
			},
			changeBugStatus(val){
				this.filters.bugStatus= val;
				this.getXmQuestions();
			},
			changeHisHandleStatus(val){
				this.filters.hisHandleStatus= val;
				this.getXmQuestions();
			},
			changeBugSeverity(val){
				this.filters.bugSeverity= val;
				this.getXmQuestions();
			},
			changeSolution(val){
				this.filters.solution= val;
				this.getXmQuestions();
			},
			changePriority(val){
				this.filters.priority= val;
				this.getXmQuestions();
			},
			formatterDate: function(row,column,cellValue, index){
				if(cellValue){
					return cellValue.substr(0,10);
				}else{
					return ""
				}
			},

			formatterOption: function(row,column,cellValue, index){
				var columnName=column.property;
				var key="";
				if(columnName=='bugStatus'){
					key="bugStatus"
				}else if(columnName=='bugType'){
					key="bugType"
				}else if(columnName=='solution'){
					key="bugSolution"
				}else if(columnName=='bugSeverity'){
					key="bugSeverity"
				}else if(columnName=='priority'){
					key="priority"
				}else{
					return cellValue
				}
				if(this.dicts[key]==undefined || this.dicts[key]==null || this.dicts[key].length==0   ){
					return cellValue;
				}
				var list=this.dicts[key].filter(i=>i.id==cellValue)
				if(list.length>0){
					return list[0].name
				}else{
					return cellValue;
				}

			},
			formatterPriorityDicts(cellValue){
				var key="priority";  
				if(this.dicts[key]==undefined || this.dicts[key]==null || this.dicts[key].length==0   ){
					return {id:cellValue,name:cellValue,className:'primary'};
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
					return data;
				}else{
					return {id:cellValue,name:cellValue,className:'primary'}
				}

			},
			formatterBugStatusDicts: function(cellValue){
				var key="bugStatus";  
				if(this.dicts[key]==undefined || this.dicts[key]==null || this.dicts[key].length==0   ){
					return {id:cellValue,name:cellValue,className:'primary'};
				}
				var list=this.dicts[key].filter(i=>i.id==cellValue)
				if(list.length>0){
					var data= {...list[0],className:'primary'}
					if(data.id=='1'){
						data.className='primary'
					}else if(data.id=='2'){
						data.className='primary'
					}else if(data.id=='3'){
						data.className='success'
					}else if(data.id=='4'){
						data.className='warning'
					}else if(data.id=='5'){
						data.className='success'
					}else if(data.id=='6'){
						data.className='info'
					}else if(data.id=='7'){
						data.className='info'
					}else{
						data.className='danger'
					}
					return data;
				}else{
					return {id:cellValue,name:cellValue,className:'primary'}
				}

			}, 
			showGroupUsers:function(userType,row){
 				this.$refs.xmGroupDialog.open({data:row,action:userType})
			},
			 
			handleExport() {
				this.downloadLoading = true
				let header = [];
				let keyList = [];
				this.cloumns.forEach(d => {
					header.push(d.name);
					keyList.push(d.key);
				});
				console.log('this.$route==', this.$route);
				const filename = `${this.$route.meta.title}_第${this.pageInfo.pageNum}页`;
				const data = this.formatJson(keyList, this.xmQuestions);
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
			formatJson(filterVal, jsonData) {
				console.log('this.dicts==', this.dicts);

				return jsonData.map(v => filterVal.map(j => {
					let key = '';
					if (j === 'timestamp') {
						return parseTime(v[j])
					} else if(j == 'bugStatus') {
						key = "bugStatus"
					} else if(j == 'bugType') {
						key = "bugType"
					} else if(j == 'solution') {
						key = "bugSolution"
					} else if(j == 'bugSeverity') {
						key = "bugSeverity"
					} else if(j == 'priority') {
						key = "priority"
					} else {
						return v[j];
					}
					if(this.dicts[key]==undefined || this.dicts[key]==null || this.dicts[key].length==0){
						return v[j];
					}
					var rowData = this.dicts[key].find(i => i.id == v[j]);
					if(rowData){
						return rowData.name;
					}else{
						return v[j];
					}
				}))
			},
			/**end 自定义函数请在上面加**/

			onUserConfirm:function(groupUsers,option){
				if(option.action=='createUser'){
					if(groupUsers==null || groupUsers.length==0){
						this.filters.createUser=null
					}else{
						var user=groupUsers[0]
						this.filters.createUser=user
					}
				}else if(option.action=='hisHandler'){
					if(groupUsers==null || groupUsers.length==0){
						this.filters.hisHandler=null
					}else{
						var user=groupUsers[0]
						this.filters.hisHandler=user
					}
				}else if(option.action=='editHandlerUserid'){
					 this.editXmQuestionSomeFields(option.data,"handlerUserid",groupUsers)
					 return;
				}  
				this.selectUserVisible=false 

			}, 
			onProjectConfirm:function(project){
				this.filters.selProject=project
				this.selectProjectVisible=false;

				if( this.nextAction=='showAdd'){
					this.showAdd()
				}else if( this.nextAction=='showGroupUsers'){
					this.showGroupUsers(this.userType)
				}else{
					this.searchXmQuestions();
				}
				this.nextAction=null
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
				// 传过来的参数格式
				if(row.flowState=='1'){
					this.$notify.error("已经发起，不允许重复发起");
					return;
				}
				let extVars={projectId:row.projectId,branchId:this.userInfo.branchId,questionId:row.id}
				let jsonExtVars=JSON.stringify(extVars);

				var currDomain=window.location.protocol+"//"+window.location.host;
				var fullPath=this.$route.fullPath;
				var bizUrl=currDomain+'/#'+fullPath+'?extVars='+jsonExtVars

				let params={
					bizKey:bizKey,
					bizUrl:bizUrl,
					resUrl:'',
					bizPkid:row.id,
					bizParentPkid:row.id,
					mainContext:'',
					extVars:extVars,
					flowVars:{
						subscribeTaskEvent:'TASK_COMPLETED',
						data:{
							id:row.id,
							branchId:this.userInfo.branchId,
							projectId:row.projectId,

						}
					},
				}
				if(bizKey=="xm_question_up_approva"){
					//预算变更审核
					params.mainTitle='关于缺陷【'+row.name+"】升级的申请";
					params.mainContext='项目编号：'+row.projectId+','+'项目名称：'+row.projectName+',任务名称：'+row.taskName
										+'<br>'+row.askUsername+'于'+row.createTime+'提出缺陷('+row.id+')：'+row.name
										+'<br>缺陷描述：'+row.description;
					params.restUrl=config.getXmBasePath()+"/xm/core/xmQuestion/processApprova";
					this.$router.push({name:'ProcdefListForBizStart',params:params});

				}else {
					this.$notify.error("不支持的审批事项");
					return;
				}
				//this.$store.dispatch('addVisitedViews', {path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}})
			},
			clearProject(){
				this.filters.selProject=null
				this.nextAction=""
				this.searchXmQuestions()
			}, 
			handleCommand(command) {
				if(command.type=='sendToProcessApprova'){
					this.sendToProcessApprova(command.data,command.bizKey);
				}
			}, 
			getBadge(row){
				var msg="";
				if(row.bugStatus=='closed'){
					return ""
				}
				if(row.handlerUsername){
					if(row.remarks){
						var remarks=row.remarks;
						remarks=remarks.replace(/<\w?>/g,""); 
						remarks=remarks.replace(/<\/\w?>/g,"");
						if(remarks.length<=10){
							msg='已指派给'+row.handlerUsername+','+remarks
						}else{
							msg='已指派给'+row.handlerUsername+','+remarks.substr(0,10)+"..."
						}
						
					}else{
						msg='已指派给'+row.handlerUsername;
					}
				}else{
					msg=row.createUsername+'创建的缺陷'
				}
				return msg;
			},
			
			onTagSelected(tags,option) { 
				if(option.action=="editTagIds"){
					this.editXmQuestionSomeFields(option.data,"tagIds",tags);
				}else{
					if (!tags || tags.length == 0) { 
						this.filters.tags=[]
					}else{
						this.filters.tags=tags
					}
					this.searchXmQuestions();
				}
				
			}, 
			editXmQuestionSomeFields(row,fieldName,$event){
				
				var params={ids:[row.id]};
				if(this.sels.length>0){
					if(!this.sels.some(k=>k.id==row.id)){
						this.$notify({position:'bottom-left',showClose:true,message:'请操作选中的行或者取消选中的行再操作其它行',type:'warning'})
						return;
					}
					params.ids=this.sels.map(i=>i.id)
				}
				if(fieldName==='handlerUserid'){
					if($event){ 	
						params[fieldName]=$event[0].userid;
						params.handlerUsername=$event[0].username 
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
				}else if(fieldName==='projectId'){
					params.projectId=$event.id
				}else if(fieldName==='productId'){
					params.productId=$event.id
				}else{
					params[fieldName]=$event
				}
				
				editXmQuestionSomeFields(params).then(res=>{
					var tips = res.data.tips;
					if(tips.isOk){ 
						if(this.sels.length>0){
							this.getXmQuestions();
						}else{ 
							Object.assign(row,params) 
						}
					}else{
						Object.assign(row,this.editFormBak) 
						this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
					}
				})
			},
			/**
			 * 'bugSeverity','bugSolution','bugStatus','bugType','priority'bugRepRate
			 */
			formaterByDicts(row,property,cellValue){ 
				var property=property
				var dict=null;
				if(property=='bugSeverity'){
					dict=this.dicts['bugSeverity']
				}else if(property=='solution'){
					dict=this.dicts['bugSolution']
				}else if(property=='bugStatus'){
					dict=this.dicts['bugStatus']
				}else if(property=='priority'){
					dict=this.dicts['priority']
				}else if(property=='bugType'){
					dict=this.dicts['bugType']
				}else if(property=='repRate'){
					dict=this.dicts['bugRepRate']
				}  
				if(!dict){
					return cellValue;
				}else{
					var item=dict.find(i=>i.id==cellValue)
					return item?item.name:cellValue;
				}
			},
			onEditFields(row){
				Object.assign(this.editForm,row) 
			},
			
			copyOne(row,index){
				
				var params={...row}
				params.id=null;
				params.createUserid=this.userInfo.userid
				params.createUsername=this.userInfo.username 
				params.bugStatus="1"
				params.name=row.name+'V'
				addXmQuestion(params).then(res=>{
					var tips = res.data.tips
					if(tips.isOk){ 
						var row2=res.data.data
						this.xmQuestions.splice(index+1,0,row2)
						this.pageInfo.total=this.pageInfo.total+1
						this.$message.success("复制成功")
					}else{
						this.$message.error(tips.msg)
					}
				})
			}
		},//end methods
		components: {
				'xm-question-add':XmQuestionAdd,
				'xm-question-edit':XmQuestionEdit,
				XmGroupDialog,XmProjectSelect,xmMenuSelect,XmProductSelect, TagDialog,MdpSelectUserXm,
				//在下面添加其它组件
		},
		mounted() {
			if(this.selProject){
				this.filters.selProject={...this.selProject}
			}
			if(this.xmProduct){
				this.filters.product={...this.xmProduct}
			}
			if(this.queryScene=='my'){
				this.filters.handlerUserid=this.userInfo.userid;
				this.filters.handlerUsername=this.userInfo.username;
			}
			
			this.$nextTick(() => {
				
				
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);
				this.getXmQuestions();
			});
				initSimpleDicts('all',['bugSeverity','bugSolution','bugStatus','bugType','priority','bugRepRate']).then(res=>{
					if(res.data.tips.isOk){ 
						this.dicts=res.data.data;
					}
				});
		}
	}

</script>

<style lang="scss" scoped>
 

.align-right{
	float: right;
}
.badge {
  margin-top: 7px;
  padding-bottom: 10px;
}
.badge-item {
  margin-top: 10px;
  margin-right: 40px;
}

>>> .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
     width: 250px;
}
</style>
