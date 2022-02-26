<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 XmProjectGroupUser xm_project_group_user--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="加入时间" prop="joinTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.joinTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="团队编号" prop="groupId">
					<el-input v-model="editForm.groupId" placeholder="团队编号"></el-input>
				</el-form-item> 
				<el-form-item label="团队成员编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="团队成员编号"></el-input>
				</el-form-item> 
				<el-form-item label="团队成员" prop="username">
					<el-input v-model="editForm.username" placeholder="团队成员"></el-input>
				</el-form-item> 
				<el-form-item label="离队时间" prop="outTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.outTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="当前状态0参与中1已退出团队" prop="status">
					<el-input v-model="editForm.status" placeholder="当前状态0参与中1已退出团队"></el-input>
				</el-form-item> 
				<el-form-item label="组员原归属机构编号" prop="obranchId">
					<el-input v-model="editForm.obranchId" placeholder="组员原归属机构编号"></el-input>
				</el-form-item> 
				<el-form-item label="是否私人加入0否1是" prop="isPri">
					<el-input v-model="editForm.isPri" placeholder="是否私人加入0否1是"></el-input>
				</el-form-item> 
				<el-form-item label="排序号--从1开始" prop="seqNo">
					<el-input-number v-model="editForm.seqNo" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="项目编号" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="项目编号"></el-input>
				</el-form-item> 
				<el-form-item label="产品编号" prop="productId">
					<el-input v-model="editForm.productId" placeholder="产品编号"></el-input>
				</el-form-item> 
				<el-form-item label="0-项目，1-产品" prop="pgClass">
					<el-input v-model="editForm.pgClass" placeholder="0-项目，1-产品"></el-input>
				</el-form-item> 
				<el-form-item label="原归属机构名称" prop="obranchName">
					<el-input v-model="editForm.obranchName" placeholder="原归属机构名称"></el-input>
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
						//{ required: true, message: '团队编号不能为空', trigger: 'blur' }
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
			//新增、编辑提交XmProjectGroupUser xm_project_group_user父组件监听@submit="afterEditSubmit"
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