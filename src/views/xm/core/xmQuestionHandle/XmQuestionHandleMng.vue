<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmQuestionHandles">查询</el-button>
			<el-button type="primary" @click="showAdd">+xm_question_handle</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="page-main page-height-90"> 
			<!--列表 XmQuestionHandle xm_question_handle-->
			<el-table :data="xmQuestionHandles" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="id" label="主键" min-width="80" ></el-table-column>
				<el-table-column prop="handlerUserid" label="处理人编号" min-width="80" ></el-table-column>
				<el-table-column prop="handlerUsername" label="处理人" min-width="80" ></el-table-column>
				<el-table-column prop="handleSolution" label="解决方案:" min-width="80" ></el-table-column>
				<el-table-column prop="receiptMessage" label="回执信息" min-width="80" ></el-table-column>
				<el-table-column prop="receiptTime" label="回执时间" min-width="80" ></el-table-column>
				<el-table-column prop="handleStatus" label="create创建（active激活）–confirm确认（confirmed已确认）–solve解决（resolved已解决）–close关闭（closed已关闭）" min-width="80" ></el-table-column>
				<el-table-column prop="bizProcInstId" label="当前流程实例编号" min-width="80" ></el-table-column>
				<el-table-column prop="bizFlowState" label="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除" min-width="80" ></el-table-column>
				<el-table-column prop="questionId" label="缺陷编号" min-width="80" ></el-table-column>
				<el-table-column prop="lastUpdateTime" label="最后更新日期" min-width="80" ></el-table-column>
				<el-table-column prop="createTime" label="创建时间" min-width="80" ></el-table-column>
				<el-table-column prop="actWorkload" label="实际工时" min-width="80" ></el-table-column>
				<el-table-column prop="actCostAmount" label="实际金额" min-width="80" ></el-table-column>
				<el-table-column prop="urls" label="链接地址列表逗号分隔" min-width="80" ></el-table-column>
				<el-table-column prop="targetUserid" label="指派给谁" min-width="80" ></el-table-column>
				<el-table-column prop="targetUsername" label="指派给谁" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="160" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmQuestionHandle xm_question_handle界面-->
			<el-drawer title="编辑xm_question_handle" :visible.sync="editFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-question-handle-edit :xm-question-handle="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-question-handle-edit>
			</el-drawer>
	
			<!--新增 XmQuestionHandle xm_question_handle界面-->
			<el-drawer title="新增xm_question_handle" :visible.sync="addFormVisible"  size="50%"  append-to-body  :close-on-click-modal="false">
				<xm-question-handle-add :xm-question-handle="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-question-handle-add>
			</el-drawer> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmQuestionHandle, delXmQuestionHandle, batchDelXmQuestionHandle } from '@/api/xm/core/xmQuestionHandle';
	import  XmQuestionHandleAdd from './XmQuestionHandleAdd';//新增界面
	import  XmQuestionHandleEdit from './XmQuestionHandleEdit';//修改界面
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
				xmQuestionHandles: [],//查询结果
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
				
				addFormVisible: false,//新增xmQuestionHandle界面是否显示
				//新增xmQuestionHandle界面初始化数据
				addForm: {
					id:'',handlerUserid:'',handlerUsername:'',handleSolution:'',receiptMessage:'',receiptTime:'',handleStatus:'',bizProcInstId:'',bizFlowState:'',questionId:'',lastUpdateTime:'',createTime:'',actWorkload:'',actCostAmount:'',urls:'',targetUserid:'',targetUsername:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmQuestionHandle界面初始化数据
				editForm: {
					id:'',handlerUserid:'',handlerUsername:'',handleSolution:'',receiptMessage:'',receiptTime:'',handleStatus:'',bizProcInstId:'',bizFlowState:'',questionId:'',lastUpdateTime:'',createTime:'',actWorkload:'',actCostAmount:'',urls:'',targetUserid:'',targetUsername:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmQuestionHandles();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmQuestionHandles();
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
				this.getXmQuestionHandles();
			},
			searchXmQuestionHandles(){
				 this.pageInfo.count=true; 
				 this.getXmQuestionHandles();
			},
			//获取列表 XmQuestionHandle xm_question_handle
			getXmQuestionHandles() {
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
				listXmQuestionHandle(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmQuestionHandles = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmQuestionHandle xm_question_handle
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmQuestionHandle xm_question_handle
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmQuestionHandles();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmQuestionHandle
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmQuestionHandle
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmQuestionHandle(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmQuestionHandles();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmQuestionHandle
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmQuestionHandle(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmQuestionHandles(); 
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
		    'xm-question-handle-add':XmQuestionHandleAdd,
		    'xm-question-handle-edit':XmQuestionHandleEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmQuestionHandles();
        	}); 
		}
	}

</script>

<style scoped>

</style>