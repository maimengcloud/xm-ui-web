<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			
			<el-select v-model="filters.xmType" @change="searchXmProjectTemplates">
				<el-option v-for="i in this.options.projectType" :label="i.optionName" :key="i.optionValue" :value="i.optionValue"></el-option>
			</el-select>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectTemplates">查询</el-button> 
			<el-button type="primary" @click="showAdd">+项目模板</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="app-container"> 
			<!--列表 XmProjectTemplate xm_project_template-->
			<el-table :data="xmProjectTemplates" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="45"></el-table-column>
				<el-table-column sortable type="index" width="45"></el-table-column>
  				<el-table-column prop="name" label="模板名称" min-width="80" ></el-table-column> 
 				<el-table-column prop="tcusername" label="模板创建人姓名" min-width="80" ></el-table-column>
				<el-table-column prop="xmType" label="项目类型" min-width="80" ></el-table-column>  
				<el-table-column prop="description" label="项目描述" min-width="80" ></el-table-column>
 				<el-table-column prop="planTotalCost" label="总预算" min-width="80" ></el-table-column>
 				<el-table-column prop="planNouserAt" label="非人力预算" min-width="80" ></el-table-column>
				<el-table-column prop="planInnerUserAt" label="内部预算" min-width="80" ></el-table-column>
				<el-table-column prop="planOutUserAt" label="外购预算" min-width="80" ></el-table-column>
 				<el-table-column prop="planWorkload" label="总工作量" min-width="80" ></el-table-column>
				<el-table-column prop="totalReceivables" label="总预计收款金额" min-width="80" ></el-table-column>
				<el-table-column prop="budgetMarginRate" label="预估毛利率" min-width="80" ></el-table-column> 
				<el-table-column prop="taxRate" label="税率" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="200" fixed="right">
					<template slot-scope="scope">
 						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>  
						<el-button type="primary" @click="showProjectTemplateInfo(scope.row,scope.$index)">详情</el-button> 
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmProjectTemplate xm_project_template界面-->
			<el-dialog title="编辑项目模板" :visible.sync="editFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-project-template-edit :xm-project-template="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-template-edit>
			</el-dialog>
	
			<!--新增 XmProjectTemplate xm_project_template界面-->
			<el-dialog title="新增项目模板" :visible.sync="addFormVisible"  width="50%"  append-to-body  :close-on-click-modal="false">
				<xm-project-template-add :xm-project-template="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-project-template-add>
			</el-dialog> 
			<el-dialog :title="editForm==null?'项目模板明细':editForm.name" center :fullscreen="true" :visible.sync="projectTemplateInfoVisible"  width="50%"  :close-on-click-modal="false" append-to-body>
				<xm-project-template-info :sel-project-template="editForm" @change-show-info="changeShowInfo" @submit="changeShowInfo"></xm-project-template-info>
			</el-dialog>
		</el-row>
	</section>
</template>

<script>
	import Vue from 'vue'

	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectTemplate, delXmProjectTemplate, batchDelXmProjectTemplate } from '@/api/xm/core/xmProjectTemplate';
	import  XmProjectTemplateAdd from './XmProjectTemplateAdd';//新增界面
	import  XmProjectTemplateEdit from './XmProjectTemplateEdit';//修改界面
	import { mapGetters } from 'vuex'
	import xmProjectTemplateInfo from './XmProjectTemplateInfo'; 
	
	if(!Vue.component("xm-project-template-info")){
		
		Vue.component('xm-project-template-info',xmProjectTemplateInfo)
		Vue.use(xmProjectTemplateInfo);
	}
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		data() {
			return {
				filters: {
					key: '',
					xmType:''
				},
				xmProjectTemplates: [],//查询结果
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
					projectType:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProjectTemplate界面是否显示
				//新增xmProjectTemplate界面初始化数据
				addForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planInnerUserAt:'',planOutUserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planInnerUserPrice:'',planOutUserPrice:'',planOutUserCnt:'',planInnerUserCnt:'',planWorkingHours:'',taxRate:'',planInnerUserWorkload:'',planOutUserWorkload:'',productId:'',productName:'',templateId:'',tcuserid:'',tcusername:'',tremark:'',tctime:'',tcbranchId:'',shareScope:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectTemplate界面初始化数据
				editForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planInnerUserAt:'',planOutUserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'',totalReceivables:'',budgetMarginRate:'',contractAmt:'',planInnerUserPrice:'',planOutUserPrice:'',planOutUserCnt:'',planInnerUserCnt:'',planWorkingHours:'',taxRate:'',planInnerUserWorkload:'',planOutUserWorkload:'',productId:'',productName:'',templateId:'',tcuserid:'',tcusername:'',tremark:'',tctime:'',tcbranchId:'',shareScope:''
				},
				projectTemplateInfoVisible:false,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjectTemplates();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectTemplates();
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
				this.getXmProjectTemplates();
			},
			searchXmProjectTemplates(){
				 this.pageInfo.count=true; 
				 this.getXmProjectTemplates();
			},
			//获取列表 XmProjectTemplate xm_project_template
			getXmProjectTemplates() {
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
				if(this.filters.xmType){
					params.xmType=this.filters.xmType
				} 
				this.load.list = true;
				listXmProjectTemplate(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectTemplates = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectTemplate xm_project_template
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProjectTemplate xm_project_template
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjectTemplates();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProjectTemplate
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProjectTemplate
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmProjectTemplate(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProjectTemplates();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProjectTemplate
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProjectTemplate(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectTemplates(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			selectedProject(row){
				this.editForm=row
				this.$emit("selected",row)
			},
			showProjectTemplateInfo(row){
				this.editForm=row
				this.projectTemplateInfoVisible=true;
			},
			changeShowInfo(){

			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-project-template-add':XmProjectTemplateAdd,
			'xm-project-template-edit':XmProjectTemplateEdit, 
 		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmProjectTemplates();
				listOption([{categoryId:'all',itemCode:'projectType'}] ).then(res=>{
					if(res.data.tips.isOk){ 
						this.options['projectType']=res.data.data.projectType
					}
				});
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

</style>