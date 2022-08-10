<template>
	<section>  
 
 					<el-row class="padding">
						<el-row>   
							<el-input v-model="filters.key" style="width:20%;"  clearable  placeholder="按 标题 摘要 作者 模糊查询"> 
							</el-input> 
							<!--
							<el-select v-if="!archiveType" v-model="filters.categoryType"  placeholder="请选择主题" clearable>
									<el-option v-for="(it,index) in dicts.categoryType" :key="index" :value="it.id" :label="it.name">
									</el-option>
							</el-select>
							-->
							<el-button type="primary"   v-loading="load.list" v-on:click="searchArchives" icon="el-icon-search"> </el-button> 
  							<el-button type="primary"   @click="showAdd">新增</el-button> 
							<!--把记录变为取消发布 ，就是把状态变为2 并把ArchiveCategory删除对应的记录-->
							<el-button    v-loading="load.unPublish"  @click="unPublishArchive" :disabled="this.sels.length===0" icon="el-icon-download">下架</el-button>
							<el-popover
								placement="top-start"
								title=""
								width="500"
								v-model="moreVisible"
								trigger="manual" >
								<el-row> 
									<el-col :span="24" style="padding-top:5px;">
										
									</el-col>
									<el-col  :span="24"  style="padding-top:5px;"> 
										<el-input  v-if="filters.queryScope=='iterationId'" size="mini" v-model="filters.id" style="width:100%;"  placeholder="输入产品编号" @keyup.enter.native="searchXmProducts">  
										</el-input> 
									</el-col>
									<el-checkbox v-model="filters.isMy" true-label="1" false-label="">我创建的</el-checkbox>

									<el-col :span="24"  style="padding-top:5px;">
										<font class="more-label-font">创建日期:</font>
										<mdp-date-range
											v-model="filters"
											type="daterange" 
											unlink-panels
											start-key="fromStartTime"
											end-key="toStartTime"
											range-separator="至"
											start-placeholder="创建日期"
											end-placeholder="创建日期" 
											:auto-default="false" >
										</mdp-date-range>  
									</el-col> 
									<el-col :span="24" style="padding-top:5px;">
										<el-button size="mini" type="primary" icon="el-icon-search" @click="searchArchives">查询</el-button>
										<el-button size="mini"      @click="moreVisible=false"  icon="el-icon-close">关闭窗口</el-button>
 									</el-col>
									<el-col :span="24" style="padding-top:5px;"> 
										<el-button size="mini"   v-loading="load.close"  @click="closeArchiveComment" :disabled="this.sels.length===0" icon="el-icon-close">关闭评论</el-button>
										<el-button  size="mini"  v-loading="load.open"  @click="openArchiveComment" :disabled="this.sels.length===0" icon="el-icon-open">打开评论</el-button>
										<el-button size="mini" type="danger"  v-loading="load.del"  @click="batchDel" :disabled="this.sels.length===0" icon="el-icon-delete"></el-button>
									</el-col>
								</el-row>
								<el-button  slot="reference" icon="el-icon-more" circle @click="moreVisible=!moreVisible"></el-button>
							</el-popover>
						</el-row>
						<el-row>  
							<font v-if="filters.tags">
							<el-tag  
								:key="tag.tagId"
								v-for="tag in filters.tags"
								:type="''"
								closable
								:disable-transitions="false"
								@close="handleFiltersTagClose(tag,'tags')">
								{{tag.tagName}}
							</el-tag>
							</font> 
						</el-row>
						<el-row>
						<!--列表 Archive 档案信息表-->
						<el-table :data="archives" ref="table" :max-height="tableHeight"  highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick">
							<el-table-column type="selection" width="40"></el-table-column>
							<el-table-column type="index" width="40"></el-table-column>
							<el-table-column prop="archiveType" label="主题" width="100">
								<template slot-scope="scope">
								 <el-tag v-for="(item,index) in formatDictsWithClass(dicts,'categoryType',scope.row.archiveType)" :key="index" :type="item.className">{{item.name}}</el-tag>
								</template>
							</el-table-column>
							<el-table-column prop="archiveTitle" label="标题" min-width="150" show-overflow-tooltip>
								<template slot-scope="scope">
									<el-link type='primary' @click="showEdit( scope.row,scope.$index)">{{scope.row.archiveTitle}}</el-link>
								</template>
							</el-table-column>
							<el-table-column prop="authorName" label="作者" min-width="80" show-overflow-tooltip></el-table-column> 
							<el-table-column prop="status" label="状态" min-width="80" show-overflow-tooltip>
								<template slot-scope="scope">
									<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'archiveStatus',scope.row.status)" :key="index" :type="item.className">{{item.name}}</el-tag>
								</template>
							</el-table-column>
							<!-- <el-table-column prop="categoryId" label="分类" min-width="80" show-overflow-tooltip :formatter="formatterCategoryid"></el-table-column> -->
							<el-table-column prop="tagNames" label="标签" min-width="80" show-overflow-tooltip></el-table-column> 
							<el-table-column prop="seqNo" label="排序" min-width="80" show-overflow-tooltip></el-table-column> 
							<el-table-column prop="canComment" label="打开评论" min-width="80" show-overflow-tooltip>
								<template slot-scope="scope">
									<el-tag type="info" v-if="scope.row.canComment=='1'">√</el-tag>
									<el-tag type="info" v-else>×</el-tag>
								</template>
							</el-table-column>
							
							<el-table-column prop="isMain" label="是否置顶" min-width="80" show-overflow-tooltip>
								<template slot-scope="scope">
									<el-tag type="info" v-if="scope.row.isMain=='1'">√</el-tag>
									<el-tag type="info" v-else>×</el-tag>
								</template>
							</el-table-column>
							
							<el-table-column prop="isHot" label="推荐" min-width="80" show-overflow-tooltip>
								<template slot-scope="scope">
									<el-tag type="info" v-if="scope.row.isHot=='1'">√</el-tag>
									<el-tag type="info" v-else>×</el-tag>
								</template>
							</el-table-column>
							<!--<el-table-column prop="deptid" label="创建部门" min-width="80" show-overflow-tooltip></el-table-column>-->
							
							<!--
							<el-table-column prop="isShare" label="是否共享" min-width="80" show-overflow-tooltip  :formatter="formatterYesOrNo"></el-table-column>
							<el-table-column prop="encryptType" label="加密类型" min-width="80" show-overflow-tooltip  :formatter="formatterEncryptType"></el-table-column>
							<el-table-column prop="archiveContext" label="内容" min-width="80" show-overflow-tooltip></el-table-column>
							<el-table-column prop="url" label="访问路径" min-width="80" show-overflow-tooltip></el-table-column>
							<el-table-column prop="createDate" label="创建日期" min-width="80" show-overflow-tooltip></el-table-column>
							<el-table-column prop="archivingUserid" label="归档人" min-width="80" show-overflow-tooltip></el-table-column>
							<el-table-column prop="archivingDate" label="归档日期" min-width="80" show-overflow-tooltip></el-table-column>
							-->
							<el-table-column label="操作" width="200"  fixed="right" show-overflow-tooltip>
								<template slot-scope="scope"> 
									<el-button type="text" @click="showDetail( scope.row,scope.$index)">预览</el-button>
 									<el-button type="text"  @click="handleDel(scope.row,scope.$index)" icon="el-icon-delete" circle></el-button> 
									<el-button class="copyBtn" :data-clipboard-text = "arcBasePath+'/arc/archive/showArchive?id='+scope.row.id" type="text">复制地址</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination  layout="total, sizes, prev, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
						</el-row>
					</el-row> 
			<!--编辑 Archive 档案信息表界面-->
			<el-dialog title="编辑文章" :visible.sync="editFormVisible" :modal="false"  fullscreen  :close-on-click-modal="false"  append-to-body>
				  <archive-edit v-if="editFormVisible" :op-type="'edit'" style="margin-top:-20px;" :archive="editForm" :archive-type="archiveType" :visible="editFormVisible" :category-name="categoryTree.selected.name" @cancel="editFormVisible=false" @submit="afterEditSubmit" @edit-some-fields="onEditSomeFields"></archive-edit>
			</el-dialog> 
	
			<!--新增 Archive 档案信息表界面-->
			<el-dialog title="新增文章" :visible.sync="addFormVisible" fullscreen :modal="false"  :close-on-click-modal="false" append-to-body>
					<archive-add v-if="addFormVisible" :xm-product="xmProduct"  :op-type="'add'" style="margin-top:-20px;" :archive="addForm" :archive-type="archiveType"   :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit"></archive-add>
			</el-dialog>   
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from '@/common/config';//全局公共库
	import { initDicts,listArchive, delArchive, batchDelArchive, openComment, closeComment, publish, unPublish } from '@/api/mdp/arc/archive';
	import  ArchiveAdd from './WikiEdit';//新增界面
	import  ArchiveEdit from './WikiEdit';//新增界面

 	import { mapGetters } from 'vuex'
	import Clipboard from 'clipboard'
 	
 	
	export default { 
		props:['xmProduct'],
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		watch:{
			categorys(){
				this.searchArchives();
			}
		},
		data() { 
			return {
				filters: {
					key: '', 
					isMy:'',
					categoryType:'',
					categoryTreeNodes:[], 
					tags:[], 
					fromStartTime:null,
					toStartTime:null,
				}, 
				archives: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:['seq_no'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['asc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				}, 
				sels: [],//列表选中数据
				dicts:{categoryType:[],archiveStatus:[]},//下拉选择框的所有静态数据 options.sex,options.project
				
				addFormVisible: false,//新增archive界面是否显示
				//新增archive界面初始化数据
				addForm: {
					id:'',tagNames:'',deptid:'',userid:'',isShare:'',url:'',archiveAbstract:'',archiveContext:'',archiveTitle:'',archivingUserid:'',isFromArchiving:'',archivingDate:'',createDate:'',authorUserid:'',authorName:'',canDel:'',canEdit:'',canRead:'',bizKey:'',encryptType:'',canComment:'1',status:'0',isStorageDir:'',isMain:'',isHot:'',seqNo:999
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑archive界面初始化数据
				editForm: {
					id:'',tagNames:'',deptid:'',userid:'',isShare:'',url:'',archiveAbstract:'',archiveContext:'',archiveTitle:'',archivingUserid:'',isFromArchiving:'',archivingDate:'',createDate:'',authorUserid:'',authorName:'',canDel:'',canEdit:'',canRead:'',bizKey:'',encryptType:'',canComment:'1',status:'0',isStorageDir:'',isMain:'',isHot:'',seqNo:999
				},
				/**begin 自定义属性请在下面加 请加备注**/
				categoryTree:{//分类树相关参数设置
					selected:{},//分类树被选中的节点数据	
					refreshTree:false,
				},
				sendFormVisible:false,//档案分发
				detailFormVisible:false,//预览窗口
				load:{ list:false, open:false, close:false, publish:false, unPublish:false, del:false },
				arcBasePath: config.getArcImagePath(),
				tagSelectVisible:false,
				isBatchSetTags:false,
				archiveTitle:"",//文章标题
				tableHeight:300,
				showLeft:true,
				moreVisible:false,
				archiveType:'0',
				categorys:[],
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			...util,
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.count=true;
				
				this.getArchives();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getArchives();
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
				this.getArchives();
			},
			searchArchives(){
				 
				 this.pageInfo.count=true;
				 this.getArchives();
			},
			//获取列表 Archive 档案信息表
			getArchives() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,count:this.pageInfo.count,
				};  
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key){
					params.key= this.filters.key;
					//params.archiveAbstract='%'+this.filters.key+'%';
					//params.archiveContext='%'+this.filters.key+'%';
				}
				if(this.categorys!=null && this.categorys.length>0){
					params.categoryIds=this.categorys.map(i=>i.id)
				}
				if(this.filters.tags!=null && this.filters.tags.length>0){
					params.tagIds=this.filters.tags.map(i=>i.tagId)
				} 
				
				if(this.filters.fromStartTime!=null && this.filters.toStartTime!=null){
					params.fromStartTime=this.filters.fromStartTime
					params.toStartTime=this.filters.toStartTime
				}
				
				if(this.filters.isMy){
					params.authorUserid=this.userInfo.userid
				} 
				if(this.archiveType){
					params.archiveType=this.archiveType
				}
				if(this.filters.categoryType){
					params.archiveType=this.filters.categoryType
				}
				params.branchId=this.userInfo.branchId
				params.pbizKey=this.xmProduct.id
				if(!params.pbizKey){
					return;
				}
				 
				this.load.list=true;
				listArchive(params).then((res) => {
					this.load.list=false;
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.data.total;this.pageInfo.count=false;
						this.archives = res.data.data; 
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					}  
				}).catch(() => {
					this.load.list = false;
					this.$message({ message: '访问错误', type: 'error' });
				});
			},

			//显示编辑界面 Archive 档案信息表
			showEdit: function ( row,index ) {
				if(row.status == '3'){
					this.$message.error('文章正在审核中，不能操作');
					return;
				}
				this.editFormVisible = true;
				this.editForm = row;
			},
			showDetail: function ( row,index ) {  
				var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
				var href=curlDomain+"/api/"+process.env.VERSION+"/arc/arc/arc/archive/showArchive?id="+row.id
 				window.open(href, '_blank');  
			},
			//显示新增界面 Archive 档案信息表
			showAdd: function () {
				if(this.categorys && this.categorys.length>0){
					this.addFormVisible = true;
					this.addForm.categoryId=this.categorys[0].id;
				}else{
					//this.$message({ message: '请先选择分类', type: 'warning' });
					this.addFormVisible = true;
				}
				
				
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.categoryTree.refreshTree=!this.categoryTree.refreshTree
				this.getArchives();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getArchives();
			},
			//选择行archive
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除archive
			handleDel: function (row,index) {
				if(row.status == '3'){
					this.$message.error('文章正在审核中，不能操作');
					return;
				}
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del = true;
					let params = { id: row.id };
					delArchive(params).then((res) => {
						this.load.del = false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getArchives();
							this.categoryTree.refreshTree=!this.categoryTree.refreshTree
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
						
					});
				}).catch(() => {
					this.load.del = false;
				});
			},
			//批量删除archive
			batchDel: function () {
				var ids = this.sels.map(item => item.id);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del = true;
					batchDelArchive(ids).then((res) => {
						this.load.del = false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getArchives(); 
							this.categoryTree.refreshTree=!this.categoryTree.refreshTree
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => {
					this.load.del = false; 
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},  
			handleFiltersTagClose:function(tag,paramsName){
				if(paramsName=='key'){
					this.filters.key=null;
				}else if(paramsName=='categoryTreeNodes'){
					this.categorys=this.categorys.filter(i=>i.id!=tag.id);
					this.$refs.categoryTree.$refs.nodeTree.setChecked(tag.id,false,false);
				}else if(paramsName=='tags'){
					this.filters.tags=this.filters.tags.filter(i=>i.tagId!=tag.tagId);
 				}
				 
			},
			onTagSelected(tags){
				this.tagSelectVisible=false;
				if(this.isBatchSetTags==true){
					//TOD 批量更新后台数据标签
					if(!tags || tags.length==0){
						 this.$message.error("最少选中一个标签");
						  this.isBatchSetTags=false;
						 return;
					}
					var archiveTagsVos=[];
					this.sels.forEach(row=>{
						 
						var archiveTags={
							archiveId:row.id, 
							branchId:row.branchId,
							userid:this.userInfo.userid,
							tags:tags.map(i=>{return {tagId:i.tagId,tagName:i.tagName}})
						}
						archiveTagsVos.push(archiveTags);
					})
					var params= archiveTagsVos
					
					 batchInsertOrDeleteTags(params).then(res=>{
						 this.isBatchSetTags=false;
						 if(res.data.tips.isOk){
							 var tagIds=tags.map(i=>i.tagId).join(",");
							 var tagNames=tags.map(i=>i.tagName).join(",");
							this.sels.forEach(row=>{
								row.tagIds=tagIds
								row.tagNames=tagNames
						 	})
							 this.$message.success("打标签成功");
						 }else{
							  this.$message.error(res.data.tips.msg);
						 }
					 }).catch(e=>this.isBatchSetTags=false);
				}else{
					if(tags==null){
						this.filters.tags=null 
					}else{
						this.filters.tags=tags 
					} 
				}
				
				
			}, 
			showTagSelect:function(isBatchSetTags){
				if(isBatchSetTags==true){
					if(this.sels.length==0){
						this.$message.error("请选中文章");
						return false;
					}
					this.tagSelectVisible=true;
				}else{
					this.tagSelectVisible=true;
				}
				this.isBatchSetTags=isBatchSetTags;
			},    
			//显示编辑界面 Archive 档案信息表
			showSend: function ( row,index ) {
				this.sendFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			
			openArchiveComment: function(){
				this.load.open=true
				let ids=this.sels.map(i=>i.id)
				openComment(ids).then(res=>{
					this.load.open=false
					this.getArchives()
					
				});
			},
			closeArchiveComment: function(){
				this.load.close=true
				let ids=this.sels.map(i=>i.id)
				closeComment(ids).then(res=>{
					this.load.close=false
					this.getArchives()
					
				});
			},
			publishArchive: function(row,index){ 
				if(row.status == '3'){
					this.$message.error('文章正在审核中，不能操作');
					return;
				}
				this.editForm = Object.assign(this.editForm,row);
				this.archiveTitle=row.archiveTitle
				this.load.publish=true
			},
			unPublishArchive: function(){
				this.load.unPublish=true
				let ids=this.sels.map(i=>i.id)
				unPublish(ids).then(res=>{
					this.load.unPublish=false
					this.getArchives()
					
				});
			},
			copyArchiveUrl(row,index){
				var clipBoardContent=config.getArcBasePath()+"/arc/archive/showArchive?id="+row.id;
				window.clipboardData.setData("Text",clipBoardContent);
			},
			
			//开启右侧抽屉
			openDrawer() {
				this.isShowNav = !this.isShowNav;
				this.isShowNav ? this.itemSpan = 20 : this.itemSpan = 24;
			},
			onEditSomeFields(row){
				Object.assign(this.editForm,row)
			}
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: { 
		    'archive-add':ArchiveAdd, 
			ArchiveEdit,
		},
		mounted() { 
			
			this.$nextTick(() => {
				initDicts(this)
				this.tableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
				this.getArchives();
				
				
            	

        	});
			let clipboard = new Clipboard('.copyBtn'); 
		}
	}

</script>

<style scoped>
	.filters-show { 
		margin-top: 14px;
		margin-bottom: 10px;
	}
	.filters-label { 
		font-size: 10px;
		color:black;
		font-weight: bold;

	}
	
	.el-dialog__wrapper {
		z-index: 1003 !important;
	}
	.v-modal {
		z-index: 1003 !important;  
	}
	.more-label-font{
		text-align:center;
		float:left;
		padding-top:5px;
	}
	.itemTable {
    position: relative;
  }

  .showMenuIcon {
		background: #1a59b7;
		color:#ffffff;
		overflow: hidden;
		position: fixed; 
		text-align:center;
		vertical-align:middle;
		margin-left: -10px;
		margin-top:0vh;
		width: 10px;
		height: 40px;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
  }
</style>