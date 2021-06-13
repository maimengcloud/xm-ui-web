<template>
	<section>
		<el-row class="app-container">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmQuestions">查询</el-button>
			<el-button type="primary" @click="showAdd">+xm_question</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="app-container"> 
			<!--列表 XmQuestion xm_question-->
			<el-table :data="xmQuestions" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="id" label="问题编号" min-width="80" ></el-table-column>
				<el-table-column prop="name" label="问题标题" min-width="80" ></el-table-column>
				<el-table-column prop="projectId" label="项目编号" min-width="80" ></el-table-column>
				<el-table-column prop="projectName" label="项目名称" min-width="80" ></el-table-column>
				<el-table-column prop="taskId" label="任务编号" min-width="80" ></el-table-column>
				<el-table-column prop="taskName" label="任务名称" min-width="80" ></el-table-column>
				<el-table-column prop="endTime" label="到期时间" min-width="80" ></el-table-column>
				<el-table-column prop="askUserid" label="提出人编号" min-width="80" ></el-table-column>
				<el-table-column prop="askUsername" label="提出人" min-width="80" ></el-table-column>
				<el-table-column prop="handlerUserid" label="处理人编号" min-width="80" ></el-table-column>
				<el-table-column prop="handlerUsername" label="处理人" min-width="80" ></el-table-column>
				<el-table-column prop="priority" label="优先级别" min-width="80" ></el-table-column>
				<el-table-column prop="solution" label="解决方案3不是问题，4已解决，6延后处理" min-width="80" ></el-table-column>
				<el-table-column prop="description" label="问题描述" min-width="80" ></el-table-column>
				<el-table-column prop="createUserid" label="问题创建人编号" min-width="80" ></el-table-column>
				<el-table-column prop="createUsername" label="问题创建人" min-width="80" ></el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="80" ></el-table-column>
				<el-table-column prop="status" label="状态，0未提交，2已领取，4已解决，5已关闭" min-width="80" ></el-table-column>
				<el-table-column prop="bizProcInstId" label="当前流程实例编号" min-width="80" ></el-table-column>
				<el-table-column prop="bizFlowState" label="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除" min-width="80" ></el-table-column>
				<el-table-column prop="menuId" label="菜单编号" min-width="80" ></el-table-column>
				<el-table-column prop="menuName" label="菜单名称" min-width="80" ></el-table-column>
				<el-table-column prop="planWorkload" label="预估工时单位人时" min-width="80" ></el-table-column>
				<el-table-column prop="planCostAmount" label="预估成本金额" min-width="80" ></el-table-column>
				<el-table-column prop="totalActWorkload" label="实际工时" min-width="80" ></el-table-column>
				<el-table-column prop="totalActCostAmount" label="实际总金额" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="160" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmQuestion xm_question界面-->
			<el-dialog title="编辑xm_question" :visible.sync="editFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-question-edit :xm-question="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-question-edit>
			</el-dialog>
	
			<!--新增 XmQuestion xm_question界面-->
			<el-dialog title="新增xm_question" :visible.sync="addFormVisible"  width="50%"  append-to-body  :close-on-click-modal="false">
				<xm-question-add :xm-question="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-question-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmQuestion, delXmQuestion, batchDelXmQuestion } from '@/api/xm/core/xmQuestion';
	import  XmQuestionAdd from './XmQuestionAdd';//新增界面
	import  XmQuestionEdit from './XmQuestionEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmQuestions: [],//查询结果
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
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmQuestion界面是否显示
				//新增xmQuestion界面初始化数据
				addForm: {
					id:'',name:'',projectId:'',projectName:'',taskId:'',taskName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'',solution:'',description:'',createUserid:'',createUsername:'',createTime:'',status:'',bizProcInstId:'',bizFlowState:'',menuId:'',menuName:'',planWorkload:'',planCostAmount:'',totalActWorkload:'',totalActCostAmount:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmQuestion界面初始化数据
				editForm: {
					id:'',name:'',projectId:'',projectName:'',taskId:'',taskName:'',endTime:'',askUserid:'',askUsername:'',handlerUserid:'',handlerUsername:'',priority:'',solution:'',description:'',createUserid:'',createUsername:'',createTime:'',status:'',bizProcInstId:'',bizFlowState:'',menuId:'',menuName:'',planWorkload:'',planCostAmount:'',totalActWorkload:'',totalActCostAmount:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
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
				
				if(this.filters.key){
					params.key='%'+this.filters.key+'%'
				}
				this.load.list = true;
				listXmQuestion(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmQuestions = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmQuestion xm_question
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmQuestion xm_question
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmQuestions();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
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
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
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
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-question-add':XmQuestionAdd,
		    'xm-question-edit':XmQuestionEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmQuestions();
        	}); 
		}
	}

</script>

<style scoped>

</style>