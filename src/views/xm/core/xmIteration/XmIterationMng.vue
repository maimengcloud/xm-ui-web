<template>
	<section class="page-container page-full-height padding border">
		<el-row>
      		<el-checkbox v-model="gstcVisible"  class="hidden-md-and-down">甘特图</el-checkbox>  
			  
			<el-select  v-model="filters.queryScope"  placeholder="迭代查询范围">
				<el-option :label="userInfo.branchName+'机构下所有的迭代'" value="branchId"></el-option>
				<el-option label="我相关的迭代" value="compete"></el-option>
				<el-option label="按迭代编号精确查找" value="iterationId"></el-option>
				<el-option label="后台智能匹配" value=""></el-option>
			</el-select>
			<el-input v-if="filters.queryScope=='iterationId'"  v-model="filters.id" style="width:20%;"  placeholder="输入迭代编号" @keyup.enter.native="searchXmProducts"> </el-input> 
			<el-date-picker v-if="filters.queryScope!='iterationId'" v-model="dateRangerOnline" type="daterange" align="right" unlink-panels range-separator="至"
				start-placeholder="上线日期" end-placeholder="上线日期" value-format="yyyy-MM-dd"
				class="hidden-md-and-down"
				:default-time="['00:00:00','23:59:59']" :picker-options="pickerOptions">
			</el-date-picker>
				<el-input v-model="filters.key" style="width: 15%;" placeholder="模糊查询">
					<template slot="append">
						<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmIterations" icon="el-icon-search"></el-button>
					</template>
				</el-input>
			<el-button type="primary" @click="showAdd" icon="el-icon-plus">迭代计划</el-button> 
			<el-popover
				placement="top-start"
				title=""
				width="400"
				trigger="click" >
				<el-divider content-position="left"><strong>查询条件</strong></el-divider>
				<el-row> 
					
					<el-col :span="24" style="padding-top:5px;">
						<font class="more-label-font">
							迭代查询范围：
						</font>
						<el-select size="mini" v-model="filters.queryScope" style="width:100%;"   placeholder="迭代查询范围">
							<el-option :label="userInfo.branchName+'机构下所有的迭代'" value="branchId"></el-option>
							<el-option label="我相关的迭代" value="compete"></el-option>
							<el-option label="按迭代编号精确查找" value="iterationId"></el-option>
							<el-option label="后台智能匹配" value=""></el-option>
						</el-select>
					</el-col>
					<el-col  :span="24"  style="padding-top:5px;"> 
						<el-input  v-if="filters.queryScope=='iterationId'" size="mini" v-model="filters.id" style="width:100%;"  placeholder="输入产品编号" @keyup.enter.native="searchXmProducts">  
						</el-input> 
					</el-col>
					<el-col v-if="filters.queryScope!='iterationId'" :span="24"  style="padding-top:5px;">
						<font class="more-label-font">上线时间:</font>
						<el-date-picker size="mini"
							v-model="dateRangerOnline"
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
							<font class="more-label-font">迭代名称:</font><el-input size="mini" v-model="filters.key" style="width: 60%;" placeholder="模糊查询"></el-input>
					</el-col>
					<el-col :span="24" style="padding-top:5px;">
							<el-tag>默认只能查询本人创建的迭代、本人作为故事责任人参与的迭代</el-tag>
					</el-col>
					<el-col :span="24" style="padding-top:5px;">
						<el-button size="mini" type="primary" icon="el-icon-search" @click="getXmIterations">查询</el-button>
						<el-checkbox v-model="gstcVisible">甘特图</el-checkbox>  
					</el-col>
				</el-row>
				<el-divider content-position="left"><strong>更多操作</strong></el-divider>
				<el-row> 
					<el-col :span="24" style="padding-top:5px;">
						<el-button v-if="xmProduct" size="mini"  icon="el-icon-plus" @click="iterationSelectVisible=true">将更多迭代加入产品<strong>{{xmProduct.productName}}</strong></el-button>
 					</el-col>	
				</el-row>
				<el-button  slot="reference" icon="el-icon-more" circle></el-button>
			</el-popover>
 		</el-row>
		<el-row  class="page-main">
			<!--列表 XmIteration 迭代定义-->
			<el-table ref="table" :height="tableHeight" v-if="!gstcVisible" :data="xmIterationTreeData" row-key="id"  default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column type="selection" aria-disabled width="55"></el-table-column>
				<el-table-column prop="iterationName" label="迭代名称" min-width="160" show-overflow-tooltip>
					 <template slot-scope="scope">
						<span>{{scope.row.seqNo}} &nbsp;&nbsp;<el-link type="primary" @click="intoInfo( scope.row,scope.$index)"> {{scope.row.iterationName}} </el-link></span>
					 </template>
				</el-table-column>
				<el-table-column prop="finishRate" label="总进度" min-width="80" >
					<template slot-scope="scope">
						 {{scope.row.finishRate}}%
					</template>
				</el-table-column>
				<el-table-column prop="startTime" label="开始时间" min-width="80" :formatter="formatterDate" show-overflow-tooltip></el-table-column>
				<el-table-column prop="endTime" label="结束时间" min-width="80" :formatter="formatterDate" show-overflow-tooltip></el-table-column>
				<el-table-column prop="onlineTime" label="上线时间" min-width="80" :formatter="formatterDate" show-overflow-tooltip></el-table-column>
 				<el-table-column prop="adminUsername" label="负责人姓名" min-width="80" show-overflow-tooltip></el-table-column>
 				<el-table-column prop="distBudgetWorkload" label="已分配工作量" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column prop="actWorkload" label="实际工作量" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="400" fixed="right">
					<template slot-scope="scope">
						<el-tooltip v-if="xmProduct" :content="'将迭代与'+ xmProduct.productName + '脱钩'"><el-button   @click="doDelXmIterationProductLink( scope.row,scope.$index)" icon="el-icon-remove-outline">与产品脱钩</el-button></el-tooltip>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button> 
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-if="!gstcVisible" layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
      		<xm-gantt v-if="gstcVisible" :tree-data="xmIterationTreeData" :project-phase="{startTime: '2020-06-01', endTime: '2020-12-30'}" :columns="ganrrColumns" :useRealTime="false"></xm-gantt>

			<!--编辑 XmIteration 迭代定义界面-->
			<el-drawer title="编辑迭代定义" :visible.sync="editFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-iteration-edit :xm-iteration="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-iteration-edit>
			</el-drawer>

			<!--新增 XmIteration 迭代定义界面-->
			<el-drawer title="新增迭代定义" :visible.sync="addFormVisible"  size="50%"  append-to-body  :close-on-click-modal="false">
				<xm-iteration-add :xm-iteration="addForm" :parent-iteration="parentIteration" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-iteration-add>
			</el-drawer>

			<!--新增 XmIteration 迭代定义界面-->
			<el-drawer title="迭代报告" :visible.sync="iterationStateVisible" fullscreen  append-to-body  :close-on-click-modal="false">
				<xm-iteration-state-mng :xm-iteration="editForm"   :visible="iterationStateVisible" @cancel="iterationStateVisible=false"></xm-iteration-state-mng>
			</el-drawer>
			
			<el-drawer title="迭代报告" :visible.sync="iterationSelectVisible" fullscreen  append-to-body  :close-on-click-modal="false">
				<xm-iteration-select @row-click="onXmIterationSelect"></xm-iteration-select>
			</el-drawer>
		</el-row> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmIteration,listXmIterationWithState, delXmIteration, batchDelXmIteration,loadTasksToXmIterationState } from '@/api/xm/core/xmIteration';
	import { addXmIterationProductLink,delXmIterationProductLink } from '@/api/xm/core/xmIterationProductLink';

	import  XmIterationAdd from './XmIterationAdd';//新增界面
	import  XmIterationEdit from './XmIterationEdit';//修改界面
	import  XmIterationStateMng from '../xmIterationState/XmIterationStateMng';//修改界面
  import XmGantt from '../components/xm-gantt';

	import { mapGetters } from 'vuex'
