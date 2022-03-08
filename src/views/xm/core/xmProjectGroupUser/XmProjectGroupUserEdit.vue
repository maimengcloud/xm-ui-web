<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 XmProjectGroupUser xm_group_user--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				
				<el-form-item :label="editForm.pgClass=='1'?'产品编号':'项目编号'" prop="pgClass">
					{{editForm.projectId?editForm.projectId:''}}{{editForm.productId?editForm.productId:''}}
				</el-form-item> 
				<el-form-item label="小组名称" prop="groupName">
					<el-input v-model="editForm.groupName" placeholder="小组名称"></el-input>
				</el-form-item>  
				<el-form-item label="组员姓名" prop="username">
					<el-input v-model="editForm.username" placeholder="组员姓名"></el-input>
				</el-form-item> 
				<el-form-item label="" prop="status">
					<el-checkbox v-model="editForm.status" true-label="1" false-label="0" placeholder="当前状态">是否已加入</el-checkbox>
					<el-checkbox v-model="editForm.isPri" true-label="1" false-label="0" placeholder="是否私人加入">是否私人加入</el-checkbox>
				</el-form-item>  
				<el-form-item label="排序号" prop="seqNo">
					<el-input-number v-model="editForm.seqNo" :min="0" :max="200"></el-input-number>
				</el-form-item>   
				<el-form-item label="原归属机构名称" prop="obranchName">
					<el-input v-model="editForm.obranchName" placeholder="原归属机构名称"></el-input>
				</el-form-item>  
				<el-form-item label="加入时间" prop="joinTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.joinTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="离组时间" prop="outTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.outTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row   class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
	import { getDicts,initSimpleDicts,initComplexDicts } from '@/api/mdp/meta/item';//字典表
	import { addXmProjectGroupUser,editXmProjectGroupUser } from '@/api/xm/core/xmProjectGroupUser';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmProjectGroupUserEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmProjectGroupUser','visible','opType'],

		watch: {
	      'xmProjectGroupUser':function( xmProjectGroupUser ) {
	        if(xmProjectGroupUser){
	            this.editForm = xmProjectGroupUser;
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
					groupId: [
						//{ required: true, message: '小组编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					joinTime:'',groupId:'',userid:'',username:'',outTime:'',status:'',obranchId:'',isPri:'',seqNo:'',projectId:'',productId:'',pgClass:'',obranchName:''
				},

			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交XmProjectGroupUser xm_group_user父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmProjectGroupUser
							if(this.currOpType=='edit'){
							    func=editXmProjectGroupUser
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
                                this.$notify({ showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                            }).catch( err =>this.load.edit=false);
						});
					}else{
					    this.$notify({ showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.xmProjectGroupUser){
                    this.editForm = Object.assign({},this.xmProjectGroupUser);
                }

                if(this.opType=='edit'){

                }else{

                }
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