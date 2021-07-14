<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<!--新增界面 XmIteration 迭代定义--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">  
				<el-form-item label="迭代名称" prop="iterationName">
					<el-input v-model="editForm.iterationName" placeholder="迭代名称" ></el-input>
				</el-form-item> 
				<el-form-item label="序号" prop="seqNo">
					<el-input v-model="editForm.seqNo" placeholder="如1.0，2.0，1.1.1等" ></el-input>
				</el-form-item> 
				<el-form-item label="开始时间" prop="startTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.startTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="结束时间" prop="endTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.endTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="上线时间" prop="onlineTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.onlineTime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>   
				<el-form-item label="负责人姓名" prop="adminUsername">
					{{editForm.adminUsername}} <el-button @click="userSelectVisible=true">选择负责人</el-button>
				</el-form-item>  
				<el-form-item label="预算工作量" prop="budgetWorkload">
					<el-input v-model="editForm.budgetWorkload" type="number" min="0" style="width:60%;" placeholder="预算工作量"></el-input> 人时 ，1人工作1日=8人时
				</el-form-item>    
				<el-form-item>
					<el-col :span="24" :offset="8"> 
						<el-button @click.native="handleCancel">取消</el-button>  
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
		
		<el-drawer append-to-body title="选择员工" :visible.sync="userSelectVisible" width="60%">
        	<users-select :select-userids="[]" @confirm="onUserSelected" ref="usersSelect"></users-select>
      	</el-drawer>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { editXmIteration } from '@/api/xm/core/xmIteration';
	import { mapGetters } from 'vuex'	
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";

	
	export default { 
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmIteration','visible'],
		watch: {
	      'xmIteration':function( xmIteration ) {
	       	this.editForm=Object.assign(this.editForm, this.xmIteration);
	      },
	      'visible':function(visible) { 
	      	if(visible==true){ 
	      	}
	      } 
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: { 
					iterationName: [
						{ required: true, message: '迭代名称不能为空', trigger: 'blur' }
					],
					seqNo: [
						{ required: true, message: '序号不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 迭代定义
				editForm: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',seqNo:'',
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				userSelectVisible:false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmIteration 迭代定义 父组件监听@submit="afterAddSubmit"
			editSubmit: function () {
				if(!this.roles.some(i=>i.roleid=='iterationAdmin')){
					this.$message({showClose: true, message: "只有迭代管理员可以修改迭代", type:  'error' }); 
					return ;
				}
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editXmIteration(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch( err  => this.load.edit=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			
			onUserSelected: function(users) {
				if(users.length>1){
					this.$message.error("只能选一个人");
					return;
				}
				var user=users[0]
				this.editForm.adminUserid=user.userid
				this.editForm.adminUsername=user.username
				this.userSelectVisible = false;
			},	
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
			//在下面添加其它组件 'xm-iteration-edit':XmIterationEdit
			UsersSelect
		},
		mounted() {

			this.editForm=Object.assign(this.editForm, this.xmIteration);   
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>