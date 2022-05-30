<template>
	<section>
		<el-row>
			<div class="edit_dev" style="text-align: center">
				<p style="text-align:center;color:red;font-size:25;"> 请在下面选择一个或者多个岗位加入/移出部门【{{deptid}}】 </p>
				<el-transfer
					style="text-align: left; display: inline-block;"
					v-model="deptPostIds"
					filterable
					:filter-method="transferFilterMethod"
					:render-content="renderFunc"
					:titles="['未拥有', '已拥有']"
					:format="{
						noChecked: '${total}',
						hasChecked: '${checked}/${total}'
					}"
					:props="{key:'id',label:'postName'}"
					@change="handleChange"
					:data="posts">
				</el-transfer>
			</div>
		</el-row>
		<el-row  class="app-container">
			<p style="text-align:center;">
			<el-button type="text" @click="handleCancel">取消</el-button>
			<el-button type="primary" v-loading="load.add" @click="batchSetPostsToDept">提交</el-button>
			</p>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listDeptPost, batchSetPostsToDept } from '@/api/mdp/sys/post/deptPost';
	import { listPost, delPost, batchDelPost,listPostNotInDeptid } from '@/api/mdp/sys/post/post';
 	import { mapGetters } from 'vuex'

	export default {
		props:['branchId','deptid','visible'],
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
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				//新增deptPost界面初始化数据
				addForm: {
					deptid:'',postId:'',id:'',ldate:''
				},
				//编辑deptPost界面初始化数据
				editForm: {
					deptid:'',postId:'',id:'',ldate:''
				},
				posts:[],//本机构下的所有岗位 [{id:xxx,postName:''}]
				deptPostIds:[],//当前已选择的岗位编号列表 [post.id]
				/**begin 自定义属性请在下面加 请加备注**/

				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			 handleCancel(){
				 this.$emit('cancel')
			 },
			searchDeptPosts(){
				 this.getDeptPosts();
			},
			//获取列表 DeptPost 部门岗位关系表
			getDeptPosts() {
				let params = {
				};
				params.deptid=this.deptid
				this.load.list = true;
				listDeptPost(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.deptPosts = res.data.data;
						this.deptPostIds=this.deptPosts.map(i=>i.postId)
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			/**begin 自定义函数请在下面加**/
			batchSetPostsToDept: function(){
				var deptPosts={
					branchId: this.userInfo.branchId,
					deptid:this.deptid,
					postIds:this.deptPostIds
				};
				this.load.add = true;
				batchSetPostsToDept(deptPosts).then(res=>{
					var tips=res.data.tips;
					if(tips.isOk){
						this.$notify({ message: tips.msg, type: 'success' });
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					}
					this.load.add = false;
				}).catch( err => this.load.add = false );
			},
						//获取列表 Post sys_post
			getPosts() {
				let params = {
				};
				params.branchId=this.branchId

				this.load.list = true;
				listPost(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){
						this.posts = res.data.data;
					}else{
						this.$notify({ message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			renderFunc(h, option) {
				return <span>{ option.postName } - { option.id }</span>;
			},
			handleChange(){

			},
			transferFilterMethod:function(query, item) {
				if(!item){
					return false;
				}
				if( item.postName && item.postName.indexOf(query)>-1){
					return true;
				}
				if(item.id && item.id.indexOf(query)>-1){
					return true;
				}
				return false;
			}
			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    //在下面添加其它组件
		},
		mounted() {
			this.$nextTick(() => {
				this.getDeptPosts();
				this.getPosts();
        	});
		}
	}

</script>

<style scoped>
   .edit_dev >>>.el-transfer-panel__list.is-filterable{
		width:400px !important;
		height:550px !important;
	}

	.edit_dev >>>.el-transfer-panel{
		width: 400px !important;
		height: 550px !important;
	}
</style>
