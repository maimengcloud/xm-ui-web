<template>
	<section>
		<el-row class="page-container border"> 
			<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"></el-input> 
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" v-on:click="searchPosts">查询</el-button>
			 
			<el-button type="primary" @click="confirmPostSelect" v-loading="load.add==true">确定</el-button> 
			<el-tooltip class="item" effect="light" content="如果没有查询到岗位，有可能是所有岗位已经加入该部门，可在岗位管理中定义新的岗位，再到此将岗位加入部门" placement="top-start">
		       <i class="el-icon-question"></i>
		    </el-tooltip>
		</el-row>
		<el-row class="page-container border"> 
			<!--列表 Post sys_post-->
			<el-table :data="posts" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column type="index" width="60"></el-table-column>
				<el-table-column prop="postName" label="岗位名称" min-width="80" ></el-table-column>
				<el-table-column prop="remark" label="备注" min-width="80" ></el-table-column>
				<el-table-column prop="cdate" label="创建日期" min-width="80" ></el-table-column> 
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination> 
		 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import Sticky from '@/components/Sticky' // 粘性header组件
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listPost, delPost, batchDelPost,listPostNotInDeptid } from '@/api/mdp/sys/post/post';  
	import { mapGetters } from 'vuex'
	
	export default {  
		props:['branchId','deptid','visible'],
		watch: { 
	      'visible':function(visible) {  
	      	if(visible==true){
				
	      		this.searchPosts()
	      	}
	      } 
	    },
		computed: {
		    ...mapGetters([
		      'workShop'
		    ])
		},
		data() {
			return {
				filters: {
					key: ''
				},
				posts: [],//查询结果
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
				
				addFormVisible: false,//新增post界面是否显示
				//新增post界面初始化数据
				addForm: {
					id:'',postName:'',remark:'',branchId:'',cdate:''
				},
				postRoleMngVisible: false,//显示岗位角色关系界面
				editFormVisible: false,//编辑界面是否显示
				//编辑post界面初始化数据
				editForm: {
					id:'',postName:'',remark:'',branchId:'',cdate:''
				}
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize; 
				this.getPosts();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getPosts();
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
				this.getPosts();
			},
			searchPosts(){
				 this.pageInfo.count=true; 
				 this.getPosts();
			},
			//获取列表 Post sys_post
			getPosts() {
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
				params.branchId=this.branchId
				
				this.load.list = true;
				listPost(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
						this.posts = res.data.data;
					}else{
						this.$message({showClose: true, message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 Post sys_post
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示编辑界面 岗位角色关系维护界面
			showPostRoleMng: function ( row,index ) {
				this.postRoleMngVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 Post sys_post
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getPosts();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行post
			selsChange: function (sels) {
				this.sels = sels;
			},  
 
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			/**begin 自定义函数请在下面加**/ 
			confirmPostSelect(){
				
				if(this.sels.length<=0){
					this.$message({showClose: true, message:'请选择角色', type: 'error'});
					return;
				}
				this.load.add=true;
				this.$emit('select',this.sels);//  @select="afterConfirmPostSelect"
				this.load.add=false;
			}
				
			/**end 自定义函数请在上面加**/
			
		},//end methods
		components: {   
		    'sticky': Sticky
		    //在下面添加其它组件
		},
		mounted() { 
			this.$nextTick(() => {
				this.getPosts();
        	}); 
		}
	}

</script>

<style scoped>

</style>