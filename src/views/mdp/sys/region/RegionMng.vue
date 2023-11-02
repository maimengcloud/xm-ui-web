<template>
	<section>
		<el-row>
			<!--工具条1-->
			<el-col :span="24" class="toolbar"  style="padding-bottom: 0px;padding-left: 0px">
				<el-col :span="4">
					<el-input v-model="filters.key"  placeholder="模糊查询"></el-input>
				</el-col>
				<el-col :span="8">
					<el-button type="primary"   v-on:click="searchRegions" icon="el-icon-search"></el-button>
					<el-button type="primary"   @click="showAdd">新增</el-button>
					<el-button type="danger"    @click="batchDel" :disabled="this.sels.length===0" icon="el-icon-delete"></el-button>
				</el-col>	
				<el-col :span="12">
					<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;">
					</el-pagination>
				</el-col>	
			</el-col>
			
			<!--工具条2-->  
			<!--如果有更多工具条,放开此注释
			<el-col :span="24" class="toolbar"  style="padding-bottom: 0px;">
				<el-col :span="4">
				</el-col>
			</el-col>
			-->		
			
			<!--列表 Region sys_region-->
			<el-table height="480" :data="regions"   highlight-current-row v-loading="listLoading" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column sortable prop="id" label="id" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="parentId" label="parent_id" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="name" label="name" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="type" label="type" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="agencyId" label="agency_id" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable label="操作" min-width="150"  fixed="right">
					<template scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button type="danger"  @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<!--编辑 Region sys_region界面-->
			<el-dialog title="编辑" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <region-edit :region="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></region-edit>
			</el-dialog>
	
			<!--新增 Region sys_region界面-->
			<el-dialog title="新增" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<region-add :region="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></region-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import { listRegion, delRegion, batchDelRegion } from '../../../../api/mdp/sys/region';
	import  RegionAdd from './RegionAdd';//新增界面
	import  RegionEdit from './RegionEdit';//修改界面
	
	export default {
  		name:"RegionMng",
		data() {
			return {
				filters: {
					key: ''
				},
				regions: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				listLoading: false,//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 options.sex,options.project
				
				addFormVisible: false,//新增region界面是否显示
				//新增region界面初始化数据
				addForm: {
					id:'',parentId:'',name:'',type:'',agencyId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑region界面初始化数据
				editForm: {
					id:'',parentId:'',name:'',type:'',agencyId:''
				},
				tableHeight:500,
				/**begin 自定义属性请在下面加 请加备注**/
					
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
				this.pageInfo.count=true;
				
				this.getRegions();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getRegions();
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
				this.getRegions();
			},
			searchRegions(){
				 
				 this.pageInfo.count=true;
				 this.getRegions();
			},
			//获取列表 Region sys_region
			getRegions() {
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
					//params.key="%"+this.filters.key+"%"
				}else{
					//params.xxx=xxxxx
				}
				this.listLoading = true;
				listRegion(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;this.pageInfo.count=false;
						this.regions = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
					this.$notify({ message: '你已取消操作', type: 'info' });
				});
			},

			//显示编辑界面 Region sys_region
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 Region sys_region
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getRegions();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行region
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除region
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let params = row;
					delRegion(params).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getRegions();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.listLoading = false;
					this.$notify({ message: '你已取消操作', type: 'info' });
				});
			},
			//批量删除region
			batchDel: function () { 
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					batchDelRegion(this.sels).then((res) => {
						this.listLoading = false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getRegions(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => {
					this.listLoading = false;
					this.$notify({ message: '你已取消操作', type: 'info' });
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'region-add':RegionAdd,
		    'region-edit':RegionEdit
		    //在下面添加其它组件
		},
		mounted() {   
			
			this.$nextTick(() => {
      			this.tableHeight = window.innerHeight - 250;  
				this.getRegions();
        	});
		}
	}

</script>

<style scoped>

</style>