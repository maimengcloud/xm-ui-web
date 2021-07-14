<template>
	<section>
		<el-row class="page-container border">
			<el-row class="page-header">
				<el-input v-model="filters.key" style="width:30%;" placeholder="模糊查询">
					<template slot="append">
						<el-button type="primary"  v-loading="load.list" :disabled="load.list==true"  v-on:click="searchBizModels" icon="el-icon-search">查询</el-button>
					</template>
				</el-input>
				<el-button @click="showAdd" icon="el-icon-plus" style="margin-left: 13px;">业务模块</el-button>
				<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete">批量删除</el-button>
			</el-row>
			<el-row class="page-main">
				<!--列表 BizModel mdp_biz_model-->
				<el-table  ref="table" :height="tableHeight" :data="bizModels"  highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column sortable type="selection" width="40"></el-table-column>
					<el-table-column sortable type="index" width="40"></el-table-column>
					<el-table-column sortable prop="bizName" label="业务名称" min-width="80" show-overflow-tooltip></el-table-column>
					<el-table-column sortable prop="bizKey" label="业务编码" min-width="80"  show-overflow-tooltip></el-table-column>
					<el-table-column sortable prop="modelKey" label="模型编码" min-width="80"  show-overflow-tooltip></el-table-column>
					<el-table-column sortable prop="modelName" label="模型名称" min-width="80"  show-overflow-tooltip></el-table-column>
					<el-table-column label="操作" width="160" fixed="right"  >
						<template slot-scope="scope">
							<el-button  @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
							<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>

				<!--编辑 BizModel mdp_biz_model界面-->
				<el-dialog title="修改业务模块" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false" append-to-body>
					<biz-model-edit :disabled-select-model="!!modelKey" :biz-model="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></biz-model-edit>
				</el-dialog>

				<!--新增 BizModel mdp_biz_model界面-->
				<el-dialog title="新增业务模块" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false" append-to-body>
					<biz-model-add :disabled-select-model="!!modelKey" :biz-model="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></biz-model-add>
				</el-dialog>
			</el-row>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listBizModel, delBizModel, batchDelBizModel } from '@/api/mdp/workflow/biz/bizModel';
	import  BizModelAdd from './BizModelAdd';//新增界面
	import  BizModelEdit from './BizModelEdit';//修改界面
	import { mapGetters } from 'vuex'

	export default {
		name:'BizModelMng',
		props:["modelKey","modelName","visible"],
		watch:{
			visible:function(visible){
				if(visible==true){
					this.addForm.modelName=this.modelName
					this.addForm.modelKey=this.modelKey
					this.getBizModels();
				}

			}
		},
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				bizModels: [],//查询结果
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

				addFormVisible: false,//新增bizModel界面是否显示
				//新增bizModel界面初始化数据
				addForm: {
					bizName:'',bizKey:'',modelKey:'',modelName:'',id:'',branchId:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑bizModel界面初始化数据
				editForm: {
					bizName:'',bizKey:'',modelKey:'',modelName:'',id:'',branchId:''
				},
				tableHeight:300,
				/**begin 自定义属性请在下面加 请加备注**/

				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getBizModels();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getBizModels();
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
				this.getBizModels();
			},
			searchBizModels(){
				 this.pageInfo.count=true;
				 this.getBizModels();
			},
			//获取列表 BizModel mdp_biz_model
			getBizModels() {
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
					params.key="%"+this.filters.key+"%"
				}else{
					//params.xxx=xxxxx
				}
				if(this.modelKey!=null && this.modelKey!=''){
					params.modelKey=this.modelKey;
				}
				params.branchId=this.userInfo.branchId;
				this.load.list = true;
				listBizModel(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.bizModels = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 BizModel mdp_biz_model
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 BizModel mdp_biz_model
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getBizModels();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行bizModel
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除bizModel
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = { id: row.id };
					delBizModel(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getBizModels();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除bizModel
			batchDel: function () {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelBizModel(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getBizModels();
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
		    'biz-model-add':BizModelAdd,
		    'biz-model-edit':BizModelEdit,
		    'sticky': Sticky
		    //在下面添加其它组件
		},
		mounted() {
			this.addForm.modelKey=this.modelKey
			this.addForm.modelName=this.modelName
			this.editForm.modelKey=this.modelKey
			this.editForm.modelName=this.modelName
			this.$nextTick(() => {
				var clientRect=this.$refs.table.$el.getBoundingClientRect();
				var subHeight=70/1000 * window.innerHeight;
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight;
				this.getBizModels();
        	});
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
