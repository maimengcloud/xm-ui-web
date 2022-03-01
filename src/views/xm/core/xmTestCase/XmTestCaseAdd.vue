<template>
	<section class="page-container page-full-height padding border">
		<el-row>
			<!--新增界面 XmTestCase 测试用例-->
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="标题" prop="caseName">
					<el-input v-model="addForm.caseName" placeholder="标题" ></el-input>
				</el-form-item>
				<el-form-item label="模块名称" prop="moduleName">
					<el-input v-model="addForm.moduleName" placeholder="模块名称" ></el-input>
				</el-form-item>
				<el-form-item label="关联的需求" prop="menuId">
					<el-tag v-if="addForm.menuName && addForm.menuName!=''" closable @close="clearFiltersMneu">{{addForm.menuName}}</el-tag>
					<el-tag v-else>还没关联任何需求</el-tag>
					<el-button @click="showMenu">关联需求</el-button>
				</el-form-item>

				<el-form-item>
 					<el-col :span="12">测试步骤</el-col>
					<el-col :span="12" offset="0">预期结果</el-col>
					<el-col :span="12">
							<vue-editor :id="'testStep'" :branch-id="userInfo.branchId" v-model="addForm.testStep" ref="testStep"></vue-editor>
					</el-col>
					<el-col :span="12" offset="0">
							<vue-editor :id="'expectResult'" :branch-id="userInfo.branchId" v-model="addForm.expectResult"  ref="expectResult"></vue-editor>
					</el-col>
 				</el-form-item>
				<el-form-item>
 						<el-button @click.native="handleCancel">取消</el-button>
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>
						<el-button v-loading="load.add" type="warning" @click.native="addSubmit(true)" :disabled="load.add==true">提交后继续新建</el-button>

 				</el-form-item>
			</el-form>

		<el-drawer append-to-body title="需求选择" :visible.sync="menuVisible" fullscreen    :close-on-click-modal="false">
			<xm-menu-select :visible="menuVisible" :is-select-menu="true" :multi="true" :exclude-iteration-id="iteration?iteration.id:''"  @menus-selected="onSelectedMenus" ></xm-menu-select>
		</el-drawer>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import {sn} from '@/common/js/sequence';//全局公共库

	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { addXmTestCase } from '@/api/xm/core/xmTestCase';
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
	        //this.addForm = xmTestCase;
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
					menuId: [
						{ required: true, message: '需求不能为空', trigger: 'blur' }
					],
					caseName: [
						{ required: true, message: '标题不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 测试用例
				addForm: {
					id:'',caseName:'',caseRemark:'',testStep:'',expectResult:'',menuId:'',menuName:'',ctime:'',ltime:'',luserid:'',lusername:'',cbranchId:'',moduleId:'',moduleName:'',caseStatus:'1'
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				menuVisible:false,

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmTestCase 测试用例 父组件监听@submit="afterAddSubmit"
			addSubmit: function (next) {

				this.$refs.addForm.validate((valid) => {
					if (valid) {

						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							let params = Object.assign({}, this.addForm);
							params.cbranchId=this.userInfo.branchId
							params.luserid=this.userInfo.userid
							params.lusername=this.userInfo.username
							params.id=sn('case_')
							addXmTestCase(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk && next!=true){
 									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({showClose: true, message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
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
				this.addForm.menuId= menus[0].menuId
				this.addForm.menuName= menus[0].menuName
				this.$refs.addForm.validateField('menuId',valid=>{})

 			},
			clearFiltersMneu(menu){
				this.addForm.menuId=""
				this.addForm.menuName=""
				this.$refs.addForm.validateField('menuId',valid=>{})
   			}
			/**end 在上面加自定义方法**/

		},//end method
		components: {
			//在下面添加其它组件 'xm-test-case-edit':XmTestCaseEdit
			xmMenuSelect,VueEditor
		},
		mounted() {
			//this.addForm=Object.assign(this.addForm, this.xmTestCase);
			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
