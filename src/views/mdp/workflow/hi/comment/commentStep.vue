<template>
	<section>
		<el-row style="max-height:400px;overflow-y:scroll;overflow-x:hidden;">
			<!--工具条1-->  
			<!--如果有更多工具条,放开此注释
			<el-col :span="24" class="toolbar"  style="padding-bottom: 0px;">
				<el-col :span="4">
				</el-col>
			</el-col>
			-->
			 
			 
			<div  style="border:1px dashed #000"> 	
				  <div v-if="!comments || comments.length<=0" style="padding-left: 10px;">暂无信息</div>
				  <el-steps :space="60"  direction="vertical">
				    <el-step v-for="item in comments " :title="item.name"  >
				    	<div slot="title"><el-col :span="24"> ><font v-if="screenWidth>500">任务:</font>{{item.name==''||item.name==null?'未知的节点名字':item.name}}  <font v-if="screenWidth>500">办理时间 :{{item.time}}</font><font v-if="screenWidth<500">{{formatTaskTime(item.time)}}</font></el-col> </div>
				    	<div slot="description" style="color: #303133;"> 
				    		<el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"><div>{{item.username?item.username:item.userid}}></div></el-col><el-col :xs="16" :sm="18" :md="20" :lg="21" :xl="23"><div>{{item.message}}</div></el-col>
				    	</div>
				    </el-step>
				  </el-steps>
				  </div> 
		</el-row>
	</section>
</template>

<script>
	import util from '../../../../../common/js/util';//全局公共库
	//import {getCompanyEmployees, selectCacheOptions,getDefaultValue,getCodeName } from '../../../../../api/common/code';//下拉框数据查询
	import { addComment,listComment } from '../../../../../api/mdp/workflow/hi/comment';
	import { listUser } from '@/api/mdp/sys/user';//下拉框数据查询
	import { listDept } from '@/api/mdp/sys/dept';//下拉框数据查询
	import moment from "moment";
	export default {
		props:['refresh','procInstId'],
		watch: {
	      'refresh':function(refresh) {  
	    	  if(refresh==true){
	    		  this.comments=[]
		    	  this.$emit('get-comments',[])
		      	 this.getComments(); 
	    	  }
	    	  
	      },
		},	
		computed:{
			screenWidth:function(){
				return screen.width;
			}
		},
		data() {
			return {
				options:{},//下拉选择框的所有静态数据
				addLoading: false,
				addFormRules: {
					id: [
						//{ required: true, message: 'id_', trigger: 'blur' }
					]
				},
				//新增界面数据 act_hi_comment
				addForm: {
					id:'',type:'',time:'',userId:'',taskId:'',procInstId:'',action:'',message:'',fullMsg:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				comments:[]
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交Comment act_hi_comment 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true; 
							let params = Object.assign({}, this.addForm); 
							addComment(params).then((res) => {
								this.addLoading = false; 
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.addLoading = false;
							});
						});
					}
				});
			},
			formatTaskTime(time){
				return moment(time).format("DD日HH时");
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			//获取列表 Comment act_hi_comment
			getComments() {
				if(!this.procInstId){
					return;
				}
				let params = {procInstId:this.procInstId};
				params.pageNum='1';
				params.pageSize='50'; 
				params.orderBy='c.time_ asc'
				listComment(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						var commentsTeam = res.data.data; 
						this.comments=commentsTeam
						this.$emit('get-comments',this.comments)
					}else{
						
						this.$message({ message: tips.msg, type: 'error' });
					} 
				}).catch(() => {
					
				});
			},
			 labelWidth:function(){
				if (screen.width <=375){
					return "5px"
				}else  if (screen.width <= 500){
						return "5px"
				}else if (screen.width<=1024){
						return "100px"
				}else {
						return "120px"
				}
			} ,
			labelName:function(){
				 if (screen.width <=375){
					return ""
				}else  if (screen.width <= 500){
						return ""
				}else if (screen.width<=1024){
						return "流转信息"
				}else {
						return "流转信息"
				}
			} ,	
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'comment-edit':CommentEdit
		},
		mounted() { 
				this.getComments();  
			
		}//end mounted
	}

</script>

<style scoped>
	  
</style>