<template>
	<section>
		<el-row class="app-container">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询">
				<template slot="append"> 
					<el-button type="primary"   v-on:click="searchProcdefParamesTemplates" icon="el-icon-search">查询</el-button> 
				</template>
			</el-input>  
		</el-row>
		<el-row class="app-container"> 
			<!--列表 ProcdefParamesTemplate mdp_re_procdef_parames_template-->
			<el-table  ref="table" :max-height="tableHeight"  :data="procdefParamesTemplates"   highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				 
				<el-table-column type="index" width="40"></el-table-column>  
				<el-table-column sortable prop="mainTitle" label="流程标题" min-width="150" ></el-table-column> 
				<el-table-column sortable prop="tagNames" label="标签名" min-width="80" ></el-table-column>
				<el-table-column sortable prop="isRefForm" label="关联表单" min-width="80" ></el-table-column>
				<el-table-column sortable prop="monitors" label="监控人" min-width="80" ></el-table-column>
				<el-table-column sortable prop="sponsors" label="主办人" min-width="80" ></el-table-column>
				<el-table-column sortable prop="formId" label="表单编号" min-width="80" ></el-table-column> 
				<el-table-column sortable prop="mainContext" label="流程正文" min-width="80" ></el-table-column> 
				<el-table-column sortable prop="categoryId" label="所属分类编号" min-width="80" ></el-table-column>
				<el-table-column label="操作" width="200" fixed="right"  >
					<template slot-scope="scope">
						<el-button  @click="confirm( scope.row,scope.$index)">选中</el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">删</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listProcdefParamesTemplate, delProcdefParamesTemplate, batchDelProcdefParamesTemplate } from '@/api/mdp/workflow/re/procdefParamesTemplate'; 
	import { mapGetters } from 'vuex'
	
	export default { 
		props:['modelKey','procDefId','visible'],
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		watch:{
			modelKey:function(modelKey){
				//this.getProcdefParamesTemplates();
			},
			visible:function(visible){
				if(visible==true){
					this.getProcdefParamesTemplates();
				}
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				procdefParamesTemplates: [],//查询结果
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
				
				addFormVisible: false,//新增procdefParamesTemplate界面是否显示
				//新增procdefParamesTemplate界面初始化数据
				addForm: {
					id:'',isRefForm:'',monitors:'',sponsors:'',formId:'',procDefId:'',userid:'',lastDate:'',mainContext:'',mainTitle:'',bizUrl:'',bizName:'',categoryId:'',branchId:'',formShowType:'',fp:'',sp:'',tp:'',pconfig:'',fo:'',fi:'',tagNames:'',tagIds:'',mainQx:'',modelKey:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑procdefParamesTemplate界面初始化数据
				editForm: {
					id:'',isRefForm:'',monitors:'',sponsors:'',formId:'',procDefId:'',userid:'',lastDate:'',mainContext:'',mainTitle:'',bizUrl:'',bizName:'',categoryId:'',branchId:'',formShowType:'',fp:'',sp:'',tp:'',pconfig:'',fo:'',fi:'',tagNames:'',tagIds:'',mainQx:'',modelKey:''
				},
				tableHeight:300,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getProcdefParamesTemplates();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getProcdefParamesTemplates();
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
				this.getProcdefParamesTemplates();
			},
			searchProcdefParamesTemplates(){
				 this.pageInfo.count=true; 
				 this.getProcdefParamesTemplates();
			},
			//获取列表 ProcdefParamesTemplate mdp_re_procdef_parames_template
			getProcdefParamesTemplates() {
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
					params.key=this.filters.key
				}else{
					//params.xxx=xxxxx
				}
				params.modelKey=this.modelKey;
				this.load.list = true;
				listProcdefParamesTemplate(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.procdefParamesTemplates = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 ProcdefParamesTemplate mdp_re_procdef_parames_template
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 ProcdefParamesTemplate mdp_re_procdef_parames_template
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getProcdefParamesTemplates();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行procdefParamesTemplate
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除procdefParamesTemplate
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delProcdefParamesTemplate(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getProcdefParamesTemplates();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除procdefParamesTemplate
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelProcdefParamesTemplate(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getProcdefParamesTemplates(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			confirm:function(row,index){ 
					this.$emit("confirm",row); 
			}
			/**begin 自定义函数请在下面加**/
			
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {  
		    'sticky': Sticky
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => { 
				var clientRect=this.$refs.table.$el.getBoundingClientRect();
				var subHeight=70/1000 * window.innerHeight; 
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight; 
				this.getProcdefParamesTemplates();
        	}); 
		}
	}

</script>

<style scoped>

</style>