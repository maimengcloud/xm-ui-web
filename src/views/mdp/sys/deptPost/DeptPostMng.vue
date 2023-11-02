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
			<el-row  slot="footer" class="footer"> 
				<el-button type="text" @click="close">关闭</el-button>
				<el-button type="primary" v-loading="load.add" @click="batchSetPostsToDept">提交</el-button> 
			</el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { listDeptPost, batchSetPostsToDept } from '@/api/mdp/sys/deptPost';
	import { listPost, delPost, batchDelPost,listPostNotInDeptid } from '@/api/mdp/sys/post';
 	import { mapGetters } from 'vuex'

	export default { 
		props:{

			deptid:{
				type:String,
				default:null
			},
			
			branchId:{
				type:String,
				default:null
			},
			visible:{
				type:Boolean,
				default:false,
			}
		},
		watch: {  
			visible(val){
				if(val==true){
					this.getDeptPosts();
					this.getPosts();
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
				load:{ list: false, edit: false, del: false, add: false },//查询中...

				posts:[],//本机构下的所有岗位 [{id:xxx,postName:''}]
				deptPostIds:[],//当前已选择的岗位编号列表 [post.id]
			}
		},//end data
		methods: {
			 close(){ 
				 this.$emit('close')
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
			}, 
			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    //在下面添加其它组件
		},
		mounted() { 
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
