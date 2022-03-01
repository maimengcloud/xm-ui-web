<template>
	<section class="page-container  padding border">
		<el-row>
			<!--新增界面 XmExchange 需求表--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="需求编号" prop="taskId">
					<el-input v-model="addForm.taskId" placeholder="需求编号" ></el-input>
				</el-form-item> 
				<el-form-item label="需求名称" prop="taskName">
					<el-input v-model="addForm.taskName" placeholder="需求名称" ></el-input>
				</el-form-item> 
				<el-form-item label="归属产品编号" prop="projectId">
					<el-input v-model="addForm.projectId" placeholder="归属产品编号" ></el-input>
				</el-form-item> 
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" placeholder="备注" ></el-input>
				</el-form-item> 
				<el-form-item label="评论编号" prop="id">
					<el-input v-model="addForm.id" placeholder="评论编号" ></el-input>
				</el-form-item> 
				<el-form-item label="上级评论编号" prop="pid">
					<el-input v-model="addForm.pid" placeholder="上级评论编号" ></el-input>
				</el-form-item> 
				<el-form-item label="评论人编号" prop="cuserid">
					<el-input v-model="addForm.cuserid" placeholder="评论人编号" ></el-input>
				</el-form-item> 
				<el-form-item label="评论人名称" prop="cusername">
					<el-input v-model="addForm.cusername" placeholder="评论人名称" ></el-input>
				</el-form-item> 
				<el-form-item label="评论时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.ctime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="评论人所属机构" prop="cbranchId">
					<el-input v-model="addForm.cbranchId" placeholder="评论人所属机构" ></el-input>
				</el-form-item> 
				<el-form-item label="是否采纳0否1采纳" prop="adopt">
					<el-input v-model="addForm.adopt" placeholder="是否采纳0否1采纳" ></el-input>
				</el-form-item> 
				<el-form-item label="采纳人编号" prop="adoptUserid">
					<el-input v-model="addForm.adoptUserid" placeholder="采纳人编号" ></el-input>
				</el-form-item> 
				<el-form-item label="采纳人名称" prop="adoptUsername">
					<el-input v-model="addForm.adoptUsername" placeholder="采纳人名称" ></el-input>
				</el-form-item> 
				<el-form-item label="采纳时间" prop="adoptTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.adoptTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="关闭该评论0否1是" prop="closed">
					<el-input v-model="addForm.closed" placeholder="关闭该评论0否1是" ></el-input>
				</el-form-item> 
				<el-form-item label="上级用户编号" prop="puserid">
					<el-input v-model="addForm.puserid" placeholder="上级用户编号" ></el-input>
				</el-form-item> 
				<el-form-item label="上级姓名" prop="pusername">
					<el-input v-model="addForm.pusername" placeholder="上级姓名" ></el-input>
				</el-form-item> 
				<el-form-item label="上级备注" prop="premark">
					<el-input v-model="addForm.premark" placeholder="上级备注" ></el-input>
				</el-form-item> 
				<el-form-item label="本评论需要同步给的人列表,逗号分隔" prop="notifyUserids">
					<el-input v-model="addForm.notifyUserids" placeholder="本评论需要同步给的人列表,逗号分隔" ></el-input>
				</el-form-item> 
				<el-form-item label="发送通知渠道inner-email/wxpub/sms/im/out-email等逗号分割" prop="notifyChannels">
					<el-input v-model="addForm.notifyChannels" placeholder="发送通知渠道inner-email/wxpub/sms/im/out-email等逗号分割" ></el-input>
				</el-form-item> 
				<el-form-item label="通知用户姓名逗号分隔" prop="notifyUsernames">
					<el-input v-model="addForm.notifyUsernames" placeholder="通知用户姓名逗号分隔" ></el-input>
				</el-form-item> 
				<el-form-item label="发言人头像地址" prop="cuserHeadImg">
					<el-input v-model="addForm.cuserHeadImg" placeholder="发言人头像地址" ></el-input>
				</el-form-item> 
				<el-form-item label="回复方式1引用2回复" prop="replyType">
					<el-input v-model="addForm.replyType" placeholder="回复方式1引用2回复" ></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { addXmExchange } from '@/api/xm/core/xmExchange';
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
	        this.addForm = xmExchange;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '评论编号不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 需求表
				addForm: {
					taskId:'',taskName:'',projectId:'',remark:'',id:'',pid:'',cuserid:'',cusername:'',ctime:'',cbranchId:'',adopt:'',adoptUserid:'',adoptUsername:'',adoptTime:'',closed:'',puserid:'',pusername:'',premark:'',notifyUserids:'',notifyChannels:'',notifyUsernames:'',cuserHeadImg:'',replyType:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmExchange 需求表 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addXmExchange(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.add=false);
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
			this.addForm=Object.assign(this.addForm, this.xmExchange);  
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>