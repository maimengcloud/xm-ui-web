<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 XmProjectGroup xm_project_group--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">   
				<el-form-item label="小组名称" prop="groupName">
					<el-input v-model="editForm.groupName" placeholder="团队名称">
						<template v-if="currOpType=='edit'" slot="append">{{editForm.lvl}}级</template>
					</el-input>  
				</el-form-item>   
				<el-form-item label="负责人" prop="leaderUsername"> 
					<el-form-item label="组长" prop="leaderUsername">
						<el-input v-model="editForm.leaderUsername" placeholder="组长人姓名" @click.native="showUserSelect('leader')"></el-input>
					</el-form-item> 
					<el-form-item label="副组长" prop="assUsername">
						<el-input v-model="editForm.assUsername" placeholder="副组长姓名" @click.native="showUserSelect('ass')"></el-input>
						<font color="red">如果没用副组长可以设置为项目助理、小组助理等，具有组长同等权限</font>
					</el-form-item>  
				</el-form-item>     
				<el-form-item label="企业协作" prop="isCrow"> 
					<el-form-item label="" prop="isCrow">
						<el-checkbox v-model="editForm.isCrow" true-label="1" false-label="0">是否属于协作公司</el-checkbox>
					</el-form-item> 
					<el-form-item label="协作公司" prop="crowBranchName" v-if="editForm.isCrow">
						<el-input v-model="editForm.crowBranchName" placeholder="协作公司名称" @click.native="branchVisible=true"></el-input>
						<font color="red">如果该团队属于某协作公司，请选择协作公司。</font>
					</el-form-item>  
				</el-form-item>      
			</el-form>
		</el-row>

		<el-row   class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
		
			<el-drawer append-to-body title="选择员工" :visible.sync="userSelectVisible" size="60%">
				<users-select isSingleUser=true   @confirm="onUserSelected" ref="usersSelect"></users-select>
			</el-drawer>
			
		<el-drawer title="机构选择" :visible.sync="branchVisible"  size="50%" top="20" :close-on-click-modal="false" append-to-body>
			<branch-select :visible="branchVisible"  @cancel="branchVisible=false" @row-click="branchRowClick"></branch-select>
		</el-drawer>
	</section>
</template> 

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { addXmProjectGroup,editXmProjectGroup } from '@/api/xm/core/xmProjectGroup';
	import { mapGetters } from 'vuex'
	import UsersSelect from "@/views/mdp/sys/user/UsersSelect";
	import  BranchSelect from '@/views/mdp/sys/branch/BranchSelect';//机构选择
	
	export default {
	    name:'xmProjectGroupEdit',
	    components: {
			UsersSelect,BranchSelect,
        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmProjectGroup','visible','opType'],

		watch: {
	      'xmProjectGroup':function( xmProjectGroup ) {
	        if(xmProjectGroup){
	            this.editForm = xmProjectGroup;
	        }

	      },
	      'visible':function(visible) { 
	      	if(visible==true){
 	      		this.initData()
	      	}
	      } 
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					id:'',groupName:'',projectId:'',pgTypeId:'',pgTypeName:'',leaderUserid:'',leaderUsername:'',ctime:'',ltime:'',productId:'',branchId:'',pgClass:'',pgroupId:'',lvl:'',pidPaths:'',isTpl:'',assUserid:'',assUsername:'',childrenCnt:'',userCnt:'',qxCode:'',calcWorkload:'',ntype:'',crowBranchId:'',crowBranchName:'',isCrow:''
				},
				
				userType:"leader",
				userSelectVisible:false,
				branchVisible:false,

			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交XmProjectGroup xm_project_group父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmProjectGroup
							if(this.currOpType=='edit'){
							    func=editXmProjectGroup
							}
							func(params).then((res) => {
                                this.load.edit=false
                                var tips=res.data.tips;
                                if(tips.isOk){
                                    this.editForm=res.data.data
                                    this.initData()
                                    this.currOpType="edit";
                                    this.$emit('submit');//  @submit="afterAddSubmit"
                                }
                                this.$message({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                            }).catch( err =>this.load.edit=false);
						});
					}else{
					    this.$message({ showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.xmProjectGroup){
                    this.editForm = Object.assign({},this.xmProjectGroup);
                }

                if(this.opType=='edit'){

                }else{

                }
            },
			showUserSelect(userType){
				this.userType=userType
				this.userSelectVisible=true;
			},
			
			//选择接收人
			onUserSelected: function(groupUsers) {  
				this.userSelectVisible = false;
				if(groupUsers==null||groupUsers.length==0){
					return;
				}
				var user=groupUsers[0]
				
				if(this.userType=='leader'){ 
					this.editForm.leaderUserid=user.userid
					this.editForm.leaderUsername=user.username
				}else{ 
					this.editForm.assUserid=user.userid
					this.editForm.assUsername=user.username
				}
				
			}, 
			branchRowClick: function(row, event, column){
				this.branchVisible=false
				this.editForm.crowBranchId=row.id
				this.editForm.crowBranchName=row.branchName
			}, 

		},//end method
		mounted() {
		    this.$nextTick(() => {
                //initSimpleDicts('all',['sex','gradeLvl']).then(res=>this.dicts=res.data.data);
                this.initData()
            });
		}
	}

</script>

<style scoped>

</style>