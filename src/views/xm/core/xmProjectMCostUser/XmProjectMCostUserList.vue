<template>
	<section>
		<el-row class="app-container">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectMCostUsers">查询</el-button>
		</el-row>
		<el-row class="app-container"> 
			<!--列表 XmProjectMCostUser xm_project_m_budget_cost_user-->
			<el-table ref="table" :height="tableHeight" :data="xmProjectMCostUsers" show-summary @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>   
				<el-table-column prop="username" label="用户名" min-width="80" >
					<template slot-scope="scope">
						<el-input v-if="batchEditVisible==true" v-model="scope.row.username" placeholder="用户名" @change="fieldChange(scope.row)"></el-input> 
						<div v-else>{{scope.row.username}}</div>
					</template>
				</el-table-column>
				
				<el-table-column prop="subjectId" label="成本科目编号" min-width="80" >
					<template slot-scope="scope">
						<el-select   :disabled="batchEditVisible==false"  placeholder="成本科目编号" v-model="scope.row.subjectId" @change="fieldChange(scope.row)">
						<el-option
							v-for="(item,i) in options.projectSubject"
							:key="i"
							:label="item.optionName"
							:value="item.optionValue">
						</el-option>
					</el-select> 
					</template>
					
				</el-table-column> 
				<el-table-column prop="actCostAmount" label="成本金额" min-width="80" >
					<template slot-scope="scope">
						<el-input  v-if="batchEditVisible==true" v-model="scope.row.actCostAmount" type="number" placeholder="成本金额" @change="fieldChange(scope.row)"></el-input>
						<div v-else>{{scope.row.actCostAmount}}</div>
					</template>

				</el-table-column>  
				<el-table-column prop="bizMonth" label="费用月份" min-width="80" >
					<template slot-scope="scope">
						<el-date-picker  v-if="batchEditVisible==true" @change="fieldChange(scope.row)"
							v-model="scope.row.bizMonth"
							type="month"
							value-format="yyyy-MM"
							placeholder="选择年月">
						</el-date-picker> 
						<div v-else>{{scope.row.bizMonth}}</div>
					</template> 
				</el-table-column> 
				<el-table-column prop="costType" label="成本类型" min-width="80" >
					<template slot-scope="scope"> 
						<el-radio :disabled="batchEditVisible==false" @change="fieldChange(scope.row)"  v-model="scope.row.costType" label="1">内部人力</el-radio>
						<el-radio :disabled="batchEditVisible==false" @change="fieldChange(scope.row)" v-model="scope.row.costType" label="2">外购人力</el-radio>
					</template>
					
				</el-table-column>
				<el-table-column prop="remark" label="备注" min-width="80" >
					<template slot-scope="scope">
						<el-input  v-if="batchEditVisible==true" v-model="scope.row.remark" placeholder="备注" @change="fieldChange(scope.row)"></el-input> 
						<div v-else>{{scope.row.remark}}</div>
					</template> 
				</el-table-column>
				<el-table-column prop="bizFlowState" label="审批状态" min-width="80" ></el-table-column> 
				<el-table-column label="操作" width="160" fixed="right"   v-if="batchEditVisible==false">
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 

		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectMCostUser } from '@/api/xm/core/xmProjectMCostUser';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['projectId','taskId','userid'],
		watch:{
			visible:function(visible){
				if(visible==true){
					this.getXmProjectMCostUsers();
				}
				
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmProjectMCostUsers: [],//查询结果
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
					projectSubject:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProjectMCostUser界面是否显示
				//新增xmProjectMCostUser界面初始化数据
				addForm: {
					subjectId:'',projectId:'',userid:'',createTime:'',sendCostTime:'',username:'',projectName:'',remark:'',id:'',taskId:'',taskName:'',actWorkload:'',bizzStartDate:'',bizzEndDate:'',bizProcInstId:'',bizFlowState:'',projectPhaseId:'',actCostAmount:'',costType:'',bizMonth:'',bizDate:'',subjectName:'',projectPhaseName:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectMCostUser界面初始化数据
				editForm: {
					subjectId:'',projectId:'',userid:'',createTime:'',sendCostTime:'',username:'',projectName:'',remark:'',id:'',taskId:'',taskName:'',actWorkload:'',bizzStartDate:'',bizzEndDate:'',bizProcInstId:'',bizFlowState:'',projectPhaseId:'',actCostAmount:'',costType:'',bizMonth:'',bizDate:'',subjectName:'',projectPhaseName:''
				},
				tableHeight:300,
				/**begin 自定义属性请在下面加 请加备注**/ 
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjectMCostUsers();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectMCostUsers();
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
				this.getXmProjectMCostUsers();
			},
			searchXmProjectMCostUsers(){
				 this.pageInfo.count=true; 
				 this.getXmProjectMCostUsers();
			},
			//获取列表 XmProjectMCostUser xm_project_m_budget_cost_user
			getXmProjectMCostUsers() {
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
				if(this.filters.key!==""){
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
 
				if(this.projectId!=null && this.projectId !=undefined){
					params.projectId=this.projectId
				}
				if(this.taskId!=null && this.taskId !=undefined){
					params.taskId=this.taskId
				}
				if(this.userid!=null && this.userid !=undefined){
					params.userid=this.userid
				}
				this.load.list = true;
				listXmProjectMCostUser(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectMCostUsers = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectMCostUser xm_project_m_budget_cost_user
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProjectMCostUser xm_project_m_budget_cost_user
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjectMCostUsers();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProjectMCostUser
			selsChange: function (sels) {
				this.sels = sels;
			},  
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/ 
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				
				var clientRect=this.$refs.table.$el.getBoundingClientRect();
				var subHeight=50/1000 * window.innerHeight; 
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight; 
				this.getXmProjectMCostUsers();
			}); 
			
				listOption([{categoryId:'all',itemCode:'projectSubject'}]).then(res=>{
					this.options=res.data.data;
				})	
		}
	}

</script>

<style scoped>

</style>