<template>
	<section class="page-container padding"> 
		<el-row>
			<el-input style="width:20%;" v-model="filters.key" placeholder="需求名称、评论、评论人姓名模糊搜素" clearable></el-input >&nbsp;&nbsp;<el-input  style="width:20%;" v-model="filters.menuId" placeholder="需求编号查询" clearable></el-input>
			<el-button type="primary" @click="searchXmMenuExchanges">查询</el-button>
			<el-button type="primary" @click="headEditorVisible=true"  v-if="filters.xmMenu">发表需求建议</el-button>
		</el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		 <div style="overflow-x:hidden">
				<menu-user-editor key="head" :id="'head'+filters.xmMenu.menuId" v-if="filters.xmMenu && headEditorVisible" :user="{userid:userInfo.userid,username:userInfo.username,headimgurl:userInfo.headimgurl}" :product-id="filters.xmMenu.productId" :menu-id="filters.xmMenu.menuId" @publish="onPublishContent"></menu-user-editor>
 				<div v-for="(item,i) in xmMenuExchanges" :key="i" class="comment-list clearfix">
					<div class="comment-avater">
						<el-avatar icon="el-icon-user-solid"></el-avatar>
					</div>
					<div class="comment-wrap">
						<div class="comment-head">
							<span>{{item.cusername}}</span> <font style="font-size:12px;color:black;">需求:&nbsp;&nbsp;{{item.menuId}}{{item.menuName}}</font>&nbsp;&nbsp;{{item.ctime}} 
							<el-button type="text" style="font-size:12px;" @click="handleDel(item)"><i class="el-icon-delete-solid"></i>删除</el-button>
							
							
							<el-button  type="text" style="font-size:12px;" @click="showEditor(item,i)"><i class="el-icon-paperclip"></i>引用</el-button>
							<el-button  type="text" style="font-size:12px;" @click="showEditor(item,i)"><i class="el-icon-s-comment"></i>回复</el-button>
							<small>{{item.createTime}}</small>  
						</div> 
						<blockquote v-if="item.pid">
							<div v-html="item.premark"></div>
							<footer>—— {{item.pusername}}</footer>
						</blockquote>
						<div class="comment-content" v-html="item.remark">
							{{item.remark}}
						</div> 
						<menu-user-editor :key="'menu-'+i" :id="'menu-'+item.id" v-show="item.showEditor" :user="{userid:userInfo.userid,username:userInfo.username,headimgurl:userInfo.headimgurl}" :product-id="item.productId" :menu-id="item.menuId" @publish="onPublishContent($event,item)" @close="item.showEditor=false"></menu-user-editor>
					</div>
				</div>
				

			</div> 
		</el-row>
		<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
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
	
	import VueEditor from '@/components/Tinymce/index';

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
					menuId:''
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
				addFormInit: {
					menuId:'',menuName:'',productId:'',remark:'',id:'',pid:'',cuserid:'',cusername:'',ctime:'',cbranchId:'',adopt:'',adoptUserid:'',adoptUsername:'',adoptTime:'',closed:'',puserid:'',pusername:'',premark:'',notifyUserids:'',notifyChannels:'',notifyUsernames:'',cuserHeadImg:'',replyType:''
				},
				editFormVisible: false,//编辑界面是否显示
				//编辑xmMenuExchange界面初始化数据
				editForm: {
					menuId:'',menuName:'',productId:'',remark:'',id:'',pid:'',cuserid:'',cusername:'',ctime:'',cbranchId:'',adopt:'',adoptUserid:'',adoptUsername:'',adoptTime:'',closed:'',puserid:'',pusername:'',premark:'',notifyUserids:'',notifyChannels:'',notifyUsernames:'',cuserHeadImg:'',replyType:''
				},
				xmMenuVisible:false,
				maxTableHeight:300,
				content:'', 
				headEditorVisible:false, 
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
			//获取列表 XmMenuExchange 需求表
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
					params.key=this.filters.key
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
				if(this.filters.menuId){
					params.menuId=this.filters.menuId
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
						var data=res.data.data;
						data.forEach(i=>i.showEditor=false)
						this.xmMenuExchanges = data;
					}else{
						this.$notify({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmMenuExchange 需求表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmMenuExchange 需求表
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
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
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
						this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			showEditor(item,replyType){
				this.editForm=item; 
				
				this.addForm={...this.addFOrmInit}
				this.addForm.replyType=replyType;
				item.showEditor=true; 
			},
			onPublishContent:function(content,item){ 
				 ;
				var params={...this.addForm} 
				params.remark=content; 
				if(item){ 
					params.puserid=item.cuserid
					params.premark=item.remark
					params.pusername=item.cusername
					params.productId=item.productId
					params.menuId=item.menuId
					params.menuName=item.menuName
					params.pid=item.id
				}else if(this.xmMenu){
					params.menuId=this.xmMenu.menuId
					params.productId=this.xmMenu.productId
					params.menuName=this.xmMenu.menuName
				}else{
					if(this.filters.xmMenu){
						params.menuId=this.filters.xmMenu.menuId
						params.productId=this.filters.xmMenu.productId
						params.menuName=this.filters.xmMenu.menuName
					}else{
						
						params.menuId=item.menuId
						params.productId=item.productId
						params.menuName=item.menuName
					}
				} 
				params.cuserid=this.userInfo.userid
				params.cusername=this.userInfo.username
				params.cbranchId=this.userInfo.branchId
				params.cuserHeadImg=this.userInfo.headimgurl 
				
				addXmMenuExchange(params).then(res=>{
					var tips =res.data.tips;
					if(tips.isOk){
						var data=res.data.data;
						data.showEditor=false;
						this.xmMenuExchanges.unshift(data);
						this.editForm.showEditor=false; 
						this.headEditorVisible=false;
					}
					this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error'});
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
			MenuUserEditor,VueEditor
		},
		mounted() { 
			this.$nextTick(() => {
				
				this.maxTableHeight =  util.calcTableMaxHeight(this.$refs.table.$el); 
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