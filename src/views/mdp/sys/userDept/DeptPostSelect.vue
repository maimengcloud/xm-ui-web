<template>
	<section>
		<el-row class="app-container"> 
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchDeptPosts" icon="el-icon-search"></el-button>
			<el-button type="primary" @click="showPostSelect">添加岗位</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true">移出部门</el-button> 
		</el-row>
		<el-row class="app-container"> 
			<!--列表 DeptPost 部门岗位关系表-->
			<el-table :max-height="tableHeight" :data="deptPosts"  highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="selection" width="40"></el-table-column>
				<el-table-column sortable type="index" width="40"></el-table-column> 
				<el-table-column sortable prop="postName" label="部门拥有的岗位" min-width="80" show-overflow-tooltip></el-table-column>  
				<el-table-column sortable label="操作" width="160" fixed="right"  show-overflow-tooltip>
					<template slot-scope="scope"> 
						<el-button type="danger" @click="handleDel(scope.row,scope.$index)">移出部门</el-button>
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
	import { listDeptPost, delDeptPost, batchDelDeptPost,batchAddDeptPost } from '@/api/mdp/sys/post/deptPost';  
	import { mapGetters } from 'vuex'
	
	export default { 
		props:['deptid','visible'],
		watch: { 
	      'visible':function(visible) { 
	      	if(visible==true){
	      		this.searchDeptPosts()
	      	}
	      } 
	    },
		computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				deptPosts: [],//查询结果
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
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增deptPost界面是否显示
				//新增deptPost界面初始化数据
				addForm: {
					deptid:'',postId:'',id:'',ldate:''
				},
				postSelectVisible: false,//选择岗位列表
				editFormVisible: false,//编辑界面是否显示
				//编辑deptPost界面初始化数据
				editForm: {
					deptid:'',postId:'',id:'',ldate:''
				},
				tableHeight:500,
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getDeptPosts();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getDeptPosts();
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
				this.getDeptPosts();
			},
			searchDeptPosts(){
				 this.pageInfo.count=true; 
				 this.getDeptPosts();
			},
			//获取列表 DeptPost 部门岗位关系表
			getDeptPosts() {
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
					//params.key="%"+this.filters.key+"%"
				}else{
					//params.xxx=xxxxx
				}
				params.deptid=this.deptid
				this.load.list = true;
				listDeptPost(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.deptPosts = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 DeptPost 部门岗位关系表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 DeptPost 部门岗位关系表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			//显示未加入部门的岗位列表
			showPostSelect: function () {
				this.postSelectVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getDeptPosts();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行deptPost
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除deptPost
			handleDel: function (row,index) { 
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = row;
					delDeptPost(params).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getDeptPosts();
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除deptPost
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelDeptPost(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.data.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getDeptPosts(); 
						}
						this.$notify({ message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/
			afterConfirmPostSelect: function(posts){
				console.log('xxxxxxxxxxxxxxxxxxxxxxxx')
				console.log(posts)
				this.postSelectVisible=false;
				var deptPosts=[];
				posts.forEach(post=>{
					let deptPost={postId: post.id,deptid: this.deptid}
					deptPosts.push(deptPost)
				})
				batchAddDeptPost(deptPosts).then(res=>{
					this.searchDeptPosts();
				})
			}
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {  
		     
		    //在下面添加其它组件
		},
		mounted() {    
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 250;   
			}); 
			this.$nextTick(() => {
				this.getDeptPosts();
        	}); 
		}
	}

</script>

<style scoped>

</style>