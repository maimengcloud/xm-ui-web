<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectKpiHiss">查询</el-button>
			<el-button type="primary" @click="showAdd">+xm_project_kpi_his</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="app-container"> 
			<!--列表 XmProjectKpiHis xm_project_kpi_his-->
			<el-table :data="xmProjectKpiHiss" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="projectId" label="项目编号" min-width="80" ></el-table-column>
				<el-table-column prop="branchId" label="机构编码" min-width="80" ></el-table-column>
				<el-table-column prop="kpiIndex" label="指标编号" min-width="80" ></el-table-column>
				<el-table-column prop="kpiName" label="指标名称" min-width="80" ></el-table-column>
				<el-table-column prop="maxValue" label="最大值" min-width="80" ></el-table-column>
				<el-table-column prop="minValue" label="最小值" min-width="80" ></el-table-column>
				<el-table-column prop="kpiId" label="kpi主表主键" min-width="80" ></el-table-column>
				<el-table-column prop="score" label="得分0~10分" min-width="80" ></el-table-column>
				<el-table-column prop="scoreDate" label="评分日期" min-width="80" ></el-table-column>
				<el-table-column prop="bizFlowState" label="流程状态" min-width="80" ></el-table-column>
				<el-table-column prop="bizProcInstId" label="流程实例编号" min-width="80" ></el-table-column>
				<el-table-column prop="kpiValue" label="kpi当前值" min-width="80" ></el-table-column>
				<el-table-column prop="cdate" label="创建日期" min-width="80" ></el-table-column>
				<el-table-column prop="id" label="主键" min-width="80" ></el-table-column>
				<el-table-column prop="remark" label="备注" min-width="80" ></el-table-column>
				<el-table-column prop="calcType" label="考核方式0月1季度3半年4一年" min-width="80" ></el-table-column>
				<el-table-column prop="nextCalcDate" label="下次考核开始时间" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="160" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmProjectKpiHis xm_project_kpi_his界面-->
			<el-drawer title="编辑xm_project_kpi_his" :visible.sync="editFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-project-kpi-his-edit :xm-project-kpi-his="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-kpi-his-edit>
			</el-drawer>
	
			<!--新增 XmProjectKpiHis xm_project_kpi_his界面-->
			<el-drawer title="新增xm_project_kpi_his" :visible.sync="addFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
				<xm-project-kpi-his-add :xm-project-kpi-his="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-project-kpi-his-add>
			</el-drawer> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectKpiHis, delXmProjectKpiHis, batchDelXmProjectKpiHis } from '@/api/xm/core/xmProjectKpiHis';
	import  XmProjectKpiHisAdd from './XmProjectKpiHisAdd';//新增界面
	import  XmProjectKpiHisEdit from './XmProjectKpiHisEdit';//修改界面
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
				xmProjectKpiHiss: [],//查询结果
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
				
				addFormVisible: false,//新增xmProjectKpiHis界面是否显示
				//新增xmProjectKpiHis界面初始化数据
				addForm: {
					projectId:'',branchId:'',kpiIndex:'',kpiName:'',maxValue:'',minValue:'',kpiId:'',score:'',scoreDate:'',bizFlowState:'',bizProcInstId:'',kpiValue:'',cdate:'',id:'',remark:'',calcType:'',nextCalcDate:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectKpiHis界面初始化数据
				editForm: {
					projectId:'',branchId:'',kpiIndex:'',kpiName:'',maxValue:'',minValue:'',kpiId:'',score:'',scoreDate:'',bizFlowState:'',bizProcInstId:'',kpiValue:'',cdate:'',id:'',remark:'',calcType:'',nextCalcDate:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjectKpiHiss();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectKpiHiss();
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
				this.getXmProjectKpiHiss();
			},
			searchXmProjectKpiHiss(){
				 this.pageInfo.count=true; 
				 this.getXmProjectKpiHiss();
			},
			//获取列表 XmProjectKpiHis xm_project_kpi_his
			getXmProjectKpiHiss() {
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
				listXmProjectKpiHis(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectKpiHiss = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectKpiHis xm_project_kpi_his
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProjectKpiHis xm_project_kpi_his
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjectKpiHiss();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProjectKpiHis
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProjectKpiHis
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { kpiId: row.kpiId };
					delXmProjectKpiHis(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProjectKpiHiss();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProjectKpiHis
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProjectKpiHis(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectKpiHiss(); 
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
		    'xm-project-kpi-his-add':XmProjectKpiHisAdd,
		    'xm-project-kpi-his-edit':XmProjectKpiHisEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmProjectKpiHiss();
        	}); 
		}
	}

</script>

<style scoped>

</style>