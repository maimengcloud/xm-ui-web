<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 Coop 商务合作申请--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="主键" prop="id">
					<el-input v-model="editForm.id" placeholder="主键" :maxlength="50" @change="editSomeFields(editForm,'id',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="用户编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="用户编号" :maxlength="50" @change="editSomeFields(editForm,'userid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="用户名称" prop="username">
					<el-input v-model="editForm.username" placeholder="用户名称" :maxlength="255" @change="editSomeFields(editForm,'username',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="公司编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="公司编号" :maxlength="50" @change="editSomeFields(editForm,'branchId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="公司名称" prop="branchName">
					<el-input v-model="editForm.branchName" placeholder="公司名称" :maxlength="255" @change="editSomeFields(editForm,'branchName',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email" placeholder="邮箱" :maxlength="50" @change="editSomeFields(editForm,'email',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="电话" prop="phoneno">
					<el-input v-model="editForm.phoneno" placeholder="电话" :maxlength="50" @change="editSomeFields(editForm,'phoneno',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="合作要求" prop="remark">
					<el-input v-model="editForm.remark" placeholder="合作要求" :maxlength="255" @change="editSomeFields(editForm,'remark',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="状态0-初始，1-申请中，2-进行中，3-已结束" prop="status">
					<el-input v-model="editForm.status" placeholder="状态0-初始，1-申请中，2-进行中，3-已结束" :maxlength="1" @change="editSomeFields(editForm,'status',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="申请日期" prop="ctime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ctime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="根进人编号" prop="replyUserid">
					<el-input v-model="editForm.replyUserid" placeholder="根进人编号" :maxlength="50" @change="editSomeFields(editForm,'replyUserid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="跟进人姓名" prop="replyUsername">
					<el-input v-model="editForm.replyUsername" placeholder="跟进人姓名" :maxlength="255" @change="editSomeFields(editForm,'replyUsername',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="跟进时间" prop="replyTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.replyTime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="合作类型1-项目合作，2-广告合作，3-服务商入驻，4-校企合作" prop="bizType">
					<el-input v-model="editForm.bizType" placeholder="合作类型1-项目合作，2-广告合作，3-服务商入驻，4-校企合作" :maxlength="1" @change="editSomeFields(editForm,'bizType',$event)"></el-input>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row v-if="opType=='add'" class="page-bottom bottom-fixed">
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
 	import {  addCoop,editCoop,editSomeFieldsCoop } from '@/api/mdp/biz/coop';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'coopEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['coop','visible','opType'],

		watch: {
	      'coop':function( coop ) {
	        if(coop){
	            this.editForm = {...coop};
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
					id:'',userid:'',username:'',branchId:'',branchName:'',email:'',phoneno:'',remark:'',status:'',ctime:'',replyUserid:'',replyUsername:'',replyTime:'',bizType:''
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
			//新增、编辑提交Coop 商务合作申请父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addCoop
							if(this.currOpType=='edit'){
							    func=editCoop
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
			    if(this.coop){
                    this.editForm = Object.assign({},this.coop);
                }

                if(this.opType=='edit'){

                }else{

                }
                this.editFormBak={...this.editForm}
            },

            editSomeFields(row,fieldName,$event){
                if(this.opType=='add'){
                    return;
                }
                let params={};
                params['ids']=[row].map(i=>i.id)
                params[fieldName]=$event
                var func = editSomeFieldsCoop
                func(params).then(res=>{
                  let tips = res.data.tips;
                  if(tips.isOk){
                    this.editFormBak=[...this.editForm]
                  }else{
                    Object.assign(this.editForm,this.editFormBak)
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                  }
                }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
            },
		},//end method
		mounted() {
		    this.$nextTick(() => {
                
                this.initData()
                this.maxTableHeight = util.calcTableMaxHeight(this.$refs.table.$el)
            });
		}
	}

</script>

<style scoped>

</style>