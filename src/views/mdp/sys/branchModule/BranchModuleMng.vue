<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模块名、机构名模糊查询"></el-input>
			<el-input v-model="filters.moduleId" style="width: 20%;" placeholder="模块编号"></el-input>
			<el-input v-model="filters.branchId" style="width: 20%;" placeholder="机构编号"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchBranchModules" icon="el-icon-search">查询</el-button>
			<span style="float:right;">
			    <el-button type="primary" @click="showAdd" icon="el-icon-plus" plain> </el-button>
			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" plain></el-button>
		    </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 BranchModule 管理端机构表（机构下面若干部门）-->
			<el-table ref="branchModuleTable" :data="branchModules" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="branchId" label="机构编号" min-width="80" show-overflow-tooltip  fixed="left"></el-table-column>	
				<el-table-column prop="moduleId" label="模块编号" min-width="80" show-overflow-tooltip  fixed="left"></el-table-column> 
				<el-table-column prop="status" label="状态" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope"> 
                        <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'status',scope.row.status)" :key="index" :type="item.className">{{item.name}}</el-tag>
                    </template>
				</el-table-column>
				<el-table-column prop="startTime" label="启用日期" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope"> 
                        {{scope.row.startTime}} 
                    </template>
				</el-table-column>
				<el-table-column prop="endTime" label="结束日期" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope"> 
                        {{scope.row.endTime}} 
					</template>
				</el-table-column>
				<el-table-column prop="ctime" label="购买日期" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope"> 
                        {{scope.row.ctime}} 
                    </template>
				</el-table-column> 
				<el-table-column prop="cusername" label="客户姓名" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope"> 
                        {{scope.row.cusername}} 
                    </template>
				</el-table-column> 
				<el-table-column prop="musers" label="购买用户数" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope"> 
                        {{scope.row.musers}} 
                    </template>
				</el-table-column>
				<el-table-column prop="mbidNum" label="可投标次数" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope"> 
                        {{scope.row.mbidNum}} 
                    </template>
				</el-table-column>
				<el-table-column prop="sfeeRate" label="服务费率" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope"> 
                        {{scope.row.sfeeRate}} 
                    </template>
				</el-table-column>
				<el-table-column prop="ver" label="购买版本" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope"> 
                        {{scope.row.ver}} 
                    </template>
				</el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
					<template scope="scope">
						<el-button type="primary" @click="showEdit( scope.row,scope.$index)" icon="el-icon-edit"  plain></el-button>
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete"  plain></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
		<el-row>
			<!--编辑 BranchModule 管理端机构表（机构下面若干部门）界面-->
			<el-drawer title="编辑" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <branch-module-edit op-type="edit" :branch-module="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></branch-module-edit>
			</el-drawer>

			<!--新增 BranchModule 管理端机构表（机构下面若干部门）界面-->
			<el-drawer title="新增" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<branch-module-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></branch-module-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
 	import { initDicts,listBranchModule, delBranchModule, batchDelBranchModule,editSomeFieldsBranchModule } from '@/api/mdp/sys/branchModule';
	import  BranchModuleEdit from './BranchModuleEdit';//新增修改界面
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'branchModuleMng',
		components: {
		    BranchModuleEdit,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchBranchModules()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				branchModules: [],//查询结果
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
				dicts:{
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增branchModule界面是否显示
				addForm: {
					branchId:'',moduleId:'',startTime:'',endTime:'',ctime:'',ltime:'',cuserid:'',cusername:'',luserid:'',lusername:'',status:'',musers:'',mbidNum:'',sfeeRate:'',ver:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				editForm: {
					branchId:'',moduleId:'',startTime:'',endTime:'',ctime:'',ltime:'',cuserid:'',cusername:'',luserid:'',lusername:'',status:'',musers:'',mbidNum:'',sfeeRate:'',ver:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: { 
			...util,
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getBranchModules();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getBranchModules();
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
				this.getBranchModules();
			},
			searchBranchModules(){
				 this.pageInfo.count=true; 
				 this.getBranchModules();
			},
			//获取列表 BranchModule 管理端机构表（机构下面若干部门）
			getBranchModules() {
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
					params.key=this.filters.key
				}

				this.load.list = true;
				listBranchModule(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.branchModules = res.data.data;
					}else{
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 BranchModule 管理端机构表（机构下面若干部门）
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 BranchModule 管理端机构表（机构下面若干部门）
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.searchBranchModules();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.searchBranchModules();
				
			},
			//选择行branchModule
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除branchModule
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = {  branchId:row.branchId,  moduleId:row.moduleId };
					delBranchModule(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.searchBranchModules();
						}
						this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除branchModule
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { branchId:i.branchId,  moduleId:i.moduleId}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelBranchModule(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.searchBranchModules();
						}
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
          editSomeFields(row,fieldName,$event){
            let params={};
            if(this.sels.length>0){
              if(!this.sels.some(k=> k.branchId==row.branchId &&  k.moduleId==row.moduleId)){
                this.$notify({position:'bottom-left',showClose:true,message:'请编辑选中的行',type:'warning'})
                Object.assign(this.editForm,this.editFormBak)
                return;
              }
                params['pkList']=this.sels.map(i=>{ return { branchId:i.branchId,  moduleId:i.moduleId}})
            }else{
                params['pkList']=[row].map(i=>{ return { branchId:i.branchId,  moduleId:i.moduleId}})
            }
            params[fieldName]=$event
            var func = editSomeFieldsBranchModule
            func(params).then(res=>{
              let tips = res.data.tips;
              if(tips.isOk){
                if(this.sels.length>0){
                    this.searchBranchModules();
                }
                this.editFormBak=[...this.editForm]
              }else{
                Object.assign(this.editForm,this.editFormBak)
                this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
              }
            }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
          },
			rowClick: function(row, event, column){
			    this.editForm=row
			    this.editFormBak={...row};
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },
			
		},//end methods
		mounted() {
			this.$nextTick(() => {
			    initDicts(this);
			    this.initData()
				this.searchBranchModules();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.branchModuleTable.$el)

        	});
		}
	}

</script>

<style scoped>
</style>