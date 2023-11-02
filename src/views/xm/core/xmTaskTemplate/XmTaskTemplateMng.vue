<template>
	<section class="page-container padding border">
				<el-row>
					<el-popover
						placement="bottom"
						width="500"
						trigger="click">
						<xm-project-tpl-mng :auto-select="true" :isSelect="true" showType="simple"  @row-click="onProjectRowClick" @clear="onProjectClearSelect"></xm-project-tpl-mng>
							<el-link type="warning" slot="reference" icon="el-icon-search"><font style="font-size:14px;">{{filters.project?filters.project.name:'选择项目模板'}}</font></el-link>
					</el-popover>

					<el-popover
						placement="bottom"
						width="500"
						trigger="click">
						<xm-product-tpl-mng :auto-select="true" :isSelect="true"  showType="simple"  @row-click="onProductRowClick" @clear="onProductClearSelect"></xm-product-tpl-mng>
							<el-link type="warning" slot="reference" icon="el-icon-search"><font style="font-size:14px;">{{filters.product?filters.product.productName:'选择产品模板'}}</font></el-link>
					</el-popover>
					<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
					<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmTaskTemplates">查询</el-button>
 					<el-button v-if="isSelect" type="primary" @click="selectConfirm">确认选择</el-button>
				</el-row>
				<el-row class="page-main">
						<!--列表 XmTaskTemplate xm_task_template select-confirm-->
						<el-table ref="table" :load="loadXmTaskLazy" v-adaptive="{bottomOffset:30}" :data="xmTaskTemplatesTreeData" row-key="id" :tree-props="{children: 'children', hasChildren: 'childrenCnt'}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
							<el-table-column sortable type="selection" width="40"></el-table-column>
							<el-table-column prop="name" label="任务名称" min-width="150" >
								<template slot-scope="scope">
									{{scope.row.sortLevel}}&nbsp;&nbsp;{{scope.row.name}}
								</template>
							</el-table-column>
							<el-table-column prop="budgetCost" label="预算金额" min-width="80" ></el-table-column>
							<el-table-column prop="budgetWorkload" label="预算工时" min-width="80" ></el-table-column>
							<el-table-column prop="taskOut" label="外购" min-width="80" >
								<template slot-scope="scope">
									{{scope.row.taskOut=='1'?'是':'否'}}
								</template>
							</el-table-column>
							<el-table-column prop="taskSkillNames" label="技能列表" min-width="80"  show-overflow-tooltip></el-table-column>
							<el-table-column prop="description" label="任务描述" min-width="80" show-overflow-tooltip></el-table-column>
						</el-table>
				</el-row>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import treeTool from '@/common/js/treeTool';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { listXmTask  } from '@/api/xm/core/xmTask';
	import XmProductTplMng from '../xmProduct/XmProductTplMng'
	import XmProjectTplMng from '../xmProject/XmProjectTplMng'
	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
			]),

			xmTaskTemplatesTreeData() {
				 return treeTool.translateDataToTree(this.xmTaskTemplates,"parentTaskid","id");
			},
		},
		watch:{
		},
		props:['isSelect'],
		data() {
			return {
				filters: {
					key: '',
					project:null,
					product:null,
				},
				xmTaskTemplates: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:20,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增xmTaskTemplate界面是否显示
				//新增xmTaskTemplate界面初始化数据
				addForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',rate:'',budgetCost:'',budgetWorkload:'',taskState:'',taskType:'',taskClass:'',toTaskCenter:'',phaseId:'',projectPhaseName:'',taskSkillNames:'',taskSkillIds:'',taskOut:'',planType:'',settleSchemel:'',menuId:'',menuName:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmTaskTemplate界面初始化数据
				editForm: {
					 id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',rate:'',budgetCost:'',budgetWorkload:'',taskState:'',taskType:'',taskClass:'',toTaskCenter:'',phaseId:'',projectPhaseName:'',taskSkillNames:'',taskSkillIds:'',taskOut:'',planType:'',settleSchemel:'',menuId:'',menuName:''
				},
				parentTaskTemplate:null,
				maxTableHeight:300,
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
				if(this.filters.project){
					params.ptype="0"
					params.projectId=this.filters.project.id
				}
				if(this.filters.product){
					params.ptype="1"
					params.productId=this.filters.product.id
				}

				if(!params.productId && !params.projectId){
					this.$notify({position:'bottom-left',showClose:true,message: "选择一个模板", type: 'error' });
					return;
				}
				params.isTpl="1"
				this.load.list = true;
				listXmTask(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmTaskTemplates = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
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
				if(!this.filters.project){
					this.$notify.error("请选择模板")
					return;
				}
				if(!this.projectPhaseTemplate){

					this.$notify.error("请选择计划")
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
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			selectConfirm(){
				this.$emit("select-confirm",this.sels)
			},
			onProjectRowClick:function(project){
				this.filters.project=project
				this.filters.product=null;
				this.getXmTaskTemplates();
			},
			onProjectClearSelect(){
				this.filters.project=null;
				this.getXmTaskTemplates();
			},
			onProductRowClick:function(product){
				this.filters.product=product
				this.filters.project=null;
				this.getXmTaskTemplates();
			},
			onProductClearSelect(){
				this.filters.product=null;
				this.getXmTaskTemplates();
			},
			loadXmTaskLazy(tree, treeNode, resolve) {
					var params={parentTaskid:tree.id}
					params.isTop=""
					this.load.list = true;
					var func=listXmTask
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
		    XmProjectTplMng,XmProductTplMng,
		    //在下面添加其它组件
		},
		mounted() {
			if(this.selProjectTemplate){
				this.filters.project=this.selProjectTemplate
			}
			this.$nextTick(() => {


                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el);
				//this.getXmTaskTemplates();
        	});
		}
	}

</script>

<style scoped>

</style>
