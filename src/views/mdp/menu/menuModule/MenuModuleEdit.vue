<template>
	<section  class="page-container padding">
	    <el-row class="page-header">
	    </el-row>
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 MenuModule 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问--> 
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
				
				<el-form-item label="模块分类" prop="mcate"> 
					<el-select v-model="editForm.mcate">
						<el-option v-for="(item,index) in dicts['mcate']" :value="item.id" :label="item.name" :key="index"></el-option>
					</el-select>
 				</el-form-item> 
				<el-form-item label="计费模式" prop="billMode"> 
					<el-select v-model="editForm.billMode">
						<el-option v-for="(item,index) in dicts['moduleBillMode']" :value="item.id" :label="item.name" :key="index"></el-option>
					</el-select>
 				</el-form-item>  
				<el-form-item label="人天费用" prop="uniFee" v-if="editForm.billMode=='1' ||editForm.billMode=='3'">
					<el-input v-model="editForm.uniFee" placeholder="人天费用" :maxlength="10">
						<template slot="append">元每人每天</template>
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
				
				<el-form-item label="天数折扣"  v-if="editForm.billMode!=='0'">
					<el-input  type="textarea"  :rows="4" v-model="discount.days" placeholder="" :maxlength="255"></el-input> 
					<br><font  color="blue">请输入天数折扣规则： 格式 购买开始天数-结束天数&nbsp;:&nbsp;折扣率 &nbsp;折扣率1-100之间，100代表不打折</font>
					<br><font  color="blue">例子：一行代表一个规则</font>
					<br><font  color="blue">0-90:100</font> 
					<br><font  color="blue">90-180:90</font>
					<br><font  color="blue">180-360:80</font>
				</el-form-item> 
				<!--
				<el-form-item label="匹配的url" prop="url">
					<el-input  type="textarea"  :rows="4" v-model="editForm.url" placeholder="匹配的url,如果匹配得到，则计费，以逗号分割多个" :maxlength="255"></el-input>
					<br><font  color="blue">比如 /mdp/xm/**  代表前缀为mdp/xm的所有请求都登记到本模块下。*代表一个字符，**代表多个任意字符包括多级路径</font>
				</el-form-item> 
				<el-form-item label="忽略url" prop="ignoreUrl">
					<el-input  type="textarea"  :rows="4" v-model="editForm.ignoreUrl" placeholder="匹配这个地址的不计费" :maxlength="255"></el-input>
					<br><font color="blue">比如 /mdp/xm/xxx/**  代表前缀为/mdp/xm/xxx 的所有请求都不进行登记. *代表一个字符，**代表多个任意字符包括多级路径</font>
				</el-form-item> 
				-->
				<el-form-item label="审核状态" prop="bizFlowState">
					<el-tag v-for="(item,index) in formatDictsWithClass(dicts,'bizFlowState',editForm.bizFlowState)" :key="index" :type="item.className">{{item.name}}</el-tag>
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
 	import { initDicts, addMenuModule,editMenuModule } from '@/api/mdp/menu/menuModule';
	import { mapGetters } from 'vuex'
	
	export default {
	    name:'menuModuleEdit',
	    components: {

        },
		computed: {
		    ...mapGetters([ 'userInfo'  ]),

		},
		props:['menuModule','visible','opType'],

		watch: {
	      'menuModule':function( menuModule ) {
	        if(menuModule){
	            this.editForm = {...menuModule};
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
					bizFlowState:[],
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					id:'',name:'',fee:'',billMode:'',uniFee:'',discount:'',url:'',ignoreUrl:'',bizFlowState:'',procInstId:'',status:'',mcate:'',logoUrl:'',feeDesc:'',udisRate:'',udis:'',saleDesc:''
				},
                maxTableHeight:300,
				
				discount:{
					days: "0-90:100\n90-180:90\n180-360:80",
					userNum: "0-10:100\n10-50:98\n50-100:95"
				},
			}//end return
		},//end data
		methods: {

		    ...util,

			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交MenuModule 模块定义表-用于进行机构级别的权限控制，机构如果购买了模块，则能够进行访问父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.edit=true
							this.editForm.discount = JSON.stringify(this.discount);
							let params = Object.assign({}, this.editForm);
							var func=addMenuModule
							if(this.currOpType=='edit'){
							    func=editMenuModule
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
			    if(this.menuModule){
                    this.editForm = Object.assign({},this.menuModule);
                }

                if(this.opType=='edit'){
					
                }else{

                }
				
				if(this.editForm.discount){
					this.discount=JSON.parse(this.editForm.discount)
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