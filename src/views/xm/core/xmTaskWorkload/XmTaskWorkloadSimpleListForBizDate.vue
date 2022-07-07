<template>
	<section> 
		<el-row class="padding-top"> 
			<el-table ref="xmTaskWorkloadTable" :data="xmTaskWorkloads" :row-style="{height:'50px'}"  @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip></el-table-column>
 				<el-table-column prop="username" label="姓名" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="bizDate" label="登记日期" width="120" show-overflow-tooltip></el-table-column>
				<el-table-column prop="workload" label="登记工时" width="120" show-overflow-tooltip></el-table-column>
 				<el-table-column prop="wstatus" label="确认状态" width="120" show-overflow-tooltip>
					 <template slot-scope="scope">
						<div class="cell-text">
							<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'wstatus',scope.row.wstatus)" :key="index" :type="item.className">{{item.name}}</el-tag>
						</div>
						<span class="cell-bar">
							<el-select  v-model="scope.row.wstatus" placeholder="工时状态"  style="display:block;"  @change="editXmTaskWorkloadSomeFields(scope.row,'wstatus',$event)">
								<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.wstatus" :key="index"></el-option>
							</el-select>
						</span>
					 </template>
				 </el-table-column>
 				<el-table-column prop="sstatus" label="结算状态" width="120" show-overflow-tooltip>
					 <template slot-scope="scope">
						<div class="cell-text">
							<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'sstatus',scope.row.sstatus)" :key="index" :type="item.className">{{item.name}}</el-tag>
						</div>
						<span class="cell-bar">
							<el-select  v-model="scope.row.sstatus" placeholder="结算状态"  style="display:block;"  @change="editXmTaskWorkloadSomeFields(scope.row,'sstatus',$event)">
								<el-option :value="item.id" :label="item.name" v-for="(item,index) in dicts.sstatus" :key="index"></el-option>
							</el-select>
						</span>
					 </template>
				 </el-table-column>
				 <el-table-column prop="ttype" label="任务类型" width="80" show-overflow-tooltip>
					 <template slot-scope="scope">
						<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'taskType',scope.row.ttype)" :key="index" :type="item.className">{{item.name}}</el-tag>
					 </template>

				</el-table-column>
				<el-table-column prop="remark" label="备注" width="120" show-overflow-tooltip></el-table-column> 
				<el-table-column prop="taskName" label="任务" width="120" show-overflow-tooltip></el-table-column>
				

			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { listXmTaskWorkload, delXmTaskWorkload, batchDelXmTaskWorkload,editXmTaskWorkloadSomeFields,initDicts } from '@/api/xm/core/xmTaskWorkload';
	import { mapGetters } from 'vuex'

	export default {
	    name:'xmTaskWorkloadSimpleListForBizDate',
		components: {
		},
		props:[ 'visible','wstatus','sstatus','bizDate','projectId','userid','taskId','bizMonth'],
		computed: {
		    ...mapGetters(['userInfo']),

		},
		watch:{
             visible(val){
				if(val){
					this.searchXmTaskWorkloads();
				}
			 }
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmTaskWorkloads: [],//查询结果
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
					taskType:[],
					taskState:[],
					wstatus:[],
					sstatus:[],
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmTaskWorkload界面是否显示
				addForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:''
				},

				editFormVisible: false,//编辑界面是否显示
				editForm: {
					userid:'',username:'',ctime:'',taskId:'',cuserid:'',bizDate:'',wstatus:'',remark:'',ttype:'',id:'',sbillId:'',stime:'',sstatus:'',amt:'',samt:'',workload:''
				},
				maxTableHeight:300,
			}
		},//end data
		methods: {
			...util,
			editXmTaskWorkloadSomeFields(row,fieldName,$event){  
				let params={
				ids:[row.id],
				};
				if(this.sels.length>0){
				if(this.sels.some(k=>k.projectId!=row.projectId)){
					this.$notify({position:'bottom-left',showClose:true,message:'存在不同项目的工时单，请重新选择',type:'warning'})
					return;
				}
				params.ids=this.sels.map(i=>i.id); 
				}else{
				params.ids = [row.id]; 
				params[fieldName]=$event
				}
				var func = editXmTaskWorkloadSomeFields
				if(fieldName==='sbillId'){
				func = editWorkloadToSbill
				params.sbillId=$event.id
				}else{ 
				params[fieldName]=$event
				}
				func(params).then(res=>{
				let tips = res.data.tips; 
				this.getXmTaskWorkloads();
				if(tips.isOk){
					this.$emit("edit-some-fields",params)
				}else{
					this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
				}
				})
			},  
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.getXmTaskWorkloads();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmTaskWorkloads();
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
				this.getXmTaskWorkloads();
			},
			searchXmTaskWorkloads(){
				 this.pageInfo.count=true;
				 this.getXmTaskWorkloads();
			},
			//获取列表 XmTaskWorkload 工时登记表
			getXmTaskWorkloads() {
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

				if(this.projectId){
					params.projectId=this.projectId
				}
				
				if(this.taskId){
					params.taskId=this.taskId
				}
				if(this.userid){
					params.userid=this.userid
				}

				if(this.wstatus){
					params.wstatus=this.wstatus
				}
				if(this.sstatus){
					params.sstatus=this.sstatus
				}

				if(this.bizMonth){
					params.bizMonth=this.bizMonth
				}
				
				if(this.bizDate){
					params.bizDate=this.bizDate
				}
				this.load.list = true;
				listXmTaskWorkload(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmTaskWorkloads = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmTaskWorkload 工时登记表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmTaskWorkload 工时登记表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmTaskWorkloads();
				this.$emit('submit',this.editForm)
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.$emit('submit',this.editForm)
			},
			//选择行xmTaskWorkload
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除xmTaskWorkload
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = {  id:row.id };
					delXmTaskWorkload(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.getXmTaskWorkloads();
							this.$emit('submit',this.editForm)
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmTaskWorkload
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
					batchDelXmTaskWorkload(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.getXmTaskWorkloads();
							this.$emit('submit')
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
			    this.editForm=row
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){

            },

		},//end methods
		mounted() {
			this.$nextTick(() => { 
				initDicts(this); 
				this.initData() 
				this.searchXmTaskWorkloads(); 
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.xmTaskWorkloadTable.$el)

        	});
		}
	}

</script>

<style scoped>
	.label {
		font-family: 黑体; 
	}
</style>
