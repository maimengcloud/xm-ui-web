<template>
	<section class="page-container  padding border">
		<el-row>  
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button   type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmMenus">查询</el-button>
			<el-button   type="warning" v-if=" batchEditVisible!=true " v-loading="load.edit" :disabled="load.edit==true" v-on:click="loadTasksToXmMenuState">根据任务汇总更新数据</el-button>			
			<el-button type="primary" v-if=" batchEditVisible!=true " @click="showBatchEdit" v-loading="load.edit">批量修改</el-button> 
			<el-button type="primary" v-if=" batchEditVisible==true "  @click="saveBatchEdit" v-loading="load.edit">批量保存</el-button>
			<el-button type="primary" v-if=" batchEditVisible==true "  @click="noBatchEdit" v-loading="load.edit">返回</el-button>  
  		</el-row>
		<el-row class="page-main" v-show="!batchEditVisible">    
				<el-table ref="table" :height="tableHeight" :data="xmMenusTreeData" default-expand-all  row-key="menuId" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column sortable type="selection" width="40"></el-table-column>
 					<el-table-column prop="menuName" label="需求名称" min-width="150" >
						<template slot-scope="scope"> 
							<el-link @click="toMenu(scope.row)">  {{scope.row.seqNo}}&nbsp;&nbsp;{{scope.row.menuName}} </el-link>
						</template>
					</el-table-column>  
					<el-table-column prop="planStatus" label="计划状态" width="100" :formatter="formatterOption"></el-table-column> 
 					<el-table-column prop="chargeUsername" label="负责人" width="120" ></el-table-column>   
					<el-table-column prop="onlineTime" label="上线时间" width="120" >
						<template slot-scope="scope"> 
							{{getDateString(scope.row.planStartTime)}} 
						</template>
					</el-table-column>  
 					<el-table-column prop="planStartTime" label="开始时间~结束时间" width="200" >
						<template slot-scope="scope">
							 计划：{{getDateString(scope.row.planStartTime)}}~{{getDateString(scope.row.planEndTime)}}<br>
							 实际：{{getDateString(scope.row.actStartTime)}}~{{getDateString(scope.row.actEndTime)}}
						</template>
					</el-table-column> 
					<el-table-column prop="planWorkload" label="工作量.人时" width="120" >
						<template slot-scope="scope">
							 计划：{{scope.row.planWorkload}}<br>
							 实际：{{scope.row.actWorkload}}
						</template> 
					</el-table-column> 
					<el-table-column prop="planCostAmount" label="成本.元" width="120" >
						<template slot-scope="scope">
							 计划：{{scope.row.planCostAmount}}<br>
							 实际：{{scope.row.actCostAmount}}
						</template> 
					</el-table-column> 
					<el-table-column prop="finishRate" label="进度"  width="80" >
						<template slot-scope="scope">
							
							<el-popover
								placement="bottom"
								title="进度情况"
								width="200"
								trigger="click" >
								<el-row>
									总体:{{scope.row.finishRate}}%
								</el-row>
								<el-row>
									需求：{{scope.row.demandRate}}%
								</el-row>
								<el-row>
									设计：{{scope.row.designRate}}%
								</el-row>
								<el-row>
									开发:{{scope.row.devRate}}%
								</el-row>
								<el-row>
									sit ：{{scope.row.sitRate}}%
								</el-row>
								<el-row>
									uat :{{scope.row.uatRate}}%
								</el-row> 
								<el-button type="text" slot="reference">{{scope.row.finishRate}}%</el-button>
							</el-popover>
							
						</template> 
					</el-table-column>   
					<el-table-column prop="onlineStatus" label="上线状态" width="80" >
						<template slot-scope="scope"> 
							<el-tag v-if="scope.row.onlineStatus=='0'|| !scope.row.onlineStatus" type="info">未上线</el-tag>
							<el-tag v-if="scope.row.onlineStatus=='1'" type="success">已上线</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="100" fixed="right"  >
						<template slot-scope="scope">
							<el-button v-if="scope.row.projectId" type="text" @click="showTasks(scope.row)"  icon="el-icon-tickets">查看任务</el-button>
							<el-tag v-else type="warning">未关联任务</el-tag>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
				  
		</el-row>
		<el-row v-show="batchEditVisible">
			<el-table :data="xmMenusTreeData"   row-key="menuId" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 
 					<el-table-column prop="menuName" label="需求名称" min-width="150" >
						<template slot-scope="scope"> 
							 {{scope.row.seqNo}}&nbsp;&nbsp;{{scope.row.menuName}} <el-button v-if="scope.row.projectId" type="text" @click="showTasks(scope.row)">任务</el-button><el-tag v-else type="warning">未关联任务</el-tag>
						</template>
					</el-table-column>  
					<el-table-column prop="chargeUsername" label="负责人" min-width="80" >
						<template slot-scope="scope"> 
							{{scope.row.chargeUsername}} <el-button v-if="scope.row.projectId" @click="showGroupUsers(scope.row)">选人</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="onlineStatus" label="上线状态" min-width="80" > 
						<template slot-scope="scope"> 
							<el-checkbox v-model="scope.row.onlineStatus" :disabled="!scope.row.projectId" true-label="1" false-label="0"  @change="fieldChange(scope.row,'onlineStatus')">已上线</el-checkbox>
						</template>
					</el-table-column>
					<el-table-column prop="onlineTime" label="上线时间" min-width="80" >
						<template slot-scope="scope"> 
							    <el-date-picker  @change="fieldChange(scope.row,'onlineTime')"
									v-model="scope.row.onlineTime"
									type="date"
									:disabled="!scope.row.projectId"
									format="yyyy-MM-dd"
									value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择日期">
								</el-date-picker>
						</template>
					</el-table-column>
					<el-table-column prop="planStatus" label="计划状态" min-width="80" > 
						<template slot-scope="scope"> 
							<el-select v-model="scope.row.planStatus" @change="fieldChange(scope.row,'planStatus')" :disabled="!scope.row.projectId">
								<el-option v-for="i in options.xmMenuStateStatus" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
							</el-select>
						</template>
					</el-table-column> 
 				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		</el-row>
		
			<el-drawer
				append-to-body
				title="项目分组"
				:visible.sync="groupSelectVisible"
				width="80%">
				<xm-group-mng :sel-project="selProject"  :is-select-single-user="1"     @user-confirm="onUserSelected"></xm-group-mng> 
			</el-drawer>
			<el-drawer
				append-to-body
				title="任务"
				:visible.sync="taskMngVisible"
				fullscreen>
				<xm-task-mng :sel-project="selProject"   :menu-id="editForm.menuId"></xm-task-mng> 
			</el-drawer>
			
			<el-drawer title="需求谈论" :visible.sync=" menuDetailVisible"  size="80%"  append-to-body   :close-on-click-modal="false">
				<xm-menu-rich-detail :visible="menuDetailVisible"  :reload="false" :xm-menu="editForm" ></xm-menu-rich-detail>
			</el-drawer> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmMenuWithState} from '@/api/xm/core/xmMenu'; 

 	import { loadTasksToXmMenuState} from '@/api/xm/core/xmMenuState'; 
	
	import XmGroupMng from '../xmProjectGroup/XmProjectGroupMng';
	import XmTaskMng from '../xmTask/XmTaskMng'; 
 	import XmMenuRichDetail from '../xmMenu/XmMenuRichDetail';

	import { mapGetters } from 'vuex'
	
	export default { 
		props:[ 'selProject'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
			
			xmMenusTreeData(){ 
				return this.translateDataToTree(this.xmMenus);
			},
		},
		watch:{
			selProject:function(selProject){ 
				this.getXmMenus(); 
			}
		},
		data() {
			return {
				filters: {
					key: '', 
				},
				xmMenus: [],//查询结果
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
					xmMenuStateStatus:[]
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmMenu界面是否显示
				//新增xmMenu界面初始化数据
				addForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',projectId:'',id:'',projectName:'',planStartTime:'',planEndTime:'',actStartTime:'',actEndTime:'',planWorkload:'',actWorkload:'',planCostAmount:'',actCostAmount:'',finishRate:'',demandRate:'',designRate:'',devRate:'',uatRate:'',sitRate:'',onlineStatus:'',onlineTime:'',planStatus:'',chargeUserid:'',chargeUsername:'',menuStatus:'',ctime:'',ltime:'',cuserid:'',cusername:'',calcTime:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmMenu界面初始化数据
				editForm: {
						menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'',online:'',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',projectId:'',id:'',projectName:'',planStartTime:'',planEndTime:'',actStartTime:'',actEndTime:'',planWorkload:'',actWorkload:'',planCostAmount:'',actCostAmount:'',finishRate:'',demandRate:'',designRate:'',devRate:'',uatRate:'',sitRate:'',onlineStatus:'',onlineTime:'',planStatus:'',chargeUserid:'',chargeUsername:'',menuStatus:'',ctime:'',ltime:'',cuserid:'',cusername:'',calcTime:''
				}, 
				batchEditVisible:false,
				groupSelectVisible:false,
				taskMngVisible:false,
				valueChangeRows:[],
				selGroups:null,
				menuDetailVisible:false,
				tableHeight:300,
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
				if(this.selProject){
					params.projectId=this.selProject.id
				}
				
				this.load.list = true;
				listXmMenuWithState(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmMenus = res.data.data;
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
  
			//选择行xmMenu
			selsChange: function (sels) {
				this.sels = sels;
			},  
			//删除xmMenu
			loadTasksToXmMenuState: function () {  
				this.load.edit=true;
				let params = { projectId: this.selProject.id };
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
			//删除xmMenu
			batchAddPlanFromTasks: function () {  
				this.load.add=true;
				let params = { projectId: this.selProject.id };
				batchAddPlanFromTasks(params).then((res) => {
					this.load.add=false;
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.count=true;
						this.getXmMenus();
					}
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
				}).catch( err  => this.load.add=false ); 
			}, 
			//批量删除xmMenu
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmMenuState(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmMenus(); 
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
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
				
			getDateString(dateStr){
				if(dateStr==null || dateStr=="" || dateStr==undefined){
					return ""
				}else{
					return dateStr.substr(0,10);
				}
			},
			formatterOption: function(row,column,cellValue, index){ 
				var columnName=column.property;
				var key="";
				if(columnName=='planStatus'){
					key="xmMenuStateStatus"
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
			showBatchEdit:function(){
				if(this.xmMenus.length==0 ){
					this.$notify({showClose: true, message:"没有数据可以修改", type: 'error'});
					return ;
				}
				 
				this.batchEditVisible=true
			},
			saveBatchEdit:function(){ 
				if(this.valueChangeRows.length==0){
					this.$notify({showClose: true, message:"没有改变任何数据，无需保存", type: 'success'});
					return;
				}else {
					 
					this.load.edit=true;
					batchEditXmMenuState(this.valueChangeRows).then(res=>{ 
						this.load.edit=false;
						var tips =res.data.tips;
						if(tips.isOk){
							this.valueChangeRows=[]
							this.getXmMenus()
						}
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'}); 
						
					}).catch(e=>this.load.edit=false);
				}
				
			},
			noBatchEdit(){
				this.batchEditVisible=false;
				if(this.valueChangeRows.length>0){
					this.valueChangeRows=[];
					this.getXmMenus()
				}
				
			},
			fieldChange:function(row,fieldName){
				if(this.valueChangeRows.some(i=>i.id==row.id)){
					return;
				}else{
					this.valueChangeRows.push(row)
				} 
			},
			onUserSelected:function(users){
				if(users.length>0){
					var user=users[0]
					this.editForm.chargeUserid=user.userid
					this.editForm.chargeUsername=user.username
				}else{
					this.editForm.chargeUserid=''
					this.editForm.chargeUsername=''
				}
				this.fieldChange(this.editForm,'chargeUserid')
				this.groupSelectVisible=false
			},
			showGroupUsers(row){
				this.editForm=row
				this.groupSelectVisible=true
			},
			showTasks(row){
				this.editForm=row
				this.taskMngVisible=true
			}, 
			toMenu:function(row){
				this.editForm=row
				this.menuDetailVisible=true;
			},
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {   
			//在下面添加其它组件
			XmGroupMng,XmTaskMng,XmMenuRichDetail
		},
		mounted() {  
			this.$nextTick(() => {
				
				
				this.tableHeight =  util.calcTableMaxHeight(".el-table"); 
				this.getXmMenus();
			}); 
				listOption([{categoryId:'all',itemCode:'xmMenuStateStatus'} ]).then(res=>{
					this.options=res.data.data;
				})		
		}
	}

</script>

<style scoped>

</style>