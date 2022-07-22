<template>
	<section>
		<el-row> 
			<!--列表 XmQuestionHandle xm_question_handle-->
			<el-table ref="table" :height="tableHeight" :data="xmQuestionHandles" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				
				<el-table-column prop="handleStatus" label="bug状态" width="100" > 
					<template slot-scope="scope"> 
						<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'bugStatus',scope.row.handleStatus)" :key="index" :type="item.className">{{item.name}}</el-tag> 
					</template>
				</el-table-column>  
				<el-table-column prop="receiptMessage" label="处理意见" min-width="150" > 
					<template slot-scope="scope"> 
						<div style="max-height:100px;overflow:auto;" v-html="scope.row.receiptMessage"></div>
					</template> 
				</el-table-column>
				<el-table-column prop="receiptTime" label="时间" width="150" ></el-table-column>  
 			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { listXmQuestionHandle, delXmQuestionHandle, batchDelXmQuestionHandle } from '@/api/xm/core/xmQuestionHandle';
	import { mapGetters } from 'vuex'
	
	export default { 
		props:["bug","visible"],
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		watch:{
			visible(val){
				if(val){
					this.searchXmQuestionHandles();
				}
				
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmQuestionHandles: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['last_update_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
					bugStatus:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmQuestionHandle界面是否显示
				//新增xmQuestionHandle界面初始化数据
				addForm: {
					id:'',handlerUserid:'',handlerUsername:'',handleSolution:'',receiptMessage:'',receiptTime:'',handleStatus:'',bizProcInstId:'',bizFlowState:'',questionId:'',lastUpdateTime:'',createTime:'',actWorkload:'',actCostAmount:'',urls:'',targetUserid:'',targetUsername:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmQuestionHandle界面初始化数据
				editForm: {
					id:'',handlerUserid:'',handlerUsername:'',handleSolution:'',receiptMessage:'',receiptTime:'',handleStatus:'',bizProcInstId:'',bizFlowState:'',questionId:'',lastUpdateTime:'',createTime:'',actWorkload:'',actCostAmount:'',urls:'',targetUserid:'',targetUsername:''
				},
				tableHeight:300,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			...util,
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmQuestionHandles();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmQuestionHandles();
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
				this.getXmQuestionHandles();
			},
			searchXmQuestionHandles(){
				 this.pageInfo.count=true; 
				 this.getXmQuestionHandles();
			},
			//获取列表 XmQuestionHandle xm_question_handle
			getXmQuestionHandles() {
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
				if(this.bug){
					params.questionId=this.bug.id
				}
				this.load.list = true;
				listXmQuestionHandle(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmQuestionHandles = res.data.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmQuestionHandle xm_question_handle
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmQuestionHandle xm_question_handle
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmQuestionHandles();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmQuestionHandle
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmQuestionHandle
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmQuestionHandle(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmQuestionHandles();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmQuestionHandle
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmQuestionHandle(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmQuestionHandles(); 
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
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
		    
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				
			initSimpleDicts('all',[ 'bugStatus' ]).then(res=>{
				if(res.data.tips.isOk){
					 this.dicts=res.data.data
				}
			});
				this.tableHeight = util.calcTableMaxHeight(this.$refs.table.$el); 
				this.getXmQuestionHandles();
        	}); 
		}
	}

</script>

<style scoped>

</style>