<template>
	<section>
		<el-row  class="app-container">
			 
			<!--新增界面 Branch 管理端机构表（机构下面若干部门）--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="" prop="branchName">
					<el-tag>亲，您不在任何一个公司或者部门中，需要【先创建公司】 或者请【管理员加您进入公司】哦</el-tag>
				</el-form-item>
				<el-form-item label="机构名称" prop="branchName">
					<el-input v-model="addForm.branchName" auto-complete="off"></el-input>
				</el-form-item> 

				<el-form-item label="行业分类" prop="industryCategory"> 
					  <el-select
					    v-model="addForm.industryCategory" 
					    filterable
					    allow-create
					    default-first-option
					    placeholder="请选择行业，如果没有合适的可以自己添加">
					    <el-option
					      v-for="item in options.industryCategory"
					      :key="item.optionValue"
					      :label="item.optionName"
					      :value="item.optionValue">
					    </el-option>
					  </el-select>
				</el-form-item>  
				<el-form-item label="姓名" prop="cusername">
					<el-input v-model="addForm.cusername" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="联系电话" prop="phoneNo">
					<el-input v-model="addForm.phoneNo" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="邮件" prop="emaill">
					<el-input v-model="addForm.emaill" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item>
					<el-col :span="4" :offset="16"> 
						<el-button @click.native="handleCancel">取消</el-button> 
					</el-col>
					<el-col :span="4"> 
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" >提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
			 
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { listOption } from '@/api/itemOption';//下拉框数据查询
	import { addBranch } from '@/api/branch';
	import { mapGetters } from 'vuex'
	
	export default {
		props:['branch','visible'],
		watch: {
	      'branch':function( branch ) {
	        this.addForm = branch;
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
						//{ required: true, message: '机构编号不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 管理端机构表（机构下面若干部门）
				addForm: {
					id:'',branchName:'',enabled:'',industryCategory:'',cuserid:'',cdate:'',cusername:'',phoneNo:'',emaill:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交Branch 管理端机构表（机构下面若干部门） 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							console.log("dddddddddddddddddddddddddddddddddddddddddddddddd")
							console.log(this.userInfo)
							params.cuserid=this.userInfo.userid
							addBranch(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit',res.data.data );//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => this.load.add=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'branch-edit':BranchEdit
		},
	  computed: {
		    ...mapGetters([
		      'myBranchs','myDepts','userInfo'
		    ])
		  },
		mounted() {
			this.addForm=Object.assign(this.addForm, this.branch);  
			this.addForm.cusername=this.userInfo.username
			this.addForm.phoneNo=this.userInfo.phoneNo;
			this.load.list=true
			listOption([{categoryId:'all',itemCode:'industryCategory'}]).then(res=>{
				this.load.list=false
				this.options=res.data.data
			}).catch(()=>this.load.list=false);
		}//end mounted
	}

</script>

<style scoped>

</style>