<template>
	<section class="page-container  padding border">
		<el-row>
			<!--新增界面 XmIterationMenu 迭代定义-->
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" ></el-input>
				</el-form-item>
				<el-form-item label="对应的迭代编号" prop="iterationId">
					<el-input v-model="addForm.iterationId" placeholder="对应的迭代编号" ></el-input>
				</el-form-item>
				<el-form-item label="需求编号" prop="menuId">
					<el-input v-model="addForm.menuId" placeholder="需求编号" ></el-input>
				</el-form-item>
				<el-form-item label="产品编号" prop="productId">
					<el-input v-model="addForm.productId" placeholder="产品编号" ></el-input>
				</el-form-item>
				<el-form-item label="关联时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.ctime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>
				<el-form-item label="关联状态0不再关联1正常关联" prop="relStatus">
					<el-input v-model="addForm.relStatus" placeholder="关联状态0不再关联1正常关联" ></el-input>
				</el-form-item>
				<el-form-item>
					<el-col :span="24" :offset="8">
						<el-button @click.native="handleCancel">取消</el-button>
						<el-button v-loading="load.add" type="primary" @click.native="addSubmit" :disabled="load.add==true">提交</el-button>
					</el-col>
				</el-form-item>
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库

	import { addXmIterationMenu } from '@/api/xm/core/xmIterationMenu';
	import { mapGetters } from 'vuex'

	export default {
		computed: {
		    ...mapGetters([
		      'userInfo','roles'
		    ])
		},
		props:['xmIterationMenu','visible'],
		watch: {
	      'xmIterationMenu':function( xmIterationMenu ) {
	        this.addForm = xmIterationMenu;
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
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 迭代定义
				addForm: {
					id:'',iterationId:'',menuId:'',productId:'',ctime:'',relStatus:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmIterationMenu 迭代定义 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				if(!this.roles.some(i=>i.roleid=='iterationAdmin')){
					this.$notify({position:'bottom-left',showClose:true,message: "只有迭代管理员可以操作", type:  'error' });
					return ;
				}
				this.$refs.addForm.validate((valid) => {
					if (valid) {

						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							let params = Object.assign({}, this.addForm);
							addXmIterationMenu(params).then((res) => {
								this.load.add=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/

			/**end 在上面加自定义方法**/

		},//end method
		components: {
		    //在下面添加其它组件 'xm-iteration-menu-edit':XmIterationMenuEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmIterationMenu);
			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
