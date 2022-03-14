<template>
	<section class="page-container  padding border">
		<el-row>
			<!--新增界面 XmTestCase 测试用例-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="标题" prop="caseName">
					<el-input v-model="editForm.caseName" placeholder="标题" ></el-input>
				</el-form-item>
				<el-form-item label="模块名称" prop="moduleName">
					<el-input v-model="editForm.moduleName" placeholder="模块名称" ></el-input>
				</el-form-item>
				<el-form-item label="关联的需求" prop="menuId">
					<el-tag v-if="editForm.menuId && editForm.menuId!=''"  @close="clearFiltersMneu">{{editForm.menuName}}</el-tag>
					<el-tag v-else>还没关联任何需求</el-tag>
					<el-button v-if="!editForm.menuId"  @click="showMenu">关联需求</el-button>
				</el-form-item>
				<el-form-item label="状态" prop="moduleName">
					<el-radio v-model="editForm.caseStatus" label="1" placeholder="状态" >正常</el-radio>
					<el-radio v-model="editForm.caseStatus" label="0" placeholder="状态" >作废</el-radio>

				</el-form-item>
				<el-form-item>
 					<el-col :span="12">测试步骤</el-col>
					<el-col :span="12" offset="0">预期结果</el-col>
					<el-col :span="12">
							<vue-editor :id="'testStep3'" :branch-id="userInfo.branchId" v-model="editForm.testStep" ref="testStep"></vue-editor>
					</el-col>
					<el-col :span="12" offset="0">
							<vue-editor :id="'expectResult3'" :branch-id="userInfo.branchId" v-model="editForm.expectResult"  ref="expectResult"></vue-editor>
					</el-col>
 				</el-form-item>
				<el-form-item>
 						<el-button @click.native="handleCancel">取消</el-button>
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" :disabled="load.edit==true">提交</el-button>
 				</el-form-item>
			</el-form>

		<el-drawer append-to-body title="需求选择" :visible.sync="menuVisible" fullscreen   :close-on-click-modal="false">
			<xm-menu-select :visible="menuVisible" :is-select-menu="true" :multi="true" :exclude-iteration-id="iteration?iteration.id:''"  @menus-selected="onSelectedMenus" ></xm-menu-select>
		</el-drawer>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { initSimpleDicts } from '@/api/mdp/meta/item';//下拉框数据查询
	import { editXmTestCase } from '@/api/xm/core/xmTestCase';
	import { mapGetters } from 'vuex'
	import xmMenuSelect from '../xmMenu/XmMenuSelect';
	import VueEditor from '@/components/Tinymce/index';

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmTestCase','visible'],
		watch: {
	      'xmTestCase':function( xmTestCase ) {
	        this.editForm = xmTestCase;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      }
	    },
		data() {
			return {
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: {
					menuId: [
						{ required: true, message: '需求不能为空', trigger: 'blur' }
					],
					caseName: [
						{ required: true, message: '标题不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 测试用例
				editForm: {
					id:'',caseName:'',caseRemark:'',testStep:'',expectResult:'',menuId:'',menuName:'',ctime:'',ltime:'',luserid:'',lusername:'',cbranchId:'',moduleId:'',moduleName:'',caseStatus:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				menuVisible:false,

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmTestCase 测试用例 父组件监听@submit="afterAddSubmit"
			editSubmit: function () {

				if( !this.roles.some(i=>i.roleid=='testAdmin') && !this.roles.some(i=>i.roleid=='tester') && !this.roles.some(i=>i.roleid=='testTeamAdmin') ){
					this.$notify({showClose: true,message:"只有测试经理、测试组长、测试员可以操作",type:"error"});
					return ;
				}
				this.$refs.editForm.validate((valid) => {
					if (valid) {

						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
 							params.luserid=this.userInfo.userid
							params.lusername=this.userInfo.username
							editXmTestCase(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
 									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.edit=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			showMenu(){
				this.menuVisible=true;
			},
			onSelectedMenus(menus){
				if(!menus || menus.length==0){
					this.menuVisible=false
					return;
				}
				this.menuVisible=false
				this.editForm.menuId= menus[0].menuId
				this.editForm.menuName= menus[0].menuName
				this.$refs.editForm.validateField('menuId',valid=>{})

 			},
			clearFiltersMneu(menu){
				this.editForm.menuId=""
				this.editForm.menuName=""
				this.$refs.editForm.validateField('menuId',valid=>{})
   			}
			/**end 在上面加自定义方法**/

		},//end method
		components: {
			//在下面添加其它组件 'xm-test-case-edit':XmTestCaseEdit
			xmMenuSelect,VueEditor
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.xmTestCase);
			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
