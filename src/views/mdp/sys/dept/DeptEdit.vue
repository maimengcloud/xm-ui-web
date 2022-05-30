<template>
	<section>

		<!--工具条1-->
		<!--如果有更多工具条,放开此注释
		<el-col :span="24" class="toolbar"  style="padding-bottom: 0px;">
			<el-col :span="4">
			</el-col>
		</el-col>
		-->

		<!--编辑界面 Dept sys_dept-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="上级部门" prop="pdeptName"> 
					<el-tag>{{editForm.pdeptid}}</el-tag>
				</el-form-item>
				<el-form-item label="部门编码" prop="deptid">
					<el-tag v-model="editForm.deptid">{{editForm.deptid}}</el-tag>
				</el-form-item>
				<el-form-item label="部门全称" prop="deptName">
					<el-input v-model="editForm.deptName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="简称" prop="shortName" v-show="false">
					<el-input v-model="editForm.shortName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="部门号" prop="displayDeptid">
					<el-input v-model="editForm.displayDeptid" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="部门主管" prop="managerName">
				<el-input v-model="editForm.managerName" @focus="usersSelectVisible=true" suffix-icon="el-icon-search" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="分管领导" prop="leaderName">
				<el-input v-model="editForm.leaderName" @focus="leaderSelectVisible=true" suffix-icon="el-icon-search" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="deptType">
					<el-radio-group v-model="editForm.deptType" >
				      <el-radio v-model="editForm.deptType" v-for="(item,index) in options.deptType" :label="item.optionValue" border :key="index">{{item.optionName}}</el-radio>
				    </el-radio-group>
				</el-form-item>
				<el-form-item label="状态" prop="state">
					<el-radio-group v-model="editForm.state" >
				      <el-radio v-model="editForm.state" label="A" border>启用</el-radio>
				      <el-radio v-model="editForm.state" label="E" border>停用</el-radio>
				    </el-radio-group>
				</el-form-item>
        	<el-form-item label="层级类型" prop="levelType">
        	<el-radio-group v-model="editForm.levelType" >
                <el-radio v-for="(deptLvl,index) in options.deptLvl"   :label="deptLvl.optionValue" border :key="index">{{deptLvl.optionName}}</el-radio> 

            </el-radio-group>
        </el-form-item>
				<el-form-item>
					<el-col :span="24" >
						<el-col :span="4" :offset="16">
							<el-button @click.native="handleCancel">取消</el-button>
						</el-col>
						<el-col :span="4">
							<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
							<el-tooltip class="item" effect="dark" content="为了提高效率，服务器做了缓存，添加修改删除操作引起的部门变化，十分钟后部门树中才能体现" placement="top">
							      <i class="el-icon-question"></i>
							    </el-tooltip>
						</el-col>
					</el-col>
				</el-form-item>
			</el-form>
			
			<el-dialog append-to-body title="部门经理选择" width="70%" top="5vh" :visible.sync="usersSelectVisible">
				<user-select @confirm="onUserSelect" :isSingleUser="true"></user-select>
			</el-dialog>
			
			<el-dialog append-to-body title="分管领导选择" width="70%" top="5vh" :visible.sync="leaderSelectVisible">
				<user-select @confirm="onLeaderSelect" :isSingleUser="true"></user-select>
			</el-dialog>

	</section>
</template>

<script>
	import util from '../../../../common/js/util';//全局公共库
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { editDept,listDept } from '../../../../api/mdp/sys/dept';
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
		props:['dept'],
		watch: {
	      'dept':function(data) {
	        this.editForm={...data}; 
			//this.getOneDept(this.editForm.pdeptid) 
	      }
	    },
		data() {
			return {
				options:{},//下拉选择框的所有静态数据
				editLoading: false,
				editFormRules: {
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
				//编辑界面数据  Dept sys_dept
				editForm: {
					deptid:'',deptName:'',pdeptid:'',deptType:'',state:'',manager:'',leader:'',shortName:'',displayDeptid:'',orgType:'',managerName:'',leaderName:'',branchId:'',levelType:'',idPath:''
				},
				usersSelectVisible:false,
				leaderSelectVisible:false,
			}
		},
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//编辑提交Dept sys_dept父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let params = Object.assign({}, this.editForm);
							editDept(params).then((res) => {
								this.editLoading = false;
								var tips=res.data.tips;
								if(tips.isOk){ 
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch(() => {
								this.editLoading = false;
							});
						});
					}
				});
			}, 
			onUserSelect(users){
				this.editForm.managerName=users[0].username
				this.editForm.manager=users[0].userid
				this.usersSelectVisible=false;
			},
			onLeaderSelect(users){
				this.editForm.leaderName=users[0].username
				this.editForm.leader=users[0].userid
				this.leaderSelectVisible=false; 
			}
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.dept); 
			//加载下拉列表 如有需要去掉注释
			let optionsParams=[{categoryId:'all',itemCode:'orgType'},{categoryId:'all',itemCode:'deptType'},{categoryId:'all',itemCode:'deptLvl'}];
			listOption(optionsParams).then(res=>{
				this.options=res.data.data;
			});

			/**在下面写其它函数***/
		}
	}

</script>

<style scoped>

</style>
