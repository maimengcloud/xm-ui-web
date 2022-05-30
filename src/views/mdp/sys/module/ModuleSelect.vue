<template>
	<section class="padding">
		<el-row>
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchModules" icon="el-icon-search">查询</el-button>
			<span style="float:right;" v-if="single!==true">
			    <el-button type="primary" @click="select" > 确认 </el-button> 
		    </span>
		</el-row>
		<el-row class="padding-top">
			<!--列表 Module 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问-->
			<el-table ref="moduleTable" :data="modules" :height="maxTableHeight" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="single!==true"></el-table-column>
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"></el-table-column>
 				<el-table-column prop="name" label="模块名称" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope"> 
                        {{scope.row.name}} 
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
				<el-table-column prop="bizFlowState" label="审核状态" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope"> 
                       <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'bizFlowState',scope.row.bizFlowState)" :key="index" :type="item.className">{{item.name}}</el-tag>
                    </template>
				</el-table-column>  
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
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
		props:['visible','single'],
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

			 
			//选择行module
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			 
			rowClick: function(row, event, column){
			    this.editForm=row
			    this.editFormBak={...row};
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },  
			select(){
				this.$emit("select",this.sels)
			}
			
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