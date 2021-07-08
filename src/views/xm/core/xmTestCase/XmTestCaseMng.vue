<template>
	<section>
		<el-row class="app-container"> 
			<div>
				<el-tag    v-if="  filters.product "  closable    @close="clearProduct">{{this.filters.product.productName}}</el-tag>
				<el-button v-else    @click="showProductVisible" type="plian">选产品</el-button>
				<el-button v-if=" !filters.menus || filters.menus.length==0" @click="showMenu"> 选择故事</el-button>
				<el-tag v-else   closable @close=" clearFiltersMenu(filters.menus[0])">{{filters.menus[0].menuName.substr(0,5)}}等({{filters.menus.length}})个</el-tag>
				<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询">
					<template slot="append"> 
						<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmTestCases" icon="el-icon-search"></el-button>
					</template>
				</el-input> 
				<el-button type="primary" v-if="!multiSelect" circle icon="el-icon-plus" @click="showAdd"></el-button>
				<el-button type="primary" v-if="multiSelect" @click="selected">确认选中</el-button> 
				<el-button v-if="!multiSelect " type="danger" icon="el-icon-delete" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
				
				<el-popover
					placement="top-start"
					title="更多查询条件或操作"
					width="400"
					trigger="click" > 
					<el-row>
						<el-col :span="24" style="padding-top:5px;">
							<font class="more-label-font">产品:</font><el-tag    v-if="  filters.product "  closable    @close="clearProduct">{{this.filters.product.productName}}</el-tag>
							<el-button v-else    @click="showProductVisible" type="plian">选产品</el-button>
						</el-col> 
						<el-col :span="24" style="padding-top:5px;" v-if="!selProject" >
							<font class="more-label-font">项目:</font><el-tag    v-if="  filters.selProject "  closable    @close="clearProject">{{this.filters.selProject.name}}</el-tag>
							<el-button v-else    @click="showProjectList" type="plian">选项目</el-button>
						</el-col> 		
						<el-col :span="24" style="padding-top:5px;">
								<font class="more-label-font">故事:</font>
							<font  v-if="  filters.menus && filters.menus.length>0">
								<el-tag  v-for="(item,index) in filters.menus" :key="index"  closable     @close="clearFiltersMenu(item)">{{item.menuName.substr(0,10)}}</el-tag>
							</font>
							<el-button v-else    @click="showMenu" type="plian">选故事</el-button>
						</el-col> 	
						<el-col :span="24" style="padding-top:5px;">
							<font class="more-label-font">更新人:</font>
								<el-tag    v-if="  filters.luser "  closable    @close="clearFiltersExecUser">{{this.filters.luser.username}}</el-tag> 
							<el-button v-else    @click="showExecUsersForFilters" type="plian">选更新人</el-button>
							<el-button v-if=" !filters.luser || filters.luser.userid!=userInfo.userid" @click="setFiltersHandlerAsMySelf">我的</el-button> 
						</el-col> 	
						<el-col  :span="24"  style="padding-top:5px;">
							<font class="more-label-font">创建时间:</font>  
							<el-date-picker
								v-model="dateRanger"
								class="hidden-sm-and-down"
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
						<el-col :span="24" style="padding-top:5px;">
							<el-button size="mini" type="primary" icon="el-icon-search" @click="searchXmTestCases">查询</el-button>
						</el-col>
					</el-row>
					<el-button  slot="reference" icon="el-icon-more" circle></el-button>
				</el-popover> 
			</div>
		</el-row>
		<el-row class="app-container"> 
			<!--列表 XmTestCase 测试用例-->
			<el-table ref="table" :height="tableHeight" :data="xmTestCases" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="45"></el-table-column>
				<el-table-column sortable type="index" width="45"></el-table-column>
				<el-table-column prop="caseName" label="标题" min-width="100" show-overflow-tooltip>
					<template scope="scope">
						{{scope.row.id}}&nbsp;&nbsp;<el-link type="primary" @click="showEdit(scope.row)">{{scope.row.caseName}}</el-link>
					</template>
				</el-table-column>
 				<el-table-column prop="caseRemark" label="备注" min-width="80" show-overflow-tooltip></el-table-column> 
 				<el-table-column  prop="menuName" label="故事名" min-width="80" show-overflow-tooltip> 
					<template slot="header">
						故事<el-button @click="showMenu"  icon="el-icon-search" circle size="mini"></el-button>
 					</template>
				 </el-table-column>
				<el-table-column v-if="!multiSelect" prop="ctime" label="创建时间" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column v-if="!multiSelect" prop="lusername" label="更新人姓名" min-width="80" show-overflow-tooltip></el-table-column>
 				<el-table-column v-if="!multiSelect" prop="moduleName" label="模块名称" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column v-if="!multiSelect" prop="caseStatus" label="用例状态" min-width="80" >
					<template scope="scope">
						<el-tag :type="scope.row.caseStatus=='1'?'success':'warning'">{{scope.row.caseStatus=="1"?"正常":"作废"}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column v-if="!multiSelect" label="操作" width="160" fixed="right">
					<template scope="scope">
						<el-button type="primary"  @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmTestCase 测试用例界面-->
			<el-dialog title="编辑测试用例" :visible.sync="editFormVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				  <xm-test-case-edit :xm-test-case="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-test-case-edit>
			</el-dialog>
	
			<!--新增 XmTestCase 测试用例界面-->
			<el-dialog title="新增测试用例" :visible.sync="addFormVisible"  width="80%"  append-to-body  :close-on-click-modal="false">
				<xm-test-case-add :xm-test-case="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-test-case-add>
			</el-dialog> 
			<el-dialog title="选中项目" :visible.sync="selectProjectVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				<xm-project-list    @project-confirm="onPorjectConfirm"></xm-project-list>
			</el-dialog>  
			<el-dialog title="选中用户" :visible.sync="selectUserForFiltersVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				<xm-group-mng v-if="filters.selProject" :sel-project=" filters.selProject " :is-select-single-user="1" @user-confirm="onFiltersUserConfirm"></xm-group-mng>
			</el-dialog> 
		</el-row>
		<el-dialog append-to-body title="故事选择" :visible.sync="menuVisible"    width="80%"   :close-on-click-modal="false">
			<xm-menu-select :visible="menuVisible" :is-select-menu="true" :multi="true"    @menus-selected="onSelectedMenus" ></xm-menu-select>
		</el-dialog>
		
		<el-dialog title="选择产品" :visible.sync="productSelectVisible"  width="80%"  append-to-body   :close-on-click-modal="false">
				<xm-product-select  :isSelectProduct="true" :selProject="filters.selProject" :visible="productSelectVisible" @cancel="productSelectVisible=false" @selected="onProductSelected"></xm-product-select>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmTestCase, delXmTestCase, batchDelXmTestCase } from '@/api/xm/core/xmTestCase';
	import  XmTestCaseAdd from './XmTestCaseAdd';//新增界面
	import  XmTestCaseEdit from './XmTestCaseEdit';//修改界面
	import { mapGetters } from 'vuex'
	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import  XmProductSelect from '../xmProduct/XmProductSelect';//修改界面

	import XmProjectList from '../xmProject/XmProjectList';
	import XmGroupMng from '../xmProjectGroup/XmProjectGroupMng';
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['multiSelect','selProject'],
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 3 );			return {
				filters: {
					key: '',
					menus:[],
					product:null,
					selProject:null,
					luser:null,
				},
				xmTestCases: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{
					//sex:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmTestCase界面是否显示
				//新增xmTestCase界面初始化数据
				addForm: {
					id:'',caseName:'',caseRemark:'',testStep:'',expectResult:'',menuId:'',menuName:'',ctime:'',ltime:'',luserid:'',lusername:'',cbranchId:'',moduleId:'',moduleName:'',caseStatus:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				productSelectVisible:false,
				//编辑xmTestCase界面初始化数据
				editForm: {
					id:'',caseName:'',caseRemark:'',testStep:'',expectResult:'',menuId:'',menuName:'',ctime:'',ltime:'',luserid:'',lusername:'',cbranchId:'',moduleId:'',moduleName:'',caseStatus:''
				},
				/**begin 自定义属性请在下面加 请加备注**/ 
				menuVisible:false,
				tableHeight:300,
				
				selectProjectVisible:false,    
				selectUserForFiltersVisible:false,   
				productSelectVisible:false,
				nextAction:'',
				dateRanger: [
					util.formatDate.format(beginDate, "yyyy-MM-dd"),
					util.formatDate.format(endDate, "yyyy-MM-dd")
				],  
				pickerOptions:  util.pickerOptions('datarange'),
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmTestCases();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmTestCases();
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
				this.getXmTestCases();
			},
			searchXmTestCases(){
				 this.pageInfo.count=true; 
				 this.getXmTestCases();
			},
			//获取列表 XmTestCase 测试用例
			getXmTestCases() {
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
				if(this.filters.menus && this.filters.menus.length==1){
					params.menuId=this.filters.menus[0].menuId
 				}else if(this.filters.menus && this.filters.menus.length>1){
					params.menuIds=this.filters.menus.map(i=>i.menuId)
 				}else{
					//params.xxx=xxxxx
				}
				
				if(!this.dateRanger || this.dateRanger.length==0){
					this.$message({ message: "创建日期范围不能为空", type: 'error' });
					return;
				}
				if(this.filters.product){
					params.productId=this.filters.product.id
				}
				if(this.filters.luser){
					params.myUserid=this.filters.luser.userid
				}
				if(this.filters.selProject){
					params.projectId=this.filters.selProject.id
				} 
				
				params.ctimeStart=this.dateRanger[0]+" 00:00:00"
				params.ctimeEnd=this.dateRanger[1]+" 23:59:59"
				if(this.filters.key){
					params.key='%'+this.filters.key+'%'
				}
				this.load.list = true;
				listXmTestCase(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmTestCases = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmTestCase 测试用例
			showEdit: function ( row,index ) { 
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmTestCase 测试用例
			showAdd: function () { 
				if( !this.roles.some(i=>i.roleid=='testAdmin') && !this.roles.some(i=>i.roleid=='tester') && !this.roles.some(i=>i.roleid=='testTeamAdmin') ){
					this.$message({message:"只有测试经理、测试组长、测试员可以操作",type:"error"});
					return ;
				}
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmTestCases();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmTestCase
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmTestCase
			handleDel: function (row,index) { 
				if( !this.roles.some(i=>i.roleid=='testAdmin') && !this.roles.some(i=>i.roleid=='tester') && !this.roles.some(i=>i.roleid=='testTeamAdmin') ){
					this.$message({message:"只有测试经理、测试组长、测试员可以操作",type:"error"});
					return ;
				}
				if(!this.roles.some(i=>i.roleid=='testAdmin')){
					this.$message({ message: "只有测试管理员才能删除测试用例", type: 'error' });
					return;
				}
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmTestCase(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmTestCases();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmTestCase
			batchDel: function () {
				if( !this.roles.some(i=>i.roleid=='testAdmin') && !this.roles.some(i=>i.roleid=='tester') && !this.roles.some(i=>i.roleid=='testTeamAdmin') ){
					this.$message({message:"只有测试经理、测试组长、测试员可以操作",type:"error"});
					return ;
				}
				if(!this.roles.some(i=>i.roleid=='testAdmin')){
					this.$message({ message: "只有测试管理员才能删除测试用例", type: 'error' });
					return;
				}
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmTestCase(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmTestCases(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			
			clearProduct(){
				this.filters.product=null;
				this.searchXmTestCases();
			},
			showProductVisible(){
				this.productSelectVisible=true;
			},
			onProductSelected(product){
				this.filters.product=product;
				this.productSelectVisible=false;
				this.searchXmTestCases();
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
				this.getXmTestCases();
			},
			 clearFiltersMenu(menu){
				var index=this.filters.menus.findIndex(i=>i.menuId==menu.menuId)
				this.filters.menus.splice(index,1);
				this.getXmTestCases();
			},
			selected(){
				this.$emit("selected",this.sels)
			},
			
			clearProject(){
				this.filters.selProject=null
				this.searchXmTestCases()
			},
			showProjectList:function(){
				this.selectProjectVisible=true;
			},
			onPorjectConfirm:function(project){
				this.filters.selProject=project
				this.selectProjectVisible=false;
				this.searchXmTestCases();
				 if(this.nextAction=="showExecUsersForFilters"){
					this.showExecUsersForFilters();
					this.nextAction=""
				}
			},
			
			clearFiltersExecUser(){
				this.filters.luser=null;
				this.searchXmTestCases();
			},
			showExecUsersForFilters:function(){ 
				if(!this.filters.selProject){
					this.nextAction="showExecUsersForFilters"
					this.showProjectList();
				}else{
					this.selectUserForFiltersVisible=true;
				}
 				
			},
			onFiltersUserConfirm:function(groupUsers){
				if(groupUsers==null || groupUsers.length==0){
					this.filters.luser=null
 				}else{
					this.filters.luser=groupUsers[0]  
				} 
				if(this.nextAction=="showExecUsersForFilters"){
					this.nextAction=""
				}
				this.selectUserForFiltersVisible=false
				this.searchXmTestCases();
			},
			
			setFiltersHandlerAsMySelf(){
				this.filters.luser=this.userInfo; 
				this.searchXmTestCases();
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-test-case-add':XmTestCaseAdd,
			'xm-test-case-edit':XmTestCaseEdit, 
			xmMenuSelect,XmProductSelect,XmProjectList,XmGroupMng
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.filters.luser=this.userInfo; 
				this.getXmTestCases();
				var clientRect=this.$refs.table.$el.getBoundingClientRect();
				var subHeight=50;  
				if(this.selProject){
					subHeight=100/1000 * window.innerHeight;
				}
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight; 
        	}); 
        	/** 举例，
    		listOption([{categoryId:'all',itemCode:'sex'},{categoryId:'all',itemCode:'grade'}] ).then(res=>{
				if(res.data.tips.isOk){ 
 					this.options=res.data.data
				}
			});
			**/
		}
	}

</script>

<style scoped>


.more-label-font{
	text-align:center;
	float:left;
	padding-top:5px;
}
</style>