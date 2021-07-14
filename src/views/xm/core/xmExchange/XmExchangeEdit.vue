<template>
	<section class="page-container page-full-height padding border">
		<el-row> 
		<!--编辑界面 XmExchange 故事表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="故事编号" prop="taskId">
					<el-input v-model="editForm.taskId" placeholder="故事编号"></el-input>
				</el-form-item> 
				<el-form-item label="故事名称" prop="taskName">
					<el-input v-model="editForm.taskName" placeholder="故事名称"></el-input>
				</el-form-item> 
				<el-form-item label="归属产品编号" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="归属产品编号"></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" placeholder="备注"></el-input>
				</el-form-item> 
				<el-form-item label="评论编号" prop="id">
					<el-input v-model="editForm.id" placeholder="评论编号"></el-input>
				</el-form-item> 
				<el-form-item label="上级评论编号" prop="pid">
					<el-input v-model="editForm.pid" placeholder="上级评论编号"></el-input>
				</el-form-item> 
				<el-form-item label="评论人编号" prop="cuserid">
					<el-input v-model="editForm.cuserid" placeholder="评论人编号"></el-input>
				</el-form-item> 
				<el-form-item label="评论人名称" prop="cusername">
					<el-input v-model="editForm.cusername" placeholder="评论人名称"></el-input>
				</el-form-item> 
				<el-form-item label="评论时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="评论人所属机构" prop="cbranchId">
					<el-input v-model="editForm.cbranchId" placeholder="评论人所属机构"></el-input>
				</el-form-item> 
				<el-form-item label="是否采纳0否1采纳" prop="adopt">
					<el-input v-model="editForm.adopt" placeholder="是否采纳0否1采纳"></el-input>
				</el-form-item> 
				<el-form-item label="采纳人编号" prop="adoptUserid">
					<el-input v-model="editForm.adoptUserid" placeholder="采纳人编号"></el-input>
				</el-form-item> 
				<el-form-item label="采纳人名称" prop="adoptUsername">
					<el-input v-model="editForm.adoptUsername" placeholder="采纳人名称"></el-input>
				</el-form-item> 
				<el-form-item label="采纳时间" prop="adoptTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.adoptTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="关闭该评论0否1是" prop="closed">
					<el-input v-model="editForm.closed" placeholder="关闭该评论0否1是"></el-input>
				</el-form-item> 
				<el-form-item label="上级用户编号" prop="puserid">
					<el-input v-model="editForm.puserid" placeholder="上级用户编号"></el-input>
				</el-form-item> 
				<el-form-item label="上级姓名" prop="pusername">
					<el-input v-model="editForm.pusername" placeholder="上级姓名"></el-input>
				</el-form-item> 
				<el-form-item label="上级备注" prop="premark">
					<el-input v-model="editForm.premark" placeholder="上级备注"></el-input>
				</el-form-item> 
				<el-form-item label="本评论需要同步给的人列表,逗号分隔" prop="notifyUserids">
					<el-input v-model="editForm.notifyUserids" placeholder="本评论需要同步给的人列表,逗号分隔"></el-input>
				</el-form-item> 
				<el-form-item label="发送通知渠道inner-email/wxpub/sms/im/out-email等逗号分割" prop="notifyChannels">
					<el-input v-model="editForm.notifyChannels" placeholder="发送通知渠道inner-email/wxpub/sms/im/out-email等逗号分割"></el-input>
				</el-form-item> 
				<el-form-item label="通知用户姓名逗号分隔" prop="notifyUsernames">
					<el-input v-model="editForm.notifyUsernames" placeholder="通知用户姓名逗号分隔"></el-input>
				</el-form-item> 
				<el-form-item label="发言人头像地址" prop="cuserHeadImg">
					<el-input v-model="editForm.cuserHeadImg" placeholder="发言人头像地址"></el-input>
				</el-form-item> 
				<el-form-item label="回复方式1引用2回复" prop="replyType">
					<el-input v-model="editForm.replyType" placeholder="回复方式1引用2回复"></el-input>
				</el-form-item> 
				<el-form-item> 
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editXmExchange } from '@/api/xm/core/xmExchange';
	import { mapGetters } from 'vuex'
	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmExchange','visible'],
		watch: {
	      'xmExchange':function( xmExchange ) {
	        this.editForm = xmExchange;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					id: [
						//{ required: true, message: '评论编号不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  XmExchange 故事表
				editForm: {
					taskId:'',taskName:'',projectId:'',remark:'',id:'',pid:'',cuserid:'',cusername:'',ctime:'',cbranchId:'',adopt:'',adoptUserid:'',adoptUsername:'',adoptTime:'',closed:'',puserid:'',pusername:'',premark:'',notifyUserids:'',notifyChannels:'',notifyUsernames:'',cuserHeadImg:'',replyType:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//编辑提交XmExchange 故事表父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmExchange(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err =>this.load.edit=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-exchange-edit':XmExchangeEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmExchange);  
		}
	}

</script>

<style scoped>

</style>