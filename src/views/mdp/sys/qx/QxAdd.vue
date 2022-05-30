<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 Qx 权限定义--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm"> 
				<el-form-item label="权限编码" prop="qxId">
					<el-input v-model="addForm.qxId" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="权限名称" prop="qxName">
					<el-input v-model="addForm.qxName" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="业务分类" prop="moduleId">
					<el-radio-group v-model="addForm.moduleId" >
						<el-col :span="8" class="category" v-for="(item,index) in menuModules" :key="index">
				      		<el-radio    :label="item.id">{{item.name}}</el-radio>
						</el-col>
				    </el-radio-group>
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
	import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询 
	import { listMenuModule } from '@/api/mdp/menu/menuModule';
	import { addQx } from '@/api/mdp/sys/qx';
	import { mapGetters } from 'vuex' 
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['qx','visible'],
		watch: {
	      'qx':function( qx ) {
	        this.addForm = qx;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
				  this.addForm.moduleId = this.qx.moduleId;
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{moduleId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					qxId: [
						{ required: true, message: '权限编码不能为空', trigger: 'blur' }
					],
					qxName: [
						{ required: true, message: '名称不能为空', trigger: 'blur' }
					]
					,
					moduleId: [
						{ required: true, message: '业务分类不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 权限定义
				addForm: {
					qxId:'',qxName:'',moduleId:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				menuModules:[],
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增提交Qx 权限定义 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							addQx(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => this.load.add=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'qx-edit':QxEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.qx);  
			/**在下面写其它函数***/ 
			//加载下拉列表 如有需要去掉注释 
			
				listMenuModule({}).then(res=>{ 
					this.menuModules=res.data.data
				})
			//给下拉列表初始化默认值
			//this.addForm.xxx=getDefaultValue(this.options.xxx,'1');
		}	
}

</script>

<style scoped>
.category{
	margin-top: 14px;
}
</style>