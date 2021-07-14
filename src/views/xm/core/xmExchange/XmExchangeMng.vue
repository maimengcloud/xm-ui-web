<template>
	<section> 
		<el-row class="page-main page-main-height">
		 <div style="overflow-x:hidden">
				<task-user-editor :id="'head'"  :user="{userid:userInfo.userid,username:userInfo.username,headimgurl:userInfo.headimgurl}" :project-id="xmTask.projectId" :task-id="xmTask.taskId" @publish="onPublishContent"></task-user-editor>
				<div v-for="(item,i) in xmExchanges" :key="i" class="comment-list clearfix">
					<div class="comment-avater">
						<el-avatar icon="el-icon-user-solid"></el-avatar>
					</div>
					<div class="comment-wrap">
						<div class="comment-head">
							<span>{{item.cusername}}</span>
							<el-button slot="reference" size="mini" type="text" style="font-size:12px;" @click="handleDel(item)"><i class="el-icon-delete-solid"></i>删除</el-button>
							<el-popover
								placement="bottom"
								trigger="click">
								<task-user-editor :id="'userquote'+i" :user="{userid:item.cuserid,username:item.cusername,headimgurl:item.cuserHeadImg}" :project-id="xmTask.projectId" :task-id="xmTask.taskId" @publish="onPublishContent($event,item)"></task-user-editor>
								<el-button slot="reference" size="mini" type="text" style="font-size:12px;"><i class="el-icon-paperclip"></i>引用</el-button>
							</el-popover>
							<el-popover
								placement="bottom"
								trigger="click">
								<task-user-editor :id="'userreply'+i" :user="{userid:item.cuserid,username:item.cusername,headimgurl:item.cuserHeadImg}" :project-id="xmTask.projectId" :task-id="xmTask.taskId" @publish="onPublishContent($event,item)"></task-user-editor>
								<el-button slot="reference" size="mini" type="text" style="font-size:12px;"><i class="el-icon-s-comment"></i>回复</el-button>
							</el-popover>
							<small>{{item.createTime}}</small>
						</div>

						<blockquote v-if="item.pid">
							<div v-html="item.premark"></div>
							<footer>—— {{item.pcusername+' '+item.ctime}}</footer>
						</blockquote>
						<div class="comment-content" v-html="item.remark">
							{{item.remark}}
						</div> 
					</div>
				</div>
			</div>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmExchange, delXmExchange, batchDelXmExchange,addXmExchange } from '@/api/xm/core/xmExchange'; 
	import TaskUserEditor from './TaskUserEditor'
	import { mapGetters } from 'vuex'
	import {sn} from '@/common/js/sequence';

	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmTask'],
		watch:{
			xmTask:function(xmTask){
				this.searchXmExchanges();
			}
		},
		data() {
			return {
				filters: {
					key: ''
				},
				xmExchanges: [],//查询结果
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
				
				addFormVisible: false,//新增xmExchange界面是否显示
				//新增xmExchange界面初始化数据
				addForm: {
					taskId:'',taskName:'',projectId:'',remark:'',id:'',pid:'',cuserid:'',cusername:'',ctime:'',cbranchId:'',adopt:'',adoptUserid:'',adoptUsername:'',adoptTime:'',closed:'',puserid:'',pusername:'',premark:'',notifyUserids:'',notifyChannels:'',notifyUsernames:'',cuserHeadImg:'',replyType:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmExchange界面初始化数据
				editForm: {
					taskId:'',taskName:'',projectId:'',remark:'',id:'',pid:'',cuserid:'',cusername:'',ctime:'',cbranchId:'',adopt:'',adoptUserid:'',adoptUsername:'',adoptTime:'',closed:'',puserid:'',pusername:'',premark:'',notifyUserids:'',notifyChannels:'',notifyUsernames:'',cuserHeadImg:'',replyType:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmExchanges();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmExchanges();
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
				this.getXmExchanges();
			},
			searchXmExchanges(){
				 this.pageInfo.count=true; 
				 this.getXmExchanges();
			},
			//获取列表 XmExchange 故事表
			getXmExchanges() {
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
				params.taskId=this.xmTask.id
				params.projectId=this.xmTask.projectId
				this.load.list = true;
				listXmExchange(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmExchanges = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmExchange 故事表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmExchange 故事表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmExchanges();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmExchange
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmExchange
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmExchange(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmExchanges();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmExchange
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmExchange(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmExchanges(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			
			onPublishContent:function(editor,parentXmExchange){
				var params={};
				params.remark=editor.content;
				params.id=sn()
				params.taskId=this.xmTask.id
				params.projectId=this.xmTask.projectId
				params.taskName=this.xmTask.name
				
				params.cuserid=this.userInfo.userid
				params.cusername=this.userInfo.username
				params.cbranchId=this.userInfo.branchId
				params.cuserHeadImg=this.userInfo.headimgurl
				if(parentXmExchange){
					params.pid=parentXmExchange.id
					params.premark=parentXmExchange.remark
					params.pcuserid=parentXmExchange.cuserid
					params.pcusername=parentXmExchange.cusername
				}
				
				addXmExchange(params).then(res=>{
					var tips =res.data.tips;
					if(tips.isOk){
						this.xmExchanges.push(params);
					}
					this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
				})
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {  
			//在下面添加其它组件
			TaskUserEditor,
		},
		mounted() { 
			this.$nextTick(() => {
				this.getXmExchanges();
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

.comment-list{
	border-bottom: 1px solid #dcdcdc;
	padding: 0 15px 10px 60px;
	margin-top: 15px;
	position: relative;
}
.comment-avater{
	position: absolute;
	left: 10px;
	top: 0;
}
/* .toolbar{
	float: right;
	margin: .25rem 0;
} */
.comment-head{
	font-size: 12px;
	margin-bottom: 6px;
	line-height: 29px;
	text-align: right;
	color: #00abfc!important;
}
.comment-head span:first-child{
	float: left;
	font-size: 15px;
}
.comment-head .el-button--text{
	color: #606266;
}
.comment-head .el-button--text:hover {
	color: #66b1ff;
}
.comment-head .el-button--text:active {
	color: #3a8ee6;
}
.comment-wrap blockquote{
	margin: 0 0 1rem;
	background-color: #f7f7f7;
	border-left: 4px solid #eceeef;
	font-size: 14px;
	padding: 10px 20px;
}
.comment-wrap footer{
	margin-top: 5px;
	color: #818a91;
	font-size: 12px;
}

.clearfix::after {
	clear: both;
	content: "";
}
</style>