<template>
	<section> 
		<el-row class="padding-top"> 
			<el-table ref="xmWorkloadTable" :max-height="maxTableHeight" :data="xmWorkloads" :row-style="{height:'50px'}"  @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>
 				<el-table-column prop="username" label="姓名" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="bizDate" label="登记日期" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="workload" label="登记工时" width="120" show-overflow-tooltip></el-table-column>
 				<el-table-column prop="wstatus" label="确认状态" width="120" show-overflow-tooltip>
					 <template slot-scope="scope">
						<div class="cell-text">
							<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'wstatus',scope.row.wstatus)" :key="index" :type="item.className">{{item.name}}</el-tag>
						</div>
						<span class="cell-bar">
							<el-select  v-model="scope.row.wstatus" placeholder="工时状态"  style="display:block;"  @change="editXmWorkloadSomeFields(scope.row,'wstatus',$event)">
								<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.wstatus" :key="index"></el-option>
							</el-select>
						</span>
					 </template>
				 </el-table-column>
 				<el-table-column prop="sstatus" label="结算状态" width="120" show-overflow-tooltip>
					 <template slot-scope="scope">
						<div class="cell-text">
							<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'sstatus',scope.row.sstatus)" :key="index" :type="item.className">{{item.name}}</el-tag>
						</div>
						<span class="cell-bar">
							<el-select  v-model="scope.row.sstatus" placeholder="结算状态"  style="display:block;"  @change="editXmWorkloadSomeFields(scope.row,'sstatus',$event)">
								<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.sstatus" :key="index"></el-option>
							</el-select>
						</span>
					 </template>
				 </el-table-column> 
				<el-table-column prop="bizType" label="报工类型" width="120" show-overflow-tooltip>
					<template slot-scope="scope">
						<mdp-select-dict-tag :disabled="true" v-model="scope.row.bizType" :dict="dicts['wlBizType']"></mdp-select-dict-tag>
					</template> 
				</el-table-column> 
				<el-table-column prop="bizName" label="报工业务" width="120" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-link @click="openDialog(scope.row)">{{scope.row.bizName}}</el-link>
					</template>
				</el-table-column> 
				<el-table-column prop="remark" label="报工备注" width="120" show-overflow-tooltip></el-table-column>  
 				<el-table-column fixed="right" label="操作" min-width="120">
					<template slot-scope="scope">
               				<xm-task-sbill-select style="display:inline;"  :auto-select="false"  :project-id="scope.row.projectId"    placeholder="结算"  @row-click="batchJoinToSbill(scope.row,$event)">
								<span slot="title">{{scope.row.sbillId?'结算单:'+scope.row.sbillId:'选择结算单'}}</span>
							</xm-task-sbill-select> 
 					</template>
				</el-table-column>
				

			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row> 
		<el-dialog title="任务明细" :visible.sync="taskDetailVisible" width="90%" top="20px" append-to-body>
			<xm-task-detail :visible="taskDetailVisible" :xm-task="{id:editForm.taskId,name:editForm.bizName}" :reload="true"></xm-task-detail>
		</el-dialog>
		
		<el-dialog title="缺陷明细" :visible.sync="bugDetailVisible" width="90%" top="20px" append-to-body>
			<xm-question-detail :visible="bugDetailVisible" :xm-question="{id:editForm.bugId,name:editForm.bizName}" :reload="true"></xm-question-detail>
		</el-dialog>
		
		<el-dialog title="测试用例明细" :visible.sync="caseDetailVisible" width="90%" top="20px" append-to-body>
			<xm-test-case-detail :visible="caseDetailVisible" :xm-test-case="{id:editForm.caseId,name:editForm.bizName}" :reload="true"></xm-test-case-detail>
		</el-dialog>
		
		<el-dialog title="执行用例明细" :visible.sync="planCaseDetailVisible" width="90%" top="20px" append-to-body>
			<xm-test-plan-case-detail :visible="planCaseDetailVisible" :xm-plan-test-case="{planId:editForm.planId,caseId:editForm.caseId,name:editForm.bizName}" :reload="true"></xm-test-plan-case-detail>
		</el-dialog>
		
		<el-dialog title="需求明细" :visible.sync="menuDetailVisible" width="90%" top="20px" append-to-body>
			<xm-menu-detail :visible="menuDetailVisible" :xm-menu="{id:editForm.menuId,name:editForm.bizName}" :reload="true"></xm-menu-detail>
		</el-dialog>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
  	import {batchJoinToSbill} from "@/api/xm/core/xmTaskSbill";
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { listXmWorkload, delXmWorkload, batchDelXmWorkload,editXmWorkloadSomeFields,initDicts } from '@/api/xm/core/xmWorkload';
	import { mapGetters } from 'vuex'
	
  import XmTaskSbillSelect from "./XmTaskSbillSelect";

	export default {
	    name:'xmWorkloadSimpleListForBizDate',
		components: {
			XmTaskSbillSelect,
			"xm-task-detail":()=>import("../xmTask/XmTaskDetail"),
			"xm-question-detail":()=>import("../xmQuestion/XmQuestionDetail"),
			"xm-test-case-detail":()=>import("../xmTestCase/XmTestCaseDetail"),
			"xm-test-plan-case-detail":()=>import("../xmTestPlanCase/XmTestPlanCaseDetail"),
			"xm-menu-detail":()=>import("../xmMenu/XmMenuDetail"),
		},
		props:[ 'visible','wstatus','sstatus','bizDate','projectId','userid','taskId','bizMonth','detailId','sbillId'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
             visible(val){
				if(val){
					this.searchXmWorkloads();
				}
			 }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmWorkloads: [],//查询结果
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
				dicts:{
					taskType:[],
					taskState:[],
					wstatus:[],
					sstatus:[],
					wlBizType:[],
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmWorkload界面是否显示
				addForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:''
				},

				editFormVisible: false,//编辑界面是否显示
				editForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:''
				},
				maxTableHeight:300,
				sbillVisible:false,
				taskDetailVisible:false,
				bugDetailVisible:false,
				caseDetailVisible:false,
				planCaseDetailVisible:false,
				menuDetailVisible:false, 
			}
		},//end data
		methods: {
			...util,
			editXmWorkloadSomeFields(row,fieldName,$event){  
				let params={
				ids:[row.id],
				};
				if(this.sels.length>0){
				if(this.sels.some(k=>k.projectId!=row.projectId)){
					this.$notify({position:'bottom-left',showClose:true,message:'存在不同项目的工时单，请重新选择',type:'warning'})
					return;
				}
				params.ids=this.sels.map(i=>i.id); 
				}else{
				params.ids = [row.id]; 
				params[fieldName]=$event
				}
				var func = editXmWorkloadSomeFields
				if(fieldName==='sbillId'){
				func = editWorkloadToSbill
				params.sbillId=$event.id
				}else{ 
				params[fieldName]=$event
				}
				func(params).then(res=>{
				let tips = res.data.tips; 
				this.getXmWorkloads();
				if(tips.isOk){
					this.$emit("edit-some-fields",params)
				}else{
					this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
				}
				})
			},  
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmWorkloads();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmWorkloads();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				if(obj.order==null){
					this.pageInfo.orderFields=[];
					this.pageInfo.orderDirs=[];
				}else{
					var dir='asc';
					if(obj.order=='ascending'){
						dir='asc'
					}else{
						dir='desc';
					}

					this.pageInfo.orderFields=[util.toLine(obj.prop)];
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmWorkloads();
			},
			searchXmWorkloads(){
				 this.pageInfo.count=true;
				 this.getXmWorkloads();
			},
			//获取列表 XmWorkload 工时登记表
			getXmWorkloads() {
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
				if(this.filters.key){
					params.key=this.filters.key
				} 

				if(this.projectId){
					params.projectId=this.projectId
				}
				
				if(this.taskId){
					params.taskId=this.taskId
				}
				if(this.userid){
					params.userid=this.userid
				}

				if(this.wstatus){
					params.wstatus=this.wstatus
				}
				if(this.sstatus){
					params.sstatus=this.sstatus
				}

				if(this.bizMonth){
					params.bizMonth=this.bizMonth
				}
				
				if(this.bizDate){
					params.bizDate=this.bizDate
				}

				if(this.detailId){
					params.detailId=this.detailId
				}
				
				if(this.sbillId){
					params.sbillId=this.sbillId
				}
				this.load.list = true;
				listXmWorkload(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmWorkloads = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmWorkload 工时登记表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmWorkload 工时登记表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmWorkloads();
				this.$emit('submit',this.editForm)
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.$emit('submit',this.editForm)
			},
			//选择行xmWorkload
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除xmWorkload
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = {  id:row.id };
					delXmWorkload(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getXmWorkloads();
							this.$emit('submit',this.editForm)
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmWorkload
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { id:i.id}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmWorkload(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmWorkloads();
							this.$emit('submit')
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
			    this.editForm=row
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },
			showSbill(row){
				this.editForm=row
				this.sbillVisible=true;
			},
			//批量删除xmWorkload
			batchJoinToSbill: function (row,sbill) {
				if(!sbill || sbill.id==null){
				this.$notify({position:'bottom-left',showClose:true,message:'请选择结算单',type:'warning'})
				return;
				}
				this.sbillVisible=false;
				let params={
				workloadIds:[row.id],
				sbillId:sbill.id
				};
				if(this.sels.length>0){
				if(this.sels.some(k=>k.projectId!=row.projectId)){
					this.$notify({position:'bottom-left',showClose:true,message:'存在不同项目的工时单，请重新选择',type:'warning'})
					return;
				}
				params.workloadIds=this.sels.map(i=>i.id); 
				}  
				this.load.edit=true;
				batchJoinToSbill(params).then((res) => {
					this.load.edit=false;
					var tips=res.data.tips;
					if( tips.isOk ){
						this.pageInfo.count=true;
						this.getXmWorkloads();
					}
					this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
				}).catch( err  => this.load.edit=false ); 
			},
			openDialog(row){
				this.editForm=row
				if(row.bizType=='1'){
					this.taskDetailVisible=true
				}else if(row.bizType=='2'){
					this.bugDetailVisible=true
				}else if(this.bizType=='3'){
					this.caseDetailVisible=true
				}else if(this.bizType=='4'){
					this.planCaseDetailVisible=true
				}else if(this.bizType=='5'){
					this.menuDetailVisible=true
				}
			}

		},//end methods
		mounted() {
			this.$nextTick(() => { 
				initDicts(this); 
				this.initData() 
				this.searchXmWorkloads(); 
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmWorkloadTable.$el)

        	});
		}
	}

</script>

<style scoped>
	.label {
		font-family: 黑体; 
	}
</style>
