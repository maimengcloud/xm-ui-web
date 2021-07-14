<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmTaskTemplates">查询</el-button>
			<el-button v-if="!selProjectTemplate" type="info" @click="showProjectTemplate">选择模板</el-button>  

			<el-button v-if="!isSelect" type="primary" @click="showAdd">+任务</el-button>
			<el-button v-if="isSelect" type="primary" @click="selectedConfirm">确认选择</el-button> 

			<el-button v-if="!isSelect" type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="app-container"> 
			
			<el-col :span="4" >
				<xm-project-phase-template-mng   :sel-project-template="selProjectTemplate" :simple="true" @row-click="projectPhaseTemplateRowClick" @selected-project-template="onSelectedProjectTemplate" ref="projectPhaseTemplate"></xm-project-phase-template-mng>
			</el-col>
			<el-col :span="20">
				<!--列表 XmTaskTemplate xm_task_template select-confirm-->
				<el-table :data="xmTaskTemplatesTreeData" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column sortable type="selection" width="40"></el-table-column>
 					<el-table-column prop="name" label="任务名称" min-width="80" >						
						<template slot-scope="scope">
							{{scope.row.sortLevel}}&nbsp;&nbsp;{{scope.row.name}}
						</template>
					
					</el-table-column> 
					<el-table-column prop="milestone" label="里程碑" min-width="80" >
						<template slot-scope="scope">
							{{scope.row.milestone=='1'?'是':'否'}}
						</template>
					</el-table-column>
					<el-table-column prop="budgetCost" label="预算金额" min-width="80" ></el-table-column>
					<el-table-column prop="budgetWorkload" label="预算工时" min-width="80" ></el-table-column> 
					<el-table-column prop="taskClass" label="结算" min-width="80" >
						<template slot-scope="scope">
							{{scope.row.taskClass=='1'?'是':'否'}}
						</template>
					</el-table-column>
					<el-table-column prop="toTaskCenter" label="任务大厅" min-width="80" >
						<template slot-scope="scope">
							{{scope.row.toTaskCenter=='1'?'是':'否'}}
						</template>
					</el-table-column>
					<el-table-column prop="taskOut" label="外购" min-width="80" >
						<template slot-scope="scope">
							{{scope.row.taskOut=='1'?'是':'否'}}
						</template>
					</el-table-column>  
					<el-table-column prop="taskSkillNames" label="技能列表" min-width="80" ></el-table-column>
					<el-table-column prop="description" label="任务描述" min-width="80" ></el-table-column> 
					<el-table-column label="操作" width="260" fixed="right" v-if="!isSelect" >
						<template slot-scope="scope">
							<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
							<el-button  @click="showSubAdd( scope.row,scope.$index)">+子任务</el-button>
							<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
						</template>
					</el-table-column>
				</el-table>

				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
				
			</el-col>
			<!--编辑 XmTaskTemplate xm_task_template界面-->
			<el-drawer title="编辑任务" :visible.sync="editFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-task-template-edit :xm-task-template="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-task-template-edit>
			</el-drawer>
	
			<!--新增 XmTaskTemplate xm_task_template界面-->
			<el-drawer title="新增任务" :visible.sync="addFormVisible"  size="50%"  append-to-body  :close-on-click-modal="false">
				<xm-task-template-add :parent-task-template="parentTaskTemplate" :xm-project-phase-template="projectPhaseTemplate" :xm-task-template="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-task-template-add>
			</el-drawer> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmTaskTemplate, delXmTaskTemplate, batchDelXmTaskTemplate } from '@/api/xm/core/xmTaskTemplate';
	import  XmTaskTemplateAdd from './XmTaskTemplateAdd';//新增界面
	import  XmTaskTemplateEdit from './XmTaskTemplateEdit';//修改界面
	import xmProjectPhaseTemplateMng from '../xmProjectPhaseTemplate/XmProjectPhaseTemplateMng'; 

	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),
			
			xmTaskTemplatesTreeData() {
				 return this.translateDataToTree(this.xmTaskTemplates);
			},
		},
		watch:{
			selProjectTemplate:function(selProjectTemplate){
				this.filters.projectTemplate=this.selProjectTemplate
				this.getXmTaskTemplates();
			}
		},
		props:['selProjectTemplate','isSelect'],
		data() {
			return {
				filters: {
					key: '',
					projectTemplate:null,
				},
				xmTaskTemplates: [],//查询结果
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
				
				addFormVisible: false,//新增xmTaskTemplate界面是否显示
				//新增xmTaskTemplate界面初始化数据
				addForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',rate:'',budgetCost:'',budgetWorkload:'',taskState:'',taskType:'',taskClass:'',toTaskCenter:'',projectPhaseId:'',projectPhaseName:'',taskSkillNames:'',taskSkillIds:'',taskOut:'',planType:'',settleSchemel:'',menuId:'',menuName:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmTaskTemplate界面初始化数据
				editForm: {
					 id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',rate:'',budgetCost:'',budgetWorkload:'',taskState:'',taskType:'',taskClass:'',toTaskCenter:'',projectPhaseId:'',projectPhaseName:'',taskSkillNames:'',taskSkillIds:'',taskOut:'',planType:'',settleSchemel:'',menuId:'',menuName:''
				},
				parentTaskTemplate:null,
				projectPhaseTemplate:null,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmTaskTemplates();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmTaskTemplates();
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
				this.getXmTaskTemplates();
			},
			searchXmTaskTemplates(){
				 this.pageInfo.count=true; 
				 this.getXmTaskTemplates();
			},
			//获取列表 XmTaskTemplate xm_task_template
			getXmTaskTemplates() {
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
				if(this.projectPhaseTemplate){
					params.projectPhaseId=this.projectPhaseTemplate.id
				}
				if(this.filters.projectTemplate){
					params.projectId=this.filters.projectTemplate.id
				}
				this.load.list = true;
				listXmTaskTemplate(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmTaskTemplates = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmTaskTemplate xm_task_template
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmTaskTemplate xm_task_template
			showAdd: function () {
				if(!this.filters.projectTemplate){
					this.$message.error("请选择模板")
					return;
				}
				if(!this.projectPhaseTemplate){

					this.$message.error("请选择阶段")
					return;
				}
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			showSubAdd: function (parentTaskTemplate) {
				this.parentTaskTemplate=parentTaskTemplate
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.parentTaskTemplate=null;
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmTaskTemplates();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmTaskTemplate
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmTaskTemplate
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmTaskTemplate(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmTaskTemplates();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmTaskTemplate
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmTaskTemplate(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmTaskTemplates(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			
			translateDataToTree(data2) { 
				var data=JSON.parse(JSON.stringify(data2));
				let parents = data.filter(value =>{
					//如果我的上级为空，则我是最上级
					if(value.parentTaskid == 'undefined' || value.parentTaskid == null  || value.parentTaskid == ''){
						return true;

						//如果我的上级不在列表中，我作为最上级
					}else if(data.some(i=>value.parentTaskid==i.id)){
						return false;
					}else {
						return true
					}
				 
				}) 
				let children = data.filter(value =>{
					if(data.some(i=>value.parentTaskid==i.id)){
						return true;
					}else{
						return false;
					} 
				})
				let translator = (parents, children) => {
					parents.forEach((parent) => {
						children.forEach((current, index) => {
							if (current.parentTaskid === parent.id) {
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
			selectedConfirm(){
				this.$emit("select-confirm",this.sels)
			},
			
			projectPhaseTemplateRowClick:function(projectPhaseTemplate){
				this.projectPhaseTemplate=projectPhaseTemplate
				this.getXmTaskTemplates();
			},
			showProjectTemplate(){
				this.$refs.projectPhaseTemplate.showProjectTemplate();
			}, 
			onSelectedProjectTemplate:function(projectTemplate){
				this.filters.projectTemplate=projectTemplate
				this.getXmTaskTemplates();
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-task-template-add':XmTaskTemplateAdd,
		    'xm-task-template-edit':XmTaskTemplateEdit,
		    xmProjectPhaseTemplateMng,
		    //在下面添加其它组件
		},
		mounted() { 
			if(this.selProjectTemplate){
				this.filters.projectTemplate=this.selProjectTemplate
			}
			this.$nextTick(() => {
				//this.getXmTaskTemplates();
        	}); 
		}
	}

</script>

<style scoped>

</style>