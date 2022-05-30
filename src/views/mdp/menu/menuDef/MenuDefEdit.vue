<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 MenuDef 前端功能菜单表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="上级菜单" prop="pid"> 
					<el-tag>{{editForm.pid}}</el-tag>
				</el-form-item> 
				<el-form-item label="菜单编号" prop="id">
					<el-input readonly v-model="editForm.id" placeholder="菜单编号，如果为空则后台自动生成" ></el-input>
				</el-form-item>  
				<el-form-item label="菜单名称" prop="mname">
					<el-input v-model="editForm.mname" placeholder="菜单名称" ></el-input>
				</el-form-item> 
				<el-form-item label=" " prop="menuType"> 
					<el-switch
					  v-model="editForm.menuType"
					   active-text="按钮"
					  inactive-text="菜单"
					  active-value="2"
					  inactive-value="1">
					</el-switch>
				</el-form-item>  
				<el-form-item label="归属模块" prop="moduleId">
				  <el-select v-model="editForm.moduleId" placeholder="请选择归属模块">
				    <el-option
				      v-for="item in menuModules"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select> 
				</el-form-item> 
				
				<el-form-item label="支持版本" prop="supVers">
				  <el-select v-model="editForm.supVers" placeholder="请选择支持版本">
				    <el-option
				      v-for="item in dicts['menuSupVers']"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select> 
				</el-form-item> 
				<el-form-item label="访问路径" prop="accUrl">
					<el-input v-model="editForm.accUrl" placeholder="网页访问路径" ></el-input>
				</el-form-item>  
				<el-form-item label="路由名称" prop="rid">
					<el-input v-model="editForm.rid" placeholder="路由名称" ></el-input>
				</el-form-item> 
				<el-form-item label="路由PATH" prop="rpath">
					<el-input v-model="editForm.rpath" placeholder="vue-路由访问路径" >
						<template slot="append"><el-tooltip class="item" effect="light" content="通过该路径判断菜单是否相同，是否有权限" placement="top-start">
							<i class="el-icon-question"></i>
							</el-tooltip>
						</template>
					</el-input>
				</el-form-item> 
				<el-form-item label="菜单顺序" prop="msort">
					<el-input v-model="editForm.msort" placeholder="菜单顺序" ></el-input>
				</el-form-item> 

				<el-form-item label="菜单图标" prop="icon">
					<el-input v-model="editForm.icon" placeholder="菜单图标" ></el-input>
				</el-form-item>  
				<el-form-item label="是否显示" prop="isShow"> 
					<el-switch
					  v-model="editForm.isShow"
					  active-value="1"
					  inactive-value="0">
					</el-switch>
				</el-form-item> 
				<el-form-item>
					<el-col :span="4" :offset="16"> 
						<el-button @click.native="handleCancel">取消</el-button> 
					</el-col>
					<el-col :span="4"> 
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit" >提交</el-button>  
					</el-col>
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { initDicts,editMenuDef } from '@/api/mdp/menu/menuDef';
	import { listMenuModule } from '@/api/mdp/menu/menuModule';
	import { mapGetters } from 'vuex'; 
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['menuDef','visible'],
		watch: {
	      'menuDef':function( menuDef ) {
	        this.editForm = menuDef;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				dicts:{
					menuSupVers:[],
				},//下拉选择框的所有静态数据  params=[{moduleIdId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: {
					mname: [
						{ required: true, message: '菜单名称不能为空', trigger: 'blur' }
					],
					moduleId: [
						{ required: true, message: '分类不能为空', trigger: 'blur' }
					],

					pid: [
						{ required: true, message: '上级菜单不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 前端功能菜单表
				editForm: {
					id:'',pid:'',accUrl:'',msort:'',moduleId:'',icon:'',mname:'',rpath:'',rid:'',isShow:'1',menuType:'1' ,supVers:'0'
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				menuModules:[],//归属模块{id:'',cname:''}
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交MenuDef 前端功能菜单表 父组件监听@submit="afterAddSubmit"
			editSubmit: function () {
				
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);  
							editMenuDef(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){ 
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => this.load.edit=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'menu-def-edit':MenuDefEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.menuDef);  
			
			initDicts(this);
			listMenuModule({}).then(res=>this.menuModules=res.data.data);
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>