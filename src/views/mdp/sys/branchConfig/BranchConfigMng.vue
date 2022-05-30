<template>
	<section class="page-container border padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchBranchConfigs" icon="el-icon-search">查询</el-button>
			<span style="float:right;">
			    <el-button type="primary" @click="showAdd" icon="el-icon-plus" plain> </el-button>
			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="el-icon-delete" plain></el-button>
		    </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 BranchConfig sys_branch_config-->
			<el-table ref="branchConfigTable" :data="branchConfigs" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="branchId" label="机构编号" min-width="80" show-overflow-tooltip  fixed="left"></el-table-column>
				<el-table-column prop="musers" label="购买用户数" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="cell-text">
                        {{scope.row.musers}}
                      </span>
                      <span class="cell-bar">
                            <el-input-number style="display:inline;" v-model="scope.row.musers" :min="0" :max="200" @change="editSomeFields(scope.row,'musers',$event)"></el-input-number>
                      </span>
                    </template>
				</el-table-column>
				<el-table-column prop="lvl" label="机构等级" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="cell-text">
                        {{scope.row.lvl}}
                      </span>
                      <span class="cell-bar">
                            <el-input style="display:inline;" v-model="scope.row.lvl" placeholder="机构等级" @change="editSomeFields(scope.row,'lvl',$event)" :maxlength="50"></el-input>
                      </span>
                    </template>
				</el-table-column>
				<el-table-column prop="mbidNum" label="可投标次数-每月恢复为套餐数量，包含公司账户次数+个人以组织名义接单的次数，以上每接一单扣减此处" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="cell-text">
                        {{scope.row.mbidNum}}
                      </span>
                      <span class="cell-bar">
                            <el-input-number style="display:inline;" v-model="scope.row.mbidNum" :min="0" :max="200" @change="editSomeFields(scope.row,'mbidNum',$event)"></el-input-number>
                      </span>
                    </template>
				</el-table-column>
				<el-table-column prop="startTime" label="开始日期yyyy-MM-dd" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="cell-text">
                        {{scope.row.startTime}}
                      </span>
                      <span class="cell-bar">
                            <el-input style="display:inline;" v-model="scope.row.startTime" placeholder="开始日期yyyy-MM-dd" @change="editSomeFields(scope.row,'startTime',$event)" :maxlength="10"></el-input>
                      </span>
                    </template>
				</el-table-column>
				<el-table-column prop="endTime" label="结束日期yyyy-MM-dd" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="cell-text">
                        {{scope.row.endTime}}
                      </span>
                      <span class="cell-bar">
                            <el-input style="display:inline;" v-model="scope.row.endTime" placeholder="结束日期yyyy-MM-dd" @change="editSomeFields(scope.row,'endTime',$event)" :maxlength="10"></el-input>
                      </span>
                    </template>
				</el-table-column>
				<el-table-column prop="sfeeRate" label="服务费率，15=15%" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <span class="cell-text">
                        {{scope.row.sfeeRate}}
                      </span>
                      <span class="cell-bar">
                            <el-input-number style="display:inline;" v-model="scope.row.sfeeRate" :min="0" :max="200" @change="editSomeFields(scope.row,'sfeeRate',$event)"></el-input-number>
                      </span>
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
			<!--编辑 BranchConfig sys_branch_config界面-->
			<el-drawer title="编辑sys_branch_config" :visible.sync="editFormVisible"  size="60%"  append-to-body   :close-on-click-modal="false">
				  <branch-config-edit op-type="edit" :branch-config="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit"></branch-config-edit>
			</el-drawer>

			<!--新增 BranchConfig sys_branch_config界面-->
			<el-drawer title="新增sys_branch_config" :visible.sync="addFormVisible"  size="60%"  append-to-body  :close-on-click-modal="false">
				<branch-config-edit op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></branch-config-edit>
			</el-drawer>
	    </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
 	import { initDicts,listBranchConfig, delBranchConfig, batchDelBranchConfig,editSomeFieldsBranchConfig } from '@/api/mdp/sys/branchConfig';
	import  BranchConfigEdit from './BranchConfigEdit';//新增修改界面
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'branchConfigMng',
		components: {
		    BranchConfigEdit,
		},
		props:['visible'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchBranchConfigs()
                }
            }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				branchConfigs: [],//查询结果
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
				addFormVisible: false,//新增branchConfig界面是否显示
				addForm: {
					branchId:'',musers:'',lvl:'',mbidNum:'',startTime:'',endTime:'',sfeeRate:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				editForm: {
					branchId:'',musers:'',lvl:'',mbidNum:'',startTime:'',endTime:'',sfeeRate:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getBranchConfigs();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getBranchConfigs();
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
				this.getBranchConfigs();
			},
			searchBranchConfigs(){
				 this.pageInfo.count=true; 
				 this.getBranchConfigs();
			},
			//获取列表 BranchConfig sys_branch_config
			getBranchConfigs() {
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
				listBranchConfig(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.branchConfigs = res.data.data;
					}else{
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 BranchConfig sys_branch_config
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 BranchConfig sys_branch_config
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getBranchConfigs();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行branchConfig
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除branchConfig
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = {  branchId:row.branchId };
					delBranchConfig(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.searchBranchConfigs();
						}
						this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除branchConfig
			batchDel: function () {
				if(this.sels.length<=0){
				    return;
				}
				var params=this.sels.map(i=>{
				    return { branchId:i.branchId}
				})
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelBranchConfig(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.searchBranchConfigs();
						}
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
          editSomeFields(row,fieldName,$event){
            let params={};
            if(this.sels.length>0){
              if(!this.sels.some(k=> k.branchId==row.branchId)){
                this.$notify({position:'bottom-left',showClose:true,message:'请编辑选中的行',type:'warning'})
                Object.assign(this.editForm,this.editFormBak)
                return;
              }
                params['branchIds']=this.sels.map(i=>i.branchId)
            }else{
                params['branchIds']=[row].map(i=>i.branchId)
            }
            params[fieldName]=$event
            var func = editSomeFieldsBranchConfig
            func(params).then(res=>{
              let tips = res.data.tips;
              if(tips.isOk){
                if(this.sels.length>0){
                    this.searchBranchConfigs();
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
				this.searchBranchConfigs();
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.branchConfigTable.$el)

        	});
		}
	}

</script>

<style scoped>
</style>