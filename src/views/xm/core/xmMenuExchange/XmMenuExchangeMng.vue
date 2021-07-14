<template>
	<section>
		<el-row  class="app-container" v-if="xmMenu && !simple">
			 <h1>{{xmMenu.menuName}}</h1> 
			<el-divider></el-divider> 
			<div v-html="xmMenu.remark"></div>
			<el-divider></el-divider> 
		</el-row>
		<el-row  class="app-container" v-if="!xmMenu && !simple">
			 <h1 v-if="filters.xmMenu">{{filters.xmMenu.menuName}}</h1> <el-button @click="showSelectMenu">选择用户故事</el-button>
			<el-divider v-if="filters.xmMenu"></el-divider> 
			<div v-if="filters.xmMenu" v-html="filters.xmMenu.remark"></div>
			<el-divider></el-divider> 
		</el-row>
		
		<el-row class="app-container">
		 <div style="overflow-x:hidden">
				<menu-user-editor :id="'head'+filters.xmMenu.menuId" v-if="filters.xmMenu" :user="{userid:userInfo.userid,username:userInfo.username,headimgurl:userInfo.headimgurl}" :product-id="filters.xmMenu.productId" :menu-id="filters.xmMenu.menuId" @publish="onPublishContent"></menu-user-editor>
				<div v-for="(item,i) in xmMenuExchanges" :key="i" class="comment-list clearfix">
					<div class="comment-avater">
						<el-avatar icon="el-icon-user-solid"></el-avatar>
					</div>
					<div class="comment-wrap">
						<div class="comment-head">
							<span>{{item.cusername}}</span> {{item.ctime}}
							<el-button slot="reference" size="mini" type="text" style="font-size:12px;" @click="handleDel(item)"><i class="el-icon-delete-solid"></i>删除</el-button>
							<el-popover
								placement="bottom"
								trigger="click">
								<menu-user-editor :id="'userquote'+i+item.id" :user="{userid:item.cuserid,username:item.cusername,headimgurl:item.cuserHeadImg}" :product-id="item.productId" :menu-id="item.menuId" @publish="onPublishContent($event,item)"></menu-user-editor>
								<el-button slot="reference" size="mini" type="text" style="font-size:12px;"><i class="el-icon-paperclip"></i>引用</el-button>
							</el-popover>
							<el-popover
								placement="bottom"
								trigger="click">
								<menu-user-editor :id="'userreply'+i+item.id" :user="{userid:item.cuserid,username:item.cusername,headimgurl:item.cuserHeadImg}" :product-id="item.productId" :menu-id="item.menuId" @publish="onPublishContent($event,item)"></menu-user-editor>
								<el-button slot="reference" size="mini" type="text" style="font-size:12px;"><i class="el-icon-s-comment"></i>回复</el-button>
							</el-popover>
							<small>{{item.createTime}}</small>
						</div>

						<blockquote v-if="item.pid">
							<div v-html="item.premark"></div>
							<footer>—— {{item.pusername}}</footer>
						</blockquote>
						<div class="comment-content" v-html="item.remark">
							{{item.remark}}
						</div> 
					</div>
				</div>
				<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 

			</div>
			
		<el-drawer append-to-body title="故事选择" :visible.sync="xmMenuVisible" fullscreen   :close-on-click-modal="false">
			<xm-menu-select :is-select-menu="true"  @selected="onMenuSelected"></xm-menu-select>
		</el-drawer>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库 
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listXmMenuExchange, delXmMenuExchange, batchDelXmMenuExchange,addXmMenuExchange } from '@/api/xm/core/xmMenuExchange'; 
	import MenuUserEditor from './MenuUserEditor'
	import { mapGetters } from 'vuex'
	import {sn} from '@/common/js/sequence';
	import XmMenuSelect from '../xmMenu/XmMenuSelect'

	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmMenu','simple'],
		watch:{
			xmMenu:function(xmMenu){
				this.filters.xmMenu=xmMenu
				this.searchXmMenuExchanges();
			}
		},
		data() {
			return {
				filters: {
					key: '',
					xmMenu:null,
				},
				xmMenuExchanges: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['res.ctime'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				options:{
					//sex:[],
				},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增xmMenuExchange界面是否显示
				//新增xmMenuExchange界面初始化数据
				addForm: {
					menuId:'',menuName:'',productId:'',remark:'',id:'',pid:'',cuserid:'',cusername:'',ctime:'',cbranchId:'',adopt:'',adoptUserid:'',adoptUsername:'',adoptTime:'',closed:'',puserid:'',pusername:'',premark:'',notifyUserids:'',notifyChannels:'',notifyUsernames:'',cuserHeadImg:'',replyType:''
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑xmMenuExchange界面初始化数据
				editForm: {
					menuId:'',menuName:'',productId:'',remark:'',id:'',pid:'',cuserid:'',cusername:'',ctime:'',cbranchId:'',adopt:'',adoptUserid:'',adoptUsername:'',adoptTime:'',closed:'',puserid:'',pusername:'',premark:'',notifyUserids:'',notifyChannels:'',notifyUsernames:'',cuserHeadImg:'',replyType:''
				},
				xmMenuVisible:false,
				tableHeight:300,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getXmMenuExchanges();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getXmMenuExchanges();
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
				this.getXmMenuExchanges();
			},
			searchXmMenuExchanges(){
				 this.pageInfo.count=true; 
				 this.getXmMenuExchanges();
			},
			//获取列表 XmMenuExchange 故事表
			getXmMenuExchanges() {
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
				if(this.xmMenu){
					params.menuId=this.xmMenu.menuId

				}else{
					if(this.filters.xmMenu){
						params.menuId=this.filters.xmMenu.menuId
					}
					
				}
				if(!params.menuId){
					params.branchId=this.userInfo.branchId
				}
				this.load.list = true;
				listXmMenuExchange(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.xmMenuExchanges = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmMenuExchange 故事表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmMenuExchange 故事表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmMenuExchanges();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行xmMenuExchange
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除xmMenuExchange
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = { id: row.id };
					delXmMenuExchange(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getXmMenuExchanges();
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmMenuExchange
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelXmMenuExchange(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getXmMenuExchanges(); 
						}
						this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			
			onPublishContent:function(editor,parentXmMenuExchange){
				
				var params={};
				params.remark=editor.content;

				if(!parentXmMenuExchange && !this.xmMenu && !this.filters.xmMenu){
					this.$message.error("请选择用户故事再发表评论")
					return;
				}
				params.id=sn()
				if(this.xmMenu){
					params.menuId=this.xmMenu.menuId
					params.productId=this.xmMenu.productId
					params.menuName=this.xmMenu.menuName
				}else{
					if(this.filters.xmMenu){
						params.menuId=this.filters.xmMenu.menuId
						params.productId=this.filters.xmMenu.productId
						params.menuName=this.filters.xmMenu.menuName
					}else{
						
						params.menuId=parentXmMenuExchange.menuId
						params.productId=parentXmMenuExchange.productId
						params.menuName=parentXmMenuExchange.menuName
					}
				}
				
				
				params.cuserid=this.userInfo.userid
				params.cusername=this.userInfo.username
				params.cbranchId=this.userInfo.branchId
				params.cuserHeadImg=this.userInfo.headimgurl
				if(parentXmMenuExchange){
					params.pid=parentXmMenuExchange.id
					params.premark=parentXmMenuExchange.remark
					params.puserid=parentXmMenuExchange.cuserid
					params.pusername=parentXmMenuExchange.cusername
				}
				
				addXmMenuExchange(params).then(res=>{
					var tips =res.data.tips;
					if(tips.isOk){
						this.xmMenuExchanges.unshift(res.data.data);
					}
					this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
				})
			},
			/**end 自定义函数请在上面加**/
			showSelectMenu(){
				this.xmMenuVisible=true;
			},
			onMenuSelected(menu){
				this.filters.xmMenu=menu
				this.xmMenuVisible=false
				this.getXmMenuExchanges()
			}
			
		},//end methods
		components: {  
			//在下面添加其它组件
			MenuUserEditor,XmMenuSelect
		},
		mounted() { 
			this.$nextTick(() => {
				this.filters.xmMenu=this.xmMenu
				this.getXmMenuExchanges();
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
h1 {
	text-align: center;
}
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