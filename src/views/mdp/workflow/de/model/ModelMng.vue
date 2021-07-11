<template>
	<section>
		<el-row  class="page-container border">
			<el-row class="page-header">
				<el-input v-model="filters.key" style="width:270px;"  placeholder="模糊查询">
					<template slot="append">
						<el-button type="primary"   v-on:click="searchModels" icon="el-icon-search">查询</el-button>
					</template>
				</el-input>
				<el-button style="margin-left: 13px;"
					@click="handleDownload"
					icon="el-icon-download"
				>导出数据</el-button>
			</el-row>
			<el-row class="page-main">
				<!--列表 Model act_de_model-->
				<el-table  ref="table" :height="tableHeight" :data="models"    highlight-current-row v-loading="listLoading" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column type="index" width="40"></el-table-column>
					<el-table-column  prop="name" label="流程(点击查已发布版本)" min-width="300" show-overflow-tooltip>
						<template slot-scope="scope">
								<el-link type="primary" @click="showDeploymentList( scope.row,scope.$index)">{{scope.row.name}} </el-link>
						</template>
					</el-table-column>
					<el-table-column sortable prop="version" label="模型版本" min-width="100"   show-overflow-tooltip></el-table-column>
					<el-table-column  prop="description" label="描述" width="120" show-overflow-tooltip> 

					</el-table-column>
					<el-table-column  prop="modelComment" label="备注" min-width="80"   show-overflow-tooltip></el-table-column>
					<el-table-column sortable prop="created" label="创建时间" min-width="120"   show-overflow-tooltip></el-table-column>
					<el-table-column sortable prop="lastUpdated" label="更新时间" min-width="120"   show-overflow-tooltip></el-table-column>
					<el-table-column  prop="lastUpdatedBy" label="更新人" min-width="120"   show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" width="300"  fixed="right">
						<template slot-scope="scope">
							<el-button   @click="showDiagram( scope.row,scope.$index)">流程图</el-button>
							<el-button   @click="deploy( scope.row,scope.$index)" type="primary" icon="el-icon-position"></el-button>
							<el-button type="danger"  @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

					<!--流程图界面-->
				<el-dialog title="流程图" :visible.sync="diagramVisible"  width="80%"  :close-on-click-modal="false">
					<img :src="diagramUrl"></img>
				</el-dialog>

				<el-dialog title="已发布的流程" :visible.sync="deploymentVisible"  width="80%"  :close-on-click-modal="false">
					<deployment-mng :modelKey="editForm.modelKey"></deployment-mng>
				</el-dialog>
			</el-row>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	//import { selectCacheOptions,getDefaultValue,getCodeName } from '../../../../../api/common/code';//下拉框数据查询
	import {unDeployModel,deployModel, listModel, delModel, batchDelModel } from '@/api/mdp/workflow/de/model';
	import Sticky from '@/components/Sticky' // 粘性header组件
	import { mapGetters } from 'vuex'
	import { listUser } from '@/api/mdp/sys/user';//下拉框数据查询
	import { listDept } from '@/api/mdp/sys/dept';//下拉框数据查询
	import DeploymentMng from '@/views/mdp/workflow/re/deployment/DeploymentMng'
	export default {
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			return {
				filters: {
					key: '',
					category:'',
				},
				models: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[],//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
					count:true,
				},
				listLoading: false,//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 options.sex,options.project

				addFormVisible: false,//新增model界面是否显示
				//新增model界面初始化数据
				addForm: {
					id:'',name:'',modelKey:'',description:'',modelComment:'',created:'',createdBy:'',lastUpdated:'',lastUpdatedBy:'',version:'',modelEditorJson:'',thumbnail:'',modelType:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑model界面初始化数据
				editForm: {
					id:'',name:'',modelKey:'',description:'',modelComment:'',created:'',createdBy:'',lastUpdated:'',lastUpdatedBy:'',version:'',modelEditorJson:'',thumbnail:'',modelType:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				diagramVisible:false,
				diagramUrl:'',
				companyEmployees:[],
				companyDepts:[],
				deploymentVisible:false,
				categorys:[],
				tableHeight:300,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			//获取代码对应的名称 用于数据反显 如 getCodeName(options.sex,'1');
			getCodeName(options,codeValue){
				if(!options)return codeValue;
				let code=options.filter(i=>i.codeValue==codeValue);
				if(code.length>0){
					return code[0].codeName
				}else{
					return codeValue
				}
			},
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.total=0;
				this.pageInfo.pageNum=1;
				this.getModels();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getModels();
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
				this.getModels();
			},
			searchModels(){
				 this.pageInfo.pageNum=1;
				 this.pageInfo.total=0;
				 this.pageInfo.count=true
				 this.getModels();
			},
			//获取列表 Model act_de_model
			getModels() {
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
					params.key='%'+this.filters.key+'%'
				}
				this.listLoading = true;
				listModel(params).then((res) => {
					console.log(res)
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
				 		this.pageInfo.count=false
						this.models = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;

				});
			},

			//显示编辑界面 Model act_de_model
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 Model act_de_model
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.total=0;
				this.getModels();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行model
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除model
			handleDel: function (row,index) {
				this.$confirm('【不可逆操作】将永久删除该模型及有关的所有流程和任务，确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = { id: row.id };
					delModel(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.total=0;
				 			this.pageInfo.count=true
							this.getModels();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });

					});
				}).catch(() => {
					this.listLoading = false;

				});
			},
			//批量删除model
			batchDel: function () {
				var ids = this.sels.map(item => item.id);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					batchDelModel(ids).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.total=0;
				 			this.pageInfo.count=true
							this.getModels();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => {
					this.listLoading = false;

				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			deploy: function(row, index){
				this.$confirm('将产生新版本的流程，原流程及任务不受影响，是否继续?', '提示', {
					type: 'warning'
				}).then(() => {
					 deployModel(row).then(res=>{
					 	var tips=res.data.tips;
					 	if(tips.isOk){
					 		this.getModels();
					 	}else{
					 		this.$message({ message: tips.msg, type: 'error' });
					 	}

					 });
				}).catch(() => {
					this.listLoading = false;

				});
			},
			unDeploy: function(row, index){
				this.$confirm('【不可逆操作】取消发布后，将不能再使用该版本发起新的流程，已发起的不受影响，是否继续?', '提示', {
					type: 'warning'
				}).then(() => {
					 unDeployModel(row).then(res=>{
					 	var tips=res.data.tips;
					 	if(tips.isOk){
					 		this.getModels();
					 	}else{
					 		this.$message({ message: tips.msg, type: 'error' });
					 	}

					 });
				}).catch(() => {
					this.listLoading = false;

				});
			},
			//显示编辑界面 Model act_de_model
			showDiagram: function ( row,index ) {
				this.diagramVisible = true;
				this.diagramUrl="/"+process.env.BASE_API+"/"+process.env.VERSION+"/"+config.getWorkflowBasePath()+"/mdp/workflow/de/model/diagram/"+row.id
			},
			showDeploymentList:function(row,index){
				this.editForm=row
				this.deploymentVisible=true;
			},
			handleDownload() {
				import("@/vendor/Export2Excel").then(excel => {
					const tHeader = [
						"最后更新人",
						"模拟编辑器JSON",
						"缩略图",
						"创建时间",
						"备注",
						"模型类型",
						"模型注释",
						"模型版本",
						"模型编码",
						"最后更新时间",
						"创建人",
						"流程名称",
						"工作编号",
						"流程编号"
					];
					const filterVal = [
						"lastUpdatedBy",
						"modelEditorJson",
						"thumbnail",
						"created",
						"description",
						"modelType",
						"modelComment",
						"version",
						"modelKey",
						"lastUpdated",
						"createdBy",
						"name",
						"tenantId",
						"id"
					];
					const list = this.models;
					const data = this.formatJson(filterVal, list);
					var filename = "在线模型发布";
					if (this.formDefSelected) {
					filename = this.formDefSelected.formName
						? this.formDefSelected.formName
						: this.formDefSelected.id + "在线模型发布";
					}
					excel.export_json_to_excel({
					header: tHeader,
					data,
					filename: filename,
					autoWidth: true,
					bookType: "xlsx"
					});
				});
				},
				formatJson(filterVal, jsonData) {
				return jsonData.map(v =>
					filterVal.map(j => {
					if (j === "timestamp") {
						return parseTime(v[j]);
					} else {
						return v[j];
					}
					})
				);
			}
			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    'sticky': Sticky,DeploymentMng
		    //在下面添加其它组件
		},
		mounted() {

			this.$nextTick(() => {
				var clientRect=this.$refs.table.$el.getBoundingClientRect();
				var subHeight=70/1000 * window.innerHeight;
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight;
				this.getModels();
        	});

			//加载下拉列表 如有需要去年注释
			/**
			let optionsParams={code:'all',fieldNames:['sex']};
			selectCacheOptions(optionsParams).then(res=>{
				this.options=res.data.data;
			});
			**/
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');

			/**在下面写其它函数***/
		}
	}

</script>

<style scoped>

</style>

<style>
  .el-input-group__append, .el-input-group__prepend {
      background-color: #409EFF!important;
      color: #ffffff!important;
      vertical-align: middle;
      display: table-cell;
      position: relative;
      border: 1px solid #409EFF!important;
      padding: 0 20px;
      width: 1px;
      white-space: nowrap;
  }
</style>
