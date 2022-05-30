<template>
	<section>

		<!--工具条1-->
		<!--如果有更多工具条,放开此注释
		<el-col :span="24" class="toolbar"  style="padding-bottom: 0px;">
			<el-col :span="4">
			</el-col>
		</el-col>
		-->

		<!--新增界面 Dept sys_dept-->
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="上级部门" prop="pdeptName">
					<el-tag v-if="parentDept">{{parentDept.displayDeptid}} - {{parentDept.deptName}}</el-tag>
					<el-tag v-if="!parentDept">{{addForm.pdeptid}}</el-tag>
				</el-form-item>
				<el-form-item label="部门编码" prop="deptid">
					<el-input v-model="addForm.deptid" auto-complete="off" placeholder="部门编码，为空则后台自动生成" ></el-input>
				</el-form-item>
				<el-form-item label="部门全称" prop="deptName">
					<el-input v-model="addForm.deptName" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="简称" prop="shortName" v-show="false">
					<el-input v-model="addForm.shortName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="部门号" prop="displayDeptid"  v-show="false">
					<el-input v-model="addForm.displayDeptid" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="部门主管" prop="managerName">
				<el-input v-model="addForm.managerName" @focus="usersSelectVisible=true" suffix-icon="el-icon-search" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="分管领导" prop="leaderName">
				<el-input v-model="addForm.leaderName" @focus="leaderSelectVisible=true" suffix-icon="el-icon-search" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="deptType">
					<el-radio-group v-model="addForm.deptType" >
				      <el-radio v-model="addForm.deptType" v-for="(item,index) in options.deptType" :label="item.optionValue" border :key="index">{{item.optionName}}</el-radio>
				    </el-radio-group>
				</el-form-item>
				<el-form-item label="状态" prop="state"  v-show="false">
					<el-radio-group v-model="addForm.state" >
				      <el-radio v-model="addForm.state" label="A" border>启用</el-radio>
				      <el-radio v-model="addForm.state" label="E" border>停用</el-radio>
				    </el-radio-group>
				</el-form-item>
        	<el-form-item label="层级类型" prop="levelType">
        	<el-radio-group v-model="addForm.levelType">
              <el-radio v-for="(deptLvl,index) in options.deptLvl" :disabled="true"  :label="deptLvl.optionValue" border :key="index">{{deptLvl.optionName}}</el-radio>
            </el-radio-group>
        </el-form-item>
				<el-form-item>
					<el-col :span="24" >
						<el-col :span="4" :offset="16">
							<el-button @click.native="handleCancel">取消</el-button>
						</el-col>
						<el-col :span="4">
							<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
								<el-tooltip class="item" effect="dark" content="为了提高效率，服务器做了缓存，添加修改删除操作引起的部门变化，十分钟后部门树中才能体现" placement="top">
							      <i class="el-icon-question"></i>
							    </el-tooltip>

						</el-col>
					</el-col>
				</el-form-item>
			</el-form>
			
			<el-dialog append-to-body title="人员选择" width="70%" top="5vh" :visible.sync="usersSelectVisible">
				<user-select @confirm="onUserSelect" :isSingleUser="true"></user-select>
			</el-dialog>
			
			<el-dialog append-to-body title="人员选择" width="70%" top="5vh" :visible.sync="leaderSelectVisible">
				<user-select @confirm="onLeaderSelect" :isSingleUser="true"></user-select>
			</el-dialog>
	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { addDept } from '../../../../api/mdp/sys/dept';
	import UserSelect from '@/views/mdp/sys/user/UsersSelect'
	import { mapGetters } from 'vuex'

	export default {
		components:{
			UserSelect
		},

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['dept','parentDept'],
		watch: {
	      'dept':function(data) {
	      },
	      'parentDept':function(data) {
			  if(data){
				this.addForm.pdeptid=data.deptid;
				this.addForm.branchId=data.branchId;
				this.addForm.levelType =data.levelType;
			  }else{
				  this.addForm.pdeptid='A0'
				  this.addForm.levelType="L1"
			  }
	      }
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据
				addLoading: false,
				addFormRules: {
					deptName: [
						{ required: true, message: '部门名称不能为空', trigger: 'blur' }
					],
					shortName: [
						//{ required: true, message: '部门简称不能为空', trigger: 'blur' }
					],
					displayDeptid: [
						//{ required: true, message: '部门号不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 sys_dept
				addForm: {
					deptid:'',deptName:'',pdeptid:'',deptType:'',state:'',manager:'',leader:'',shortName:'',displayDeptid:'',orgType:'',managerName:'',leaderName:'',branchId:'',levelType:'',idPath:''
				},
				usersSelectVisible:false,
				leaderSelectVisible:false,
			}
		},
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交Dept sys_dept 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let params = Object.assign({}, this.addForm);
							if(params.branchId==''||params.branchId==null){
								params.branchId=this.userInfo.branchId;
							}
							if(params.branchId==''||params.branchId==null){
								this.$notify.error("公司不能为空");
								return;
							}
							// if(params.state=='1'){
							// 	params.state='A'
							// }else if(params.state=='0'){
							// 	params.state='E'
							// }
							addDept(params).then((res) => {
								this.addLoading = false;
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch(() => {
								this.addLoading = false;
							});
						});
					}
				});
			},
			onUserSelect(users){
				this.addForm.managerName=users[0].username
				this.addForm.manager=users[0].userid
				this.usersSelectVisible=false;
			},
			onLeaderSelect(users){
				this.addForm.leaderName=users[0].username
				this.addForm.leader=users[0].userid
				this.leaderSelectVisible=false; 
			}
		},
		mounted() {
			 Object.assign(this.addForm, this.dept);
			if(this.parentDept){
				this.addForm.pdeptid=this.parentDept.deptid;
				this.addForm.branchId=this.parentDept.branchId;
				this.addForm.levelType=this.parentDept.levelType;
				var a=this.addForm.levelType.split("L").join("");//字符串转数字
				var leve = Number(a);
				this.addForm.levelType = "L"+(leve+1);//字母数字组合
			}else{
				this.addForm.pdeptid='A0'
				this.addForm.levelType='L1'
			}

			let optionsParams=[{categoryId:'all',itemCode:'orgType'},{categoryId:'all',itemCode:'deptType'},{categoryId:'all',itemCode:'deptLvl'}];
			listOption(optionsParams).then(res=>{
				this.options=res.data.data;
			});
		}
	}

</script>

<style scoped>

</style>