import XmIterationSelect from './XmIterationSelect.vue';

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),

			xmIterationTreeData(){
				return this.translateDataToTree(this.xmIterations);
      },
		},
		props:['xmProduct','selProject','menuId','visible'],
		watch:{
			visible:function(visible){
				if(visible==true){
					this.getXmIterations();
				}
			},
			xmProduct:function(){
				this.getXmIterations();
			},
			selProject:function(){
				this.getXmIterations();
			}
		},
		data() {
			const beginDate = new Date();
			const endDate = new Date();
			beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 3 ); 
			endDate.setTime(endDate.getTime() + 3600 * 1000 * 24 * 7 * 4 * 3 ); 
			return {
				filters: {
					key: '',
					queryScope:'',//迭代查询范围 iterationId\branchId\compete\''
					id:'',//迭代编号
				},
				pickerOptions:  util.pickerOptions('datarange'),
				dateRanger: [
					util.formatDate.format(beginDate, "yyyy-MM-dd"),
					util.formatDate.format(endDate, "yyyy-MM-dd")
				],//创建时间选择范围
				dateRangerOnline: [
					util.formatDate.format(beginDate, "yyyy-MM-dd"),
					util.formatDate.format(endDate, "yyyy-MM-dd")
				],//上线时间选择范围
				xmIterations: [],//查询结果
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

				addFormVisible: false,//新增xmIteration界面是否显示
				//新增xmIteration界面初始化数据
				addForm: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',seqNo:'',
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmIteration界面初始化数据
				editForm: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',seqNo:'',
				},
				editFormInit: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',seqNo:'',
				},

				/**begin 自定义属性请在下面加 请加备注**/
				valueChangeRows:[],
				parentIteration:null,
				iterationStateVisible:false,
				iterationSelectVisible:false,
				gstcVisible:false,
				tableHeight:300,
				ganrrColumns: {
				children: 'children',
				name: 'iterationName',
				id: 'id',
				pid: 'pid',
				startDate: 'startTime',
				endDate: 'endTime',
				}
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmIterations();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmIterations();
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
				this.getXmIterations();
			},
			searchXmIterations(){
				 this.pageInfo.count=true;
				 this.getXmIterations();
			},
			//获取列表 XmIteration 迭代定义
			getXmIterations() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				}; 
				if(!this.dateRangerOnline || this.dateRangerOnline.length==0){
					this.$message({showClose: true, message: "上线日期范围不能为空", type: 'error' });
					return;
				}
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key){
					params.key= "%"+this.filters.key+"%"
				}
				if(this.xmProduct){
					params.productId=this.xmProduct.id
				}
				if(this.selProject){
					params.projectId=this.selProject.id
				}
				if(this.menuId){
					params.menuId=this.menuId
				} 
				if( !this.menuId && !this.xmProduct && !this.selProject){
					params.queryScope=this.filters.queryScope 
					if(this.filters.queryScope=='iterationId'){
						if(!this.filters.id){
							this.$message({showClose: true, message:"您选择了按迭代编号精确查找模式，请输入迭代编号", type: 'error' });
							return;
						}
						params.id=this.filters.id
						
					}
					if(this.filters.queryScope=="branchId"){
						params.branchId=this.userInfo.branchId
					}
					if(this.filters.queryScope!="iterationId"){
						params.onlineTimeStart=this.dateRangerOnline[0]+" 00:00:00"
						params.onlineTimeEnd=this.dateRangerOnline[1]+" 23:59:59"
					}
					
				}
				this.load.list = true;
				listXmIterationWithState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmIterations = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmIteration 迭代定义
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmIteration 迭代定义
			showAdd: function () {
				if(!this.roles.some(i=>i.roleid=='iterationAdmin')){
					this.$message({showClose: true, message: "只有迭代管理员可以新增迭代", type:  'error' });
					return ;
				}
				this.parentIteration=null
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			showSubAdd: function (row) {
				this.parentIteration=row
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(xmIteration){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				if(this.xmProduct){//如果是产品试图界面添加的迭代，直接添加产品与迭代的关联关系
					this.onXmIterationSelect(xmIteration);
				}else{ 
					this.getXmIterations();
				} 
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			
			//进入info界面
			intoInfo(row) {
				this.editForm = row;
				this.$router.push({ name:'XmIterationInfoRoute', params: row })
				//this.showInfo = true;
			},
			//选择行xmIteration
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除xmIteration
			handleDel: function (row,index) {
				if(!this.roles.some(i=>i.roleid=='iterationAdmin')){
					this.$message({showClose: true, message: "只有迭代管理员可以删除迭代", type:  'error' });
					return ;
				}
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { id: row.id };
					delXmIteration(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getXmIterations();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmIteration
			batchDel: function () {
				if(!this.roles.some(i=>i.roleid=='iterationAdmin')){
					this.$message({showClose: true, message: "只有迭代管理员可以删除迭代", type:  'error' });
					return ;
				}
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmIteration(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmIterations();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.editForm=row
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/

			translateDataToTree(data2) {
				var data=JSON.parse(JSON.stringify(data2));
				let parents = data.filter(value =>{
					//如果我的上级为空，则我是最上级
					if(value.pid == 'undefined' || value.pid == null  || value.pid == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.pid==i.id)){
						return false;
					}else {
						return true
					}

				})
				let children = data.filter(value =>{
					if(data.some(i=>value.pid==i.id)){
						return true;
					}else{
						return false;
					}
				})
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.pid === parent.id) {
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

			clearSelectIteration(){
				this.editForm=this.editFormInit
				this.$emit('clear-select',null );//  @row-click="rowClick"
			},
			fieldChange:function(row,fieldName){

				if(this.valueChangeRows.some(i=>i.id==row.id)){
					return;
				}else{
					this.valueChangeRows.push(row)
				}
			},
			loadTasksToXmIterationState(row){

				this.load.edit=true;
				loadTasksToXmIterationState({id:row.id}).then(res=>{
					this.load.edit=false;
					var tips =res.data.tips;
					if(tips.isOk){
						this.getXmIterations();
					}
					this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
				});
			},
			showIterationState(row){
				this.editForm=row
				this.iterationStateVisible=true;
			},
			formatterDate(row,column,cellValue, index){
				if(cellValue){
					return cellValue.substr(0,10);
				}else{
					return cellValue;
				}
      },
			onXmIterationSelect:function(row){
				var xmIteration=row;
				var xmProduct=this.xmProduct;
				this.$confirm('确认将产品【'+xmProduct.productName+'】加入迭代计划【'+xmIteration.iterationName+'】吗？', '提示', {
					type: 'warning'
				}).then(()=>{
					addXmIterationProductLink({iterationId:xmIteration.id,productId:xmProduct.id}).then(res=>{
						var tips =res.data.tips;
						if(tips.isOk){ 
							this.getXmIterations();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					})
				})
			},
			doDelXmIterationProductLink(row){ 
				var xmIteration=row;
				var xmProduct=this.xmProduct;
				this.$confirm('确认将产品【'+xmProduct.productName+'】与迭代【'+xmIteration.iterationName+'】进行脱钩吗？脱钩后，产品与迭代互相查看不到对方信息。', '提示', {
					type: 'warning'
				}).then(()=>{
					delXmIterationProductLink({iterationId:xmIteration.id,productId:xmProduct.id}).then(res=>{
						var tips =res.data.tips;
						if(tips.isOk){
							this.getXmIterations();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					})
				})
			}
		},//end methods
		components: {
		    'xm-iteration-add':XmIterationAdd,
			'xm-iteration-edit':XmIterationEdit,
			XmIterationStateMng,XmGantt,
			XmIterationSelect,
		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {
				var clientRect=this.$refs.table.$el.getBoundingClientRect();
				var subHeight=70/1000 * window.innerHeight;
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight;
				this.getXmIterations();
        	});
          // console.log(this.dateRanger,this.dateRangerOnline);
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
