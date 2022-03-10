<template>
	<section class="page-container  padding border">
		<el-row v-if="!simple">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>  
			<el-input v-model="filters.projectName" style="width: 20%;" placeholder="点击选择项目" @click.native="showProjectTemplate"></el-input>  
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmPhases">查询</el-button>
 			<el-button v-if="isSelect" type="primary" @click="selectedConfirm">确认选择</el-button>  
		</el-row>
		
		<el-row class="page-main" v-if="!simple"> 
			<!--列表 XmPhaseTemplate xm_phase_template-->
			<el-table ref="table" :height="maxTableHeight" lazy :load="loadXmPhaseLazy" :data="xmPhaseTemplateTreeData" @sort-change="sortChange" row-key="id"  :tree-props="{children: 'children', hasChildren: 'childrenCnt'}" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column> 
				<el-table-column prop="name" label="计划名称" min-width="260" >
					
					 <template slot-scope="scope">  
						<span>
							<span v-show="scope.row.milestone=='1'">
								<i class="el-icon-star-on"></i>
							</span>
							<span v-show="scope.row.isKeyPath=='1'"> 
								<i class="el-icon-s-help"></i>
							</span>
							<el-link :icon="scope.row.ntype=='1'?'el-icon-folder-opened':''" type="primary">{{scope.row.seqNo}} &nbsp;&nbsp;  
							</el-link>
							{{scope.row.name}}   
						</span>
					 </template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" min-width="80" show-overflow-tooltip></el-table-column> 
				<el-table-column   label="预计工作量(人时)" min-width="80" show-overflow-tooltip>
					<el-table-column prop="budgetHours" label="工时" min-width="80" ></el-table-column>
					<el-table-column prop="budgetStaffNu" label="投入人员数" min-width="80" ></el-table-column> 
					<el-table-column prop="budgetWorkload" label="总工作量" min-width="80" ></el-table-column> 
				</el-table-column> 
				<el-table-column   label="成本预算(元)" min-width="80" show-overflow-tooltip>
					<el-table-column prop="budgetAt" label="总预算" min-width="80" ></el-table-column>
					<el-table-column prop="budgetNouserAt" label="非人力" min-width="80" ></el-table-column>
					<el-table-column prop="budgetIuserAt" label="内部" min-width="80" ></el-table-column>
					<el-table-column prop="budgetOuserAt" label="外购" min-width="80" ></el-table-column>
				</el-table-column> 
				<el-table-column label="操作" width="260" fixed="right"  v-if="!isSelect" >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button> 
						<el-button  @click="showSubAdd( scope.row,scope.$index)">+子计划</el-button> 
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		

		</el-row>
		<el-row  v-if="simple"> 
			<!--列表 XmPhaseTemplate xm_phase_template-->
			<el-table lazy :load="loadXmPhaseLazy"  default-expand-all :height="maxTableHeight" :data="xmPhaseTemplateTreeData" @sort-change="sortChange" row-key="id"  :tree-props="{children: 'children', hasChildren: 'childrenCnt'}" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				<el-table-column prop="name" label="计划名称" min-width="180" > 
					 <template slot-scope="scope">  
						 {{scope.row.seqNo}} &nbsp;&nbsp;{{scope.row.name}}
					 </template> 
				</el-table-column>  
			</el-table>
			<el-pagination  layout="total, sizes, prev, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		

		</el-row>
					<!--编辑 XmPhaseTemplate xm_phase_template界面-->
		<el-drawer title="编辑计划" :visible.sync="editFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				<xm-phase-template-edit  :xm-phase-template="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-phase-template-edit>
		</el-drawer>

		<!--新增 XmPhaseTemplate xm_phase_template界面-->
		<el-drawer title="新增计划" :visible.sync="addFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
			<xm-phase-template-add :sel-project-template="filters.projectTemplate" :xm-parent-phase-template="parentPhaseTemplate" :xm-phase-template="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-phase-template-add>
		</el-drawer> 
		<el-drawer title="项目模板" :with-header="false" :visible.sync="projectTemplateVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
			<xm-project-template-list    :visible="addFormVisible" @cancel="projectTemplateVisible=false" @selected="onProjectTemplateSelected"></xm-project-template-list>
		</el-drawer> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmPhase } from '@/api/xm/core/xmPhase'; 
	import  XmProjectTemplateList from '../xmProjectTemplate/XmProjectTemplateList';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		name:'xm-phase-template-mng',
		props:['xmType','selProjectTemplate','simple','isSelect'],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]), 
			xmPhaseTemplateTreeData(){ 
				return treeTool.translateDataToTree(this.xmPhases,'parentPhaseId','id');
			},
		},
		watch:{ 
			selProjectTemplate(){
				if(this.selProjectTemplate){
					this.filters.projectTemplate=this.selProjectTemplate
				}else{
					this.filters.projectTemplate=null;
				}
				this.getXmPhases()
			}
		},
		data() {
			return {
				filters: {
					key: '', 
					projectId:'',
					projectName:'',
					productId:'',
					productName:'', 
				},
				xmPhases: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:500,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{projectType:[]},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmPhaseTemplate界面是否显示
				//新增xmPhaseTemplate界面初始化数据
				addForm: {
					id:'',name:'',remark:'',parentPhaseId:'',branchId:'',beginDate:'',endDate:'',budgetHours:'',budgetStaffNu:'',xmType:'',projectTypeName:'',budgetNouserAt:'',budgetIuserAt:'',budgetOuserAt:'',budgetWorkload:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmPhaseTemplate界面初始化数据
				editForm: {
					id:'',name:'',remark:'',parentPhaseId:'',branchId:'',beginDate:'',endDate:'',budgetHours:'',budgetStaffNu:'',xmType:'',projectTypeName:'',budgetNouserAt:'',budgetIuserAt:'',budgetOuserAt:'',budgetWorkload:''
				},
				parentPhaseTemplate:null,
				projectTemplateVisible:false,
				maxTableHeight:300,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmPhases();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmPhases();
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
				this.getXmPhases();
			},
			searchXmPhases(){
				 this.pageInfo.count=true; 
				 this.getXmPhases();
			},
			getParams(params){
				if( this.filters.projectId  ){
					params.projectId=this.filters.projectId
				} 
				if( this.filters.productId  ){
					params.productId=this.filters.productId
				} 
				return params;
			},
			//获取列表 XmPhaseTemplate xm_phase_template
			getXmPhases() {
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
				this.getParams(params)
				if(!params.projectId && !params.productId){ 
					this.$notify({showClose: true, message: "请选择项目模板/产品模板", type: 'error' });
					return; 
				}
				params.isTop="1"
				this.load.list = true;
				listXmPhase(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmPhases = res.data.data;
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmPhaseTemplate xm_phase_template
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmPhaseTemplate xm_phase_template
			showAdd: function () { 
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},

			showSubAdd: function (row) { 
				this.parentPhaseTemplate=row
				this.editForm=row;
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmPhases();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmPhaseTemplate
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			 
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			selectedConfirm(){
				this.$emit("selected-confirm",this.sels);
			}, 
			showProjectTemplate:function(){
				this.projectTemplateVisible=true;
			},
			onProjectTemplateSelected:function(projectTemplate){
				this.projectTemplateVisible=false;
				this.filters.projectId=projectTemplate.id; 
				this.filters.projectName=projectTemplate.name; 
				this.$emit('selected-project-template',projectTemplate)
				this.getXmPhases();
			},
			
			loadXmPhaseLazy(tree, treeNode, resolve) {     
					var params={parentPhaseId:tree.id}
					params=this.getParams(params);
					params.isTop=""
					this.load.list = true;
					var func=listXmPhase 
					func(params).then(res=>{
						this.load.list = false
						var tips = res.data.tips;
						if(tips.isOk){
							resolve(res.data.data) 
						}else{
							resolve([])
						}
					}).catch( err => this.load.list = false );   
				
			},
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {  
			XmProjectTemplateList, 
		},
		mounted() { 
			if(this.selProjectTemplate){
				this.filters.projectTemplate=this.selProjectTemplate
			}
			this.$nextTick(() => { 
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el);
				this.getXmPhases();   
			}); 
			
			
		//普通查询 条件之间and关系 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 

			
		}
	}

</script>

<style scoped>

</style>