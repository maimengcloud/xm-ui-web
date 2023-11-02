<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 UserFocus 我关注的项目或者任务--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="用户编号" prop="userid">
					<el-input v-model="editForm.userid" placeholder="用户编号" :maxlength="50" @change="editSomeFields(editForm,'userid',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="用户名称" prop="username">
					<el-input v-model="editForm.username" placeholder="用户名称" :maxlength="255" @change="editSomeFields(editForm,'username',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="关注的对象主键" prop="bizId">
					<el-input v-model="editForm.bizId" placeholder="关注的对象主键" :maxlength="50" @change="editSomeFields(editForm,'bizId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代-6/团队-7/组织-8/个人-9/文章-W/合同-H/客户-K" prop="focusType">
					<el-input v-model="editForm.focusType" placeholder="对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代-6/团队-7/组织-8/个人-9/文章-W/合同-H/客户-K" :maxlength="1" @change="editSomeFields(editForm,'focusType',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号" prop="pbizId">
					<el-input v-model="editForm.pbizId" placeholder="对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号" :maxlength="50" @change="editSomeFields(editForm,'pbizId',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="任务名称" prop="bizName">
					<el-input v-model="editForm.bizName" placeholder="任务名称" :maxlength="250" @change="editSomeFields(editForm,'bizName',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="对象上级名称" prop="pbizName">
					<el-input v-model="editForm.pbizName" placeholder="对象上级名称" :maxlength="255" @change="editSomeFields(editForm,'pbizName',$event)"></el-input>
				</el-form-item> 
				<el-form-item label="关注时间" prop="ftime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.ftime"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item> 
				<el-form-item label="用户归属机构" prop="ubranchId">
					<el-input v-model="editForm.ubranchId" placeholder="用户归属机构" :maxlength="50" @change="editSomeFields(editForm,'ubranchId',$event)"></el-input>
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
 	import {  addUserFocus,editUserFocus,editSomeFieldsUserFocus } from '@/api/mdp/sys/userFocus';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'userFocusEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['userFocus','visible','opType'],

		watch: {
	      'userFocus':function( userFocus ) {
	        if(userFocus){
	            this.editForm = {...userFocus};
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
					userid: [
						//{ required: true, message: '用户编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					userid:'',username:'',bizId:'',focusType:'',pbizId:'',bizName:'',pbizName:'',ftime:'',ubranchId:''
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
			//新增、编辑提交UserFocus 我关注的项目或者任务父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addUserFocus
							if(this.currOpType=='edit'){
							    func=editUserFocus
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
			    if(this.userFocus){
                    this.editForm = Object.assign({},this.userFocus);
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
                params['pkList']=[row].map(i=>{ return { userid:i.userid,  bizId:i.bizId,  pbizId:i.pbizId}})
                params[fieldName]=$event
                var func = editSomeFieldsUserFocus
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