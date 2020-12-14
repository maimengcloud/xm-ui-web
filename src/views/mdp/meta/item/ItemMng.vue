<template>
	<section>
		<sticky :className="'sub-navbar draft'">
			 <el-select style="width:40%;" v-model="filters.categoryId" v-loading="load.list" placeholder="请选择分类" clearable>
			    <el-option
			      v-for="item in categorys"
			      :key="item.id"
			      :label="item.categoryName"
			      :value="item.id">
			    </el-option>
			  </el-select>
			<el-button type="text" @click="showAdd" :disabled="readOnly==true">+字段</el-button> 
			<el-button type="text" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || readOnly==true">删除</el-button> 
		</sticky>
		<el-row  class="app-container"> 
			<!--列表 Item 数据项定义-->
			<el-table :data="items" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column type="selection" min-width="55"></el-table-column> 
				<el-table-column prop="itemCode" label="代码" min-width="80" ></el-table-column>
				<el-table-column prop="itemName" label="名称" min-width="150" ></el-table-column> 
				<el-table-column label="操作" min-width="80" fixed="right" >
					<template slot-scope="scope">
						<el-button v-if="readOnly!=true" type="text" @click="showEdit( scope.row,scope.$index)">改</el-button>  
						<el-button v-if="readOnly==true" type="text" @click="checkedItem( scope.row,scope.$index)">选择</el-button>  
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 Item 数据项定义界面-->
			<el-dialog title="编辑数据项定义" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <item-edit :item="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></item-edit>
			</el-dialog>
	
			<!--新增 Item 数据项定义界面-->
			<el-dialog title="新增数据项定义" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<item-add :item="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></item-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import Sticky from '@/components/Sticky' // 粘性header组件 
	import { listItem, delItem, batchDelItem } from '@/api/mdp/meta/item';
	import { listCategory } from '@/api/mdp/meta/category';
	import  ItemAdd from './ItemAdd';//新增界面
	import  ItemEdit from './ItemEdit';//修改界面
	import { mapGetters } from 'vuex' 
	
	export default {
		props:['readOnly'],
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		watch:{
			'filters.categoryId':function(val){
				this.searchItems();
			}
		},
		data() {
			return {
				filters: {
					key: '',
					categoryId:''
				},
				items: [],//查询结果
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
				
				addFormVisible: false,//新增item界面是否显示
				//新增item界面初始化数据
				addForm: {
					id:'',itemCode:'',itemName:'',remark:'',categoryId:'',itemSize:'10',itemType:'text',branchId:'',deptid:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑item界面初始化数据
				editForm: {
					id:'',itemCode:'',itemName:'',remark:'',categoryId:'',itemSize:'',itemType:'',branchId:'',deptid:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				categorys:[],	
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.count=true;
				
				this.getItems();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getItems();
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
				this.getItems();
			},
			searchItems(){
				 
				 this.pageInfo.count=true;
				 this.getItems();
			},
			//获取列表 Item 数据项定义
			getItems() {
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
				params.categoryId=this.filters.categoryId
				this.load.list = true;
				listItem(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.data.total;this.pageInfo.count=false;
						this.items = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$message({ message: '通讯错误', type: 'error' });
				});
			},

			//显示编辑界面 Item 数据项定义
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 Item 数据项定义
			showAdd: function () {
				if(this.filters.categoryId==''){
					this.$message.error("请先选择分类");
					return
				}
				this.addForm.categoryId=this.filters.categoryId;
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getItems();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行item
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除item
			handleDel: function (row,index) {
				
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = row;
					delItem(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getItems();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					});
				}).catch(() => {
					this.load.del=false;
				});
			},
			//批量删除item
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelItem(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getItems(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => {
					this.load.del=false;
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			checkedItem: function(row, event, column){
				this.$emit('checked-item',row, event, column);//  @checked-item="checkedItem"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'item-add':ItemAdd,
		    'item-edit':ItemEdit,
		    'sticky': Sticky
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getItems();
				this.load.list=true
				listCategory({branchId:''}).then(res=>{
					this.load.list=false
					if(res.data.tips.isOk){
						this.categorys=res.data.data
					}else{
						this.$messaage.error(res.data.tips.msg);
					}
				}).catch(()=>this.load.list=false);
        	}); 
		}
	}

</script>

<style scoped>

</style>