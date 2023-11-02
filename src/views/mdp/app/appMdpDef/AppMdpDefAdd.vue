<template>
	<section>
		<el-row class="app-container">
			<!--新增界面 AppMdpDef MDP平台应用定义表--> 
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="应用编号" prop="mdpAppid">
					<el-input v-model="addForm.mdpAppid" placeholder="应用编号,为空则自动生成" ></el-input>
				</el-form-item> 
				<el-form-item label="应用名称" prop="name">
					<el-input v-model="addForm.name" placeholder="应用名称" ></el-input>
				</el-form-item> 
				<el-form-item label="应用logo" prop="logoUrl">
					<el-input v-model="addForm.logoUrl" placeholder="应用logo" ></el-input>
				</el-form-item> 
				<el-form-item label="应用描述" prop="remark">
					<el-input v-model="addForm.remark" placeholder="应用描述" ></el-input>
				</el-form-item> 
				<el-form-item label="应用分类" prop="bizType">
					  <el-select v-model="addForm.bizType" placeholder="请选择分类">
					    <el-option
					      v-for="item in appBizTypes"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
				</el-form-item>  
				<el-form-item label="是否上架" prop="enabled">
					<el-switch
					  v-model="addForm.enabled"
					  active-value="1"
					  inactive-value="0">
					</el-switch>
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
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import { mapGetters } from 'vuex'
	import { addAppMdpDef } from '@/api/mdp/app/appMdpDef';
	import { listAppBizType } from '@/api/mdp/app/appBizType';
	
	export default {
		props:['appMdpDef','visible'],
		watch: {
	      'appMdpDef':function( appMdpDef ) {
	        this.addForm = appMdpDef;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					mdpAppid: [
						//{ required: true, message: '应用编号不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 MDP平台应用定义表
				addForm: {
					mdpAppid:'',name:'',logoUrl:'',remark:'',bizType:'',deptid:'',branchId:'',cdate:'',cuserid:'',enabled:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				appBizTypes:[],//业务分类 {id,name}
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交AppMdpDef MDP平台应用定义表 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							params.deptid=this.userInfo.deptid
							params.branchId=this.userInfo.branchId
							params.cuserid=this.userInfo.userid
							params.cdate=this.$mdp.formatDate(new Date(),'yyyy-MM-dd HH:mm:ss');
							addAppMdpDef(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
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
		    //在下面添加其它组件 'app-mdp-def-edit':AppMdpDefEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.appMdpDef);  
			listAppBizType({}).then(res=>{
				this.appBizTypes=res.data.data
			})
			
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>