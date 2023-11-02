<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 Module 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问--> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef"> 
				<el-form-item label="模块编号" prop="id" v-if="opType==='add'">
					<el-input v-model="editForm.id" placeholder="模块编号" :maxlength="50"></el-input>
				</el-form-item> 
				<el-form-item label="模块名称"> 
					<el-form-item label="" prop="name" label-width="1px">
						<el-input v-model="editForm.name" placeholder="模块名称" :maxlength="50">
							<template slot="prepend" >
								<span v-if="opType==='edit'"> {{editForm.id}}</span>
							</template>
						</el-input>
					</el-form-item>  
				</el-form-item> 
				<el-form-item label="计费模式" prop="billMode">  
					<mdp-select show-style="tag" item-code="moduleBillMode" v-model="editForm.billMode"/>  
 				</el-form-item>  
				<el-form-item label="人均费用" prop="uniFee" v-if="editForm.billMode=='1' ||editForm.billMode=='3'">
					<el-input v-model="editForm.uniFee" placeholder="人均费用" :maxlength="10">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>  
				<el-form-item label="模块费用" prop="fee"  v-if="editForm.billMode=='2'">
					<el-input v-model="editForm.fee" placeholder="模块费用" :maxlength="10">
						<template slot="append">元</template>
					</el-input>
				</el-form-item>  
				<el-form-item label="人数折扣"  v-if="editForm.billMode!=='0'">
					<el-input  type="textarea"  :rows="4" v-model="discount.userNum" placeholder="" :maxlength="255"></el-input> 
					<br><font  color="blue">请输入人数折扣规则： 格式 开始人数-结束人数&nbsp;:&nbsp;折扣率 &nbsp;折扣率1-100之间，100代表不打折</font>
					<br><font  color="blue">例子：一行代表一个规则</font>
					<br><font  color="blue">0-20:100</font> 
					<br><font  color="blue">20-50:95</font>
					<br><font  color="blue">50-100:90</font>
				</el-form-item> 
				
				<el-form-item label="月份折扣"  v-if="editForm.billMode!=='0'">
					<el-input  type="textarea"  :rows="4" v-model="discount.year" placeholder="" :maxlength="255"></el-input> 
					<br><font  color="blue">请输入月数折扣规则： 格式 购买年数&nbsp;:&nbsp;折扣率 &nbsp;折扣率1-100之间，100代表不打折</font>
					<br><font  color="blue">例子：一行代表一个规则</font>
					<br><font  color="blue">1:100</font> 
					<br><font  color="blue">2:80</font>
					<br><font  color="blue">3:60</font>
				</el-form-item> 
				<el-form-item label="匹配的url" prop="url">
					<el-input  type="textarea"  :rows="4" v-model="editForm.url" placeholder="匹配的url,如果匹配得到，则计费，以逗号分割多个" :maxlength="255"></el-input>
					<br><font  color="blue">比如 /mdp/xm/**  代表前缀为mdp/xm的所有请求都登记到本模块下。*代表一个字符，**代表多个任意字符包括多级路径</font>
				</el-form-item> 
				<el-form-item label="忽略url" prop="ignoreUrl">
					<el-input  type="textarea"  :rows="4" v-model="editForm.ignoreUrl" placeholder="匹配这个地址的不计费" :maxlength="255"></el-input>
					<br><font color="blue">比如 /mdp/xm/xxx/**  代表前缀为/mdp/xm/xxx 的所有请求都不进行登记. *代表一个字符，**代表多个任意字符包括多级路径</font>
				</el-form-item> 
				<el-form-item label="审核状态" prop="bizFlowState">
					<mdp-select show-style="tag" item-code="bizFlowState" v-model="scope.row.status" :disabled="true"></mdp-select> 
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
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
 	import {  addModule,editModule } from '@/api/mdp/sys/module';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'moduleEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['module','visible','opType'],

		watch: {
	      'module':function( module ) {
	        if(module){
	            this.editForm = {...module};
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
				dicts:{
					moduleBillMode:[],
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					id:'',name:'',fee:'',billMode:'',uniFee:'',discount:'',url:'',ignoreUrl:'',bizFlowState:'',procInstId:''
				},
				discount:{
					year: "1:100\n2:80\n3:60",
					userNum: "0-10:100\n10-50:98\n50-100:95"
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
			//新增、编辑提交Module 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							let params = Object.assign({}, this.editForm); 
							params.discount=JSON.stringify(this.discount)
							var func=addModule
							if(this.currOpType=='edit'){
							    func=editModule
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
			    if(this.module){
                    this.editForm = Object.assign({},this.module);
                }

                if(this.opType=='edit'){
					
                }else{

                }
				;
				if(this.editForm.discount){
					this.discount=JSON.parse(this.editForm.discount)
				}
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