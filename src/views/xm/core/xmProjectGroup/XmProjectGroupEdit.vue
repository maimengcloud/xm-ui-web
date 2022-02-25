<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main">
		<!--编辑界面 XmProjectGroup xm_project_group--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键"></el-input>
				</el-form-item> 
				<el-form-item label="团队名称" prop="groupName">
					<el-input v-model="editForm.groupName" placeholder="团队名称"></el-input>
				</el-form-item> 
				<el-form-item label="项目编号-属于产品线则可为空" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="项目编号-属于产品线则可为空"></el-input>
				</el-form-item> 
				<el-form-item label="项目团队类型编号" prop="pgTypeId">
					<el-input v-model="editForm.pgTypeId" placeholder="项目团队类型编号"></el-input>
				</el-form-item> 
				<el-form-item label="团队类型名称" prop="pgTypeName">
					<el-input v-model="editForm.pgTypeName" placeholder="团队类型名称"></el-input>
				</el-form-item> 
				<el-form-item label="团队负责人" prop="leaderUserid">
					<el-input v-model="editForm.leaderUserid" placeholder="团队负责人"></el-input>
				</el-form-item> 
				<el-form-item label="负责人姓名" prop="leaderUsername">
					<el-input v-model="editForm.leaderUsername" placeholder="负责人姓名"></el-input>
				</el-form-item> 
				<el-form-item label="创建时间" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="更新时间" prop="ltime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ltime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="产品编号，属于项目组的团队则可为空" prop="productId">
					<el-input v-model="editForm.productId" placeholder="产品编号，属于项目组的团队则可为空"></el-input>
				</el-form-item> 
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构编号"></el-input>
				</el-form-item> 
				<el-form-item label="团队类别0项目1产品" prop="pgClass">
					<el-input v-model="editForm.pgClass" placeholder="团队类别0项目1产品"></el-input>
				</el-form-item> 
				<el-form-item label="上级团队编号" prop="pgroupId">
					<el-input v-model="editForm.pgroupId" placeholder="上级团队编号"></el-input>
				</el-form-item> 
				<el-form-item label="级别0级1级2级3级4级" prop="lvl">
					<el-input-number v-model="editForm.lvl" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="上级编号路径逗号分割,0,开始，本组编号+逗号结束" prop="pidPaths">
					<el-input v-model="editForm.pidPaths" placeholder="上级编号路径逗号分割,0,开始，本组编号+逗号结束"></el-input>
				</el-form-item> 
				<el-form-item label="是否为模板" prop="isTpl">
					<el-input v-model="editForm.isTpl" placeholder="是否为模板"></el-input>
				</el-form-item> 
				<el-form-item label="副组长编号" prop="assUserid">
					<el-input v-model="editForm.assUserid" placeholder="副组长编号"></el-input>
				</el-form-item> 
				<el-form-item label="副组长姓名" prop="assUsername">
					<el-input v-model="editForm.assUsername" placeholder="副组长姓名"></el-input>
				</el-form-item> 
				<el-form-item label="下级团队数量" prop="childrenCnt">
					<el-input-number v-model="editForm.childrenCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="组员数量" prop="userCnt">
					<el-input-number v-model="editForm.userCnt" :min="0" :max="200"></el-input-number>
				</el-form-item> 
				<el-form-item label="权限码" prop="qxCode">
					<el-input v-model="editForm.qxCode" placeholder="权限码"></el-input>
				</el-form-item> 
				<el-form-item label="是否计算工作量0否1是" prop="calcWorkload">
					<el-input v-model="editForm.calcWorkload" placeholder="是否计算工作量0否1是"></el-input>
				</el-form-item> 
				<el-form-item label="节点类型0管理团队、1执行团队" prop="ntype">
					<el-input v-model="editForm.ntype" placeholder="节点类型0管理团队、1执行团队"></el-input>
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
	import { addXmProjectGroup,editXmProjectGroup } from '@/api/xm/core/xmProjectGroup';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmProjectGroupEdit',
	    components: {

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
					id:'',groupName:'',projectId:'',pgTypeId:'',pgTypeName:'',leaderUserid:'',leaderUsername:'',ctime:'',ltime:'',productId:'',branchId:'',pgClass:'',pgroupId:'',lvl:'',pidPaths:'',isTpl:'',assUserid:'',assUsername:'',childrenCnt:'',userCnt:'',qxCode:'',calcWorkload:'',ntype:''
				},

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