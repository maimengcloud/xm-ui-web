<template>
	<section>
		<el-row>
			<el-row >  
				<el-col v-show="!batchEditVisible&& !filters.product" :span="24" class="app-container">
					<xm-product-mng :sel-project="selProject" @row-click="onProductSelected" ref="xmProductMng" :simple="true"></xm-product-mng>
				</el-col>
				<el-col v-show="filters.product" :span="24" >
					<el-row class="app-container">  
						<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询" clearable>
							<template slot="append">
								<el-button   type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmMenus" icon="el-icon-search"></el-button>
							</template>
						</el-input> 
						
						
						<el-button  v-if="  batchEditVisible==false " type="primary" @click="showAdd" icon="el-icon-plus">故事</el-button>
						<el-button  v-if=" batchEditVisible==false"   @click="toBatchEdit" icon="el-icon-edit">批量修改</el-button> 
						<el-button  v-if=" batchEditVisible==true "  type="warning" @click="batchSaveMenu" icon="el-icon-finished">保存</el-button> 
						<el-button  v-if=" batchEditVisible==true" type="success"  @click="handlePopover(null,'add')" icon="el-icon-plus">故事</el-button>
						<el-button  v-if=" batchEditVisible==true "    @click="noBatchEdit" icon="el-icon-back">返回</el-button>  
						<el-button  v-if=" batchEditVisible==false && filters.product "    @click="toSelectProduct" icon="el-icon-back">返回</el-button> 
						<el-button  v-if=" batchEditVisible==false "       @click="loadTasksToXmMenuState" icon="el-icon-s-marketing">刷新统计数据</el-button>  

						<el-button v-if=" batchEditVisible==true  " type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
						
						<el-popover
							placement="top-start"
							title=""
							width="400"
							trigger="click" >
							<el-row>
								<el-col  :span="24"  style="padding-top:5px;"> 
									<el-button  v-if=" batchEditVisible==true "  type="success" @click="showImportFromMenuTemplate" icon="el-icon-upload2">由模板快速导入</el-button> 
								</el-col>  
								<el-col :span="24"  style="padding-top:5px;">
									<font class="more-label-font">创建时间:</font>  
									<el-date-picker
										v-model="dateRanger" 
										type="daterange"
										align="right"
										unlink-panels
										range-separator="至"
										start-placeholder="开始日期"
										end-placeholder="完成日期"
										value-format="yyyy-MM-dd"
										:default-time="['00:00:00','23:59:59']"
										:picker-options="pickerOptions"
									></el-date-picker>   
								</el-col>   
								<el-col  :span="24"  style="padding-top:5px;">
									<font class="more-label-font">
										责任人:
									</font>  
									<el-tag v-if="filters.mmUser" closable @close="clearFiltersMmUser()">{{filters.mmUser.username}}</el-tag> 
									<el-button v-else @click="selectFiltersMmUser()">选责任人</el-button>
									<el-button   @click="setFiltersMmUserAsMySelf()">我的</el-button>
								</el-col>
								<el-col  :span="24"  style="padding-top:5px;">
									<font class="more-label-font">
										故事名称:
									</font> 
									<el-input  size="mini" v-model="filters.key" style="width:100%;"  placeholder="输入故事名字关键字" clearable>  
									</el-input> 
								</el-col>
								<el-col  :span="24"  style="padding-top:5px;">
									<el-button type="primary" size="mini" @click="searchXmMenus" >查询</el-button>
									<el-button size="mini" v-if=" batchEditVisible==false "  @click="handleExport" icon="el-icon-download">导出</el-button> 
								</el-col> 
							</el-row> 
							<el-button  slot="reference" icon="el-icon-more" circle></el-button>
						</el-popover> 
					
					</el-row>
					<el-row ref="table">
						<el-row v-show="batchEditVisible" class="app-container"> 
							<el-table ref="table1" :max-height="tableHeight" :data="xmMenusTreeData" class="drag-table" default-expand-all  row-key="menuId" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
								<el-table-column sortable type="selection" width="45"></el-table-column>
								<el-table-column sortable prop="seqNo"  label="序号" min-width="100">
									<template slot-scope="scope">
										<div style="display:flex;width:100%;">
											<el-popover
												placement="top"
												width="400"
												trigger="click">
												<div style="text-align: center; margin: 0">
													<div :ref="'menu_'+scope.$index" :data-menu-id="scope.row.menuId"></div>
													<el-button type="primary" size="mini"   @click="handlePopover(scope.row,'highestPmenuId')">成为顶级节点</el-button> 
													<el-button type="danger" size="mini"   @click="handlePopover(scope.row,'delete')">删除当前行</el-button> 
													<el-button type="success" size="mini"   @click="handlePopover(scope.row,'addSub')">增加子行</el-button> 
												</div>
												<el-button slot="reference" :type="scope.row.opType?'success':'plain'"  size="mini" icon="el-icon-more" circle></el-button> 
											</el-popover>
											<el-input   style="width:100%;"   v-model="scope.row.seqNo"  @change="fieldChange(scope.row,'seqNo')"></el-input>
										</div>
									</template>
								
								</el-table-column>  
								<el-table-column prop="menuName" label="故事名称" min-width="140" > 
									<template slot-scope="scope">
										<el-input    v-model="scope.row.menuName"  @change="fieldChange(scope.row,'menuName')"></el-input>
									</template>
								</el-table-column> 
								<el-table-column prop="mmUsername" label="负责人" min-width="100" > 
									<template slot-scope="scope"> 
										<el-tag v-if="scope.row.mmUserid" closable @close="clearPmUser(scope.row)">{{scope.row.mmUsername}}</el-tag>
										<el-tag v-else>未配置</el-tag> 
										<el-button @click="selectUser(scope.row)">选人</el-button>
									</template>
								</el-table-column> 
								<el-table-column prop="remark" label="描述" min-width="140" > 
									<template slot-scope="scope">

										<el-input    v-model="scope.row.remark" type="textarea"  @change="fieldChange(scope.row,'remark')"></el-input>
									</template>
								</el-table-column>  
							</el-table>
							<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
							
						</el-row>
						<el-row v-show="!batchEditVisible" class="app-container">
							<el-table  ref="table2" :max-height="tableHeight" :data="xmMenusTreeData" default-expand-all  row-key="menuId" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
								<el-table-column sortable type="selection" width="40"></el-table-column> 
								<el-table-column prop="menuName" label="故事名称" min-width="140" > 
									<template slot-scope="scope">
										{{scope.row.seqNo}}&nbsp;&nbsp;<el-link type="primary"  @click="showMenuExchange(scope.row)">{{scope.row.menuName}}</el-link>
									</template>
								</el-table-column> 
								<el-table-column prop="mmUsername" label="负责人" min-width="80" >  
								</el-table-column> 
								<el-table-column prop="finishRate" label="总体进度" width="100" > 
									<template slot-scope="scope">
										{{scope.row.finishRate}}%
									</template>
								</el-table-column> 
								<el-table-column prop="remark" label="描述" min-width="140" > 
									<template slot-scope="scope">
										<el-popover
											v-if="scope.row.remark && scope.row.remark.length>20"
											placement="top-start"
											title="故事备注"
											width="400"
											trigger="click" >
											<div v-html="scope.row.remark">
											</div> 
											<div slot="reference">{{scope.row.remark?scope.row.remark.substr(0,18)+"...":""}}</div>
										</el-popover> 
										<div v-else v-html="scope.row.remark"> 
										</div>
									</template>
								</el-table-column> 
								<el-table-column label="操作"   width="200" fixed="right"  >
									<template slot-scope="scope">
										
										<el-button type="primary"  @click="showSubAdd( scope.row,scope.$index)" icon="el-icon-plus" circle></el-button> 
										<el-button    @click="showEdit(scope.row)" icon="el-icon-edit" circle></el-button> 
											
											<el-popover style="padding-left:10px;"
												v-if="isPmUser"
												placement="top-start"
												width="200"
												trigger="click" > 
												<el-row>
													<el-col :span="24" style="padding-top:5px;">
														<el-button type="success" @click="showImportFromMenuTemplate(scope.row)" icon="el-icon-upload2">由模板快速导入</el-button> 
													</el-col>
													<el-col  :span="24"  style="padding-top:5px;"> 
														<el-button type="danger"   @click="handleDel(scope.row)" icon="el-icon-delete" circle></el-button>   
													</el-col> 
													<el-col  :span="24"  style="padding-top:5px;"> 
														<el-button v-if="!selProject"  type="primary" @click="showTaskListForMenu(scope.row,scope.$index)"  icon="el-icon-s-operation">查看任务</el-button>
														<el-button v-if="selProject"  type="primary" @click="showTasks(scope.row,scope.$index)"  icon="el-icon-s-operation">查看任务</el-button> 
													</el-col> 
													<el-col  :span="24"  style="padding-top:5px;"> 
														<el-button   type="primary" @click="toIterationList(scope.row,scope.$index)"  icon="el-icon-document-copy">查看迭代计划</el-button>
													</el-col> 
												</el-row>  

												<el-button slot="reference" icon="el-icon-more" circle></el-button>
											</el-popover> 
									</template>
								</el-table-column>
							</el-table>
							<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
							
						</el-row>
					</el-row>
				</el-col>
				<!--编辑 XmMenu xm_project_menu界面-->
				<el-dialog title="编辑故事" :visible.sync="editFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
					<xm-menu-edit :xm-menu="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-menu-edit>
				</el-dialog>
		
				<!--新增 XmMenu xm_project_menu界面-->
				<el-dialog title="新增故事" :visible.sync="addFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
					<xm-menu-add  :product="filters.product"   :parent-menu="parentMenu"  :xm-menu="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-menu-add>
				</el-dialog> 
				<el-dialog title="故事模板" :visible.sync="menuTemplateVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
					<xm-menu-template-mng  :is-select-menu="true"  :visible="menuTemplateVisible" @cancel="menuTemplateVisible=false" @selected-menus="onSelectedMenuTemplates"></xm-menu-template-mng>
				</el-dialog> 
				
				<el-dialog title="故事谈论" :visible.sync=" menuDetailVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
					<xm-menu-rich-detail :visible="menuDetailVisible"  :reload="false" :xm-menu="editForm" ></xm-menu-rich-detail>
				</el-dialog> 
				
				<el-dialog title="选中任务" :visible.sync="selectTaskVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
					<xm-task-list  :sel-project="selProject" :is-multi-select="true"  @tasks-selected="onSelectedTasks"></xm-task-list>
				</el-dialog> 
				<el-dialog title="查看任务" :visible.sync="taskListForMenuVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
					<xm-task-list-for-menu   :is-multi-select="true" :menu-id="editForm.menuId"></xm-task-list-for-menu>
				</el-dialog> 
				<el-dialog
					append-to-body
					title="任务"
					:visible.sync="taskMngVisible"
					fullscreen>
					<xm-task-mng :sel-project="selProject"   :menu-id="editForm.menuId" :menu-name="editForm.menuName"></xm-task-mng> 
				</el-dialog>
				<el-dialog
					append-to-body
					title="故事关联的迭代查询"
					:visible.sync="iterationVisible"
					>
						<xm-iteration-mng :simple="true" :product-id="editForm.productId" :menu-id="editForm.menuId" ></xm-iteration-mng>
				</el-dialog>

				<el-dialog title="选择员工" :visible.sync="selectFiltersMmUserVisible" width="60%" append-to-body>
					<users-select  @confirm="onFiltersMmUserSelected" ref="selectFiltersMmUser"></users-select>
				</el-dialog>	
				<el-dialog title="选择员工" :visible.sync="userSelectVisible" width="60%" append-to-body>
					<users-select  @confirm="onUserSelected" ref="usersSelect"></users-select>
				</el-dialog>	
			</el-row>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmMenu, delXmMenu, batchDelXmMenu,batchAddXmMenu,batchEditXmMenu,listXmMenuWithState } from '@/api/xm/core/xmMenu';
	import { batchRelTasksWithMenu } from '@/api/xm/core/xmTask';
	import { loadTasksToXmMenuState} from '@/api/xm/core/xmMenuState';

	
	import  XmMenuAdd from './XmMenuAdd';//新增界面
	import  XmMenuEdit from './XmMenuEdit';//修改界面
	import  XmProductMng from '../xmProduct/XmProductSelect';//新增界面
	import  XmMenuTemplateMng from '../xmMenuTemplate/XmMenuTemplateMng';//新增界面
	import XmMenuRichDetail from './XmMenuRichDetail';
	import XmTaskList from '../xmTask/XmTaskList';
	import XmTaskMng from '../xmTask/XmTaskMng'; 
	import XmTaskListForMenu from '../xmTask/XmTaskListForMenu';
	import  XmIterationMng from '../xmIteration/XmIterationMng';//修改界面
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect"; 

	import {sn} from '@/common/js/sequence'

	import { mapGetters } from 'vuex'
	
	export default { 
		props:['selProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
			
      xmMenusTreeData() {
        let xmMenus = JSON.parse(JSON.stringify(this.xmMenus || []));
        if (this.valueChangeRows && this.valueChangeRows.length) {
          this.valueChangeRows.forEach(c => {
            var index = xmMenus.findIndex(i=>i.id==c.id);
            const oldRow = JSON.parse(JSON.stringify(xmMenus[index]));
            xmMenus.splice(index,1);
            c.parentTaskid = oldRow.parentTaskid;
            xmMenus.push(c);
          })
        }
        
        const xmMenusTreeData = this.translateDataToTree(xmMenus);
        if (this.batchEditVisible) {
          this.rowDrop();
        }
        
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
    	},
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 3 );
			return {
				filters: {
					key: '',
					product:null,
					mmUser:null,
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
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmMenu界面是否显示
				//新增xmMenu界面初始化数据
				addForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmMenu界面初始化数据
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:''
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
				tableHeight:300,
				dateRanger: [
					util.formatDate.format(beginDate, "yyyy-MM-dd"),
					util.formatDate.format(endDate, "yyyy-MM-dd")
				],  
				pickerOptions:  util.pickerOptions('datarange'),
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
			//获取列表 XmMenu xm_project_menu
			getXmMenus() {
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
					if( this.filters.product!==null && this.filters.product.id!=''){
						params.productId=this.filters.product.id
					}else {
						this.$message({ message: "请先选择产品", type: 'success' });
						return;
						//params.xxx=xxxxx
					} 
				if(!params.productId){
					params.branchId=this.userInfo.branchId
				}
				
				if( this.filters.key){
					params.key="%"+this.filters.key+"%"
				}
				 
				if(!this.dateRanger || this.dateRanger.length==0){
					this.$message({ message: "创建日期范围不能为空", type: 'error' });
					return;
				} 
				if(this.filters.mmUser){
					params.mmUserid=this.filters.mmUser.userid;
				}
				params.ctimeStart=this.dateRanger[0]+" 00:00:00"
				params.ctimeEnd=this.dateRanger[1]+" 23:59:59" 
				let callback= (res)=>{
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmMenus = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}
				this.load.list = true;
				listXmMenuWithState(params).then( callback ).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmMenu xm_project_menu
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmMenu xm_project_menu
			showAdd: function () { 
				if(!this.roles.some(i=>i.roleid=='productAdmin') && !this.roles.some(i=>i.roleid=='productTeamAdmin')){
					this.$message({ message: "只有产品经理、产品组长能够修改故事", type: 'error'}); 
					return false;
				}
				if(this.filters.product==null){
					this.$message({ message: "请先选择产品", type: 'error' });
					return;
				}
				this.parentMenu=null;
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			showSubAdd:function(row){
				if(!this.roles.some(i=>i.roleid=='productAdmin') && !this.roles.some(i=>i.roleid=='productTeamAdmin')){
					this.$message({ message: "只有产品经理、产品组长能够修改故事", type: 'error'}); 
					return false;
				}
				this.editForm=row
				this.parentMenu=row
				this.addFormVisible=true
			},
			showProdcutAdd:function(){
				this.$refs.xmProductMng.showAdd();
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.parentMenu=null;
				this.getXmMenus();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getXmMenus();
			},
			//选择行xmMenu
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			onProductSelected:function(product){
				this.filters.product=product
				this.getXmMenus()
			},
			//删除xmMenu
			handleDel: function (row,index) { 
				if(row.mmUserid!=this.userInfo.userid){
					this.$message({ message: "只能操作你负责的故事", type: 'error'}); 
					return false;
				}
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
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmMenu
			batchDel: function () {
				var mmSels=this.sels.filter(i=>i.mmUserid!=this.userInfo.userid)
				if(mmSels.length>0){
					this.$message({ message: "只能操作你负责的故事", type: 'error'}); 
					return false;
				}
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
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
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
          

          const form = _this.xmMenusTreeData[draggedIndex];
          const to = _this.xmMenusTreeData[dragIndex];

          const startId = _this.$refs['menu_'+draggedIndex].dataset.menuId;;
          const endId = _this.$refs['menu_'+dragIndex].dataset.menuId;

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
      handleExport() {
        this.downloadLoading = true
        const pageNum = this.pageInfo.pageNum;
        const header = ['故事名称', '负责人', '总体进度', '描述'];
        const keyList = ['menuName', 'mmUsername', 'finishRate', 'remark'];
        const filename = `故事管理_${this.filters.product.productName}_第${pageNum}页`;
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
      changePmenuId(sId, eId) {
        let dict = {};
        this.xmMenus.forEach(d => {
          dict[d.menuId] = d.pmenuId || '';
        });
        if (!dict[eId]) {
          this.xmMenus.find(d => {
            if (d.menuId === sId) {
              d.pmenuId = eId;
              console.log('更新关系1');
              this.fieldChange(d,'pmenuId',true);
            }
          })
        } else {
          const isSynezesis = this.judgePmenuId(dict, sId, dict[eId]);
          if (!isSynezesis) {
            this.xmMenus.find(d => {
              if (d.menuId === sId) {
                d.pmenuId = eId;
                console.log('更新关系2');
                this.fieldChange(d,'pmenuId',true);
              }
            })
          } else {
            console.log('形成闭合回路--拖拽不更新');
            
          }
        }
			}, 
			
			/**begin 自定义函数请在下面加**/
			translateDataToTree(data2) { 
				var data=JSON.parse(JSON.stringify(data2));
				let parents = data.filter(value =>{
					//如果我的上级为空，则我是最上级 
					if(value.pmenuId == 'undefined' || value.pmenuId == null  || value.pmenuId == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.pmenuId==i.menuId)){
						return false;
					}else {
						return true
					}
				 
				}) 
				let children = data.filter(value =>{
					if(data.some(i=>value.pmenuId==i.menuId)){
						return true;
					}else{
						return false;
					} 
				})  
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.pmenuId === parent.menuId) {
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
			/**begin 自定义函数请在下面加**/
			selectedMenu:function(row){
				this.$emit("selected",row)
			},
			showImportFromMenuTemplate(row){
				
				if(!this.roles.some(i=>i.roleid=='productAdmin') && !this.roles.some(i=>i.roleid=='productTeamAdmin')){
					this.$message({ message: "只有产品经理、产品组长能够修改故事", type: 'error'}); 
					return false;
				}
				if(!this.filters.product){
					this.$message.error("请选择产品模板")
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
						this.$message({ message: tips.msg, type: 'error' });
					}
				}).catch( err  => this.load.add=false );
			},
			toBatchEdit(){
				
				if(!this.roles.some(i=>i.roleid=='productAdmin') && !this.roles.some(i=>i.roleid=='productTeamAdmin')){
					this.$message({ message: "只有产品经理、产品组长能够修改故事", type: 'error'}); 
					return false;
				}
				this.valueChangeRows=[];
				this.batchEditVisible=true;

			},
			noBatchEdit(){
				this.batchEditVisible=false;
				if(this.valueChangeRows.length>0){
					this.getXmMenus();
				} 
				this.valueChangeRows=[];
			},
			batchSaveMenu(){
				
				if(!this.roles.some(i=>i.roleid=='productAdmin') && !this.roles.some(i=>i.roleid=='productTeamAdmin')){
					this.$message({ message: "只有产品经理、产品组长能够修改故事", type: 'error'}); 
					return false;
				}
				if(this.valueChangeRows.length==0){
					this.$message.success("没有数据被修改");
					return
				}
				batchEditXmMenu(this.valueChangeRows).then(res=>{
					var tips=res.data.tips;
					if(tips.isOk){
						this.valueChangeRows=[]
						this.getXmMenus()
					}
					this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
				});
			},
			fieldChange:function(row,fieldName,nextReplace){
				 
				console.log('fieldChange--row==', row);
				if(nextReplace){
					row.nextReplace=nextReplace
				}
				if(row.opType){
					var index=this.valueChangeRows.findIndex(i=>i.menuId==row.menuId);
					
					if(index>=0){
						this.valueChangeRows.splice(index,1);
						this.valueChangeRows.push(row)
					}else{
						this.valueChangeRows.push(row)
					}
				}else{
					var oneRow=this.valueChangeRows.find(i=>i.menuId==row.menuId);
					if( oneRow  ){
						if(oneRow.nextReplace){ 
							var index=this.valueChangeRows.findIndex(i=>i.menuId==row.menuId);
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
			showTaskList(row){ 
				
				if(!this.roles.some(i=>i.roleid=='productAdmin') && !this.roles.some(i=>i.roleid=='productTeamAdmin')){
					this.$message({ message: "只有产品经理、产品组长能够修改故事", type: 'error'}); 
					return false;
				}
				this.editForm=row
				this.selectTaskVisible=true; 
			}, 
			
			onSelectedTasks:function(xmTasks){
				 
				 
				if(xmTasks==null || xmTasks.length==0){
					this.$message.error("请最少选择一个任务进行关联");
					return;
				}
				var menu=this.editForm
				xmTasks.forEach(i=>{
					i.menuId=menu.menuId
					i.menuName=menu.menuName
					i.productId=menu.productId
					i.productName=menu.productName
				});
				this.selectTaskVisible=false;

				batchRelTasksWithMenu(xmTasks).then(res=>{
					var tips = res.data.tips
					if(tips.isOk){
						this.getXmMenus()
					}
					this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
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
			/**end 自定义函数请在上面加**/
			handlePopover:function(row,opType){
				if('add'==opType){
					var subRow=JSON.parse(JSON.stringify(this.addForm));
					subRow.pmenuId=null
					subRow.menuId=sn();
					subRow.seqNo="1"
					subRow.opType=opType
					subRow.productId=this.filters.product.id 
					subRow.productName=this.filters.product.productName 
					this.fieldChange(subRow,'seqNo');
					this.xmMenus.unshift(subRow);
				}else if('addSub'==opType){
					var subRow=JSON.parse(JSON.stringify(row));
					subRow.children=[];
					subRow.pmenuId=row.menuId
					subRow.menuId=sn();
					subRow.seqNo=row.seqNo+".1"
					subRow.opType=opType
					this.fieldChange(subRow,'seqNo');
					this.xmMenus.unshift(subRow);
				}else if('delete'==opType){
					if(row.opType && (row.opType=='addSub' || row.opType=='add')){
						if(row.children && row.children.length>0){
							this.$message.error("请先删除子元素");
							return;
						}else{ 

							var index=this.xmMenus.findIndex(i=>i.menuId==row.menuId)
							var indexValueChanges=this.valueChangeRows.findIndex(i=>i.menuId==row.menuId)
							this.valueChangeRows.splice(indexValueChanges,1);
							this.xmMenus.splice(index,1);
						}
					}else{
						this.$message.error("只能删除未保存的行");
						return;
					}
					 
				} else if ('highestPmenuId' === opType) {  
					if (row.pmenuId) {
						this.xmMenus.find(d => {
							
							if (d.menuId === row.menuId) { 
								d.pmenuId = '';
								this.fieldChange(d,'seqNo', true); 
							}
						});
					}
				}
            
			},
			loadTasksToXmMenuState: function () {  
				this.load.edit=true;
				if(!this.filters.product){
					this.$message.error("请先选择产品");
				}
				let params = { productId: this.filters.product.id };
				loadTasksToXmMenuState(params).then((res) => {
					this.load.edit=false;
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.count=true;
						this.getXmMenus();
					}
					this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch( err  => this.load.edit=false ); 
			},
			selectUser(row){
				this.editForm=row
				this.userSelectVisible=true;
			},
			onUserSelected(users){
				if(users && users.length>0){
					this.editForm.mmUserid=users[0].userid
					this.editForm.mmUsername=users[0].username
					this.fieldChange(this.editForm,"mmUsername");

				}
				this.userSelectVisible=false
			},
			clearPmUser:function(row){
				this.editForm=row
				 row.mmUserid=''
				 row.mmUsername=''
				 this.fieldChange(row,"mmUsername");
			},
			clearFiltersMmUser:function(){
				 this.filters.mmUser=null;
				  this.searchXmMenus();
			},			
			selectFiltersMmUser(){
				this.selectFiltersMmUserVisible=true;
			},
			onFiltersMmUserSelected(users){
				debugger;
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
				this.filters.product=null;
			}
		},//end methods
		components: { 
		    'xm-menu-add':XmMenuAdd,
			'xm-menu-edit':XmMenuEdit,
			XmProductMng,
			XmMenuTemplateMng,
			XmMenuRichDetail,
			XmTaskList,
			XmTaskMng,
			XmTaskListForMenu,
			XmIterationMng,
			UsersSelect,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				var subHeight=350/1000 * window.innerHeight
				if(this.selProject){
					subHeight=400/1000 * window.innerHeight
				}
				this.tableHeight =  window.innerHeight - subHeight
				
				let self = this;
				window.onresize = function() {
					self.tableHeight =  window.innerHeight - subHeight;
				} 
				this.getXmMenus();
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

.more-label-font{
	text-align:center;
	float:left;
	padding-top:10px;
}
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