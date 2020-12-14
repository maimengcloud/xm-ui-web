<template>
	<section>
		<el-row class="app-container" v-if="!simple">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>  
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectPhaseTemplates">查询</el-button>
			<el-button v-if="!selProjectTemplate" type="primary" @click="showProjectTemplate">选择项目模板</el-button>   
			<el-button v-if="!isSelect" type="primary" @click="showAdd">+项目阶段</el-button> 
			<el-button v-if="isSelect" type="primary" @click="selectedConfirm">确认选择</el-button> 
		</el-row>
		
		<el-row class="app-container" v-if="!simple"> 
			<!--列表 XmProjectPhaseTemplate xm_phase_template-->
			<el-table default-expand-all :data="xmProjectPhaseTemplateTreeData" @sort-change="sortChange" row-key="id"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column> 
				<el-table-column prop="phaseName" label="阶段名称" min-width="260" >
					
					 <template slot-scope="scope">  
						 {{scope.row.seqNo}} &nbsp;&nbsp;{{scope.row.phaseName}}
					 </template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" min-width="80" ></el-table-column> 
				<el-table-column prop="phaseBudgetHours" label="工时" min-width="80" ></el-table-column>
				<el-table-column prop="phaseBudgetStaffNu" label="投入人员数" min-width="80" ></el-table-column> 
				<el-table-column prop="projectTypeName" label="项目类型名称" min-width="80" ></el-table-column>
				<el-table-column prop="phaseBudgetNouserAt" label="非人力成本总预算" min-width="80" ></el-table-column>
				<el-table-column prop="phaseBudgetInnerUserAt" label="内部人力成本总预算" min-width="80" ></el-table-column>
				<el-table-column prop="phaseBudgetOutUserAt" label="外购人力成本总预算" min-width="80" ></el-table-column>
				<el-table-column prop="phaseBudgetWorkload" label="总工作量单位人时" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="260" fixed="right"  v-if="!isSelect" >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button> 
						<el-button  @click="showSubAdd( scope.row,scope.$index)">+子阶段</el-button> 
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		

		</el-row>
		<el-row  v-if="simple"> 
			<!--列表 XmProjectPhaseTemplate xm_phase_template-->
			<el-table default-expand-all :data="xmProjectPhaseTemplateTreeData" @sort-change="sortChange" row-key="id"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				<el-table-column prop="phaseName" label="阶段名称" min-width="180" > 
					 <template slot-scope="scope">  
						 {{scope.row.seqNo}} &nbsp;&nbsp;{{scope.row.phaseName}}
					 </template> 
				</el-table-column>  
			</el-table>
			<el-pagination  layout="total, sizes, prev, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		

		</el-row>
					<!--编辑 XmProjectPhaseTemplate xm_phase_template界面-->
		<el-dialog title="编辑阶段" :visible.sync="editFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
				<xm-project-phase-template-edit  :xm-project-phase-template="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-phase-template-edit>
		</el-dialog>

		<!--新增 XmProjectPhaseTemplate xm_phase_template界面-->
		<el-dialog title="新增阶段" :visible.sync="addFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
			<xm-project-phase-template-add :sel-project-template="filters.projectTemplate" :xm-parent-phase-template="parentPhaseTemplate" :xm-project-phase-template="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-project-phase-template-add>
		</el-dialog> 
		<el-dialog title="项目模板" :visible.sync="projectTemplateVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
			<xm-project-template-list    :visible="addFormVisible" @cancel="projectTemplateVisible=false" @selected="onProjectTemplateSelected"></xm-project-template-list>
		</el-dialog> 
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectPhaseTemplate, delXmProjectPhaseTemplate, batchDelXmProjectPhaseTemplate } from '@/api/xm/core/xmProjectPhaseTemplate';
	import  XmProjectPhaseTemplateAdd from './XmProjectPhaseTemplateAdd';//新增界面
	import  XmProjectPhaseTemplateEdit from './XmProjectPhaseTemplateEdit';//修改界面
	import  XmProjectTemplateList from '../xmProjectTemplate/XmProjectTemplateList';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		name:'xm-project-phase-template-mng',
		props:['xmType','selProjectTemplate','simple','isSelect'],
		computed: {
		    ...mapGetters([
		      'userInfo'
			]), 
			xmProjectPhaseTemplateTreeData(){ 
				return this.translateDataToTree(this.xmProjectPhaseTemplates);
			},
		},
		watch:{ 
			selProjectTemplate(){
				if(this.selProjectTemplate){
					this.filters.projectTemplate=this.selProjectTemplate
				}else{
					this.filters.projectTemplate=null;
				}
				this.getXmProjectPhaseTemplates()
			}
		},
		data() {
			return {
				filters: {
					key: '', 
				},
				xmProjectPhaseTemplates: [],//查询结果
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
				
				addFormVisible: false,//新增xmProjectPhaseTemplate界面是否显示
				//新增xmProjectPhaseTemplate界面初始化数据
				addForm: {
					id:'',phaseName:'',remark:'',parentPhaseId:'',branchId:'',beginDate:'',endDate:'',phaseBudgetHours:'',phaseBudgetStaffNu:'',xmType:'',projectTypeName:'',phaseBudgetNouserAt:'',phaseBudgetInnerUserAt:'',phaseBudgetOutUserAt:'',phaseBudgetWorkload:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectPhaseTemplate界面初始化数据
				editForm: {
					id:'',phaseName:'',remark:'',parentPhaseId:'',branchId:'',beginDate:'',endDate:'',phaseBudgetHours:'',phaseBudgetStaffNu:'',xmType:'',projectTypeName:'',phaseBudgetNouserAt:'',phaseBudgetInnerUserAt:'',phaseBudgetOutUserAt:'',phaseBudgetWorkload:''
				},
				parentPhaseTemplate:null,
				projectTemplateVisible:false,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjectPhaseTemplates();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectPhaseTemplates();
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
				this.getXmProjectPhaseTemplates();
			},
			searchXmProjectPhaseTemplates(){
				 this.pageInfo.count=true; 
				 this.getXmProjectPhaseTemplates();
			},
			//获取列表 XmProjectPhaseTemplate xm_phase_template
			getXmProjectPhaseTemplates() {
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
				if( this.filters.projectTemplate  ){
					params.projectId=this.filters.projectTemplate.id
				}else{
					this.$message({ message: "请选择项目模板", type: 'error' });
					return;
				}
				this.load.list = true;
				listXmProjectPhaseTemplate(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectPhaseTemplates = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectPhaseTemplate xm_phase_template
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProjectPhaseTemplate xm_phase_template
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
				this.getXmProjectPhaseTemplates();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProjectPhaseTemplate
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProjectPhaseTemplate
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmProjectPhaseTemplate(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProjectPhaseTemplates();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProjectPhaseTemplate
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProjectPhaseTemplate(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectPhaseTemplates(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			selectedConfirm(){
				this.$emit("selected-confirm",this.sels);
			},
			translateDataToTree(data2) { 
				var data=JSON.parse(JSON.stringify(data2));
				let parents = data.filter(value =>{
					//如果我的上级为空，则我是最上级
					if(value.parentPhaseId == 'undefined' || value.parentPhaseId == null  || value.parentPhaseId == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.parentPhaseId==i.id)){
						return false;
					}else {
						return true
					}
				 
				}) 
				let children = data.filter(value =>{
					if(data.some(i=>value.parentPhaseId==i.id)){
						return true;
					}else{
						return false;
					} 
				})
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.parentPhaseId === parent.id) {
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
			showProjectTemplate:function(){
				this.projectTemplateVisible=true;
			},
			onProjectTemplateSelected:function(projectTemplate){
				this.projectTemplateVisible=false;
				this.filters.projectTemplate=projectTemplate; 
				this.$emit('selected-project-template',projectTemplate)
				this.getXmProjectPhaseTemplates();
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-project-phase-template-add':XmProjectPhaseTemplateAdd,
			'xm-project-phase-template-edit':XmProjectPhaseTemplateEdit,
			XmProjectTemplateList,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			if(this.selProjectTemplate){
				this.filters.projectTemplate=this.selProjectTemplate
			}
			this.$nextTick(() => {
				this.getXmProjectPhaseTemplates();   
			}); 
			
			
		//普通查询 条件之间and关系 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 

			
		}
	}

</script>

<style scoped>

</style>