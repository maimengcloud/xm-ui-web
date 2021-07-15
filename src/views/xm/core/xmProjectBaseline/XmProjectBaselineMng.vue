<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectBaselines">查询</el-button>
			<el-button type="primary" @click="showAdd">+xm_project_baseline</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="page-main page-height-90"> 
			<!--列表 XmProjectBaseline xm_project_baseline-->
			<el-table :data="xmProjectBaselines" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="id" label="基线表主键" min-width="80" ></el-table-column>
				<el-table-column prop="code" label="项目代号" min-width="80" ></el-table-column>
				<el-table-column prop="name" label="项目名称" min-width="80" ></el-table-column>
				<el-table-column prop="xmType" label="项目类型" min-width="80" ></el-table-column>
				<el-table-column prop="startTime" label="项目开始时间" min-width="80" ></el-table-column>
				<el-table-column prop="endTime" label="项目结束时间" min-width="80" ></el-table-column>
				<el-table-column prop="urgent" label="紧急程度" min-width="80" ></el-table-column>
				<el-table-column prop="priority" label="优先程度" min-width="80" ></el-table-column>
				<el-table-column prop="description" label="项目描述" min-width="80" ></el-table-column>
				<el-table-column prop="createUserid" label="项目创建人编号" min-width="80" ></el-table-column>
				<el-table-column prop="createUsername" label="项目创建人" min-width="80" ></el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="80" ></el-table-column>
				<el-table-column prop="assess" label="项目考核" min-width="80" ></el-table-column>
				<el-table-column prop="assessRemarks" label="考核备注" min-width="80" ></el-table-column>
				<el-table-column prop="status" label="项目状态，0-初始，1-立项中，2-执行中，3-已结项，4-暂停" min-width="80" ></el-table-column>
				<el-table-column prop="branchId" label="机构编号" min-width="80" ></el-table-column>
				<el-table-column prop="planTotalCost" label="总预算" min-width="80" ></el-table-column>
				<el-table-column prop="bizProcInstId" label="当前流程实例编号" min-width="80" ></el-table-column>
				<el-table-column prop="bizFlowState" label="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除" min-width="80" ></el-table-column>
				<el-table-column prop="planNouserAt" label="非人力成本总预算-应该大于或等于阶段计划非人力总成本" min-width="80" ></el-table-column>
				<el-table-column prop="planInnerUserAt" label="内部人力成本总预算-应该大于或等于阶段计划内部人力总成本" min-width="80" ></el-table-column>
				<el-table-column prop="planOutUserAt" label="外购人力成本总预算-应该大于或等于阶段计划外购人力总成本" min-width="80" ></el-table-column>
				<el-table-column prop="locked" label="是否锁定整个项目不允许变化0否1是" min-width="80" ></el-table-column>
				<el-table-column prop="baseTime" label="基线时间" min-width="80" ></el-table-column>
				<el-table-column prop="baseRemark" label="基线备注" min-width="80" ></el-table-column>
				<el-table-column prop="baselineId" label="基线主键" min-width="80" ></el-table-column>
				<el-table-column prop="planWorkload" label="总预算工作量-应该大于或等于阶段计划总工作量" min-width="80" ></el-table-column>
				<el-table-column prop="totalReceivables" label="总预计收款金额" min-width="80" ></el-table-column>
				<el-table-column prop="budgetMarginRate" label="预估毛利率" min-width="80" ></el-table-column>
				<el-table-column prop="contractAmt" label="合同总金额" min-width="80" ></el-table-column>
				<el-table-column prop="planInnerUserPrice" label="内部人力成本单价元/人时" min-width="80" ></el-table-column>
				<el-table-column prop="planOutUserPrice" label="外购人力成本单价元/人时" min-width="80" ></el-table-column>
				<el-table-column prop="planOutUserCnt" label="外购人数" min-width="80" ></el-table-column>
				<el-table-column prop="planInnerUserCnt" label="内部人数" min-width="80" ></el-table-column>
				<el-table-column prop="planWorkingHours" label="预计工作小时数目" min-width="80" ></el-table-column>
				<el-table-column prop="taxRate" label="税率" min-width="80" ></el-table-column>
				<el-table-column prop="planInnerUserWorkload" label="内部人力总工作量-应该大于或等于阶段计划内部人力总成本" min-width="80" ></el-table-column>
				<el-table-column prop="planOutUserWorkload" label="外购人力总工作量-应该大于或等于阶段计划外购人力总成本" min-width="80" ></el-table-column>
				<el-table-column prop="projectId" label="项目编号" min-width="80" ></el-table-column>
				<el-table-column prop="ctime" label="创建时间" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="160" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmProjectBaseline xm_project_baseline界面-->
			<el-drawer title="编辑xm_project_baseline" :visible.sync="editFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-project-baseline-edit :xm-project-baseline="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-baseline-edit>
			</el-drawer>
	
			<!--新增 XmProjectBaseline xm_project_baseline界面-->
			<el-drawer title="新增xm_project_baseline" :visible.sync="addFormVisible"  size="50%"  append-to-body  :close-on-click-modal="false">
				<xm-project-baseline-add :xm-project-baseline="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-project-baseline-add>
			</el-drawer> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectBaseline, delXmProjectBaseline, batchDelXmProjectBaseline } from '@/api/xm/core/xmProjectBaseline';
	import  XmProjectBaselineAdd from './XmProjectBaselineAdd';//新增界面
	import  XmProjectBaselineEdit from './XmProjectBaselineEdit';//修改界面
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
				xmProjectBaselines: [],//查询结果
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
				
				addFormVisible: false,//新增xmProjectBaseline界面是否显示
				//新增xmProjectBaseline界面初始化数据
				addForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planInnerUserAt:'',planOutUserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planInnerUserPrice:'',planOutUserPrice:'',planOutUserCnt:'',planInnerUserCnt:'',planWorkingHours:'',taxRate:'',planInnerUserWorkload:'',planOutUserWorkload:'',projectId:'',ctime:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectBaseline界面初始化数据
				editForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planInnerUserAt:'',planOutUserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planInnerUserPrice:'',planOutUserPrice:'',planOutUserCnt:'',planInnerUserCnt:'',planWorkingHours:'',taxRate:'',planInnerUserWorkload:'',planOutUserWorkload:'',projectId:'',ctime:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjectBaselines();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectBaselines();
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
				this.getXmProjectBaselines();
			},
			searchXmProjectBaselines(){
				 this.pageInfo.count=true; 
				 this.getXmProjectBaselines();
			},
			//获取列表 XmProjectBaseline xm_project_baseline
			getXmProjectBaselines() {
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
				this.load.list = true;
				listXmProjectBaseline(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectBaselines = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectBaseline xm_project_baseline
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProjectBaseline xm_project_baseline
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjectBaselines();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProjectBaseline
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProjectBaseline
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmProjectBaseline(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProjectBaselines();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProjectBaseline
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProjectBaseline(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectBaselines(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
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
		    'xm-project-baseline-add':XmProjectBaselineAdd,
		    'xm-project-baseline-edit':XmProjectBaselineEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmProjectBaselines();
        	}); 
		}
	}

</script>

<style scoped>

</style>