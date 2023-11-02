<template>
	<section> 
		<el-row style="border:1px dashed #000;padding:10px;">  
			<div  > 	
				  <div v-if="!comments || comments.length<=0" style="padding-left: 10px;">暂无信息</div>
				  <el-steps :space="60"  direction="vertical" process-status="process" finish-status="success">
				    <el-step v-for="(item,index) in comments " :key="index" status="success">
				    	<div slot="title">
							<el-col :span="24"> 
								{{item.name==''||item.name==null?item.message:item.name}}  
								<font v-if="screenWidth>500"> &nbsp;&nbsp;{{item.time}}
								</font>
								<font v-if="screenWidth<500">{{formatTaskTime(item.time)}}</font>
							</el-col> 
						</div>
				    	<div slot="description" style="color: #303133;">  
								<div style="display: inline-block;">{{item.username?item.username:item.userid}}</div> 
								 <el-divider style="display: inline-block;" direction="vertical"></el-divider>
								<div style="display: inline-block;">{{item.message}}</div> 
				    	</div>
				    </el-step>
					<el-step v-if="task && task.taskId"  status="process" icon="el-icon-edit">
				    	<div slot="title">
							<el-col :span="24"> 
								{{task.taskName}}  <el-tag type="warning">当前节点</el-tag>
								<font v-if="screenWidth>500"> &nbsp;&nbsp;{{task.startTime}}
								</font>
								<font v-if="screenWidth<500">{{formatTaskTime(task.startTime)}}</font>
							</el-col> 
						</div>
				    	<div slot="description" style="color: #303133;">  
								<div style="display: inline-block;">{{task.assigneeName?task.assigneeName:task.assignee}}</div> 
								 <el-divider style="display: inline-block;" direction="vertical"></el-divider>
								<div style="display: inline-block;">请尽快处理</div> 
				    	</div>
				    </el-step>
				  </el-steps>
			</div> 
		</el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import {getCompanyEmployees, selectCacheOptions,getDefaultValue,getCodeName } from '../../../../../api/common/code';//下拉框数据查询
	import { addComment,listComment } from '@/api/mdp/workflow/hi/comment'; 
	import moment from "moment";
	export default {
		props:['procInstId','task'],
		watch: {
			procInstId(){
				this.getComments();
			}
		},	
		computed:{
			screenWidth:function(){
				return screen.width;
			}, 
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
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
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
				let params = {'res.procInstId':this.procInstId};
				params.pageNum='1';
				params.pageSize='50'; 
				listComment(params).then((res) => {
					var tips=res.data.tips;
					if(tips.isOk){ 
						var commentsTeam = res.data.data; 
						this.comments=commentsTeam
						this.$emit('get-comments',this.comments)
					}else{
						
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: 'error' });
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