<template>
	<section>
		<el-row  class="app-container">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" v-on:click="searchDeptLocations" icon="el-icon-search"></el-button>
			<el-button type="primary" @click="showAdd" icon="el-icon-plus">sys_dept_location</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0" icon="el-icon-delete"></el-button> 
		</el-row>
		<el-row class="app-container"> 
			<!--列表 DeptLocation sys_dept_location-->
			<el-table :max-height="tableHeight" :data="deptLocations"  highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column sortable prop="deptid" label="部门地址编号" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="longitude" label="经度" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="latitude" label="纬度" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="address" label="地址" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="province" label="省" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="city" label="市" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable prop="district" label="区" min-width="80" show-overflow-tooltip></el-table-column>
				<el-table-column sortable label="操作" min-width="150" fixed="right">
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 DeptLocation sys_dept_location界面-->
			<el-dialog title="编辑sys_dept_location" :visible.sync="editFormVisible"  width="50%"  :close-on-click-modal="false">
				  <dept-location-edit :dept-location="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></dept-location-edit>
			</el-dialog>
	
			<!--新增 DeptLocation sys_dept_location界面-->
			<el-dialog title="新增sys_dept_location" :visible.sync="addFormVisible"  width="50%"  :close-on-click-modal="false">
				<dept-location-add :dept-location="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></dept-location-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listDeptLocation, delDeptLocation, batchDelDeptLocation } from '@/api/mdp/sys/deptLocation';
	import  DeptLocationAdd from './DeptLocationAdd';//新增界面
	import  DeptLocationEdit from './DeptLocationEdit';//修改界面
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
				deptLocations: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增deptLocation界面是否显示
				//新增deptLocation界面初始化数据
				addForm: {
					deptid:'',longitude:'',latitude:'',address:'',province:'',city:'',district:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑deptLocation界面初始化数据
				editForm: {
					deptid:'',longitude:'',latitude:'',address:'',province:'',city:'',district:''
				},
				tableHeight:500,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.count=true;
				
				this.getDeptLocations();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getDeptLocations();
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
				this.getDeptLocations();
			},
			searchDeptLocations(){
				 
				 this.pageInfo.count=true;
				 this.getDeptLocations();
			},
			//获取列表 DeptLocation sys_dept_location
			getDeptLocations() {
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
				this.load.list = true;
				listDeptLocation(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;this.pageInfo.count=false;
						this.deptLocations = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$notify({ message: '通讯错误', type: 'error' });
				});
			},

			//显示编辑界面 DeptLocation sys_dept_location
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 DeptLocation sys_dept_location
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getDeptLocations();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行deptLocation
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除deptLocation
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { deptid: row.deptid };
					delDeptLocation(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getDeptLocations();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					});
				}).catch(() =>this.load.del=false);
			},
			//批量删除deptLocation
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelDeptLocation(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getDeptLocations(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => this.load.del=false );
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'dept-location-add':DeptLocationAdd,
		    'dept-location-edit':DeptLocationEdit,
		     
		    //在下面添加其它组件
		},
		mounted() {   
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 250;   
			}); 
			this.$nextTick(() => {
				this.getDeptLocations();
        	}); 
		}
	}

</script>

<style scoped>

</style>