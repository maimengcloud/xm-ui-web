<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmBudgetLabors" icon="el-icon-search">查询</el-button>
			<span style="float:right;">
			    <el-button type="primary" @click="showAdd" icon="el-icon-plus" plain> </el-button>
			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" plain></el-button>
		    </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 XmBudgetLabor 项目人力成本预算-->
			<el-table ref="xmBudgetLaborTable" :data="xmBudgetLabors" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<!--
				<el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
				     <span class="cell-text">  {{scope.row.username}}}  </span>
                     <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"></el-input></span>
				</el-table-column>
				-->
				<el-table-column prop="id" label="主键" min-width="80" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="projectId" label="项目编号" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.projectId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="userid" label="项目成员编号" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.userid}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="budgetAt" label="预算金额/每月" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.budgetAt}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.remark}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="username" label="用户名" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.username}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="subjectId" label="预算科目编号" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.subjectId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="bizSdate" label="费用归属周期开始日期" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.bizSdate}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="bizEdate" label="费用归属周期结束日期" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.bizEdate}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="bizMonth" label="费用归属月份yyyy-mm" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.bizMonth}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="instId" label="当前流程实例编号" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.instId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="bizFlowState" label="当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.bizFlowState}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="costType" label="成本类型0非人力1内部人力2外购人力" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.costType}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="subjectName" label="科目名称" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.subjectName}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="branchId" label="项目归属机构编号" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.branchId}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ubranchId" label="用户归属机构编号-也就是将来的结算对象" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{scope.row.ubranchId}} </span>
                    </template>
				</el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
					<template scope="scope">
						<el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"  plain></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  plain></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 XmBudgetLabor 项目人力成本预算界面-->
			<el-drawer title="编辑项目人力成本预算" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <xm-budget-labor-edit op-type="edit" :xm-budget-labor="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-budget-labor-edit>
			</el-drawer>

			<!--新增 XmBudgetLabor 项目人力成本预算界面-->
			<el-drawer title="新增项目人力成本预算" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<xm-budget-labor-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-budget-labor-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
 	import { initDicts,listXmBudgetLabor, delXmBudgetLabor, batchDelXmBudgetLabor,editSomeFieldsXmBudgetLabor } from '@/api/xm/core/xmBudgetLabor';
	import  XmBudgetLaborEdit from './XmBudgetLaborEdit';//新增修改界面
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmBudgetLaborMng',
		components: {
		    XmBudgetLaborEdit,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchXmBudgetLabors()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmBudgetLabors: [],//查询结果
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
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmBudgetLabor界面是否显示
				addForm: {
					projectId:'',userid:'',budgetAt:'',id:'',remark:'',username:'',subjectId:'',bizSdate:'',bizEdate:'',bizMonth:'',instId:'',bizFlowState:'',costType:'',subjectName:'',branchId:'',ubranchId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				editForm: {
					projectId:'',userid:'',budgetAt:'',id:'',remark:'',username:'',subjectId:'',bizSdate:'',bizEdate:'',bizMonth:'',instId:'',bizFlowState:'',costType:'',subjectName:'',branchId:'',ubranchId:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: {

		    ...util,

			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmBudgetLabors();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmBudgetLabors();
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
				this.getXmBudgetLabors();
			},
			searchXmBudgetLabors(){
				 this.pageInfo.count=true; 
				 this.getXmBudgetLabors();
			},
			//获取列表 XmBudgetLabor 项目人力成本预算
			getXmBudgetLabors() {
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

				this.load.list = true;
				listXmBudgetLabor(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmBudgetLabors = res.data.data;
					}else{
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmBudgetLabor 项目人力成本预算
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmBudgetLabor 项目人力成本预算
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmBudgetLabors();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmBudgetLabor
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmBudgetLabor
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = {  id:row.id };
					delXmBudgetLabor(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.searchXmBudgetLabors();
						}
						this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmBudgetLabor
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
					batchDelXmBudgetLabor(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.searchXmBudgetLabors();
						}
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
          editSomeFields(row,fieldName,$event){
            let params={};
            if(this.sels.length>0){
              if(!this.sels.some(k=> k.id==row.id)){
                this.$notify({position:'bottom-left',showClose:true,message:'请编辑选中的行',type:'warning'})
                Object.assign(this.editForm,this.editFormBak)
                return;
              }
                params['ids']=this.sels.map(i=>i.id)
            }else{
                params['ids']=[row].map(i=>i.id)
            }
            params[fieldName]=$event
            var func = editSomeFieldsXmBudgetLabor
            func(params).then(res=>{
              let tips = res.data.tips;
              if(tips.isOk){
                if(this.sels.length>0){
                    this.searchXmBudgetLabors();
                }
                this.editFormBak=[...this.editForm]
              }else{
                Object.assign(this.editForm,this.editFormBak)
                this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
              }
            }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
          },
			rowClick: function(row, event, column){
			    this.editForm=row
			    this.editFormBak={...row};
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },
			
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    initDicts(this);
			    this.initData()
				this.searchXmBudgetLabors();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmBudgetLaborTable.$el)

        	});
		}
	}

</script>

<style scoped>
</style>