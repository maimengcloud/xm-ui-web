<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmProjectOptionss">查询</el-button>
			<el-button type="primary" @click="showAdd">+xm_project_options</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">批量删除</el-button> 
		</el-row>
		<el-row class="page-main page-height-90"> 
			<!--列表 XmProjectOptions xm_project_options-->
			<el-table :data="xmProjectOptionss" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="id" label="主键" min-width="80" ></el-table-column>
				<el-table-column prop="branchId" label="机构编号" min-width="80" ></el-table-column>
				<el-table-column prop="optionType" label="选项类型，0项目类型，1紧急程度，2优先程度" min-width="80" ></el-table-column>
				<el-table-column prop="name" label="选项名字" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="160" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="showEdit( scope.row,scope.$index)">改</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmProjectOptions xm_project_options界面-->
			<el-drawer title="编辑xm_project_options" :visible.sync="editFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-project-options-edit :xm-project-options="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-project-options-edit>
			</el-drawer>
	
			<!--新增 XmProjectOptions xm_project_options界面-->
			<el-drawer title="新增xm_project_options" :visible.sync="addFormVisible"  size="50%"  append-to-body   :close-on-click-modal="false">
				<xm-project-options-add :xm-project-options="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-project-options-add>
			</el-drawer> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProjectOptions, delXmProjectOptions, batchDelXmProjectOptions } from '@/api/xm/core/xmProjectOptions';
	import  XmProjectOptionsAdd from './XmProjectOptionsAdd';//新增界面
	import  XmProjectOptionsEdit from './XmProjectOptionsEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmProjectOptionss: [],//查询结果
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
				
				addFormVisible: false,//新增xmProjectOptions界面是否显示
				//新增xmProjectOptions界面初始化数据
				addForm: {
					id:'',branchId:'',optionType:'',name:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProjectOptions界面初始化数据
				editForm: {
					id:'',branchId:'',optionType:'',name:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProjectOptionss();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProjectOptionss();
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
				this.getXmProjectOptionss();
			},
			searchXmProjectOptionss(){
				 this.pageInfo.count=true; 
				 this.getXmProjectOptionss();
			},
			//获取列表 XmProjectOptions xm_project_options
			getXmProjectOptionss() {
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
					//params.xxx=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				this.load.list = true;
				listXmProjectOptions(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProjectOptionss = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProjectOptions xm_project_options
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProjectOptions xm_project_options
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjectOptionss();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProjectOptions
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProjectOptions
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmProjectOptions(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProjectOptionss();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProjectOptions
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProjectOptions(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProjectOptionss(); 
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
		    'xm-project-options-add':XmProjectOptionsAdd,
		    'xm-project-options-edit':XmProjectOptionsEdit,
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmProjectOptionss();
        	}); 
		}
	}

</script>

<style scoped>

</style>