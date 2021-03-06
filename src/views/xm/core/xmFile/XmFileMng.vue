<template>
	<section>
		<el-row v-if="!InfoVisible" class="xm-file">
			<el-menu disable active-text-color="#00abfc"
			default-active="all"
			class="el-menu-demo" mode="horizontal">
			<!-- :default-active="selkey" 
			@select="changeSelKey"  -->
				<el-menu-item class="showall" index="all">全部</el-menu-item>
				<div style="line-height:50px;float:right;margin-right:10px;">
					<el-input style="width:200px;" v-model="searchFile" placeholder="文档搜索"></el-input>
					<el-button @click="showAdd" type="plian">新建文档</el-button>
				</div>
			</el-menu> 
			<!--列表 XmFile xm_file-->
			<el-table :data="Files" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column prop="name" label="文档标题" ></el-table-column>
				<el-table-column prop="createUsername" label="创建人" ></el-table-column>
				<el-table-column prop="createTime" label="创建时间" ></el-table-column>
				<el-table-column style="text-align:center;" align="center" width="140" fixed="right"  >
					<template slot-scope="scope">
						<!-- <el-popover
							placement="left"
							trigger="hover"> -->
							<el-button-group>
								<el-button size="small" type="primary" @click.stop="showEdit(scope.row,scope.$index)">编辑</el-button>
								<el-button size="small" type="primary" @click.stop="handleDel(scope.row,scope.$index)">删除</el-button>
							</el-button-group>
							<!-- <el-button slot="reference" class="see-more" type="text" icon="el-icon-more"></el-button>
						</el-popover>	 -->
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
			<!--编辑 XmFile xm_file界面-->
			<el-dialog title="编辑文档" :visible.sync="editFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
				  <xm-file-edit :xm-file="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></xm-file-edit>
			</el-dialog>

			<!--新增 XmFile xm_file界面-->
			<el-dialog title="新增文档" :visible.sync="addFormVisible"  width="50%"  append-to-body   :close-on-click-modal="false">
				<xm-file-add :xm-file="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></xm-file-add>
			</el-dialog> 
		</el-row>
		<el-row v-else class="xm-file-detail">
			<div class="title-bar">
				文档详情
				<el-button @click="InfoVisible=false" type="plian">返回</el-button>
			</div>
			<!--列表 XmFile xm_file-->
			<el-form class="file-form" :model="selFile" label-width="120px">
				<el-form-item label="项目名称">
					<span>{{selFile.projectName}}</span>
				</el-form-item> 
				<el-form-item label="名称名称" prop="name">
					<span>{{selFile.name}}</span>
				</el-form-item> 
				<el-form-item label="文件说明">
					<span v-html="selFile.description"></span>
				</el-form-item> 
				<el-form-item label="创建人">
					<span>{{selFile.createUsername}}</span>
				</el-form-item>
				<el-form-item label="创建时间">
					<span>{{selFile.createTime}}</span>
				</el-form-item>
				<el-form-item label="附件">
					<el-tag v-for="(item,i) in selFile.attachment" :key="i">{{item.name}}</el-tag>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmFile, delXmFile, batchDelXmFile } from '@/api/xm/core/xmFile';
	import  XmFileAdd from './XmFileAdd';//新增界面
	import  XmFileEdit from './XmFileEdit';//修改界面
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
				]),
				Files() {
					if(this.selProject != undefined){
						const file = this.selProject.file.filter(i=>i.name.indexOf(this.searchFile) != -1);
						return file;
					}
					return [];
				},
		},
		props: ["selProject"],
		data() {
			return {
				filters: {
					key: ''
				},
				xmFiles: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmFile界面是否显示
				//新增xmFile界面初始化数据
				addForm: {
					id:'',name:'',projectId:'',projectName:'',description:'',createUserid:'',createUsername:'',createTime:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmFile界面初始化数据
				editForm: {
					id:'',name:'',projectId:'',projectName:'',description:'',createUserid:'',createUsername:'',createTime:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				InfoVisible: false,
				selFile: {},
				searchFile: '',
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmFiles();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmFiles();
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
				this.getXmFiles();
			},
			searchXmFiles(){
				 this.pageInfo.count=true; 
				 this.getXmFiles();
			},
			//获取列表 XmFile xm_file
			getXmFiles() {
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
				params.projectId = this.selProject.id;
				listXmFile(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.selProject.file = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmFile xm_file
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmFile xm_file
			showAdd: function () {
				this.addForm.projectId = this.selProject.id;
				this.addForm.projectName = this.selProject.name;
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmFiles();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getXmFiles();
			},
			//选择行xmFile
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmFile
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmFile(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmFiles();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmFile
			batchDel: function () {
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmFile(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmFiles(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.selFile = row;
				this.InfoVisible = true;
				// this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			inputChange() {
				this.$forceUpdate();
			},
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'xm-file-add':XmFileAdd,
		    'xm-file-edit':XmFileEdit,
				
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmFiles();
			}); 
		}
	}
</script>

<style scoped>
.xm-file{
	width: 100%;
}
.xm-file>.el-menu-demo,.title-bar{
	height: 50px;
	background: #fafbfc;
	line-height: 50px;
}
.title-bar{
	padding:0 10px;
}
.title-bar>button{
	float:right;
	margin:7px 10px;
}
.xm-file>.el-menu-demo>li{
	height: 100%;
	line-height: 50px;
	color: #303133;
}
.xm-file>.el-menu-demo>li:hover{
	background: transparent;
}
.xm-file>.el-menu-demo>.is-active{
	background: transparent;
}
.file-form{
	margin-top: 20px;
}
</style>