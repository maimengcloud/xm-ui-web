<template>
	<section> 
		<el-row  ref="table">
		<!--编辑界面 Branch 管理端机构表（机构下面若干部门）--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="机构编号" prop="id"  v-if="opType==='add'">
					<el-input v-model="editForm.id" placeholder="机构编号，如果不填写将后台自动生成" :maxlength="50" :disabled="!!branch.id"></el-input>
					<br><font color="red">机构号将作为该机构的管理员登录账号</font>
				</el-form-item> 
				<el-form-item label="机构名称" prop="branchName">
					<el-input v-model="editForm.branchName" placeholder="机构名称" :maxlength="50">
						<template slot="prepend" v-if="opType==='edit'">
							{{editForm.id}}
						</template>
					</el-input>
				</el-form-item> 
				<el-form-item label="是否可用" prop="enabled" v-if="opType==='edit'"> 
					<el-select v-model="editForm.enabled">
						<el-option v-for="(item,index) in dicts['enabled']" :value="item.id" :label="item.name" :key="index"></el-option>
					</el-select>
				</el-form-item> 
				<el-form-item label="行业分类" prop="industryCategory"> 
					<el-select v-model="editForm.industryCategory">
						<el-option v-for="(item,index) in dicts['industryCategory']" :value="item.id" :label="item.name" :key="index"></el-option>
					</el-select>
 				</el-form-item> 
				<el-form-item label="创建日期" prop="cdate" v-if="opType==='edit'">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.cdate"  value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"></el-date-picker>
				</el-form-item>  
				<el-form-item label="联系人姓名" prop="lusername"> 
						<el-input v-model="editForm.lusername" placeholder="联系人姓名" :maxlength="255"></el-input> 
				</el-form-item>  
				<el-form-item label="联系电话" prop="lphoneNo">
					<el-input v-model="editForm.lphoneNo" placeholder="联系电话" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="联系邮箱" prop="emaill">
					<el-input v-model="editForm.emaill" placeholder="联系邮箱" :maxlength="50"></el-input>
				</el-form-item>   
				<el-form-item label="管理员" prop="admUserid">
					
 					账号:&nbsp;<font style="font-size:10px;">{{editForm.admUserid}}</font> &nbsp; &nbsp;名称：&nbsp; <font style="font-size:10px;">{{editForm.admUsername}} </font>&nbsp;登录密码：<font style="font-size:10px;">{{opType==='add'?'888888':'*****'}}</font>
					<br><font color="blue">管理员账户具有最高权限，仅作为内部管理权限使用，账户编号与机构号相同，不可修改</font>
				</el-form-item> 
				<el-form-item label="公司地址" prop="address" v-if="opType==='edit'">
					<el-input v-model="editForm.address" placeholder="公司地址" :maxlength="255"></el-input>
				</el-form-item> 
			</el-form>
		</el-row>

		<el-row>
		    <el-button @click.native="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click.native="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	</section>
</template>

<script>
	import util from '@/common/js/util';//全局公共库
	import config from "@/common/config"; //全局公共库import
 	import { initDicts, addBranch,editBranch } from '@/api/mdp/sys/branch';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'branchEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['branch','visible','opType'],

		watch: {
	      'branch':function( branch ) {
	        if(branch){
	            this.editForm = {...branch};
	        }

	      },
		 'editForm.id':function( val ) { 
	            this.editForm.admUserid =val;
	      },
		 'editForm.branchName':function( val ) { 
	            this.editForm.admUsername =val+'管理员';
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
				dicts:{
					industryCategory:[],
					enabled:[],
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: { 
					branchName: [
						{ required: true, message: '机构名称不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					id:'',branchName:'',enabled:'',industryCategory:'',cuserid:'',cdate:'',cusername:'',lphoneNo:'',emaill:'',bizProcInstId:'',bizFlowState:'',pbranchId:'',admUserid:'',admUsername:'',lusername:'',luserid:'',address:''
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
			//新增、编辑提交Branch 管理端机构表（机构下面若干部门）父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addBranch
							if(this.currOpType=='edit'){
							    func=editBranch
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
			    if(this.branch){
                    this.editForm = Object.assign({},this.branch);
                }

                if(this.opType=='edit'){

                }else{
					this.editForm.cuserid=this.userInfo.userid
					this.editForm.cusername=this.userInfo.username
					this.editForm.luserid=this.userInfo.userid
					this.editForm.lusername=this.userInfo.username
					this.editForm.lphoneNo=this.userInfo.phoneno
					this.editForm.email=this.userInfo.email
					this.editForm.enabled="0"
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