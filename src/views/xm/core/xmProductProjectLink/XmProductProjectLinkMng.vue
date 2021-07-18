<template>
	<section class="app-container">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询">
			    <template slot="append">
			        <el-button v-loading="load.list" :disabled="load.list==true" @click="searchXmProductProjectLinks" icon="el-icon-search">查询</el-button>
			    </template>
			</el-input>
			<el-button type="primary" @click="showAdd" icon="el-icon-plus" circle> </el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" circle></el-button>
		</el-row>
		<el-row style="padding-top:10px;">
			<!--列表 XmProductProjectLink 产品与项目的关联关系表，一般由产品经理挂接项目到产品上-->
			<el-table ref="xmProductProjectLink" :data="xmProductProjectLinks" :max-height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55"></el-table-column>
				<el-table-column sortable type="index" width="55"></el-table-column>
				<el-table-column prop="projectId" label="项目表中的主键" min-width="80" ></el-table-column>
				<el-table-column prop="productId" label="产品表中的主键" min-width="80" ></el-table-column>
				<el-table-column prop="ctime" label="创建时间" min-width="80" ></el-table-column>
				<el-table-column prop="cuserid" label="创建人编号" min-width="80" ></el-table-column>
				<el-table-column prop="cusername" label="创建人姓名" min-width="80" ></el-table-column>
				<el-table-column prop="linkStatus" label="关联状态1关联0取消关联" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="120" fixed="right">
				    <template slot="header">
                        <el-button @click="showAdd" icon="el-icon-plus" circle> </el-button>
                    </template>
					<template scope="scope">
						<el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit" circle></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete" circle></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		
			<!--编辑 XmProductProjectLink 产品与项目的关联关系表，一般由产品经理挂接项目到产品上界面-->
			<el-dialog title="编辑产品与项目的关联关系表，一般由产品经理挂接项目到产品上" :visible.sync="editFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-product-project-link-edit :xm-product-project-link="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-product-project-link-edit>
			</el-dialog>
	
			<!--新增 XmProductProjectLink 产品与项目的关联关系表，一般由产品经理挂接项目到产品上界面-->
			<el-dialog title="新增产品与项目的关联关系表，一般由产品经理挂接项目到产品上" :visible.sync="addFormVisible"  width="50%"  append-to-body  :close-on-click-modal="false">
				<xm-product-project-link-add :xm-product-project-link="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-product-project-link-add>
			</el-dialog> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmProductProjectLink, delXmProductProjectLink, batchDelXmProductProjectLink } from '@/api/xm/core/xmProductProjectLink';
	import  XmProductProjectLinkAdd from './XmProductProjectLinkAdd';//新增界面
	import  XmProductProjectLinkEdit from './XmProductProjectLinkEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','workSpace'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmProductProjectLinks: [],//查询结果
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
				options:{
					//sex:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmProductProjectLink界面是否显示
				//新增xmProductProjectLink界面初始化数据
				addForm: {
					projectId:'',productId:'',ctime:'',cuserid:'',cusername:'',linkStatus:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmProductProjectLink界面初始化数据
				editForm: {
					projectId:'',productId:'',ctime:'',cuserid:'',cusername:'',linkStatus:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmProductProjectLinks();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmProductProjectLinks();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				if(obj.order==null){
					this.pageInfo.orderFields=[];
					this.pageInfo.orderDirs=[]; 
				}else{
					var dir='asc';
					if(obj.order=='ascending'){
						dir='asc'
					}else{
						dir='desc';
					}
					 
					this.pageInfo.orderFields=[util.toLine(obj.prop)]; 
					this.pageInfo.orderDirs=[dir];
				}
				this.getXmProductProjectLinks();
			},
			searchXmProductProjectLinks(){
				 this.pageInfo.count=true; 
				 this.getXmProductProjectLinks();
			},
			//获取列表 XmProductProjectLink 产品与项目的关联关系表，一般由产品经理挂接项目到产品上
			getXmProductProjectLinks() {
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
				if(this.filters.key){
					params.key="%"+this.filters.key+"%"
				}

				this.load.list = true;
				listXmProductProjectLink(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmProductProjectLinks = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmProductProjectLink 产品与项目的关联关系表，一般由产品经理挂接项目到产品上
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProductProjectLink 产品与项目的关联关系表，一般由产品经理挂接项目到产品上
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProductProjectLinks();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmProductProjectLink
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmProductProjectLink
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { projectId: row.projectId };
					delXmProductProjectLink(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmProductProjectLinks();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmProductProjectLink
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmProductProjectLink(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmProductProjectLinks(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-product-project-link-add':XmProductProjectLinkAdd,
		    'xm-product-project-link-edit':XmProductProjectLinkEdit,
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmProductProjectLinks();
                var clientRect=this.$refs.xmProductProjectLink.$el.getBoundingClientRect();
                var subHeight=65/1000 * window.innerHeight;
                this.maxTableHeight =  window.innerHeight -clientRect.y - this.$refs.xmProductProjectLink.$el.offsetTop-subHeight;
        	}); 
        	/** 举例，
    		listOption([{categoryId:'all',itemCode:'sex'},{categoryId:'all',itemCode:'grade'}] ).then(res=>{
				if(res.data.tips.isOk){ 
 					this.options=res.data.data
				}
			});
			**/
		}
	}

</script>

<style scoped>
</style>