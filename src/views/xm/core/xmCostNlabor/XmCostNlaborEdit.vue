<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmCostNlabor 项目实际人工成本费用--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				 <el-form-item label="项目编号" prop="projectId">
					<el-input v-model="editForm.projectId" placeholder="项目编号" :maxlength="50" disabled></el-input>
				</el-form-item>   
				<el-form-item label="费用主责" prop="username">
					<el-input v-model="editForm.username" placeholder="费用主责" ></el-input>
				</el-form-item>   
				<el-form-item label="用途说明" prop="remark">
					<el-input v-model="editForm.remark" placeholder="用途说明" ></el-input>
				</el-form-item>    
				<el-form-item label="实际金额" prop="actAt">
					<el-input v-model="editForm.budgetAt" placeholder="实际金额" :maxlength="10"></el-input>
				</el-form-item> 
				<el-form-item label="成本科目" prop="subjectId">
					<mdp-select item-code="projectSubject" placeholder="科目编号" v-model="editForm.subjectId"> 
					</mdp-select>
				</el-form-item>    
				<el-form-item label="发生日期" prop="bizDate">
					<el-date-picker 
						v-model="editForm.bizDate"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="选择日期">
					</el-date-picker> 
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
 	import { initDicts, addXmCostNlabor,editXmCostNlabor } from '@/api/xm/core/xmCostNlabor';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'xmCostNlaborEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['xmCostNlabor','visible','opType','selProject'],

		watch: {
	      'xmCostNlabor':function( xmCostNlabor ) {
	        if(xmCostNlabor){
	            this.editForm = {...xmCostNlabor};
	        }

	      },
	      'visible':function(visible) { 
	      	if(visible==true){
 	      		this.initData()
	      	}
	      },
	      'editForm.subjectId':function(subjectId) { 
	      	var dicts=this.dicts.projectSubject.filter(i=>i.id==subjectId)
			if( dicts!=null && dicts.length>0 ){
				 this.editForm.subjectName=dicts[0].name
			}else{
				this.editForm.subjectName="";
			}
		 } 
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{
					projectSubject:[],
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					subjectId: [
						{ required: true, message: '科目不能为空', trigger: 'change' }
					], 
					username: [
						{ required: true, message: '姓名不能为空', trigger: 'change' }
					],  
					actAt: [
						{ required: true, message: '金额不能为空', trigger: 'change' }
					],
					
					remark: [
						{ required: true, message: '用途说明不能为空', trigger: 'change' }
					]
				},
				editForm: {
					projectId:'',userid:'',ctime:'',sendTime:'',username:'',projectName:'',remark:'',id:'',taskId:'',taskName:'',subjectId:'',bizSdate:'',bizEdate:'',actAt:'',costType:'',bizMonth:'',bizDate:'',subjectName:'',ubranchId:'',branchId:''
				},
                maxTableHeight:300,
			}//end return
		},//end data
		methods: {

		    ...util,

			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交XmCostNlabor 项目实际人工成本费用父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmCostNlabor
							if(this.currOpType=='edit'){
							    func=editXmCostNlabor
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
                                this.$notify({ position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                            }).catch( err =>this.load.edit=false);
						});
					}else{
					    this.$notify({ showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.xmCostNlabor){
                    this.editForm = Object.assign({},this.xmCostNlabor);
                }

                if(this.opType=='edit'){

                }else{
					if(this.selProject && this.selProject.id){
						this.editForm.projectId=this.selProject.id
						this.editForm.projectName=this.selProject.name 
					}
                }
            },

		},//end method
		mounted() {
		    this.$nextTick(() => {
                initDicts(this);
                this.initData()
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
            });
		}
	}

</script>

<style scoped>

</style>