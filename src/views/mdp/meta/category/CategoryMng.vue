<template>
	<section>
		<sticky :className="'sub-navbar draft'">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" v-on:click="searchCategorys">查询</el-button>
			<el-button type="primary" @click="showAdd">+元数据分类</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0">批量删除</el-button> 
		</sticky>
		<el-row class="page-container border"> 
			<!--列表 Category 元数据分类-->
			<el-table :data="categorys" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="id" label="分类编号" min-width="80" ></el-table-column>
				<el-table-column prop="categoryName" label="分类名称" min-width="80" ></el-table-column>
				<el-table-column prop="isShow" label="是否显示" min-width="80" >
					<template slot-scope="scope">
					<el-tag v-if="scope.row.isShow=='1'">√</el-tag>
					<el-tag v-else>×</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" min-width="80" ></el-table-column> 
				<el-table-column label="操作" min-width="150" fixed="right">
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 Category 元数据分类界面-->
			<el-dialog title="编辑元数据分类" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <category-edit :category="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></category-edit>
			</el-dialog>
	
			<!--新增 Category 元数据分类界面-->
			<el-dialog title="新增元数据分类" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<category-add :category="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></category-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import Sticky from '@/components/Sticky' // 粘性header组件
	import { listCategory, delCategory, batchDelCategory } from '@/api/mdp/meta/category';
	import  CategoryAdd from './CategoryAdd';//新增界面
	import  CategoryEdit from './CategoryEdit';//修改界面
	import { mapGetters } from 'vuex' 
	
	export default {

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
				categorys: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 options.sex,options.project
				
				addFormVisible: false,//新增category界面是否显示
				//新增category界面初始化数据
				addForm: {
					id:'',categoryName:'',isShow:'1',remark:'',branchId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑category界面初始化数据
				editForm: {
					id:'',categoryName:'',isShow:'1',remark:'',branchId:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.count=true;
				
				this.getCategorys();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getCategorys();
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
				this.getCategorys();
			},
			searchCategorys(){
				 
				 this.pageInfo.count=true;
				 this.getCategorys();
			},
			//获取列表 Category 元数据分类
			getCategorys() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,count:this.pageInfo.count
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
				listCategory(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.data.total;this.pageInfo.count=false;
						this.categorys = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$message({showClose: true, message: '通讯错误', type: 'error' });
				});
			},

			//显示编辑界面 Category 元数据分类
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 Category 元数据分类
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getCategorys();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行category
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除category
			handleDel: function (row,index) {
				
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params =row;
					delCategory(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getCategorys();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					});
				}).catch(() => {
					this.load.del=false;
				});
			},
			//批量删除category
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelCategory(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getCategorys(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => {
					this.load.del=false;
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'category-add':CategoryAdd,
		    'category-edit':CategoryEdit,
		    'sticky': Sticky
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getCategorys();
        	}); 
		}
	}

</script>

<style scoped>

</style>