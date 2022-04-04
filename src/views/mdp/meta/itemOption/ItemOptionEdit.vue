<template>
	<section>
		<el-row> 
		<!--编辑界面 ItemOption 数据项取值列表--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm"> 
				<el-form-item label="选项值" prop="optionValue">
					<el-input v-model="editForm.optionValue" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="选项名称" prop="optionName">
					<el-input v-model="editForm.optionName" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="快捷键" prop="keys">
					<el-input v-model="editForm.keys" auto-complete="off"></el-input>
				</el-form-item> 

				<el-form-item label="顺序" prop="seqOrder">
					<el-input v-model="editForm.seqOrder" auto-complete="off"></el-input>
				</el-form-item> 
				<el-form-item label="第一扩展字段" prop="fp">
					<el-input v-model="editForm.fp" auto-complete="off"></el-input>
				</el-form-item>  
				<el-form-item label="" prop="isShow">
					<el-col :span=8>
					<el-switch
					  v-model="editForm.isShow" 
					  active-value="1"
					  inactive-value="0"
					  active-text="显示"
					  inactive-text="不显示"
					  >
					</el-switch>
					</el-col>
					<el-col :span=8>
					<el-switch
					  v-model="editForm.isDefault" 
					  active-value="1"
					  inactive-value="0"
					  active-text="是默认值"
					  inactive-text="不是默认值"
					  >
					</el-switch>
					</el-col>
				</el-form-item> 
				<el-form-item label="创建日期" prop="cdate">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.cdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item> 
					<el-col :span="4" :offset="16"> 
						<el-button @click.native="handleCancel">取消</el-button> 
					</el-col>
					<el-col :span="4"> 
						<el-button v-loading="load.edit" type="primary" @click.native="editSubmit">提交</el-button>  
					</el-col> 
				</el-form-item> 
			</el-form>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import { editItemOption } from '@/api/mdp/meta/itemOption';
	import { mapGetters } from 'vuex' 
	
	export default {

	    computed: {
		    ...mapGetters([
		      'userInfo'
		    ])
		},
		props:['itemOption','visible'],
		watch: {
	      'itemOption':function( itemOption ) {
	        this.editForm = itemOption;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },	
		data() {
			return {
				options:{},//下拉选择框的所有静态数据
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				editFormRules: {
					optionValue: [
						{ required: true, message: '选项值不能为空', trigger: 'blur' }
					],
					optionName: [
						{ required: true, message: '选项名称不能为空', trigger: 'blur' }
					]
				},
				//编辑界面数据  ItemOption 数据项取值列表
				editForm: {
					itemId:'',id:'',optionValue:'',optionName:'',keys:'',isShow:'',seqOrder:'',fp:'',tp:'',sp:'',isDefault:'',cdate:'',branchId:'',deptid:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//编辑提交ItemOption 数据项取值列表父组件监听@submit="afterEditSubmit"
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							editItemOption(params).then((res) => {
								this.load.edit=false
								var tips=res.data.tips;
								if(tips.isOk){
									this.$refs['editForm'].resetFields();
									this.$emit('submit');//  @submit="afterEditSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => {
								this.load.edit=false
							});
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
				
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'item-option-edit':ItemOptionEdit
		},
		mounted() {
			this.editForm=Object.assign(this.editForm, this.itemOption);  
		}
	}

</script>

<style scoped>

</style>