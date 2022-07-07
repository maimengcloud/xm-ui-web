<template>
	<section>
		<el-row>
	   		 <el-tag type="warning" v-if="myUserFocuss.length>0">已关注</el-tag> 
			 <el-tag type="primary" v-if="myUserFocuss.length<=0">未关注</el-tag> 
	   </el-row>
		<el-row v-if="myUserFocuss.length>0"> 
			  <el-button @click="handleDel" size="mini" type="primary">取消关注</el-button><el-button size="mini" @click="focusListVisible=!focusListVisible">关注列表</el-button> 
	   </el-row>
	   
	   <el-row v-if="myUserFocuss.length<=0"> 
			  <el-button @click="saveSubmit" type="primary" size="mini">去关注</el-button><el-button size="mini" @click="focusListVisible=!focusListVisible">关注列表</el-button>
 	   </el-row>
	   <el-row v-if="focusListVisible"> 
			<div class="demo-basic--circle">
 				<div class="block" v-for="(item,idx) in userFocuss" :key="idx">
				 	<el-tag>{{item.username}}</el-tag>&nbsp;&nbsp;
				</div>
			</div>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;"></el-pagination>
	   </el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, listUserFocus,addUserFocus,delUserFocus } from '@/api/mdp/sys/userFocus';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmMyDoFocus',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['pbizId','bizId','focusType','bizName'],

		watch: {  
			bizId(){
				this.searchMyUserFocuss();
				this.focusListVisible=false;
			},
			focusListVisible(val){
				if(val){
					this.searchUserFocuss();
				}
			}
	    },
		data() {
			return { 
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				
				userFocuss:[],
				myUserFocuss:[],
				focusListVisible:false,
				
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:false,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
			}//end return
		},//end data
		methods: {

		    ...util,
			getImg(userFocus){
				return "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";
			},
			//获取列表 UserFocus 我关注的项目或者任务
			searchMyUserFocuss() {
				let params = { 
					pbizId:this.pbizId,
					bizId:this.bizId,
					focusType:this.focusType,
					userid:this.userInfo.userid
				};
				 

				this.load.list = true;
				listUserFocus(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.myUserFocuss = res.data.data; 
					}else{
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
			 //获取列表 UserFocus 我关注的项目或者任务
			searchUserFocuss() { 
				 let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count,
					pbizId:this.pbizId,
					bizId:this.bizId,
					focusType:this.focusType
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				} 

				this.load.list = true;
				listUserFocus(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						this.userFocuss = res.data.data;  
						this.pageInfo.total = res.data.total;
						this.pageInfo.count=false;
					}else{
						this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},
			initData: function(){ 
				this.searchMyUserFocuss();
            }, 
			//删除userFocus
			handleDel: function ( ) {
				var row=this.myUserFocuss[0]
				this.load.del=true;
				let params = {  userid:row.userid,  bizId:row.bizId,  pbizId:row.pbizId };
				delUserFocus(params).then((res) => {
					this.load.del=false;
					var tips=res.data.tips;
					if(tips.isOk){
						this.searchMyUserFocuss();
					}
					this.$notify({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err  => this.load.del=false ); 
			},
			//新增、编辑提交UserFocus 我关注的项目或者任务父组件监听@submit="afterEditSubmit"
			saveSubmit: function () { 
				this.load.edit=true
				let params = {pbizId:this.pbizId,bizId:this.bizId,focusType:this.focusType,bizName:this.bizName}
				var func=addUserFocus 
				func(params).then((res) => {
					this.load.edit=false
					var tips=res.data.tips;
					
					if(tips.isOk){  
						this.searchMyUserFocuss()
 						this.$emit('submit');//  @submit="afterAddSubmit"
					}
					this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err =>this.load.edit=false); 
			},
		},//end method
		mounted() {
		    this.$nextTick(() => {
                initDicts(this);
                this.initData() 
            });
		}
	}

</script>

<style scoped>

</style>