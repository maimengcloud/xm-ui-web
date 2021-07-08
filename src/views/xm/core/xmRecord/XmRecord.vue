<template>
	<section>
		<el-row class="app-container" v-if="!simple">
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			  <el-radio v-model="filters.objType" v-for="i in objTypeOptions" :label="i.key" :key="i.key">{{i.name}}</el-radio>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchXmRecords">查询</el-button>  
		</el-row>
		<el-row class="app-container"> 
			<!--列表 XmRecord xm_record-->
			<el-table ref="table" :height="tableHeight" :data="xmRecords" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="index" width="40"></el-table-column>
				<el-table-column prop="projectId" label="项目编号" v-if="!simple" min-width="80" ></el-table-column>  
				<el-table-column prop="taskId" label="对象主键编号" v-if="!simple" min-width="80" ></el-table-column> 
				<el-table-column prop="operUsername" label="操作人名字" min-width="80" ></el-table-column>
				<el-table-column prop="operTime" label="操作时间" min-width="80" ></el-table-column>
				<el-table-column prop="objType" label="对象类型" min-width="80" :formatter="formatObjType"></el-table-column>
				<el-table-column prop="action" label="操作" min-width="80"></el-table-column> 
				<el-table-column prop="remarks" label="备注" min-width="80" ></el-table-column>  
				<el-table-column type="expand">
					<template slot-scope="props">
						<el-form label-position="left"  inline class="demo-table-expand">    
							<el-form-item label="历史值" prop="oldValue">
								{{props.row.oldValue}}
							</el-form-item> 
							<el-form-item label="新值" prop="newValue">
								{{props.row.newValue}}
							</el-form-item>  
							<el-form-item label="对象主键编号" prop="taskId">
								{{props.row.taskId}}
							</el-form-item> 
							<el-form-item label="请求编号，用于跟踪日志" prop="reqNo">
								{{props.row.reqNo}}
							</el-form-item> 
							<el-form-item label="机构编号" prop="branchId">
								{{props.row.branchId}}
							</el-form-item> 
							<el-form-item label="ip地址" prop="ip">
								{{props.row.ip}}
							</el-form-item> 
						</el-form>
					</template>
				</el-table-column> 
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmRecord, delXmRecord, batchDelXmRecord } from '@/api/xm/core/xmRecord'; 
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:["projectId","objType","objId","simple" ,"visible"],
		watch:{ 
			visible:function(visible){
				if( visible ==true ){ 
					this.getXmRecords();
				}
			}
		},
		data() {
			return {
				filters: {
					key: '',
					objType:'',
				},
				xmRecords: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:["oper_time"],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:["desc"]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmRecord界面是否显示
				//新增xmRecord界面初始化数据
				addForm: {
					id:'',projectId:'',operUserid:'',operUsername:'',operTime:'',objType:'',action:'',oldValue:'',newValue:'',remarks:'',taskId:'',reqNo:'',branchId:'',ip:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmRecord界面初始化数据
				editForm: {
					id:'',projectId:'',operUserid:'',operUsername:'',operTime:'',objType:'',action:'',oldValue:'',newValue:'',remarks:'',taskId:'',reqNo:'',branchId:'',ip:''
				},
				tableHeight:300,
				/**begin 自定义属性请在下面加 请加备注**/
				objTypeOptions: [{key:"all",name:"全部"},{key:"task",name:"任务"},{"key":"project" ,name:"项目"},{key:"budget",name:"预算"},{key:"cost",name:"成本"},{key:"phase",name:"阶段计划"},{"key":"group",name:"团队"}]
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmRecords();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmRecords();
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
				this.getXmRecords();
			},
			searchXmRecords(){
				 this.pageInfo.count=true; 
				 this.getXmRecords();
			},
			//获取列表 XmRecord xm_record
			getXmRecords() {
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
				if(this.filters.objType!=="" && this.filters.objType!=="all"){
					 params.objType=this.filters.objType
				} 
				if(this.projectId){
					params.projectId=this.projectId;
				} 
				if(this.objId){
					params.taskId=this.objId;
				} 
				this.load.list = true;
				listXmRecord(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmRecords = res.data.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmRecord xm_record
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmRecord xm_record
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmRecords();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmRecord
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmRecord
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmRecord(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmRecords();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmRecord
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmRecord(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmRecords(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			formatObjType: function(row,column,cellValue){
				var items=this.objTypeOptions.filter(i=>{
					return i.key==cellValue
				});
				if(items && items.length>0){
					return items[0].name
				}else{
					return cellValue;
				}
			}
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {  
		    
		    //在下面添加其它组件
		},
		mounted() { 
			if(this.objType){
				this.filters.objType=this.objType
			}
			
			this.$nextTick(() => {
				var clientRect=this.$refs.table.$el.getBoundingClientRect();
				var subHeight=50/1000 * window.innerHeight; 
				
				if(this.projectId){
					subHeight=100/1000 * window.innerHeight;
				}
				this.tableHeight =  window.innerHeight -clientRect.y - this.$refs.table.$el.offsetTop-subHeight; 
				this.getXmRecords();
        	}); 
		}
	}

</script>

<style scoped>
</style>