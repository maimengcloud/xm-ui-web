<template>
	<section class="padding">
			<el-row>
			  	<el-select v-model="filters.bugStatus" placeholder="状态" style="width:100px;"  clearable @change="changeBugStatus">
					<el-option v-for="(b,index) in options['bugStatus']" :value="b.optionValue"  :key="index" :label="b.optionName">{{b.optionName}}
					</el-option>
				</el-select>
				<el-select class="hidden-md-and-down" v-model="filters.priority" placeholder="紧急程度"  style="width:120px;"  clearable @change="changePriority">
					<el-option v-for="(b,index) in options['urgencyLevel']" :value="b.optionValue" :key="index" :label="b.optionName">{{b.optionName}}
					</el-option>
				</el-select>
				<el-select class="hidden-md-and-down" v-model="filters.bugSeverity" placeholder="严重程度"  style="width:120px;" clearable @change="changeBugSeverity">
					<el-option v-for="(b,index) in options['bugSeverity']" :value="b.optionValue" :key="index" :label="b.optionName">{{b.optionName}}
					</el-option>
				</el-select>
				<el-input style="width:200px;" v-model="filters.key" placeholder="缺陷名称" clearable> 
				</el-input>
				<el-button @click="searchXmQuestions" type="primary" icon="el-icon-search"></el-button>
				
				<el-button v-if="!filters.tags||filters.tags.length==0" @click.native="tagSelectVisible=true">标签</el-button>
				<el-tag v-else @click="tagSelectVisible=true"   closable @close="clearFiltersTag(filters.tags[0])">{{filters.tags[0].tagName.substr(0,5)}}等({{filters.tags.length}})个</el-tag>
 
				<el-button type="primary" icon="el-icon-plus" @click="showAdd">
				</el-button>
				<el-popover
					placement="top-start"
					title="更多查询条件或操作"
					width="600"
					trigger="click" >
					<el-row>
						<el-col :span="24" style="padding-top:5px;">
							<font class="more-label-font">产品:</font><el-tag    v-if="  filters.product "  closable    @close="clearProduct">{{this.filters.product.productName}}</el-tag>
							<el-button v-else    @click="showProductVisible" type="plian">选产品</el-button>
						</el-col>
						<el-col :span="24"  style="padding-top:12px;" v-if="!selProject">
							<font class="more-label-font">项目:</font>
							<el-tag v-if="filters.selProject && !selProject" closable @close="clearProject" @click="showProjectList(true)">{{ filters.selProject.name }}</el-tag>
							<el-button v-else @click="showProjectList(true)" >选择项目</el-button> 
						</el-col>
						<el-col :span="24"  style="padding-top:12px;">
							<font class="more-label-font">需求:</font>
							<el-button v-if=" !filters.menus || filters.menus.length==0" @click="showMenu"> 需求</el-button>
							<el-tag v-else  @click="showMenu"  closable @close="clearFiltersMenu(filters.menus[0])">{{filters.menus[0].menuName.substr(0,5)}}等({{filters.menus.length}})个</el-tag>
						</el-col>
						<el-col :span="24" style="padding-top:12px;">
							<font class="more-label-font">创建者:</font>
							<el-button v-if="!filters.createUser" @click="showGroupUsers('createUser')">选择创建人</el-button>
							<el-tag v-else closable @close="clearCreateUser"  @click="showGroupUsers('createUser')">{{filters.createUser.username}}</el-tag>
							<el-button v-if="!filters.createUser||filters.createUser.userid!=userInfo.userid" @click="setFiltersCreateUserAsMySelf">我的</el-button>
						</el-col>
						<el-col :span="24" style="padding-top:12px;">
							<font class="more-label-font">指派给:</font>
							<el-button v-if="!filters.handlerUsername" @click="showGroupUsers('handlerUser')">选择被指派人</el-button>
							<el-tag v-else closable @close="clearHandler"  @click="showGroupUsers('handlerUser')">{{filters.handlerUsername}}</el-tag>
							<el-button v-if="filters.handlerUserid!=userInfo.userid" @click="setFiltersHandlerAsMySelf">我的</el-button>
						</el-col>

						<el-col :span="24" style="padding-top:12px;">
							曾经由<el-button v-if="!filters.hisHandler||!filters.hisHandler.userid" @click="showGroupUsers('hisHandler')">执行人</el-button>
							<el-tag v-else closable @close="clearHisHandler"  @click="showGroupUsers('hisHandler')">{{filters.hisHandler.username}}</el-tag>
							<el-button v-if="!filters.hisHandler||filters.hisHandler.userid!=userInfo.userid" @click="setFiltersHisHandlerAsMySelf">我的</el-button>
							变更状态为
							<el-select v-model="filters.hisHandleStatus" placeholder="请选择状态"  clearable @change="changeHisHandleStatus">
								<el-option v-for="(b,index) in options['bugStatus']" :value="b.optionValue"  :key="index" :label="b.optionName">{{b.optionName}}
								</el-option>
							</el-select>的缺陷
						</el-col>
						<el-col :span="24" style="padding-top:5px;">
								<font class="more-label-font">需求:</font>
							<font  v-if="  filters.menus && filters.menus.length>0">
								<el-tag  v-for="(item,index) in filters.menus" :key="index"  closable  @close="clearFiltersMenu(item)">{{item.menuName.substr(0,10)}}</el-tag>
							</font>
							<el-button v-else    @click="showMenu" type="plian">选需求</el-button>
						</el-col>
						<el-col :span="24" class="hidden-lg-and-up" style="padding-top:12px;">
							<el-select   v-model="filters.priority" placeholder="请选择紧急程度" clearable @change="changePriority">
								<el-option v-for="(b,index) in options['urgencyLevel']" :value="b.optionValue" :key="index" :label="b.optionName">{{b.optionName}}
								</el-option>
							</el-select>
						</el-col>
						<el-col :span="24"  style="padding-top:12px;">
							<el-select  v-model="filters.solution" placeholder="请选择解决方案" clearable @change="changeSolution">
								<el-option v-for="(b,index) in options['bugSolution']" :value="b.optionValue" :key="index" :label="b.optionName">{{b.optionName}}
								</el-option>
							</el-select>
						</el-col>
						<el-col  :span="24"  style="padding-top:5px;">
							<font class="more-label-font">创建时间:</font>
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
						</el-col>
						<el-col  :span="24"  style="padding-top:5px;">
							<font class="more-label-font">最后更新时间:</font>
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
						</el-col>
						<el-col :span="24" style="padding-top:5px;">
							<el-button   type="primary" icon="el-icon-search" @click="searchXmQuestions">查询</el-button>
							<el-button @click="handleExport"   icon="el-icon-download">导出</el-button>
						</el-col>
					</el-row>
					<el-button  slot="reference" icon="el-icon-more"></el-button>
				</el-popover> 
			 </el-row> 
			 <el-row class="padding-top">
				<!--列表 XmQuestion xm_question-->
				<el-table  ref="table" :height="maxTableHeight" :data="xmQuestions" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 					<el-table-column  label="序号" type="index" min-width="50"></el-table-column>
					 <el-table-column prop="name" label="缺陷名称"  min-width="150" show-overflow-tooltip>
						<template slot-scope="scope"> 
								<el-link @click="showEdit(scope.row)" type="primary"> 
									<el-tag type="info" v-if="scope.row.bugSeverity=='4' ">{{formatterOption(scope.row,{property:'bugSeverity'},scope.row.bugSeverity)}}</el-tag>
									<el-tag type="primary" v-else-if="scope.row.bugSeverity=='3'">{{formatterOption(scope.row,{property:'bugSeverity'},scope.row.bugSeverity)}}</el-tag>
									<el-tag type="warning" v-else-if="scope.row.bugSeverity=='2'">{{formatterOption(scope.row,{property:'bugSeverity'},scope.row.bugSeverity)}}</el-tag>
									<el-tag type="danger" v-else-if="scope.row.bugSeverity=='1'">{{formatterOption(scope.row,{property:'bugSeverity'},scope.row.bugSeverity)}}</el-tag>
									<el-tag v-else>{{formatterOption(scope.row,{property:'bugSeverity'},scope.row.bugSeverity)}}</el-tag> 
									&nbsp;&nbsp;
								</el-link>   
								{{scope.row.name}}
						</template>
					</el-table-column>
					<el-table-column prop="bugStatus" label="状态"  width="100">
						<template slot-scope="scope"> 
 								<el-tag type="info" v-if="scope.row.bugStatus=='create' ">创建</el-tag>
								<el-tag type="primary" v-else-if="scope.row.bugStatus=='active'">已激活</el-tag>
								<el-tag type="warning" v-else-if="scope.row.bugStatus=='confirm'">确认</el-tag>
								<el-tag type="warning" v-else-if="scope.row.bugStatus=='confirmed'">已确认</el-tag>
								<el-tag type="success" v-else-if="scope.row.bugStatus=='solve'">解决</el-tag>
								<el-tag type="success" v-else-if="scope.row.bugStatus=='resolved'">已解决</el-tag>
								<el-tag type="success" v-else-if="scope.row.bugStatus=='close'">关闭</el-tag>
								<el-tag type="success" v-else-if="scope.row.bugStatus=='closed'">已关闭</el-tag>
								<el-tag v-else>{{scope.row.bugStatus}}</el-tag>   
						</template>
					</el-table-column>
					<el-table-column prop="askUsername" label="创建人"  width="100" show-overflow-tooltip> 
					</el-table-column>
					
					<el-table-column prop="createTime" label="创建时间" sortable width="100" show-overflow-tooltip> 
					</el-table-column>
					
					<el-table-column prop="ltime" label="更新时间" sortable  width="100" show-overflow-tooltip> 
					</el-table-column>
					<el-table-column prop="handlerUsername" label="指派给"  width="100" show-overflow-tooltip> 
					</el-table-column>
					<el-table-column prop="tagNames" label="标签"  width="100" show-overflow-tooltip> 
					</el-table-column>
					<el-table-column prop="menuName" label="需求" width="100" show-overflow-tooltip></el-table-column>
					<el-table-column   v-if="!isMultiSelect"  header-align="center" label="操作" fixed="right" width="100">
						<template slot-scope="scope">
							<el-button  :disabled="scope.row.ntype=='1'"  type="primary" @click.stop="showEdit(scope.row)" >编辑</el-button> 	
						</template>
					</el-table-column>
				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
			 </el-row>
			<!--编辑 XmQuestion xm_question界面-->
			<el-drawer  title="编辑缺陷"   :visible.sync="editFormVisible" :with-header="false"  size="70%"    :close-on-click-modal="false">
					<xm-question-edit :sel-project=" {id:editForm.projectId,name:editForm.projectName} " :xm-question="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-question-edit>
			</el-drawer>

			<!--新增 XmQuestion xm_question界面-->
			<el-drawer title="新增缺陷"  :visible.sync="addFormVisible" :with-header="false" size="70%"  append-to-body   :close-on-click-modal="false">
				<xm-question-add :xm-test-case-exec="xmTestCaseExec" :xm-test-case="xmTestCase" :qtype="qtype" :sel-project=" filters.selProject " :xm-question="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-question-add>
			</el-drawer>
			<el-drawer title="选中用户" v-if=" filters.selProject " :visible.sync="selectUserVisible"  size="70%"  append-to-body   :close-on-click-modal="false">
				<xm-group-mng  :sel-project=" filters.selProject " :is-select-single-user="1" @user-confirm="onUserConfirm"></xm-group-mng>
			</el-drawer>
			<el-drawer title="选中项目" :visible.sync="selectProjectVisible"  size="70%"  append-to-body   :close-on-click-modal="false">
				<xm-project-list    @project-confirm="onPorjectConfirm"></xm-project-list>
			</el-drawer>

			<el-drawer append-to-body title="需求选择" :visible.sync="menuVisible"    size="70%"   :close-on-click-modal="false">
				<xm-menu-select :visible="menuVisible" :is-select-menu="true" :multi="true"    @menus-selected="onSelectedMenus" ></xm-menu-select>
			</el-drawer>

			<el-drawer title="选择产品" :visible.sync="productSelectVisible"  size="70%"  append-to-body   :close-on-click-modal="false">
					<xm-product-select   :isSelectProduct="true" :selProject="filters.selProject" :visible="productSelectVisible" @cancel="productSelectVisible=false" @selected="onProductSelected"></xm-product-select>
			</el-drawer>
			
			<el-drawer append-to-body title="标签条件" :visible.sync="tagSelectVisible"  :close-on-click-modal="false" size="60%">
				<tag-mng :tagIds="filters.tags?filters.tags.map(i=>i.tagId):[]" :jump="true" @select-confirm="onTagSelected">
				</tag-mng>
			</el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库

	import config from '@/common/config';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmQuestion, delXmQuestion, batchDelXmQuestion, editStatus } from '@/api/xm/core/xmQuestion';
	import  XmQuestionAdd from './XmQuestionAdd';//新增界面
	import  XmQuestionEdit from './XmQuestionEdit';//修改界面
	import { mapGetters } from 'vuex'

	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import XmGroupMng from '../xmProjectGroup/XmProjectGroupMng';
	import XmProjectList from '../xmProject/XmProjectList';

	import  XmProductSelect from '../xmProduct/XmProductSelect';//修改界面
  	import TagMng from "@/views/mdp/arc/tag/TagMng";

	export default {
		computed: {
			...mapGetters([
				'userInfo','roles'
			]),
		},
		props: ["selProject",'qtype','xmTestCaseExec','xmTestCase','xmIteration','xmProduct','queryScene'],
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
					handlerUserid:'',
					handlerUsername:'',
					selProject:null,
					menus:[],
					product:null,
					createUser:null,
					hisHandler:null,
					hisHandleStatus:null,
					tags:[],

				},
				xmQuestions: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['ltime'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{
					urgencyLevel:[],
					bugSeverity:[],
					bugSolution:[],
					bugStatus:[],
					bugType:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增xmQuestion界面是否显示
				//新增xmQuestion界面初始化数据
				addForm: {
					id:'',name:'',projectId:'',projectName:'',taskId:'',taskName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'3',solution:'',processTime:'',receiptMessage:'',receiptTime:'',description:'',createUserid:'',createUsername:'',createTime:'',bugStatus:'',bugSeverity:'3',
					attachment: [],
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmQuestion界面初始化数据
				editForm: {
					id:'',name:'',projectId:'',projectName:'',taskId:'',taskName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'',solution:'',processTime:'',receiptMessage:'',receiptTime:'',description:'',createUserid:'',createUsername:'',createTime:'',bugStatus:'',bugSeverity:'3',
					attachment: [],
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
						name: '紧急程度'
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
				pickerOptions:  util.pickerOptions('datarange'),
				userType:'',//createUser、handlerUser
				tagSelectVisible:false,
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
				if( this.filters.handlerUserid!=null && this.filters.handlerUserid!=""){
					params.handlerUserid=this.filters.handlerUserid
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
				if(this.filters.hisHandler){
					if(this.filters.hisHandleStatus){
						params.hisHandlerUserid=this.filters.hisHandler.userid;
					}else{
						this.$notify({showClose: true, message: "请选择曾经的缺陷状态", type: 'error' });
						return;
					}

				}
				if(this.filters.hisHandleStatus){
					if(this.filters.hisHandler){
						params.hisHandleStatus=this.filters.hisHandleStatus
					}else{
						this.$notify({showClose: true, message: "请选择曾经的执行人", type: 'error' });
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
				if(this.xmTestCaseExec){
					params.caseExecId=this.xmTestCaseExec.id
				}
				if(this.xmTestCase){
					params.caseId=this.xmTestCase.id
				}
				if(this.xmIteration){
					params.iterationId=this.xmIteration.id
				}

				if(this.filters.key){
					params.key='%'+this.filters.key+'%'
				}
				if(this.filters.tags && this.filters.tags.length>0){
					params.tagIdList=this.filters.tags.map(i=>i.tagId)
				}
				params.qtype=this.qtype
				listXmQuestion(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmQuestions = res.data.data;
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
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
				this.searchXmQuestions();
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
				if(this.filters.selProject==null){

					this.$notify({showClose: true, message: "请先选中项目", type: 'success' });
					this.nextAction="showAdd"
					this.showProjectList();
					return;
				}
				this.addFormVisible = true;
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
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmQuestion
			batchDel: function () {
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmQuestion(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmQuestions();
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.editForm=row;
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
					key="urgencyLevel"
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
			showSolveName:function(row){
				if(row.bugStatus=='active'){
					return "去确认"
				}else if(row.bugStatus=='confirmed'){
					return "去解决"
				}else if(row.bugStatus=='resolved'){
					return "去关闭"
				}else if(row.bugStatus=='closed'){
					return "激活"
				}
			},
			showGroupUsers:function(userType){
				this.userType=userType;
				if(this.filters.selProject==null || this.filters.selProject.id==''){
					this.$notify({showClose: true, message: "请先选中项目", type: 'success' });
					this.nextAction="showGroupUsers"
					this.showProjectList();
					return;
				}
				this.selectUserVisible=true;
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
				console.log('this.options==', this.options);

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
						key = "urgencyLevel"
					} else {
						return v[j];
					}
					if(this.options[key]==undefined || this.options[key]==null || this.options[key].length==0){
						return v[j];
					}
					var rowData = this.options[key].find(i => i.optionValue == v[j]);
					if(rowData){
						return rowData.optionName;
					}else{
						return v[j];
					}
				}))
			},
			/**end 自定义函数请在上面加**/

			onUserConfirm:function(groupUsers){
				if(this.userType=='createUser'){
					if(groupUsers==null || groupUsers.length==0){
						this.filters.createUser=null
					}else{
						var user=groupUsers[0]
						this.filters.createUser=user
					}
				}else if(this.userType=='hisHandler'){
					if(groupUsers==null || groupUsers.length==0){
						this.filters.hisHandler=null
					}else{
						var user=groupUsers[0]
						this.filters.hisHandler=user
					}
				}else{
					if(groupUsers==null || groupUsers.length==0){
						this.filters.handlerUserid=''
						this.filters.handlerUsername='';
					}else{
						var user=groupUsers[0]
							this.filters.handlerUserid=user.userid
							this.filters.handlerUsername=user.username
					}
				}

				this.selectUserVisible=false
				this.searchXmQuestions();

			},
			showProjectList:function(clear){
				if(clear){
					this.nextAction="";
				}
				this.selectProjectVisible=true;
			},
			onPorjectConfirm:function(project){
				this.filters.selProject=project
				this.selectProjectVisible=false;

				if(this.nextAction=='showAdd'){
					this.showAdd()
				}else if(this.nextAction=='showGroupUsers'){
					this.showGroupUsers(this.userType)
				}else{
					this.searchXmQuestions();
				}
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
			clearCreateUser(){
				this.filters.createUser=null;
				this.searchXmQuestions();
				this.nextAction=""
			},
			clearHandler(){

				this.filters.handlerUserid=''
				this.filters.handlerUsername='';
				this.searchXmQuestions();
				this.nextAction=""
			},
			clearHisHandler(){

				this.filters.hisHandler=null
				this.searchXmQuestions();
				this.nextAction=""
			},
			handleCommand(command) {
				if(command.type=='sendToProcessApprova'){
					this.sendToProcessApprova(command.data,command.bizKey);
				}
			},
			setFiltersHandlerAsMySelf(){
				this.filters.handlerUserid=this.userInfo.userid;
				this.filters.handlerUsername=this.userInfo.username;
				this.searchXmQuestions();
			},
			setFiltersCreateUserAsMySelf(){
				this.filters.createUser=this.userInfo
 				this.searchXmQuestions();
			},
			setFiltersHisHandlerAsMySelf(){
				this.filters.hisHandler=this.userInfo
 				this.searchXmQuestions();
			},
			getBadge(row){
				var msg="";
				if(row.bugStatus=='closed'){
					return ""
				}
				if(row.handlerUsername){
					if(row.lremark){
						var lremark=row.lremark;
						lremark=lremark.replace(/<\w?>/g,""); 
						lremark=lremark.replace(/<\/\w?>/g,"");
						if(lremark.length<=10){
							msg='已指派给'+row.handlerUsername+','+lremark
						}else{
							msg='已指派给'+row.handlerUsername+','+lremark.substr(0,10)+"..."
						}
						
					}else{
						msg='已指派给'+row.handlerUsername;
					}
				}else{
					msg=row.createUsername+'创建的缺陷'
				}
				return msg;
			},
			
			onTagSelected(tags) {
				this.tagSelectVisible = false; 
				if (!tags || tags.length == 0) { 
					this.filters.tags=[]
				}else{
					this.filters.tags=tags
				}
				this.searchXmQuestions();
			}

		},//end methods
		components: {
				'xm-question-add':XmQuestionAdd,
				'xm-question-edit':XmQuestionEdit,
				XmGroupMng,XmProjectList,xmMenuSelect,XmProductSelect,TagMng,
				//在下面添加其它组件
		},
		mounted() {
			if(this.selProject){
				this.filters.selProject=this.selProject
			}
			if(this.xmProduct){
				this.filters.product=this.xmProduct
			}
			if(this.queryScene=='my'){
				this.filters.handlerUserid=this.userInfo.userid;
				this.filters.handlerUsername=this.userInfo.username;
			}
			
			this.$nextTick(() => {
				
				
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el);
				this.getXmQuestions();
			});
				listOption([{categoryId:'all',itemCode:'bugSeverity'},{categoryId:'all',itemCode:'bugSolution'},{categoryId:'all',itemCode:'bugStatus'},{categoryId:'all',itemCode:'bugType'},{categoryId:'all',itemCode:'urgencyLevel'}] ).then(res=>{
					if(res.data.tips.isOk){
						this.options['bugSeverity']=res.data.data.bugSeverity
						this.options['bugSolution']=res.data.data.bugSolution
						this.options['bugStatus']=res.data.data.bugStatus
						this.options['bugType']=res.data.data.bugType
						this.options['urgencyLevel']=res.data.data.urgencyLevel
					}
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
.badge {
  margin-top: 7px;
  padding-bottom: 10px;
}
.badge-item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
