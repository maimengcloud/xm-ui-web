<template>
	<section class="padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchModules" icon="el-icon-search">查询</el-button>
			<span style="float:right;">
			    <el-button type="primary" @click="showAdd" icon="el-icon-plus" plain> </el-button>
			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" plain></el-button>
		    </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 Module 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问-->
			<el-table ref="moduleTable" :data="modules" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
 				<el-table-column prop="name" label="模块名称" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="cell-text">
                        {{scope.row.name}}
                      </span>
                      <span class="cell-bar">
                            <el-input style="display:inline;" v-model="scope.row.name" placeholder="模块名称" @change="editSomeFields(scope.row,'name',$event)" :maxlength="255"></el-input>
                      </span>
                    </template>
				</el-table-column> 
				<el-table-column prop="billMode" label="计费模式" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope"> 
                        {{ formatDicts(dicts,'moduleBillMode',scope.row.billMode)}}  
                    </template>
				</el-table-column>
				<el-table-column prop="uniFee" label="人均费用" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
						<span v-if="scope.row.billMode==='1'||scope.row.billMode==='3'"> 
							人均￥ {{scope.row.uniFee}} 
						</span>
						<span v-else-if="scope.row.billMode==='2'"> 
							总包￥ {{scope.row.fee}} 
						</span>
						<span v-else> 
							- 
						</span>
                    </template>
				</el-table-column> 
				<!--
				<el-table-column prop="url" label="匹配的url" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="cell-text">
                        {{scope.row.url}}
                      </span>
                      <span class="cell-bar">
                            <el-input style="display:inline;" v-model="scope.row.url" placeholder="匹配的url" @change="editSomeFields(scope.row,'url',$event)" :maxlength="255"></el-input>
                      </span>
                    </template>
				</el-table-column>
				<el-table-column prop="ignoreUrl" label="忽略url" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="cell-text">
                        {{scope.row.ignoreUrl}}
                      </span>
                      <span class="cell-bar">
                            <el-input style="display:inline;" v-model="scope.row.ignoreUrl" placeholder="匹配这个地址的不计费" @change="editSomeFields(scope.row,'ignoreUrl',$event)" :maxlength="255"></el-input>
                      </span>
                    </template>
				</el-table-column>
				-->
				<el-table-column prop="bizFlowState" label="审核状态" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope"> 
                       <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'bizFlowState',scope.row.bizFlowState)" :key="index" :type="item.className">{{item.name}}</el-tag>
                    </template>
				</el-table-column>
				<!--
				<el-table-column prop="procInstId" label="审核流程实例编号" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="cell-text">
                        {{scope.row.procInstId}}
                      </span>
                      <span class="cell-bar">
                            <el-input style="display:inline;" v-model="scope.row.procInstId" placeholder="审核流程实例编号" @change="editSomeFields(scope.row,'procInstId',$event)" :maxlength="50"></el-input>
                      </span>
                    </template>
				</el-table-column>
				-->
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
			<!--编辑 Module 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问界面-->
			<el-drawer title="编辑模块" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <module-edit op-type="edit" :module="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></module-edit>
			</el-drawer>

			<!--新增 Module 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问界面-->
			<el-drawer title="新增模块" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<module-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></module-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
 	import { initDicts,listModule, delModule, batchDelModule,editSomeFieldsModule } from '@/api/mdp/sys/module';
	import  ModuleEdit from './ModuleEdit';//新增修改界面
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'moduleMng',
		components: {
		    ModuleEdit,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchModules()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				modules: [],//查询结果
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
					moduleBillMode:[],
					bizFlowState:[],
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增module界面是否显示
				addForm: {
					id:'',name:'',fee:'',billMode:'',uniFee:'',discount:'',url:'',ignoreUrl:'',bizFlowState:'',procInstId:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				editForm: {
					id:'',name:'',fee:'',billMode:'',uniFee:'',discount:'',url:'',ignoreUrl:'',bizFlowState:'',procInstId:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: { 
			...util,
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getModules();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getModules();
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
				this.getModules();
			},
			searchModules(){
				 this.pageInfo.count=true; 
				 this.getModules();
			},
			//获取列表 Module 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问
			getModules() {
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
				listModule(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.modules = res.data.data;
					}else{
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 Module 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 Module 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getModules();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行module
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除module
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = {  id:row.id };
					delModule(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.searchModules();
						}
						this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除module
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { id:i.id}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelModule(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.searchModules();
						}
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
          editSomeFields(row,fieldName,$event){
            let params={};
            if(this.sels.length>0){
              if(!this.sels.some(k=> k.id==row.id)){
                this.$notify({position:'bottom-left',showClose:true,message:'请编辑选中的行',type:'warning'})
                Object.assign(this.editForm,this.editFormBak)
                return;
              }
                params['ids']=this.sels.map(i=>i.id)
            }else{
                params['ids']=[row].map(i=>i.id)
            }
            params[fieldName]=$event
            var func = editSomeFieldsModule
            func(params).then(res=>{
              let tips = res.data.tips;
              if(tips.isOk){
                if(this.sels.length>0){
                    this.searchModules();
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
				this.searchModules();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.moduleTable.$el)

        	});
		}
	}

</script>

<style scoped>
</style>